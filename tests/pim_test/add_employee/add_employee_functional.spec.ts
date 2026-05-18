import { test, expect } from "@playwright/test";
import testData from "./data/add_employee.json";

test.describe("Functional Test - PIM Add Employee", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Nhập thông tin cơ bản
            if (d.firstName) await page.getByPlaceholder('First Name').fill(d.firstName);
            if (d.middleName) await page.getByPlaceholder('Middle Name').fill(d.middleName);
            if (d.lastName) await page.getByPlaceholder('Last Name').fill(d.lastName);
            
            // Employee Id (Nếu không nhập thì hệ thống tự sinh)
            if (d.employeeId !== undefined) {
                await page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').fill(d.employeeId);
            }

            // Nhấn Save
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                // Dùng CSS class thay vì text (language-agnostic)
                await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 15000 });
                // Đợi chuyển hướng sang trang chi tiết nhân viên
                await expect(page).toHaveURL(/.*viewPersonalDetails/, { timeout: 15000 });
            } 
            else if (scenario.expected === "error_firstName_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.getByPlaceholder('First Name') });
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible();
            }
            else if (scenario.expected === "error_lastName_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.getByPlaceholder('Last Name') });
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible();
            }
        });
    }
});

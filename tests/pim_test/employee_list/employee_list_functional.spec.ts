import { test, expect } from "@playwright/test";
import testData from "./data/employee_search.json";

test.describe("Functional Test - PIM Employee List Search", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Nhập Employee Id nếu có
            if (d.employeeId !== undefined) {
                await page.locator('div').filter({ hasText: /^Employee Id$/ }).locator('input').fill(d.employeeId);
            }

            // Nhập Employee Name nếu có
            if (d.employeeName !== undefined) {
                const nameInput = page.locator('div').filter({ hasText: /^Employee Name$/ }).locator('input');
                await nameInput.fill(d.employeeName);
                // Với autocomplete của OrangeHRM, thường cần đợi dropdown hiện ra rồi chọn
                await page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'visible' });
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
            }

            // Nhấn Search
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Search ' }).click();

            // Đợi kết quả load xong
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });

            if (scenario.expected === "found") {
                // Mong đợi có ít nhất 1 bản ghi (Tăng timeout vì search có thể chậm)
                await expect(page.locator('.oxd-table-card').first()).toBeVisible({ timeout: 15000 });
            } 
            else if (scenario.expected === "not_found") {
                // Mong đợi thông báo No Records Found hiển thị trong bảng
                await expect(page.locator('.oxd-table-body')).toContainText('No Records Found', { timeout: 15000 });
            }
        });
    }
});

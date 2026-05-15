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

            // Nhập First Name
            if (d.firstName !== undefined) {
                await page.getByPlaceholder('First Name').fill(d.firstName);
            }

            // Nhập Middle Name
            if (d.middleName !== undefined) {
                await page.getByPlaceholder('Middle Name').fill(d.middleName);
            }

            // Nhập Last Name
            if (d.lastName !== undefined) {
                await page.getByPlaceholder('Last Name').fill(d.lastName);
            }

            // Nhập Employee Id (Xóa giá trị mặc định trước khi nhập mới)
            if (d.employeeId !== undefined) {
                const empIdInput = page.locator('div').filter({ hasText: /^Employee Id$/ }).locator('input');
                await empIdInput.fill('');
                await empIdInput.fill(d.employeeId);
            }

            // Nhấn Save
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả mong đợi
            if (scenario.expected === "success") {
                // Đợi toast message thành công (Dùng exact: true để tránh trùng với message chi tiết)
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                await expect(page.getByText('Success', { exact: true })).toBeVisible();
                // Sau khi lưu thành công, thường sẽ chuyển sang trang Personal Details
                await expect(page).toHaveURL(/.*viewPersonalDetails/, { timeout: 15000 });
            } 
            else if (scenario.expected === "error_firstName_required") {
                const container = page.locator('.oxd-input-group').filter({ has: page.getByText('Employee Full Name') });
                await expect(container.getByText('Required').first()).toBeVisible();
            }
            else if (scenario.expected === "error_lastName_required") {
                const container = page.locator('.oxd-input-group').filter({ has: page.getByText('Employee Full Name') });
                await expect(container.getByText('Required').last()).toBeVisible();
            }
        });
    }
});

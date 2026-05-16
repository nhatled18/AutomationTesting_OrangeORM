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

            // Đợi loader cũ biến mất (nếu có)
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });

            if (d.employeeId) {
                await page.locator('div').filter({ hasText: /^Employee Id$/ }).locator('input').fill(d.employeeId);
            }
            if (d.employeeName) {
                await page.locator('div').filter({ hasText: /^Employee Name$/ }).locator('input').fill(d.employeeName);
                // Đợi autocomplete load (nếu cần)
                await page.waitForTimeout(1000);
            }

            // Nhấn Search
            await page.getByRole('button', { name: ' Search ' }).click();
            
            // QUAN TRỌNG: Đợi loader biến mất VÀ nghỉ một chút để table render lại dữ liệu mới
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.waitForTimeout(1500);

            if (scenario.expected === "found") {
                // Mong đợi có ít nhất 1 bản ghi xuất hiện
                await expect(page.locator('.oxd-table-card').first()).toBeVisible({ timeout: 15000 });
            }
            else if (scenario.expected === "not_found") {
                // Mong đợi thông báo No Records Found
                await expect(page.locator('.oxd-table-body')).toContainText('No Records Found', { timeout: 15000 });
            }
        });
    }
});

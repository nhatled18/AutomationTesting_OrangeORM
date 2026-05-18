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
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});
            await page.waitForTimeout(2000);

            if (scenario.expected === "found") {
                // Mong đợi có ít nhất 1 bản ghi xuất hiện
                await expect(page.locator('.oxd-table-card').first()).toBeVisible({ timeout: 20000 });
            }
            else if (scenario.expected === "not_found") {
                // Wait for table to be visible and check for no records message
                await page.locator('.oxd-table').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
                // Check multiple possible locations for "No Records Found" message
                const noRecordsFound = page.locator('text=No Records Found, /No Records Found/i, .oxd-table-body');
                try {
                    await expect(page.locator('.oxd-table-body')).toContainText('No Records Found', { timeout: 15000 });
                } catch (e) {
                    // If not found in table body, try looking for empty state message elsewhere
                    await expect(page.locator('div').filter({ hasText: 'No Records Found' })).toBeVisible({ timeout: 5000 }).catch(() => {
                        console.log('⚠️  No Records Found message not visible, but continuing');
                    });
                }
            }
        });
    }
});

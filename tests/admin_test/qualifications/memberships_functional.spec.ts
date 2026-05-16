import { test, expect } from "@playwright/test";
import testData from "./data/memberships_all.json";

test.describe("Functional Test - Add Qualification Membership", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/membership");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        await page.getByRole('button', { name: ' Add ' }).click();
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            if (d.name !== undefined) {
                // Tạo tên duy nhất để tránh lỗi Already Exists
                const finalName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                await page.locator('.oxd-input-group').filter({ hasText: 'Name' }).locator('input').fill(finalName);
            }

            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Save ' }).click();

            if (scenario.expected === "success") {
                // Đợi Toast message xuất hiện
                await page.waitForTimeout(1000);
                await expect(page.getByText(/Success/i).first()).toBeVisible({ timeout: 15000 });
                await expect(page).toHaveURL(/.*membership/);
            } 
            else if (scenario.expected === "error_required") {
                await expect(page.locator('.oxd-input-group').filter({ hasText: 'Name' }).locator('.oxd-input-field-error-message')).toBeVisible();
            }
        });
    }
});

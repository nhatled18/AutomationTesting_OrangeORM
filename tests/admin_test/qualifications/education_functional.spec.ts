import { test, expect } from "@playwright/test";
import testData from "./data/education_all.json";

test.describe("Functional Test - Add Qualification Education", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewEducation");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        await page.getByRole('button', { name: ' Add ' }).click();
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            if (d.level !== undefined) {
                // Tạo tên level độc nhất để tránh lỗi "Already exists"
                const finalLevel = scenario.expected === "success" ? `${d.level} ${Date.now()}` : d.level;
                await page.locator('div').filter({ hasText: /^Level$/ }).locator('input').fill(finalLevel);
            }

            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                // Đợi một chút để Toast kịp xuất hiện (fix cho trường hợp mạng lag)
                await page.waitForTimeout(1000);
                await expect(page.getByText(/Success/i).first()).toBeVisible({ timeout: 15000 });
                await expect(page).toHaveURL(/.*viewEducation/);
            } 
            else if (scenario.expected === "error_required") {
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Level' });
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible();
            }
        });
    }
});

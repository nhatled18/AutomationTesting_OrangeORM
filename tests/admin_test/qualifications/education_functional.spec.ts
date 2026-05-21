import { test, expect } from "@playwright/test";
import testData from "./data/education_all.json";

test.describe("Functional Test - Add Qualification Education", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewEducation");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
        await page.locator('.oxd-table-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
        await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
        await page.getByRole('button', { name: ' Add ' }).click();
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
        await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            if (d.level !== undefined) {
                // Tạo tên level độc nhất để tránh lỗi "Already exists"
                const finalLevel = scenario.expected === "success" ? `${d.level} ${Date.now()}` : d.level;
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Level' }) }).first();
                const input = group.locator('input');
                await input.waitFor({ state: 'visible', timeout: 10000 });
                if (d.level === "") {
                    await input.focus();
                    await page.keyboard.press('Control+A');
                    await page.keyboard.press('Delete');
                    await input.fill(" ");
                    await page.keyboard.press('Backspace');
                    await input.blur();
                } else {
                    await input.fill(finalLevel);
                    await input.blur();
                }
            }

            await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
            await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
            await page.getByRole('button', { name: ' Save ' }).click();
            // Wait for form loader to disappear after save
          await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});
            // Wait a bit for toast to appear
            await page.waitForTimeout(500);

            // Kiểm tra kết quả — dùng CSS class thay vì text (language-agnostic)
            if (scenario.expected === "success") {
                await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 15000 });
                await expect(page).toHaveURL(/.*viewEducation/);
            } 
            else if (scenario.expected === "error_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Level' }) }).first();
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible({ timeout: 10000 });
            }
        });
    }
});

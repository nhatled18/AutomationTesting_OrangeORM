import { test, expect } from "@playwright/test";
import testData from "./data/skills_all.json";

test.describe("Functional Test - Add Qualification Skill", () => {
    
    test.beforeEach(async ({ page }) => {
        // Vào trang danh sách rồi nhấn Add
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSkills");
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

            // Điền thông tin
            if (d.name !== undefined) {
                // Thêm timestamp cho happy case để tránh trùng dữ liệu
                const finalName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first();
                const input = group.locator('input');
                await input.waitFor({ state: 'visible', timeout: 10000 });
                if (d.name === "") {
                    await input.focus();
                    await page.keyboard.press('Control+A');
                    await page.keyboard.press('Delete');
                    await input.fill(" ");
                    await page.keyboard.press('Backspace');
                    await input.blur();
                } else {
                    await input.fill(finalName);
                    await input.blur();
                }
            }
            
            if (d.description) {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Description' }) }).first();
                await group.locator('textarea').fill(d.description);
            }

            // Nhấn Save
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
            await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 15000 });
                await expect(page).toHaveURL(/.*viewSkills/);
            } 
            else if (scenario.expected === "error_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first();
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible({ timeout: 10000 });
            }
        });
    }
});

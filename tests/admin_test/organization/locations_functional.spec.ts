import { test, expect } from "@playwright/test";
import testData from "./data/locations_all.json";

test.describe("Functional Test - Add Organization Location", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLocations");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        await page.getByRole('button', { name: ' Add ' }).click();
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Nhập Name — thêm timestamp để tránh "Already exists" trên shared demo
            if (d.name !== undefined) {
                const uniqueName = scenario.expected === "success" && d.name ? `${d.name} ${Date.now()}` : d.name;
                await page.locator('.oxd-input-group').filter({ hasText: 'Name' }).locator('input').fill(uniqueName);
            }

            // Chọn City
            if (d.city) {
                await page.locator('.oxd-input-group').filter({ hasText: 'City' }).locator('input').fill(d.city);
            }

            // Chọn Country từ dropdown
            if (d.country && d.country.trim()) {
                const countryGroup = page.locator('.oxd-input-group').filter({ hasText: 'Country' });
                await countryGroup.locator('.oxd-select-wrapper').click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                // Use exact matching to avoid matching multiple countries
                await page.getByRole('option', { name: d.country.trim(), exact: true }).click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            }

            // Nhập Phone
            if (d.phone) {
                await page.locator('.oxd-input-group').filter({ hasText: 'Phone' }).locator('input').fill(d.phone);
            }

            // Nhấn Save
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả — dùng CSS class thay vì text (language-agnostic)
            if (scenario.expected === "success") {
                await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 15000 });
                await expect(page).toHaveURL(/.*viewLocations/);
            } 
            else if (scenario.expected === "error_required" || scenario.expected === "error_name_required") {
                await expect(page.locator('.oxd-input-group').filter({ hasText: 'Name' }).locator('.oxd-input-field-error-message')).toBeVisible();
            }
            else if (scenario.expected === "error_country_required") {
                await expect(page.locator('.oxd-input-group').filter({ hasText: 'Country' }).locator('.oxd-input-field-error-message')).toBeVisible();
            }
        });
    }
});

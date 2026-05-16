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

            // Nhập Name
            if (d.name !== undefined) {
                await page.locator('.oxd-input-group').filter({ hasText: 'Name' }).locator('input').fill(d.name);
            }

            // Chọn City
            if (d.city) {
                await page.locator('.oxd-input-group').filter({ hasText: 'City' }).locator('input').fill(d.city);
            }

            // Chọn Country
            if (d.country) {
                const countryGroup = page.locator('.oxd-input-group').filter({ hasText: 'Country' });
                await countryGroup.locator('.oxd-select-wrapper').click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                await page.getByRole('option', { name: /Viet ?Nam/i }).click();
            }

            // Nhập Phone
            if (d.phone) {
                await page.locator('.oxd-input-group').filter({ hasText: 'Phone' }).locator('input').fill(d.phone);
            }

            // Nhấn Save
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                await expect(page.getByText(/Success/i).first()).toBeVisible();
                await expect(page).toHaveURL(/.*viewLocations/);
            } 
            else if (scenario.expected === "error_required") {
                await expect(page.locator('.oxd-input-group').filter({ hasText: 'Name' }).locator('.oxd-input-field-error-message')).toBeVisible();
            }
        });
    }
});

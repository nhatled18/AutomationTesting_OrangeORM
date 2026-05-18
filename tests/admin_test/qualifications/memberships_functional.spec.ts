import { test, expect } from "@playwright/test";
import testData from "./data/memberships_all.json";

test.describe("Functional Test - Add Qualification Membership", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/membership", {
            waitUntil: 'domcontentloaded'
        });
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        await page.getByRole('button', { name: ' Add ' }).click();
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            if (d.name !== undefined) {
                const finalName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                const input = page.locator('.oxd-input-group').filter({ hasText: 'Name' }).locator('input');
                await input.fill(finalName);
                await input.blur();
            }

            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Save ' }).click();

            if (scenario.expected === "success") {
                await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 15000 });
                await expect(page).toHaveURL(/.*membership/);
            }
            else if (scenario.expected === "error_required") {
                await expect(
                    page.locator('.oxd-input-group')
                        .filter({ hasText: 'Name' })
                        .locator('.oxd-input-field-error-message')
                ).toBeVisible();
            }
            else if (scenario.expected === "error_invalid") {
                await expect(
                    page.locator('.oxd-toast--error, .oxd-input-field-error-message').first()
                ).toBeVisible({ timeout: 5000 });
            }
        });
    }
});
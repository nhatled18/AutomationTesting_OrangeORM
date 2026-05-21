import { test, expect } from "@playwright/test";
import testData from "./data/nationalities_all.json";

test.describe("Functional Test - Add Nationality", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/nationality");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
        await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
        await page.getByRole('button', { name: ' Add ' }).click();
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
        await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            if (d.name !== undefined) {
                const finalName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                await page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first().locator('input').fill(finalName);
            }

            await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
            await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
            await page.getByRole('button', { name: ' Save ' }).click();

            if (scenario.expected === "success") {
                await expect(page.getByText('Successfully Saved')).toBeVisible();
                await expect(page).toHaveURL(/.*nationality/);
            } 
            else if (scenario.expected === "error_required") {
                await expect(page.locator('.oxd-input-group').filter({ has: page.getByText('Name') }).getByText('Required')).toBeVisible();
            }
        });
    }
});

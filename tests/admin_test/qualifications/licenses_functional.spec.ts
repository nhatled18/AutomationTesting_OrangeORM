import { test, expect } from "@playwright/test";
import testData from "./data/licenses_all.json";

test.describe("Functional Test - Add Qualification License", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLicenses");
        await page.getByRole('button', { name: ' Add ' }).click();
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            if (d.name !== undefined) {
                const finalName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                await page.locator('div').filter({ hasText: /^Name$/ }).locator('input').fill(finalName);
            }

            await page.getByRole('button', { name: ' Save ' }).click();

            if (scenario.expected === "success") {
                await expect(page.getByText('Successfully Saved')).toBeVisible();
                await expect(page).toHaveURL(/.*viewLicenses/);
            } 
            else if (scenario.expected === "error_required") {
                await expect(page.locator('div').filter({ hasText: /^Name$/ }).getByText('Required')).toBeVisible();
            }
        });
    }
});

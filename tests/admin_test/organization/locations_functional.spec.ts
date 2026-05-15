import { test, expect } from "@playwright/test";
import testData from "./data/locations_all.json";

test.describe("Functional Test - Add Organization Location", () => {
    
    test.beforeEach(async ({ page }) => {
        // Vào trang danh sách rồi nhấn Add
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLocations");
        await page.getByRole('button', { name: ' Add ' }).click();
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Điền thông tin từ JSON
            if (d.name !== undefined) {
                // Thêm timestamp cho happy case để tránh trùng dữ liệu
                const finalName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                await page.locator('div').filter({ hasText: /^Name$/ }).locator('input').fill(finalName);
            }
            if (d.city) {
                await page.locator('div').filter({ hasText: /^City$/ }).locator('input').fill(d.city);
            }
            if (d.state) {
                await page.locator('div').filter({ hasText: /^State\/Province$/ }).locator('input').fill(d.state);
            }
            if (d.zip) {
                await page.locator('div').filter({ hasText: /^Zip\/Postal Code$/ }).locator('input').fill(d.zip);
            }
            if (d.country) {
                await page.locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.country }).click();
            }
            if (d.phone) {
                await page.locator('div').filter({ hasText: /^Phone$/ }).locator('input').fill(d.phone);
            }
            if (d.fax) {
                await page.locator('div').filter({ hasText: /^Fax$/ }).locator('input').fill(d.fax);
            }
            if (d.address) {
                await page.locator('div').filter({ hasText: /^Address$/ }).locator('textarea').fill(d.address);
            }
            if (d.notes) {
                await page.locator('div').filter({ hasText: /^Notes$/ }).locator('textarea').fill(d.notes);
            }

            // Nhấn Save
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                await expect(page.getByText('Successfully Saved')).toBeVisible();
                await expect(page).toHaveURL(/.*viewLocations/);
            } 
            else if (scenario.expected === "error_name_required") {
                await expect(page.locator('div').filter({ hasText: /^Name$/ }).getByText('Required')).toBeVisible();
            }
            else if (scenario.expected === "error_country_required") {
                await expect(page.locator('div').filter({ hasText: /^Country$/ }).getByText('Required')).toBeVisible();
            }
        });
    }
});

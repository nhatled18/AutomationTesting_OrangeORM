import { test, expect } from "@playwright/test";
import testData from "./data/languages_all.json";

test.describe("Functional Test - Add Qualification Language", () => {
    
    test.beforeEach(async ({ page }) => {
        // Vào trang danh sách rồi nhấn Add
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLanguages");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        await page.getByRole('button', { name: ' Add ' }).click();
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Điền thông tin Name
            if (d.name !== undefined) {
                // Thêm timestamp cho happy case để tránh trùng dữ liệu
                const finalName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                await page.locator('div').filter({ hasText: /^Name$/ }).locator('input').fill(finalName);
            }

            // Nhấn Save
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                await expect(page.getByText('Successfully Saved')).toBeVisible();
                await expect(page).toHaveURL(/.*viewLanguages/, { timeout: 15000 });
            } 
            else if (scenario.expected === "error_required") {
                await expect(page.locator('.oxd-input-group').filter({ has: page.getByText('Name') }).getByText('Required')).toBeVisible();
            }
        });
    }
});

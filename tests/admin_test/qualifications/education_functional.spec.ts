import { test, expect } from "@playwright/test";
import testData from "./data/education_all.json";

test.describe("Functional Test - Add Qualification Education", () => {
    
    test.beforeEach(async ({ page }) => {
        // Vào trang danh sách rồi nhấn Add
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewEducation");
        await page.getByRole('button', { name: ' Add ' }).click();
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Điền thông tin Level
            if (d.level !== undefined) {
                // Thêm timestamp cho happy case để tránh trùng dữ liệu
                const finalLevel = scenario.expected === "success" ? `${d.level} ${Date.now()}` : d.level;
                await page.locator('div').filter({ hasText: /^Level$/ }).locator('input').fill(finalLevel);
            }

            // Nhấn Save
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                await expect(page.getByText('Successfully Saved')).toBeVisible();
                await expect(page).toHaveURL(/.*viewEducation/);
            } 
            else if (scenario.expected === "error_required") {
                await expect(page.locator('div').filter({ hasText: /^Level$/ }).getByText('Required')).toBeVisible();
            }
        });
    }
});

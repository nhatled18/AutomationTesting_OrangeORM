import { test, expect } from "@playwright/test";
import testData from "./data/skills_all.json";

test.describe("Functional Test - Add Qualification Skill", () => {
    
    test.beforeEach(async ({ page }) => {
        // Vào trang danh sách rồi nhấn Add
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSkills");
        await page.getByRole('button', { name: ' Add ' }).click();
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Điền thông tin
            if (d.name !== undefined) {
                // Thêm timestamp cho happy case để tránh trùng dữ liệu
                const finalName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                await page.locator('div').filter({ hasText: /^Name$/ }).locator('input').fill(finalName);
            }
            
            if (d.description) {
                await page.locator('div').filter({ hasText: /^Description$/ }).locator('textarea').fill(d.description);
            }

            // Nhấn Save
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                await expect(page.getByText('Successfully Saved')).toBeVisible();
                await expect(page).toHaveURL(/.*viewSkills/);
            } 
            else if (scenario.expected === "error_required") {
                await expect(page.locator('div').filter({ hasText: /^Name$/ }).getByText('Required')).toBeVisible();
            }
        });
    }
});

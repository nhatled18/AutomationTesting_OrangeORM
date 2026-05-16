import { test, expect } from "@playwright/test";
import testData from "./data/vacancies_search.json";

test.describe("Functional Test - Recruitment Vacancies", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewJobVacancies");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Chọn Job Title
            if (d.jobTitle !== undefined) {
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Job Title' });
                await group.locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.jobTitle }).click();
            }

            // Chọn Hiring Manager
            if (d.hiringManager !== undefined) {
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Hiring Manager' });
                await group.locator('.oxd-select-wrapper').click();
                // Dùng regex không phân biệt hoa thường để chọn manager (fix cho manda user vs Manda User)
                await page.getByRole('option', { name: new RegExp(d.hiringManager, 'i') }).click();
            }

            if (scenario.expected === "reset") {
                await page.getByRole('button', { name: ' Reset ' }).click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                // Kiểm tra các field đã về mặc định
                const jobTitleText = await page.locator('.oxd-input-group').filter({ hasText: 'Job Title' }).locator('.oxd-select-text-input').textContent();
                expect(jobTitleText).toContain('-- Select --');
            } else {
                await page.getByRole('button', { name: ' Search ' }).click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });

                if (scenario.expected === "found") {
                    await expect(page.locator('.oxd-table-card').first()).toBeVisible();
                } else if (scenario.expected === "not_found") {
                    await expect(page.locator('.oxd-table-body')).toContainText('No Records Found', { timeout: 15000 });
                }
            }
        });
    }

    test("Kiểm tra chuyển hướng khi nhấn nút Add Vacancy", async ({ page }) => {
        await page.getByRole('button', { name: ' Add ' }).click();
        await expect(page).toHaveURL(/.*addJobVacancy/);
        await expect(page.locator('h6').first()).toContainText(/Vacancy/i);
    });
});

import { test, expect } from "@playwright/test";
import testData from "./data/vacancies.json";

test.describe("Functional Test - Recruitment Vacancies", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewJobVacancy");
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Lọc theo Job Title
            if (d.jobTitle !== undefined) {
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                await page.locator('div').filter({ hasText: /^Job Title$/ }).locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.jobTitle }).click();
            }

            // Lọc theo Hiring Manager
            if (d.hiringManager !== undefined) {
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Hiring Manager' });
                await group.locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.hiringManager }).click();
            }

            if (scenario.expected === "reset") {
                await page.getByRole('button', { name: ' Reset ' }).click();
                // Kiểm tra các dropdown về giá trị mặc định
                await expect(page.locator('.oxd-select-text-input').first()).toHaveText('-- Select --');
            } else {
                // Nhấn Search
                await page.getByRole('button', { name: ' Search ' }).click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                
                await expect(page.locator('.oxd-table-header')).toBeVisible();
            }
        });
    }

    test("Kiểm tra chuyển hướng khi nhấn nút Add Vacancy", async ({ page }) => {
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        await page.getByRole('button', { name: ' Add ' }).click();
        await expect(page).toHaveURL(/.*addJobVacancy/);
        await expect(page.getByRole('heading', { name: 'Add Job Vacancy' })).toBeVisible();
    });
});

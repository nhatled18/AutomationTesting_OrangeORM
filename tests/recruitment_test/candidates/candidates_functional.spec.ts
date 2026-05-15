import { test, expect } from "@playwright/test";
import testData from "./data/candidates.json";

test.describe("Functional Test - Recruitment Candidates", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Lọc theo Job Title (Dropdown)
            if (d.jobTitle !== undefined) {
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Job Title' });
                await group.locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.jobTitle, exact: true }).click();
            }

            // Lọc theo Candidate Name (Autocomplete)
            if (d.candidateName !== undefined) {
                const nameInput = page.getByPlaceholder('Type for hints...');
                await nameInput.fill(d.candidateName);
                await page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'visible' });
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
            }

            // Nhập Keywords
            if (d.keywords !== undefined) {
                await page.getByPlaceholder('Enter comma seperated words...').fill(d.keywords);
            }

            if (scenario.expected === "reset") {
                await page.getByRole('button', { name: ' Reset ' }).click();
                // Kiểm tra các trường về giá trị mặc định
                await expect(page.getByPlaceholder('Type for hints...')).toHaveValue('');
            } else {
                // Nhấn Search
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                await page.getByRole('button', { name: ' Search ' }).click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                
                // Vì dữ liệu demo có thể thay đổi, ta chỉ check là trang không crash 
                // và bảng vẫn hiển thị (hoặc báo No Records Found)
                await expect(page.locator('.oxd-table-header')).toBeVisible();
            }
        });
    }

    test("Kiểm tra chuyển hướng khi nhấn nút Add Candidate", async ({ page }) => {
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        await page.getByRole('button', { name: ' Add ' }).click();
        await expect(page).toHaveURL(/.*addCandidate/);
        await expect(page.getByRole('heading', { name: 'Add Candidate' })).toBeVisible();
    });
});

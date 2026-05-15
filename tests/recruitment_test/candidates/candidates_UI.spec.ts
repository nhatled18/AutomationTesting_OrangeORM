import { test, expect } from "@playwright/test";

test.describe("UI Test - Recruitment Candidates", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates");
    });

    test("Kiểm tra các thành phần giao diện trang Candidates", async ({ page }) => {
        // Kiểm tra tiêu đề chính
        await expect(page.getByRole('heading', { name: 'Candidates' })).toBeVisible();

        // Kiểm tra các dropdown bộ lọc
        await expect(page.getByText('Job Title')).toBeVisible();
        await expect(page.getByText('Vacancy')).toBeVisible();
        await expect(page.getByText('Hiring Manager')).toBeVisible();
        await expect(page.getByText('Status')).toBeVisible();
        await expect(page.getByText('Method of Application')).toBeVisible();

        // Kiểm tra các trường nhập liệu khác
        await expect(page.locator('label').filter({ hasText: 'Candidate Name' })).toBeVisible();
        await expect(page.getByPlaceholder('Type for hints...')).toBeVisible();
        await expect(page.getByPlaceholder('Enter comma seperated words...')).toBeVisible();
        
        // Kiểm tra Date pickers
        await expect(page.getByPlaceholder('From')).toBeVisible();
        await expect(page.getByPlaceholder('To')).toBeVisible();

        // Kiểm tra các nút bấm
        await expect(page.getByRole('button', { name: ' Search ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Reset ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Add ' })).toBeVisible();
    });

    test("Kiểm tra các tab điều hướng Recruitment", async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Candidates' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Vacancies' })).toBeVisible();
    });
});

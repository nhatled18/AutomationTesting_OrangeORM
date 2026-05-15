import { test, expect } from "@playwright/test";

test.describe("UI Test - Recruitment Vacancies", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewJobVacancy");
    });

    test("Kiểm tra các thành phần giao diện trang Vacancies", async ({ page }) => {
        // Kiểm tra tiêu đề chính
        await expect(page.getByRole('heading', { name: 'Vacancies' })).toBeVisible();

        // Kiểm tra các dropdown bộ lọc
        await expect(page.getByText('Job Title')).toBeVisible();
        await expect(page.getByText('Vacancy')).toBeVisible();
        await expect(page.getByText('Hiring Manager')).toBeVisible();
        await expect(page.getByText('Status')).toBeVisible();

        // Kiểm tra các nút bấm
        await expect(page.getByRole('button', { name: ' Search ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Reset ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Add ' })).toBeVisible();

        // Kiểm tra cấu trúc bảng
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        const tableHeader = page.locator('.oxd-table-header');
        await expect(tableHeader.getByText('Vacancy')).toBeVisible();
        await expect(tableHeader.getByText('Job Title')).toBeVisible();
        await expect(tableHeader.getByText('Hiring Manager')).toBeVisible();
        await expect(tableHeader.getByText('Status')).toBeVisible();
        await expect(tableHeader.getByText('Actions', { exact: true })).toBeVisible();
    });

    test("Kiểm tra sự hiện diện của icon Sửa và Xóa trong bảng", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        if (await firstRow.isVisible()) {
            await expect(firstRow.locator('.bi-trash')).toBeVisible();
            await expect(firstRow.locator('.bi-pencil-fill')).toBeVisible();
        }
    });
});

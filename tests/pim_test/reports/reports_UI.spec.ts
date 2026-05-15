import { test, expect } from "@playwright/test";

test.describe("UI Test - PIM Reports", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewDefinedPredefinedReports");
    });

    test("Kiểm tra các thành phần giao diện trang Reports", async ({ page }) => {
        // Kiểm tra tiêu đề chính
        await expect(page.getByRole('heading', { name: 'Employee Reports' })).toBeVisible();

        // Kiểm tra trường tìm kiếm Report Name
        await expect(page.locator('label').filter({ hasText: 'Report Name' })).toBeVisible();
        await expect(page.getByPlaceholder('Type for hints...')).toBeVisible();

        // Kiểm tra các nút bấm Search và Reset
        await expect(page.getByRole('button', { name: ' Search ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Reset ' })).toBeVisible();

        // Kiểm tra nút Add
        await expect(page.getByRole('button', { name: ' Add ' })).toBeVisible();

        // Kiểm tra cấu trúc bảng kết quả
        const tableHeader = page.locator('.oxd-table-header');
        await expect(tableHeader.getByText('Name')).toBeVisible();
        await expect(tableHeader.getByText('Actions')).toBeVisible();
    });

    test("Kiểm tra các tab điều hướng PIM", async ({ page }) => {
        await expect(page.getByText('Configuration')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Employee List' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Add Employee' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
    });
});

import { test, expect } from "@playwright/test";

test.describe("UI Test - User Management Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang User Management (đã có auth state)
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");
    });

    test("Kiểm tra tiêu đề và các nút chức năng chính", async ({ page }) => {
        // 1. Kiểm tra tiêu đề khối tìm kiếm
        await expect(page.getByRole('heading', { name: 'System Users' })).toBeVisible();
        
        // 2. Kiểm tra các nút Reset, Search và Add
        await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Add' })).toBeVisible();
    });

    test("Kiểm tra các bộ lọc tìm kiếm (Filter Fields)", async ({ page }) => {
        // Username input
        await expect(page.locator('div').filter({ hasText: /^Username$/ }).locator('input')).toBeVisible();

        // User Role dropdown
        await expect(page.locator('div').filter({ hasText: /^User Role$/ }).locator('.oxd-select-wrapper')).toBeVisible();

        // Employee Name autocomplete
        await expect(page.getByPlaceholder('Type for hints...')).toBeVisible();

        // Status dropdown
        await expect(page.locator('div').filter({ hasText: /^Status$/ }).locator('.oxd-select-wrapper')).toBeVisible();
    });

    test("Kiểm tra các cột trong bảng (Table Headers)", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        await expect(header.getByText('Username', { exact: true })).toBeVisible();
        await expect(header.getByText('User Role', { exact: true })).toBeVisible();
        await expect(header.getByText('Employee Name', { exact: true })).toBeVisible();
        await expect(header.getByText('Status', { exact: true })).toBeVisible();
        await expect(header.getByText('Actions', { exact: true })).toBeVisible();
    });

    test("Kiểm tra dữ liệu hàng đầu tiên và các icon thao tác", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        
        // Đợi dữ liệu load lên
        await expect(firstRow).toBeVisible();

        // Kiểm tra các nút xóa và sửa có tồn tại trong hàng không
        await expect(firstRow.locator('.oxd-icon.bi-trash')).toBeVisible();
        await expect(firstRow.locator('.oxd-icon.bi-pencil-fill')).toBeVisible();
    });

    test("Kiểm tra dòng thông báo số lượng bản ghi", async ({ page }) => {
        const recordsCount = page.locator('span.oxd-text--span').filter({ hasText: /Records Found/ });
        await expect(recordsCount).toBeVisible();
    });
});

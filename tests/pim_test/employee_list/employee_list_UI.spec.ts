import { test, expect } from "@playwright/test";

test.describe("UI Test - PIM Employee List", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    test("Kiểm tra các trường lọc tìm kiếm", async ({ page }) => {
        // Employee Name
        await expect(page.locator('div').filter({ hasText: /^Employee Name$/ }).locator('input')).toBeVisible();
        // Employee Id
        await expect(page.locator('div').filter({ hasText: /^Employee Id$/ }).locator('input')).toBeVisible();
        // Employment Status dropdown
        await expect(page.locator('div').filter({ hasText: /^Employment Status$/ }).locator('.oxd-select-wrapper')).toBeVisible();
        // Include dropdown
        await expect(page.locator('div').filter({ hasText: /^Include$/ }).locator('.oxd-select-wrapper')).toBeVisible();
        // Supervisor Name
        await expect(page.locator('div').filter({ hasText: /^Supervisor Name$/ }).locator('input')).toBeVisible();
        // Job Title dropdown
        await expect(page.locator('div').filter({ hasText: /^Job Title$/ }).locator('.oxd-select-wrapper')).toBeVisible();
        // Sub Unit dropdown
        await expect(page.locator('div').filter({ hasText: /^Sub Unit$/ }).locator('.oxd-select-wrapper')).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng danh sách nhân viên", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        // Dùng regex nới lỏng để khớp tiêu đề Id (tránh dính vào Middle Name hoặc lỗi khoảng trắng)
        await expect(header.getByText(/Id/i).first()).toBeVisible();
        await expect(header.getByText(/First.*Name/i)).toBeVisible();
        await expect(header.getByText(/Last Name/i)).toBeVisible();
        await expect(header.getByText(/Job Title/i)).toBeVisible();
        await expect(header.getByText(/Employment Status/i)).toBeVisible();
        await expect(header.getByText(/Sub Unit/i)).toBeVisible();
        await expect(header.getByText(/Supervisor/i)).toBeVisible();
        await expect(header.getByText(/Actions/i)).toBeVisible();
    });

    test("Kiểm tra hiển thị dữ liệu hàng đầu tiên", async ({ page }) => {
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        const firstRow = page.locator('.oxd-table-card').first();
        await expect(firstRow).toBeVisible({ timeout: 15000 });
        
        // Kiểm tra các icon thao tác (xóa, sửa)
        await expect(firstRow.locator('.oxd-icon.bi-trash')).toBeVisible();
        await expect(firstRow.locator('.oxd-icon.bi-pencil-fill')).toBeVisible();
    });
});

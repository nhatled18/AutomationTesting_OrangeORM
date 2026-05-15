import { test, expect } from "@playwright/test";

test.describe("UI Test - Qualifications Memberships", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/membership");
    });

    test("Kiểm tra tiêu đề và nút Add", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Memberships' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Add ' })).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng danh sách thành viên", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        await expect(header.getByText('Membership', { exact: true })).toBeVisible();
        await expect(header.getByText('Actions', { exact: true })).toBeVisible();
    });

    test("Kiểm tra hiển thị icon Sửa và Xóa", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        if (await firstRow.isVisible()) {
            await expect(firstRow.locator('.bi-trash')).toBeVisible();
            await expect(firstRow.locator('.bi-pencil-fill')).toBeVisible();
        }
    });

    test("Kiểm tra giao diện màn hình Add Membership", async ({ page }) => {
        await page.getByRole('button', { name: ' Add ' }).click();
        
        await expect(page.getByRole('heading', { name: 'Add Membership' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Name' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Cancel ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Save ' })).toBeVisible();
    });
});

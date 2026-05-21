import { test, expect } from "@playwright/test";

test.describe("UI Test - Qualifications Licenses", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLicenses");
    await page.locator('.oxd-form-loader, .oxd-loading-spinner, .oxd-table-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    });

    test("Kiểm tra tiêu đề và nút Add", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Licenses' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Add ' })).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng danh sách bằng cấp", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        await expect(header.getByText('Name', { exact: true })).toBeVisible();
        await expect(header.getByText('Actions', { exact: true })).toBeVisible();
    });

    test("Kiểm tra hiển thị icon Sửa và Xóa", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        if (await firstRow.isVisible()) {
            await expect(firstRow.locator('.bi-trash')).toBeVisible();
            await expect(firstRow.locator('.bi-pencil-fill')).toBeVisible();
        }
    });

    test("Kiểm tra giao diện màn hình Add License", async ({ page }) => {
        await page.getByRole('button', { name: ' Add ' }).click();
        
        await expect(page.getByRole('heading', { name: 'Add License' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Name' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Cancel ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Save ' })).toBeVisible();
    });
});

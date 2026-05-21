import { test, expect } from "@playwright/test";

test.describe("UI Test - Qualifications Languages", () => {
    
    test.beforeEach(async ({ page }) => {
        // Điều hướng đến trang Languages
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLanguages");
    await page.locator('.oxd-form-loader, .oxd-loading-spinner, .oxd-table-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    });

    test("Kiểm tra tiêu đề và nút Add", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Languages' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Add ' })).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng danh sách ngôn ngữ", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        await expect(header.getByText('Name', { exact: true })).toBeVisible();
        await expect(header.getByText('Actions', { exact: true })).toBeVisible();
    });

    test("Kiểm tra hiển thị icon Sửa và Xóa", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        // Chỉ kiểm tra nếu có ít nhất 1 bản ghi
        if (await firstRow.isVisible()) {
            await expect(firstRow.locator('.bi-trash')).toBeVisible();
            await expect(firstRow.locator('.bi-pencil-fill')).toBeVisible();
        }
    });

    test("Kiểm tra giao diện màn hình Add Language", async ({ page }) => {
        await page.getByRole('button', { name: ' Add ' }).click();
        
        await expect(page.getByRole('heading', { name: 'Add Language' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Name' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Cancel ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Save ' })).toBeVisible();
    });
});

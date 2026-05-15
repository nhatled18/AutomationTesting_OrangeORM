import { test, expect } from "@playwright/test";

test.describe("UI Test - Qualifications Education", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewEducation");
    });

    test("Kiểm tra tiêu đề và nút Add", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Add ' })).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng danh sách học vấn", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        await expect(header.getByText('Level', { exact: true })).toBeVisible();
        await expect(header.getByText('Actions', { exact: true })).toBeVisible();
    });

    test("Kiểm tra hiển thị icon Sửa và Xóa", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        await expect(firstRow).toBeVisible();
        await expect(firstRow.locator('.bi-trash')).toBeVisible();
        await expect(firstRow.locator('.bi-pencil-fill')).toBeVisible();
    });
});

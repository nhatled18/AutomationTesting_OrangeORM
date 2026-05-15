import { test, expect } from "@playwright/test";

test.describe("UI Test - Work Shifts Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang Work Shifts
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/workShift");
    });

    test("Kiểm tra tiêu đề và nút Add", async ({ page }) => {
        // Kiểm tra tiêu đề trang
        await expect(page.getByRole('heading', { name: 'Work Shifts', exact: true })).toBeVisible();
        
        // Kiểm tra nút Add
        await expect(page.getByRole('button', { name: ' Add' })).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng Work Shifts", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        // Kiểm tra đầy đủ 5 cột tiêu đề
        await expect(header.getByText('Name', { exact: true })).toBeVisible();
        await expect(header.getByText('From', { exact: true })).toBeVisible();
        await expect(header.getByText('To', { exact: true })).toBeVisible();
        await expect(header.getByText('Hours Per Day', { exact: true })).toBeVisible();
        await expect(header.getByText('Actions', { exact: true })).toBeVisible();
    });

    test("Kiểm tra hiển thị dữ liệu và icon thao tác", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        await expect(firstRow).toBeVisible();
        
        // Kiểm tra icon Delete và Edit
        await expect(firstRow.locator('.bi-trash')).toBeVisible();
        await expect(firstRow.locator('.bi-pencil-fill')).toBeVisible();
    });
});

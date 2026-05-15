import { test, expect } from "@playwright/test";

test.describe("UI Test - Pay Grades Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang Pay Grades
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewPayGrades");
    });

    test("Kiểm tra tiêu đề và nút Add", async ({ page }) => {
        // Kiểm tra tiêu đề trang
        await expect(page.getByRole('heading', { name: 'Pay Grades', exact: true })).toBeVisible();
        
        // Kiểm tra nút Add
        await expect(page.getByRole('button', { name: ' Add' })).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng Pay Grades", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        // Kiểm tra các cột tiêu đề
        await expect(header.getByText('Name', { exact: true })).toBeVisible();
        await expect(header.getByText('Currency', { exact: true })).toBeVisible();
        await expect(header.getByText('Actions', { exact: true })).toBeVisible();
    });

    test("Kiểm tra hiển thị dữ liệu và các icon thao tác", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        await expect(firstRow).toBeVisible();
        
        // Kiểm tra các icon Delete và Edit
        await expect(firstRow.locator('.bi-trash')).toBeVisible();
        await expect(firstRow.locator('.bi-pencil-fill')).toBeVisible();
    });
});

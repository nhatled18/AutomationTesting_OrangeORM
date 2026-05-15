import { test, expect } from "@playwright/test";

test.describe("UI Test - Job Titles Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang Job Titles
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewJobTitleList");
    });

    test("Kiểm tra tiêu đề và nút Add", async ({ page }) => {
        // Kiểm tra tiêu đề trang
        await expect(page.getByRole('heading', { name: 'Job Titles', exact: true })).toBeVisible();
        
        // Kiểm tra nút Add
        await expect(page.getByRole('button', { name: ' Add' })).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng Job Titles", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        // Kiểm tra các cột tiêu đề
        await expect(header.getByText('Job Titles', { exact: true })).toBeVisible();
        await expect(header.getByText('Job Description', { exact: true })).toBeVisible();
        await expect(header.getByText('Actions', { exact: true })).toBeVisible();
    });

    test("Kiểm tra hiển thị dữ liệu dòng đầu tiên", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        await expect(firstRow).toBeVisible();
        
        // Kiểm tra các icon thao tác
        await expect(firstRow.locator('.bi-trash')).toBeVisible();
        await expect(firstRow.locator('.bi-pencil-fill')).toBeVisible();
    });
});

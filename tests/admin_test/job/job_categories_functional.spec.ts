import { test, expect } from "@playwright/test";

test.describe("Functional Test - Job Categories Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang Job Categories
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/jobCategory");
    });

    test("Kiểm tra tính năng Thêm mới và Lưu (Save)", async ({ page }) => {
        // 1. Nhấn nút Add
        await page.getByRole('button', { name: ' Add' }).click();

        // 2. Nhập tên (Dùng Date.now() để tránh trùng)
        const categoryName = "Test_Category_" + Date.now();
        await page.locator('div').filter({ hasText: /^Name$/ }).locator('input').fill(categoryName);

        // 3. Nhấn Save
        await page.getByRole('button', { name: ' Save ' }).click();

        // 4. Kiểm tra thông báo thành công
        await expect(page.getByText('Successfully Saved')).toBeVisible();

        // 5. Kiểm tra tên vừa tạo có trong danh sách không
        await expect(page.getByText(categoryName)).toBeVisible();
    });

    test("Kiểm tra tính năng chọn hàng loạt bằng Checkbox", async ({ page }) => {
        await page.locator('.oxd-table-header .oxd-checkbox-input').click();
        await expect(page.getByRole('button', { name: ' Delete Selected' })).toBeVisible();
    });

    test("Kiểm tra điều hướng khi nhấn chỉnh sửa Job Category", async ({ page }) => {
        await page.locator('.oxd-table-card').first().locator('.bi-pencil-fill').click();
        
        // URL khi edit vẫn là saveJobCategory
        await expect(page).toHaveURL(/.*saveJobCategory/);
        await expect(page.getByRole('heading', { name: 'Edit Job Category' })).toBeVisible();
    });

    test("Kiểm tra xác nhận xóa Job Category", async ({ page }) => {
        await page.locator('.oxd-table-card').first().locator('.bi-trash').click();
        await expect(page.getByText('Are you Sure?')).toBeVisible();
        await page.getByRole('button', { name: ' No, Cancel ' }).click();
    });
});

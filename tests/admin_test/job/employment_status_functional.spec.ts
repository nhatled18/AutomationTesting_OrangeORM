import { test, expect } from "@playwright/test";

test.describe("Functional Test - Employment Status Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang Employment Status
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/employmentStatus");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
        await page.locator('.oxd-table-loader').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
        await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    });

    test("Kiểm tra tính năng chọn tất cả bằng Checkbox", async ({ page }) => {
        await page.locator('.oxd-table-body .oxd-table-card').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        // Click vào checkbox ở header
        await page.locator('.oxd-table-header .oxd-checkbox-wrapper').click();

        // Kiểm tra nút xóa hàng loạt xuất hiện
        await expect(page.getByRole('button', { name: ' Delete Selected' })).toBeVisible();
    });

    test("Kiểm tra điều hướng khi nhấn thêm mới Employment Status", async ({ page }) => {
        // Nhấn nút Add
        await page.getByRole('button', { name: ' Add' }).click();

        // Kiểm tra chuyển hướng URL
        await expect(page).toHaveURL(/.*saveEmploymentStatus/);

        // Kiểm tra tiêu đề trang mới
        await expect(page.getByRole('heading', { name: 'Add Employment Status' })).toBeVisible();
    });

    test("Kiểm tra điều hướng khi nhấn chỉnh sửa Employment Status", async ({ page }) => {
        await page.locator('.oxd-table-body .oxd-table-card').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        // Nhấn nút Edit ở hàng đầu tiên
        await page.locator('.oxd-table-card').first().locator('.bi-pencil-fill').click();

        // Kiểm tra chuyển hướng URL
        await expect(page).toHaveURL(/.*saveEmploymentStatus/);

        // Kiểm tra tiêu đề trang
        await expect(page.getByRole('heading', { name: 'Edit Employment Status' })).toBeVisible();
    });

    test("Kiểm tra tính năng Thêm mới và Lưu (Save)", async ({ page }) => {
        // 1. Nhấn nút Add
        await page.getByRole('button', { name: ' Add' }).click();

        // 2. Nhập tên (Dùng Date.now() để tránh bị trùng tên nếu chạy test nhiều lần)
        const statusName = "Test_Status_" + Date.now();
        await page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first().locator('input').fill(statusName);

        // 3. Nhấn Save
        await page.getByRole('button', { name: ' Save ' }).click();

        // 4. Kiểm tra thông báo thành công (OrangeHRM dùng toast message)
        await expect(page.getByText('Successfully Saved')).toBeVisible();

        // 5. Kiểm tra tên vừa tạo có xuất hiện trong danh sách không
        await expect(page.getByText(statusName)).toBeVisible();
    });

    test("Kiểm tra xác nhận xóa Employment Status", async ({ page }) => {
        await page.locator('.oxd-table-body .oxd-table-card').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        // Nhấn nút Delete
        await page.locator('.oxd-table-card').first().locator('.bi-trash').click();

        // Kiểm tra popup xác nhận
        await expect(page.getByText('Are you Sure?')).toBeVisible();

        // Đóng popup bằng nút Cancel
        await page.getByRole('button', { name: ' No, Cancel ' }).click();
    });
});

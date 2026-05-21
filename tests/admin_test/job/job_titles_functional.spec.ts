import { test, expect } from "@playwright/test";

test.describe("Functional Test - Job Titles Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang Job Titles
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewJobTitleList");
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
        
        // Kiểm tra thông báo số lượng bản ghi đã chọn
        await expect(page.getByText(/.*Records Selected/)).toBeVisible();
    });

    test("Kiểm tra điều hướng khi nhấn thêm mới Job Title", async ({ page }) => {
        // Nhấn nút Add
        await page.getByRole('button', { name: ' Add' }).click();

        // Kiểm tra chuyển hướng URL
        await expect(page).toHaveURL(/.*saveJobTitle/);

        // Kiểm tra tiêu đề trang mới
        await expect(page.getByRole('heading', { name: 'Add Job Title' })).toBeVisible();
    });

    test("Kiểm tra điều hướng khi nhấn chỉnh sửa Job Title", async ({ page }) => {
        await page.locator('.oxd-table-body .oxd-table-card').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        // Nhấn nút Edit (cây bút) ở hàng đầu tiên
        await page.locator('.oxd-table-card').first().locator('.bi-pencil-fill').click();

        // Kiểm tra URL trang edit
        await expect(page).toHaveURL(/.*saveJobTitle/);

        // Kiểm tra tiêu đề trang
        await expect(page.getByRole('heading', { name: 'Edit Job Title' })).toBeVisible();
    });

    test("Kiểm tra xác nhận xóa Job Title", async ({ page }) => {
        await page.locator('.oxd-table-body .oxd-table-card').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        // Nhấn nút Delete (thùng rác)
        await page.locator('.oxd-table-card').first().locator('.bi-trash').click();

        // Kiểm tra popup xuất hiện
        await expect(page.getByText('Are you Sure?')).toBeVisible();

        // Đóng popup bằng nút Cancel
        await page.getByRole('button', { name: ' No, Cancel ' }).click();
        
        await expect(page.getByText('Are you Sure?')).not.toBeVisible();
    });
});

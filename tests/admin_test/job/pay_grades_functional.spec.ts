import { test, expect } from "@playwright/test";

test.describe("Functional Test - Pay Grades Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang Pay Grades
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewPayGrades");
    });

    test("Kiểm tra tính năng chọn tất cả bằng Checkbox", async ({ page }) => {
        // Click vào checkbox ở header
        await page.locator('.oxd-table-header .oxd-checkbox-input').click();

        // Kiểm tra nút xóa hàng loạt xuất hiện
        await expect(page.getByRole('button', { name: ' Delete Selected' })).toBeVisible();
    });

    test("Kiểm tra điều hướng khi nhấn thêm mới Pay Grade", async ({ page }) => {
        // Nhấn nút Add
        await page.getByRole('button', { name: ' Add' }).click();

        // Kiểm tra chuyển hướng URL (Trang Pay Grade có URL dạng .../payGrade)
        await expect(page).toHaveURL(/.*payGrade/);

        // Kiểm tra tiêu đề trang mới
        await expect(page.getByRole('heading', { name: 'Add Pay Grade' })).toBeVisible();
    });

    test("Kiểm tra điều hướng khi nhấn chỉnh sửa Pay Grade", async ({ page }) => {
        // Nhấn nút Edit ở hàng đầu tiên
        await page.locator('.oxd-table-card').first().locator('.bi-pencil-fill').click();

        // Kiểm tra chuyển hướng URL
        await expect(page).toHaveURL(/.*payGrade/);

        // Kiểm tra tiêu đề trang
        await expect(page.getByRole('heading', { name: 'Edit Pay Grade' })).toBeVisible();
    });

    test("Kiểm tra xác nhận xóa Pay Grade", async ({ page }) => {
        // Nhấn nút Delete
        await page.locator('.oxd-table-card').first().locator('.bi-trash').click();

        // Kiểm tra popup xác nhận
        await expect(page.getByText('Are you Sure?')).toBeVisible();

        // Đóng popup bằng nút Cancel
        await page.getByRole('button', { name: ' No, Cancel ' }).click();
    });
});

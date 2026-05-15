import { test, expect } from "@playwright/test";

test.describe("Functional Test - Work Shifts Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang Work Shifts
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/workShift");
    });

    test("Kiểm tra tính năng Thêm mới và Lưu (Save)", async ({ page }) => {
        // 1. Nhấn nút Add
        await page.getByRole('button', { name: ' Add' }).click();

        // 2. Nhập tên ca làm việc
        const shiftName = "Shift_Test_" + Date.now();
        await page.locator('div').filter({ hasText: /^Shift Name$/ }).locator('input').fill(shiftName);

        // 3. Nhấn Save (Mặc định chọn thời gian có sẵn của hệ thống)
        await page.getByRole('button', { name: ' Save ' }).click();

        // 4. Kiểm tra thông báo thành công
        await expect(page.getByText('Successfully Saved')).toBeVisible();

        // 5. Kiểm tra tên vừa tạo có trong danh sách không
        await expect(page.getByText(shiftName)).toBeVisible();
    });

    test("Kiểm tra tính năng chọn hàng loạt bằng Checkbox", async ({ page }) => {
        await page.locator('.oxd-table-header .oxd-checkbox-input').click();
        await expect(page.getByRole('button', { name: ' Delete Selected' })).toBeVisible();
    });

    test("Kiểm tra điều hướng khi nhấn chỉnh sửa Work Shift", async ({ page }) => {
        await page.locator('.oxd-table-card').first().locator('.bi-pencil-fill').click();
        
        // URL trang sửa
        await expect(page).toHaveURL(/.*saveWorkShift/);
        await expect(page.getByRole('heading', { name: 'Edit Work Shift' })).toBeVisible();
    });

    test("Kiểm tra xác nhận xóa Work Shift", async ({ page }) => {
        await page.locator('.oxd-table-card').first().locator('.bi-trash').click();
        await expect(page.getByText('Are you Sure?')).toBeVisible();
        await page.getByRole('button', { name: ' No, Cancel ' }).click();
    });
});

import { test, expect } from "@playwright/test";

test.describe("Functional Test - User Management Page", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    test("Tính năng lọc theo User Role", async ({ page }) => {
        // 1. Click vào dropdown User Role (Sử dụng group để tránh trùng lặp)
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        const roleGroup = page.locator('.oxd-input-group').filter({ hasText: 'User Role' });
        await roleGroup.locator('.oxd-select-wrapper').click();
        
        // 2. Chọn option 'Admin'
        await page.getByRole('option', { name: 'Admin' }).click();

        // 3. Nhấn Search
        await page.getByRole('button', { name: ' Search ' }).click();
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });

        // 4. Kiểm tra xem kết quả trả về có đúng là Admin không
        const roleCells = page.locator('.oxd-table-card div[role="cell"]:nth-child(3)');
        const count = await roleCells.count();
        for (let i = 0; i < count; i++) {
            await expect(roleCells.nth(i)).toHaveText('Admin');
        }
    });

    test("Kiểm tra luồng Xóa đơn lẻ (Delete)", async ({ page }) => {
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        
        // 1. Nhấn nút xóa của hàng đầu tiên
        await page.locator('.oxd-table-card').first().locator('.oxd-icon.bi-trash').click();
        // Wait for delete confirmation modal to appear
        await page.waitForTimeout(1000);

        // 2. Kiểm tra xem có xuất hiện Popup xác nhận xóa không
        await expect(page.getByText(/Are you sure/i)).toBeVisible({ timeout: 15000 });

        // 3. Nhấn nút "No, Cancel" để đóng popup
        await page.getByRole('button', { name: /No, Cancel/i }).click();
        
        // Kiểm tra popup đã đóng
        await expect(page.getByText(/Are you sure/i)).toBeHidden({ timeout: 10000 });
    });
});

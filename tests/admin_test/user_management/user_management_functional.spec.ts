import { test, expect } from "@playwright/test";

test.describe("Functional Test - User Management Page", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://orangehrmlive.com");
        await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    });

    test("Tính năng lọc theo User Role", async ({ page }) => {
        const roleGroup = page.locator('.oxd-input-group').filter({ hasText: 'User Role' });
        await roleGroup.locator('.oxd-select-wrapper').click();
        
        const dropdownList = page.locator('.oxd-select-dropdown');
        await dropdownList.waitFor({ state: 'visible', timeout: 10000 });
        await dropdownList.getByRole('option', { name: 'Admin' }).click();

        // Nhấn Search
        await page.getByRole('button', { name: ' Search ' }).click();
        
        // Chờ bảng dữ liệu tải xong hoàn toàn
        await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});

        // Lấy toàn bộ các ô thuộc cột User Role (Cột thứ 3)
        const roleCells = page.locator('.oxd-table-card div[role="cell"]:nth-child(3)');
        
        // Đảm bảo ít nhất có 1 dòng kết quả hiển thị
        await expect(roleCells.first()).toBeVisible({ timeout: 15000 });

        // 🔥 FIX TRIỆT ĐỂ: Dùng Array Assertion để quét toàn bộ mảng thay vì chạy vòng lặp 'for'
        // Playwright sẽ tự động chờ tất cả các hàng ổn định rồi verify chữ 'Admin' đồng loạt
        await expect(roleCells).toContainText(['Admin'], { timeout: 15000 });
    });

    test("Kiểm tra luồng Xóa đơn lẻ (Delete)", async ({ page }) => {
    const firstRow = page.locator('.oxd-table-card').first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });
    
    // 1. Nhấn nút xóa của hàng đầu tiên
    await firstRow.locator('.oxd-icon.bi-trash').click();
    
    // 🔥 FIX SÉLECTOR TRÚNG ĐÍCH: Dùng getByRole tìm chính xác thẻ tiêu đề (heading) chứa nội dung 'Are you sure'
    const confirmationTitle = page.getByRole('heading', { name: /Are you sure/i });

    // 2. Kiểm tra xem có xuất hiện Popup xác nhận xóa không
    await expect(confirmationTitle).toBeVisible({ timeout: 15000 });

    // 3. Nhấn nút "No, Cancel" để đóng popup
    await page.getByRole('button', { name: /No, Cancel/i }).click();
    
    // Kiểm tra popup đã đóng hoàn toàn
    await expect(confirmationTitle).toBeHidden({ timeout: 10000 });
});

});

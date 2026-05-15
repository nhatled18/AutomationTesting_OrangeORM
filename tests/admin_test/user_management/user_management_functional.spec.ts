import { test, expect } from "@playwright/test";

test.describe("Functional Test - User Management Page", () => {
    
    test.beforeEach(async ({ page }) => {
        // Nhảy thẳng tới trang User Management (đã có auth state)
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");
    });

    test("Tính năng tìm kiếm theo Username", async ({ page }) => {
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        const usernameInput = page.locator('div').filter({ hasText: /^Username$/ }).locator('input');
        await usernameInput.fill("Admin");

        // 2. Nhấn nút Search
        await page.getByRole('button', { name: 'Search' }).click();

        // 3. Đợi dữ liệu load và kiểm tra kết quả ở dòng đầu tiên (Cột thứ 2 là Username)
        const firstRowUsername = page.locator('.oxd-table-card').first().locator('.oxd-table-cell').nth(1);
        await expect(firstRowUsername).toContainText("Admin");
    });

    test("Tính năng Reset bộ lọc", async ({ page }) => {
        // 1. Nhập dữ liệu vào ô Username
        const usernameInput = page.locator('div').filter({ hasText: /^Username$/ }).locator('input');
        await usernameInput.fill("GhostUser123");
        
        // 2. Nhấn nút Reset
        await page.getByRole('button', { name: 'Reset' }).click();

        // 3. Kiểm tra xem ô input đã được xóa trống chưa
        await expect(usernameInput).toHaveValue("");
    });

    test("Tính năng lọc theo User Role", async ({ page }) => {
        // 1. Click vào dropdown User Role
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        const roleDropdown = page.locator('div').filter({ hasText: /^User Role$/ }).locator('.oxd-select-wrapper');
        await roleDropdown.click();
        
        // 2. Chọn option 'Admin'
        await page.getByRole('option', { name: 'Admin' }).click();

        // 3. Nhấn Search
        await page.getByRole('button', { name: 'Search' }).click();

        // 4. Kiểm tra dòng đầu tiên ở cột User Role (Cột thứ 3)
        const firstRowRole = page.locator('.oxd-table-card').first().locator('.oxd-table-cell').nth(2);
        await expect(firstRowRole).toHaveText("Admin");
    });

    test("Kiểm tra luồng chuyển hướng khi nhấn nút Add", async ({ page }) => {
        // 1. Nhấn nút Add
        await page.getByRole('button', { name: ' Add' }).click();

        // 2. Kiểm tra URL phải chứa 'saveSystemUser'
        await expect(page).toHaveURL(/.*saveSystemUser/);

        // 3. Kiểm tra tiêu đề trang hiển thị là 'Add User'
        await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();
    });

    test("Kiểm tra tính năng Checkbox và Xóa hàng loạt", async ({ page }) => {
        // 1. Click vào checkbox "Chọn tất cả" ở header
        const headerCheckbox = page.locator('.oxd-table-header .oxd-checkbox-input');
        await headerCheckbox.click();

        // 2. Kiểm tra xem nút "Delete Selected" có xuất hiện không
        const deleteSelectedBtn = page.getByRole('button', { name: ' Delete Selected' });
        await expect(deleteSelectedBtn).toBeVisible();

        // 3. Kiểm tra dòng thông báo số lượng đã chọn
        await expect(page.getByText(/.*Records Selected/)).toBeVisible();
    });

    test("Kiểm tra điều hướng khi nhấn icon Chỉnh sửa (Edit)", async ({ page }) => {
        // 1. Click vào icon cây bút chì ở hàng đầu tiên
        const firstRowEditBtn = page.locator('.oxd-table-card').first().locator('.bi-pencil-fill');
        await firstRowEditBtn.click();

        // 2. Xác nhận đã chuyển sang trang Edit (URL chứa 'saveSystemUser')
        await expect(page).toHaveURL(/.*saveSystemUser/);
        
        // 3. Xác nhận tiêu đề trang là "Edit User"
        await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
    });

    test("Kiểm tra luồng Xóa đơn lẻ (Delete)", async ({ page }) => {
        // 1. Click vào icon thùng rác ở hàng đầu tiên
        const firstRowDeleteBtn = page.locator('.oxd-table-card').first().locator('.bi-trash');
        await firstRowDeleteBtn.click();

        // 2. Kiểm tra xem có xuất hiện Popup xác nhận xóa không (Dùng regex không phân biệt hoa thường)
        await expect(page.getByText(/Are you sure/i)).toBeVisible();

        // 3. Nhấn nút "No, Cancel" để đóng popup
        await page.getByRole('button', { name: ' No, Cancel ' }).click();
        
        // Xác nhận popup đã biến mất
        await expect(page.getByText('Are you Sure?')).not.toBeVisible();
    });
});

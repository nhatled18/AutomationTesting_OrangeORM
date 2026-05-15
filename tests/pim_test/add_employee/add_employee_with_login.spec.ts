import { test, expect } from "@playwright/test";

test.describe("Functional Test - Add Employee with Login Details", () => {
    
    test("Thêm nhân viên mới và kiểm tra quyền truy cập (không có menu Admin)", async ({ page }) => {
        const timestamp = Date.now();
        const firstName = "User";
        const lastName = `Test${timestamp}`;
        const username = `user${timestamp}`;
        const password = "Password123!";

        // 1. Đi tới trang Add Employee (Dùng Admin hiện tại đang login sẵn)
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee");

        // 2. Điền thông tin cơ bản
        await page.getByPlaceholder('First Name').fill(firstName);
        await page.getByPlaceholder('Last Name').fill(lastName);

        // 3. Bật toggle Create Login Details
        // Click vào switch toggle
        await page.locator('label').filter({ hasText: 'Create Login Details' }).locator('span').click();

        // 4. Điền Login Details
        // Nhập Username
        await page.locator('div').filter({ hasText: /^Username$/ }).locator('input').fill(username);
        
        // Nhập Password
        // Lưu ý: Có thể có nhiều input trong div này, ta lấy input đầu tiên
        await page.locator('div').filter({ hasText: /^Password$/ }).locator('input').fill(password);
        
        // Nhập Confirm Password
        await page.locator('div').filter({ hasText: /^Confirm Password$/ }).locator('input').fill(password);

        // 5. Lưu nhân viên
        await page.getByRole('button', { name: ' Save ' }).click();
        
        // Đợi thông báo thành công
        await expect(page.getByText('Successfully Saved')).toBeVisible();
        await page.waitForURL(/.*viewPersonalDetails/);

        // 6. Đăng xuất tài khoản Admin hiện tại
        await page.locator('.oxd-userdropdown-tab').click();
        await page.getByRole('menuitem', { name: 'Logout' }).click();
        await expect(page).toHaveURL(/.*login/);

        // 7. Đăng nhập với tài khoản nhân viên mới tạo
        await page.getByPlaceholder('Username').fill(username);
        await page.getByPlaceholder('Password').fill(password);
        await page.getByRole('button', { name: 'Login' }).click();

        // 8. Kiểm tra kết quả: Menu Admin phải biến mất cho tài khoản nhân viên thường
        // Chờ trang Dashboard hoặc My Info load xong
        await expect(page).toHaveURL(/.*dashboard/);

        // Kiểm tra menu Admin không hiển thị trong sidebar
        const adminMenu = page.locator('.oxd-main-menu-item-wrapper').filter({ hasText: 'Admin' });
        await expect(adminMenu).not.toBeVisible();
        
        // Kiểm tra các menu khác dành cho nhân viên (ví dụ: My Info) vẫn hiển thị
        const myInfoMenu = page.locator('.oxd-main-menu-item-wrapper').filter({ hasText: 'My Info' });
        await expect(myInfoMenu).toBeVisible();
        
        console.log(`Test thành công với user: ${username}`);
    });
});

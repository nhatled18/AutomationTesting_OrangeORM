import { test, expect } from "@playwright/test";

test("login", async ({ page }) => {
    // Tăng timeout cho goto vì server demo đôi khi rất chậm
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", { timeout: 60000 });
    
    // Đợi màn hình chờ (loader) biến mất hoàn toàn
    await page.waitForSelector('.orangehrm-login-slot', { state: 'visible', timeout: 30000 });
    
    // Điền thông tin đăng nhập
    await page.getByPlaceholder("Username").fill("Admin");
    await page.getByPlaceholder("Password").fill("Admin123");
    
    // Nhấn Login
    await page.getByRole("button", { name: "Login" }).click();
    
    // Kiểm tra đã vào được Dashboard chưa
    await expect(page).toHaveURL(/.*dashboard/);
});

import { test, expect } from "@playwright/test";

test("login", async ({ page }) => {
    // Tăng timeout cho goto vì server demo đôi khi rất chậm
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", { timeout: 60000 });
    
    // Wait for login form to be visible instead of waiting for specific slot
    const usernameInput = page.getByPlaceholder("Username");
    await usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    
    // Điền thông tin đăng nhập
    await usernameInput.fill("Admin");
    await page.getByPlaceholder("Password").fill("admin123");
    
    // Nhấn Login
    await page.getByRole("button", { name: "Login" }).click();
    
    // Wait for dashboard to load
    await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    
    // Kiểm tra đã vào được Dashboard chưa
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 20000 });
});

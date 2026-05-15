import { test, expect } from "@playwright/test";

test("kiểm tra các menu trong trang Admin", async ({ page }) => {
    // 1. Nhảy thẳng vào trang Admin (đã được tự động login nhờ auth setup)
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");
    
    // 2. Kiểm tra xác nhận đã vào đúng trang
    await expect(page).toHaveURL(/.*admin/);

    // 3. Định vị thanh navigation bar
    const navigationBar = page.locator(".oxd-topbar-body-nav");
    await expect(navigationBar).toBeVisible();

    // 4. Danh sách các mục cần kiểm tra
    const expectedMenus = [
        "User Management",
        "Job",
        "Organization",
        "Qualifications",
        "Nationalities",
        "Corporate Branding",
        "Configuration"
    ];

    // 5. Kiểm tra sự hiện diện của từng menu
    for (const menuName of expectedMenus) {
        const menuElement = navigationBar.getByText(menuName);
        
        // Khẳng định menu phải hiển thị
        await expect(menuElement).toBeVisible();
    }
});
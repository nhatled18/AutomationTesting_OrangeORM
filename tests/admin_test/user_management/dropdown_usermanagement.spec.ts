import { test, expect } from "@playwright/test";
test("kiểm tra hiển thị dropdown trong user management", async ({ page }) => {
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");

  // 1. Định vị cột "User Management" bằng CSS class của <a>
  const userManagementLink = page.locator('a.oxd-topbar-body-nav-tab-item:has-text("User Management")');

  await expect(userManagementLink).toBeVisible();

  // (Tùy chọn) Nếu bạn muốn click để mở dropdown ra xem nội dung chi tiết:
  await userManagementLink.click();
  const dropdownMenu= page.locator('ul.oxd-dropdown-menu');
  await expect(dropdownMenu.getByText('Users')).toBeVisible();
});

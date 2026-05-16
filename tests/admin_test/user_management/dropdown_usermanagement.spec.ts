import { test, expect } from "@playwright/test";

test("kiểm tra hiển thị dropdown trong user management", async ({ page }) => {
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");
  await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });

  // Tìm link User Management trên topbar bằng text (linh hoạt hơn)
  const userManagementLink = page.locator('.oxd-topbar-body-nav-tab-item').filter({ hasText: 'User Management' });

  await expect(userManagementLink).toBeVisible();

  // Click để mở dropdown
  await userManagementLink.click();

  // Kiểm tra menu con "Users" xuất hiện
  await expect(page.locator('.oxd-dropdown-menu')).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Users' })).toBeVisible();
});

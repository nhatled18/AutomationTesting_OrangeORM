import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });

  // Use CSS selectors (name attribute) — language-agnostic, works regardless of locale
  const usernameInput = page.locator('input[name="username"]');
  const passwordInput = page.locator('input[name="password"]');

  await usernameInput.waitFor({ state: 'visible', timeout: 60000 });
  await usernameInput.fill('Admin');
  await passwordInput.fill('admin123');
  await page.locator('button[type="submit"]').click();
  await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 120000 });

  await expect(page).toHaveURL(/.*dashboard/, { timeout: 20000 });

  // Lưu trạng thái đăng nhập vào file
  await page.context().storageState({ path: authFile });
});

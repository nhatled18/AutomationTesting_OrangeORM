import { test, expect } from "@playwright/test";
import testData from "./data/licenses_all.json";

test.describe("Functional Test - Add Qualification License", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLicenses");
        await page.locator('.oxd-form-loader, .oxd-loading-spinner, .oxd-table-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
        await page.getByRole('button', { name: ' Add ' }).click();
        await page.locator('.oxd-form-loader, .oxd-loading-spinner, .oxd-table-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;
            let currentInputName = d.name;

            // FIX: Xử lý riêng biệt cho trường hợp bỏ trống hoặc có dữ liệu nhập vào
            if (d.name !== undefined) {
                const inputGroup = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first();
                const input = inputGroup.locator('input');
                await input.waitFor({ state: 'visible', timeout: 10000 });

                if (d.name === "") {
                    // Kịch bản bỏ trống: Xóa trắng -> Gõ phím -> Xóa để kích hoạt validation
                    await input.focus();
                    await page.keyboard.press('Control+A');
                    await page.keyboard.press('Delete');
                    await input.fill(" ");
                    await page.keyboard.press('Backspace');
                    await input.blur();
                } else {
                    // Kịch bản thông thường: Thêm timestamp nếu mong đợi thành công
                    currentInputName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                    await input.fill(currentInputName);
                    await input.blur();
                }
            }

            await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
            await page.getByRole('button', { name: ' Save ' }).click();

            // Khối kiểm tra kết quả mong đợi
            if (scenario.expected === "success") {
                const successToast = page.locator('.oxd-toast--success');
                await expect(successToast).toBeVisible({ timeout: 15000 });
                await successToast.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
                
                // Xác thực dòng dữ liệu mới tạo trong bảng
                const targetRow = page.locator('.oxd-table-card').filter({ hasText: currentInputName }).first();
                await expect(targetRow).toBeVisible({ timeout: 15000 });
            }
            else if (scenario.expected === "error_required") {
                await expect(
                    page.locator('.oxd-input-group')
                        .filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first()
                        .locator('.oxd-input-field-error-message')
                ).toHaveText('Required', { timeout: 10000 });
            }
            else if (scenario.expected === "error_invalid") {
                await expect(
                    page.locator('.oxd-toast--error, .oxd-input-field-error-message').first()
                ).toBeVisible({ timeout: 10000 });
            }
        });
    }
});

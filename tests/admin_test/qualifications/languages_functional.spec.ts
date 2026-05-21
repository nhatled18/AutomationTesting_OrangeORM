import { test, expect } from "@playwright/test";
import testData from "./data/languages_all.json";

test.describe("Functional Test - Add Qualification Language", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLanguages");
        await page.locator('.oxd-form-loader, .oxd-loading-spinner, .oxd-table-loader').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});
        await page.getByRole('button', { name: ' Add ' }).click();
        await page.locator('.oxd-form-loader, .oxd-loading-spinner, .oxd-table-loader').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            if (d.name !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first();
                const input = group.locator('input');
                await input.waitFor({ state: 'visible', timeout: 10000 });

                if (d.name === "") {
                    // Ép UI văng lỗi Required: Click vào -> Điền chữ giả -> Xóa đi -> Blur
                    await input.focus();
                    await page.keyboard.press('Control+A');
                    await page.keyboard.press('Delete');
                    await input.fill(" ");
                    await page.keyboard.press('Backspace');
                    await input.blur();
                } else {
                    // Tạo tên duy nhất bằng timestamp nếu mong đợi thành công
                    const finalName = scenario.expected === "success" ? `${d.name} ${Date.now()}` : d.name;
                    await input.fill(finalName);
                    await input.blur();
                }
            }

            await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
            await page.getByRole('button', { name: ' Save ' }).click();
            
            // Chờ xử lý bất đồng bộ sau khi bấm lưu
            await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});

            // Khối kiểm tra kết quả (Assertions)
            if (scenario.expected === "success") {
                const successToast = page.locator('.oxd-toast--success');
                await expect(successToast).toBeVisible({ timeout: 15000 });
                await expect(page).toHaveURL(/.*viewLanguages/);
                
                // Đợi Toast ẩn hẳn để không làm ảnh hưởng kịch bản chạy sau
                await successToast.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
            } 
            else if (scenario.expected === "error_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first();
                await expect(group.locator('.oxd-input-field-error-message')).toHaveText('Required', { timeout: 10000 });
            }
            //FIX: Bổ sung khối bắt lỗi kịch bản Ký tự đặc biệt/Emoji khi đã sửa JSON thành 'error_invalid'
            else if (scenario.expected === "error_invalid") {
                await expect(
                    page.locator('.oxd-toast--error, .oxd-input-field-error-message').first()
                ).toBeVisible({ timeout: 10000 });
            }
        });
    }
});

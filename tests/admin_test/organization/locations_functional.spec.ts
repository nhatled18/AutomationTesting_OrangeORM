import { test, expect } from "@playwright/test";
import testData from "./data/locations_all.json";

test.describe("Functional Test - Add Organization Location", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLocations");
        
        // 🔥 FIX 1: Tách riêng loader để tránh sập Strict Mode
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});
        await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});
        
        await page.getByRole('button', { name: ' Add ' }).click();
        
        // 🔥 FIX 1: Tách riêng loader sau khi click Add
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});
        await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 20000 }).catch(() => {});
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;
            let currentInputName = d.name;

            // 1. Điền trường Name và xử lý kích hoạt lỗi trống
            if (d.name !== undefined) {
                // Sử dụng .oxd-label để bắt chính xác group input, không phụ thuộc vào dấu *
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first();
                const input = group.locator('input');
                await input.waitFor({ state: 'visible', timeout: 10000 });

                if (d.name === "") {
                    await input.focus();
                    await page.keyboard.press('Control+A');
                    await page.keyboard.press('Delete');
                    await input.fill(" ");
                    await page.keyboard.press('Backspace');
                    await input.blur();
                } else {
                    currentInputName = scenario.expected === "success" && d.name
                        ? `${d.name} ${Date.now()}`
                        : d.name;
                    await input.fill(currentInputName);
                    await input.blur();
                }
            }

            // Helper điền các trường text thông thường
            const fillTextField = async (label: string, value: string) => {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: label }) }).first();
                await group.locator('input').fill(value);
            };

            if (d.city) await fillTextField('City', d.city);
            if (d.phone) await fillTextField('Phone', d.phone);

            // 2. Chọn Dropdown Country sử dụng bộ chọn tuyệt đối chống lệch DOM
            if (d.country && d.country.trim()) {
                // Sử dụng .oxd-label để bắt chính xác group input
                const countryGroup = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Country' }) }).first();
                await countryGroup.locator('.oxd-select-text').click();
                
                const dropdown = page.locator('.oxd-select-dropdown');
                await dropdown.waitFor({ state: 'visible', timeout: 10000 });
                // Tìm kiếm linh hoạt hơn, tránh lỗi exact match (như 'Vietnam' vs 'Viet Nam')
                await dropdown.getByRole('option').filter({ hasText: new RegExp(d.country.trim().replace("Vietnam", "Viet Nam"), "i") }).first().click();
                await dropdown.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
            }

            // 🔥 FIX 1: Tách biệt loader trước khi bấm Save
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
            await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
            await page.getByRole('button', { name: ' Save ' }).click();

            // 3. Khối kiểm tra kết quả (Assertions) chuẩn hóa theo JSON
            if (scenario.expected === "success") {
                const successToast = page.locator('.oxd-toast--success');
                await expect(successToast).toBeVisible({ timeout: 15000 });
                await successToast.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
                
                await expect(page).toHaveURL(/.*viewLocations/);
                const targetRow = page.locator('.oxd-table-card').filter({ hasText: currentInputName }).first();
                await expect(targetRow).toBeVisible({ timeout: 10000 });
            } 
            else if (scenario.expected === "error_required" || scenario.expected === "error_name_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Name' }) }).first();
                await expect(group.locator('.oxd-input-field-error-message')).toHaveText('Required', { timeout: 10000 });
            }
            else if (scenario.expected === "error_country_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Country' }) }).first();
                await expect(group.locator('.oxd-input-field-error-message')).toHaveText('Required', { timeout: 10000 });
            }
        });
    }
});

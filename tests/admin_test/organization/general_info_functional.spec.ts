import { test, expect } from "@playwright/test";
import testData from "./data/general_info_all.json";

test.describe("Advanced Data-Driven Testing - Organization General Info", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation");
        
        // 🔥 FIX 1: Tách riêng 2 loader và thêm catch để tránh lỗi Strict Mode (2 elements found)
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
        await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});

        // TỐI ƯU SWITCH: Kiểm tra kỹ thuộc tính của nút Switch hoặc class cha thay vì chỉ check isEnabled của input
        const editSwitch = page.locator('.oxd-switch-input');
        const isEditModeActive = await editSwitch.evaluate((el: HTMLInputElement) => el.checked).catch(() => false);

        if (!isEditModeActive) {
            await page.locator('.oxd-switch-wrapper').click();
            // 🔥 FIX 2: Tách riêng loader sau khi click switch
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
            await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
        }
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Helper điền dữ liệu thông minh
            const fillField = async (label: string, value: string) => {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: label }) }).first();
                const input = group.locator('input');
                await input.waitFor({ state: 'visible', timeout: 10000 });

                if (value === "") {
                    // Ép UI kích hoạt lỗi đỏ 'Required': Xóa trắng -> Gõ phím -> Xóa
                    await input.focus();
                    await page.keyboard.press('Control+A');
                    await page.keyboard.press('Delete');
                    await input.fill(" ");
                    await page.keyboard.press('Backspace');
                    await input.blur();
                } else {
                    // Dùng phím tắt xóa sạch dữ liệu cũ tránh lỗi dính chữ
                    await input.focus();
                    await page.keyboard.press('Control+A');
                    await page.keyboard.press('Delete');
                    await input.fill(value);
                    await input.blur();
                }
            };

            // Điền toàn bộ các trường dữ liệu nếu có định nghĩa trong JSON
            if (d.organizationName !== undefined) await fillField('Organization Name', d.organizationName);
            if (d.registrationNumber !== undefined) await fillField('Registration Number', d.registrationNumber);
            if (d.taxId !== undefined) await fillField('Tax ID', d.taxId);
            if (d.phone !== undefined) await fillField('Phone', d.phone);
            if (d.fax !== undefined) await fillField('Fax', d.fax);
            if (d.email !== undefined) await fillField('Email', d.email);
            if (d.addressStreet1 !== undefined) await fillField('Street 1', d.addressStreet1);
            if (d.addressStreet2 !== undefined) await fillField('Street 2', d.addressStreet2);
            if (d.city !== undefined) await fillField('City', d.city);
            if (d.stateProvince !== undefined) await fillField('State/Province', d.stateProvince);
            if (d.zipCode !== undefined) await fillField('Zip/Postal Code', d.zipCode);
            
            if (d.notes !== undefined) {
                const notes = page.locator('textarea');
                await notes.focus();
                await page.keyboard.press('Control+A');
                await page.keyboard.press('Delete');
                await notes.fill(d.notes);
            }

            // Nhấn Save
            await page.getByRole('button', { name: ' Save ' }).click();

            // Khối xác thực kết quả (Assertions)
            if (scenario.expected === "success") {
                const successToast = page.locator('.oxd-toast--success');
                await expect(successToast).toBeVisible({ timeout: 15000 });
                // Chờ Toast đóng hẳn để tránh che khuất nút Switch của test case tiếp theo
                await successToast.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
            }
            else if (scenario.expected === "error_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Organization Name' }) }).first();
                await expect(group.locator('.oxd-input-field-error-message')).toHaveText('Required', { timeout: 10000 });
            }
            else if (scenario.expected === "error_email") {
                const group = page.locator('.oxd-input-group').filter({ has: page.locator('.oxd-label', { hasText: 'Email' }) }).first();
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible({ timeout: 10000 });
            }
            else if (scenario.expected === "error_invalid") {
                // Kiểm tra cả 2 vùng sinh lỗi: Toast đỏ báo lỗi hoặc message đỏ dưới text field
                await expect(
                    page.locator('.oxd-toast--error, .oxd-input-field-error-message').first()
                ).toBeVisible({ timeout: 10000 });
            }
        });
    }
});

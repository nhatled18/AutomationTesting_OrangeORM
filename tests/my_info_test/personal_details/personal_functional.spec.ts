import { test, expect } from "@playwright/test";
import testData from "./data/personal_details.json";

test.describe("Personal Details - Functional Test", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails", { timeout: 60000 });
        
        // Chờ loader chính của trang biến mất hoàn toàn
        await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
        
        // Đảm bảo form đã hiển thị bằng cách đợi ô nhập liệu tên xuất hiện công khai
        await page.getByPlaceholder('First Name').waitFor({ state: 'visible', timeout: 15000 });
    });

    for (const scenario of testData) {
        test(`Scenario: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;
            
            // Đảm bảo không còn loader ngầm nào chạy trước khi điền dữ liệu
            await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});

            // --- SECTION 1: Standard Personal Details ---
            
            if (d.firstName !== undefined) await page.getByPlaceholder('First Name').fill(d.firstName);
            if (d.middleName !== undefined) await page.getByPlaceholder('Middle Name').fill(d.middleName);
            if (d.lastName !== undefined) await page.getByPlaceholder('Last Name').fill(d.lastName);

            if (d.otherId !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: /^Other Id$/ });
                await group.locator('input').fill(d.otherId);
            }
            if (d.licenseNumber !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: /^Driver's License Number$/ });
                await group.locator('input').fill(d.licenseNumber);
            }
            if (d.licenseExpiryDate !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: /^License Expiry Date$/ });
                await group.locator('input').fill(d.licenseExpiryDate);
            }

            // 🔥 FIX DROPDOWN 1: Chọn Nationality an toàn
            if (d.nationality !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: /^Nationality$/ });
                await group.locator('.oxd-select-wrapper').click();
                
                const dropdown = page.locator('.oxd-select-dropdown');
                await dropdown.waitFor({ state: 'visible', timeout: 5000 });
                await dropdown.getByRole('option', { name: d.nationality, exact: true }).click();
                
                // Ép đợi dropdown cũ ẩn đi hẳn trước khi làm việc với dropdown tiếp theo
                await dropdown.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
            }
            
            // 🔥 FIX DROPDOWN 2: Chọn Marital Status an toàn
            if (d.maritalStatus !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: /^Marital Status$/ });
                await group.locator('.oxd-select-wrapper').click();
                
                const dropdown = page.locator('.oxd-select-dropdown');
                await dropdown.waitFor({ state: 'visible', timeout: 5000 });
                await dropdown.getByRole('option', { name: d.maritalStatus, exact: true }).click();
                await dropdown.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
            }

            if (d.dob !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: /^Date of Birth$/ });
                await group.locator('input').fill(d.dob);
            }
            if (d.gender !== undefined) {
                await page.getByLabel(d.gender, { exact: true }).check({ force: true });
            }

            // Thực hiện Lưu Form 1 (Standard Details)
            const hasStandardData = d.firstName !== undefined || d.lastName !== undefined || d.otherId !== undefined || 
                                   d.licenseNumber !== undefined || d.nationality !== undefined || d.maritalStatus !== undefined || 
                                   d.dob !== undefined || d.gender !== undefined;

            if (hasStandardData) {
                await page.locator('form').getByRole('button', { name: ' Save ' }).first().click();
                
                if (scenario.expected === "success") {
                    // Chờ thông báo cập nhật thành công của Form 1 xuất hiện và tự ẩn đi
                    const toast = page.locator('.oxd-toast');
                    await expect(toast).toContainText('Successfully Updated', { timeout: 15000 });
                    await toast.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
                }
            }

            // --- SECTION 2: Custom Fields (Form 2) ---

            if (d.bloodType !== undefined || d.testField !== undefined) {
                // Đợi loader của Form 1 xử lý xong nếu có chạy gối đầu
                await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});

                if (d.bloodType !== undefined) {
                    const group = page.locator('.oxd-input-group').filter({ hasText: /^Blood Type$/ });
                    await group.locator('.oxd-select-wrapper').click();
                    
                    const dropdown = page.locator('.oxd-select-dropdown');
                    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
                    await dropdown.getByRole('option', { name: d.bloodType, exact: true }).click();
                    await dropdown.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
                }
                if (d.testField !== undefined) {
                    const group = page.locator('.oxd-input-group').filter({ hasText: /^Test_Field$/ });
                    await group.locator('input').fill(d.testField);
                }

                // Click nút Save THỨ HAI (Dành riêng cho Custom Fields)
                await page.locator('form').getByRole('button', { name: ' Save ' }).last().click();

                if (scenario.expected === "success_custom" || scenario.expected === "success") {
                    await expect(page.locator('.oxd-toast')).toContainText('Successfully Saved', { timeout: 15000 });
                }
            }

            // --- SECTION 3: Error Validations ---

            if (scenario.expected === "error_firstName_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.getByPlaceholder('First Name') });
                await expect(group.locator('.oxd-input-field-error-message')).toHaveText('Required');
            }
            else if (scenario.expected === "error_lastName_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.getByPlaceholder('Last Name') });
                await expect(group.locator('.oxd-input-field-error-message')).toHaveText('Required');
            }
            else if (scenario.expected === "error_date_format") {
                await expect(page.getByText(/Should be a valid date/i).first()).toBeVisible({ timeout: 10000 });
            }
        });
    }
});

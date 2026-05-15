import { test, expect } from "@playwright/test";
import testData from "./data/my_info.json";

test.describe("Functional Test - My Info Personal Details", () => {
    
    test.beforeEach(async ({ page }) => {
        // Vào trang My Info
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7");
        // Đợi cho loader biến mất hoàn toàn
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Nhập First Name
            if (d.firstName !== undefined) {
                const input = page.getByPlaceholder('First Name');
                await input.fill(''); // Xóa cũ
                await input.fill(d.firstName);
            }

            // Nhập Last Name
            if (d.lastName !== undefined) {
                const input = page.getByPlaceholder('Last Name');
                await input.fill(''); 
                await input.fill(d.lastName);
            }

            // Nhập Other Id
            if (d.otherId !== undefined) {
                const input = page.locator('div').filter({ hasText: /^Other Id$/ }).locator('input');
                await input.fill('');
                await input.fill(d.otherId);
            }

            // Chọn Nationality
            if (d.nationality !== undefined) {
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                await page.locator('div').filter({ hasText: /^Nationality$/ }).locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.nationality }).click();
            }

            // Chọn Marital Status
            if (d.maritalStatus !== undefined) {
                await page.locator('div').filter({ hasText: /^Marital Status$/ }).locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.maritalStatus }).click();
            }

            // Chọn Gender
            if (d.gender !== undefined) {
                await page.getByText(d.gender, { exact: true }).click();
            }

            // Nhấn Save (Nút đầu tiên cho Personal Details)
            // Đợi loader biến mất nếu có
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.locator('form').getByRole('button', { name: ' Save ' }).first().click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                await expect(page.getByText('Successfully Updated')).toBeVisible();
            } 
            else if (scenario.expected === "error_firstName_required") {
                // Kiểm tra thông báo Required của First Name (Dùng placeholder để lọc group)
                await expect(page.locator('.oxd-input-group').filter({ has: page.getByPlaceholder('First Name') }).locator('.oxd-input-field-error-message')).toContainText('Required');
            }
            else if (scenario.expected === "error_lastName_required") {
                // Kiểm tra thông báo Required của Last Name (Dùng placeholder để lọc group)
                await expect(page.locator('.oxd-input-group').filter({ has: page.getByPlaceholder('Last Name') }).locator('.oxd-input-field-error-message')).toContainText('Required');
            }
            else if (scenario.expected === "error_date_format") {
                // Giả sử có lỗi định dạng ngày (Dùng partial text)
                await expect(page.getByText('valid date')).toBeVisible();
            }
        });
    }
});

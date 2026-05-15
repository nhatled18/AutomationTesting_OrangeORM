import { test, expect } from "@playwright/test";
import testData from "./data/general_info_all.json";

test.describe("Advanced Data-Driven Testing - Organization General Info", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation");
    });

    // Duyệt qua từng kịch bản trong file JSON tổng hợp
    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // 1. Bật chế độ Edit
            await page.locator('.oxd-switch-input').click();

            // 2. Điền dữ liệu (Chỉ điền những trường có trong JSON của kịch bản đó)
            if (d.organizationName !== undefined) {
                await page.locator('div').filter({ hasText: /^Organization Name$/ }).locator('input').fill(d.organizationName);
            }
            if (d.registrationNumber) {
                await page.locator('div').filter({ hasText: /^Registration Number$/ }).locator('input').fill(d.registrationNumber);
            }
            if (d.taxId) {
                await page.locator('div').filter({ hasText: /^Tax ID$/ }).locator('input').fill(d.taxId);
            }
            if (d.phone) {
                await page.locator('div').filter({ hasText: /^Phone$/ }).locator('input').fill(d.phone);
            }
            if (d.fax) {
                await page.locator('div').filter({ hasText: /^Fax$/ }).locator('input').fill(d.fax);
            }
            if (d.email !== undefined) {
                await page.locator('div').filter({ hasText: /^Email$/ }).locator('input').fill(d.email);
            }
            if (d.addressStreet1) {
                await page.locator('div').filter({ hasText: /^Address Street 1$/ }).locator('input').fill(d.addressStreet1);
            }
            if (d.city) {
                await page.locator('div').filter({ hasText: /^City$/ }).locator('input').fill(d.city);
            }
            if (d.country) {
                await page.locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.country }).click();
            }
            if (d.notes) {
                await page.locator('div').filter({ hasText: /^Notes$/ }).locator('textarea').fill(d.notes);
            }

            // 3. Nhấn Save
            await page.getByRole('button', { name: ' Save ' }).click();

            // 4. Kiểm tra kết quả mong đợi (Assertion logic)
            if (scenario.expected === "success") {
                // Kiểm tra thông báo thành công
                await expect(page.getByText('Successfully Updated')).toBeVisible();
            } 
            else if (scenario.expected === "error_required") {
                // Kiểm tra lỗi bắt buộc cho Organization Name
                await expect(page.locator('div').filter({ hasText: /^Organization Name$/ }).getByText('Required')).toBeVisible();
            } 
            else if (scenario.expected === "error_email") {
                // Kiểm tra lỗi định dạng email
                await expect(page.getByText('Expected format: admin@example.com')).toBeVisible();
            }
        });
    }
});

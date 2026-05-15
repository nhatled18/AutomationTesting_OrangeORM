import { test, expect } from "@playwright/test";
import testData from "./data/add_candidate.json";

test.describe("Functional Test - Recruitment Add Candidate", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate");
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Nhập Họ tên
            if (d.firstName !== undefined) await page.getByPlaceholder('First Name').fill(d.firstName);
            if (d.lastName !== undefined) await page.getByPlaceholder('Last Name').fill(d.lastName);

            // Nhập Email
            if (d.email !== undefined) {
                // Có 2 trường 'Type here', ta dùng locator cụ thể hơn
                await page.locator('div').filter({ hasText: /^Email$/ }).locator('input').fill(d.email);
            }

            // Nhập Contact Number
            if (d.contactNumber !== undefined) {
                await page.locator('div').filter({ hasText: /^Contact Number$/ }).locator('input').fill(d.contactNumber);
            }

            // Nhập Keywords
            if (d.keywords !== undefined) {
                await page.getByPlaceholder('Enter comma seperated words...').fill(d.keywords);
            }

            // Nhập Notes
            if (d.notes !== undefined) {
                await page.getByPlaceholder('Type here').last().fill(d.notes);
            }

            // Nhấn Save
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                await expect(page.getByText('Successfully Saved')).toBeVisible();
                // Sau khi lưu thường sẽ chuyển sang trang xem chi tiết ứng viên (URL chứa viewCandidate hoặc addCandidate/{id})
                await expect(page).toHaveURL(/.*(viewCandidate|addCandidate).*/);
            } 
            else if (scenario.expected === "error_email_required") {
                await expect(page.locator('.oxd-input-group').filter({ has: page.getByPlaceholder('Type here').first() }).locator('.oxd-input-field-error-message')).toContainText('Required');
            }
        });
    }
});

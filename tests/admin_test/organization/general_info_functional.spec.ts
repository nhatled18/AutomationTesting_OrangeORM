import { test, expect } from "@playwright/test";
import testData from "./data/general_info.json";

test.describe("Advanced Data-Driven Testing - Organization General Info", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        
        // QUAN TRỌNG: Phải bật chế độ Edit mới có thể chỉnh sửa và trigger validation
        const editSwitch = page.locator('.oxd-switch-input');
        if (await editSwitch.isVisible()) {
            await editSwitch.click();
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        }
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Nhập Organization Name
            if (d.name !== undefined) {
                const nameInput = page.locator('.oxd-input-group').filter({ hasText: 'Organization Name' }).locator('input');
                await nameInput.fill('');
                await nameInput.fill(d.name);
                await nameInput.blur(); // Trigger validation
            }

            // Nhập Email
            if (d.email !== undefined) {
                const emailInput = page.locator('.oxd-input-group').filter({ hasText: 'Email' }).locator('input');
                await emailInput.fill('');
                await emailInput.fill(d.email);
                await emailInput.blur();
            }

            // Nhấn Save
            await page.getByRole('button', { name: ' Save ' }).click();

            // Kiểm tra kết quả
            if (scenario.expected === "success") {
                await expect(page.getByText(/Success/i).first()).toBeVisible();
            } 
            else if (scenario.expected === "error_required") {
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Organization Name' });
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible();
            } 
            else if (scenario.expected === "error_email") {
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Email' });
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible();
            }
        });
    }
});

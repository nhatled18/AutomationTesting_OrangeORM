import { test, expect } from "@playwright/test";
import testData from "./data/general_info_all.json";

test.describe("Advanced Data-Driven Testing - Organization General Info", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation", {
            waitUntil: 'domcontentloaded'
        });
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 30000 });

        // Bật Edit mode nếu cần
        const nameInput = page.locator('.oxd-input-group').filter({ hasText: 'Organization Name' }).locator('input');
        const isEnabled = await nameInput.isEnabled().catch(() => false);

        if (!isEnabled) {
            await page.locator('.oxd-switch-wrapper').click().catch(() => {});
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
            await expect(nameInput).toBeEnabled({ timeout: 10000 });
        }
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Helper fill field
            const fillField = async (label: string, value: string) => {
                const input = page.locator('.oxd-input-group').filter({ hasText: label }).locator('input');
                await input.fill('');
                await input.fill(value);
                await input.blur();
            };

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
                await notes.fill('');
                await notes.fill(d.notes);
            }

            // Nhấn Save
            await page.getByRole('button', { name: ' Save ' }).click();

            // Assert kết quả
            if (scenario.expected === "success") {
                await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 15000 });
            }
            else if (scenario.expected === "error_required") {
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Organization Name' });
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible();
            }
            else if (scenario.expected === "error_email") {
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Email' });
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible();
            }
            else if (scenario.expected === "error_invalid") {
                // App có thể show error toast hoặc error message
                await expect(
                    page.locator('.oxd-toast--error, .oxd-input-field-error-message').first()
                ).toBeVisible({ timeout: 5000 });
            }
        });
    }
});
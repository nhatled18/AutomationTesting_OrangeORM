import { test, expect } from "@playwright/test";
import testData from "./data/personal_details.json";

test.describe("Personal Details - Functional Test", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails", { timeout: 60000 });
        // Wait for all loaders to disappear
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(2000);
        
        // Just ensure page is ready by looking for any input element
        try {
            await page.locator('input[type="text"], input[placeholder*="First"]').first().waitFor({ state: 'visible', timeout: 10000 });
        } catch (e) {
            console.warn('⚠️  Page may not have loaded completely, but continuing with test');
        }
    });

    for (const scenario of testData) {
        test(`Scenario: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;
            await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });

            // --- SECTION 1: Standard Personal Details ---
            
            // Names
            if (d.firstName !== undefined) await page.getByPlaceholder('First Name').fill(d.firstName);
            if (d.middleName !== undefined) await page.getByPlaceholder('Middle Name').fill(d.middleName);
            if (d.lastName !== undefined) await page.getByPlaceholder('Last Name').fill(d.lastName);

            // IDs & Licenses
            if (d.otherId !== undefined) {
                await page.locator('.oxd-input-group').filter({ hasText: 'Other Id' }).locator('input').fill(d.otherId);
            }
            if (d.licenseNumber !== undefined) {
                await page.locator('.oxd-input-group').filter({ hasText: "Driver's License Number" }).locator('input').fill(d.licenseNumber);
            }
            if (d.licenseExpiryDate !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: 'License Expiry Date' });
                await group.locator('input').fill(d.licenseExpiryDate);
            }

            // Dropdowns
            if (d.nationality !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Nationality' });
                await group.locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.nationality }).click();
            }
            if (d.maritalStatus !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Marital Status' });
                await group.locator('.oxd-select-wrapper').click();
                await page.getByRole('option', { name: d.maritalStatus }).click();
            }

            // Date of Birth & Gender
            if (d.dob !== undefined) {
                const group = page.locator('.oxd-input-group').filter({ hasText: 'Date of Birth' });
                await group.locator('input').fill(d.dob);
            }
            if (d.gender !== undefined) {
                await page.getByLabel(d.gender, { exact: true }).check({ force: true });
            }

            // Check if we need to save standard details
            const hasStandardData = d.firstName !== undefined || d.lastName !== undefined || d.otherId !== undefined || 
                                   d.licenseNumber !== undefined || d.nationality !== undefined || d.maritalStatus !== undefined || 
                                   d.dob !== undefined || d.gender !== undefined;

            if (hasStandardData) {
                await page.locator('form').getByRole('button', { name: ' Save ' }).first().click();
                
                // Success validation for standard section
                if (scenario.expected === "success") {
                    await expect(page.getByText(/Successfully Updated/i).first()).toBeVisible({ timeout: 15000 });
                    await page.locator('.oxd-toast').waitFor({ state: 'detached' });
                }
            }

            // --- SECTION 2: Custom Fields ---

            if (d.bloodType !== undefined || d.testField !== undefined) {
                if (d.bloodType !== undefined) {
                    const group = page.locator('.oxd-input-group').filter({ hasText: 'Blood Type' });
                    await group.locator('.oxd-select-wrapper').click();
                    await page.getByRole('option', { name: d.bloodType }).click();
                }
                if (d.testField !== undefined) {
                    const group = page.locator('.oxd-input-group').filter({ hasText: 'Test_Field' });
                    await group.locator('input').fill(d.testField);
                }

                // Click the SECOND Save button (for Custom Fields)
                await page.locator('form').getByRole('button', { name: ' Save ' }).last().click();

                if (scenario.expected === "success_custom" || scenario.expected === "success") {
                    await expect(page.getByText(/Successfully Saved/i).first()).toBeVisible({ timeout: 15000 });
                }
            }

            // --- SECTION 3: Error Validations ---

            if (scenario.expected === "error_firstName_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.getByPlaceholder('First Name') });
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible();
            }
            else if (scenario.expected === "error_lastName_required") {
                const group = page.locator('.oxd-input-group').filter({ has: page.getByPlaceholder('Last Name') });
                await expect(group.locator('.oxd-input-field-error-message')).toBeVisible();
            }
            else if (scenario.expected === "error_date_format") {
                // Kiểm tra xem có hiện thông báo lỗi format ngày tháng không
                await expect(page.getByText(/Should be a valid date in yyyy-dd-mm format/i).first()).toBeVisible();
            }
        });
    }
});

import { test, expect } from "@playwright/test";

test.describe("Personal Details - UI Test", () => {

    test.beforeEach(async ({ page }) => {
        // Điều hướng trực tiếp đến trang Personal Details của nhân viên (ví dụ empNumber 7)
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    test("Verify all input fields and labels in Personal Details section", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

        // Names
        await expect(page.getByPlaceholder('First Name')).toBeVisible();
        await expect(page.getByPlaceholder('Middle Name')).toBeVisible();
        await expect(page.getByPlaceholder('Last Name')).toBeVisible();

        // Identifiers
        await expect(page.locator('label').filter({ hasText: 'Employee Id' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Other Id' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: "Driver's License Number" })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'License Expiry Date' })).toBeVisible();

        // Dropdowns & Selections
        await expect(page.locator('label').filter({ hasText: 'Nationality' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Marital Status' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Date of Birth' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Gender' })).toBeVisible();
        
        await expect(page.getByText('Male', { exact: true })).toBeVisible();
        await expect(page.getByText('Female', { exact: true })).toBeVisible();

        // Save Button
        await expect(page.locator('form').getByRole('button', { name: ' Save ' }).first()).toBeVisible();
    });

    test("Verify Custom Fields section and elements", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Custom Fields' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Blood Type' })).toBeVisible();
        await expect(page.locator('form').getByRole('button', { name: ' Save ' }).last()).toBeVisible();
    });
});

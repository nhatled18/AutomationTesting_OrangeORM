import { test, expect } from "@playwright/test";

test.describe("UI Test - My Info Personal Details", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7");
    });

    test("Kiểm tra các thành phần giao diện Sidebar bên trái", async ({ page }) => {
        const leftMenu = page.locator('.orangehrm-tabs');
        const expectedItems = [
            "Personal Details",
            "Contact Details",
            "Emergency Contacts",
            "Dependents",
            "Immigration",
            "Job",
            "Salary",
            "Report-to",
            "Qualifications",
            "Memberships"
        ];

        for (const item of expectedItems) {
            await expect(leftMenu.getByText(item)).toBeVisible();
        }
    });

    test("Kiểm tra các trường thông tin trong Personal Details", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

        // Kiểm tra Full Name
        await expect(page.getByPlaceholder('First Name')).toBeVisible();
        await expect(page.getByPlaceholder('Middle Name')).toBeVisible();
        await expect(page.getByPlaceholder('Last Name')).toBeVisible();

        // Kiểm tra các ID và License
        await expect(page.locator('label').filter({ hasText: 'Employee Id' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Other Id' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: "Driver's License Number" })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'License Expiry Date' })).toBeVisible();

        // Kiểm tra Dropdowns
        await expect(page.locator('label').filter({ hasText: 'Nationality' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Marital Status' })).toBeVisible();

        // Kiểm tra Date of Birth và Gender
        await expect(page.locator('label').filter({ hasText: 'Date of Birth' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Gender' })).toBeVisible();
        await expect(page.getByText('Male', { exact: true })).toBeVisible();
        await expect(page.getByText('Female', { exact: true })).toBeVisible();

        // Kiểm tra nút Save
        await expect(page.locator('form').getByRole('button', { name: ' Save ' }).first()).toBeVisible();
    });

    test("Kiểm tra khu vực Custom Fields", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Custom Fields' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Blood Type' })).toBeVisible();
        await expect(page.locator('form').getByRole('button', { name: ' Save ' }).last()).toBeVisible();
    });
});

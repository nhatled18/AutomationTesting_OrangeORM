import { test, expect } from "@playwright/test";

test.describe("My Info - General UI Test", () => {

    test.beforeEach(async ({ page }) => {
        // Đi tới trang My Info chính
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    test("Verify Sidebar Menu items are visible in My Info module", async ({ page }) => {
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
});

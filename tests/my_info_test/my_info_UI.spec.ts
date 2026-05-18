import { test, expect } from "@playwright/test";

test.describe("My Info - General UI Test", () => {

    test.beforeEach(async ({ page }) => {
        // Đi tới trang My Info chính
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    test("Verify Sidebar Menu items are visible in My Info module", async ({ page }) => {
        // Wait for page to fully load
        await page.waitForTimeout(1000);
        // Try to find the tabs container - it might be .orangehrm-tabs or .orangehrm-menu--tabs
        const tabsContainer = page.locator('.orangehrm-tabs, .orangehrm-menu--tabs');
        await expect(tabsContainer).toBeVisible({ timeout: 15000 });
        
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
            await expect(tabsContainer.getByText(item)).toBeVisible({ timeout: 10000 });
        }
    });
});

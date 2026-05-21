import { test, expect } from "@playwright/test";

test.describe("UI Test - Organization General Information", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation");
    await page.locator('.oxd-form-loader, .oxd-loading-spinner, .oxd-table-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    });

    test("Kiểm tra hiển thị đầy đủ các trường thông tin (Read-only mode)", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'General Information' })).toBeVisible();
        
        // Kiểm tra các label chính
        const labels = [
            "Organization Name", "Number of Employees", "Registration Number", 
            "Tax ID", "Phone", "Fax", "Email", "Address Street 1", 
            "City", "State/Province", "Zip/Postal Code", "Country", "Notes"
        ];

        for (const labelName of labels) {
            await expect(page.getByText(labelName, { exact: true })).toBeVisible();
        }

        // Kiểm tra nút Edit toggle
        await expect(page.locator('.oxd-switch-input')).toBeVisible();
    });
});

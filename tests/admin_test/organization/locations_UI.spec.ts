import { test, expect } from "@playwright/test";

test.describe("UI Test - Organization Locations", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewLocations");
    });

    test("Kiểm tra bộ lọc và tiêu đề danh sách", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Locations' })).toBeVisible();

        // Kiểm tra các nhãn của bộ lọc
        await expect(page.getByText('Name', { exact: true })).toBeVisible();
        await expect(page.getByText('City', { exact: true })).toBeVisible();
        await expect(page.getByText('Country', { exact: true })).toBeVisible();

        await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng danh sách địa điểm", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        const expectedHeaders = ["Name", "City", "Country", "Phone", "Number of Employees", "Actions"];

        for (const h of expectedHeaders) {
            await expect(header.getByText(h, { exact: true })).toBeVisible();
        }
    });

    test("Kiểm tra nút Add điều hướng đến trang Add Location", async ({ page }) => {
        await page.getByRole('button', { name: ' Add ' }).click();

        // Xác nhận đã chuyển trang
        await expect(page).toHaveURL(/.*saveLocation/);
        await expect(page.getByRole('heading', { name: 'Add Location' })).toBeVisible();
    });
});

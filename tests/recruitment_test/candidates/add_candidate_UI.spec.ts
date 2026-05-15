import { test, expect } from "@playwright/test";

test.describe("UI Test - Recruitment Add Candidate", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate");
    });

    test("Kiểm tra các thành phần giao diện trang Add Candidate", async ({ page }) => {
        // Kiểm tra tiêu đề
        await expect(page.getByRole('heading', { name: 'Add Candidate' })).toBeVisible();

        // Kiểm tra Họ tên
        await expect(page.getByPlaceholder('First Name')).toBeVisible();
        await expect(page.getByPlaceholder('Middle Name')).toBeVisible();
        await expect(page.getByPlaceholder('Last Name')).toBeVisible();

        // Kiểm tra Vacancy dropdown
        await expect(page.getByText('Vacancy')).toBeVisible();
        await expect(page.locator('.oxd-select-wrapper')).toBeVisible();

        // Kiểm tra Email và Contact Number
        await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Contact Number' })).toBeVisible();

        // Kiểm tra khu vực Resume upload
        await expect(page.getByText('Resume')).toBeVisible();
        await expect(page.getByText('Browse')).toBeVisible();

        // Kiểm tra Keywords, Date of Application, Notes
        await expect(page.locator('label').filter({ hasText: 'Keywords' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Date of Application' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Notes' })).toBeVisible();

        // Kiểm tra Checkbox Consent
        await expect(page.getByText('Consent to keep data')).toBeVisible();

        // Kiểm tra nút bấm
        await expect(page.getByRole('button', { name: ' Cancel ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Save ' })).toBeVisible();
    });

    test("Kiểm tra các trường bắt buộc (dấu *)", async ({ page }) => {
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        await expect(page.getByText(/Full Name/i)).toBeVisible();
        await expect(page.getByText(/Email/i)).toBeVisible();
    });
});

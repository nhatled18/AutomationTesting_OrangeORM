import { test, expect } from "@playwright/test";

test.describe("UI Test - PIM Add Employee", () => {
    
    test.beforeEach(async ({ page }) => {
        // Đi tới trang Add Employee trực tiếp hoặc thông qua menu
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee");
    });

    test("Kiểm tra các thành phần giao diện chính", async ({ page }) => {
        // Kiểm tra các tab điều hướng
        await expect(page.getByText('Configuration')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Employee List' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Add Employee' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();

        // Kiểm tra tiêu đề trang
        await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();

        // Kiểm tra khu vực upload ảnh
        await expect(page.locator('.employee-image-wrapper')).toBeVisible();
        await expect(page.getByText('Accepts jpg, .png, .gif up to 1MB. Recommended dimensions: 200px X 200px')).toBeVisible();

        // Kiểm tra các trường nhập Họ tên
        await expect(page.getByPlaceholder('First Name')).toBeVisible();
        await expect(page.getByPlaceholder('Middle Name')).toBeVisible();
        await expect(page.getByPlaceholder('Last Name')).toBeVisible();

        // Kiểm tra trường Employee Id
        await expect(page.locator('label').filter({ hasText: 'Employee Id' })).toBeVisible();
        const empIdInput = page.locator('div').filter({ hasText: /^Employee Id$/ }).locator('input');
        await expect(empIdInput).toBeVisible();

        // Kiểm tra toggle Create Login Details
        await expect(page.getByText('Create Login Details')).toBeVisible();
        await expect(page.locator('.oxd-switch-input')).toBeVisible();

        // Kiểm tra các nút bấm
        await expect(page.getByRole('button', { name: ' Cancel ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Save ' })).toBeVisible();
    });

    test("Kiểm tra các trường bắt buộc (hiển thị dấu *)", async ({ page }) => {
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        // Sử dụng regex để bắt được nhãn kể cả khi dấu * nằm ở element khác
        await expect(page.getByText(/Employee Full Name/i)).toBeVisible();
    });

    test("Kiểm tra hiển thị thêm các trường khi bật Create Login Details", async ({ page }) => {
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        // Bật toggle (Click vào switch input cho chuẩn)
        await page.locator('.oxd-switch-input').click();

        // Kiểm tra các trường mới hiện ra
        await expect(page.locator('label').filter({ hasText: 'Username' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Status' })).toBeVisible();
        await expect(page.getByText('Password', { exact: true })).toBeVisible();
        await expect(page.getByText('Confirm Password', { exact: true })).toBeVisible();

        // Kiểm tra các radio button Status
        await expect(page.getByText('Enabled')).toBeVisible();
        await expect(page.getByText('Disabled')).toBeVisible();
    });
});

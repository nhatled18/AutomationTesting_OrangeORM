import { test, expect } from "@playwright/test";

test.describe("UI Test - PIM Employee List", () => {
    
    test.beforeEach(async ({ page }) => {
        // Điều hướng đến trang Employee List
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList");
    });

    test("Kiểm tra tiêu đề và khu vực tìm kiếm", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();
        
        // Các trường tìm kiếm
        await expect(page.locator('label').filter({ hasText: 'Employee Name' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Employee Id' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Employment Status' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Include' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Supervisor Name' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Job Title' })).toBeVisible();
        await expect(page.locator('label').filter({ hasText: 'Sub Unit' })).toBeVisible();
    });

    test("Kiểm tra các nút thao tác", async ({ page }) => {
        await expect(page.getByRole('button', { name: ' Reset ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Search ' })).toBeVisible();
        await expect(page.getByRole('button', { name: ' Add ' })).toBeVisible();
    });

    test("Kiểm tra cấu trúc bảng danh sách nhân viên", async ({ page }) => {
        const header = page.locator('.oxd-table-header');
        
        await expect(header.getByText('Id')).toBeVisible();
        await expect(header.getByText('First (& Middle) Name')).toBeVisible();
        await expect(header.getByText('Last Name')).toBeVisible();
        await expect(header.getByText('Job Title')).toBeVisible();
        await expect(header.getByText('Employment Status')).toBeVisible();
        await expect(header.getByText('Sub Unit')).toBeVisible();
        await expect(header.getByText('Supervisor')).toBeVisible();
        await expect(header.getByText('Actions')).toBeVisible();
    });

    test("Kiểm tra hiển thị icon Sửa và Xóa trong bảng", async ({ page }) => {
        const firstRow = page.locator('.oxd-table-card').first();
        // Kiểm tra nếu có dữ liệu
        if (await firstRow.isVisible()) {
            await expect(firstRow.locator('.bi-trash')).toBeVisible();
            await expect(firstRow.locator('.bi-pencil-fill')).toBeVisible();
        }
    });
});

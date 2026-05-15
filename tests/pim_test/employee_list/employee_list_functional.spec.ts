import { test, expect } from "@playwright/test";
import testData from "./data/employee_search.json";

test.describe("Functional Test - PIM Employee List Search", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList");
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Nhập Employee Id nếu có
            if (d.employeeId !== undefined) {
                await page.locator('div').filter({ hasText: /^Employee Id$/ }).locator('input').fill(d.employeeId);
            }

            // Nhập Employee Name nếu có
            if (d.employeeName !== undefined) {
                const nameInput = page.locator('div').filter({ hasText: /^Employee Name$/ }).locator('input');
                await nameInput.fill(d.employeeName);
                // Với autocomplete của OrangeHRM, thường cần đợi dropdown hiện ra rồi chọn
                await page.waitForTimeout(1000);
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
            }

            // Nhấn Search
            await page.getByRole('button', { name: ' Search ' }).click();

            // Đợi kết quả load xong
            await page.waitForTimeout(2000); // Tạm thời dùng timeout để đợi API load xong

            if (scenario.expected === "found") {
                // Mong đợi có ít nhất 1 bản ghi
                const rows = page.locator('.oxd-table-card');
                await expect(rows.first()).toBeVisible();
            } 
            else if (scenario.expected === "not_found") {
                // Mong đợi thông báo No Records Found
                await expect(page.getByText('No Records Found')).toBeVisible();
            }
        });
    }
});

import { test, expect } from "@playwright/test";
import testData from "./data/reports.json";

test.describe("Functional Test - PIM Reports", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewDefinedPredefinedReports");
    });

    for (const scenario of testData) {
        test(`Kịch bản: ${scenario.scenario}`, async ({ page }) => {
            const d = scenario.data;

            // Nhập Report Name
            if (d.reportName !== undefined) {
                const searchInput = page.getByPlaceholder('Type for hints...');
                await searchInput.fill(d.reportName);
                
                // Nếu là kịch bản tìm kiếm thành công, đợi dropdown và chọn
                if (scenario.expected !== "not_found") {
                    await page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'visible' });
                    await page.keyboard.press('ArrowDown');
                    await page.keyboard.press('Enter');
                    // Quan trọng: Đợi giá trị input cập nhật từ dropdown (thường input sẽ chứa giá trị đã chọn thay vì d.reportName thô)
                    // Hoặc đơn giản là đợi dropdown biến mất
                    await page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'hidden' });
                }
            }

            if (scenario.expected === "reset") {
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                await page.getByRole('button', { name: ' Reset ' }).click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                // Đợi input thực sự trống
                await expect(page.getByPlaceholder('Type for hints...')).toHaveValue('', { timeout: 10000 });
            } else {
                // Nhấn Search
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                await page.getByRole('button', { name: ' Search ' }).click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });

                if (scenario.expected === "found") {
                    // Kiểm tra bảng có dữ liệu (ít nhất 1 dòng)
                    await expect(page.locator('.oxd-table-card').first()).toBeVisible({ timeout: 15000 });
                } 
                else if (scenario.expected === "not_found") {
                    // Kiểm tra thông báo không tìm thấy (Dùng locator bảng để chính xác)
                    await expect(page.locator('.oxd-table-body')).toContainText('No Records Found', { timeout: 15000 });
                }
            }
        });
    }

    test("Kiểm tra chuyển hướng khi nhấn nút Add Report", async ({ page }) => {
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
        await page.getByRole('button', { name: ' Add ' }).click();
        await expect(page).toHaveURL(/.*definePredefinedReport/);
        await expect(page.getByRole('heading', { name: 'Define Report' })).toBeVisible();
    });
});

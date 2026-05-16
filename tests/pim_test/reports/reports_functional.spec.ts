import { test, expect } from "@playwright/test";

test.describe("Functional Test - PIM Reports", () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewDefinedPredefinedReports");
        await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
    });

    const scenarios = [
        { scenario: "Tìm kiếm report tồn tại", data: { reportName: "All Employee Sub Unit Hierarchy Report" }, expected: "found" },
        { scenario: "Tìm kiếm report không tồn tại", data: { reportName: "Non Existent Report" }, expected: "not_found" },
        { scenario: "Reset bộ lọc", data: { reportName: "PIM Sample Report" }, expected: "reset" }
    ];

    for (const d of scenarios) {
        test(`Kịch bản: ${d.scenario}`, async ({ page }) => {
            if (d.data.reportName) {
                const input = page.getByPlaceholder('Type for hints...');
                await input.fill(d.data.reportName);
                
                // Nếu là report tồn tại, chọn từ dropdown
                if (d.expected !== "not_found") {
                    await page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'visible' });
                    // Click trực tiếp vào option chứa text mong muốn thay vì dùng phím mũi tên
                    await page.locator('.oxd-autocomplete-option').filter({ hasText: d.data.reportName }).click();
                    await page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'hidden' });
                }
            }

            if (d.expected === "reset") {
                await page.getByRole('button', { name: ' Reset ' }).click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });
                await expect(page.getByPlaceholder('Type for hints...')).toHaveValue('');
            } else {
                await page.getByRole('button', { name: ' Search ' }).click();
                await page.locator('.oxd-form-loader').waitFor({ state: 'detached' });

                if (d.expected === "found") {
                    // Kiểm tra xem report có xuất hiện trong bảng không
                    await expect(page.locator('.oxd-table-card')).toContainText(d.data.reportName);
                } 
                else if (d.expected === "not_found") {
                    // Kiểm tra thông báo không tìm thấy
                    await expect(page.locator('.oxd-table-body')).toContainText('No Records Found', { timeout: 15000 });
                }
            }
        });
    }

    test("Kiểm tra chuyển hướng khi nhấn nút Add Report", async ({ page }) => {
        await page.getByRole('button', { name: ' Add ' }).click();
        await expect(page).toHaveURL(/.*definePredefinedReport/);
        // Nới lỏng check heading vì tiêu đề có thể là "Define Report" hoặc "Add Report"
        await expect(page.locator('h6').first()).toContainText(/Report/i);
    });
});

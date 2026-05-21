import { test, expect } from "@playwright/test";

test.describe("My Info - General UI Test", () => {

    test.beforeEach(async ({ page }) => {
        // Đi tới trang My Info chính
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails");
        
        // Chờ tất cả các loại loader của trang biến mất hoàn toàn
        await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    });

    test("Verify Sidebar Menu items are visible in My Info module", async ({ page }) => {
        // 🔥 FIX SELECTOR CHUẨN: Định vị đúng khối menu điều hướng của phần Edit Employee / My Info
        const tabsContainer = page.locator('.orangehrm-edit-employee-navigation, [role="navigation"]').first();
        
        // Xác thực khối menu này phải hiển thị trên màn hình
        await expect(tabsContainer).toBeVisible({ timeout: 15000 });
        
        // Bộ dữ liệu các mục cần kiểm tra hiển thị
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

        // Quét qua từng mục để kiểm tra hiển thị trên thanh menu phụ
        for (const item of expectedItems) {
            const tabItem = tabsContainer.getByText(item, { exact: true });
            
            // Tối ưu: Tự động cuộn đến phần tử nếu danh sách bị tràn màn hình (nhất là trên chế độ Headless)
            await tabItem.scrollIntoViewIfNeeded().catch(() => {});
            
            // Xác thực mục menu hiển thị rõ ràng
            await expect(tabItem).toBeVisible({ timeout: 10000 });
        }
    });
});

import { test } from "@playwright/test";

test("login", async ({ page }) => {
    await page.goto("ttps://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    await page.getByPlaceholder("Username").fill("Admin");
    await page.getByPlaceholder("Password").fill("Admin123");
    await page.getByRole("button", { name: "Login" }).click();
})

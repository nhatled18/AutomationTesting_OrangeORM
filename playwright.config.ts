import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',

    // ✅ Tăng lên 120s — server demo đôi khi rất chậm
    timeout: 120000,

    expect: {
        // ✅ Tăng lên 20s — chờ element xuất hiện lâu hơn
        timeout: 20000,
    },

    fullyParallel: false,
    forbidOnly: !!process.env.CI,

    // ✅ Tăng retry lên 2 — server demo bất ổn cần retry nhiều hơn
    retries: 2,

    // ✅ Giảm xuống 1 — quan trọng nhất! 3 workers làm server demo bị quá tải
    workers: 1,

    reporter: 'html',

    use: {
        locale: 'en-US',
        trace: 'retain-on-failure', // ✅ Giữ trace khi fail để debug dễ hơn

        // ✅ Thêm 2 timeout này — trước đây không set, dùng default rất ngắn
        actionTimeout: 30000,       // click, fill, select mỗi cái cho 30s
        navigationTimeout: 60000,   // page.goto cho 60s
    },

    projects: [
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
            // ✅ Tăng lên 120s — auth login cần thời gian khi server chậm
            timeout: 120000,
        },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
    ],
});
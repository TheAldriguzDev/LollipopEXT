// Portfolio login: populate the storage used by the original pages, then open the dashboard.
window.addEventListener('DOMContentLoaded', () => {
    const config = window.LOLLIPOP_DEMO;
    const licenseInput = document.getElementById('user-license');
    const loginButton = document.getElementById('login-btn');
    const logoutButton = document.getElementById('logout-btn');
    const dashboardLink = document.getElementById('dash_url');

    licenseInput.value = config.user.license;
    licenseInput.placeholder = config.user.license;
    dashboardLink.textContent = 'Open the demo dashboard';

    async function enterDemo() {
        const license = licenseInput.value.trim() || config.user.license;
        const syncData = {
            userLicense: license,
            userName: config.user.name,
            userDiscordName: config.user.name,
            userDiscordEmail: config.user.email,
            userProfilePic: config.user.avatar,
            userPlan: config.user.plan,
            profiles: JSON.stringify({ profiles: config.profiles.map(profile => ({
                name: profile.name,
                info: { ...profile.info }
            })) }),
            ...config.siteSettings,
            // Webhooks and OAuth settings are configured separately by each user.
        };
        const localData = {
            userSuccessCount: JSON.stringify(config.analytics),
            userSuccess: JSON.stringify({ data: config.history })
        };
        await Promise.all([
            chrome.storage.sync.set(syncData),
            chrome.storage.local.set(localData)
        ]);
        window.location.replace('./dashboard.html');
    }

    loginButton.addEventListener('click', enterDemo);
    licenseInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') enterDemo();
    });
    dashboardLink.addEventListener('click', enterDemo);
    logoutButton.addEventListener('click', async () => {
        await Promise.all([
            chrome.storage.sync.remove(['userLicense', 'userName', 'userDiscordName', 'userDiscordEmail', 'userProfilePic', 'userPlan']),
            chrome.storage.local.remove(['userSuccessCount', 'userSuccess'])
        ]);
        licenseInput.value = '';
    });
});

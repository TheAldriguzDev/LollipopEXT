// Sample values for the portfolio login. Store status stays OFF to avoid live automation.
window.LOLLIPOP_DEMO = Object.freeze({
    user: {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.invalid',
        avatar: '../images/lolliround.png',
        license: 'DEMO-2023-EXT',
        plan: 'Lifetime Demo'
    },
    analytics: { totalSuccess: 42, success: 36, failed: 6 },
    history: [
        { name: 'Air Max 1 Anniversary', store: 'Snipes', date: '05/04/2023', image: '../images/lolli.png' },
        { name: 'New Balance 2002R', store: 'Solebox', date: '02/04/2023', image: '../images/lolli.png' },
        { name: 'Retro Runner', store: 'Airness', date: '29/03/2023', image: '../images/lolli.png' }
    ],
    profiles: [
        { name: 'Personal', info: { firstName: 'Alex', lastName: 'Rivera', street: 'Example Lane', houseNumber: '42', city: 'Milan', postalCode: '20121', state: 'MI', country: 'Italy', email: 'alex.rivera@example.invalid', phone: '+39 000 000 0000' } },
        { name: 'Studio', info: { firstName: 'Taylor', lastName: 'Bianchi', street: 'Portfolio Avenue', houseNumber: '8', city: 'Rome', postalCode: '00186', state: 'RM', country: 'Italy', email: 'studio@example.invalid', phone: '+39 000 000 0001' } }
    ],
    siteSettings: {
        airnessStatus: 'OFF', airnessMode: 'single-cart', airnessProfile: 'Personal', airnessSku: 'DEMO-SKU-001',
        snipesStatus: 'OFF', snipesMin: '40', snipesMax: '44', snipesMode: 'human', snipesDelay: '1500',
        soleboxStatus: 'OFF', soleboxMin: '40', soleboxMax: '44',
        lvrStatus: 'OFF', lvrProfile: 'Personal', lvrMin: '8', lvrMax: '11'
    }
});

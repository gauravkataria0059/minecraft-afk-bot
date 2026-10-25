const mineflayer = require('mineflayer');

const serverConfig = {
    host: 'play.bananasmp.net',
    port: 25565,
    username: 'FLAMEYT9819', // Replace with your username
    version: '1.21.11'
};

function createBot() {
    const bot = mineflayer.createBot(serverConfig);

    bot.on('spawn', () => {
        console.log('Bot spawned in lobby.');

        // Step 1: Auto login
        setTimeout(() => {
            bot.chat('/login 9991311456'); // Replace with your password
            console.log('Sent login command. Waiting for GUI...');
        }, 3000);
    });

    // Step 2: Handle Chest GUI (Lifesteal selection)
    bot.on('windowOpen', async (window) => {
        console.log('GUI Menu opened! Looking for Lifesteal...');

        setTimeout(() => {
            const lifestealSlot = window.slots.find(item => 
                item && (
                    item.name.includes('red_dye') || 
                    (item.customName && item.customName.toLowerCase().includes('lifesteal'))
                )
            );

            if (lifestealSlot) {
                console.log(`Found Lifesteal at slot ${lifestealSlot.slot}! Clicking...`);
                bot.clickWindow(lifestealSlot.slot, 0, 0);
            }
        }, 1500);
    });

    // Resource Pack / Shaders Auto-Accept Code (PASTED HERE)
    bot.on('resourcePack', (url, hash) => {
        console.log('Resource pack detected. Auto-accepting...');
        bot.acceptResourcePack();
    });

    // Step 3: Auto-eat logic
    bot.on('physicsTick', () => {
        if (bot.food < 18) {
            const item = bot.inventory.items().find(i => 
                i.name.includes('steak') || 
                i.name.includes('bread') || 
                i.name.includes('carrot') || 
                i.name.includes('porkchop') ||
                i.name.includes('cooked')
            );

            if (item) {
                bot.equip(item, 'hand', (err) => {
                    if (err) return;
                    bot.consume((err) => {
                        if (err) console.log('Error eating: ' + err);
                    });
                });
            }
        }
    });

    // Step 4: Auto-reconnect
    bot.on('end', () => {
        console.log('Bot disconnected. Reconnecting in 10 seconds...');
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.log('Error:', err);
    });
}

createBot();

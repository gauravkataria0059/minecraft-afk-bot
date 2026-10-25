const mineflayer = require('mineflayer');

const serverConfig = {
    host: 'play.bananasmp.net',
    port: 25565,
    username: 'FLAMEYT9819',
    version: 1.21.11// Isse server version apne aap auto-detect ho jayega
};

function createBot() {
    const bot = mineflayer.createBot(serverConfig);

    bot.on('spawn', () => {
        console.log('Bot spawned in lobby successfully!');

        // Auto login script
        setTimeout(() => {
            bot.chat('/login 9991311456');
            console.log('Login command sent!');
        }, 3000);
    });

    // GUI/Menu auto click (Lifesteal selection)
    bot.on('windowOpen', async (window) => {
        console.log('GUI Menu opened! Searching for Lifesteal...');

        setTimeout(() => {
            const lifestealSlot = window.slots.find(item => 
                item && (
                    item.name.includes('red_dye') || 
                    (item.customName && item.customName.toLowerCase().includes('lifesteal'))
                )
            );

            if (lifestealSlot) {
                console.log(`Lifesteal found at slot ${lifestealSlot.slot}! Clicking...`);
                bot.clickWindow(lifestealSlot.slot, 0, 0);
            }
        }, 1500);
    });

    // Auto-accept server resource packs
    bot.on('resourcePack', () => {
        console.log('Accepting server resource pack...');
        bot.acceptResourcePack();
    });

    // Auto-eat food when hungry
    bot.on('physicsTick', () => {
        if (bot.food < 18) {
            const food = bot.inventory.items().find(i => 
                i.name.includes('steak') || 
                i.name.includes('bread') || 
                i.name.includes('cooked') ||
                i.name.includes('carrot')
            );

            if (food) {
                bot.equip(food, 'hand', (err) => {
                    if (!err) bot.consume(() => {});
                });
            }
        }
    });

    // Auto Reconnect if kicked
    bot.on('end', () => {
        console.log('Bot disconnected! Reconnecting in 10 seconds...');
        setTimeout(createBot, 1000000);
    });

    bot.on('error', (err) => {
        console.log('Bot Error:', err.message);
    });
}

createBot();

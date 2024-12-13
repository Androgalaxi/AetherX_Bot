const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        if (message.author.bot) return; // Ignore bot messages

        const [command, botInstanceNumber] = message.content.split(' ');

        if (command === '!botruninfo') {
            // Check if the user is allowed
            const allowedUsers = ['USER_ID_1', 'USER_ID_2']; // Replace with actual user IDs
            if (!allowedUsers.includes(message.author.id)) {
                return message.reply('no... not for u');
            }

            // Check if botInstanceNumber was provided
            if (!botInstanceNumber) {
                return message.reply(
                    'You need to specify a BotInstanceNumber. Example: `!botruninfo bt-123456` but if another bot instance is running, check that one'
                );
            }

            let updateCount = 0;
            // Send the first embed immediately
            message.reply({ embeds: [generateEmbed(botInstanceNumber, client)] }).then((sentMessage) => {
                const interval = setInterval(() => {
                    // Edit the previously sent message with new embed
                    sentMessage.edit({ embeds: [generateEmbed(botInstanceNumber, client)] });

                    // Stop after 60 updates
                    updateCount++;
                    if (updateCount >= 60) {
                        clearInterval(interval);
                    }
                }, 1000); // Update every second
            });
        }
    },
};

// Helper function to generate the embed
function generateEmbed(botInstanceNumber, client) {
    const totalSeconds = client.uptime / 1000;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedUptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // Get the bot's status (e.g., online, idle, dnd)
    const status = client.user.presence.status; // 'online', 'idle', 'dnd', 'invisible'

    // Get the bot's ping (latency)
    const ping = client.ws.ping;

    // Get the bot's status message (activity)
    const activity = client.user.presence.activities[0] || {}; // First activity, if any
    const activityName = activity.name || 'No activity, set one with /setstatus'; // Name of the activity, if set
    const activityType = activity.type ? ` (${activity.type})` : ''; // Type of activity (e.g., "PLAYING")

    // Create and return the embed with the bot information
    return new EmbedBuilder()
        .setColor('#00FF00') // Set embed color
        .setTitle('Bot Run Information')
        .addFields(
            { name: 'Bot Instance', value: botInstanceNumber, inline: true },
            { name: 'Status', value: status.charAt(0).toUpperCase() + status.slice(1), inline: true },
            { name: 'Ping', value: `${ping}ms`, inline: true },
            { name: 'Status Message', value: `${activityName}${activityType}`, inline: true },
            { name: 'Task', value: 'Processing Data', inline: true },
            { name: 'Uptime', value: formattedUptime, inline: true }
        )
        .setTimestamp();
}
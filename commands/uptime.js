const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Displays the bot\'s uptime'),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            // Ensure `client.uptime` is available
            if (!client || !client.uptime) {
                return interaction.reply({
                    content: "Uptime data is unavailable. The bot might have just restarted.",
                    flags: 64,
                });
            }

            // Calculate uptime
            const totalSeconds = Math.floor(client.uptime / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            // Log and respond
            console.log(`Online time: ${uptime}`);
            await interaction.reply({ content: `🕒 I have been online for: **${uptime}**`, flags: 64 });
        } catch (error) {
            console.error('Error handling /uptime command:', error);
            await interaction.reply({ content: 'An error occurred while calculating uptime.', flags: 64 });
        }
    }
};
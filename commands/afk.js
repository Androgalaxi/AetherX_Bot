const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set your AFK status with an optional message.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Optional AFK message')
                .setRequired(false)
        ),
    async execute(interaction) {
        const message = interaction.options.getString('message') || 'AFK';

        // Logic for setting AFK status
        const userId = interaction.user.id;
        const afkStatus = {
            message,
            timestamp: Date.now(),
        };

        // Store the AFK status in your database or in-memory storage
        // Example: assuming you have a global 'afkUsers' object
        global.afkUsers = global.afkUsers || {};
        global.afkUsers[userId] = afkStatus;

        // Respond to the interaction
        await interaction.reply({
            content: `You are now AFK${message !== 'AFK' ? `: "${message}"` : ''}.`,
            ephemeral: true,
        });
    },
};
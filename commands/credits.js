const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('Shows credits for the developers and contributors of AetherX'),
    
    async execute(interaction) {
        const creditsEmbed = new EmbedBuilder()
            .setColor(0x7289da)
            .setTitle('AetherX Bot Credits')
            .setDescription('Special thanks to the developers and contributors who made AetherX possible!')
            .addFields(
                { name: 'Full Credits', value: '[View Full Credits](https://aetherx-discord-bot.github.io/Credits/)' }
            )
            .setFooter({ text: 'AetherX Bot - Created by an amazing team of developers and contributors!' });

        await interaction.reply({ embeds: [creditsEmbed] });
    },
};
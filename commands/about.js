const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Shows information about the bot'),
    
    async execute(interaction) {
        const aboutEmbed = new EmbedBuilder()
            .setColor(0x7289da) // Discord's blurple color
            .setTitle('AetherX Bot Information')
            .setDescription('AetherX is a custom Discord bot designed by Androgalaxi and lmutt090.\n\nInvite the bot to your server using [this link](https://discord.com/oauth2/authorize?client_id=1067646246254284840) or the link below.')
            .addFields(
                { name: 'Developer', value: '[Androgalaxi](https://discord.com/users/435125886996709377) and [lmutt090](https://discord.com/users/1286383453016686705)' },
                { name: 'Bot Version', value: '0.3.0' },
                { name: 'Bot Invite Link', value: '[Invite AetherX](https://discord.com/oauth2/authorize?client_id=1067646246254284840)' },
                { name: 'Support Server', value: '[Join the Support Server](https://discord.gg/yFY8Fnbtp9)' },
                { name: '\u200B', value: '\u200B' }, // Blank field for spacing
                { name: 'Terms of Service', value: '[View Terms of Service](https://aetherx-discord-bot.github.io/TOS/)' },
                { name: 'Privacy Policy', value: '[View Privacy Policy](https://aetherx-discord-bot.github.io/PrivPOL/)' }
            )
            .setFooter({ text: 'AetherX - Created by Androgalaxi, lmutt090, and many other wonderful people' });

        await interaction.reply({ embeds: [aboutEmbed] });
    },
};
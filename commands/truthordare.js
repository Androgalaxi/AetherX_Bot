const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('truthordare')
        .setDescription('Play Truth or Dare!')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Choose Truth or Dare')
                .setRequired(true)
                .addChoices(
                    { name: 'Truth', value: 'truth' },
                    { name: 'Dare', value: 'dare' }
                )
        ),
    async execute(interaction) {
        const choice = interaction.options.getString('choice');
        const apiUrl = `https://api.truthordarebot.xyz/api/${choice}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                console.error(`API Error: ${response.statusText}`);
                throw new Error('Failed to fetch data from the API.');
            }

            const data = await response.json();
            const question = data.question || 'No question available. Try again later!';

            await interaction.reply({ content: question });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'An error occurred while fetching the Truth or Dare question. Please try again later.', 
                flags: 64 
            });
        }
    }
};
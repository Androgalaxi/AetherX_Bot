async function startCoinFlipGame(message) {
    const outcomes = ['Heads', 'Tails'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];

    const coinFlipEmbed = new EmbedBuilder()
        .setTitle('Coin Flip')
        .setDescription(`The coin landed on **${result}**!`)
        .setColor(0x00FF00);

    await message.channel.send({ embeds: [coinFlipEmbed] });
}

// Expose the coinflip logic for integration
module.exports = {
    name: 'coinflip',
    execute: (message) => {
        if (message.content === '!coinflip' || message.content === '!cf') {
            startCoinFlipGame(message);
        }
    }
};

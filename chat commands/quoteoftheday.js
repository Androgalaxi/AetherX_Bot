/*const axios = require('axios');

client.on('messageCreate', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commandName === 'quoteoftheday' || commandName === 'qotd') {
        const apiUrl = 'https://api.quotable.io/random'; // Changed to use random quote endpoint

        try {
            axios.get(apiUrl)
                .then(response => {
                    const quoteData = response.data; // Directly use response.data
                    const quote = quoteData.content;
                    const author = quoteData.author;

                    message.channel.send(`🌟 **Quote of the Day** 🌟\n> "${quote}"\n~ *${author}*`);
                })
                .catch(error => {
                    console.error('Error fetching quote:', error);
                    message.channel.send('❌ Sorry, I couldn’t fetch the quote of the day. Please try again later.');
                });
        } catch (error) {
            console.error('Error executing command:', error);
            message.channel.send('❌ There was an error executing that command.');
        }
    }
});*/
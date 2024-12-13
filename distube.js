const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

module.exports = (client) => {
    const distube = new DisTube(client, {
        plugins: [
            new YtDlpPlugin(), // Always add this as the last plugin
        ],
    });

    // Event: Manual song search (handled via search events)
    distube.on('searchResult', (message, result) => {
        let i = 0;
        message.channel.send(
            `**Choose a song by typing a number:**\n${result
                .map((song) => `${++i}. ${song.name} - \`${song.formattedDuration}\``)
                .join('\n')}`
        );
    });

    // Event: When a search is canceled
    distube.on('searchCancel', (message) => {
        message.channel.send('❌ Search canceled!');
    });

    // Event listener for playing the song after selecting a result
    distube.on('playSong', (queue, song) => {
        queue.textChannel.send(`Playing: **${song.name}** - \`${song.formattedDuration}\``);
    });

    // Command for manually searching and playing a song
    client.on('messageCreate', async (message) => {
        if (message.content.startsWith('!play')) {
            const query = message.content.slice(6).trim(); // Remove the '!play' part
            if (!query) return message.reply('Please provide a song name to search.');
            
            try {
                const results = await distube.search(query);
                if (results.length === 0) {
                    return message.reply('No results found.');
                }
                // Show search results to the user
                let i = 0;
                const response = await message.channel.send(
                    `**Choose a song by typing a number:**\n${results
                        .map((song) => `${++i}. ${song.name} - \`${song.formattedDuration}\``)
                        .join('\n')}`
                );

                // Wait for the user to select a song (simple example with a number)
                const filter = (m) => m.author.id === message.author.id && !isNaN(m.content);
                const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000 });

                if (collected.size === 0) {
                    return response.edit('❌ No song selected, search timed out.');
                }

                const selectedSong = results[parseInt(collected.first().content) - 1];
                distube.play(message.member.voice.channel, selectedSong.url, { textChannel: message.channel });
                response.edit(`✅ Now playing: **${selectedSong.name}** - \`${selectedSong.formattedDuration}\``);
            } catch (error) {
                console.error(error);
                message.reply('❌ Something went wrong while searching for the song.');
            }
        }
    });

    return distube;
};
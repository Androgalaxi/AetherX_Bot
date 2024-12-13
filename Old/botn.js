// Import the necessary modules
require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, REST, Routes } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SpotifyPlugin } = require('@distube/spotify');

// Create a new Discord client with intents to listen for messages
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences // Add this line for presence intent
    ]
});

// Set up DisTube for music functions (YouTube and Spotify)
const distube = new DisTube(client, {
    plugins: [new YtDlpPlugin(), new SpotifyPlugin()]
});

// Slash command registration
const commands = [
    {
        name: 'about',
        description: 'Provides information about the bot, developer, and invites.'
    }
];

const rest = new REST({ version: '10' }).setToken('YOUR_BOT_TOKEN');

// Register the slash commands when the bot is ready
client.once('ready', async () => {
    try {
        console.log('Bot is online!');

        // Register commands globally
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );

        // Set the bot's activity using await
        await client.user.setActivity('with broken commands', { type: 'PLAYING' });
        console.log('Slash commands registered successfully.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

// Handle interactionCreate event for slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'about') {
        const aboutEmbed = new EmbedBuilder()
            .setColor(0x7289da) // Discord's blurple color
            .setTitle('AetherX Bot Information')
            .setDescription('AetherX is a custom Discord bot designed by Androgalaxi and lmutt090.\n\nInvite the bot to your server using [this link](https://discord.com/oauth2/authorize?client_id=1067646246254284840&scope=bot&permissions=8) or the link below.')
            .addFields(
                { name: 'Developer', value: 'Androgalaxi and lmutt090' },
                { name: 'Bot Version', value: '1.0.0' },
                { name: 'Bot Invite Link', value: '[Invite AetherX](https://discord.com/oauth2/authorize?client_id=1067646246254284840&scope=bot&permissions=8)' },
                { name: 'Support Server', value: '[Join the Support Server](https://discord.gg/yFY8Fnbtp9)' }
            )
            .setFooter({ text: 'AetherX Bot - Created with suffering by Androgalaxi and lmutt090' });

        await interaction.reply({ embeds: [aboutEmbed] });
    }
});

// Variable to store the last help message
let lastHelpMessage;

// Function to send or edit help message based on the requested page
async function sendHelpMessage(message, page) {
    const helpPages = [
        {
            title: 'General Commands',
            description: '!ping - Displays the bot latency and API latency.\n!hello - The bot will greet and ping the user.\n!invite - Sends an invite link to add the bot to other servers.\n!help [page] - Shows this help menu with all available commands.\n!yippie - Sends a "Yippee" GIF.\n!global [message] - Sends a message to all servers where the bot is present.\n!about or !info - Provides information about the bot, developer, and invites.'
        },
        {
            title: 'Music Commands',
            description: '!play [song/URL] - Plays music from YouTube or Spotify, or searches for the song.\n!skip - Skips the currently playing song.\n!stop - Stops the music and clears the queue.\n!pause - Pauses the currently playing song.\n!resume - Resumes a paused song.\n!queue - Displays the current song queue.\n!skipto [number] - Skips to the song at the specified position in the queue.\n!volume [1-100] - Sets the volume of the music player.\n!nowplaying - Displays the currently playing song.\n!disconnect - Makes the bot leave the voice channel.\n!shuffle - Shuffles the current song queue.\n!lyrics [song name] - Fetches and displays the lyrics for the specified song.\n!seek [time] - Jumps to a specific time in the currently playing song.\n!repeat - Toggles repeat for the current song or the entire queue.\n!playlist [playlist name/URL] - Plays a specified playlist from a supported service.'
        },
        {
            title: 'Moderation Commands',
            description: '!ban [user] - Bans the mentioned user.\n!kick [user] - Kicks the mentioned user.\n!mute [user] - Mutes the mentioned user.\n!unmute [user] - Unmutes the mentioned user.\n!purge [amount] - Deletes a specified number of messages.\n!timeout [user] [time] - Times out a user for a specified duration.'
        }
    ];

    if (page < 1 || page > helpPages.length) {
        message.channel.send('Please provide a valid page number.');
        return;
    }

    const helpEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(helpPages[page - 1].title)
        .setDescription(helpPages[page - 1].description)
        .setFooter({ text: `Page ${page} of ${helpPages.length}` });

    // If there's already a help message, edit it; otherwise, send a new one
    if (lastHelpMessage) {
        await lastHelpMessage.edit({ embeds: [helpEmbed] });
    } else {
        lastHelpMessage = await message.channel.send({ embeds: [helpEmbed] });
    }
}

// Respond to specific messages
client.on('messageCreate', (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Respond to !ping command and send latency
    if (message.content === '!ping') {
        const sent = Date.now();
        message.channel.send('Pinging...').then(sentMessage => {
            const timeTaken = Date.now() - sent;
            sentMessage.edit(`Pong! Latency is ${timeTaken}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
        });
    }

    // Respond to !hello command and ping the user
    if (message.content === '!hello') {
        message.channel.send(`Hello, <@${message.author.id}>!`);
    }

    // Respond to !uptime command
    if (message.content === '!uptime') {
        const totalSeconds = (client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        message.channel.send(`I have been online for: ${uptime}`);
    }

    // Respond to !news command
    if (message.content === '!news') {
        // Placeholder removed here - integrate news API later
        const newsEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('Latest News')
            .setDescription('Added a request command (refer to !help to see the command)')
            .setFooter({ text: 'News provided by AetherX Bot' });

        message.channel.send({ embeds: [newsEmbed] });
    }

    // Respond to !help command with a specific page
    if (message.content.startsWith('!help')) {
        const args = message.content.split(' ').slice(1);
        const page = args.length > 0 ? parseInt(args[0].replace('page', '')) : 1; // Default to page 1
        sendHelpMessage(message, page);
    }

    // Respond to !yippie command and send the GIF
    if (message.content === '!yippie') {
        message.channel.send('https://tenor.com/view/lethal-company-horderbug-yippee-gif-gif-5658063361159083327');
    }

    // Respond to !about or !info command with bot information
    if (message.content === '!about' || message.content === '!info') {
        const aboutEmbed = new EmbedBuilder()
            .setColor(0x7289da) // Discord's blurple color
            .setTitle('AetherX Bot Information')
            .setDescription('AetherX is a custom Discord bot designed by Androgalaxi and lmutt090.\n\nInvite the bot to your server using [this link](https://discord.com/oauth2/authorize?client_id=1067646246254284840&scope=bot&permissions=8) or the link below.')
            .addFields(
                { name: 'Developer', value: 'Androgalaxi and lmutt090' },
                { name: 'Bot Version', value: '1.0.0' },
                { name: 'Bot Invite Link', value: '[Invite AetherX](https://discord.com/oauth2/authorize?client_id=1067646246254284840&scope=bot&permissions=8)' },
                { name: 'Support Server', value: '[Join the Support Server](https://discord.gg/yFY8Fnbtp9)' }
            )
            .setFooter({ text: 'AetherX Bot - Created with suffering by Androgalaxi and lmutt090' });

        message.channel.send({ embeds: [aboutEmbed] });
    }

    // !play command to search for songs or play by URL (YouTube or Spotify)
    if (message.content.startsWith('!play')) {
        const args = message.content.split(' ').slice(1).join(' ');

        if (message.member && !message.member.voice.channel) {
            return message.channel.send('You need to be in a voice channel to play music!');
        }

        if (!args) {
            return message.channel.send('Please provide a song name or URL.');
        }

        distube.play(message.member.voice.channel, args, {
            member: message.member,
            textChannel: message.channel,
            message
        });
    }

    // !skip command to skip the current song
    if (message.content === '!skip') {
        const queue = distube.getQueue(message);

        if (!queue) {
            return message.channel.send('There is nothing playing to skip.');
        }

        queue.skip();
        message.channel.send('Skipped the current song.');
    }

    // !stop command to stop the current queue and leave the voice channel
    if (message.content === '!stop') {
        const queue = distube.getQueue(message);

        if (!queue) {
            return message.channel.send('There is nothing playing to stop.');
        }

        queue.stop();
        message.channel.send('Stopped the music and cleared the queue.');
    }
});

// Handle errors for DisTube
distube
    .on('playSong', (queue, song) => {
        queue.textChannel.send(`Playing: ${song.name} - \`${song.formattedDuration}\`\nRequested by: ${song.user}`);
    })
    .on('addSong', (queue, song) => {
        queue.textChannel.send(`Added ${song.name} - \`${song.formattedDuration}\` to the queue.`);
    })
    .on('error', (channel, error) => {
        channel.send('An error occurred with the music player.');
        console.error(error);
    });

// Sends a DM to the Bot creator, Disabled if the Bot creator is in DND or "Offline"
// Ensure the function handling the request is asynchronous
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!request')) {
        const args = message.content.slice('!request'.length).trim(); // Get the message after the command

        // Check if there is any text provided after the command
        if (!args) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000) // Red color for error
                .setTitle('Error')
                .setDescription('Please provide a feature or command request after `!request`.');
            return message.channel.send({ embeds: [errorEmbed] });
        }

        try {
            // List of user IDs to DM (Add more user IDs if needed)
            const userIds = ['435125886996709377', '1286383453016686705']; // Replace with your user IDs

            // Create an embed for the request
            const requestEmbed = new EmbedBuilder()
                .setColor(0x00ff00) // Green color for the request
                .setTitle('Feature/Command Request')
                .setDescription(`**From:** ${message.author.tag}\n\n**Request:** ${args}`)
                .setTimestamp();

            let unavailableCount = 0;
            let availableCount = 0;

            // Send the request to all users in the list
            for (const userId of userIds) {
                try {
                    const user = await message.client.users.fetch(userId); // Fetch user
                    const guildMember = message.guild.members.cache.get(userId);
                    const userPresence = guildMember?.presence?.status;

                    // Check if user is offline or in DND
                    if (userPresence === 'offline' || userPresence === 'dnd') {
                        unavailableCount++;
                        continue; // Skip DM if the user is unavailable
                    }

                    await user.send({ embeds: [requestEmbed] });
                    availableCount++; // Count the successfully sent DM
                } catch (error) {
                    console.error(`Failed to send DM to ${userId}:`, error);
                    unavailableCount++; // Increment unavailable count if there's an error
                }
            }

            // Create an embed to inform the user who made the request
            const feedbackEmbed = new EmbedBuilder().setTitle('Request Status').setTimestamp();

            if (unavailableCount === userIds.length) {
                feedbackEmbed
                    .setColor(0xff0000) // Red color for failure
                    .setDescription('All recipients are currently unavailable (DND or offline). Please try again later or send an email to <email>.');
            } else if (unavailableCount > 0) {
                feedbackEmbed
                    .setColor(0xffa500) // Orange for partial success
                    .setDescription(`${unavailableCount} recipient(s) were unavailable, but your request was sent to ${availableCount} recipient(s).`);
            } else {
                feedbackEmbed
                    .setColor(0x00ff00) // Green for success
                    .setDescription('Your request has been sent to all recipients!');
            }

            // Send the feedback embed to the user in the same channel
            message.channel.send({ embeds: [feedbackEmbed] });
        } catch (error) {
            console.error('Error sending request:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000) // Red for error
                .setTitle('Error')
                .setDescription('There was an error sending your request. Please try again later.');
            message.channel.send({ embeds: [errorEmbed] });
        }
    }
});

// Login to Discord with your bot token
client.login(process.env.BOT_TOKEN);

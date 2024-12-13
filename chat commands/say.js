module.exports = {
    name: 'say', // Name of the command
    description: 'Repeats a user-provided message.', // Optional description
    execute: async (message) => {
        // Remove the command part "!say" and trim any whitespace
        const sayMessage = message.content.slice('!say'.length).trim();

        // If no message was provided, prompt the user to provide one
        if (!sayMessage) {
            return await message.channel.send('Please provide a message for the bot to say.');
        }

        // Send the user's message through the bot
        await message.channel.send(sayMessage);

        // Check if the bot has permission to delete the message, then delete it
        if (message.deletable) {
            await message.delete().catch((err) => {
                console.error('Failed to delete message:', err);
            });
        }
    },
};
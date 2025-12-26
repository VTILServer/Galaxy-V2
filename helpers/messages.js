function writeResponseMessage(title, message, channel, member, color = 0x00AAFF) {
    return channel.send({
        content: ``,
        embeds: [
            {
                title: title,
                description: message,
                color: color,
                footer: {}
            }
        ]
    });
}

function writeErrorMessage(message, channel, member) {
    return writeResponseMessage("Error", message, channel, member, 0xFF0000);
}

module.exports = { writeResponseMessage, writeErrorMessage };
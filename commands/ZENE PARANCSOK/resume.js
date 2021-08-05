﻿const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
    name: "resume",
    category: "ZENE PARANCSOK",
    aliases: ["r"],
    useage: "resume",
    description: "Resume the song",
    run: async (client, message, args) => {
        //if not a dj, return error
        //if(functions.check_if_dj(message))
        //return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ Nincs jogod végre hajtani a parancsot! Rang szükséges: ${functions.check_if_dj(message)}`)
    
        //If Bot not connected, return error
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nincs hallható zene")
        
        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " Kérlek lépj be egy hangcsatornába")
        
        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " Csatlakozz a hangcsatornámhoz: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)
        
        //if Bot is not paused, return error
        if (!client.distube.isPaused(message)) return functions.embedbuilder(client, "null", message, config.colors.no, "Nincs megállítva!")
        
        //send information embed
        functions.embedbuilder(client, 3000, message, config.colors.yes, "Resume!")

        //resume
        client.distube.resume(message);
    }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
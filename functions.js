const Discord = require("discord.js")
const config = require("./config.json")
module.exports.formatDate = formatDate;
module.exports.promptMessage = promptMessage;
module.exports.embedbuilder = embedbuilder;
module.exports.errorbuilder = errorbuilder;
module.exports.customplaylistembed = customplaylistembed;
module.exports.lyricsEmbed = lyricsEmbed;
module.exports.playsongyes = playsongyes;
module.exports.curembed = curembed;
module.exports.delay = delay;
module.exports.getRandomInt = getRandomInt;
module.exports.QueueEmbed = QueueEmbed;
module.exports.check_if_dj = check_if_dj;

function check_if_dj(message, member) {
    //if no message added return
    if(!message) return false;
    //set variable for "client"
    var client = message.client;

    if (!member) member = message.member;
    //get the adminroles
    var roleid = client.settings.get(message.guild.id, `djroles`)
    //if no dj roles return false, so that it continues
    if (String(roleid) == "") return false;

    //define variables
    var isdj = false,
        string = "";

    //loop through the roles
    for (let i = 0; i < roleid.length; i++) {
        //if the role does not exist, then skip this current loop run
        if (!message.guild.roles.cache.get(roleid[i])) continue;
        //if he has role set var to true
        if (member.roles.cache.has(roleid[i])) isdj = true;
        //add the role to the string
        string += "<@&" + roleid[i] + "> | "
    }
    //if no dj and not an admin, return the string
    if (!isdj && !member.hasPermission("ADMINISTRATOR"))
        return string;
    //if he is a dj or admin, then return false, which will continue the cmd
    else
        return false;
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US').format(date)
}
async function promptMessage(message, author, time, validReactions) {
    time *= 1000;
    for (const reaction of validReactions) await message.react(reaction);
    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
    return message
        .awaitReactions(filter, {
            max: 1,
            time: time
        })
        .then(collected => collected.first() && collected.first().emoji.name);
}

function embedbuilder(client, deletetime, message, color, title, description, thumbnail) {
    try {
        if (title.includes("filter") && title.includes("Hozz??ad??s")) {
            client.infos.set("global", Number(client.infos.get("global", "filters")) + 1, "filters");
        }
    } catch {}
    try {
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL({
                dynamic: true
            }))
            .setFooter(client.user.username + " | ??ltal: KesfhBOT", client.user.displayAvatarURL());
        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (thumbnail) embed.setThumbnail(thumbnail)
        if (!deletetime || deletetime === undefined || deletetime === "null") {
            message.channel.send(embed)
                .then(msg => {
                    try {
                        if (msg.channel.type === "news")
                            msg.crosspost()
                    } catch (error) {
                        console.log(error)
                        errorbuilder(error.stack.toString().substr(0, 2000))
                    }
                })
            return;
        }
        return message.channel.send(embed).then(msg => msg.delete({
            timeout: deletetime
        }));
    } catch (error) {
        embedbuilder(client, 5000, message, "RED", "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error l??pet fel k??rlek sz??lj egy fejleszt??nek!**")
        errorbuilder(error.stack.toString().substr(0, 2000))
    }
}

function errorbuilder(error) {
    console.log(error)
}

function QueueEmbed(client, queue) {
    try {
        let embeds = [];
        let k = 10;
        //defining each Pages
        for (let i = 0; i < queue.songs.length; i += 10) {
            let qus = queue.songs;
            const current = qus.slice(i, k)
            let j = i;
            k += 10;
            const info = current.map((track) => `**${j++} -** [\`${track.name}\`](${track.url}) - \`${track.formattedDuration}\``).join("\n")
            const embed = new Discord.MessageEmbed()
                .setTitle("Szerver Lista")
                .setColor(config.colors.yes)
                .setDescription(`**Aktu??lis dal - [\`${qus[0].name}\`](${qus[0].url})**\n\n${info}`)
                .setFooter(client.user.username + " | ??ltal: KesfhBOT", client.user.displayAvatarURL())
            embeds.push(embed);
        }
        //returning the Embed
        return embeds;
    } catch (error) {
        console.log(error)
        errorbuilder(error.stack.toString().substr(0, 2000))
    }
}

function customplaylistembed(client, message, lyrics, song) {
    if (!lyrics) lyrics = "Nincsenek dalok a lej??tsz??si list??ban!";
    try {
        let embeds = [];
        let k = 1000;
        for (let i = 0; i < lyrics.length; i += 1000) {
            const current = lyrics.slice(i, k);
            k += 1000;
            const embed = new Discord.MessageEmbed()
                .setTitle("Egy??ni lej??tsz??si lista")
                .setColor(config.colors.yes)
                .setDescription(current)
            embeds.push(embed);
        }
        return embeds;
    } catch (error) {
        console.log(error)
        embedbuilder(client, 5000, message, "RED", "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error l??pet fel k??rlek sz??lj az egyik fejleszt??nek!**")
        errorbuilder(error.stack.toString().substr(0, 2000))
    }
}

function lyricsEmbed(client, message, lyrics, song) {
    try {
        let embeds = [];
        let k = 1000;
        for (let i = 0; i < lyrics.length; i += 1000) {
            const current = lyrics.slice(i, k);
            k += 1000;
            const embed = new Discord.MessageEmbed()
                .setTitle("Lyrics - " + song.name)
                .setURL(song.url)
                .setThumbnail(song.thumbnail)
                .setColor(config.colors.yes)
                .setDescription(current)
            embeds.push(embed);
        }
        return embeds;
    } catch (error) {
        console.log(error)
        embedbuilder(client, 5000, message, "RED", "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error l??pet fel k??rlek sz??lj az egyik fejleszt??nek!**")
        errorbuilder(error.stack.toString().substr(0, 2000))
    }
}
async function playsongyes(client, message, queue, song) {
    try {
        let djs = "";
        if (client.settings.get(message.guild.id, `djroles`).join("") === "") djs = "nincs setup"
        else
            for (let i = 0; i < client.settings.get(message.guild.id, `djroles`).length; i++) {
                djs += "<@&" + client.settings.get(message.guild.id, `djroles`)[i] + "> | "
            }

        let embed1 = new Discord.MessageEmbed()

            .setColor(config.colors.yes)
            .setTitle("???? Zene lej??tsz??s")
            .setDescription(`Jelenleg: [\`${song.name}\`](${song.url})`)
            .addField("???? Le k??rte:", `>>> ${song.user}`, true)
            .addField("??? Id??tartalom:", `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``, true)
            .addField("???? Lista:", `>>> \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``, true)
            .addField("???? Hanger??:", `>>> \`${queue.volume} %\``, true)
            .addField("??? Loop:", `>>> ${queue.repeatMode ? queue.repeatMode === 2 ? "??? Queue" : "??? Song" : "???"}`, true)
            .addField("?????? Autoplay:", `>>> ${queue.autoplay ? "???" : "???"}`, true)
            .addField("??? Zene let??lt??s:", `>>> [\`Klik r??!\`](${song.streamURL})`, true)
            .addField("??? Filter:", `>>> \`${queue.filter || "???"}\``, true)
            .addField("???? DJ-Rang:", `>>> ${djs}`, true)
            .setFooter(client.user.username + " | ??ltal: KesfhBOT", client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL({
                dynamic: true
            }), "https://dc.musicium.eu")
            .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)

        var playingMessage = await message.channel.send(embed1)

        client.settings.set(message.guild.id, playingMessage.id, "playingembed")
        client.settings.set(message.guild.id, message.channel.id, "playingchannel")

        try {
            await playingMessage.react("???");
            await playingMessage.react("???");
            await playingMessage.react("????");
            await playingMessage.react("????");
            await playingMessage.react("??????");
            await playingMessage.react("??????");
        } catch (error) {
            embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error l??pet fel k??rlek sz??lj az egyik fejleszt??nek!**")
            errorbuilder(error.stack.toString().substr(0, 2000))
            console.log(error);
        }
        const filter = (reaction, user) => ["???", "???", "????", "????", "??????", "??????"].includes(reaction.emoji.id || reaction.emoji.name) && user.id !== message.client.user.id;

        var collector = await playingMessage.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000
        });
        collector.on("collect", async (reaction, user) => {
            //return if no queue available
            if (!queue) return;

            //create member out of the user
            const member = reaction.message.guild.member(user);

            //remoe the reaction
            reaction.users.remove(user);

            //if member not connected, return error
            if (!member.voice.channel) return embedbuilder(client, 3000, message, config.colors.no, "`" + message.author.tag + "`" + "K??rlek l??pj be egy hangcsatorn??ba! ")

            //if member is not same vc as bot return error
            if (member.voice.channel.id !== member.guild.me.voice.channel.id) return embedbuilder(client, 3000, message, config.colors.no, "`" + message.author.tag + "`" + " K??rlek l??pj be egy hangcsatorn??ba!")

            //if not a dj return error
            if (check_if_dj(reaction.message, member))
                return embedbuilder(client, 6000, message, config.colors.no, "DJ-Rang", `??? Nincs jogod v??gre hajtani ezt a parancsot! Rendelkezned kell: ${check_if_dj(message)}`)

            switch (reaction.emoji.id || reaction.emoji.name) {
                case "???":
                    client.distube.skip(message);
                    embedbuilder(client, 3000, message, config.colors.yes, "SKIPELVE", `Skipelve a zene!`)
                    try {
                        playingMessage.reactions.removeAll();
                    } catch {}

                    try {
                        playingMessage.delete({
                            timeout: client.ws.ping
                        });
                    } catch {}
                    break;

                case "???":
                    client.distube.stop(message);
                    try {
                        playingMessage.reactions.removeAll();
                    } catch {}
                    try {
                        playingMessage.delete({
                            timeout: client.ws.ping
                        });
                    } catch {}
                    embedbuilder(client, 3000, message, config.colors.no, "STOPOLVA", `Ki l??ptem a hangcsatorn??b??l`)
                    break;

                case "????":
                    await client.distube.setVolume(message, Number(queue.volume) - 10);
                    embedbuilder(client, 3000, message, config.colors.yes, "HANG", `Sikeresen cs??kkentetted a hanger??t \`${queue.volume}\``)
                    break;

                case "????":
                    await client.distube.setVolume(message, Number(queue.volume) + 10);
                    embedbuilder(client, 3000, message, config.colors.yes, "HANG", `Sikeresen emelted a hanger??t \`${queue.volume}\``)
                    break;

                case "??????":
                    let seektime = queue.currentTime - 10000;
                    if (seektime < 0) seektime = 0;
                    await client.distube.seek(message, Number(seektime));

                    embedbuilder(client, 3000, message, config.colors.yes, "Seeked!", `A zene cs??kkent \`-10 mp-t\``)
                    break;

                case "??????":
                    let seektime2 = queue.currentTime + 10000;
                    if (seektime2 >= queue.songs[0].duration * 1000) {
                        seektime2 = queue.songs[0].duration * 1000 - 1;
                    }
                    await client.distube.seek(message, seektime2);

                    embedbuilder(client, 3000, message, config.colors.yes, "Seeked!", `A zene sikeresen n??t \`+10 mp-vel\``)
                    break;
                default:
                    break;
            }
        });
        collector.on("end", () => {
            playingMessage.reactions.removeAll();
            playingMessage.delete({
                timeout: client.ws.ping
            });
        })
    } catch (error) {
        console.log(error)
        embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error l??pet fel k??rlek sz??lj az egyik fejleszt??nek!**")
        errorbuilder(error.stack.toString().substr(0, 2000))
    }
}

function curembed(client, message) {
    try {
        let djs = "";
        if (client.settings.get(message.guild.id, `djroles`).join("") === "") djs = "not setup"
        else
            for (let i = 0; i < client.settings.get(message.guild.id, `djroles`).length; i++) {
                djs += "<@&" + client.settings.get(message.guild.id, `djroles`)[i] + "> | "
            }

        let queue = client.distube.getQueue(message); //get the current queue
        let song = queue.songs[0];
        embed = new Discord.MessageEmbed()
            .setColor(config.colors.yes)
            .setTitle("???? Zene lej??tsz??s:")
            .setDescription(`> [\`${song.name}\`](${song.url})`)
            .addField("???? Le k??rte", `>>> ${song.user}`, true)
            .addField("??? Id??tartalom:", `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``, true)
            .addField("???? Lista:", `>>> \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``, true)
            .addField("???? Hanger??:", `>>> \`${queue.volume} %\``, true)
            .addField("??? Loop:", `>>> ${queue.repeatMode ? queue.repeatMode === 2 ? "??? Queue" : "??? Song" : "???"}`, true)
            .addField("?????? Autoplay:", `>>> ${queue.autoplay ? "???" : "???"}`, true)
            .addField("??? Filter:", `>>> \`${queue.filter || "???"}\``, true)
            .addField("???? DJ-Rang:", `>>> ${djs}`, true)
            .setFooter(client.user.username + " | by: milrato.eu", client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL({
                dynamic: true
            }), "https://dc.musicium.eu")
            .setThumbnail(song.thumbnail)
        return embed; //sending the new embed back
    } catch (error) {
        console.log(error)
        embedbuilder(5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error l??pet fel k??rlek sz??lj az egyik fejleszt??nek!**")
        errorbuilder(error.stack.toString().substr(0, 2000))
    }
}

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
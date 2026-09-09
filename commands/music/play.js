const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, VoiceConnectionStatus } = require('@discordjs/voice');
const { exec, execSync } = require('child_process');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const { YtDlp } = require('ytdlp-nodejs');
const ytdlp = new YtDlp();

const apiKey = process.env.GOOGLEAPIKEY;

async function searchYoutube(query) {
  try {
    if(query.startsWith("https://www.youtube.com/watch?v=" || "https://youtube.com/watch?v=")) {
      const id = query.replace("https://youtube.com/watch?v=", "").replace("https://www.youtube.com/watch?v=", "").split("&")[0];
      console.log(id);
      return await [{videoId: id}, false];
    } else if(query.startsWith("https://youtu.be/")) {
      const id = query.replace("https://youtu.be/", "").split("?")[0];
      return await [{videoId: id}, false];
    } else {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: "snippet",
          key: apiKey,
          q: query,
          maxResults: 1,
          type: "video",
        }
      });

      return await [response.data.items[0]["id"], response.data.items[0]["snippet"]];
    }
  } catch(err) {
    console.log(err);
  }
}

async function downloadVideo(url, interactionId) {
  try {
    const temps = await fs.readdir("temps");
    for(const file of temps) {
      const fullPath = path.join("temps", file);
      if(file.endsWith("mp4")) {
        fs.unlink(fullPath);
      }
    }

    execSync(`yt-dlp -f "ba[ext=m4a]/ba[ext=mp4]/bestaudio" -o "${interactionId}.mp4" "${url}"`, { cwd: 'temps'}, (err, stdout, stderr) => {
      console.log(stdout);
      if(err) {
        return console.log(err);
      }
      if(stderr) {
        return console.log(stderr);
      }
    });
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
  .setName("play")
  .setDescription("plays a song in a vc")
  .addStringOption(option => option.setName("name").setDescription("youtube url to the song").setRequired(true)),
  async execute(interaction) {

    const name = await interaction.options.getString("name");
    const reply = await interaction.deferReply();
    const channel = interaction.channel;

    try {
      const vidStuff = await Promise.resolve(searchYoutube(name));
      const vidID = vidStuff[0].videoId;
      const vidInfo = vidStuff[1];

      let existingConnection = getVoiceConnection(channel.guild.id);
      if(existingConnection) {
        existingConnection.destroy();
      }

      let connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      connection = getVoiceConnection(channel.guild.id);

      await Promise.resolve(downloadVideo(`https://www.youtube.com/watch?v=${vidID}`, interaction.id));

      connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('ready');

        const player = createAudioPlayer({});
        const resource = createAudioResource(`temps/${interaction.id}.mp4`);
        
        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
          console.log('leaving cuz idle');
          player.stop();
          connection.destroy();
        })
      });

      if(vidInfo) {
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Playing - ${decodeURIComponent(vidInfo.channelTitle)}`, iconURL: interaction.user.displayAvatarURL()})
        .setTitle(vidInfo.title)
        .setThumbnail(vidInfo.thumbnails.medium.url)
        .setDescription(`${vidInfo.description.length <= 1000?vidInfo.description:"description too long :("}\n\n[here's the url](https://www.youtube.com/watch?v=${vidID})`);
        await interaction.editReply({embeds: [embed]});
      } else {
        await interaction.editReply(`now playing [this video](https://youtube.com/watch?v=${vidID})`);
      }
      
    } catch(err) {
      console.log(err);
    }
  }
}
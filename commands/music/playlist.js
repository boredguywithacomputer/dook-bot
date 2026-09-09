const { SlashCommandBuilder, EmbedBuilder, Embed, VoiceConnectionStates } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, VoiceConnectionStatus } = require('@discordjs/voice');
const axios = require('axios');
const { exec, execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { YtDlp } = require('ytdlp-nodejs');
const ytdlp = new YtDlp();

const { getDB } = require('../../db.cjs');

let items = [];
let playing = false;
let queue = [];
let songIndex = 0;

async function getPlaylist(playlistID) {
  try {
    const playlistInfo = await ytdlp.getInfoAsync(playlistID);

    return await playlistInfo;
  } catch(err) {
    console.log(err);
  }
}

async function downloadVideo(url, interactionId) {
  try {
    const temps = await fs.readdir("playlisttemps");
    for(const file of temps) {
      const fullPath = path.join("playlisttemps", file);
      if(file.endsWith("mp4")) {
        fs.unlink(fullPath);
      }
    }

    execSync(`yt-dlp -f "ba[ext=m4a]/ba[ext=mp4]/bestaudio" -o "${interactionId}.mp4" ${url}`, { cwd: 'playlisttemps'}, (err, stdout, stderr) => {
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

let player;

async function playPlaylistSong(interaction) {
  try {
    const channel = interaction.channel;

    connection = getVoiceConnection(channel.guild.id);
    
    const vidID = queue[songIndex];

    const vidInfo = await ytdlp.getInfoAsync("https://youtube.com/watch?v="+vidID);

    const embed = new EmbedBuilder()
    .setAuthor({ name: `Playing - ${vidInfo.channel}`, iconURL: interaction.user.displayAvatarURL()})
    .setTitle(vidInfo.title)
    .setThumbnail(vidInfo.thumbnails[0].url)
    .setDescription(`${vidInfo.description.length <= 1000?vidInfo.description:"description too long :("}\n\n[here's the url](https://www.youtube.com/watch?v=${vidID})`);
    await interaction.channel.send({embeds: [embed]});
    
    await Promise.resolve(downloadVideo(`https://www.youtube.com/watch?v=${vidID}`, interaction.id+"_"+songIndex));
    
    player = createAudioPlayer();
    const resource = createAudioResource(`playlisttemps/${interaction.id}_${songIndex}.mp4`);

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      player.stop();
      if(!queue[songIndex]) {
        return console.log("end of playlist");
      }
      console.log("next!!");
      songIndex++;
      playPlaylistSong(interaction);
    });
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
  .setName("playlist")
  .addUserOption(option => option.setName("user").setDescription("whose playlist?").setRequired(false))
  .addBooleanOption(option => option.setName("shuffle").setDescription("shuffle or nah").setRequired(false))
  .setDescription("six sevennn"),
  async execute(interaction) {
    const reply = await interaction.deferReply();
    let playlistid;
    let user = interaction.options.getUser("user");

    const selectedUserID =  user ? user.id : interaction.user.id;
    const playlistDB = await getDB();
    
    if(!playlistDB.data.playlists || !playlistDB.data.playlists[selectedUserID]) {
      interaction.editReply(`${selectedUserID == interaction.user.id ? "You didn't set your playlist yet" : "That user didn't set their playlist yet"}`);
      return;
    }
    playlistid = playlistDB.data.playlists[selectedUserID];
    
    let shuffled = interaction.options.getBoolean("shuffle");

    let data;

    queue = [];

    try {
      data = await Promise.resolve(getPlaylist(playlistid));

      data.entries.forEach((entry, index) => {
        queue.push(entry.id);
      });
      
      if(shuffled || shuffled == undefined) {
        let currentIndex = queue.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = queue[currentIndex];
            queue[currentIndex] = queue[randomIndex];
            queue[randomIndex] = temporaryValue;
        }
      }

      await interaction.editReply(`playing <@${selectedUserID}>'s playlist`);

      let channel = interaction.channel;
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

      connection.on(VoiceConnectionStatus.Ready, () => {
        playPlaylistSong(interaction);
      });
      
    } catch(err) {
      console.log(err);
    }
  },
  p: function() {
    return player;
  }
}
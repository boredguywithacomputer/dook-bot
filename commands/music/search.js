const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require('axios');
require("dotenv").config();
const { YtDlp } = require('ytdlp-nodejs');
const ytdlp = new YtDlp();

const apiKey = process.env.GOOGLEAPIKEY;

async function searchYoutube(query) {
  try {
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
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
  .setName("search")
  .setDescription("search youtube for things")
  .addStringOption(option => option.setName("query").setDescription("name of the song/video").setRequired(true)),
  async execute(interaction) {
    const reply = await interaction.deferReply();
    const query = await interaction.options.getString("query");

    try {
      const vidStuff = await Promise.resolve(searchYoutube(query));
      const vidID = vidStuff[0].videoId;
      const vidInfo = vidStuff[1];
      const embed = new EmbedBuilder()
      .setAuthor({ name: `Search Results - ${vidInfo.channelTitle}`, iconURL: interaction.user.displayAvatarURL()})
      .setTitle(vidInfo.title)
      .setThumbnail(vidInfo.thumbnails.medium.url)
      .setDescription(`${vidInfo.description.length <= 1000 ? vidInfo.description:"description too long :("}\n\n[here's the url](https://www.youtube.com/watch?v=${vidID})`);
      await interaction.editReply({embeds: [embed]});
    } catch(err) {
      console.log(err);
    }
  }
}
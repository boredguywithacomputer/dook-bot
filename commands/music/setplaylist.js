const { SlashCommandBuilder } = require("discord.js");
const { YtDlp } = require('ytdlp-nodejs');
const ytdlp = new YtDlp();

const { getDB } = require("../../db.cjs");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("setplaylist")
  .addStringOption(option => option.setName("id").setDescription("your youtube playlist id/url").setRequired(true))
  .setDescription("sets your playlist"),
  async execute(interaction) {
    await interaction.deferReply();
    const playlistid = interaction.options.getString("id");
    try {
      const info = await ytdlp.getInfoAsync(playlistid);

      if(info._type == 'playlist') {
        await interaction.editReply(`set <@${interaction.user.id}>'s playlist`);
        const db = await getDB();
        console.log(db);
        db.update(({ playlists }) => playlists[interaction.user.id] = playlistid);
      } else {
        await interaction.editReply("thats not a playlist")
      }
      
    } catch(err) {
      await interaction.editReply(`${err}`);
    }
  }
}
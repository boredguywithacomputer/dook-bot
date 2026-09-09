const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("ping")
  // .addStringOption(option => option.setName("query").setDescription("name of the song/video").setRequired(true))
  .setDescription("pong"),
  async execute(interaction) {
    // const d = interaction.options.getString("query");
    const reply = await interaction.reply(`pong`);
    await interaction.editReply(`test`);
  }
}
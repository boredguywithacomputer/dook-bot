const { SlashCommandBuilder } = require("discord.js");
const { p } = require('../music/playlist');

module.exports = {
  data: new SlashCommandBuilder()
  .setName("skip")
  .setDescription("next"),
  async execute(interaction) {
    const reply = await interaction.reply(`skipping`);
    const diddles = p();
    if(diddles) {
      diddles.stop();
    }
  }
}
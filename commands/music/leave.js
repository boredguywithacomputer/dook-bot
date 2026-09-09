const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
  .setName("leave")
  // .addStringOption(option => option.setName("query").setDescription("").setRequired(true))
  .setDescription("leaves current vc"),
  async execute(interaction) {
    // const d = interaction.options.getString("query");
    const guildId = interaction.channel.guild.id;
    const currentVoiceConnection = getVoiceConnection(guildId);
    if(currentVoiceConnection) {
      currentVoiceConnection.destroy();
      currentVoiceConnection.disconnect();
    }
    const reply = await interaction.reply(`ok byee`);
  }
}
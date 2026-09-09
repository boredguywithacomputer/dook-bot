const { SlashCommandBuilder, MessageEmbed, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("shits")
  .setDescription("know your shits"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
    .setTitle("Know your Shits!!")
    .setDescription(`\`Bullshit\`: Not true
      \`Horseshit\`: Nonsense
      \`Apeshit\`: Rambunctious
      \`Batshit\`: Insane
      \`Chickenshit\`: Cowardly
      \`Dogshit\`: Very poor quality
      \`No Shit\`: Obviously
      \`Holy Shit\`: Very good
      \`Dipshit\`: A total dumbass
      \`Tough Shit\`: Take it or leave it
      \`THE SHIT\`: Perfection
    `)
    .setColor("White");

    const reply = await interaction.reply(
      `know your shits!!`
    );
    await interaction.editReply({ embeds: [embed] });
  }
}
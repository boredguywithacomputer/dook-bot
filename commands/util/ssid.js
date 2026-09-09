const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require('axios');

const WIGLEAUTH = process.env.WIGLEAUTH;

module.exports = {
  data: new SlashCommandBuilder()
  .setName("ssid")
  .addStringOption(option => option.setName("latitude").setDescription("latitude of the place").setRequired(true))
  .addStringOption(option => option.setName("longitude").setDescription("longitude of the place").setRequired(true))
  .setDescription("returns the ssid of a certain location"),
  
  async execute(interaction) {
    const lat = interaction.options.getString("latitude");
    const long = interaction.options.getString("longitude");
    const reply = await interaction.deferReply();

    if(interaction.user.id != process.env.OWNERID) return;

    try {
      const url = `https://api.wigle.net/api/v2/network/search?onlymine=false&latrange1=${Number(lat)+0.00003}&latrange2=${Number(lat)-0.00003}&longrange1=${Number(long)+0.002}&longrange2=${Number(long)-0.002}&freenet=false&paynet=false`;

      const response = await axios.get(url, {
        headers: {
          "Authorization": `Basic ${WIGLEAUTH}`,
        },
      });

      const data = response.data;
      console.log(data);

      let ssids = "";

      for(let i = 0; i<data.results.length; i++) {
        console.log(data.results[i]);
        if(i>20) continue;
        ssids += `${data.results[i].ssid}\n`;
      };

      const embed = new EmbedBuilder()
      .setTitle(`SSIDs Near ${lat}, ${long}`)
      .setDescription(ssids);

      await interaction.editReply({ embeds: [embed] });

    } catch(err) {
      console.log(err);
    }
  }
}
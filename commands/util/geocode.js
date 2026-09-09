const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
  .setName("geocode")
  .addStringOption(option => option.setName("place").setDescription("the name of the place").setRequired(true))
  .setDescription("get info about a place, such as lat and long"),
  
  async execute(interaction) {
    const place = interaction.options.getString("place");
    const reply = await interaction.deferReply();
    
    const url = "https://nominatim.openstreetmap.org/search";

    try {
      const response = await axios.get(url, {
        params: {
          q: place,
          format: "json"
        },
        headers: {
          "Accept": 'application/json, text/plain, */*',
          'Content-Type': "application/json",
          'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:155.0) Gecko/20100101 Firefox/155.0',
          'Accept-Encoding': 'gzip, compress, deflate, br'
        },
        body: {

        }
      });

      const data = response.data[0];
      console.log(response);

      const embed = new EmbedBuilder()
      .setTitle(`${data.display_name}"`)
      .setDescription(`lat: \`\`\`js\n${data.lat}\`\`\`long: \`\`\`js\n${data.lon}\`\`\`\naddresstype: ${data.addresstype}\nclass: ${data.class}\nimportance: ${data.importance}`);

      await interaction.editReply({ embeds: [embed] });

    } catch(err) {
      await interaction.editReply("something errored, maybe that search query is invalid");
      console.log(err);
    }
  }
}
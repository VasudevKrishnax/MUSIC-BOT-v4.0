
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { autoplay: lang } = require('../loadlanguage.js');  
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription(lang.description),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);

    if (!queue) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setAuthor({ 
          name: 'Alert!', 
          iconURL: musicIcons.dotIcon,
          url: "https://discord.gg/Xmmw7PzP"
        })
        .setDescription(lang.noSongPlaying);
      return interaction.reply({ embeds: [embed] });
    }

    const autoplay = queue.toggleAutoplay();
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setAuthor({ 
        name: lang.autoplayToggledTitle, 
        iconURL: musicIcons.correctIcon,
        url: "https://discord.gg/xQF9f9yUEM"
      })
      .setDescription(`${lang.autoplayStatus} ${autoplay ? lang.enabled : lang.disabled}.`);
    
    await interaction.reply({ embeds: [embed] });
  },
};

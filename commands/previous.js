


const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../loadlanguage.js');; 
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription(lang.previousDescription),
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
        .setDescription(lang.previousNoSongPlaying);
      return interaction.reply({ embeds: [embed] });
    }

    queue.previous();

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
       .setAuthor({ 
          name: lang.previousTitle, 
          iconURL: musicIcons.skipIcon,
          url: "https://discord.gg/Xmmw7PzP"
        })
      .setDescription(lang.previousDescriptionText);

    await interaction.reply({ embeds: [embed] });
  },
};

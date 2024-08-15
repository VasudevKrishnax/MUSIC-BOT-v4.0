
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { clear: lang } = require('../loadlanguage.js');  
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
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

    queue.stop();

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setAuthor({ 
        name: lang.queueClearedTitle, 
        iconURL: musicIcons.correctIcon,
        url: "https://discord.gg/Xmmw7PzP"
      })
      .setDescription(lang.queueClearedDescription);

    await interaction.reply({ embeds: [embed] });
  },
};

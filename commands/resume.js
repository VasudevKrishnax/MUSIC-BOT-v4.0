
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../loadlanguage.js');
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription(lang.resumeDescription),
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
        .setDescription(lang.resumeNoSongPlaying);
      return interaction.reply({ embeds: [embed] });
    }

    if (!queue.paused) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setAuthor({ 
          name: 'Alert!', 
          iconURL: musicIcons.dotIcon,
          url: "https://discord.gg/Xmmw7PzP"
        })
        .setDescription(lang.resumeAlreadyPlaying);
      return interaction.reply({ embeds: [embed] });
    }

    queue.resume();

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setAuthor({ 
        name: lang.resumeTitle, 
        iconURL: musicIcons.pauseresumeIcon,
        url: "https://discord.gg/Xmmw7PzP"
    })
      .setDescription(lang.resumeDescriptionText);

    await interaction.reply({ embeds: [embed] });
  },
};

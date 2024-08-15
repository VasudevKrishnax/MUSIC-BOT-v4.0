
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../loadlanguage.js'); 
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription(lang.seekDescription)
    .addIntegerOption(option => option.setName('time').setDescription('The time to seek to (in seconds)').setRequired(true)),
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
        .setDescription(lang.seekNoSongPlaying);
      return interaction.reply({ embeds: [embed] });
    }

    const time = interaction.options.getInteger('time');

    if (time < 0 || time > queue.songs[0].duration) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setAuthor({ 
          name: 'Alert!', 
          iconURL: musicIcons.dotIcon,
          url: "https://discord.gg/Xmmw7PzP"
        })
        .setDescription(lang.seekInvalidTime);
      return interaction.reply({ embeds: [embed] });
    }

    queue.seek(time);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setAuthor({ 
        name: lang.seekTitle, 
        iconURL: musicIcons.beatsIcon,
        url: "https://discord.gg/Xmmw7PzP"
      })
      .setDescription(lang.seekDescriptionText.replace('{time}', new Date(time * 1000).toISOString().substr(11, 8)));

    await interaction.reply({ embeds: [embed] });
  },
};

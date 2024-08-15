
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../loadlanguage.js'); 
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription(lang.removeDescription)
    .addIntegerOption(option => option.setName('index').setDescription('The index of the song to remove').setRequired(true)),
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
        .setDescription(lang.removeNoSongPlaying);
      return interaction.reply({ embeds: [embed] });
    }

    const index = interaction.options.getInteger('index');
    if (index < 1 || index > queue.songs.length) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setAuthor({ 
          name: 'Alert!', 
          iconURL: musicIcons.dotIcon,
          url: "https://discord.gg/Xmmw7PzP"
        })
        .setDescription(lang.removeInvalidIndex);
      return interaction.reply({ embeds: [embed] });
    }

    const song = queue.songs.splice(index - 1, 1);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setAuthor({ 
        name: lang.removeTitle, 
        iconURL: musicIcons.correctIcon,
        url: "https://discord.gg/Xmmw7PzP"
      })
      .setDescription(lang.removeDescriptionText.replace('{song}', song[0].name));

    await interaction.reply({ embeds: [embed] });
  },
};


const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../loadlanguage.js'); 
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription(lang.volumeDescription)
    .addIntegerOption(option => option.setName('level').setDescription('The volume level (0-100)').setRequired(true)),
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
        .setDescription(lang.volumeNoSongPlaying);
      return interaction.reply({ embeds: [embed] });
    }

    const volume = interaction.options.getInteger('level');
    if (volume < 0 || volume > 100) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setAuthor({ 
          name: 'Alert!', 
          iconURL: musicIcons.dotIcon,
          url: "https://discord.gg/Xmmw7PzP"
        })
        .setDescription(lang.volumeInvalidLevel);
      return interaction.reply({ embeds: [embed] });
    }

    queue.setVolume(volume);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setAuthor({ 
        name: lang.volumeSetTitle, 
        iconURL: musicIcons.volumeIcon,
        url: "https://discord.gg/Xmmw7PzP"
      })
      .setDescription(lang.volumeSetDescription.replace('{volume}', volume));

    await interaction.reply({ embeds: [embed] });
  },
};
/*


*/
 
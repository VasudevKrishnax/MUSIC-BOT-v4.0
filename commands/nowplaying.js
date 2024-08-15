
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../loadlanguage.js'); 
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription(lang.nowplayingDescription),
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
        .setDescription(lang.nowplayingNoSong);
      return interaction.reply({ embeds: [embed] });
    }

    const song = queue.songs[0];
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setAuthor({ 
        name: lang.nowplayingTitle, 
        iconURL: musicIcons.playerIcon,
        url: "https://discord.gg/Xmmw7PzP"
      })
      .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
      .setThumbnail(song.thumbnail)
      .setFooter({ text: `Requested by ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) });

    await interaction.reply({ embeds: [embed] });
  },
};

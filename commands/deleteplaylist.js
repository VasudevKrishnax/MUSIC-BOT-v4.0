
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../Database/playlistdb');
const { deleteplaylist: lang } = require('../loadlanguage.js'); 
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('deleteplaylist')
    .setDescription(lang.description)
    .addStringOption(option => option.setName('playlist').setDescription(lang.playlistDesc).setRequired(true)),
  async execute(interaction, client) {
    const playlistName = interaction.options.getString('playlist');
    const userId = interaction.user.id;

    db.get('SELECT * FROM playlists WHERE name = ?', [playlistName], (err, playlist) => {
      if (err) {
        return interaction.reply(lang.error);
      }

      if (!playlist) {
        return interaction.reply(lang.notFound);
      }

      if (playlist.owner !== userId) {
        return interaction.reply(lang.noPermission);
      }

      db.run('DELETE FROM playlists WHERE name = ?', [playlistName], (err) => {
        if (err) {
          return interaction.reply(lang.error);
        }

        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setAuthor({ 
            name: lang.successTitle, 
            iconURL: musicIcons.correctIcon,
            url: "https://discord.gg/Xmmw7PzP"
          })
          .setDescription(`${lang.successMessage} **${playlistName}**.`)
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      });
    });
  },
};

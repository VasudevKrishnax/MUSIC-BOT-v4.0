
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../Database/playlistdb');
const { removesong: lang } = require('../loadlanguage.js'); 
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removesong')
    .setDescription(lang.description)
    .addStringOption(option => option.setName('playlist').setDescription(lang.playlistDesc).setRequired(true))
    .addStringOption(option => option.setName('song').setDescription(lang.songDesc).setRequired(true)),
  async execute(interaction) {
    const playlistName = interaction.options.getString('playlist');
    const song = interaction.options.getString('song');
    const userId = interaction.user.id;

    db.get('SELECT * FROM playlists WHERE name = ? AND owner = ?', [playlistName, userId], (err, playlist) => {
      if (err) {
        return interaction.reply({ content: lang.error, ephemeral: true });
      }

      if (!playlist) {
        return interaction.reply({ content: lang.notFound, ephemeral: true });
      }

      let songUrls = playlist.songs ? playlist.songs.split(',') : [];
      songUrls = songUrls.filter(url => url !== song);

      db.run('UPDATE playlists SET songs = ? WHERE name = ? AND owner = ?', [songUrls.join(','), playlistName, userId], function(err) {
        if (err) {
          return interaction.reply({ content: lang.removeError, ephemeral: true });
        }
        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setAuthor({ 
            name: lang.successTitle, 
            iconURL: musicIcons.correctIcon,
            url: "https://discord.gg/Xmmw7PzP"
          })
          .setDescription(`${lang.successMessage} **${song}** ${lang.fromPlaylist} **${playlistName}**.`)
          .setTimestamp();
        interaction.reply({ embeds: [embed] });
      });
    });
  },
};

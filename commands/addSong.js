
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../Database/playlistdb');
const { addsong: lang } = require('../loadlanguage.js'); 
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('addsong')
    .setDescription(lang.description)
    .addStringOption(option => option.setName('playlist').setDescription(lang.playlistDesc).setRequired(true))
    .addStringOption(option => option.setName('song').setDescription(lang.songDesc).setRequired(true)),
  async execute(interaction, client) {
    const playlistName = interaction.options.getString('playlist');
    const song = interaction.options.getString('song');
    const userId = interaction.user.id;

    db.get('SELECT * FROM playlists WHERE name = ? AND owner = ?', [playlistName, userId], (err, playlist) => {
      if (err) {
        return interaction.reply(lang.errorAccess);
      }

      if (!playlist) {
        return interaction.reply(lang.errorNotFound);
      }

      let songUrls = playlist.songs ? playlist.songs.split(',') : [];
      songUrls.push(song);

      db.run('UPDATE playlists SET songs = ? WHERE name = ? AND owner = ?', [songUrls.join(','), playlistName, userId], function(err) {
        if (err) {
          return interaction.reply(lang.errorAdd);
        }
        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setAuthor({ 
            name: lang.successTitle, 
            iconURL: musicIcons.correctIcon,
            url: "https://discord.gg/Xmmw7PzP"
          })
          .setDescription(`${lang.addedSong} **${song}** ${lang.toPlaylist} **${playlistName}**.`);
        interaction.reply({ embeds: [embed] });
      });
    });
  },
};


const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../Database/playlistdb');
const { playplaylist: lang } = require('../loadlanguage.js'); 
const musicIcons = require('../UI/icons/musicicons.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('playplaylist')
    .setDescription(lang.description)
    .addStringOption(option => option.setName('playlist').setDescription(lang.playlistDesc).setRequired(true)),
  async execute(interaction, client) {
    const playlistName = interaction.options.getString('playlist');
    const voiceChannel = interaction.member.voice.channel;
    const userId = interaction.user.id;

    if (!voiceChannel) {
      return interaction.reply({ content: lang.notInVoiceChannel, ephemeral: true });
    }

    db.get('SELECT * FROM playlists WHERE name = ?', [playlistName], async (err, playlist) => {
      if (err) {
        return interaction.reply({ content: lang.error, ephemeral: true });
      }

      if (!playlist) {
        return interaction.reply({ content: lang.notFound, ephemeral: true });
      }

      if (!playlist.isPublic && playlist.owner !== userId) {
        return interaction.reply({ content: lang.noPermission, ephemeral: true });
      }

      const songs = playlist.songs ? playlist.songs.split(',') : [];
      if (songs.length === 0) {
        return interaction.reply({ content: lang.emptyPlaylist, ephemeral: true });
      }

      try {
        const queue = client.distube.getQueue(interaction.guildId) || await client.distube.voices.join(voiceChannel);

        songs.forEach(song => {
          client.distube.play(voiceChannel, song, {
            textChannel: interaction.channel,
            member: interaction.member,
          });
        });

        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setAuthor({ 
            name: lang.successTitle, 
            iconURL: musicIcons.correctIcon,
            url: "https://discord.gg/Xmmw7PzP"
          })
          .setDescription(`${lang.successMessage} **${playlistName}**.`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Failed to play playlist:', error);
        return interaction.reply({ content: lang.failedToPlay, ephemeral: true });
      }
    });
  },
};

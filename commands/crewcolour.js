const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function parseGtaHex(input) {
  if (!input) return { color: '#FFFFFF', end: 'FF' };

  let clean = input.replace('#', '').toUpperCase();
  let end = 'FF';

  if (clean.length === 8) {
    end = clean.slice(6, 8);
    clean = clean.slice(0, 6);
  }

  if (clean.length !== 6) {
    return { color: '#FFFFFF', end: 'INVALID' };
  }

  return {
    color: `#${clean}`,
    end
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crewcolour')
    .setDescription('Create a GTA crew colour')

    .addStringOption(option =>
      option.setName('hex')
        .setDescription('GTA hex colour (#RRGGBBAA)')
        .setRequired(true)
    )

    .addStringOption(option =>
      option.setName('pearlescent')
        .setDescription('Pearlescent colour name')
        .setRequired(false)
    )

    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('Upload an image')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const hexInput = interaction.options.getString('hex');
      const pearlescent =
        interaction.options.getString('pearlescent') || 'None';

      const image =
        interaction.options.getAttachment('image');

      const parsed = parseGtaHex(hexInput);

      const embed = new EmbedBuilder()
        .setTitle('Crew Colour')
        .setColor(parsed.color)
        .addFields(
          {
            name: 'GTA Hex',
            value: hexInput,
            inline: false
          },
          {
            name: 'Hex Colour',
            value: parsed.color,
            inline: true
          },
          {
            name: 'Hex End',
            value: parsed.end,
            inline: true
          },
          {
            name: 'Pearlescent',
            value: pearlescent,
            inline: true
          }
        )
        .setImage(image.url);

      await interaction.editReply({
        embeds: [embed]
      });

    } catch (err) {
      console.error('Crewcolour error:', err);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: 'Something went wrong with the command.'
        }).catch(() => {});
      } else {
        await interaction.reply({
          content: 'Something went wrong with the command.',
          ephemeral: true
        }).catch(() => {});
      }
    }
  }
};
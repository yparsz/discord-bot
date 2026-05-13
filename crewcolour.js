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
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const hexInput = interaction.options.getString('hex');
      const pearlescent = interaction.options.getString('pearlescent') || 'None';
      const image = interaction.options.getAttachment('image');

      const parsed = parseGtaHex(hexInput);

      const embed = new EmbedBuilder()
        .setTitle('Crew Colour')
        .setColor(parsed.color)
        .addFields(
          { name: 'GTA Hex', value: hexInput, inline: false },
          { name: 'Hex Colour', value: parsed.color, inline: true },
          { name: 'Hex End', value: parsed.end, inline: true },
          { name: 'Pearlescent', value: pearlescent, inline: true }
        );

      // If user uploaded image
      if (image) {
        embed.setImage(image.url);
      }

      const message = await interaction.reply({
        embeds: [embed],
        fetchReply: true
      });

      await message.react('👍');
      await message.react('👎');

    } catch (err) {
      console.error('Crewcolour error:', err);

      if (!interaction.replied) {
        await interaction.reply({
          content: 'Something went wrong with the command.',
          ephemeral: true
        });
      }
    }
  }
};
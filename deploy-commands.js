const { REST, Routes } = require('discord.js');
const config = require('./config.json');

const commands = [
  {
    name: 'crewcolour',
    description: 'Create a GTA crew colour',
    options: [
      {
        name: 'hex',
        description: 'Main hex colour (e.g. #FF0000)',
        type: 3,
        required: true
      },
      {
        name: 'pearlescent',
        description: 'Pearlescent colour (any text)',
        type: 3,
        required: false
      },
      {
        name: 'image',
        description: 'Upload an image',
        type: 11,
        required: false
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN || config.token);

(async () => {
  try {
    console.log('Deploying commands...');

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log('Commands deployed successfully.');
  } catch (error) {
    console.error('Deploy error:', error);
  }
})();
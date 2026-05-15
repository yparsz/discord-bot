const { REST, Routes } = require('discord.js');
const config = require('./config.json');

const commands = [
  {
    name: 'crewcolour',
    description: 'Create a crew colour',
    options: [
      {
        name: 'name',
        description: 'Name of the crew colour',
        type: 3,
        required: true
      },
      {
        name: 'hex',
        description: 'Main hex colour (e.g. #FF0000)',
        type: 3,
        required: true
      },
      {
        name: 'pearlescent',
        description: 'Pearlescent colour',
        type: 3,
        required: false,
        choices: [
          { name: 'None', value: 'none' },
          { name: 'White', value: 'white' },
          { name: 'Ice White', value: 'ice_white' },
          { name: 'Blue', value: 'blue' },
          { name: 'Red', value: 'red' },
          { name: 'Green', value: 'green' },
          { name: 'Gold', value: 'gold' },
          { name: 'Pink', value: 'pink' }
        ]
      },
      {
        name: 'image',
        description: 'Image URL',
        type: 3,
        required: false
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log('Deploying commands...');

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log('Commands deployed.');
  } catch (error) {
    console.error(error);
  }
})();
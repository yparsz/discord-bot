const fs = require('fs');
const path = require('path');

const {
  Client,
  Collection,
  GatewayIntentBits,
  Events
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (command?.data?.name && command?.execute) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] Invalid command file: ${file}`);
  }
}

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Commands loaded: ${client.commands.size}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Command error:', error);

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: 'There was an error.',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: 'There was an error.',
        ephemeral: true
      });
    }
  }
});

// LOGIN (Railway safe)
client.login(process.env.TOKEN);
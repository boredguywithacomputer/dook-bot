require('dotenv').config();

const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ] 
});

const token = process.env.TOKEN;
client.login(token);
const clientId = "1293413374457282601";


client.once(Events.ClientReady, async (c) => {
  console.log(`logged in as ${c.user.tag} (${clientId})`);
});

const commands = [];

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON()); 
      client.commands.set(command.data.name, command);
		} else {
			console.log(`${filePath} is missing stuff`);
		}
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
  if(interaction.isChatInputCommand()) {
    try {
      const command = interaction.client.commands.get(interaction.commandName);

      if(!command) return;

      await command.execute(interaction);
    } catch(err) {
      console.log(err);
    }
  }
})

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`refreshing ${commands.length} commands`);
    const data = await rest.put(Routes.applicationCommands(`${clientId}`), {body: commands});
  } catch(err) {
    console.log(err);
  }
})();
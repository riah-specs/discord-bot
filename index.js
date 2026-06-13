require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { commands } = require('./commands');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Build command map
const commandMap = new Map();
for (const cmd of commands) commandMap.set(cmd.data.name, cmd);

// Auto-welcome new members
client.on(Events.GuildMemberAdd, async (member) => {
  const channelId = process.env.WELCOME_CHANNEL_ID;
  if (!channelId) return;
  const channel = member.guild.channels.cache.get(channelId);
  if (!channel) return;
  await channel.send({
    embeds: [{
      title: `👋 Welcome to ${member.guild.name}!`,
      description: `Hey ${member}, glad you're here! Make sure to read the rules and enjoy your stay.`,
      color: 0x57F287,
      thumbnail: { url: member.user.displayAvatarURL() },
      footer: { text: `Member #${member.guild.memberCount}` }
    }]
  });
});

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = commandMap.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error(err);
    const msg = { content: '❌ An error occurred.', ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
    else await interaction.reply(msg);
  }
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

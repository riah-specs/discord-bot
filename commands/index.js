const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const commands = [
  // --- KICK ---
  {
    data: new SlashCommandBuilder()
      .setName('kick')
      .setDescription('Kick a member from the server')
      .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
      const target = interaction.options.getMember('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      if (!target.kickable) return interaction.reply({ content: 'I cannot kick that user.', ephemeral: true });
      await target.kick(reason);
      await interaction.reply({ content: `✅ Kicked **${target.user.tag}** — ${reason}`, ephemeral: false });
    }
  },

  // --- BAN ---
  {
    data: new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Ban a member from the server')
      .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
      const target = interaction.options.getMember('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      if (!target.bannable) return interaction.reply({ content: 'I cannot ban that user.', ephemeral: true });
      await target.ban({ reason });
      await interaction.reply({ content: `🔨 Banned **${target.user.tag}** — ${reason}` });
    }
  },

  // --- UNBAN ---
  {
    data: new SlashCommandBuilder()
      .setName('unban')
      .setDescription('Unban a user by their ID')
      .addStringOption(o => o.setName('userid').setDescription('User ID to unban').setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
      const userId = interaction.options.getString('userid');
      try {
        await interaction.guild.members.unban(userId);
        await interaction.reply({ content: `✅ Unbanned user <@${userId}>` });
      } catch {
        await interaction.reply({ content: 'Could not unban that user. Check the ID.', ephemeral: true });
      }
    }
  },

  // --- MUTE (timeout) ---
  {
    data: new SlashCommandBuilder()
      .setName('mute')
      .setDescription('Timeout (mute) a member')
      .addUserOption(o => o.setName('user').setDescription('User to mute').setRequired(true))
      .addIntegerOption(o => o.setName('minutes').setDescription('Duration in minutes').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
      const target = interaction.options.getMember('user');
      const minutes = interaction.options.getInteger('minutes');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      await target.timeout(minutes * 60 * 1000, reason);
      await interaction.reply({ content: `🔇 Muted **${target.user.tag}** for ${minutes} minute(s) — ${reason}` });
    }
  },

  // --- GIVE ROLE ---
  {
    data: new SlashCommandBuilder()
      .setName('giverole')
      .setDescription('Give a role to a member')
      .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role to give').setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
      const target = interaction.options.getMember('user');
      const role = interaction.options.getRole('role');
      await target.roles.add(role);
      await interaction.reply({ content: `✅ Gave **${role.name}** to **${target.user.tag}**` });
    }
  },

  // --- REMOVE ROLE ---
  {
    data: new SlashCommandBuilder()
      .setName('removerole')
      .setDescription('Remove a role from a member')
      .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role to remove').setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
      const target = interaction.options.getMember('user');
      const role = interaction.options.getRole('role');
      await target.roles.remove(role);
      await interaction.reply({ content: `✅ Removed **${role.name}** from **${target.user.tag}**` });
    }
  },

  // --- ANNOUNCE ---
  {
    data: new SlashCommandBuilder()
      .setName('announce')
      .setDescription('Send an announcement to the announcements channel')
      .addStringOption(o => o.setName('message').setDescription('Announcement text').setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
      const msg = interaction.options.getString('message');
      const channel = interaction.guild.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL_ID);
      if (!channel) return interaction.reply({ content: 'Announcement channel not found. Check ANNOUNCEMENT_CHANNEL_ID in .env', ephemeral: true });
      await channel.send(`📢 **Announcement**\n\n${msg}`);
      await interaction.reply({ content: '✅ Announcement sent!', ephemeral: true });
    }
  },

  // --- PURGE ---
  {
    data: new SlashCommandBuilder()
      .setName('purge')
      .setDescription('Delete multiple messages at once')
      .addIntegerOption(o => o.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
      const amount = interaction.options.getInteger('amount');
      if (amount < 1 || amount > 100) return interaction.reply({ content: 'Please enter a number between 1 and 100.', ephemeral: true });
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `🗑️ Deleted ${amount} messages.`, ephemeral: true });
    }
  },

  // --- SERVERINFO ---
  {
    data: new SlashCommandBuilder()
      .setName('serverinfo')
      .setDescription('Show info about this server'),
    async execute(interaction) {
      const g = interaction.guild;
      await g.fetch();
      await interaction.reply({
        embeds: [{
          title: g.name,
          thumbnail: { url: g.iconURL() },
          fields: [
            { name: 'Members', value: `${g.memberCount}`, inline: true },
            { name: 'Owner', value: `<@${g.ownerId}>`, inline: true },
            { name: 'Created', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:D>`, inline: true },
            { name: 'Channels', value: `${g.channels.cache.size}`, inline: true },
            { name: 'Roles', value: `${g.roles.cache.size}`, inline: true },
            { name: 'Boosts', value: `${g.premiumSubscriptionCount}`, inline: true },
          ],
          color: 0x5865F2
        }]
      });
    }
  }
];

module.exports = { commands };

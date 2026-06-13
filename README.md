# Discord Bot

A fully-featured Discord bot managed via Claude.

## Commands
| Command | Description | Permission |
|---|---|---|
| `/kick` | Kick a member | Kick Members |
| `/ban` | Ban a member | Ban Members |
| `/unban` | Unban by user ID | Ban Members |
| `/mute` | Timeout a member | Moderate Members |
| `/giverole` | Give a role to a user | Manage Roles |
| `/removerole` | Remove a role from a user | Manage Roles |
| `/announce` | Send to announcements channel | Manage Messages |
| `/purge` | Delete messages in bulk | Manage Messages |
| `/serverinfo` | Show server stats | Everyone |

## Auto Features
- **Welcome messages** — greets new members in your welcome channel

## Setup
1. Copy `.env.example` to `.env` and fill in your values
2. Run `npm install`
3. Run `npm run deploy` to register slash commands
4. Run `npm start` to start the bot

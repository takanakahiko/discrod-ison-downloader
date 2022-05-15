import fs from 'fs'
import fetch from 'node-fetch'
import { Client, Intents } from 'discord.js'

const client = new Client({ intents: Intents.FLAGS.GUILDS  | Intents.FLAGS.GUILD_MEMBERS });

client.on('ready', async client => {
  try {
    const guildID = process.env.DISCORD_GUILD_ID
    if(!guildID) return console.error("process.env.DISCORD_GUILD_ID should be set");
    const guild = await client.guilds.fetch(guildID)
    const members = await guild.members.fetch()
    await Promise.all(members.map(async member => {
      if((await member.user.fetch()).bot) return;
      const avatarURL = member.displayAvatarURL()
      if(avatarURL == "") return;
      const response = await fetch(avatarURL);
      const buffer = await response.buffer();
      fs.writeFileSync(`./images/${member.displayName}.jpg`, buffer);
    }))
    client.destroy()
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.DISCORD_TOKEN);

import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

const { DISCORD_TOKEN, OPENAI_ORG, OPENAI_KEY } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const configuration = new Configuration({
  organization: OPENAI_ORG,
  apiKey: OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    const prompt = `${message.content}`;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.5,
      max_tokens: 500,
    });
    await message.reply(`${response.data.choices[0].text}`);
  } catch (error) {
    console.log(error);
  }
});

client.login(DISCORD_TOKEN);
console.log("ChatGPT bot is Online on Discord");

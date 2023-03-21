import { Client, REST, Routes, Events } from "discord.js";
import "dotenv/config";
import { readdirSync } from "fs";

// We are getting i18next modules
import i18next from "i18next";
import { t } from "i18next";
import translationBackend from "i18next-fs-backend";


// Basic Discord Setup
const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "MessageContent",
    ],
});

const commandss = [

    {
        name: 'ping',
        description: 'Replies with Pong!',
        name_localizations: { //* You can add whatever language you need 
            tr: 'gecikme',
        },
        description_localizations: {
            tr: 'Botun gecikmesini gösterir',
        }

    },

]

const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.botid), { body: commandss });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {

        const yourvalue = "0 0 0 1 1 1 2" // value in interaction

        await interaction.reply({
            content: `${t("header.title", {
                lng: interaction.locale, // *interaction.locale is language used in discord
                value: yourvalue // value = value specified in {{}} in default.json // your value is in interaction value
            })}`
        });

        await interaction.channel.send(`${t("header.title", {
            lng: interaction.locale,
            ns: "locale2" //* You selecting a file name for NameSpace
        })}`);
    }
});


//* Settuping Language System
await i18next.use(translationBackend).init({
    ns: readdirSync("./locales/en-US").map((a) => a.replace(".json", "")),
    defaultNS: "default", // this is the default Name space the file name if you cant in the code if you are not specified the i18 look at first this file //* you can rename with your file name
    fallbackLng: "en-US", // this default Languages if i18 cant find the language file or language it settings to default
    preload: readdirSync("./locales"), // getting files
    backend: {
        loadPath: "./locales/{{lng}}/{{ns}}.json",
    },
});

client.on("ready", () => {
    console.log("Discord multi language bot started")
})



//* Login
client.login(process.env.token);

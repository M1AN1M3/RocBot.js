const Discord = require(`discord.js`)
const fs = require(`fs`)

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const config = require("./Moderation/config.json");

const prefix = config.prefix

fs.readdir(`./Commands/`, (err, files) => {
    if(err) console.log(err)

    let jsfiles = files.filter(f => f.split(`.`).pop() === `js`)
    if(jsfiles.length <= 0){
        console.log(`No commands to load ya dingus`)
        return;
    }

    console.log(`loading ${jsfiles.length} commands`);

    jsfiles.forEach((f, i) => {
        let props = require(`./Commands/${f}`)
        console.log(i = 1);
        bot.commands.set(props.help.name, props)
    })
})

bot.on(`ready`, () => {
    console.log(`Roc bot Ready.`)
    bot.user.setActivity(`Watching you (v.2 !!!)`);
})

bot.on(`message`, async message => {

    if(message.author.bot) return;

    let messageArray = message.content.split(" ")
    let command = messageArray[0]
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));

    if(cmd) cmd.run(bot, message, args);
});

bot.login(config.token);
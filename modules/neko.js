const { MessageType } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const String = require("../lib/db.js");
const got = require("got");
const REPLY = String.neko;
module.exports = {
  name: "neko",
  description: REPLY.DESCRIPTION,
  extendedDescription: REPLY.EXTENDED_DESCRIPTION,
  demo: {isEnabled: true, text: '.neko #include <iostream> \nint main() \n{\n   std::cout << "Hello BotsApp!"; \n   return 0;\n}'},
  async handle(client, chat, BotsApp, args) {
    if(args.length === 0 && !BotsApp.isReply){
        await client.sendMessage(BotsApp.chatId, REPLY.ENTER_TEXT, MessageType.text);
        return;
    }
    console.log(args.length)
    console.log(args)
    const processing = await client.sendMessage(BotsApp.chatId, REPLY.PROCESSING, MessageType.text);
    try {
        if(!BotsApp.isReply){
            var json = {
                content: BotsApp.body.replace(BotsApp.body[0] + BotsApp.commandName + " ", "")
            }
        }
        else{
            var json = {
                content: BotsApp.replyMessage.replace(BotsApp.body[0] + BotsApp.commandName + " ", "")
            }
        }
        let text = await got.post("https://nekobin.com/api/documents", {
            json
        });
        json = JSON.parse(text.body);
        console.log("---------------------------------------------");
        console.log(json.result.key);
        console.log("---------------------------------------------");
        neko_url = "https://nekobin.com/" + json.result.key;
        client.sendMessage(BotsApp.chatId, neko_url, MessageType.text);
        return await client.deleteMessage (BotsApp.chatId, {id: processing.key.id, remoteJid: BotsApp.chatId, fromMe: true});
    } catch (err) {
        if(json.result == undefined){
            client.sendMessage(BotsApp.chatId, REPLY.TRY_LATER, MessageType.text);
        }
        else{
            await client.sendMessage(BotsApp.chatId, "```Woops, something went wrong. Try again later.```", MessageType.text);
            console.log(err);
        }
        return await client.deleteMessage (BotsApp.chatId, {id: processing.key.id, remoteJid: BotsApp.chatId, fromMe: true});
    }
  },
};
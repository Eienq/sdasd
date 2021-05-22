
const {     prefix, token     } = require("./config"),
      Root = require("eris"),
      client = new Root(token),
      {          Aki          } = require("aki-api"),
      emojis = ["👍", "👎", "❔", "🤔", "🙄", "❌"],
      Started = new Set(),
      createReactionCollector = require("./helpers/Collectors/ReactionCollector.js");

client
  .on("ready", async() =>{
  console.log(`Ready!`);
  await require("./helpers/Collectors/awaitMessages.js")(Root);
  }).on("messageCreate", async message => {
if (message.author.bot || !message.channel.guild) return;
if (message.content.startsWith(prefix + "başlat")) {
if(!Started.has(message.author.id))Started.add(message.author.id);
else return message.channel.createMessage("**:x: | Oyun çoktan başladı..**");
      const aki = new Aki("Tr"); // Full languages list at: https://github.com/jgoralcz/aki-api
      await aki.start();
const msg = await message.channel.createMessage({embed: {
  title: `${message.author.username}, Soru ${aki.currentStep + 1}`,
  color: 0x206694,
  description: `**${aki.question}**\n${aki.answers.map((x, i) => `${x} | ${emojis[i]}`).join("\n")}`}});

for(let emoji of emojis){ 
      try{ await msg.addReaction(emoji); }
      catch(e){ console.error(e); }
}
const collector = new createReactionCollector(client, msg, (m, emoji, userID) => emojis.includes(emoji.name) && userID === message.author.id,{ time: 60000 * 6 });
      collector.on("collect", async (m, emoji, userID)=> {
      await client.removeMessageReaction(message.channel.id, m.id, emoji.name, userID).catch(()=> {});       
if(emoji.name == "❌")return collector.stop();
await aki.step(emojis.indexOf(emoji.name));
if (aki.progress >= 70 || aki.currentStep >= 78) {
          await aki.win();
          collector.stop();
          message.channel.createMessage({embed: { 
            title: "Is this your character?", 
            color: 0x206694,
            image: {url: aki.answers[0].absolute_picture_path},
            description: `**${aki.answers[0].name}**\n${aki.answers[0].description}\nRanking as **#${aki.answers[0].ranking}**\n\n[evet (**e**) / hayır (**h**)]`}});
const responses = await message.channel.awaitMessages(m => ["evet","e","hayır","h"].includes(m.content.trim().toLowerCase()) && m.author.id == message.author.id, { time: 30000, maxMatches: 1 });
if(responses.length){
  const content = responses[0].content.trim().toLowerCase();
              if (content == "e" || content == "evet")
                   return message.channel.createMessage({embed: {  
                    title: "Harika! Bir kez daha doğru tahmin ettim.",
                    color: 0x206694,
                    description: "Seninle Oynamayı çok seviyorum!" }});  
              else return message.channel.createMessage({embed: {  
                    title: "uh oh sen kazandın!",
                    color: 0x206694,
                    description: "Seninle Oynamayı çok seviyorum!" }});
         }
          return;
        }
         msg.edit({embed: {
                       title: `${message.author.username}, Soru ${aki.currentStep + 1}`,
                       description: `**${aki.question}**\n${aki.answers.map((x, i) => `${x} | ${emojis[i]}`).join("\n")}`,
                       color: 0x206694
         }}); 
      });
collector.on("end",()=>{ Started.delete(message.author.id);
                                 msg.delete().catch(()=>{});
                       });   
}}).connect();
client.login(process.env.TOKEN);

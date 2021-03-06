// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MessageActionRow, MessageButton } = require('discord.js');
const mysql = require('mysql2'); // Base de données MySQL
const prefix = require('./config.json').prefix;
const schedule = require('node-schedule'); // Envoi automatique de message
const { ButtonInteraction } = require('discord.js');

require('discord-reply'); //⚠️ IMPORTANT: put this before your discord.Client()


// Création de la connexion à la DB
const db = mysql.createConnection({

    host: "localhost",
 
    user: "root",
 
    password: "", 

    database: "nosbotdiscord"
 
  });

db.connect(function(err) {
if (err) throw err;
console.log("Connecté à la base de données MySQL!");

});


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });


client.once('ready', () => {
	console.log('Bot prêt !');
});

// Message Handlers with Prefix
client.on('message', message => {
    let args = message.content.split(" ");
    let command = args.shift().toLowerCase();
    
    if(!command.startsWith(prefix)) return;

    /* COMMANDS */
    switch(command){
        case prefix + 'ping':
            require('./commands/ping.js').execute(client, message, args);
            break;
        case prefix + 'botinfos':
            require('./commands/botinfos.js').execute(client, message, args);
            break;
        case prefix + 'classe':
            require('./commands/choose_class.js').execute(client, message, args);
            break;
        case prefix + 'card':
            require('./commands/canvas.js').execute(client, message, args, db);
            break;
        /* case prefix + 'info':
            let resultat = require('./dao/get_playerinfos.js').execute(client, message, args, db);
            resultat.then(function(res) {
                console.log("Level : "  +res[0].level);
            });
            break; 
        // CODE SI JVEUT RECUP LES RESULTAT DUNE REQUETE QQL PART */
    }
    
});

//-------------------EARN-XP-GOLD-REPUT-----------------------------//
client.on('message', message => {
    /* EARN XP FOR EACH MSG */
    if (!message.author.bot) {
        require('./dao/update_player.js').execute(client, message, db);
    }
});
//-------------------------------------------------------//

// Button Handler
client.on('interactionCreate', async (interaction) => {
    
    interaction.deferUpdate();
	if (!interaction.isButton()) return;

    let resultat = require('./dao/get_playerinfos.js').getplayerinfo(client, interaction.user.id, db);
    resultat.then(function(res) {
        if(res[0].level < 15){
            interaction.channel.send("Tu est trop bas niveau pour changer de classe. Level requis : 15");
            return;
        }
        else
        {
            // Attribution de la classe du personnage selon le choix de l'utilisateur
                //TODO 
                switch(interaction.customId){
                    case "archer":
                        interaction.channel.send("Tu as choisis la classe Archer");
                        // Enregistrement dans la db 
                        require('./dao/change_class.js').execute(client, interaction, db, 2);
                        break;
                    case "mage":
                        interaction.channel.send("Tu as choisis la classe Mage");
                        require('./dao/change_class.js').execute(client, interaction, db, 3);
                        // Enregistrement dans la db 
                        break;
                    case "escri":
                        interaction.channel.send("Tu as choisis la classe Escri");
                        require('./dao/change_class.js').execute(client, interaction, db, 1);
                        // Enregistrement dans la db 
                        break;
                    case "am":
                        interaction.channel.send("Tu as choisis la classe Artiste Martial");
                        require('./dao/change_class.js').execute(client, interaction, db, 4);
                        // Enregistrement dans la db 
                        break;
                }
        }
    });
    
    
    
});

//------------------------------CI ASGOBAS------------------------------//

// 11h30 à 5min
const ci_asgobas_11h30_1 = schedule.scheduleJob('00 25 11 * * *', function(){ // scheduleJob('SECOND MINUTES HEURE JOUR MOIS *', function()
    console.log('Ci Asgobas 11h30 à 5min');
    const channel = client.channels.cache.find(channel => channel.name === "asgobas");

    channel.send("Le ci asgobas commencera dans 5 minutes <@&955242284180463697>");
});

// 17h30 à 5min
const ci_asgobas_17h30_1 = schedule.scheduleJob('00 25 17 * * *', function(){ // scheduleJob('SECOND MINUTES HEURE JOUR MOIS *', function()
    console.log('Ci Asgobas 17h30 à 5min');
    const channel = client.channels.cache.find(channel => channel.name === "asgobas");

    channel.send("Le ci asgobas commencera dans 5 minutes <@&955242284180463697>");
});

// 21h30 à 5min
const ci_asgobas_21h30_1 = schedule.scheduleJob('00 25 21 * * *', function(){ // scheduleJob('SECOND MINUTES HEURE JOUR MOIS *', function()
    console.log('Ci Asgobas 21h30 à 5min');
    const channel = client.channels.cache.find(channel => channel.name === "asgobas");

    channel.send("Le ci asgobas commencera dans 5 minutes <@&955242284180463697>");
});

// 23h30 à 5min
const ci_asgobas_23h30_1 = schedule.scheduleJob('00 25 23 * * *', function(){ // scheduleJob('SECOND MINUTES HEURE JOUR MOIS *', function()
    console.log('Ci Asgobas 23h30 à 5min');
    const channel = client.channels.cache.find(channel => channel.name === "asgobas");

    channel.send("Le ci asgobas commencera dans 5 minutes <@&955242284180463697>");
});
// ------------ //

client.login(token);
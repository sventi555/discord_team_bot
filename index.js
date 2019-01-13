const discord = require('discord.js');
const client = new discord.Client();
const fs = require('fs');

const token = fs.readFileSync('./token', {encoding: 'utf8'});
const ERROR_MSG = 'Please follow the given format: "&teams #teams name name..."';

function random(a) {
    return Math.floor(Math.random() * a);
}

client.on('ready', () => {
    console.log('ready');
});

client.on('message', message => {
    let content = message.content;

    // checks for team flag
    if (/&teams.*/.test(content)) {
        // splits text into list of args
        content = content.split(/\s+/);
        if (content.length < 1) {
            message.reply(ERROR_MSG);
        }

        // parses number of teams
        let num_teams = parseInt(content[1]);
        if (isNaN(num_teams)) {
            message.reply('Please indicate the number of teams!');
        }
        content.splice(0, 2);

        // sets up array of teams
        let teams = [];
        for (let i = 0; i < num_teams; i++) {
            teams.push([]);
        }

        // assigns names to teams
        let cur_team = 0;
        while (content.length > 0) {
            let name = content.splice(random(content.length), 1)[0];
            teams[cur_team % num_teams].push(name);
            cur_team++;
        }

        // drafts and sends the reply
        let reply = "Teams:\n"
        for (let i = 0; i < teams.length; i++) {
            reply = reply.concat(`team ${i}: `, teams[i].join(', '), '\n');
        }
        message.reply(reply);
    }
});

client.login(token).catch(console.error);
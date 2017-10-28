exports.run = async (client, message, [credit]) => {
    const sqlite3 = require("sqlite3").verbose();
    let db = new sqlite3.Database("./bwd/data/score.sqlite");

    db.get(`SELECT * FROM scores WHERE userId = "${message.author.id}"`, [], (err, row) => {
        if (err) { return console.log(err); }
        if (!row) { return message.reply("You haven't signed up and received your credits yet! D: Use `m~daily` (Using default prefix) to earn your first amount of credits."); }
        if (row.credits < credit) { return message.reply("You don't have that many credits, baka!"); }
        if (!credit || credit < 1) { return message.reply("You need to bet some credits to play!"); }
        else {
            var z; let rolls = [];
            for (z = 0; z < 7; z++) {
                var x = (Math.random() > .5) ? "heads" : "tails";
                rolls.push(x);
            }

            var earnings; var result;

            if (((rolls[0] === rolls[1]) && (rolls[0] === "heads")) || 
                ((rolls[1] === rolls[2]) && (rolls[1] === "heads")) ||
                ((rolls[2] === rolls[3]) && (rolls[2] === "heads")) ||
                ((rolls[3] === rolls[4]) && (rolls[3] === "heads")) ||
                ((rolls[4] === rolls[5]) && (rolls[4] === "heads")) ||
                ((rolls[5] === rolls[6]) && (rolls[5] === "heads")) ||
                ((rolls[6] === rolls[7]) && (rolls[6] === "heads"))) {  
                earnings = (credit * 1.25).toFixed(0);
                credit = parseInt(row.credits) + parseInt(earnings);
                db.run(`UPDATE scores SET credits = ${credit} WHERE userId = ${message.author.id}`);
                return message.reply(`Coins ${rolls} You have won ${earnings} credits.`);
            }
            if ((rolls[0] !== rolls[1]) && (rolls[0] === rolls[2]) && (rolls[0] !== rolls[3]) && (rolls[0] === rolls[4]) && (rolls[0] !== rolls[5]) && (rolls[0] === rolls[6]) && (rolls[0] !== rolls[7])) {
                earnings = (credit * 2.25).toFixed(0);
                credit = parseInt(row.credits) + parseInt(earnings);
                result = "won";
            } else {
                earnings = credit;
                credit = parseInt(row.credits) - parseInt(earnings);
                result = "lost";
            }

            db.run(`UPDATE scores SET credits = ${credit} WHERE userId = ${message.author.id}`);
            message.reply(`Coins ${rolls} You have ${result} ${earnings} credits.`); 
        }
    });
    db.close();
};

exports.conf = {
    enabled: true,
    runIn: ["text"],
    aliases: ["two-up"],
    permLevel: 0,
    botPerms: [],
    requiredFuncs: [],
};

exports.help = {
    name: "twoup",
    description: "Bet on coin flips. Get two heads in a row and win or hope for all five odds!",
    usage: "[credits:int]",
    usageDelim: " ",
    extendedHelp: "Two-up is a traditional Australian gambling game, involving a designated 'spinner' throwing two coins into the air. Players bet on whether the coins will fall with both heads up, both tails up, or with one head and one tail up (known as 'odds'). It is traditionally played on Anzac Day in pubs and clubs throughout Australia, in part to mark a shared experience with Diggers through the ages.",
};

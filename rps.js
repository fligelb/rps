var readlineSync = require('readline-sync');
let KeyAndHmac = require('./keyhmac.js');
let Rules = require('./rules.js');
let Help = require('./help.js');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function menu(moves, computerHmac){
    console.log(`HMAC: ${computerHmac}`);

    console.log(`Available moves:`);
    for (let i = 0; i < moves.length; i++){
        console.log(`${i + 1} - ${moves[i]}`);
    }
    console.log(`0 - exit
? - help`);

    let userMoveIndex = readlineSync.question('Your move: ');

    return userMoveIndex;
}

function check(moves){
    if (moves.length <= 1){
        console.log('No moves were entered or only one was entered , try again. For example: rock paper scissors');
        process.exit(1);
    } else 
        if (moves.length % 2 == 0){
            console.log('An even number of moves were entered, try again. For example: 3 different moves');
            process.exit(1);
        } else{
            moves.forEach(function(a){
                if (moves.includes(a, moves.indexOf(a) + 1) == true){
                    console.log('Same moves were entered, try again');
                    process.exit(1);
                }
            });
        }

        return moves;
} 

let moves = check(process.argv.slice(2));
let computerKey = new KeyAndHmac().createKey();
let computerMoveIndex = getRandomInt(moves.length);
let computerMove = moves[computerMoveIndex];
let computerHmac = new KeyAndHmac(computerMove, computerKey).getHmac();

let userMoveIndex = menu(moves, computerHmac);
while (userMoveIndex < '0' || userMoveIndex > String(moves.length) || userMoveIndex == '?'){
    if (userMoveIndex == '?'){
        let table = new Help(moves).generateTable();
    } 
    userMoveIndex = menu(moves, computerHmac);
}

if(+userMoveIndex == 0) process.exit(0);

moves.forEach(function(elem){
    if(elem == moves[+userMoveIndex - 1]){
        let userMove = moves[+userMoveIndex - 1];
        console.log(`Your move: ${userMove}`);
        console.log(`Computer move: ${computerMove}`);
        let winLoseDrawMessage = new Rules(moves).determineTheWinner(+userMoveIndex - 1, computerMoveIndex);
        console.log(`${winLoseDrawMessage}
HMAC key: ${computerKey}`);
    }
})
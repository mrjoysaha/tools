/* ==========================
   GAME DATA
========================== */

const players = [
    "red",
    "green",
    "yellow",
    "blue"
];

let currentPlayerIndex = 0;
let diceValue = 0;

const safeCells = [
0,
5,
8,
13
];

const playerData = {

    red:{
        score:0,
        start:0,
        tokens:["r1","r2","r3","r4"]
    },

    green:{
        score:0,
        start:3,
        tokens:["g1","g2","g3","g4"]
    },

    yellow:{
        score:0,
        start:8,
        tokens:["y1","y2","y3","y4"]
    },

    blue:{
        score:0,
        start:12,
        tokens:["b1","b2","b3","b4"]
    }

};

const tokenState = {};

/* ==========================
   INIT TOKENS
========================== */

Object.values(playerData)
.forEach(player=>{

    player.tokens.forEach(token=>{

        tokenState[token] = -1;

    });

});

/* ==========================
   DOM
========================== */

const diceBtn =
document.getElementById("diceBtn");

const diceDisplay =
document.getElementById("diceValue");

const currentPlayerText =
document.getElementById("currentPlayer");

const gameLog =
document.getElementById("gameLog");

/* ==========================
   HELPERS
========================== */

function log(message){

    gameLog.innerHTML +=
    "<br>" + message;

    gameLog.scrollTop =
    gameLog.scrollHeight;
}

function updateTurnUI(){

    currentPlayerText.innerText =
    players[currentPlayerIndex]
    .toUpperCase();
}

function nextTurn(){

    currentPlayerIndex++;

    if(
        currentPlayerIndex >=
        players.length
    ){
        currentPlayerIndex = 0;
    }

    updateTurnUI();
}

/* ==========================
   DICE
========================== */

diceBtn.addEventListener(
"click",
rollDice
);

function rollDice(){

    diceValue =
    Math.floor(
        Math.random()*6
    ) + 1;

    diceDisplay.innerHTML =
    "🎲 " + diceValue;

    log(
    players[currentPlayerIndex]
    +
    " rolled "
    +
    diceValue
    );

    activateTokens();

}

/* ==========================
   TOKEN ACTIVATION
========================== */

function activateTokens(){

    clearActiveTokens();

    const player =
    players[currentPlayerIndex];

    playerData[player]
    .tokens
    .forEach(tokenId=>{

        const token =
        document.getElementById(
            tokenId
        );

        token.classList.add(
            "active"
        );

        token.onclick =
        ()=>moveToken(tokenId);

    });

}

function clearActiveTokens(){

    document
    .querySelectorAll(".token")
    .forEach(token=>{

        token.classList.remove(
            "active"
        );

        token.onclick = null;

    });

}

/* ==========================
   MOVE TOKEN
========================== */

function moveToken(tokenId){

    const player =
    players[currentPlayerIndex];

    let pos =
    tokenState[tokenId];

    const startCell =
    playerData[player].start;

    /* Unlock */

    if(
        pos === -1 &&
        diceValue === 6
    ){

        tokenState[tokenId] =
        startCell;

        placeToken(
            tokenId,
            startCell
        );

        log(
        tokenId +
        " entered board"
        );

        playerData[player]
        .score++;

        updateScores();

        clearActiveTokens();

        return;
    }

    if(pos === -1){

        log(
        "Need 6 to unlock token"
        );

        clearActiveTokens();

        nextTurn();

        return;
    }

    /* Move */

    let newPos =
    pos + diceValue;

    if(newPos > 14){

        newPos =
        newPos % 15;
    }

    tokenState[tokenId] =
    newPos;

    placeToken(
        tokenId,
        newPos
    );

    captureCheck(
        tokenId,
        newPos
    );

    playerData[player]
    .score++;

    updateScores();

    checkWin(player);

    clearActiveTokens();

    if(diceValue !== 6){

        nextTurn();

    }

}

/* ==========================
   PLACE TOKEN
========================== */

function placeToken(
tokenId,
cellNumber
){

    const token =
    document.getElementById(
        tokenId
    );

    const cell =
    document.querySelector(
        `[data-cell="${cellNumber}"]`
    );

    if(cell){

        cell.appendChild(token);

    }

}

/* ==========================
   CAPTURE SYSTEM
========================== */

function captureCheck(
tokenId,
position
){

    if(
        safeCells.includes(
            position
        )
    ){
        return;
    }

    const currentColor =
    tokenId.charAt(0);

    Object.keys(tokenState)
    .forEach(other=>{

        if(
            other !== tokenId &&
            tokenState[other] === position &&
            other.charAt(0)
            !== currentColor
        ){

            tokenState[other] = -1;

            sendHome(other);

            log(
            tokenId +
            " captured " +
            other
            );

        }

    });

}

/* ==========================
   SEND TOKEN HOME
========================== */

function sendHome(tokenId){

    const token =
    document.getElementById(
        tokenId
    );

    const color =
    tokenId.charAt(0);

    let home = null;

    switch(color){

        case "r":
        home =
        document.querySelector(
        ".red-home"
        );
        break;

        case "g":
        home =
        document.querySelector(
        ".green-home"
        );
        break;

        case "y":
        home =
        document.querySelector(
        ".yellow-home"
        );
        break;

        case "b":
        home =
        document.querySelector(
        ".blue-home"
        );
        break;
    }

    if(home){

        home.appendChild(token);

    }

}

/* ==========================
   SCOREBOARD
========================== */

function updateScores(){

    document.getElementById(
    "redScore"
    ).innerText =
    playerData.red.score;

    document.getElementById(
    "greenScore"
    ).innerText =
    playerData.green.score;

    document.getElementById(
    "yellowScore"
    ).innerText =
    playerData.yellow.score;

    document.getElementById(
    "blueScore"
    ).innerText =
    playerData.blue.score;

}

/* ==========================
   WIN SYSTEM
========================== */

function checkWin(player){

    const tokens =
    playerData[player]
    .tokens;

    let completed = 0;

    tokens.forEach(token=>{

        if(
            tokenState[token]
            >= 14
        ){
            completed++;
        }

    });

    if(completed === 4){

        alert(
        player.toUpperCase()
        +
        " WINS!"
        );

        location.reload();

    }

}

/* ==========================
   START
========================== */

updateTurnUI();

log(
"Game Started!"
);

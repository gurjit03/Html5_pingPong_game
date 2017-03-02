//window.localStorage.clear();
var splashScreen = document.getElementById('splashScreen');
var gameCanvas = document.getElementById('gameCanvas');
var askName = document.getElementById('askName');
var playerName = document.getElementById('playerName');
var playerNameBtn = document.getElementById('playerNameBtn');
var highScores = document.getElementById('highScores');
var moveBack = document.getElementById('moveBack');
var sortBtn = document.getElementById('sort');
var nameOfPlayer = "Anonymous";
var jsonData = {};
var jsObjArray = {};
var scoresList = document.getElementById('scoresList');
var startBtn = document.getElementById('startBtn');
var scores ={};

////// THis is the way to create sound on the collisions /////////
var collision = new Audio();
collision.src = "collide.mp3";

startBtn.addEventListener('click',function(){
    splashScreen.style.WebkitAnimation = "splashed 1s linear forwards";
    splashScreen.style.MozAnimation = "splashed 1s linear forwards";
    //splashScreen.style.Animation = "splashed 1s linear forwards";
    gameCanvas.style.display = "block";
    askName.style.zIndex = "2";
    askName.style.WebkitAnimation = "moveup .5s linear .6s forwards";
    askName.style.MozAnimation = "moveup .5s linear .6s forwards";
    gameCanvas.style.WebkitAnimation = "gameOn .5s linear .6s forwards";
    gameCanvas.style.MozAnimation = "gameOn .5s linear .6s forwards";
},false);

scoresList.addEventListener('click',function(){
        splashScreen.style.WebkitAnimation = "splashed .3s linear forwards";
        splashScreen.style.MozAnimation = "splashed .3s linear forwards";

//            //alert("Control moving to the displayScores");
        displayScores();
    }, false);

moveBack.addEventListener('click',function(){
    highScores.style.display = "none";
    moveBack.style.display = "none";
    sortBtn.style.display = "none";
    splashScreen.style.WebkitAnimation = "moveup .2s linear forwards";
    splashScreen.style.MozAnimation = "moveup .2s linear forwards";
},false);

function displayScores() {
    jsObjArray = JSON.parse(localStorage.getItem('gameInfo'));
    scores = jsObjArray;
    drawTable(jsObjArray);
    moveBack.style.display = "block";
    sortBtn.style.display = "block";
    jsObjArray = {};
}

sortBtn.addEventListener('click',function(){
   if (sortBtn.className == "descend") {
       sortBtn.className = "ascend";
   } else {
       sortBtn.className = "descend";
   }
    sortScores(sortBtn.className);
},false);

function sortScores(className) {
    var sortedArray = {};
    sortedArray = (className == "descend") ? sortByKeyDescend(scores,"scores") : sortByKey(scores,"scores");
    drawTable(sortedArray);
}

//////// Bubble Sort method not so successful ////
//function sortAscend(scores) {
//    var tempObj = {};
//    for(var i = 0; i < scores.length - 1;i++) {
//        for(var j = i; j < scores.length - 1;j++) {
//            console.log(scores[j].scores);
//            //if(!(j > scores.length - 2)) {
//                console.log(scores[j+1].scores);
//                if (scores[j].scores > scores[j + 1].scores) {
//                    tempObj[j] = scores[j];
//                    scores[j] = scores[j + 1];
//                    scores[j + 1] = tempObj[j];
//                }
//        //    }
//        }
//    }
//    return scores;
//}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        //return ((x < y) ? -1 : ((x > y) ? 1 : 0));
       //return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        return ((x < y) ? -1 : 1);
    });
}

function sortByKeyDescend(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        //return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        //return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        return ((x < y) ? 1 : -1);
    });
}

///// This function will draw the table on the scores list ///////
function drawTable(scores) {
    var output = '';
    output = "<table id=\"scoresTable\"><tr>" +
        "<th>S.no</th>" +
        "<th>Player Name</th>"+
        "<th>Player Scores</th></tr>";
    highScores.style.display = "block";
    for( var i =0 ; i< scores.length; i++) {
        output += "<tr><td>"+(i+1)+"</td>"+
            "<td>"+scores[i].player+"</td>"+
            "<td>"+scores[i].scores+"</td><tr>";

    }
    output +="</table>";

    var scoreTable = document.getElementById('scoresTable');
    scoreTable.innerHTML = output;
}

playerNameBtn.addEventListener('click',function(e){

        if (!(playerName.value == "")) {
            nameOfPlayer = playerName.value;
        }
        askName.style.WebkitAnimation = "splashed .5s linear forwards";
        askName.style.MozAnimation = "splashed .5s linear forwards";
        // window.removeEventListener('keypress',startScreen,false);
        e.preventDefault();
        startGame();
},false);


/////// Declaring and initializing the variables to be used ////////

/// These are ball center points and radius///
var cx = 20;
var cy = 20;
var radius = 08;

/// The speed/ displacement of ball in x and y direction
var dx = 5;
var dy = 5;

//// Properties of the Paddle..///
var paddleWidth = 120;
var paddleHeight = 12;
var paddleLeft = 300;
var paddleTop = 455;

/// Properties of the Board ///////
var boardWidth = 500;
var boardHeight = 500;

////// Scores //////
var hits;
var animation;

//////// Starting the game /////////////
function startGame() {

    if(document.getElementById('gameOverMessage')) {
        var gameout = document.getElementById('gameOverMessage');
        gameout.parentNode.removeChild(gameout);
    }
    alert("PRESS ENTER TO PLAY GAME");

    document.addEventListener('keydown',getKey,false);
    cx = 20;
    cy = 20;

    //// Properties of the Paddle..///
    var paddleWidth = 120;
    var paddleHeight = 12;
    var paddleLeft = 300;
    var paddleTop = 455;

    /// The speed/ displacement of ball in x and y direction
    dx = 5;
    dy = 5;
    hits = 0;
    createGame();
}

function createGame() {
    //// removing the event listener on the button.////
    playerNameBtn.addEventListener('click',function(){
        playerNameBtn.removeEventListener('click',arguments.callee,false);
    },false);


    animation = requestAnimationFrame(createGame);
    ///// Initializing the canvas and context of the canavs ///////
    //var gameCanvas = document.getElementById("gameCanvas");
    var ctx = gameCanvas.getContext("2d");
    ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);

    checkCollision();

    //////////// leftmost || rightMost point of circle //////////////
    if( cx + radius > boardWidth || cx - radius < 0) {
    //    alert ("cx = "+cx+" cy = "+cy+" dx = "+dx+" dy = "+dy+" paddleTop = "+paddleTop+" paddleLeft  = "+paddleLeft);
    	dx = -dx;
    }

    //////////// topmost point of circle //////////////
    if( cy - radius < 0){
    //    alert ("cx = "+cx+" cy = "+cy+" dx = "+dx+" dy = "+dy+" paddleTop = "+paddleTop+" paddleLeft  = "+paddleLeft);
        dy = -dy;
    }

    //////// In case the lowermost point of ball touches the bottom///////////
    if (cy + radius > boardHeight) {
    //    alert ("cx = "+cx+" cy = "+cy+" dx = "+dx+" dy = "+dy+" paddleTop = "+paddleTop+" paddleLeft  = "+paddleLeft);
        cancelAnimationFrame(animation);
        //document.removeEventListener('keydown',getKey,false);
	    gameOver();
    }

     cx = cx + dx;
     cy = cy + dy;

    ctx.beginPath();
    ctx.arc(cx,cy,radius,2*Math.PI,false);
    //ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fillRect(paddleLeft,paddleTop,paddleWidth,paddleHeight);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText( "Player Name : "+nameOfPlayer, 14, 25);
    ctx.fillText( "Scores : "+hits, 380, 28);

}

function checkCollision(){
    ///// This is collision detection for the upper part /////
	if( cx - radius > paddleLeft && cy + radius > paddleTop && cx + radius < paddleLeft + paddleWidth && cy + radius < paddleTop + 5 ) {
    //    alert ("cx = "+cx+" cy = "+cy+" dx = "+dx+" dy = "+dy+" paddleTop = "+paddleTop+" paddleLeft  = "+paddleLeft+"cy + radius "+ cy + radius);
        dy = -dy;
        ++hits;  /// On collision we are increasing the Score
        playSound();
	}

    ///// check for the collsion from the left side of paddle
    else if( cy + radius > paddleTop && cy < paddleTop + paddleHeight && cx + radius > paddleLeft && cx + radius < paddleLeft + 4 ) {
    //    alert("collided with left side");
    //    alert ("cx = "+cx+" cy = "+cy+" dx = "+dx+" dy = "+dy+" paddleTop = "+paddleTop+" paddleLeft  = "+paddleLeft);
        dx = -dx;
        dy = dy;
        playSound();
    }

    /////// then check for the collision for the edge of left paddle.
    else if( cx + radius >= paddleLeft && cy + radius >= paddleTop && cx + radius < paddleLeft + 8 && cy + radius < paddleTop + 4) {
    //   alert("collision with left edge");
        dx = dx;
        dy = -dy;
        ++hits;  /// On collision we are increasing the Score
        playSound();
    }
    /////check from the right corner
    else if( cx +radius > paddleLeft + (paddleWidth - 8) && cy + radius >= paddleTop && cx + radius < paddleLeft + paddleWidth + 4 && cy + radius < paddleTop + 8) {
      //   alert("collision with right edge");
        dx = -dx;
        dy = -dy;
        ++hits;  /// On collision we are increasing the Score
        playSound();
    }
    /////// check for the collision from the right side of the paddle
    else if (cy + radius > paddleTop && cy + 5 < paddleTop + paddleHeight && cx - radius > paddleLeft + paddleWidth - 1 && cx - radius < paddleLeft + paddleWidth + 2 ) {
    //alert("collided with right side");
    // alert ("cx = "+cx+" cy = "+cy+" dx = "+dx+" dy = "+dy+" paddleTop = "+paddleTop+" paddleLeft  = "+paddleLeft+"cy + radius "+ cy + radius);
        dx = -dx;
        dy = dy;
        //++hits;  /// On collision we are increasing the Score
        playSound();
    }
	else if(cx - radius > paddleLeft && cx - radius < paddleLeft + 9 && cy + radius > paddleTop ) {

        dx = dx;
        dy = -dy;
       // ++hits;  /// On collision we are increasing the Score
        playSound();
	}

	else if(cx + radius < paddleLeft + (paddleWidth + 2) && cx - radius > paddleLeft + (paddleWidth - 8) && cy + radius > paddleTop + 6 && cy - radius < paddleTop - 2) {

        dx = -dx;
        dy = -dy;
        ++hits;  /// On collision we are increasing the Score
        playSound();
	}
}

//////////// Src property must be set again to get it work /////////////
function playSound() {
    collision.src = "collide.mp3"; ////////// Set the src property to make it work again. ////

    /////////To remove monotonius game exeriance ///////
    if(hits > 0 && hits % 4 == 0) {
        dx *= 1.1;
        dy *= 1.1;
    }
    collision.play();
}

function getKey(e){
    switch (e.keyCode || e.charCode) {
        case 37:               //////pressing the left arrow
            paddleLeft -= 15;
            if(paddleLeft < 0) {
            	paddleLeft = 0;
            }
        break;

        case 39:                /////pressing the right arrow
            paddleLeft += 15;
            if(paddleLeft + paddleWidth > boardWidth){
            	paddleLeft = boardWidth - paddleWidth;
            }
        break;
    }
}

function gameOver() {
    //////////// Dynamically creating the gameOverMessage //////////
    var gameOverMessage = document.createElement('div');
    gameOverMessage.appendChild(document.createTextNode("GAME OVER"));

    // Dynamically creating the <p> tag inside the div ////////
    var elem = document.createElement('p');
    elem.appendChild(document.createTextNode("press c to Continue and q to Exit."));

    ///// appending the <p> tag to the dynamically created div //////
    gameOverMessage.appendChild(elem);
    gameOverMessage.id = "gameOverMessage";

    //// Finally appending the elements to the body element////
    document.body.appendChild(gameOverMessage);
    document.addEventListener('keydown',continueFurther,false);
}

function continueFurther(event) {
    switch(event.keyCode) {
        case 67:
            ///// Removing the gameOver element //////////////
            var gameout = document.getElementById('gameOverMessage');
            gameout.parentNode.removeChild(gameout);
            startGame();
            break;

        case 81:
            //// Getting the scores and saving the data locally to the browser////
            jsonData.player = nameOfPlayer;
            jsonData.scores = hits;

            storeDataLocally(jsonData);

            ///// Removing the gameOver element //////////////
            var gameout = document.getElementById('gameOverMessage');
            gameout.parentNode.removeChild(gameout);

            ////////// Have to go back to the Splash screen /////
            gameCanvas.width = gameCanvas.width;
            gameCanvas.style.display = "none";
            askName.style.zIndex = "-1";
            splashScreen.style.WebkitAnimation = "moveup .5s linear forwards";
            splashScreen.style.MozAnimation = "moveup .5s linear forwards";

            window.addEventListener('keypress',startScreen,false);
            break;
    }
}

function storeDataLocally(data) {
    var game = [];
    //alert(data.player);
    var previousData = JSON.parse(localStorage.getItem('gameInfo'));
    // Parse the serialized data back into an array of objects

    if(!(previousData == null)) {
        for(var i =0;i<previousData.length;i++) {
            if(!(previousData[i] == null)) {
                game[i] = previousData[i];
            } else {
                game[i+1] = previousData[i];
            }
        }
    }
    // Push the new data (whether it be an object or anything else) onto the array
    game.push(data);

    // Push the new stringified data into the gameInfo
    localStorage.setItem('gameInfo',JSON.stringify(game));
}

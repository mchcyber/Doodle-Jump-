 // Board 
 let board ; 
 let boardWidth = 360 ;
 let boardHeight = 576; 
 let context; 

 // doodler 
 let doodlerWidth = 46; 
 let doodlerHeight = 46 ; 
 let doodlerX = boardWidth/2 - doodlerWidth/2; 
 let doodlerY = boardHeight*7/8 - doodlerHeight; 
 let doodlerRightImg; 
 let doodlerLeftImg; 

 let doodler =  {
    img : null , 
    x: doodlerX , 
    y: doodlerY , 
    width : doodlerWidth , 
    height : doodlerHeight , 
}
 //physics 
 let velocityX = 0 ; 
 let velocityY =  0 ;  // jump speed 
 let initialVelocityY = -8 ;  // starting velocity y 
 let gravity = 0.4 ;

 // platforms 
 let platformArray = [] ; 
 let platfromWidth = 60 ; 
 let platformHeight = 18; 
 let platformImg; 

let score = 0 ; 
let maxScore = 0 ;
let gameOver = false  ; 

 window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight ; 
    board.width = boardWidth; 
    context = board.getContext("2d"); // used for drawing on the board 

    //draw doodler 
    // context.fillStyle = "green"
    // context.fillRect(doodler.x , doodler.y , doodler.width , doodler.height); 

    //load images 
    doodlerRightImg = new Image(); 
    doodlerRightImg.src = "./images/doodler-right.png" ; 
    doodler.img = doodlerRightImg ; 

    doodlerRightImg.onload = function() {
   
        context.drawImage(doodler.img, doodler.x, doodler.y , doodler.width, doodler.height);
    }
        doodlerLeftImg = new Image(); 
        doodlerLeftImg.src = "./images/doodler-left.png"

        platformImg = new Image(); 
        platformImg.src = "./images/platform.png"; 
        
    velocityY = initialVelocityY ; 
    placeplatforms(); 
    requestAnimationFrame(update); 
    document.addEventListener("keydown",moveDoodler);
 }

 function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return ; 
    }
    context.clearRect(0, 0, board.width, board.height); 

    //doodler
    doodler.x += velocityX ; 
    if (doodler.x > boardWidth) {
        doodler.x = 0; 
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth ; 
    }
    velocityY += gravity;
    doodler.y += velocityY ; 
    if (doodler.y > board.height) {
        gameOver = true  ; 
    }
    context.drawImage(doodler.img, doodler.x, doodler.y , doodler.width, doodler.height);

    // platforms 
    for (let i = 0; i < platformArray.length ; i++) {
        let platfrom = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight * 3/4) {
            platfrom.y -= initialVelocityY; // jump  platfrom down 
        }
        if (detectCollision(doodler, platfrom) && velocityY >= 0) {
            velocityY = initialVelocityY;
        }
        context.drawImage(platfrom.img, platfrom.x , platfrom.y , platfrom.width, platformHeight);
    }
    // clear platfroms and aad new platfrom 
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight){
        platformArray.shift(); // removes first element from the array 
        newPlatform();
    }; 

    //score 
    updateScore(); 
    context.fillStyle = "black" ; 
    context.font = "16px sans-serif" ; 
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("Game Over: Pres 'Space' to Restart", boardWidth/7 , boardHeight*7/8)
    }

}

 function moveDoodler(e) {
    if (e.code =="ArrowRight" || e.code == "keyD" ) {
        velocityX = 4 ; 
        doodler.img = doodlerRightImg; 
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA" ) { //move left
        velocityX =-4 ; 
        doodler.img = doodlerLeftImg; 
    }
    else if (e.code == "Space" && gameOver) {
      /// reest 
       doodler =  {
        img : doodlerRightImg , 
        x: doodlerX , 
        y: doodlerY , 
        width : doodlerWidth , 
        height : doodlerHeight , 
    }
    velocityX = 0 ; 
    velocityY = initialVelocityY ; 
    score = 0  ;
    maxScore = 0 ; 
    gameOver = false ; 
    placeplatforms();
    }
 }

 function placeplatforms() {
    platformArray = [] ; 

    //starting platforms 
    let platform = {
        img : platformImg, 
        x : boardWidth/2, 
        y : boardHeight - 50, 
        width: platfromWidth, 
        height : platformHeight 
    }
    platformArray.push(platform);



   for (let i = 0 ; i < 6; i++ ) {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth * 3/4 
    let platform = {
        img : platformImg, 
        x : randomX, 
        y : boardHeight - 75*i - 150, 
        width: platfromWidth, 
        height : platformHeight 
    }
    platformArray.push(platform);
   }
 }

 function newPlatform()  {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth * 3/4 
    let platform = {
        img : platformImg, 
        x : randomX, 
        y : -platformHeight , 
        width: platfromWidth, 
        height : platformHeight 
    }
    platformArray.push(platform);
 }

 function detectCollision (a,b) {
    return a.x < b.x + b.width  &&  // a's top left corner doesn't reach b's top right corner 
           a.x + a.width  > b.x &&  // a's top right corner doesn't reach b's top leftcorner
           a.y < b.y + b.height &&  // a's top left corner doesn't reach b's bottom left corner
            a.y + a.height > b.y ;  // a's top left corner doesn't reach b's top left corner     
        }

function updateScore() {
    let points = Math.floor(50*Math.random()); 
    if (velocityY < 0 ) {
        maxScore += points ; 
        if ( score < maxScore) {
            score = maxScore;
        }
     }
     else if (velocityY >= 0) {
        maxScore -= points ; 
     }
}
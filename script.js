function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  }

  //score counter
let counter = 0;

//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//players
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let player1 = {
    x: 10,
    y: boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY

}

let player2 = {
    x: boardWidth - playerWidth - 10,
    y: boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY
}

let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x: boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : ((Math.round(Math.random())*2)-1)*2,
    velocityY :((Math.round(Math.random())*2)-1)*2 
}


function drawBoard() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth
    context = board.getContext("2d");

    //draw initial player1
    context.fillStyle="blue";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);


    requestAnimationFrame(update);
    document.addEventListener("keyup", movePlayer)
}


function countdown() {
  let counter = 10;
  let interval = setInterval(function() {
    counter--;
      if ( counter <=  10 && counter >4) {
        document.getElementById("countdown").innerHTML = "Single Player Pong!<br>W/S for Left Side<br>Up/Down Arrow for Right!";
      }
        else if (counter ==4) {
          document.getElementById("countdown").innerHTML = "Ready...";
      } else if (counter == 3){
          document.getElementById("countdown").innerHTML = "Set";
      }
      else if (counter == 2){
        document.getElementById("countdown").innerHTML = "GO!";
      }
      else if (counter == 1){
        clearInterval(interval);
        document.getElementById("countdown").innerHTML = "";
        drawBoard();
      }
  }, 1000);
}

function update(){
    context.clearRect(0,0,board.width, board.height);


    //player 1
    context.fillStyle = "purple";
    //player1.y += player1.velocityY;
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)){
        player1.y = nextPlayer1Y
    }
    context.fillRect(player1.x, player1.y, player1.width, player1.height);




    //player 2
    //layer2.y += player2.velocityY;
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)){
        player2.y = nextPlayer2Y
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);


    //ball
    context.fillStyle = "white";
    let nextBallY = ball.y + ball.velocityY;
    let nextBallX = ball.x + ball.velocityX; 
    if (ballBounceY(nextBallY)){
        ball.velocityY *= -1
    }
    if (ballBounceX(nextBallX)){
        ball.velocityX *= -1
        counter += 1
    }
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    if (ball.x > boardWidth || ball.x < 0){
        var hider = document.getElementById("board");
        hider.style.display = "none";
        document.getElementById("demo").innerHTML = "GAME OVER <br>" + "Score: " + counter + "<br> ‎";
        let elementHide = document.getElementById("countdown");
        elementHide.style.display = "none";

    }
    else{
        requestAnimationFrame(update);

    }
}

function outOfBounds(yPosition) {
    return(yPosition < 0 || yPosition + playerHeight > boardHeight);
}
function ballBounceX(ballX){
    if (ballX > boardWidth - 30 || ballX < 20){
        if (ballX > 250){
            if (ball.y < player2.y + 50 && ball.y > player2.y){
                return true
            }
        }
        else if (ballX <250){
            if (ball.y < player1.y + 50 && ball.y > player1.y){
                return true
            } 
        }
    }
}
function ballBounceY(ballY){
    return(ballY < 0 || ballY + playerHeight - 40> boardHeight);
}

function movePlayer(e) {
    //player1
    if (e.code == "KeyW"){
        player1.velocityY = -3;
    }
    else if (e.code== "KeyS"){
        player1.velocityY=3;
    }
    //player2
    if (e.code == "ArrowUp"){
        player2.velocityY = -3;
    }
    else if (e.code== "ArrowDown"){
        player2.velocityY=3;
    }

}

//DARK MODE

function applyTheme(theme) {
    const themeStylesheet = document.getElementById('themeStylesheet');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const logoDark = document.getElementById('logoDark');
    const projectLogoDark = document.getElementById('projectLogoDark');

    if (theme === 'dark') {
        themeStylesheet.setAttribute('href', 'styleDark.css');
        themeToggleBtn.classList.add('dark');
        logoDark.setAttribute('src', 'assets/logoDark.png');
        projectLogoDark.setAttribute('src', 'assets/logoDark.png');

    } else {
        themeStylesheet.setAttribute('href', 'style.css');
        themeToggleBtn.classList.remove('dark');
        logoDark.setAttribute('src', 'assets/logo.png');
        projectLogoDark.setAttribute('src', 'assets/logo.png');
    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
}

document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);


// Arudino Expand

function expandItem(item, title, description, imageSrc, videoSrc) {
    let expandedItem = document.getElementById('expanded-item');
    let expandedImageContainer = expandedItem.querySelector('.expanded-image');
    let expandedImage = expandedItem.querySelector('.expanded-image img');
    let expandedTitle = expandedItem.querySelector('.expanded-description h3');
    let expandedDescription = expandedItem.querySelector('.expanded-description p');
    let expandedVideoContainer = expandedItem.querySelector('.expanded-video');
    let expandedVideo = expandedItem.querySelector('.expanded-video iframe');

    expandedImage.src = imageSrc;
    expandedImage.alt = title;
    expandedTitle.textContent = title;
    expandedDescription.textContent = description;
    expandedVideo.src = videoSrc;

    if (videoSrc == '') {
        expandedVideoContainer.style.display = 'none';
        expandedVideo.src = '';
    } else {
        expandedVideoContainer.style.display = 'block';
        expandedVideo.src = videoSrc;
    }

    if (imageSrc == '') {
        expandedImageContainer.style.display = 'none';
        expandedImage.src = '';
    } else {
        expandedImageContainer.style.display = 'block';
        expandedImage.src = imageSrc;
    }

    expandedItem.classList.add('active');
}

    function collapseItem() {
        let expandedItem = document.getElementById('expanded-item');
        let expandedVideo = expandedItem.querySelector('.expanded-video iframe');

        expandedItem.classList.remove('active');
        expandedVideo.src = '';
    }
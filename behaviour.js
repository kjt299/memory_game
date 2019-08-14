/* Memory Card Game version 4
 * Date: 15/07/2019
 * Author: kjt299
*/

//declaring all global variables
let myLocations = [];
let myColors = [];
let newGame = [];
let compareOne = null;
let compareTwo = null;
let clicked;
let guessed = [];
let started = false;

//variables holding color cards
const blue = "images/blue.jpg";
const red = "images/red.jpg";
const yellow = "images/yellow.jpg";
const green = "images/green.jpg";
const pink = "images/pink.jpg";
const orange = "images/orange.jpg";
const navy = "images/navy.jpg";
const black = "images/black.jpg";
const back = "images/back.jpg";
const transparent = "images/transparent.jpg";

//constructor for cards
function Card(front, location) {
  this.front = front;
  this.location = location;
}

const game = {
  rows: ["a", "b", "c", "d"],
  columns: ["1", "2", "3", "4"],
  colors: [blue, red, yellow, green, pink, orange, navy, black]
};

//function that creates locations based on rows and columns that have been specified in the game object
function createLocations() {
  let loc = [];
  for (let i = 0; i < game.rows.length; i++) {
    for (let j = 0; j < game.columns.length; j++) {
      loc.push(game.rows[i] + game.columns[j]);
    }
  }
  return loc;
}

//chooses one random color from the game object colors property
function createRandomColor() {
  let randomColor = Math.floor(Math.random() * game.colors.length);
  if (myColors.includes(randomColor) === false) {
    myColors.push(randomColor);
    return game.colors[randomColor];
  } else {
    return createRandomColor();
  }
}

//chooses one random location from the loc array that has been created  by the createLocations() function
function createRandomLocation() {
  let currentLocations = createLocations();
  let randomLocation = Math.floor(Math.random() * currentLocations.length);
  if (myLocations.includes(randomLocation) === false) {
    myLocations.push(randomLocation);
    return currentLocations[randomLocation];
  } else {
    return createRandomLocation();
  }
}

//creates new game by assigining random color cards to random locations
function createGame() {
  let x = 0;
  while (x < game.colors.length) {
    let aCurrentColor = createRandomColor();
    let y = 0;
    while (y < 2) {
      let aCurrentLocation = createRandomLocation();
      let aCard = new Card(aCurrentColor, aCurrentLocation);
      newGame.push(aCard);
      y++;
    }
    x++;
  }
  return newGame;
}

//sets all cards to have the same color(back) when first loaded
function printCards() {
  for (let i = 0; i < newGame.length; i++) {
    $("#" + newGame[i].location).attr("src",back);
  }
}

function main() {
  myColors.length = 0;
  myLocations.length = 0;
  newGame.length = 0;
  guessed.length = 0;
  createGame();
  printCards();
}

//compares two cards that have been clicked and revealed
function compare() {
  if ($("#" + compareOne).attr("src") ===  $("#" + compareTwo).attr("src")) {
    remove(compareOne);
    remove(compareTwo);
    guessed.push(compareOne);
    guessed.push(compareTwo);
    gameOver();
  } else {
    revert(compareOne);
    revert(compareTwo);
  }
}

//reverts card (source of the image)to its initial image
function revert(it) {
  $("#" + it).attr("src",back);
}

//removes card from the game
function remove(elementId) {
  $("#" + elementId).attr("src",transparent);
}

//reveals card after user click
function reveal() {
  for (let j = 0; j < newGame.length; j++) {
    if (newGame[j].location == clicked) {
      $("#" + clicked).attr("src", newGame[j].front);
    }
  }
  if (compareOne !== null && compareTwo !== null) {
    setTimeout(() => {
      compare();
      compareOne = null;
      compareTwo = null;
    }, 200);
  }
}

$("img").click(function(event) {
  clicked = event.target.id;
  if (!guessed.includes(clicked)) {
    if (compareOne === null) {
      compareOne = clicked;
      reveal();
    } else {
      compareTwo = clicked;
      if (compareOne !== compareTwo) {
        reveal();
      } else {
        revert(compareOne);
        compareOne = null;
        compareTwo = null;
      }
    }
  }
});

function gameOver() {
  if (guessed.length / 2 === game.colors.length) {
    if(innerWidth < 768){
      $(".col-lg-5 img").show();
     } 
    $("#table").hide();
    $("#congrats").show(); 
    setTimeout(() => {
      $("#congrats").fadeOut(2500);
      $("#start").fadeIn(2500);
    }, 5000);
  }
}

document.getElementById("start").addEventListener("click", function() {
  main();
  $("#instructions").hide();
  $("#start").hide();
  $("#table").show();
  if(innerWidth < 768){
    $(".col-lg-5 img").hide();
   }
  started = true;
});

//hides penguine picture if the screen is not big enough and shows once the screen width is over 768 px
$(window).resize(function(){
  if(innerWidth < 768 && started === true){
   $(".col-lg-5 img").hide();
  } else {
   $(".col-lg-5 img").show();
  }  
 });
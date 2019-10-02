const color = {
  blue: "images/blue.jpg",
  red: "images/red.jpg",
  yellow: "images/yellow.jpg",
  green: "images/green.jpg",
  pink: "images/pink.jpg",
  orange: "images/orange.jpg",
  navy: "images/navy.jpg",
  black: "images/black.jpg",
  back: "images/back.jpg",
  transparent: "images/transparent.jpg"
};

const game = {
  locations: ["a1","a2","a3","a4","b1","b2","b3","b4","c1","c2","c3","c4","d1","d2","d3","d4"],
  colors: [
    color.blue,
    color.red,
    color.yellow,
    color.green,
    color.pink,
    color.orange,
    color.navy,
    color.black
  ],
  generatedRandomLocations: [],
  generatedRandomColors: [],
  content: [],
  started: false,
  guessedCards: [],
  clickedCard: null,
  counter: 0,
  cardOne: null,
  cardTwo: null
};

function Card(front, location) {
  this.front = front;
  this.location = location;
}

function main() {
  reset();
  createGame();
  printCards();
}

function reset() {
  game.generatedRandomColors.length = 0;
  game.generatedRandomLocations.length = 0;
  game.content.length = 0;
  game.guessedCards.length = 0;
  game.counter = 0;
}

function createGame() {
  let x = 0;
  while (x < game.colors.length) {
    const chosenRandomColor = chooseRandomColor();
    let y = 0;
    while (y < 2) {
      let chosenRandomLocation = chooseRandomLocation();
      let aCard = new Card(chosenRandomColor, chosenRandomLocation);
      game.content.push(aCard);
      y++;
    }
    x++;
  }
  return game.content;
}

function chooseRandomColor() {
  let randomColor = Math.floor(Math.random() * game.colors.length);
  if (game.generatedRandomColors.includes(randomColor) === false) {
    game.generatedRandomColors.push(randomColor);
    console.log("Random Color created");
    return game.colors[randomColor];
  } else {
    return chooseRandomColor();
  }
}

function chooseRandomLocation() {
  let randomLocation = Math.floor(Math.random() * game.locations.length);
  if (game.generatedRandomLocations.includes(randomLocation) === false) {
    game.generatedRandomLocations.push(randomLocation);
    console.log("Random Location created");
    return game.locations[randomLocation];
  } else {
    console.log("callback");
    return chooseRandomLocation();
  }
}

//sets all cards to have the same color (back) when first loaded
function printCards() {
  for (let i = 0; i < game.locations.length; i++) {
    $("#" + game.locations[i]).attr("src", color.back);
  }
}

function compareCards() {
  game.counter++;
  if ($("#" + game.cardOne).attr("src") === $("#" + game.cardTwo).attr("src")) {
    removeCard(game.cardOne);
    removeCard(game.cardTwo);
    game.guessedCards.push(game.cardOne);
    game.guessedCards.push(game.cardTwo);
    gameOver();
  } else {
    revertCard(game.cardOne);
    revertCard(game.cardTwo);
  }
}

function revertCard(card) {
  $("#" + card).attr("src", color.back);
}

function removeCard(card) {
  $("#" + card).attr("src", color.transparent);
}

function revealCard() {
  for (let j = 0; j < game.content.length; j++) {
    if (game.content[j].location == game.clickedCard) {
      $("#" + game.clickedCard).attr("src", game.content[j].front);
    }
  }
  if (game.cardOne !== null && game.cardTwo !== null) {
    setTimeout(() => {
      compareCards();
      game.cardOne = null;
      game.cardTwo = null;
    }, 200);
  }
}

$("img").click(function(event) {
  game.clickedCard = event.target.id;
  if (!game.guessedCards.includes(game.clickedCard)) {
    if (game.cardOne === null) {
      game.cardOne = game.clickedCard;
      revealCard();
    } else {
      game.cardTwo = game.clickedCard;
      if (game.cardOne !== game.cardTwo) {
        revealCard();
      }
    }
  }
});

function gameOver() {
  if (game.guessedCards.length / 2 === game.colors.length) {
    if (innerWidth < 768 && innerWidth > 500) {
      // show penguin picture
      $(".col-lg-5 img").show();
    }
    $("#table").hide();
    $("#start button").attr("disabled", true);
    $("#start button")
      .html(
        "<b>Congratulations!</b><br />Number of moves: <b>" +
          game.counter +
          "</b>"
      )
      .removeClass("btn")
      .addClass("congrats");
    $("#start").show();
    setTimeout(() => {
      $("#start button")
        .html("Start!")
        .removeClass("congrats")
        .addClass("btn");
      $("#start button").attr("disabled", false);
    }, 5000);
  }
}

$(document).ready(function() {
  $("#start").click(function() {
    main();
    $("#instructions").hide();
    $("#start").hide();
    $("#table").show();
    if (innerWidth < 768) {
      $(".col-lg-5 img").hide();
    }
    game.started = true;
  });
});

//hides penguine picture if the screen is not big enough and shows once the screen width is over 768 px
$(window).resize(function() {
  if (innerWidth < 768 && game.started === true) {
    $(".col-lg-5 img").hide();
  } else {
    $(".col-lg-5 img").show();
  }
});

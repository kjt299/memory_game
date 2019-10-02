const game = {
  locations: ["a1","a2","a3","a4","b1","b2","b3","b4","c1","c2","c3","c4","d1","d2","d3","d4"],
  colors: {
    blue: "images/blue.jpg",
    red: "images/red.jpg",
    yellow: "images/yellow.jpg",
    green: "images/green.jpg",
    pink: "images/pink.jpg",
    orange: "images/orange.jpg",
    navy: "images/navy.jpg",
    black: "images/black.jpg",
  },
  default: {
    back: "images/back.jpg",
    transparent: "images/transparent.jpg"
  },
  generatedRandomLocations: [],
  generatedRandomColors: [],
  content: [],
  guessedCards: [],
  counter: 0,
  started: false,
  clickedCard: null,
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
  while (x < Object.keys(game.colors).length) {
    const chosenRandomColor = chooseRandomColor();
    let y = 0;
    while (y < 2) {
      const chosenRandomLocation = chooseRandomLocation();
      game.content.push(new Card(chosenRandomColor, chosenRandomLocation));
      y++;
    }
    x++;
  }
  return game.content;
}

function chooseRandomColor() {
  const colorsArray = Object.keys(game.colors);
  const randomColor = Math.floor(Math.random() * colorsArray.length);
  if (game.generatedRandomColors.includes(randomColor) === false) {
    game.generatedRandomColors.push(randomColor);
    return game.colors[colorsArray[randomColor]];
  } else {
    return chooseRandomColor();
  }
}

function chooseRandomLocation() {
  const randomLocation = Math.floor(Math.random() * game.locations.length);
  if (game.generatedRandomLocations.includes(randomLocation) === false) {
    game.generatedRandomLocations.push(randomLocation);
    return game.locations[randomLocation];
  } else {
    return chooseRandomLocation();
  }
}

//sets all cards to have the same color (back) when first loaded
function printCards() {
  for (let i = 0; i < game.locations.length; i++) {
    $("#" + game.locations[i]).attr("src", game.default.back);
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
  $("#" + card).attr("src", game.default.back);
}

function removeCard(card) {
  $("#" + card).attr("src", game.default.transparent);
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
  if (game.guessedCards.length / 2 === Object.keys(game.colors).length) {
    if (innerWidth < 768 && innerWidth > 500) {
      // show penguin picture
      $(".col-lg-5 img").show();
    }
    $("#table").hide();
    $("#start button")
      .attr("disabled", true)
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
        .addClass("btn")
        .attr("disabled", false);
    }, 5000);
  }
}


$(document).ready(function() {
  $("#start").click(function() {
    main();
    $("#instructions").hide();
    $("#start").hide();
    $("#table").show();
    if (innerWidth < 500) {
      $(".col-lg-5 img").hide();
    }
    game.started = true;
  });
});

//hides penguine picture if the screen is not big enough and shows once the screen width is over 768 px
$(window).resize(function() {
  if (innerWidth < 500 && game.started === true) {
    $(".col-lg-5 img").hide();
  } else {
    $(".col-lg-5 img").show();
  }
});

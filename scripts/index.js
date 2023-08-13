"use strict";

const computersCards = document.getElementById("house-cards");
const playerCards = document.getElementById("player-cards");
const btn = document.getElementById("btn");
const winText = document.querySelector(".won");

// const deck = [];
const computersHand = [];
const playersHand = [];
const cDraw = [];
const pDraw = [];

let computersCard;
let playersCard;
let aDraw = false;
let drawCount = 3;

class Deck {
  deck = [];

  BuildDeck() {
    const values = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    const types = ["C", "D", "H", "S"];

    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
        this.deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
      }
    }
  }
  ShuffleDeck() {
    for (let i = 0; i < this.deck.length; i++) {
      let j = Math.floor(Math.random() * this.deck.length);
      const temp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = temp;
    }
    console.log(this.deck); //TODO debugging
  }
}
class Players {
  draw = [];
  hand = [];
  card;
}
class Dealer {
  DealCards(dc) {
    for (let i = 0; i < dc.deck.length; i++) {
      if (i % 2 == 0) computersHand.push(dc.deck[i]);
      else {
        playersHand.push(dc.deck[i]);
      }
    }
    render.CardFaceDown();
    render.CardFaceUp();
  }
}
//TODO give option for how many decks of cards
class Render {
  CardFaceDown() {
    let cardImg = document.createElement("img");
    cardImg.src = "images/BACK.png";
    computersCards.append(cardImg);

    cardImg = document.createElement("img");
    cardImg.src = "images/BACK.png";
    playerCards.append(cardImg);
  }
  CardFaceUp() {
    let cardImg = document.createElement("img");
    computersCard = computersHand.pop();

    cardImg.src = "images/" + computersCard + ".png";
    computersCards.append(cardImg);
    ///--------------players cards-----------------------------

    cardImg = document.createElement("img");
    playersCard = playersHand.pop();

    cardImg.src = "images/" + playersCard + ".png";
    playerCards.append(cardImg);
  }
  ClearHand() {
    if (computersCards.parentNode)
      computersCards.removeChild(computersCards.lastElementChild);
    if (playerCards.parentNode)
      playerCards.removeChild(playerCards.lastElementChild);
  }
}

function evaluateCards(theCard) {
  const cHandIndex = theCard.indexOf("-");
  let t = theCard.slice(0, cHandIndex);
  console.log(t);
  if (t == "A") return (t = 14);
  else if (t == "K") return (t = 13);
  else if (t == "Q") return (t = 12);
  else if (t == "J") return (t = 11);
  return parseInt(t);
}

function comparePoints() {
  console.log(`Computer has ${computersHand.length} with ${computersHand}`);
  console.log(`Player has ${playersHand.length} with ${playersHand}`);

  let computer = evaluateCards(computersCard);
  let player = evaluateCards(playersCard);

  if (computer > player) {
    if (aDraw) {
      whenDraw(computersHand);
    }
    computersHand.unshift(playersCard);
    computersHand.unshift(computersCard);
    winText.textContent = "Computer wins this round";
    console.log("computer Wins");
  } else if (player > computer) {
    if (aDraw) {
      whenDraw(playersHand);
    }
    playersHand.unshift(computersCard);
    playersHand.unshift(playersCard);
    winText.textContent = "You won this round";
    console.log("You won!!!");
  } else {
    console.log("draw");
    if (aDraw) {
      drawCount *= 3;
    }
    aDraw = true;

    drawDeal();
  }
}

function whenDraw(winner) {
  for (let i = 0; i < drawCount; i++) {
    winner.unshift(cDraw[i]);
    winner.unshift(pDraw[i]);
  }
}

function drawDeal() {
  cDraw.push(computersCard);
  pDraw.push(playersCard);
  for (let i = 1; i < drawCount; i++) {
    cDraw[i] = computersHand.pop();
    pDraw[i] = playersHand.pop();
    render.CardFaceDown();
  }
  render.CardFaceUp();
  comparePoints();
}

function drawCleanup() {
  for (let i = 0; i <= drawCount; i++) {
    clearHand();
  }
  aDraw = false;
  cDraw.length = 0;
  pDraw.length = 0;
  drawCount = 3;
}
const deckOfCards = new Deck();
const dealer = new Dealer();
const render = new Render();
const computer = new Players();
const player = new Players();

deckOfCards.BuildDeck();
deckOfCards.ShuffleDeck();
dealer.DealCards(deckOfCards);
comparePoints();

btn.addEventListener("click", () => {
  if (aDraw) {
    drawCleanup();
  } else {
    render.ClearHand();
  }
  render.CardFaceUp();
  comparePoints();
});

//TODO and bugs
//I need a way to check when someone wins
//also a strategy for when a player can't fulfill a draw war. as in they don't have the required amount of cards
//should I make them lose or adjust the cards to fit the lower card users needs
//maybe a little better user interface work as well
//maybe clean up some of the globals and pass them through the functions as needed

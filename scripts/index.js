"use strict";

const computersCards = document.getElementById("house-cards");
const playerCards = document.getElementById("player-cards");
const btn = document.getElementById("btn");
const winText = document.querySelector(".won");

class GameManager {
  draw = false;

  StartGame() {
    deckOfCards.BuildDeck();
    deckOfCards.ShuffleDeck();
    dealer.DealCards(deckOfCards);
    manager.CompareCards();
  }
  NextPlay() {
    dealer.DealCards(deckOfCards);
    manager.CompareCards();
  }
  War() {}
  //evaluateCards gives the cards a number score since face cards mean nothing.
  //it gives face cards a number to be evaluated which face card is higher if there is one
  //it then returns the card as a number to then check which is hight or a draw
  EvaluateCards(theCard) {
    const cHandIndex = theCard.indexOf("-");
    let t = theCard.slice(0, cHandIndex);
    console.log(t);
    if (t == "A") return 14;
    else if (t == "K") return 13;
    else if (t == "Q") return 12;
    else if (t == "J") return 11;
    return +t;
  }

  CompareCards() {
    console.log(`Computer has ${computer.hand.length} with ${computer.hand}`); //TODO debugging
    console.log(`Player has ${player.hand.length} with ${player.hand}`);

    let computerScore = this.EvaluateCards(computer.card);
    let playerScore = this.EvaluateCards(player.card);

    //the draw check is if there was a prior draw it needs to know //TODO why?
    if (computerScore > playerScore) {
      if (this.draw) {
        this.WhenDraw(computer.hand);
      }
      computer.hand.unshift(player.card);
      computer.hand.unshift(computer.card);
      winText.textContent = "Computer wins this round";
      console.log("computer Wins"); //TODO debugging
    } else if (playerScore > computerScore) {
      if (this.draw) {
        this.WhenDraw(player.hand);
      }
      player.hand.unshift(computer.card);
      player.hand.unshift(player.card);
      winText.textContent = "You won this round";
      console.log("You won!!!"); //TODO debugging
    } else {
      console.log("draw"); //TODO debugging
      this.draw = true;
      this.DrawDeal();
    }
  }

  WhenDraw(winner) {
    winner.unshift(...computer.draw);
    winner.unshift(...player.draw);

    player.draw.length = 0;
    computer.draw.length = 0;
  }

  DrawDeal() {
    computer.draw.push(computer.card);
    player.draw.push(player.card);
    for (let i = 1; i < dealer.drawCount; i++) {
      computer.draw.push(computer.hand.pop());
      player.draw.push(player.hand.pop());
      render.CardFaceDown();
    }
    render.CardFaceUp();
    this.CompareCards();
  }
}
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
  drawCount = 3;

  DealCards(dc) {
    for (let i = 0; i < dc.deck.length; i++) {
      if (i % 2 == 0) computer.hand.push(dc.deck[i]);
      else {
        player.hand.push(dc.deck[i]);
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
    computer.card = computer.hand.pop();

    cardImg.src = "images/" + computer.card + ".png";
    computersCards.append(cardImg);
    ///--------------players cards-----------------------------

    cardImg = document.createElement("img");
    player.card = player.hand.pop();

    cardImg.src = "images/" + player.card + ".png";
    playerCards.append(cardImg);
  }
  ClearHand() {
    // if (computersCards.parentNode)
    //   //BUG I need a way to clean up when there was a draw this only cleans one spot
    //   computersCards.removeChild(computersCards.lastElementChild);
    while (computersCards.firstChild) {
      computersCards.removeChild(computersCards.firstChild);
    }
    if (playerCards.parentNode)
      playerCards.removeChild(playerCards.lastElementChild);
  }
}

function drawCleanup() {
  for (let i = 0; i <= dealer.drawCount; i++) {
    render.ClearHand();
  }
  aDraw = false;
  cDraw.length = 0;
  pDraw.length = 0;
  dealer.drawCount = 3;
}
const manager = new GameManager();
const deckOfCards = new Deck();
const dealer = new Dealer();
const render = new Render();
const computer = new Players();
const player = new Players();

manager.StartGame();

btn.addEventListener("click", () => {
  render.ClearHand();
  render.CardFaceUp();
  manager.CompareCards();
});

//TODO and bugs
//I need a way to check when someone wins
//also a strategy for when a player can't fulfill a draw war. as in they don't have the required amount of cards
//should I make them lose or adjust the cards to fit the lower card users needs
//maybe a little better user interface work as well

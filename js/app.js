"use strict";

/*
 * Create a list that holds all of your cards
 */
let cardArray = [
  'diamond',
  'paper-plane-o',
  'anchor',
  'bolt',
  'cube',
  'leaf',
  'bicycle',
  'bomb',
];

// shuffle the cards
cardArray = shuffle(cardArray);

let moveCounter = 0;
let openCards = [];
let matchedCardsNumber = 0;
let averageMoveNumber = 16;
let time = 0;
let timer;
let timeRunning = false;
let deletedStars = 0;
const stars =  document.querySelector('.stars');
const totalTime = document.querySelector('.time');
const moves = document.querySelector('.moves');
const restartButton = document.querySelector('.restart-button');
const restartIcon = document.querySelector('.restart');
const gameOverModal = document.querySelector('.game-over');

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {

  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
}

// Creates the deck of cards and fills it with cards
function createDeck() {

  let deckHTML = document.createElement('ul');
  let container = document.querySelector('.container');
  deckHTML.classList.add('deck');

  for (const card of cardArray) {
    let cardHTML = `<li class="card closed">
      <i class="fa fa-${card}"></i>
    </li>`;
    // There are 2 cards per card type
    deckHTML.insertAdjacentHTML('afterbegin', cardHTML);
    deckHTML.insertAdjacentHTML('afterbegin', cardHTML);
  }

  // Once the deck is full attach it to the container
  container.appendChild(deckHTML);

  // Shuffle the cards
  shuffleDeck();
}

// Shuffles the deck
function shuffleDeck() {

  // Get the cards from the deck
  let cards = document.querySelectorAll('.card');

  // Shuffle the cards by random permutation of their class
  cards = shuffle(Array.from(cards));
  for (const [i, card] of cards.entries()) {
    card.firstElementChild.className = "";
    const newCardClass = cardArray[Math.floor(i/2)];
    card.firstElementChild.classList.add("fa",`fa-${newCardClass}`);
  }
}

// Hides ending modal
function hideModal() {

  gameOverModal.style.display = 'none';
}

// Shows ending modal
function showModal() {

  gameOverModal.style.display = 'block';
}

// Starts counting in seconds and shows it on the score panel
function startTimer() {

  if(!timeRunning) {
    timeRunning = true;
    timer = setInterval(function() {
      time++;
      totalTime.textContent = time;
    }, 1000);
  }
}

// Stops the timer and zeroes the time that has passed
function stopTimer() {

  timeRunning = false;
  clearInterval(timer);
  time = 0;
  totalTime.textContent = time;
}

// Resets the timer
function resetTimer() {

  stopTimer();
  startTimer();
}

// Shows the card and adds it to the open cards array
function showCard(card, openCards) {

  card.classList.add('show', 'open');
  openCards.push(card);
}

// Hides the open cards and empties the openCards array
function hideOpenCards() {

  for (const openCard of openCards) {
    openCard.classList.remove('show', 'open');
  }
  openCards.length = 0;
}

// Hides all the cards on the deck
function hideAllCards() {

  const allCards = document.querySelectorAll('.card');
  for (const card of allCards) {
    card.classList.remove('show','open','match');
  }
  openCards.length = 0;
  matchedCardsNumber = 0;
}

// Compares the two cards that shave been opened and are in the openCards array
function compareCards() {
  // if they match show them as matched ( add class match ) and empty the openCards array
  if (openCards[0].isEqualNode(openCards[1])) {
    openCards[0].classList.add('match');
    openCards[1].classList.add('match');
    matchedCardsNumber = matchedCardsNumber + 2;
    openCards.length = 0;

    // if all the cards are matched then finish game
    if (matchedCardsNumber == cardArray.length * 2)  {
        endGame();
    }
  } else {
    // if the cards are not a match hide them in 1 sec
    setTimeout(hideOpenCards, 1000);
  }
}

// increases the moves counter and shows it on the screen
function increaseMoveCounter() {

  let moves = document.querySelector('.moves');
  moveCounter++;
  moves.innerHTML = moveCounter;
  if(moveCounter > averageMoveNumber) {
     decreaseStars();
     averageMoveNumber += cardArray.length;
  }
}

// removes the stars -if there are still any- every 16 moves the player does
function decreaseStars() {

  const firstStar = stars.firstElementChild;
  if(stars.childElementCount > 1) {
    stars.removeChild(firstStar);
    deletedStars++;
  }
}

// resets stars
function resetStars() {

  const starHTML = `<li><i class="fa fa-star"></i></li>`;
  for (let i = 0; i < deletedStars; i++) {
    stars.insertAdjacentHTML('afterbegin', starHTML);
  }
  deletedStars = 0;
}

// resets  the move counter
function resetMoves() {

  moveCounter = 0;
  moves.innerHTML = moveCounter;
  averageMoveNumber = 16;
}

// resets the game: hides all the cards, shuffles them, resets the moves counter, time and cards
function resetGame() {

  hideAllCards();
  resetMoves();
  stopTimer();
  resetStars();
  hideModal();
  setTimeout(shuffleDeck, 500);
}

// starts the game by adding an EventListener on the deck
function startGame() {

  const deck = document.querySelector('.deck');
  deck.addEventListener('click', function(event) {
    // get the target (card) that the player clicked on
    const card = event.target;
    // procceed if they only clicked on a card
    if (card.nodeName === 'LI') {
      //start the timer
      startTimer();
      // if the card is not already open and showing and the open cards are less than 2
      if(!card.classList.contains('show') && !card.classList.contains('open') && openCards.length < 2) {
        // show the card and add it to the openCards array
        showCard(card, openCards);
        // increase moves
        increaseMoveCounter();
        // when the player selects two cards compare them
        if(openCards.length == 2) {
          compareCards(openCards);
        }
      }
    }
  });
}

// Ends the game by displaying a modal with the total moves and time
function endGame() {

  const totalMoves = document.querySelector('.total-moves');
  const gameDuration = document.querySelector('.total-time');
  const finalStars =  document.querySelector('.final-stars');
  const starHTML = `<i class="fa fa-star"></i>`;

  console.log(finalStars);
  gameDuration.textContent = time;
  totalMoves.textContent = moveCounter;
  for (let i = 0; i < 4 - deletedStars; i++) {
    finalStars.insertAdjacentHTML('afterbegin', starHTML);
  }

  stopTimer();
  showModal();
}

// adds eventListeners on the reset buttons
restartButton.addEventListener('click', resetGame);
restartIcon.addEventListener('click', resetGame);

createDeck();
startGame();

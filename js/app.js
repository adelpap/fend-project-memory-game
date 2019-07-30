/*
 * Create a list that holds all of your cards
 */
let cardArray = [
  'diamond', 'diamond',
  'paper-plane-o', 'paper-plane-o',
  'anchor', 'anchor',
  'bolt', 'bolt',
  'cube', 'cube',
  'leaf', 'leaf',
  'bicycle', 'bicycle',
  'bomb', 'bomb'
];

// shuffle the cards
cardArray = shuffle(cardArray);

let moveCounter = 0;
let openCards = [];
let matchedCardsNumber = 0;
let averageMoveNumber = 32;
let time = 0;
let timer;
let deletedStars = [];
const stars =  document.querySelector('.stars');
const totalTime = document.querySelector('.time');
const moves = document.querySelector('.moves');
const restartButton = document.querySelector('.restart');

// Creates the deck of cards and fills it with cards
function createDeck() {

  let deckHTML = document.createElement('ul');
  let container = document.querySelector('.container');
  deckHTML.classList.add('deck');

  for (const card of cardArray) {
    let cardHTML = `<li class="card closed">
      <i class="fa fa-${card}"></i>
    </li>`;
    deckHTML.insertAdjacentHTML('afterbegin', cardHTML);
  }

  // Once the deck is full attach it to the container
  container.appendChild(deckHTML);
}

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

// Ends the game by displaying a modal with the total moves and time
function endGame() {
  
  const gameOverModal = document.querySelector('.game-over');
  const totalMoves = document.querySelector('.total-moves');
  const gameDuration = document.querySelector('.total-time');
  
  gameDuration.textContent = time;
  totalMoves.textContent = moveCounter;
  gameOverModal.style.display = 'block';
  stopTimer();
}

// Starts counting in seconds and shows it on the score panel
function startTimer() {
  
  timer = setInterval(function() {
    time++;
    totalTime.textContent = time;
  }, 1000);
}

// Stops the timer and zeroes the time that has passed
function stopTimer() {
  
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

// Compares the two cards that have been opened and are in the openCards array
function compareCards() {
  // if they match show them as matched ( add class match ) and empty the openCards array
  if (openCards[0].isEqualNode(openCards[1])) {
    openCards[0].classList.add('match');
    openCards[1].classList.add('match');
    matchedCardsNumber = matchedCardsNumber + 2;
    openCards.length = 0;

    // if all the cards are matched then finish game
    if (matchedCardsNumber == cardArray.length)  {
        endGame();
    }
  } else {
    // if the cards are not a match hide them in 0.5sec
    setTimeout(function() {
       hideOpenCards();
    }, 1000);
  }
}

// increases the moves counter and shows it on the screen
function increaseMoveCounter() {
  
  let moves = document.querySelector('.moves');
  moveCounter++;
  moves.innerHTML = moveCounter;
  decreaseStars();
}

// removes the stars -if there are still any- every 32 moves the player does
function decreaseStars() {  
  
  const firstStar = stars.firstElementChild;
  if(firstStar !=  null && moveCounter > averageMoveNumber) {
    stars.removeChild(firstStar);
    deletedStars.push(firstStar);
    averageMoveNumber += cardArray.length * 2;
  }
}

// resets stars
function resetStars() {
  
  const starHTML = `<li><i class="fa fa-star"></i></li>`;
  if(deletedStars.length > 0) {
    for(const star of deletedStars) {
        stars.insertAdjacentHTML('afterbegin', starHTML);
    }
  }
}

// resets  the move counter
function resetMoves() {
  
  moveCounter = 0;
  moves.innerHTML = moveCounter;
}

// if the game is not over then reset it : hides all the cards,resets the moves counter, time and cards 
function resetGame() {
  
  restartButton.addEventListener('click', function(){
    // check if the game is over by checking hte matched cards number
    if (matchedCardsNumber != cardArray.length) {
      hideAllCards();
      resetMoves();
      resetTimer();
      resetStars();
    }
  });
}

// starts the game by adding an EventListener on the deck and starting the timer
function startGame() {
  
  startTimer();
  const deck = document.querySelector('.deck');
  deck.addEventListener('click', function(event) {
    // get the target (card) that the player clicked on
    const card = event.target;
    // procceed if they only clicked on a card 
    if (card.nodeName === 'LI') {
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

createDeck();
startGame();
resetGame();

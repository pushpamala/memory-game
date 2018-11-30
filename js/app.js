/*
 * Create a list that holds all of your cards
 */
let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 
                'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-paper-plane-o', 
                'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle'];

let matchCount = 0;
let moveCount = 0;
let stars = document.querySelectorAll('.stars .fa');

/* timer functionality */
var timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {
    document.querySelector('#game-timer').textContent = timer.getTimeValues().toString();
});

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
const deckEl = document.querySelector('.deck');
let previousEl = null;
deckEl.addEventListener('click', function(e){
    const targetEl = e.target;
    if (targetEl.classList.contains('card')) {
        showCard(targetEl);
    } else if (targetEl.classList.contains('fa')) {
        showCard(targetEl.parentElement);
    }   
});

/* display the card's symbol */

function showCard(el) {
    if (!timer.isRunning()) {
        timer.start();
    }
    el.classList.add('open', 'show');
    if (previousEl == null) {
        previousEl = el;
    } else {
        const imageEl = getImageEl(el);
        const previousImageEl = getImageEl(previousEl);
        if (imageEl.className == previousImageEl.className && imageEl != previousImageEl) {
            matchCard(el);
            matchCard(previousEl); 
            matchCount += 1;
        } else {
            errorCard(el);
            errorCard(previousEl);
        }
        
        if (el != previousEl) {
            moveCount += 1;
        }
        previousEl = null;
        document.querySelector('.moves').textContent = moveCount.toString();
        document.querySelector('#move-count').textContent = moveCount.toString();
        if (moveCount > 15) {
            stars[1].classList.add('fa-star-o');
            stars[1].classList.remove('fa-star');           
        } else if (moveCount > 10) {
            stars[2].classList.add('fa-star-o');
            stars[2].classList.remove('fa-star');
        } 
        if (matchCount == 8) {
            document.querySelector('#winModal').classList.remove('hidden');
            document.querySelector('#game').classList.add('hidden');
            document.querySelector('#star-rating').textContent = document.querySelectorAll('.stars .fa-star').length;
            document.querySelector('#total-time').textContent = document.querySelector('#game-timer').textContent;
            timer.stop();
        }
    }
}

/* hides the card's symbol */

function hideCard(el) {
    el.classList.remove('open', 'show', 'error');
}

/* Incorrect guess. The cards turns red color showing the symbol for seconds  */
function errorCard(el) {
    el.classList.add('error');
    setTimeout(function() {
      hideCard(el);
    }, 100)
}      

/* Correct guess. If the two cards match, they stay turned over  */
function matchCard(el) {
    el.classList.add('match');
}

function getImageEl(el) {
    return el.querySelector('.fa');
}

/* This should allow the player to reset the entire grid */
function restart() {
    previousEl = null;
    matchCount = 0;
    moveCount = 0;
    timer.stop();
    document.querySelector('#game-timer').textContent = '';
    document.querySelector('#winModal').classList.add('hidden');
    document.querySelector('#game').classList.remove('hidden');
    document.querySelector('.moves').textContent = moveCount.toString();
    stars[1].classList.remove('fa-star-o');
    stars[1].classList.add('fa-star'); 
    stars[2].classList.remove('fa-star-o');
    stars[2].classList.add('fa-star'); 

    const shuffledCards = shuffle(cards);
    const cardEls = document.querySelectorAll('.deck .card');
    for (let i = 0; i < cardEls.length; i++) {
        cardEls[i].className = 'card';
        getImageEl(cardEls[i]).className = 'fa ' + shuffledCards[i];
    }
}

const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', restart);
restart();


const playAgainBtn = document.querySelector('.btn');
playAgainBtn.addEventListener('click', restart);

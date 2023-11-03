/* Hong Bo Li #2298279
Xiaoxing Pan #2339295
Dustin Ruck #0234348 */


// problems to fix
// Ace 1 or 11 logic not always working
// Dealer's hidden card unicode suits are still showing when they should be hidden



// js for the blackjack.html file
class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
    }
}

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let playerBalance = 100;
let betAmount = 0;
let indexDealer = 1;
let indexPlayer = 1;
let newCardValue;

// pops up a age verification when loading the page
document.getElementById('verifyButton').addEventListener('click', function () {
    // Hide the modal and show the main content when the button is clicked
    document.getElementById('ageVerificationModal').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
});

// functions
/**
 * Creates a new deck of cards by combining card numbers and suits
 * {Array} The deck of cards
 */
function createDeck() {
    let cardNums = ["A", "K", "Q", "J", "10", "9", "8", "7",
        "6", "5", "4", "3", "2"];
    let suits = ["♥︎", "♦︎", "♠︎", "♣︎"];
    for (let i = 0; i < cardNums.length; i++) {
        for (let j = 0; j < suits.length; j++) {
            let card = new Card(cardNums[i], suits[j]);

            deck.push(card);
        }
    }
    return deck;
}

/**
 * Shuffles the deck of cards randomly
 * @returns {Array} The shuffled deck of cards
 */
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let randomCard = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[randomCard];
        deck[randomCard] = temp;
    }
    return deck;
}

/**
 * Deals a card from the deck to the specified hand and displays it on the UI
 * @param {Array} hand - The hand to which the card is dealt
 * @param {string} containerId - The ID of the container element where the card will be displayed
 * @returns {Object} The dealt card
 */
function dealCard(hand, containerId) {
    let card = deck.pop();
    hand.push(card);
    displayCard(card, containerId);
    return card;
}

/**
 * Displays a card on the UI
 * @param {Object} card - The card object to be displayed
 * @param {string} containerId - The ID of the container element where the card will be appended
 */
function displayCard(card, containerId) {
    let cardElement = `<div class="card ${card.suit == "♠︎" || card.suit == "♣︎" ? "black" : "red"}">
        <span class="top-left">${card.value}<br>${card.suit}</span>
        <span class="bottom-right">${card.value}<br>${card.suit}</span>
    </div>`;
    $(`#${containerId}`).append(cardElement);
}

/**
 * Retrieves the numerical value of a card
 * @param {string} card - The rank of the card (e.g., "A", "K", "Q", "J", "10", "9", etc.)
 * @returns {number} - The numerical value of the card
 */
function getCardValue(card) {
    let cardValue = 0;
    if (card == "A") {
        cardValue = 1;
    } else if (card == "K" || card == "Q" || card == "J") {
        cardValue = 10;
    } else {
        cardValue = parseInt(card);
    }
    return cardValue;
}

/**
 * Calculates the total value of two cards
 * @param {(string|number)} card1 - The rank of the first card or the total value of the cards on the hand
 * @param {string} card2 - The rank of the second card
 * @returns {number} - The total value of the two cards
 */
function getTotal(card1, card2) {
    let sumCards = 0;
    let card1Value;
    let card2Value = getCardValue(card2);
    if (isNaN(card1)) {
        card1Value = getCardValue(card1);
        if (card1Value === 1 && card2Value !== 1) {
            sumCards = 11 + card2Value;
        }
        else if (card1Value !== 1 && card2Value === 1) {
            sumCards = 11 + card1Value;
        }
        else if (card1Value !== 1 && card2Value !== 1) {
            sumCards = card1Value + card2Value;
        }
        else {
            sumCards = 21;
        }
    } else {
        card1Value = parseInt(card1);
        if (card2Value === 1) {
            if (card1Value <= 10) {
                sumCards = 11 + card1Value;
            } else {
                sumCards = 1 + card1Value;
            }
        } else {
            sumCards = card1Value + card2Value;
        }
    }
    return sumCards;
}

/**
 * output the message correspond the results
 * @param {number} - different situation number
 */
function resultAlert(situation) {
    switch (situation) {
        case 1:
            $('#mesBox').html("DRAW! You and dealer both have Blackjack!<br>Choose your bet and click 'New Game' to Begin.");
            $('#playerCard').append("<br>BLACKJACk!");
            $('#dealerCard').append("<br>BLACKJACk!");
            break;
        case 2:
            $('#mesBox').html("Congratulations! You win!<br>You have Blackjack!<br>Choose your bet and click 'New Game' to Begin.");
            $('#playerCard').append("<br>BLACKJACk!");
            $('#dealerCard').append("<br>LOST!");
            break;
        case 3:
            $('#mesBox').html("Sorry! You lose. Dealer have Blackjack!<br>Choose your bet and click 'New Game' to Begin.");
            $('#playerCard').append("<br>LOST!");
            $('#dealerCard').append("<br>BLACKJACk!");
            break;
        case 4:
            $('#mesBox').html("Congratulations! You win!<br>DEALER WENT OVER 21!!<br>Choose your bet and click 'New Game' to Begin.");
            $('#playerCard').append("<br>WON!");
            $('#dealerCard').append("<br>BUST!");
            break;
        case 5:
            $('#mesBox').html("Sorry! You lose. You have " + playerScore + ". Dealer has " + dealerScore + ".<br>Choose your bet and click 'New Game' to Begin.");
            $('#playerCard').append("<br>LOST!");
            $('#dealerCard').append("<br>WON!");
            break;
        case 6:
            $('#mesBox').html("DRAW! You and dealer both have " + playerScore + ".<br>Choose your bet and click 'New Game' to Begin.");
            $('#playerCard').append("<br>DRAW!");
            $('#dealerCard').append("<br>DRAW!");
            break;
        case 7:
            $('#mesBox').html("DRAW! You and dealer both WENT OVER 21!<br>Choose your bet and click 'New Game' to Begin.");
            $('#playerCard').append("<br>BUST!");
            $('#dealerCard').append("<br>BUST!");
            break;
        case 8:
            $('#mesBox').html("Sorry! You lose. YOU WENT OVER 21!!<br>Choose your bet and click 'New Game' to Begin.");
            $('#playerCard').append("<br>BUST!");
            $('#dealerCard').append("<br>WON!");
            break;
        case 9:
            $('#mesBox').html("Congratulations! You win! <br> You have " + playerScore + ". Dealer has " + dealerScore + ".<br>Choose your bet and click 'New Game' to Begin.")
            $('#playerCard').append("<br>WON!");
            $('#dealerCard').append("<br>LOST!");
            break;
        default:
            break;
    }
}

/**
 * Compares the scores of the player and the dealer and determines the outcome
 * Updates the bet amount and player balance accordingly
 * Resets the game after displaying the result
 */
function compare(playerScore, dealerScore) {
    if (playerScore == 21) {
        if (dealerScore == 21) {
            resultAlert(1);
            resetGame();
        }
        else {
            resultAlert(2);
            playerBalance += betAmount;
            resetGame();
        }
    } else if (playerScore < 21) {
        if (dealerScore == 21) {
            resultAlert(3);
            playerBalance -= betAmount;
            resetGame();
        }
        else if (dealerScore > 21) {
            resultAlert(4);
            playerBalance += betAmount;
            resetGame();
        }
        else {
            if (playerScore < dealerScore) {
                resultAlert(5);
                playerBalance -= betAmount;
                resetGame();
            }
            else if (playerScore === dealerScore) {
                resultAlert(6);
                resetGame();
            }
            else {
                resultAlert(9);
                playerBalance += betAmount;
                resetGame();
            }
        }
    } else {
        if (dealerScore > 21) {
            resultAlert(7);
            resetGame();
        } else {
            resultAlert(8);
            playerBalance -= betAmount;
            resetGame();
        }
    }
    $("#dealerCard .card").first().removeClass("hidden");
    $('#balance').text(playerBalance);
    resetGame();
}

/**
    * Retrieves the value of a new card from the player's hand and increments the indexPlayer variable
    */
function getNewCardValue() {
    newCardValue = getCardValue(playerHand[(indexPlayer + 1)].value);
    indexPlayer++;
}

/**
     * Controls the dealer's turn in the game
     * Deals cards to the dealer until their score is less than or equal to 16 or the maximum number of cards has been reached
     * Compares the player's and dealer's scores to determine the outcome
     * Updates the player balance and displays it
     */
function dealersTurn() {
    while (dealerScore <= 16 && indexDealer < 4) {
        dealCardToDealer(indexDealer);
        indexDealer++;
    }

    if (dealerScore > 21) {
        resultAlert(4);
        playerBalance += betAmount;
        resetGame();
    } else {
        compare(playerScore, dealerScore);
    }
    $('#balance').text(playerBalance);
}

/**
 * Deals a card to the dealer's hand.
 * Calculates the value of the new card.
 * Updates the dealer's score and the player's balance.
 */
function dealCardToDealer(indexDealer) {
    dealCard(dealerHand, "dealerCard");

    let newCardValue = getCardValue(dealerHand[(indexDealer + 1)].value);
    // alert(newCardValue);
    if (newCardValue === 1) {
        if (dealerScore < 10) {
            newCardValue = 11;
        } else if (dealerScore === 10) {
            resultAlert(3);
            playerBalance -= betAmount;
        } else {
            newCardValue = 1;
        }
    }
    dealerScore += newCardValue;
    $('#balance').text(playerBalance);
}

/**
 * resetgame when one round is finished
 */
function resetGame() {
    $("#newGameButton").prop("disabled", false);
    $("#hitButton").prop("disabled", true);
    $("#standButton").prop("disabled", true);
    //$('#bet').prop('disabled', false);
    $('#bet').val("10");
}

/**
 * gameover after run out of the balance or cash out
 */
function endGame() {
    $("#newGameButton").prop("disabled", false);
    $("#hitButton").prop("disabled", true);
    $("#standButton").prop("disabled", true);
    $("#cashOutButton").prop("disabled", true);
    playerBalance = 0;
    $('#balance').text(playerBalance);
    $('#mesBox').html("No money left!!!See you next time.");
    $('#bet').val("10");
    $("#dealerCard").empty();
    $("#playerCard").empty();
    setTimeout(function () {
        location.reload();
    }, 3000);
}


$(document).ready(function () {

    // click rules button to display and hide the rules
    let rulesText = document.getElementById("rulesText");
    document.getElementById("showRulesButton").addEventListener("click", function () {
        if (rulesText.style.display === "block") {
            rulesText.style.display = "none";
        } else {
            rulesText.style.display = "block";
        }
    });

    // event listener for bet input change
    document.getElementById("bet").addEventListener("input", function () {
        betAmount = parseInt(document.getElementById("bet").value);
        playerBalance = parseInt($('#balance').text());
        if (betAmount > playerBalance) {
            alert("You don't have enough money, please change your bet!");
            $('#bet').val("10");
        } else if (betAmount <= 0) {
            alert("Input invalid, please change your bet!");
        }
    });

    // newGameButton clicked to start the game
    $('#newGameButton').on('click', function () {
        // Clean up the table
        $("#dealerCard").empty();
        $("#playerCard").empty();

        // Prepare for a new game:
        $("#newGameButton").prop("disabled", true); // active the hit stand and cashout button
        $("#hitButton").prop("disabled", false);
        $("#standButton").prop("disabled", false);
        $("#cashOutButton").prop("disabled", false);
        $('#cashOutTexts').css('display', 'none');
        createDeck(); // create and shuffle the deck
        shuffleDeck();
        dealerHand = []; // clear the cards in hand
        playerHand = [];
        indexDealer = 1;
        indexPlayer = 1;
        $('#mesBox').html("Welcome to Blackjack!<br>Choose your bet and click 'New Game' to Begin."); // reset the message box
        $('#balance').text(playerBalance); // update the balance
        betAmount = parseInt(document.getElementById("bet").value);
        //$('#bet').prop('disabled', true); // disable the bet input

        // Deal the first two cards
        dealCard(dealerHand, "dealerCard");
        dealCard(playerHand, "playerCard");

        // Hide dealer's card
        $("#dealerCard .card").first().addClass("hidden");

        // Deal the second two cards
        dealCard(dealerHand, "dealerCard");
        dealCard(playerHand, "playerCard");

        // update the score
        dealerScore = getTotal(dealerHand[0].value, dealerHand[1].value);
        playerScore = getTotal(playerHand[0].value, playerHand[1].value);

        // compare the first 2 cards value, let the player to choose if no one is 21 or bust
        if (dealerScore < 21 && playerScore < 21) {
            // ask the player to choose
            $('#mesBox').html("You have " + playerScore + ". Hit or Stand?");
        } else {
            compare(playerScore, dealerScore);
            resetGame();
        }

        // limit the player that can only have 5 cards
        if (indexPlayer == 4) {
            compare(playerScore, dealerScore);
            resetGame();
        }

        // warning and endgame when playerBalance is 0
        if (playerBalance <= 0) {
            alert("You've run out of money!!! Game reloaded soon.");
            endGame();
        }

    });


    // event listener for hitButton
    $("#hitButton").click(function () {
        dealCard(playerHand, "playerCard");
        getNewCardValue();
        playerScore = getTotal(playerScore, newCardValue);
        if (playerScore >= 21) {
            compare(playerScore, dealerScore);
            $('#balance').text(playerBalance);
        } else {
            $('#mesBox').html("You have " + playerScore + ". Hit or Stand?");
        }
        $('#balance').text(playerBalance);
    });

    // event listener for standButton
    $("#standButton").click(function () {
        $("#hitButton").prop("disabled", true);
        $("#standButton").prop("disabled", true);
        $("#dealerCard .card").first().removeClass("hidden");
        dealersTurn();

    })

    // event listener for cashoutButton
    $('#cashOutButton').on('click', function () {
        $('#cashOutTexts').text("You have cashed out $" + playerBalance + ". Game reloaded soon.");
        $('#cashOutTexts').css('display', 'block');
        endGame();
    });


});

// problems
// Ace 1 or 11 logic not always working
// Dealer's hidden card unicode suits are still showing when they should be hidden



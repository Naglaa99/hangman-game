const keyboard = document.querySelector(".keyboard");
const wordDisplay = document.querySelector(".word-display");
const guessText = document.querySelector(".guesses-text b");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainButton = document.querySelector(".play-again");

let currentWord,
  correctLetters = [],
  wrongGuessCount;
const maxGuesses = 6;

// Resets the game state (correct letters, wrong guesses, hangman image, word display, and modal)
const resetGame = () => {
  correctLetters = [];
  wrongGuessCount = 0;

  hangmanImage.src = `./images/hangman-${wrongGuessCount}.svg`;
  guessText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  keyboard.querySelectorAll("button").forEach((btn) => (btn.disabled = false));

  wordDisplay.innerHTML = currentWord
    .split("")
    .map(() => `<li class="letter"></li>`)
    .join("");

  gameModal.classList.remove("show");
};

// Selects a random word and its hint, then resets the game to start with the new word
const getRandomWord = () => {
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];

  currentWord = word;

  document.querySelector(".text-hint span").innerText = hint;
  resetGame();

  wordDisplay.innerHTML = word
    .split("")
    .map(() => `<li class="letter"></li>`)
    .join("");
};

// Handles the end of the game (either win or lose)
const gameOver = (isVictory) => {
  setTimeout(() => {
    const modalText = isVictory
      ? `You found the word:`
      : `The correct word was:`;

    gameModal.querySelector("img").src = `./images/${
      isVictory ? `victory` : `lost`
    }.gif`;

    gameModal.querySelector("h4").innerText = `${
      isVictory ? "Congrats!" : "Game Over!"
    }`;

    gameModal.querySelector(
      "p"
    ).innerHTML = `${modalText} <b>${currentWord}</b>`;

    gameModal.classList.add("show");
  }, 300);
};

// Handles the letter button click event: checks if the letter is in the word
const initGame = (button, clickedLetter) => {
  if (currentWord.includes(clickedLetter)) {
    [...currentWord].forEach((letter, index) => {
      if (letter == clickedLetter) {
        correctLetters.push(letter);

        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
      }
    });
  } else {
    wrongGuessCount++;

    hangmanImage.src = `./images/hangman-${wrongGuessCount}.svg`;
  }

  button.disabled = true;

  guessText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  if (wrongGuessCount === maxGuesses) return gameOver(false);

  if (correctLetters.length === currentWord.length) return gameOver(true);
};

// Generates buttons for letters a to z, attaches click event to each
for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");

  button.innerText = String.fromCharCode(i);

  keyboard.appendChild(button);

  button.addEventListener("click", (e) =>
    initGame(e.target, String.fromCharCode(i))
  );
}

getRandomWord();

playAgainButton.addEventListener("click", getRandomWord);

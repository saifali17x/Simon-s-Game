const buttonColours = ["red", "blue", "green", "yellow"];

let gamePattern = [];
let userClickedPattern = [];

let started = false;
let level = 0;
let responseTimeout;

// Start the game on key press
document.addEventListener("keydown", function () {
  if (!started) {
    document.getElementById("level-title").textContent = "Level " + level;
    nextSequence();
    started = true;
  }
});

// Handle user button click
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function () {
    clearTimeout(responseTimeout); // User clicked, cancel timeout

    const userChosenColour = this.id;
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
  });
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    document.body.classList.add("game-over");
    document.getElementById("level-title").textContent =
      "Wrong! Press Any Key to Restart";

    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);

    startOver();
  }
}

function nextSequence() {
  clearTimeout(responseTimeout); // Clear any previous timeouts

  userClickedPattern = [];
  level++;
  document.getElementById("level-title").textContent = "Level " + level;

  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  flashButton(randomChosenColour);
  playSound(randomChosenColour);

  // Set timeout to force user to respond
  responseTimeout = setTimeout(tookTooLong, 10000); // 10 seconds
}

function animatePress(currentColor) {
  const button = document.getElementById(currentColor);
  button.classList.add("pressed");
  setTimeout(() => {
    button.classList.remove("pressed");
  }, 100);
}

function flashButton(color) {
  const button = document.getElementById(color);
  button.style.opacity = "0.3";
  setTimeout(() => {
    button.style.opacity = "1";
  }, 100);
}

function playSound(name) {
  const audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  clearTimeout(responseTimeout);
}

// Triggered when user takes too long
function tookTooLong() {
  const buttons = document.querySelectorAll(".btn");

  // Simulate all buttons being pressed
  buttons.forEach((button) => {
    button.classList.add("pressed");
  });

  playSound("wrong");
  document.body.classList.add("game-over");
  document.getElementById("level-title").textContent =
    "Too Slow! Press Any Key to Restart";

  setTimeout(() => {
    buttons.forEach((button) => button.classList.remove("pressed"));
    document.body.classList.remove("game-over");
  }, 300);

  startOver();
}

     

var hangmanGame = {

  gameWords: {
    pinkFloyd: {
      name: "Pink_Floyd",
      picture: "PinkFloyd.png"
    },
    theBand: {
      name: "The_Band",  
      picture: "TheBand.jpg"
    },
    theKinks: {
      name: "The_Kinks",     
      picture: "TheKinks.jpg"
    },
    rem: {
      name: "REM",
      picture: "REM.png"
    },
    jGiels: {
      name: "J_Geils_Band", 
      picture: "JGeilsBand.jpg"
    },
    ledZeppelin: {
      name: "Led_Zeppelin",   
      picture: "LedZeppelin.jpg"
    },
    queen: {
      name: "Queen", 
      picture: "Queen.jpg"
    },
    inxs: {
      name: "Inxs",
      picture: "Inxs.png"
    }
  },

  hangmanImage: ["Hangman1.jpg", "Hangman2.jpg", "Hangman3.jpg", 
    "Hangman4.jpg", "Hangman5.jpg", "Hangman6.jpg", "Hangman7.jpg", "Hangman8.jpg"],
  
  letters: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
  underlines: ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"],
  selectedWord: null,
  currentLetter: null,
  bandImage: null,
  lettersGuessed: [],
  lettersMatched: [],
  lettersInWord: [],
  maxGuesses: 7,
  remainingGuesses: 7,
  numGuesses: 0,
  numWins: 0, 
  gameOver: false,


  // Update hangman image to show next body part
  updateHangmanImage: function() {
    document.querySelector("#hangman-image").innerHTML =
      "<img class='img img-thumbnail' src='assets//images//" + this.hangmanImage[this.numGuesses] + "'>";
  },


  // Tell user if they won or lost, and how many games they have won
  updateWonLost: function(wonLost) {
    document.querySelector("#won-lost").innerHTML = "<h2 id='won-lost'>" + wonLost + "</h2>"; 
    document.querySelector("#games-won").innerHTML = "<h3 id='games-won'>Games Won = " + this.numWins + "</h3>"; 
  },


  // Display band image and YOU WON!
  displayWon: function() {
    document.querySelector("#hangman-image").innerHTML =
      "<img class='img img-thumbnail' src='assets//images//" + this.bandImage + "'>";
    this.updateWonLost("YOU WON!");    
  },


  // Display dead body and YOU LOST!
  displayLost: function() {
     document.querySelector("#hangman-image").innerHTML =
      "<img class='img img-thumbnail' src='assets//images//Hangman8.jpg'>";     
    this.updateWonLost("YOU LOST!");       
  },


  // Display guessed letters
  displayLettersGuessed: function() {
    document.querySelector("#letters-guessed").innerHTML = this.lettersGuessed;
  },


  // Display letters that match the seleced word
  displayLettersMatched: function() {
    document.querySelector("#letters-matched").innerHTML = this.lettersMatched;
  },


  // initGame method called when page first loads and when game is restarted
  initGame: function() {
    // Capture game word keys
    var objKeys = Object.keys(this.gameWords);

    // Randonly select next game word
    this.selectedWord = objKeys[Math.floor(Math.random() * objKeys.length)];

    // Capture lower case letters in selected word
    this.lettersInWord = this.gameWords[this.selectedWord].name.toLowerCase().split("");  

    // Create array of underscores the same length as selected word
    this.lettersMatched = this.underlines.slice(0,this.lettersInWord.length);

    // Capture band image
    this.bandImage = this.gameWords[this.selectedWord].picture;

    // Init page
   this.updateHangmanImage();   
   this.updateWonLost("");
   this.displayLettersGuessed();
   this.displayLettersMatched();
  },  


  // Function that "restarts" the game by resetting all of the variables and hangman page
  restartGame: function() {
    this.selectedWord = null;
    this.currentLetter = null;
    this.lettersGuessed = [];
    this.lettersMatched = [];
    this.lettersInWord = [];
    this.remainingGuesses = this.maxGuesses;
    this.numGuesses = 0;
    this.gameOver = false;
    this.initGame();
  },


  // Check if game was won
  // Criteria: all letters in selected word match the letters entered
  checkGameStatus: function() {
    // Init
    var gameWon = true;

    // Are there guesses remaining
    if (this.remainingGuesses>0) {

      // Check if user has selected all the letters in the word
      for (var idx = 0; idx < this.lettersInWord.length; idx++) {
        if (this.lettersMatched.indexOf(this.lettersInWord[idx]) === -1) {
          gameWon = false;
        }
      }
       
      // Game won when all letters in selected word match the letters entered
      if (gameWon) {
        this.gameOver = true;

        // Increment # of wins
        this.numWins++;

        // Alert user won game
        this.displayWon();
      }
    }
    // No guesses remaining - User losses
    else {   
      this.gameOver = true;

      // Alert user lost game
      this.displayLost();
    }
  },


  // Identify all positions where letter matches
  updateLettersMatched: function(letter) {
    // Update all positions where selected letter matches letters in word
    for (var idx=0; idx< this.lettersInWord.length; idx++) {
      // If letter matches
      if (this.lettersInWord[idx] === letter) {
        // Replace "_" with letter
        this.lettersMatched[idx] = letter;
      }
    } 
  },
  

  // Check if letter is in selected word
  isLetterInWord: function(letter) {
    // Letter is not in selected word
    if (this.lettersInWord.indexOf(letter) === -1) {
      // Increment # of guesses, decrement guesses remaining
      this.numGuesses++;
      this.remainingGuesses--;

      // Update hangman body parts
      this.updateHangmanImage();

      // Save and display guessed letters that are not in name
      this.lettersGuessed.push(letter);
      this.displayLettersGuessed();
    }
    // Letter is in word
    else {
      // Update and display letters matched array
      this.updateLettersMatched(letter);
      this.displayLettersMatched();
    }

     // Check if matched letters matches all letters in selected name 
    this.checkGameStatus();       
  },


  // Check if key pressed is a valid letter and was not already pressed, 
  // If so check if letter is in selected word
  // If game is over check if # key is pressed to restart game
  processKeyPress: function(keyPressed) {
    // Check if a valid key was pressed - a letter
    // And if letter was not already guessed
    if (this.letters.indexOf(keyPressed) !== -1 && this.lettersGuessed.indexOf(keyPressed) === -1 && this.gameOver !== true) {

      //  Check if letter is in selected word
      this.isLetterInWord(keyPressed);       
    } 
    // To restart game
    else if (keyPressed === "#") {
      // Restart game
      this.restartGame();
    }
  },
};

// Initialize when page loads
hangmanGame.initGame();


// When key is pressed
document.onkeypress = function(event)
{	    
  // Capture key pressed and convert it to lowercase
  hangmanGame.letterGuessed = event.key.toLowerCase();

  // Process user key press
  hangmanGame.processKeyPress(hangmanGame.letterGuessed);  
};      

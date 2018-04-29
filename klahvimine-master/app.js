/* TYPER */
const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0

  this.init()
}

window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 2

    this.mistakesMade = 0;

    this.loadWords()
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)

        typer.start()

      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.allGeneratedLetters = 0;
    this.generateWord()
    this.timeGenerated = new Date();
    this.word.Draw();

    this.score = 0;

    setInterval(updateDocument, 100, null, null, this.timeGenerated)
    window.addEventListener('keypress', this.keyPressed.bind(this))
  },

  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]

    this.word = new Word(wordFromArray, this.canvas, this.ctx)


  },

  keyPressed: function (event) {
    const letter = String.fromCharCode(event.which)

    if (letter === this.word.left.charAt(0)) {
      this.word.removeFirstLetter()

      if (this.word.left.length === 0) {
        this.guessedWords += 1;


        this.timeGuessed = new Date();
        this.wordLength = this.word.word.length;
        this.allGeneratedLetters += this.wordLength;
        this.timeDiff = ((this.timeGuessed - this.timeGenerated) / 1000) / 60;
        this.lettersPerMinute = this.allGeneratedLetters / this.timeDiff;
        this.score = Math.round((this.lettersPerMinute) * this.timeDiff) * 10;
        this.average = Math.round(this.lettersPerMinute);

        updateDocument(this.average, this.score, this.speed)



        this.generateWord()

      }

      this.word.Draw()
    } else {

      this.score += -20;
      this.mistakesMade += 1;
      this.allGeneratedLetters += this.wordLength;
      this.timeGuessed = new Date();
      this.timeDiff = ((this.timeGuessed - this.timeGenerated) / 1000) / 60;
      this.lettersPerMinute = this.allGeneratedLetters / this.timeDiff;
      this.average = Math.round(this.lettersPerMinute);

      updateDocument(this.average, this.score, this.speed);
      blinkit()

      if (this.mistakesMade >= 5) {
        let prevLocalStorageResultsString = localStorage.getItem("results");
        let playerName = localStorage.getItem("name");
        let player = { name: playerName, score: this.score }
        let resultsArray;

        if (prevLocalStorageResultsString !== null) {
          resultsArray = JSON.parse(prevLocalStorageResultsString);
        } else {
          resultsArray = [];
        }
        
        resultsArray.push(player);
        resultsString = JSON.stringify(resultsArray);
        localStorage.setItem("results", resultsString);

        window.location.href = "scoreboard.html";
      }

    }
  }
}





/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Courier'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
  },

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
  }
}

/* HELPERS */
function structureArrayByWordLength(words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined) tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
  }

  return tempArray
}

function updateDocument(average, score, timeGenerated) {
  if (average) {
    document.getElementById("average").innerHTML = "LETTERS PER MINUTE: " + '<br>' + average;
  }
  if (score) {
    document.getElementById("score").innerHTML = "SCORE: " + '<br>' + score;
  }
  if (timeGenerated) {
    this.now = new Date();
    this.timeDiff = Math.round((this.now - timeGenerated) / 1000);
    document.getElementById("timePassed").innerHTML = "TIME: " + '<br>' + this.timeDiff;
  }
}

function blinkit() {
  const body = document.getElementsByTagName("BODY")[0];
  let intrvl = 0;

  for (nTimes = 0; nTimes < 1; nTimes++) {
    intrvl += 10;
    setTimeout(function () {
      body.style.background = 'black';
    }, intrvl);

    intrvl += 100;
    setTimeout(function () {
      body.style.background = '';
    }, intrvl);
  }
}



window.onload = function () {

  const typer = new TYPER()
  window.typer = typer

}
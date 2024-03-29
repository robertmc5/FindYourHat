// This project is an interactive terminal game. 
// The scenario is that the player has lost their hat in a field full of holes, 
// and they must navigate back to it without falling down one of the holes or stepping outside of the field.
// This requires Node.js and the NPM prompt-sync package installed

// NPM module to automatically prompt user input in the terminal
const prompt = require('./node_modules/prompt-sync')({sigint: true});

// Setup class to determine game size, difficulty, mode and continuation
class GameSetup {
  constructor() {
    this.height = 9;
    this.width = 15;
    this.percentHoles = 0.25;
    this.modeOfPlay = true;
  }

  // After game is played, it restarts a new game if the player wants
  restartNewGame() {
    begin = new GameSetup();
    begin.chooseGameSetup();
  }

  // Starts the game by asking three game setup questions, then instantiating the game class: Field
  chooseGameSetup() {
    console.log("===============================================");
    console.log("FIND YOUR HAT");
    console.log("------------------------------------------");
    let invalid = true;
    console.log('How big of a field do you want to play on?');
    while (invalid) {
      let size = prompt('Small-(S) Medium-(M) or Large-(L): ');
      if (!"slm".includes(size.toLowerCase())) {
        console.log('-- PLEASE ENTER [S] [M] [L] OR [ENTER] DEFAULTS TO MEDIUM --');
        continue;
      }
      else if (size.toLowerCase() == 's') {
        this.height = 6;
        this.width = 10;
      }
      else if (size.toLowerCase() == 'l') {
        this.height = 15;
        this.width = 25;
      }
      else if (size.toLowerCase() == 'm' || size == '') {
        this.height = 9;
        this.width = 15;
      }
      invalid = false;
    }

    console.log("- - - - - - - - - - - - - - - - -");
    invalid = true;
    console.log('More holes in the field makes it harder or impossible.');
    console.log('What amount of holes do you want to have to deal with?');
    while (invalid) {
      let percent = prompt('Fewer-(F) Regular-(R) or Many-(M): ');
      if (!"frm".includes(percent.toLowerCase())) {
        console.log('-- PLEASE ENTER [F] [R] [M] OR [ENTER] DEFAULTS TO REGULAR --');
        continue;
      }
      else if (percent.toLowerCase() == 'f') {
        this.percentHoles = 0.18;
      }
      else if (percent.toLowerCase() == 'm') {
        this.percentHoles = 0.28;
      }
      else if (percent.toLowerCase() == 'r' || percent == '') {
        this.percentHoles = 0.23;
      }
      invalid = false;
    }

    console.log("- - - - - - - - - - - - - - - - -");
    invalid = true;
    console.log('You can choose regular mode or sinkhole mode.');
    console.log('Sinkholes make it harder to win as you play.');
    while (invalid) {
      let sinkhole = prompt('Regular-(R) or Sinkhole-(S): ');
      if (!"rs".includes(sinkhole.toLowerCase())) {
        console.log('-- PLEASE ENTER [R] [S] OR [ENTER] DEFAULTS TO SINKHOLE --');
        continue;
      }
      else if (sinkhole.toLowerCase() == 'r') {
        this.modeOfPlay = false;
      }
      else if (sinkhole.toLowerCase() == 's' || sinkhole == '') {
        this.modeOfPlay = true;
      }
      invalid = false;
    }

    // Generate field and start new game
    let currentField = Field.generateField(this.height, this.width, this.percentHoles);
    let currentFieldMode = [currentField, this.modeOfPlay];
    let session = new Field(currentFieldMode);
    session.playGame();

    // Prompt to start over another game or quit
    console.log();
    console.log("-----------------------------------------------");
    invalid = true;
    while (invalid) {
      let replay = prompt('Would you like to play again? Yes-(y) or No-(n): ');
      if (!"yn".includes(replay.toLowerCase())) {
        console.log('-- PLEASE ENTER [y] [n] OR [ENTER] DEFAULTS TO YES --');
        continue;
      }
      else if (replay.toLowerCase() == 'n') {
        invalid = false;
        console.log();
        console.log("Thanks for playing. Enjoy your day.");
        console.log("-----------------------------------");
      }
      else if (replay.toLowerCase() == 'y' || replay == '') {
        invalid = false;
        this.restartNewGame();
      }
    }
  }
}

// Game class
class Field {
  constructor(array) {
    this.field = array[0][0];
    this.xMax = array[0][0][0].length - 1;
    this.yMax = array[0][0].length - 1;
    this.xAxis = array[0][1][0];
    this.yAxis = array[0][1][1];
    this.sinkhole = array[1];
    this.steps = 0;
  }

  // Creates random starting point for player
  static startingPoint(maxLength) {
    let range = Math.floor(maxLength / 3);
    let axis = Field.random(range);
    if (Field.random(2) == 0) {
      axis = (maxLength - 1) - axis;
    }
    return axis;
  }

  // Creates the initial playing field based on player preferences and random selection
  static generateField(height, width, percentHoles) {
    let numberHoles = Math.round(((height * width) - 2) * percentHoles);
    let column = [];
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push('░');
      }
      column.push(row);
    }
    let xStart = Field.startingPoint(width);
    let yStart = Field.startingPoint(height);
    column[yStart][xStart] = '*';
    let hatX = Field.startingPoint(width);
    let hatY = Field.startingPoint(height);
    (xStart < Math.floor(width / 2) && hatX < Math.floor(width / 2)) ? hatX = (width - 1) - hatX : hatX = hatX;
    (xStart > Math.floor(width / 2) && hatX > Math.floor(width / 2)) ? hatX = (width - 1) - hatX : hatX = hatX;
    (yStart < Math.floor(height / 2) && hatY < Math.floor(height / 2)) ? hatY = (height - 1) - hatY : hatY = hatY;
    (yStart > Math.floor(height / 2) && hatY > Math.floor(height / 2)) ? hatY = (height - 1) - hatY : hatY = hatY;
    column[hatY][hatX] = '^';
    let holes = 0;
    while (holes < numberHoles) {
      let holeX = Field.random(width);
      let holeY = Field.random(height);
      if ("O^*".includes(column[holeY][holeX])) {
        continue;
      }
      column[holeY][holeX] = 'O';
      holes++;
    }
    return [column, [xStart, yStart]];
  }

  // Helper function for random selection
  static random(range) {
    let randomNum = Math.floor(Math.random() * range);
    return randomNum;
  }

  // Instructions at the start of game
  static introduction() {
    console.log("---------------------------");
    console.log("FIND YOUR HAT");
    console.log("You've(*) lost your hat(^) in a field(░) with holes(O) in it.");
    console.log("Navigate back to it without falling down one of the holes or stepping outside of the field.");
    console.log('Enter r l u or d to go right, left, up or down.');
    console.log("-----------------------------------------------");
  }

  // Creates sinkholes during play if player selected this functionality
  openSinkhole() {
    let scanning = true;
    while (scanning) {
      let sinkholeX = Field.random(this.xMax + 1);
      let sinkholeY = Field.random(this.yMax + 1);
      if ("O^*♨".includes(this.field[sinkholeY][sinkholeX])) {
        continue;
      }
      this.field[sinkholeY][sinkholeX] = '♨';
      scanning = false;
    }
  }

  // Prints the current field onscreen
  renderField() {
    let fieldPrintPrep = this.field.map(e => '\t' + e.join(''));
    console.log(fieldPrintPrep.join('\n'));
  }

  // Prompts the player to input a direction during gameplay
  askDirection() {
    let input = prompt('Which direction? ');
    return input;
  }

  // Establishes the location of the player's next step
  move(direction) {
    (this.steps > 0) ? this.updateField("•") : this.updateField("*");
    switch (direction) {
      case 'r': 
        this.xAxis += 1;
        return [this.xAxis, this.yAxis];
      case 'l': 
        this.xAxis -= 1;
        return [this.xAxis, this.yAxis];
      case 'u': 
        this.yAxis -= 1;
        return [this.xAxis, this.yAxis];
      case 'd': 
        this.yAxis += 1;
        return [this.xAxis, this.yAxis];
      default:
        console.log('-- PLEASE ENTER [r] [l] [u] OR [d] FOR DIRECTION --');
        return 'invalid';
    }
  }

  // Determines what type of spot the player just stepped on
  checkNextStep(x, y) {
    if (x > this.xMax || x < 0 || y > this.yMax || y < 0) {
      return "boundary";
    }
    else if (this.field[y][x] === "O") {
      return "hole";
    }
    else if (this.field[y][x] === "♨") {
      return "sinkhole";
    }
    else if (this.field[y][x] === "^") {
      return "hat";
    }
    else {
      return "field";
    }
  }

  // Notates the current location of the player
  updateField(char) {
    this.field[this.yAxis][this.xAxis] = char;
  }

  // Prints the results of the game when it ends
  gameEnd(result) {
    if (result == 'boundary') {
      console.log("Awww. You've stepped outside the field boundary.");
      console.log("Sorry. You'll not get your hat back this time.");
      console.log("-- GAME OVER --");
    }
    else if (result == 'hole' || result == 'sinkhole') {
      this.field[this.yAxis][this.xAxis] = "X";
      this.renderField();
      console.log(`Nooo! You've fallen down a ${result} in the field.`);
      console.log("Sorry. You'll not get your hat back this time.");
      console.log("-- GAME OVER --");
    }
    else if (result == 'hat') {
      this.field[this.yAxis][this.xAxis] = "✓";
      this.renderField();
      console.log(`YES! You've located your hat in ${this.steps + 1} steps!`);
      console.log("Great job! It's good to have your hat back.");
      console.log("-- YOU WIN!!! --");
    }
    else {
      console.log("-- GAME OVER --");
    }
  }

  // Active game method that manages gameplay
  playGame() {
    let active = true;
    Field.introduction();
    this.renderField();
    console.log("----------------");
    while (active) {
      let direction = this.askDirection();
      let location = this.move(direction.toLowerCase());
      if (location == 'invalid') continue;
      let result = this.checkNextStep(location[0], location[1]);
      if (result == 'field') {
        this.updateField("*");
        this.steps++;
        if (this.sinkhole) {
          this.openSinkhole();
        }
        this.renderField();
        console.log("----------------");
      }
      else {
        active = false;
        this.gameEnd(result);
      }
    }
  }
}

// Activates game
let begin = new GameSetup();
begin.chooseGameSetup();

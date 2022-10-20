// This project is an interactive terminal game. 
// The scenario is that the player has lost their hat in a field full of holes, 
// and they must navigate back to it without falling down one of the holes or stepping outside of the field.
// This requires Node.js and the NPM prompt-sync package installed

// NPM module to automatically prompt user input
const prompt = require('../node_modules/prompt-sync')({sigint: true});

// Game class
class Field {
  constructor(array) {
    this.field = array;
    this.xAxis = 0;
    this.yAxis = 0;
    this.xMax = array[0].length - 1;
    this.yMax = array.length - 1;
    this.steps = 0;
  }

  static generateField(height, width, percentHoles) {
    let numberHoles = Math.round(((height * width) - 2) * percentHoles);
    console.log("numberHoles: " + numberHoles);                                    // TEST
    let column = [];
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push('░');
      }
      column.push(row);
    }
    column[0][0] = '*';
    let randomHatX = width - Field.random(Math.floor(width / 1.6)) - 1;
    let randomHatY = height - Field.random(Math.floor(height / 1.6)) - 1;
    column[randomHatY][randomHatX] = '^';
    let holes = 0;
    while (holes < numberHoles) {
      let holeX = Field.random(width);
      let holeY = Field.random(height);
      if (column[holeY][holeX] == 'O' || column[holeY][holeX] == '^' || (holeX < 2 && holeY < 2)) {
        continue;
      }
      column[holeY][holeX] = 'O';
      holes++;
    }
    return column;
  }

  static random(range) {
    let randomNum = Math.floor(Math.random() * range);
    return randomNum;
  }

  static introduction() {
    console.log("--------------");
    console.log("FIND YOUR HAT");
    console.log("You've(*) lost your hat(^) in a field(░) with holes(O) in it.");
    console.log("Navigate back to it without falling down one of the holes or stepping outside of the field.");
    console.log('Enter r l u or d to go right, left, up or down.');
    console.log("-----------------------------------------------");
  }

  renderField() {
    let fieldPrintPrep = this.field.map(e => '\t' + e.join(''));
    console.log(fieldPrintPrep.join('\n'));
  }

  askDirection() {
    let input = prompt('Which direction? ');
    return input;
  }

  move(direction) {
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

  checkNextStep(x, y) {
    if (x > this.xMax || x < 0 || y > this.yMax || y < 0) {
      return "boundary";
    }
    else if (this.field[y][x] === "O") {
      return "hole";
    }
    else if (this.field[y][x] === "^") {
      return "hat";
    }
    else {
      return "field";
    }
  }

  updateField() {
    this.field[this.yAxis][this.xAxis] = "*";
  }

  gameEnd(result) {
    if (result == 'boundary') {
      console.log("Awww. You've stepped outside the field boundary.");
      console.log("Sorry. You'll not get your hat back this time.");
      console.log("-- GAME OVER --");
    }
    else if (result == 'hole') {
      this.field[this.yAxis][this.xAxis] = "X";
      this.renderField();
      console.log("Nooo! You've fallen down a hole in the field.");
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
        this.updateField();
        this.renderField();
        this.steps++;
        console.log("----------------");
      }
      else {
        active = false;
        this.gameEnd(result);
      }
    }
  }
}

// Activate game
let currentField = Field.generateField(9, 15, 0.25);
let session = new Field(currentField);
session.playGame();

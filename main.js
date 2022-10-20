// This project is an interactive terminal game. 
// The scenario is that the player has lost their hat in a field full of holes, 
// and they must navigate back to it without falling down one of the holes or stepping outside of the field.
// This requires Node.js and the NPM prompt-sync package installed

// NPM module to automatically prompt user input
const prompt = require('../node_modules/prompt-sync')({sigint: true});

// Game class
class Field {
  constructor(array) {
    this.field = array[0];
    this.xMax = array[0][0].length - 1;
    this.yMax = array[0].length - 1;
    this.xAxis = array[1][0];
    this.yAxis = array[1][1];
    this.steps = 0;
  }

  static startingPoint(maxLength) {
    let range = Math.floor(maxLength / 3);
    let axis = Field.random(range);
    if (Field.random(2) == 0) {
      axis = (maxLength - 1) - axis;
    }
    return axis;
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
    let xStart = Field.startingPoint(width);
    let yStart = Field.startingPoint(height);
    console.log("===> ", xStart, yStart);                                                 // TEST
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

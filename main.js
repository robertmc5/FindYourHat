// This project is an interactive terminal game. 
// The scenario is that the player has lost their hat in a field full of holes, 
// and they must navigate back to it without falling down one of the holes or stepping outside of the field.
// This requires Node.js and the NPM prompt-sync package installed

// NPM module to automatically prompt user input
const prompt = require('../node_modules/prompt-sync')({sigint: true});

// Game Class
class Field {
  constructor(array) {
    this.field = array;
    this.xAxis = 0;
    this.yAxis = 0;
    this.xMax = array[0].length - 1;
    this.yMax = array.length - 1;
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
    if (x > this.xMax || x < 0 || y > this.xMax || y < 0) {
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

  gameEnd() {
    console.log("GAME ENDED.")                                    // TEST
  }

  playGame() {
    let active = true;
    console.log("--------------");
    console.log("You've(*) lost your hat(^) in a field(░) with holes(O) in it.");
    console.log("Navigate back to it without falling down one of the holes or stepping outside of the field.");
    console.log('Enter r l u or d to go right, left, up or down.');
    console.log("-----------------------------------------------");
    this.renderField();
    console.log("----------------");
    while (active) {
      let direction = this.askDirection();
      let location = this.move(direction.toLowerCase());
      if (location == 'invalid') continue;
      console.log(location, typeof location)                                // TEST
      let result = this.checkNextStep(location[0], location[1]);
      if (result == 'field') {
        this.updateField();
        this.renderField();
        console.log("----------------");
      }
      else {
        active = false;
        this.gameEnd();
      }
    }
  }
}

// Class instance
const findHat3x3 = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);

// Activate game
findHat3x3.playGame();

// This project is an interactive terminal game. 
// The scenario is that the player has lost their hat in a field full of holes, 
// and they must navigate back to it without falling down one of the holes or stepping outside of the field.
// This requires Node.js and it's NPM prompt-sync package installed

// NPM module to automatically prompt user input
const prompt = require('../node_modules/prompt-sync')({sigint: true});

// Characters that make up the field of play
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// Field of play Class
class Field {
  constructor(array) {
    this.field = array;
    this.xAxis = 0;
    this.yAxis = 0;
    this.xMax = array[0].length - 1;
    this.yMax = array.length - 1;
  }

  print() {
    let fieldPrintPrep = this.field.map(e => '\t' + e.join(''));
    console.log(fieldPrintPrep.join('\n'));
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

  // move() {

  // }
}

// Class instance
const playing = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);

// Gameplay
let active = true;
console.log("--------------");
console.log("You've(*) lost your hat(^) in a field(░) with holes(O) in it.");
console.log("Navigate back to it without falling down one of the holes or stepping outside of the field.");
console.log('Enter r l u or d to go right, left, up or down.');
console.log("--------------");
console.log('xMax: ' + playing.xMax, 'yMax: ' + playing.yMax, 'xAxis: ' + playing.xAxis, 'yAxis: ' + playing.yAxis);          // TEST
console.log();                                                                                // TEST
playing.print();
while (active) {
  let input = prompt('Which direction? ');

  // if (input === r) {
  //   checkStatus(xAxis + 1, yAxis);
  // }



  console.log(`Ok ${input}.`)
  active = false;
}

// Game Results


// TESTING
console.log(playing.checkNextStep(playing.xAxis, playing.yAxis));
console.log(playing.checkNextStep(playing.xAxis + 1, playing.yAxis + 2));
console.log(playing.checkNextStep(playing.xAxis + 2, playing.yAxis));
console.log(playing.checkNextStep(playing.xAxis - 1, playing.yAxis));
console.log(playing.checkNextStep(playing.xAxis + 3, playing.yAxis));
console.log(playing.checkNextStep(playing.xAxis, playing.yAxis - 1));
console.log(playing.checkNextStep(playing.xAxis, playing.yAxis + 3));
console.log(playing.checkNextStep(playing.xAxis + 1, playing.yAxis));
// console.log(myField);
// myField.print();

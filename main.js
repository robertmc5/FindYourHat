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
  }

  print() {
    let fieldPrintPrep = this.field.map(e => '\t' + e.join(''));
    console.log(fieldPrintPrep.join('\n'));
  }
}

// Class instance
const myField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);

// Gameplay
let active = true;
console.log('Press r l u or d to go right, left, up or down');
myField.print();
while (active) {
  let input = prompt('What direction? ');

  if (input)



  console.log(`Ok ${input}.`)
  active = false;
}

// Game Results


// TESTING
// console.log(myField);
// myField.print();

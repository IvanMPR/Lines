// Create board
const board = document.querySelector('.board');
function createBoard() {
  let html = '';
  for (let i = 0; i < 100; i++) {
    html += `<div class="field" id="${i}"></div>`;
  }
  board.insertAdjacentHTML('beforeend', html.trim());
}

createBoard();
// Fisher - Yates shuffle
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const makeBall = element => {
  const colors = [
    'white',
    'orangered',
    'yellowgreen',
    'magenta',
    'cornflowerblue',
    'indianred',
    'goldenrod',
  ];

  const randomColor = shuffle(colors)[0];
  const ball = document.createElement('div');
  ball.className = `color-ball ${randomColor}`;
  ball.style.backgroundColor = randomColor;
  element.appendChild(ball);
};

const findEmptyField = function () {
  const allFields = document.querySelectorAll('.field');
  const unusedFields = Array.from(allFields)
    .filter(field => field.innerHTML === '')
    .map(field => field.getAttribute('id'));

  const randomEmptyField = shuffle(unusedFields)[0];
  const div = document.getElementById(randomEmptyField);

  return div;
};

function displayBalls(number) {
  if (number === 0) return;
  const div = findEmptyField();
  makeBall(div);
  return displayBalls(number - 1);
}

function addActiveClass(ball) {
  const color = ball.className.split(' ')[1];
  ball.style.outline = `2px solid ${color}`;
  ball.classList.add('active');
}

function removeActiveClass() {
  document
    .querySelectorAll('.color-ball')
    .forEach(ball => ball.classList.remove('active'));
}

function removePathClass() {
  document
    .querySelectorAll('.path')
    .forEach(field => field.classList.remove('path'));
}

function drawPath(e) {
  const activeFieldId = Number(
    document.querySelector('.active').closest('.field').id
  );
  const desiredFieldId = Number(e.target.id);
  console.log(activeFieldId, desiredFieldId);

  let array = Array.from(
    { length: Math.abs(activeFieldId - desiredFieldId) + 1 },
    (_, i) => {
      return desiredFieldId > activeFieldId
        ? i + activeFieldId
        : activeFieldId - i;
    }
  );
  // console.log(array);

  array.forEach(fieldId => {
    document.getElementById(`${fieldId}`).classList.add('path');
  });
}
// helper function
function div(divId) {
  return document.getElementById(`${divId}`).innerHTML !== '';
}

function moveBall(e) {
  // Ball to be moved, only one with 'active' class
  const ball = document.querySelector('.active');
  // Field id where the ball is located
  const activeFieldId = Number(ball.closest('.field').id);
  // Field id where the ball is suppose to be moved
  const desiredFieldId = Number(e.target.id);
  // //////////////////////////////////////////////////////////// //
  // calcMovesArr(start or id, end){} async?
  // function calcMoves(startId, endId) {
  // sort possible fields for the closest number to goal(or reminder of 10)

  let id = Number(activeFieldId);

  const up = id < 10 || div(id - 10) ? false : id - 10;
  const down = id >= 90 || div(id + 10) ? false : id + 10;
  const left = (id % 10 || div(id - 1)) === 0 ? false : id - 1;
  const right = (id % 10 || div(id + 1)) === 9 ? false : id + 1;

  const values = [up, down, left, right];
  const possibleFields = values.filter(el => el);
  const sortedTest = possibleFields.sort((a, b) =>
    activeFieldId - desiredFieldId < 0 ? a - b : b - a
  );
  let array = [id];

  array.push(sortedTest[0]);
  if (array[array.length - 1] === desiredFieldId) return;
  else {
    return moveBall(array[array.length - 1]);
  }
  // const testArr = [id];
  // if (sortedTest[0] !== desiredFieldId) {
  //   testArr.push(sortedTest[0]);
  //   calcMovesArr(testArr[testArr.length - 1], desiredFieldId);
  // } else {
  //   testArr.push(sortedTest[0]);
  //   return testArr;
  // }
  console.log(possibleFields);
  console.log(sortedTest);
  // console.log(testArr);
  // console.log(
  //   Array.from(document.querySelectorAll('.field'))
  //     .filter(el => el.innerHTML === '')
  //     .map(div => Number(div.id))
  // );
  // if no path is found, call isSurrounded ?

  // push closest fields until last value is 'end'

  // calcMovesArr();
  // //////////////////////////////////////////////////////////// //

  // let array = Array.from(
  //   { length: Math.abs(activeFieldId - desiredFieldId) + 1 },
  //   (_, i) => {
  //     return desiredFieldId > activeFieldId
  //       ? i + activeFieldId
  //       : activeFieldId - i;
  //   }
  // );
  // let array = [];
  // Delay functionality for ball movement
  const interval = setInterval(() => {
    let i = 0;
    document.getElementById(`${array[i]}`).innerHTML = '';
    document.getElementById(`${array[i + 1]}`).appendChild(ball);
    document.getElementById(`${array[i]}`).classList.remove('path');
    i++;

    array = array.slice(1);

    if (i === array.length) {
      removePathClass();
      removeActiveClass();
      clearInterval(interval);
    }
  }, 150);
}

function isSurrounded(divId) {
  let id = Number(divId);

  const soundSurrounded = document.getElementById('sound-surrounded');
  // refactor with div helper function
  const up = id < 10 ? false : id - 10;
  const down = id >= 90 ? false : id + 10;
  const left = id % 10 === 0 ? false : id - 1;
  const right = id % 10 === 9 ? false : id + 1;

  const values = [up, down, left, right];
  const possibleFields = values.filter(el => el);

  const isFieldOccupied = possFields => {
    return possFields.every(
      field => document.getElementById(`${field}`).innerHTML !== ''
    );
  };

  if (isFieldOccupied(possibleFields)) {
    soundSurrounded.play();
    setTimeout(removeActiveClass, 200);
    return true;
  } else {
    console.log('Free');
    return false;
  }
}

const button = document.querySelector('.btn');
const body = document.querySelector('body');
button.addEventListener('click', () => {
  displayBalls(3);
});
// Click on the ball to select it
board.addEventListener('click', e => {
  if (!e.target.classList.contains('color-ball')) return;
  removeActiveClass();
  isSurrounded(e.target.closest('.field').id);
  addActiveClass(e.target);
});

// Click on the desired field to move the ball
board.addEventListener('click', e => {
  if (
    e.target.classList.contains('color-ball') ||
    !document.querySelector('.active')
  )
    return;

  drawPath(e);
  setTimeout(() => {
    moveBall(e);
  }, 300);
});
// Remove 'active' class if there is an active ball, and second click happened anywhere out of 'board' div
body.addEventListener('click', e => {
  if (
    !e.target.classList.contains('next-move') &&
    !e.target.classList.contains('scores') &&
    !e.target.classList.contains('btn') &&
    !e.target.classList.contains('field') &&
    !e.target.classList.contains('color-ball')
  ) {
    removeActiveClass();
  }
});

// calcMovesArr(start or id, end){} async?
// function calcMoves(startId, endId) {
// sort possible fields for the closest number to goal(or reminder of 10)
// const calcMovesArr = (start = activeFieldId, end = desiredFieldId) => {
//   let id = Number(activeFieldId);

//   const up = id < 10 || div(id - 10) ? false : id - 10;
//   const down = id >= 90 || div(id + 10) ? false : id + 10;
//   const left = (id % 10 || div(id - 1)) === 0 ? false : id - 1;
//   const right = (id % 10 || div(id + 1)) === 9 ? false : id + 1;

//   const values = [up, down, left, right];
//   const possibleFields = values.filter(el => el);
//   const sortedTest = possibleFields.sort((a, b) =>
//     activeFieldId - desiredFieldId < 0 ? a - b : b - a
//   );
//   const testArr = [id];
//   if (sortedTest[0] !== desiredFieldId) {
//     testArr.push(sortedTest[0]);
//     calcMovesArr(testArr[testArr.length - 1], desiredFieldId);
//   } else {
//     testArr.push(sortedTest[0]);
//     return testArr;
//   }
//   console.log(possibleFields);
//   console.log(sortedTest);
//   console.log(testArr);
//   // if no path is found, call isSurrounded ?

//   // push closest fields until last value is 'end'
// };
// calcMovesArr();

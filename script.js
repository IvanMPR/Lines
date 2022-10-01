// Create board
const board = document.querySelector('.board');
function createBoard() {
  let html = '';
  for (let i = 0; i < 100; i++) {
    html += `<div class="field" data-fieldId="${i}" id="${i}"></div>`;
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
  if (unusedFields.length === 0) {
    alert('Game Over');
    return;
  }
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
function drawPath(arr) {
  // function drawPath(e) {
  //   const activeFieldId = Number(
  //     document.querySelector('.active').closest('.field').id
  //   );
  //   const desiredFieldId = Number(e.target.id);
  //   console.log(activeFieldId, desiredFieldId);

  //   let array = Array.from(
  //     { length: Math.abs(activeFieldId - desiredFieldId) + 1 },
  //     (_, i) => {
  //       return desiredFieldId > activeFieldId
  //         ? i + activeFieldId
  //         : activeFieldId - i;
  //     }
  //   );
  //   // console.log(array);

  //   array.forEach(fieldId => {
  //     document.getElementById(`${fieldId}`).classList.add('path');
  //   });
  // }
  return arr.forEach(fieldId => {
    document.getElementById(`${fieldId}`).classList.add('path');
  });
}
// helper function
function div(divId) {
  return document.getElementById(`${divId}`).innerHTML !== '';
}

// function moveBall(e) {
//   // Ball to be moved, only one with 'active' class
//   const ball = document.querySelector('.active');
//   // Field id where the ball is located
//   const activeFieldId = Number(ball.closest('.field').id);
//   // Field id where the ball is suppose to be moved
//   const desiredFieldId = Number(e.target.id);
//   // //////////////////////////////////////////////////////////// //
//   // calcMovesArr(start or id, end){} async?
//   // function calcMoves(startId, endId) {
//   // sort possible fields for the closest number to goal(or reminder of 10)

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
//   let array = [id];

//   array.push(sortedTest[0]);
//   if (array[array.length - 1] === desiredFieldId) return;
//   else {
//     return moveBall(array[array.length - 1]);
//   }
//   // const testArr = [id];
//   // if (sortedTest[0] !== desiredFieldId) {
//   //   testArr.push(sortedTest[0]);
//   //   calcMovesArr(testArr[testArr.length - 1], desiredFieldId);
//   // } else {
//   //   testArr.push(sortedTest[0]);
//   //   return testArr;
//   // }
//   console.log(possibleFields);
//   console.log(sortedTest);
//   // console.log(testArr);
//   // console.log(
//   //   Array.from(document.querySelectorAll('.field'))
//   //     .filter(el => el.innerHTML === '')
//   //     .map(div => Number(div.id))
//   // );
//   // if no path is found, call isSurrounded ?

//   // push closest fields until last value is 'end'

//   // calcMovesArr();
//   // //////////////////////////////////////////////////////////// //

//   // let array = Array.from(
//   //   { length: Math.abs(activeFieldId - desiredFieldId) + 1 },
//   //   (_, i) => {
//   //     return desiredFieldId > activeFieldId
//   //       ? i + activeFieldId
//   //       : activeFieldId - i;
//   //   }
//   // );
//   // let array = [];
//   // Delay functionality for ball movement
//   const interval = setInterval(() => {
//     let i = 0;
//     document.getElementById(`${array[i]}`).innerHTML = '';
//     document.getElementById(`${array[i + 1]}`).appendChild(ball);
//     document.getElementById(`${array[i]}`).classList.remove('path');
//     i++;

//     array = array.slice(1);

//     if (i === array.length) {
//       removePathClass();
//       removeActiveClass();
//       clearInterval(interval);
//     }
//   }, 150);
// }

function isSurrounded(divId) {
  let id = Number(divId);

  const soundSurrounded = document.getElementById('sound-surrounded');
  // refactor with div helper function
  const up = id < 10 || id - 10 < 0 || div(id - 10) ? false : id - 10;
  const down = id >= 90 || id + 10 > 99 || div(id + 10) ? false : id + 10;
  const left = id % 10 === 0 || id - 1 < 0 || div(id - 1) ? false : id - 1;
  const right = (id % 10 || id + 1 > 99) === 9 || div(id + 1) ? false : id + 1;

  const values = [up, down, left, right];
  const possibleFields = values.filter(el => typeof el === 'number');

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
function getTargetId(e) {
  return Number(e.target.id);
}

function currentId() {
  return Number(document.querySelector('.active').closest('.field').id);
}
function go(goal) {
  let id = Number(document.querySelector('.active').closest('.field').id);
  // let id = 90;
  let div = num => document.getElementById(`${num}`).innerHTML !== '';
  // const goal = Number(e.target.id);
  const up = id < 10 || id - 10 < 0 || div(id - 10) ? false : id - 10;
  const down = id >= 90 || id + 10 > 99 || div(id + 10) ? false : id + 10;
  const left = id % 10 === 0 || id - 1 < 0 || div(id - 1) ? false : id - 1;
  const right = (id % 10 || id + 1 > 99) === 9 || div(id + 1) ? false : id + 1;

  const values = [up, down, left, right];

  const possibleFields = values.filter(el => typeof el === 'number');
  const sortedTest = possibleFields.sort((a, b) => (id < goal ? b - a : a - b));
  console.log(id, goal, possibleFields, sortedTest);

  let path = [];
  let used = [];
  function practice(start, end) {
    if (start === end) {
      path.push(end);
      return path;
    }
    if (!used.includes(start)) {
      path.push(start);
      used.push(start);
    }
    return practice(start + 1, end);
  }
  // console.log(practice(11, 19));

  // let i = id;

  // const interval = setInterval(() => {
  //   // let diff = Math.abs(id - goal);
  //   moveBall(i);
  //   console.log(i);
  //   if (i === goal) {
  //     clearInterval(interval);
  //     setTimeout(removeActiveClass, 200);
  //   }
  // }, 300);
}

function moveBall(id) {
  const ball = document.querySelector('.active');
  if (document.getElementById(`${id}`).innerHTML === '') {
    document.getElementById(`${id}`).appendChild(ball);
    removeActiveClass();
    setTimeout(() => {
      displayBalls(3);
    }, 500);
  } else {
    return;
  }
  // return document.getElementById(`${id}`).appendChild(ball);
}
// let id = Number(activeFieldId);

// function moves(activeId) {
// let id = Number(document.querySelector('.active').closest('field').id);

// return { up: up, down: down, left: left, right: right };
// }

function deleteIfBallsConsecutive(arrTest, colorName, arrToDel) {
  const indexes = [];
  for (let i = 0; i <= 5; i++) {
    const current = arrTest.slice(i, i + 5);
    console.log(current);
    if (current.every(el => el === colorName)) {
      console.log('We have a hit!');
      indexes.push(i);
    } else {
      console.log('We have a miss!');
    }
  }
  console.log(indexes);
  if (indexes.length === 0) return;
  let indexesToDelete = Array.from(
    { length: indexes.length + 5 - 1 },
    (_, i) => indexes[0] + i
  );
  console.log(indexesToDelete);
  setTimeout(() => {
    arrToDel.map((el, i) =>
      indexesToDelete.includes(i)
        ? (document.getElementById(`${el}`).innerHTML = '')
        : el
    );
  }, 300);
}

function checkScore(id) {
  // Pad first row with zero, in order to be able to split cell id, for determining row and col
  const tuple = String(id)
    .padStart(2, '0')
    .split('')
    .map(el => Number(el));
  // Build row id's by data from tuple[0]
  const row = Array.from({ length: 10 }, (_, i) => tuple[0] * 10 + i);
  // Build column id's by data from tuple[1]
  const column = Array.from({ length: 10 }, (_, i) => tuple[1] + i * 10);
  // Helper fn to extract name of the color used in the cell with some 'id'
  const extractColor = id =>
    document.getElementById(`${id}`).innerHTML === ''
      ? id
      : document.getElementById(`${id}`).firstChild.className.split(' ')[1];
  //  Retrieve color name as a string, for later check in row and col
  const colorToMatch = extractColor(id);
  // Map row fields, if empty, leave id, else put color name
  const rowMapped = row.map(num => extractColor(num));
  // Same as above, just for column
  const columnMapped = column.map(num => extractColor(num));
  console.log(row, column, tuple, rowMapped, columnMapped, colorToMatch);
  // Logic for determining if score happened or not
  const colorOccurrences = (arr, colorName = colorToMatch) => {
    return arr.filter(el => el === colorName).length;
  };

  console.log(colorOccurrences(rowMapped));
  console.log(colorOccurrences(columnMapped));

  if (colorOccurrences(rowMapped) >= 5) {
    console.log('More than five! Row');
    deleteIfBallsConsecutive(rowMapped, colorToMatch, row);
  }

  if (colorOccurrences(columnMapped) >= 5) {
    console.log('More than five! Column');

    deleteIfBallsConsecutive(columnMapped, colorToMatch, column);
  }
}

// Click on the desired field to move the ball
board.addEventListener('click', e => {
  if (
    e.target.classList.contains('color-ball') ||
    !document.querySelector('.active')
  )
    return;
  moveBall(e.target.id);
  checkScore(e.target.id);

  // go(getTargetId(e));
  // drawPath(e);
  // setTimeout(() => {
  //   moveBall(e);
  // }, 300);
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

// function move(e) {
//   const activeBall = document.querySelector('.active');
//   const start = Number(activeBall.closest('.field').id);
//   const end = Number(e.target.id);
//   const arrLength = Math.abs(start - end);
//   const movesArr = Array.from({ length: arrLength + 1 }, (_, i) =>
//     start < end ? i + start : start - i
//   );
//   console.log(start, end, arrLength, movesArr);
//   if (
//     Math.abs(
//       arrLength < 10 &&
//         start < end &&
//         movesArr.every(el => document.getElementById(`${el}`).innerHTML === '')
//     )
//   ) {
//     console.log(movesArr);
//     return movesArr;
//   } else if (
//     Math.abs(
//       arrLength < 10 &&
//         start > end &&
//         movesArr.every(el => document.getElementById(`${el}`).innerHTML === '')
//     )
//   ) {
//     console.log(movesArr.reverse());
//     return movesArr.reverse();
//   }

//   return movesArr;
// }

// let path = [];
// let used = [];
// function practice(start, end) {
//   if (start === end) {
//     path.push(end);
//     return path;
//   }
//   if (!used.includes(start)) {
//     path.push(start);
//     used.push(start);
//   }
//   return practice(start + 1, end);
// }
// console.log(practice(11, 19));

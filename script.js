// Create board
const board = document.querySelector('.board');
const button = document.querySelector('.btn');
const body = document.querySelector('body');

const result = {
  count: 0,
};

function createBoard() {
  let html = '';
  for (let i = 0; i < 100; i++) {
    html += `<div class="field" data-fieldId="${i}" id="${i}"></div>`;
  }
  board.insertAdjacentHTML('beforeend', html.trim());
}

createBoard();

function showResultParagraph() {
  return document.querySelector('.scores').classList.remove('hidden');
}
function updateResult(result) {
  document.querySelector('.scores').textContent = result;
}

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
  // if (unusedFields.length === 0) {
  //   alert('Game Over');
  //   return;
  // }
  const randomEmptyField = shuffle(unusedFields)[0];
  const div = document.getElementById(randomEmptyField);

  return div;
};

function displayBalls(number) {
  if (number === 0) return;
  const div = findEmptyField();
  makeBall(div);
  //checkScore fn checks if sequence of five or more balls is achieved while randomly placing the balls across the board
  checkScore(Number(div.id));
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
}

function deleteIfBallsConsecutive(arrTest, colorName, arrToDel) {
  const indexes = [];
  for (let i = 0; i <= 5; i++) {
    const current = arrTest.slice(i, i + 5);
    if (current.every(el => el === colorName)) {
      indexes.push(i);
    }
  }

  if (indexes.length === 0) return;
  let indexesToDelete = Array.from(
    { length: indexes.length + 5 - 1 },
    (_, i) => indexes[0] + i
  );

  setTimeout(() => {
    arrToDel.map((el, i) =>
      indexesToDelete.includes(i)
        ? (document.getElementById(`${el}`).innerHTML = '')
        : el
    );
  }, 300);
  // Update internal result count
  result.count += (indexes.length - 1 + 5) * 10;
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
  // Build first diagonal from top left to bottom right direction
  const diagonalFromLeftToRight = pair => {
    let start;
    let step = 11;
    if (pair[0] - pair[1] > 0) {
      start = (pair[0] - pair[1]) * 10;
    } else if (pair[0] - pair[1] < 0) {
      start = pair[1] - pair[0];
    } else {
      start = 0;
    }
    // console.log(
    //   'Left to Right :',
    //   Array.from(
    //     { length: start < 10 ? 10 - start : (100 - start) / 10 },
    //     (_, i) => start + i * step
    //   )
    // );
    return Array.from(
      { length: start < 10 ? 10 - start : (100 - start) / 10 },
      (_, i) => start + i * step
    );
  };
  const diagonalTopLeftBottomRight = diagonalFromLeftToRight(tuple);

  // Build second diagonal from top right to bottom left direction

  const diagonalFromRightToLeft = pair => {
    let start;
    let step = 9;

    if (pair[0] + pair[1] <= 9) {
      start = pair[0] + pair[1];
    } else {
      start = Number(String(pair[0] + pair[1]).split('')[1] + '9');
    }
    // console.log(
    //   'Right to Left :',
    //   Array.from(
    //     { length: start < 10 ? start + 1 : pair[1] - pair[0] + 1 },
    //     (_, i) => start + i * step
    //   )
    // );
    return Array.from(
      { length: start < 10 ? start + 1 : pair[1] - pair[0] + 1 },
      (_, i) => start + i * step
    );
  };
  const diagonalTopRightBottomLeft = diagonalFromRightToLeft(tuple);
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
  // LR diagonal mapped
  const lefRigDiagMapped = diagonalTopLeftBottomRight.map(num =>
    extractColor(num)
  );
  // RL diagonal mapped
  const rigLefDiagMapped = diagonalTopRightBottomLeft.map(num =>
    extractColor(num)
  );
  console.log(
    row,
    column,
    tuple,
    rowMapped,
    columnMapped,
    colorToMatch,
    diagonalTopLeftBottomRight,
    diagonalTopRightBottomLeft
  );
  // Logic for determining if score happened or not
  const colorOccurrences = (arr, colorName = colorToMatch) => {
    return arr.filter(el => el === colorName).length;
  };

  if (colorOccurrences(rowMapped) >= 5) {
    deleteIfBallsConsecutive(rowMapped, colorToMatch, row);
  }

  if (colorOccurrences(columnMapped) >= 5) {
    deleteIfBallsConsecutive(columnMapped, colorToMatch, column);
  }
  if (colorOccurrences(lefRigDiagMapped) >= 5) {
    deleteIfBallsConsecutive(
      lefRigDiagMapped,
      colorToMatch,
      diagonalTopLeftBottomRight
    );
  }
  if (colorOccurrences(rigLefDiagMapped) >= 5) {
    deleteIfBallsConsecutive(
      rigLefDiagMapped,
      colorToMatch,
      diagonalTopRightBottomLeft
    );
  }
  updateResult(result.count);
}

button.addEventListener('click', function () {
  this.style.display = 'none';
  displayBalls(3);
  showResultParagraph();
});
// Click on the ball to select it
board.addEventListener('click', e => {
  if (!e.target.classList.contains('color-ball')) return;
  removeActiveClass();
  addActiveClass(e.target);
});

// Click on the desired field to move the ball
board.addEventListener('click', e => {
  if (
    e.target.classList.contains('color-ball') ||
    !document.querySelector('.active')
  )
    return;
  moveBall(e.target.id);
  checkScore(e.target.id);
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

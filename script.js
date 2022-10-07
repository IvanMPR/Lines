const BOARD_LENGTH = 10;
const NUMBER_OF_BALLS = 3;
const GOAL_LENGTH = 5;
const POINTS_MULTIPLIER = 10;

// Create board
const board = document.querySelector('.board');
const button = document.querySelector('.btn');
const body = document.querySelector('body');

const mainObject = {
  count: 0,
  nextRound: true,
};

function createBoard() {
  let html = '';
  for (let i = 0; i < BOARD_LENGTH * BOARD_LENGTH; i++) {
    html += `<div class="field" data-fieldId="${i}" id="${i}"></div>`;
  }
  board.insertAdjacentHTML('beforeend', html.trim());
}

createBoard();

function gameOver() {
  const html = `<div class="modal">
      <div class="info">
        <p class="text">Game Over! You had ${mainObject.count} points!</p>
        </div>
      </div>`;
  body.insertAdjacentHTML('afterbegin', html);
}

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
    // 'indianred',
    'goldenrod',
  ];

  const randomColor = shuffle(colors)[0];
  const ball = document.createElement('div');
  ball.className = `color-ball ${randomColor}`;
  ball.style.backgroundColor = randomColor;
  element.appendChild(ball);
};

function displayBalls(number) {
  const allFields = document.querySelectorAll('.field');

  for (let i = 0; i < number; i++) {
    const unusedFields = Array.from(allFields)
      .filter(field => field.innerHTML === '')
      .map(field => field.getAttribute('id'));

    const randomEmptyField = shuffle(unusedFields)[0];
    const div = document.getElementById(randomEmptyField);

    if (!mainObject.nextRound) return;

    if (unusedFields.length > 0) {
      makeBall(div);
      checkScore(Number(div.id));
    }
  }
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
      displayBalls(NUMBER_OF_BALLS);
    }, 500);
  } else {
    return;
  }
}

function deleteIfBallsConsecutive(arrTest, colorName, arrToDel) {
  const indexes = [];
  for (let i = 0; i <= GOAL_LENGTH; i++) {
    const current = arrTest.slice(i, i + GOAL_LENGTH);
    if (
      current.every(el => el === colorName) &&
      current.length >= GOAL_LENGTH
    ) {
      indexes.push(i);
    }
  }

  if (indexes.length === 0) return;

  let indexesToDelete = Array.from(
    { length: indexes.length + GOAL_LENGTH - 1 },
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

  mainObject.count += (indexes.length - 1 + GOAL_LENGTH) * POINTS_MULTIPLIER;
  // Stop ball placement after the hit is scored
  mainObject.nextRound = false;
}

function checkScore(id) {
  // Pad first row with zero, in order to be able to split cell id, for determining row and col
  const tuple = String(id)
    .padStart(2, '0')
    .split('')
    .map(el => Number(el));
  // Identify row by data from tuple[0]
  const row = Array.from(
    { length: BOARD_LENGTH },
    (_, i) => tuple[0] * BOARD_LENGTH + i
  );
  // Identify column by data from tuple[1]
  const column = Array.from(
    { length: BOARD_LENGTH },
    (_, i) => tuple[1] + i * BOARD_LENGTH
  );
  // Build first diagonal from top left to bottom right direction
  const diagonalFromLeftToRight = pair => {
    let start;
    let step = BOARD_LENGTH + 1;
    if (pair[0] - pair[1] > 0) {
      start = (pair[0] - pair[1]) * BOARD_LENGTH;
    } else if (pair[0] - pair[1] < 0) {
      start = pair[1] - pair[0];
    } else {
      start = 0;
    }

    return Array.from(
      {
        length:
          start < BOARD_LENGTH
            ? BOARD_LENGTH - start
            : (BOARD_LENGTH * BOARD_LENGTH - start) / BOARD_LENGTH,
      },
      (_, i) => start + i * step
    );
  };
  const diagonalTopLeftBottomRight = diagonalFromLeftToRight(tuple);

  // Build second diagonal from top right to bottom left direction
  const diagonalFromRightToLeft = pair => {
    let start;
    let step = BOARD_LENGTH - 1;

    if (pair[0] + pair[1] <= step) {
      start = pair[0] + pair[1];
    } else {
      const calcStart = String(pair[0] + pair[1])
        .split('')
        .map(el => Number(el))
        .reduce((acc, curr) => acc + curr, 0);
      start = Number(calcStart + String(step));
      // console.log(start);
    }

    return Array.from(
      {
        length:
          start < BOARD_LENGTH
            ? start + 1
            : Number(String(start).slice(-1)) -
              Number(String(start).slice(0, 1)) +
              1,
      },
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

  // Logic for determining if score happened or not
  const colorOccurrences = (arr, colorName = colorToMatch) => {
    return arr.filter(el => el === colorName).length;
  };
  // If number of balls of current color >= GOAL_LENGTH in the current row, check if they are consecutive
  if (colorOccurrences(rowMapped) >= GOAL_LENGTH) {
    deleteIfBallsConsecutive(rowMapped, colorToMatch, row);
  }
  // If number of balls of current color >= GOAL_LENGTH in the current column, check if they are consecutive
  if (colorOccurrences(columnMapped) >= GOAL_LENGTH) {
    deleteIfBallsConsecutive(columnMapped, colorToMatch, column);
  }
  // If number of balls of current color >= GOAL_LENGTH in the current TOP L BOTTOM R diagonal, check if they are consecutive
  if (colorOccurrences(lefRigDiagMapped) >= GOAL_LENGTH) {
    deleteIfBallsConsecutive(
      lefRigDiagMapped,
      colorToMatch,
      diagonalTopLeftBottomRight
    );
  }
  // If number of balls of current color >= GOAL_LENGTH in the current TOP R BOTTOM L diagonal, check if they are consecutive

  if (colorOccurrences(rigLefDiagMapped) >= GOAL_LENGTH) {
    deleteIfBallsConsecutive(
      rigLefDiagMapped,
      colorToMatch,
      diagonalTopRightBottomLeft
    );
  }
  updateResult(mainObject.count);
  // ----------------------------------------------------------- //
  // Check if game is over
  const allFields = document.querySelectorAll('.field');
  const unusedFields = Array.from(allFields).filter(
    field => field.innerHTML === ''
  );
  setTimeout(() => {
    if (unusedFields.length === 0 && mainObject.nextRound) {
      gameOver();
    }
  }, 300);
}
// Start the game and hide the button
button.addEventListener('click', function () {
  this.style.display = 'none';
  displayBalls(NUMBER_OF_BALLS);
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

  mainObject.nextRound = true;
  moveBall(e.target.id);
  checkScore(e.target.id);
});
// Close modal
body.addEventListener('click', e => {
  if (!e.target.classList.contains('modal')) return;
  document.querySelector('.modal').remove();
  location.reload();
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

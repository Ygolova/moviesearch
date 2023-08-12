const container = document.querySelector('#grid');
const inputElement = document.querySelector('#search');
const button = document.querySelector('#but');
const containerGrid = document.querySelector('.container-searching');
const sort = document.querySelector('#sort');
const sortDescending = document.querySelector('#sortDescending');
const sortDescendingAlphabet = document.querySelector(
  '#sortDescendingAlphabet'
);
const sortAscending = document.querySelector('#sortAscending');
const sortAscendingAlphabet = document.querySelector('#sortAscendingAlphabet');
const fa = document.querySelector('.fa');
var backgroundSort = document.getElementById('backgroundSort');
const containerSearching = document.querySelector(
  '.container-searching__sort-inner'
);

var startTime = null;
var currentPosition = parseFloat(getComputedStyle(backgroundSort).left);
var targetPosition = 530;
var targetPositionTop = 0;
let lastSortClickTime = 0;
var verification = true;
var duration = 100;

currentPosition = parseFloat(getComputedStyle(backgroundSort).left);

sort.style.left = '0px';

moviesFound = false;

let movies = [];

function printDataInfo() {
  console.log('Movies array:', movies.length);
  console.log('moviesFound:', moviesFound);
}

const getData = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.Search) {
        movies = data.Search.map((movie) => ({
          poster: /^(http|https):\/\//i.test(movie.Poster)
            ? movie.Poster
            : '/assets/img/No-Image-Placeholder.svg',
          year: movie.Year,
          title: movie.Title,
        }));
        return movies;
      } else if (moviesFound === true) {
        container.style = `
  grid-template-columns: repeat(1, 300px);
  `;
        container.innerHTML = 'Ничего не найдено. Попробуйте позже.';
        throw new Error('Movies found');
      } else {
        throw new Error('No movies found');
      }
    });

container.style = `
    grid-template-columns: repeat(1, 300px);
    `;
container.innerHTML = 'Введите название фильма в поисковой строке';

// backgroundSort.style.left = '530px';

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  var progress = timestamp - startTime;

  if (progress < duration) {
    var newPosition =
      currentPosition +
      (targetPosition - currentPosition) * (progress / duration);
    var newPositionTop =
      currentPositionTop +
      (targetPositionTop - currentPositionTop) * (progress / duration);

    backgroundSort.style.left = newPosition + 'px';
    backgroundSort.style.top = newPositionTop + 'px';

    requestAnimationFrame(animate);
  } else {
    backgroundSort.style.left = targetPosition + 'px';
    backgroundSort.style.top = targetPositionTop + 'px';
  }
}

// function xz() {
//   $(document).ready(function () {
//     $('#sort').on('click', function () {
//       $('.sddf').stop(true, true).slideToggle(700);
//     });
//   });
// }

// if (targetPosition == 310) {
// xz()
// }

let checkBackgroundPosition = true;
sort.addEventListener('click', () => {
  sort.classList.toggle('active');

  setTargetPosition();
  updateTargetPositionTop();
  startAnimation();

  if (sort.style.left === '0px') {
    sort.style.left = '-230px';
  } else if (sort.style.left === '-230px') {
    sort.style.left = '0px';
  }

  checkAndAnimatePosition();
});

function checkPosition() {
  if (
    backgroundSort.style.left == '330px' &&
    verification == false &&
    backgroundSort.style.top === '0px'
  ) {
    $('.sorting-container').stop(true, true).slideDown(700);
    backgroundSort.style.display = 'grid';
  } else if (backgroundSort.style.top === '50px' && verification == true) {
    backgroundSort.classList.add('slide');
    backgroundSort.style.left = '530px';
    $('.sorting-container').stop(true, true).slideUp(700);
  } else {
    requestAnimationFrame(checkPosition);
  }
}

inputElement.addEventListener('keypress', (event) => {
  event.key === 'Enter' ? button.click() : '';
});

addEventListener('click', (event) => {
  const currentTime = Date.now();
  if (!containerGrid.contains(event.target)) {
    setDefaultInputValueIfEmpty();
    inputElement.style.width = 'calc(100% - -27px)';
    fa.style.left = '17px';
    if (currentTime - lastSortClickTime >= 1000) {
      sort.classList.remove('active');

      setTargetPosition();
      updateTargetPositionTop();
      toggleSortButtonPosition();
      startAnimation();
      checkAndAnimatePosition();
    }
  }
  lastSortClickTime = currentTime;
});

inputElement.addEventListener('click', () => {
  inputElement.style.width = 'calc(100% - -360px)';
  fa.style.left = '350px';
  if (inputElement.value === 'Поиск фильмов и сериалов') {
    inputElement.value = '';
  }
});

button.addEventListener('click', (event) => {
  const inputValue = inputElement.value;
  moviesFound = true;
  printDataInfo();

  if (inputValue === 'Поиск фильмов и сериалов' || inputValue === '') {
    container.style = `
    grid-template-columns: repeat(1, 300px);
  `;
    container.innerHTML = 'Поле для поиска пустое';
    return;
  }

  getData(`https://www.omdbapi.com/?apikey=18b8609f&s=${inputValue}`)
    .then(() => {
      updateMoviesContainer();
    })
    .catch((err) => {
      movies = [];
      console.log(err);
      printDataInfo();
    });
});

function updateMoviesContainer() {
  content = movies
    .map(({ poster, year, title }) => {
      return `<div class="movie">
        <img class="img" src="${poster}">
        <div class="title">${title}</div>
        <div class="years">${year}</div>
      </div>`;
    })
    .join('');

  container.style = `
    grid-template-columns: repeat(auto-fill, 300px);
  `;
  container.innerHTML = content;

  printDataInfo();
}

sortDescending.addEventListener('click', () => {
  movies.sort((a, b) => b.year - a.year);
  const years = movies.map((movie) => movie.year);
  console.log(years);
  console.log(movies);
  updateMoviesContainer();
  if (movies.length == 0) {
    container.style = `
  grid-template-columns: repeat(1, 300px);
  `;
    container.innerHTML = 'Ничего не найдено. Попробуйте позже.';
  }
});

sortAscending.addEventListener('click', () => {
  movies.sort((a, b) => a.year - b.year);
  const years = movies.map((movie) => movie.year);
  console.log(years);
  console.log(movies);
  updateMoviesContainer();
  if (movies.length == 0) {
    container.style = `
  grid-template-columns: repeat(1, 300px);
  `;
    container.innerHTML = 'Ничего не найдено. Попробуйте позже.';
  }
});

sortDescendingAlphabet.addEventListener('click', () => {
  movies.sort((a, b) => b.title.localeCompare(a.title));
  console.log(movies);
  updateMoviesContainer();
  if (movies.length == 0) {
    container.style = `
  grid-template-columns: repeat(1, 300px);
  `;
    container.innerHTML = 'Ничего не найдено. Попробуйте позже.';
  }
});
sortAscendingAlphabet.addEventListener('click', () => {
  movies.sort((a, b) => a.title.localeCompare(b.title));
  console.log(movies);
  updateMoviesContainer();
  if (movies.length == 0) {
    container.style = `
  grid-template-columns: repeat(1, 300px);
  `;
    container.innerHTML = 'Ничего не найдено. Попробуйте позже.';
  }
});

function setTargetPosition() {
  if (sort.classList.contains('active')) {
    targetPosition = 330;
  } else if (backgroundSort.style.top === '50px') {
    targetPosition = 530;
  }
}
function updateTargetPositionTop() {
  if (targetPosition === 330 && verification === true) {
    targetPositionTop = 0;
    verification = false;
  } else {
    targetPositionTop = 50;
    verification = true;
  }
}
function toggleSortButtonPosition() {
  if (sort.style.left === '-230px') {
    sort.style.left = '0px';
  }
}

function startAnimation() {
  startTime = null;
  currentPosition = parseFloat(getComputedStyle(backgroundSort).left);
  currentPositionTop = parseFloat(getComputedStyle(backgroundSort).top);
  requestAnimationFrame(animate);
}

function checkAndAnimatePosition() {
  if (checkBackgroundPosition === true) {
    checkPosition();
  }
}

function setDefaultInputValueIfEmpty() {
  if (!inputElement.value) {
    inputElement.value = 'Поиск фильмов и сериалов';
  }
}

printDataInfo();

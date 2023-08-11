const container = document.querySelector('#grid');
const inputElement = document.querySelector('#search');
const button = document.querySelector('#but');
const containerGrid = document.querySelector('.container-searching');

const getData = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.Search) {
        const movies = data.Search.map((movie) => ({
          poster: /^(http|https):\/\//i.test(movie.Poster)
            ? movie.Poster
            : '/assets/img/No-Image-Placeholder.svg',
          year: movie.Year,
          title: movie.Title,
        }));
        return movies;
      } else {
        container.style = `
    grid-template-columns: repeat(1, 300px);
        `;
        container.innerHTML = 'Ничего не найдено. Попробуйте позже.';
        throw new Error('No movies found');
      }
    });

addEventListener('click', (event) => {
  if (!containerGrid.contains(event.target)) {
    inputElement.style.width = '285px';

    if (inputElement.value) {
      inputElement.value;
    } else {
      inputElement.value = 'Поиск фильмов и сериалов';
    }
  }
});

inputElement.addEventListener('focus', () => {
  inputElement.style.width = '1200px';
});

inputElement.addEventListener('keypress', (event) => {
  event.key === 'Enter' ? button.click() : '';
});

inputElement.addEventListener('click', () => {
  if (inputElement.value === 'Поиск фильмов и сериалов') {
    inputElement.value = '';
  }
});

button.addEventListener('click', (event) => {
  const inputValue = inputElement.value;
  getData(
    `https://www.omdbapi.com/?apikey=18b8609f&s=${
      inputValue === 'Поиск фильмов и сериалов' || inputValue === ''
        ? 'Spider Man'
        : inputValue
    }`
  )
    .then((movies) => {
      if (movies.length === 0) {
        container.innerHTML = 'Ничего не найдено.';
        return;
      }

      const content = movies
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
    })
    .catch((err) => console.log(err));
});

button.click();

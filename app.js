console.log("app.js loaded");

// Data: each movie has a title, year and genre (category).
let movies = [
  { id: 1, title: "Forrest Gump",          year: 1994, genre: "Drama" },
  { id: 2, title: "Jerry Maguire",         year: 1996, genre: "Sports" },
  { id: 3, title: "Good Will Hunting",     year: 1997, genre: "Drama" },
  { id: 4, title: "Moneyball",             year: 2011, genre: "Sports" },
  { id: 5, title: "The Dark Knight Rises", year: 2012, genre: "Action" },
  { id: 6, title: "Interstellar",          year: 2014, genre: "Sci-Fi" },
  { id: 7, title: "Hacksaw Ridge",         year: 2016, genre: "War" },
];

let nextId = 8;

const movieList = document.querySelector("#movie-list");
const searchInput = document.querySelector("#search");
const genreFilter = document.querySelector("#genre-filter");
const noResults = document.querySelector("#no-results");
const addForm = document.querySelector("#add-movie-form");

function createMovieCard(movie) {
  const li = document.createElement("li");
  li.className = "movie-card";
  li.dataset.id = movie.id;

  const title = document.createElement("h3");
  title.textContent = movie.title;

  const meta = document.createElement("p");
  meta.textContent = movie.year + " · " + movie.genre;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";

  li.appendChild(title);
  li.appendChild(meta);
  li.appendChild(removeBtn);
  return li;
}

function renderMovies(list) {
  movieList.textContent = "";
  list.forEach(function (movie) {
    movieList.appendChild(createMovieCard(movie));
  });
}

// Reads the current filters and shows only the movies that match.
function applyFilters() {
  const text = searchInput.value.trim().toLowerCase();
  const genre = genreFilter.value;

  const filtered = movies.filter(function (movie) {
    const matchesText = movie.title.toLowerCase().includes(text);
    const matchesGenre = genre === "all" || movie.genre === genre;
    return matchesText && matchesGenre;
  });

  renderMovies(filtered);
  noResults.hidden = filtered.length > 0;
}

// Filter as the user types or changes the genre (no reload).
searchInput.addEventListener("input", applyFilters);
genreFilter.addEventListener("change", applyFilters);

// Add a new movie through the same code path as the originals.
addForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.querySelector("#new-title").value.trim();
  const year = document.querySelector("#new-year").value.trim();
  const genre = document.querySelector("#new-genre").value.trim();

  if (title === "" || year === "" || genre === "") {
    return;
  }

  movies.push({ id: nextId, title: title, year: Number(year), genre: genre });
  nextId++;

  addForm.reset();
  applyFilters();
});

// One listener on the whole list handles Remove on every card,
// including cards added later (event delegation).
movieList.addEventListener("click", function (event) {
  if (event.target.matches(".remove-btn")) {
    const card = event.target.closest(".movie-card");
    const id = Number(card.dataset.id);
    movies = movies.filter(function (movie) {
      return movie.id !== id;
    });
    applyFilters();
  }
});

applyFilters();

// ----- Contact form validation -----
const contactForm = document.querySelector("#contact-form");
const contactSuccess = document.querySelector("#contact-success");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");

const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const messageError = document.querySelector("#message-error");

let contactSubmitted = false;

function validateName() {
  if (nameInput.value.trim() === "") {
    nameError.textContent = "Please enter your name.";
    return false;
  }
  nameError.textContent = "";
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (value === "") {
    emailError.textContent = "Please enter your email.";
    return false;
  }
  if (!value.includes("@") || !value.includes(".")) {
    emailError.textContent = "Please enter a valid email address.";
    return false;
  }
  emailError.textContent = "";
  return true;
}

function validateMessage() {
  if (messageInput.value.trim() === "") {
    messageError.textContent = "Please enter a message.";
    return false;
  }
  messageError.textContent = "";
  return true;
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  contactSubmitted = true;

  const okName = validateName();
  const okEmail = validateEmail();
  const okMessage = validateMessage();

  if (okName && okEmail && okMessage) {
    contactSuccess.hidden = false;
    contactForm.reset();
  } else {
    contactSuccess.hidden = true;
  }
});

// After the first submit, clear each message as soon as the field is fixed.
nameInput.addEventListener("input", function () {
  if (contactSubmitted) validateName();
});
emailInput.addEventListener("input", function () {
  if (contactSubmitted) validateEmail();
});
messageInput.addEventListener("input", function () {
  if (contactSubmitted) validateMessage();
});

// ----- Dark mode toggle -----
const themeToggle = document.querySelector("#theme-toggle");

themeToggle.addEventListener("click", function () {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.setAttribute("aria-pressed", isDark);
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
});
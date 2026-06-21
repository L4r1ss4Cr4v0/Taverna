import drinkService from "../../services/drink-service.js";
import countryService from "../../services/country-service.js";
import { createCard, getMe, renderHeader } from "./utils.js";

const catalogContainer = document.querySelector("#drinks-gallery .container");
const carouselInner = document.querySelector(".carousel-inner");
const select = document.querySelector("#select-itens select");

export default async function init() {
  const drinks = await drinkService.getDrinks();
  const countries = await countryService.getCountries();
  const user = getMe();
  renderHeader(user);
  listOptions(countries);
  buildCarousel(drinks);
  renderCatalog(drinks);
  const ctx = document.querySelector("#chart");
  renderChart(ctx);
}

function buildCarousel(drinks) {
  carouselInner.innerHTML = "";

  const firstDrinks = drinks.slice(0, 6);

  for (let i = 0; i < firstDrinks.length; i += 3) {
    const group = firstDrinks.slice(i, i + 3);

    const carouselItem = document.createElement("div");

    carouselItem.className = i === 0 ? "carousel-item active" : "carousel-item";

    const container = document.createElement("div");
    container.className = "container";

    const row = document.createElement("div");
    row.className = "row justify-content-center align-items-center";

    group.forEach((drink) => {
      const col = document.createElement("div");

      col.className = "col-12 col-md-4 carousel-col";
      col.innerHTML = `
      <a href="details.html?id=${drink.id}">
        <div class="drink-carousel-card">
          <img src="${drink.image}" alt="${drink.name}" />
      
          <h5>${drink.name}</h5>
      
          <p>${drink.shortDescription}</p>
        </div>
      </a>
    `;

      row.appendChild(col);
    });

    container.appendChild(row);

    carouselItem.appendChild(container);

    carouselInner.appendChild(carouselItem);
  }
}

function listOptions(countries) {
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.id;
    option.textContent = country.name;
    select.appendChild(option);
  });
}

async function renderCatalog(items) {
  catalogContainer.innerHTML = "";

  if (!catalogContainer) {
    return;
  }

  if (!items || items.length === 0) {
    catalogContainer.className =
      "d-flex justify-content-center py-3 align-items-center h-50";
    catalogContainer.textContent = "Não encontrado";
    return;
  }

  catalogContainer.className = "";

  const row = document.createElement("div");
  row.className = "row pt-5 justify-content-center";

  items.forEach((drink) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-xl-4 d-flex justify-content-center";

    col.innerHTML = createCard(
      drink.name,
      drink.shortDescription,
      drink.difficultyLevel,
      drink.image,
      drink.country.name,
      drink.country.image
    );

    const button = col.querySelector("#details-btn");

    button.addEventListener(
      "click",
      () => (window.location.href = `details.html?id=${drink.id}`)
    );

    const favoriteBtn = col.querySelector(".btn-favorite");

    favoriteBtn.addEventListener("click", () => {
      if (user) {
        window.location.href = "login.html";
        return;
      }

      const icon = favoriteBtn.querySelector("i");
      const isFavorited = icon.classList.contains("bi-heart-fill");

      icon.classList.replace(
        isFavorited ? "bi-heart-fill" : "bi-heart",
        isFavorited ? "bi-heart" : "bi-heart-fill"
      );
      userService.toggleFavorite(userId, id);
    });

    row.appendChild(col);
  });

  catalogContainer.appendChild(row);
}

export async function handleSearch(inputSearch, selectCountry) {
  const drinks = await drinkService.findDrinks(inputSearch, selectCountry);

  renderCatalog(drinks);
}

async function renderChart(chart) {
  const countries = await countryService.getCountries();
  const drinks = await drinkService.getDrinks();

  const countryNames = countries.map((country) => country.name);

  const countDrinksByCountry = drinks.reduce((acc, drink) => {
    const country = drink.country.name;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const countDrinks = countryNames.map(
    (country) => countDrinksByCountry[country] || 0
  );

  new Chart(chart, {
    type: "bar",
    data: {
      labels: countryNames,
      datasets: [
        {
          label: "Número de drinks",
          data: countDrinks,
          borderWidth: 1,
          backgroundColor: "gold",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

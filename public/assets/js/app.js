import DrinkService from "../../services/drink-service.js";

const API_URL_DRINKS = "/drinks";
const API_URL_COUNTRIES = "/countries";
const catalogContainer = document.querySelector("#drinks-gallery .container");
const carouselInner = document.querySelector(".carousel-inner");
const select = document.querySelector("#select-itens select");

export default async function init() {
  const drinks = await DrinkService.getDrinks();
  const countries = await getCountries();
  listOptions(countries);
  buildCarousel(drinks);
  renderCatalog(drinks);
}

async function getCountries() {
  return fetch(`${API_URL_COUNTRIES}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erro ao ler drinks via API JSONServer:", error);
    });
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
      <div class="drink-carousel-card">
        <img src="${drink.image}" alt="${drink.name}" />
    
        <h5>${drink.name}</h5>
    
        <p>${drink.shortDescription}</p>
      </div>
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

    const button = col.querySelector(".drink-card button");

    button.addEventListener(
      "click",
      () => (window.location.href = `details.html?id=${drink.id}`)
    );

    row.appendChild(col);
  });

  catalogContainer.appendChild(row);
}

function createCard(
  name,
  description,
  difficult,
  imgDrink,
  country,
  imgCountry
) {
  const card = `<article class="drink-card">
                    <img src=${imgDrink} alt="Foto do drink ${name}" class="main-img"/>
                    <h3>${name}</h3>
                    <p class="text-light">
                        ${description}
                    </p>
                    <p class="text-light w-auto">
                        Dificuldade: ${difficult} / 5
                    </p>
                    <div>
                      <button
                      class="bg-transparent border border-warning text-light p-2 me-2"
                      type="button"
                    >
                      Ver detalhes
                    </button>
                      <img src=${imgCountry} alt="Bandeira do(a) ${country}}" class="country"/>
                    </div>
                </article>`;

  return card;
}

export async function searchDrinks(text, country) {
  let query = "_expand=country&";
  if (text.length != 0) {
    query += `q=${text}&`;
  }

  if (country != 0) {
    query += `countryId=${country}`;
  }

  const selectedDrinks = await fetch(`${API_URL_DRINKS}?${query}`).then((res) =>
    res.json()
  );

  renderCatalog(selectedDrinks);
}

import drinkService from "../../services/drink-service.js";
import { getMe, renderHeader } from "./utils.js";

const main = document.querySelector("#main-details");

export default async function init() {
  const userId = getMe().id;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) {
    main.style.height = "80vh";
    main.innerText =
      "informe o id na URL da página, de modo que a URL siga o modelo: ...details.html?id={id_do_drink}";
    return;
  }

  const drink = await drinkService.getDrink(id);

  if (!drink) {
    main.style.height = "80vh";
    main.innerText = "Item não existe no catálogo";
    return;
  }

  renderHeader(userId);
  renderDetailsScreen(drink);
}

function listItens(itens, list) {
  itens.forEach((item) => {
    const li = document.createElement("li");
    li.style.textTransform = "capitalize";
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderDetailsScreen(drink) {
  const section = document.querySelector("#drink-details");
  const image = document.querySelector("#details-img");
  const title = `<div class="d-flex align-items-center mb-4 gap-3">
            <h1 id="drink-title">${drink.name}</h1>
            <img
              class="country-details"
              src=${drink.country.image}
              alt="Bandeira do(a) ${drink.country.name}"
            />
          </div>
    
    `;

  image.src = drink.image;

  section.insertAdjacentHTML("afterbegin", title);

  const listTags = document.querySelector("#list-tags");
  listItens(drink.tags, listTags);

  const description = document.querySelector("#description");
  description.classList.add("w-50");
  description.classList.add("mb-4");

  description.textContent = drink.fullDescription;

  const level = document.querySelector("#difficult");
  level.textContent = ` ${drink.difficultyLevel}/5`;

  const listIngredients = document.querySelector("#list-ingredients");
  listItens(drink.recipe.ingredients, listIngredients);

  const listRecipe = document.querySelector("#list-steps");
  listItens(drink.recipe.steps, listRecipe);
}

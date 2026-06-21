import drinkService from "../../services/drink-service.js";
import { getMe, handleToggleFavorite, renderHeader } from "./utils.js";

const main = document.querySelector("#main-details");

export default async function init() {
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

  const user = getMe();

  renderHeader(user);

  renderDetailsScreen(drink, user);
}

function listItens(itens, list) {
  itens.forEach((item) => {
    const li = document.createElement("li");
    li.style.textTransform = "capitalize";
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderDetailsScreen(drink, user = null) {
  const section = document.querySelector("#drink-details");
  const image = document.querySelector("#details-img");

  const isFavorite = user?.favorites?.includes(drink.id);

  const title = `
    <div class="d-flex align-items-center mb-4 gap-3">
      <h1 id="drink-title" class="w-50">${drink.name}</h1>

      ${
        user
          ? `
            <button
              id="favorite-btn"
              class="btn-favorite bg-transparent border-0 p-0"
              type="button"
            >
              <i class="bi ${
                isFavorite ? "bi-heart-fill" : "bi-heart"
              } fs-4 text-danger"></i>
            </button>
          `
          : ""
      }

      <img
        class="country-details"
        src="${drink.country.image}"
        alt="Bandeira do(a) ${drink.country.name}"
      />
    </div>
  `;

  image.src = drink.image;

  section.insertAdjacentHTML("afterbegin", title);

  if (user) {
    const favoriteBtn = document.querySelector("#favorite-btn");

    favoriteBtn.addEventListener("click", async () => {
      await handleToggleFavorite(favoriteBtn, user, drink.id);
    });
  }

  const listTags = document.querySelector("#list-tags");
  listItens(drink.tags, listTags);

  const description = document.querySelector("#description");
  description.classList.add("w-50");
  description.classList.add("mb-4");
  description.textContent = drink.fullDescription;

  const level = document.querySelector("#difficult");
  level.textContent = `${drink.difficultyLevel}/5`;

  const listIngredients = document.querySelector("#list-ingredients");
  listItens(drink.recipe.ingredients, listIngredients);

  const listRecipe = document.querySelector("#list-steps");
  listItens(drink.recipe.steps, listRecipe);
}

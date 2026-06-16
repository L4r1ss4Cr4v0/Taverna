import countryService from "../../services/country-service.js";
import { getMe, renderHeader } from "./utils.js";

export async function createDrink(drink) {
  const countryId = await countryService.findCountry(drink.country.name).id;
  if (!countryId) {
    const newCountry = {
      name: drink.country.name,
      image: drink.country.image,
    };
    countryService.createCountry(newCountry);
  }
}

function middleware(main) {
  const isAdmin = getMe().admin;

  if (!isAdmin) {
    main.style.height = "90vh";
    main.classList.add("d-flex");
    main.classList.add("justify-content-center");
    main.classList.add("align-items-center");
    main.innerHTML =
      "<p>Usuário não possui permissão para acessar essa página</p>";
    return true;
  }
  return false;
}

function renderForm(main) {
  const form = document.createElement("form");

  form.classList.add("w-50");
  form.id = "drink-form";
  form.innerHTML = `    
        <h2 class="mb-4">Cadastro de Drink</h2>

        <div class="row g-3">
          <div class="col-md-12">
            <label for="name" class="form-label">Nome</label>
            <input type="text" class="form-control" id="name" required />
          </div>

          <div class="col-12">
            <label for="shortDescription" class="form-label">
              Descrição Curta
            </label>
            <input
              type="text"
              class="form-control"
              id="shortDescription"
              maxlength="120"
              required
            />
          </div>

          <div class="col-12">
            <label for="fullDescription" class="form-label">
              Descrição Completa
            </label>
            <textarea
              class="form-control"
              id="fullDescription"
              maxlength="200"
              required
            ></textarea>
          </div>

          <div class="col-md-4">
            <label for="image" class="form-label">URL da Imagem</label>
            <input type="url" class="form-control" id="image" required />
          </div>

          <div class="col-md-4">
            <label for="country" class="form-label">País</label>
            <input type="text" class="form-control" id="country" required />
          </div>

          <div class="col-md-4">
            <label for="difficultyLevel" class="form-label">
              Nível de Dificuldade
            </label>
            <input
              type="number"
              min="1"
              max="10"
              class="form-control"
              id="difficultyLevel"
              required
            />
          </div>

          <div class="col-md-12">
            <label for="tags" class="form-label">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              class="form-control"
              id="tags"
              placeholder="rum, hortelã, limão, refrescante"
              required
            />
          </div>

          <div class="col-12">
            <label for="curiosity" class="form-label">Curiosidade</label>
            <textarea
              class="form-control"
              id="curiosity"
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        <h4 class="mt-4">Receita</h4>

        <div class="mb-3">
          <label for="ingredients" class="form-label"> Ingredientes </label>
          <textarea
            class="form-control"
            id="ingredients"
            rows="6"
            placeholder="Um ingrediente por linha"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="preparationSteps" class="form-label">
            Modo de Preparo
          </label>
          <textarea
            class="form-control"
            id="preparationSteps"
            rows="6"
            placeholder="Um passo por linha"
            required
          ></textarea>
        </div>

        <button id="submit-btn" type="submit" class="btn w-100 fw-bold">
          Salvar Drink
        </button>`;

  main.appendChild(form);
}

export default function init() {
  const userId = getMe().id;
  renderHeader(userId);
  const main = document.querySelector("main");

  const isBlocked = middleware(main);
  if (!isBlocked) {
    renderForm(main);

    const form = document.querySelector("#drink-form");

    form.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();
        const name = document.querySelector("#name").value;
        const shortDescription =
          document.querySelector("#shortDescription").value;
        const fullDescription =
          document.querySelector("#fullDescription").value;
        const imageUrl = document.querySelector("#image").value;
        const countryName = document.querySelector("#country").value;
        const difficultyLevel =
          document.querySelector("#difficultyLevel").value;
        const tags = document.querySelector("#tags").value;
        const curiosity = document.querySelector("#curiosity").value;
        const ingredients = document.querySelector("#ingredients").value;
        const steps = document.querySelector("#preparationSteps").value;

        const formatedTags = tags.split(",").map((tag) => tag.trim());
        const formatedIngredients = ingredients
          .split(",")
          .map((ingredient) => ingredient.trim());
        const formatedSteps = steps.split(",").map((step) => step.trim());

        const drink = {
          name: name,
          shortDescription: shortDescription,
          fullDescription: fullDescription,
          image: imageUrl,
          difficultyLevel: difficultyLevel,
          tags: formatedTags,
          country: {
            name: countryName,
          },
          recipe: {
            ingredients: formatedIngredients,
            steps: formatedSteps,
          },
        };

        createDrink(drink);
      }
      // createDrink(
      //   name,
      //   shortDescription,
      //   fullDescription,
      //   imageUrl,
      //   country,
      //   difficultyLevel,
      //   tags,
      //   curiosity,
      //   ingredients,
      //   preparationSteps
      // )
    );
  }
}

import countryService from "../../services/country-service.js";
import drinkService from "../../services/drink-service.js";
import { getMe, notify, renderHeader } from "./utils.js";

let editingDrinkId = null;

async function resolveCountryId(country) {
  const result = await countryService.findCountry(country.name);
  const existingCountry = Array.isArray(result) ? result[0] : result;

  if (existingCountry?.id) {
    return existingCountry.id;
  }

  const createdCountry = await countryService.createCountry({
    name: country.name.toLowerCase(),
    image: country.image,
  });

  if (!createdCountry?.id) {
    throw new Error("Não foi possível obter o id do país.");
  }

  return createdCountry.id;
}

async function buildDrinkPayload(formDrink) {
  const countryId = await resolveCountryId(formDrink.country);

  return {
    name: formDrink.name,
    shortDescription: formDrink.shortDescription,
    fullDescription: formDrink.fullDescription,
    image: formDrink.image,
    difficultyLevel: Number(formDrink.difficultyLevel),
    tags: formDrink.tags,
    countryId,
    recipe: formDrink.recipe,
  };
}

async function createDrink(formDrink) {
  const drink = await buildDrinkPayload(formDrink);
  await drinkService.createDrink(drink);
  notify("Drink criado com sucesso!");
}

async function updateDrink(id, formDrink) {
  const drink = await buildDrinkPayload(formDrink);
  await drinkService.updateDrink(id, drink);
  notify("Drink atualizado com sucesso!");
}

async function deleteDrink(drink) {
  await drinkService.deleteDrink(drink.id);
  notify("Drink excluído com sucesso!");
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

  form.classList.add("w-75");
  form.id = "drink-form";
  form.innerHTML = `    
        <h2 class="mb-3">Cadastro de Drink</h2>

        <div class="row g-2">
          <div class="col-md-5">
            <label for="name" class="form-label">Nome</label>
            <input type="text" class="form-control" id="name" required />
          </div>

          <div class="col-md-4">
            <label for="country" class="form-label">País</label>
            <input type="text" class="form-control text-capitalize" id="country" required />
          </div>

          <div class="col-md-3">
            <label for="difficultyLevel" class="form-label">
              Dificuldade
            </label>
            <input
              type="number"
              min="1"
              max="5"
              class="form-control"
              id="difficultyLevel"
              required
            />
          </div>

          <div class="col-md-12">
            <label for="countryImage" class="form-label">
              URL da Bandeira/Imagem do País
            </label>
            <input
              type="url"
              class="form-control"
              id="countryImage"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="shortDescription" class="form-label">
              Descrição Curta
            </label>
            <input
              type="text"
              class="form-control"
              id="shortDescription"
              maxlength="70"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="image" class="form-label">URL da Imagem</label>
            <input type="url" class="form-control" id="image" required />
          </div>

          <div class="col-md-12">
            <label for="fullDescription" class="form-label">
              Descrição Completa
            </label>
            <textarea
              class="form-control"
              id="fullDescription"
              maxlength="150"
              rows="2"
              required
            ></textarea>
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

          <div class="col-md-6">
            <label for="ingredients" class="form-label"> Ingredientes </label>
            <textarea
              class="form-control"
              id="ingredients"
              rows="3"
              placeholder="Um ingrediente por linha"
              required
            ></textarea>
          </div>

          <div class="col-md-6">
            <label for="preparationSteps" class="form-label">
              Modo de Preparo
            </label>
            <textarea
              class="form-control"
              id="preparationSteps"
              rows="3"
              placeholder="Um passo por linha"
              required
            ></textarea>
          </div>
        </div>

        <div class="d-flex gap-2 mt-3">
          <button id="submit-btn" type="submit" class="btn fw-bold flex-grow-1">Salvar Drink</button>
          <button id="clear-btn" type="button" class="btn btn-outline-light fw-bold">Limpar Campos</button>
        </div>`;

  main.appendChild(form);
}

function getFormDrink() {
  const name = document.querySelector("#name").value;
  const shortDescription = document.querySelector("#shortDescription").value;
  const fullDescription = document.querySelector("#fullDescription").value;
  const image = document.querySelector("#image").value;
  const countryName = document.querySelector("#country").value;
  const countryImage = document.querySelector("#countryImage").value;
  const difficultyLevel = document.querySelector("#difficultyLevel").value;
  const tags = document.querySelector("#tags").value;
  const ingredients = document.querySelector("#ingredients").value;
  const steps = document.querySelector("#preparationSteps").value;

  return {
    name,
    shortDescription,
    fullDescription,
    image,
    difficultyLevel,
    tags: tags.split(",").map((tag) => tag.trim()),
    country: {
      name: countryName,
      image: countryImage,
    },
    recipe: {
      ingredients: ingredients
        .split("\n")
        .map((ingredient) => ingredient.trim())
        .filter((ingredient) => ingredient.length > 0),
      steps: steps
        .split("\n")
        .map((step) => step.trim())
        .filter((step) => step.length > 0),
    },
  };
}

function fillFormWithDrink(drink) {
  document.querySelector("#name").value = drink.name ?? "";
  document.querySelector("#shortDescription").value =
    drink.shortDescription ?? "";
  document.querySelector("#fullDescription").value =
    drink.fullDescription ?? "";
  document.querySelector("#image").value = drink.image ?? "";
  document.querySelector("#country").value = drink.country?.name ?? "";
  document.querySelector("#countryImage").value = drink.country?.image ?? "";
  document.querySelector("#difficultyLevel").value =
    drink.difficultyLevel ?? "";
  document.querySelector("#tags").value = (drink.tags ?? []).join(", ");
  document.querySelector("#ingredients").value = (
    drink.recipe?.ingredients ?? []
  ).join("\n");
  document.querySelector("#preparationSteps").value = (
    drink.recipe?.steps ?? []
  ).join("\n");

  editingDrinkId = drink.id;

  document.querySelector("#submit-btn").textContent = "Alterar";

  document.querySelector("#drink-form").scrollIntoView({ behavior: "smooth" });
}

function clearForm(form) {
  form.reset();
  editingDrinkId = null;
  document.querySelector("#submit-btn").textContent = "Salvar Drink";
}

async function renderTable() {
  const drinks = await drinkService.getDrinks();
  const table = document.querySelector("#table-queixas");
  table.innerHTML = "";

  drinks.forEach((drink) => {
    const imgResumida = drink.image.slice(0, 15) + "...";
    const descResumida = drink.shortDescription.slice(0, 30) + "...";
    const tagsResumida = drink.tags.join(", ");

    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";
    tr.innerHTML = `<td scope="row">${drink.id}</td>
                    <td>${drink.name}</td>
                    <td>${descResumida}</td>
                    <td class="text-capitalize">${
                      drink.country?.name ?? drink.countryId
                    }</td>
                    <td>${drink.difficultyLevel}</td>
                    <td>${tagsResumida}</td>
                    <td>${imgResumida}</td>
                    <td>
                      <button type="button" class="btn btn-sm btn-warning btn-atualizar">Atualizar</button>
                      <button type="button" class="btn btn-sm btn-danger btn-excluir">Excluir</button>
                    </td>`;

    tr.addEventListener("click", () => fillFormWithDrink(drink));

    tr.querySelector(".btn-atualizar").addEventListener("click", (e) => {
      e.stopPropagation();
      fillFormWithDrink(drink);
    });

    tr.querySelector(".btn-excluir").addEventListener("click", async (e) => {
      e.stopPropagation();
      await deleteDrink(drink);
      renderTable();
    });

    table.appendChild(tr);
  });
}

export default async function init() {
  const userId = getMe();
  renderHeader(userId);
  const main = document.querySelector("main");

  const isBlocked = middleware(main);
  if (isBlocked) {
    return;
  }

  renderForm(main);
  await renderTable();

  const form = document.querySelector("#drink-form");
  const clearBtn = document.querySelector("#clear-btn");

  clearBtn.addEventListener("click", () => clearForm(form));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formDrink = getFormDrink();

    try {
      if (editingDrinkId) {
        await updateDrink(editingDrinkId, formDrink);
      } else {
        await createDrink(formDrink);
      }

      clearForm(form);
      await renderTable();
    } catch (error) {
      notify("Erro ao salvar o drink. Tente novamente.");
    }
  });
}

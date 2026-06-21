import drinkService from "../../services/drink-service.js";
import { createCard, getMe, renderHeader } from "./utils.js";

export default async function init() {
  const main = document.querySelector("main");
  const user = getMe();

  if (!user) {
    main.innerHTML =
      "<p>Acesso negado! Você não tem permissão para estar aqui</p>";
  }

  const params = new URLSearchParams(location.search);
  const id = params.get("user");

  if (!id || id != user.id) {
    main.innerHTML =
      "<p>Usuário não identificado! Tente clicar em Dashboard no cabeçalho</p>";
  }

  renderHeader(user);

  renderFavorites(user.favorites, user.id);
}

async function renderFavorites(list = [], userId) {
  const favoriteSection = document.querySelector("#favorite-slider");
  list.forEach(async (id) => {
    const drink = await drinkService.getDrink(id);
    favoriteSection.innerHTML += createCard(
      drink.name,
      drink.shortDescription,
      drink.difficultyLevel,
      drink.image,
      drink.country.name,
      drink.country.image
    );
  });
}

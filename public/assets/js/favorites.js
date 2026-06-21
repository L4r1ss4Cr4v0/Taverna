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

  renderFavorites(user);
}

async function renderFavorites(user) {
  const favoriteSection = document.querySelector("#favorite-slider");

  favoriteSection.innerHTML = "";

  const favs = user.favorites;

  if (favs.length > 0) {
    favoriteSection.classList.remove("d-flex");
    favoriteSection.classList.remove("align-itens-center");
    favoriteSection.classList.remove("justify-content-center");
    for (const id of favs) {
      const drink = await drinkService.getDrink(id);

      favoriteSection.appendChild(
        createCard(drink, user, (card, wasFavorite) => {
          if (wasFavorite) {
            card.remove();
          }
        })
      );
    }
    return;
  }

  favoriteSection.classList.add("d-flex");
  favoriteSection.classList.add("align-itens-center");
  favoriteSection.classList.add("justify-content-center");
  favoriteSection.innerHTML = "<p>Você não possui drinks favoritos</p>";
}

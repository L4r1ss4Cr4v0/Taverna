import userService from "../../services/user_service.js";

export function notify(message) {
  const toast = document.querySelector("#toast-container");
  const toastBody = document.querySelector(".toast-body");

  toast.classList.add("show");
  toastBody.textContent = message;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 8000);
}

export function renderHeader(userId = null) {
  const header = document.createElement("header");
  header.className = "d-flex align-items-center";

  header.innerHTML = `
      <a href="index.html#home">
        <img
          src="./assets/img/TavernaLogo.png"
          alt="Logo da Taverna"
          id="logo"
        />
      </a>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav text-white">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="index.html#home">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="index.html#about">Sobre o projeto</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="index.html#popular-drinks">Drinks Populares</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="index.html#catalog">Catálogo</a>
              </li>
                    ${
                      !userId
                        ? `
                            <a href="forms_user.html" class="btn border border-warning text-light ms-2 rounded-0">Entrar</a>
                        `
                        : ` 
                            <a class="nav-link active" href="favorites.html?user=${userId.id}">Seus Favoritos</a>
                            <a class="nav-link active" href="create_drink.html?user=${userId.id}">Adicionar Drink</a>

                            <button id="logout-btn" class="btn border border-danger text-light ms-2 rounded-0">Sair</button>
              `
                    }
            </ul>
          </div>
        </div>
      </nav>
    `;

  const main = document.querySelector("main");
  main.insertAdjacentElement("beforebegin", header);

  if (userId) {
    const logoutBtn = document.querySelector("#logout-btn");
    logoutBtn.addEventListener("click", () => logout());
  }
}

function logout() {
  sessionStorage.removeItem("currentUser");
  window.location.reload();
  window.location.href = "index.html";
}
export function createCard(drink, user = null, onFavoriteChange = false) {
  const card = document.createElement("article");
  card.classList.add("drink-card");

  const mainImg = document.createElement("img");
  mainImg.src = drink.image;
  mainImg.alt = `Foto do drink ${drink.name}`;
  mainImg.classList.add("main-img");

  card.appendChild(mainImg);

  if (user) {
    const favoriteBtn = document.createElement("button");
    favoriteBtn.type = "button";
    favoriteBtn.className = "btn-favorite bg-transparent border-0 p-0";

    const icon = document.createElement("i");
    icon.className = user.favorites?.includes(drink.id)
      ? "bi bi-heart-fill fs-4 text-danger"
      : "bi bi-heart fs-4 text-danger";

    favoriteBtn.appendChild(icon);
    card.appendChild(favoriteBtn);

    favoriteBtn.addEventListener("click", async () => {
      const wasFavorite = favoriteBtn
        .querySelector("i")
        .classList.contains("bi-heart-fill");

      await handleToggleFavorite(favoriteBtn, user, drink.id);

      if (onFavoriteChange) {
        await onFavoriteChange(card, wasFavorite);
      }
    });
  }

  const title = document.createElement("h4");
  title.textContent = drink.name;

  const description = document.createElement("p");
  description.className = "text-light";
  description.textContent = drink.shortDescription;

  const difficulty = document.createElement("p");
  difficulty.className = "text-light w-auto";
  difficulty.textContent = `Dificuldade: ${drink.difficultyLevel} / 5`;

  card.append(title, description, difficulty);

  const footer = document.createElement("div");

  const detailsBtn = document.createElement("button");
  detailsBtn.type = "button";
  detailsBtn.className =
    "bg-transparent border border-warning text-light p-2 me-2";
  detailsBtn.textContent = "Ver detalhes";

  detailsBtn.addEventListener("click", () => {
    console.log("details");
    window.location.href = `details.html?id=${drink.id}`;
  });

  const countryImg = document.createElement("img");
  countryImg.src = drink.country.image;
  countryImg.alt = `Bandeira do(a) ${drink.country.name}`;
  countryImg.classList.add("country");

  footer.append(detailsBtn, countryImg);
  card.appendChild(footer);

  return card;
}

export function getMe() {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  return user ? user : null;
}

export async function handleToggleFavorite(favoriteBtn, user, drinkId) {
  const icon = favoriteBtn.querySelector("i");

  const isFavorited = icon.classList.contains("bi-heart-fill");

  icon.classList.replace(
    isFavorited ? "bi-heart-fill" : "bi-heart",
    isFavorited ? "bi-heart" : "bi-heart-fill"
  );

  await userService.toggleFavorite(user, drinkId);
}

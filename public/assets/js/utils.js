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
      <nav class="navbar navbar-expand-md navbar-dark">
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
                            <a class="nav-link active" href="favorites.html?user=${userId}">Seus Favoritos</a>
                            <a class="nav-link active" href="create_drink.html?user=${userId}">Adicionar Drink</a>

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
    console.log(logoutBtn);
    logoutBtn.addEventListener("click", () => logout());
  }
}

function logout() {
  sessionStorage.removeItem("currentUser");
  window.location.reload();
  window.location.href = "index.html";
}
export function createCard(
  name,
  description,
  difficult,
  imgDrink,
  country,
  imgCountry
) {
  return `
      <article class="drink-card">
        <img src="${imgDrink}" alt="Foto do drink ${name}" class="main-img"/>
  
        <button class="btn-favorite bg-transparent border-0 p-0" type="button">
          <i class="bi bi-heart fs-4 text-danger"></i>
        </button>
  
        <h3>${name}</h3>
        <p class="text-light">${description}</p>
        <p class="text-light w-auto">Dificuldade: ${difficult} / 5</p>
        <div>
          <button class="bg-transparent border border-warning text-light p-2 me-2" id="details-btn" type="button">
            Ver detalhes
          </button>
          <img src="${imgCountry}" alt="Bandeira do(a) ${country}" class="country"/>
        </div>
      </article>`;
}

export function getMe() {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  return user ? user : null;
}

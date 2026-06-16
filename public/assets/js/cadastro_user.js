import userService from "../../services/user_service.js";
import { notify } from "./utils.js";

export async function addUser(name, pwd) {
  const user = {
    name: name,
    password: pwd,
    admin: false,
    favorites: [],
  };

  const didUserAlreadyExist = await userService.findUser(name);

  if (didUserAlreadyExist.length != 0) {
    notify("Usuário já cadastrado! Tente outro nome");
    return;
  }

  const userCreated = await userService.createUser(user);

  sessionStorage.setItem("currentUser", JSON.stringify(userCreated));

  window.location.href = `favorites.html?user=${userCreated.id}`;
}

export async function login(name, pwd) {
  const user = await userService.findUser(name);

  if (user.length === 0) {
    notify("Usuário não existe. Registre-se primeiro!");
    return;
  }

  if (user[0].password != pwd) {
    notify("Usuário ou senha incorreto! Tente novamente");
    return;
  }

  sessionStorage.setItem("currentUser", JSON.stringify(user[0]));

  window.location.href = `favorites.html?user=${user[0].id}`;
}

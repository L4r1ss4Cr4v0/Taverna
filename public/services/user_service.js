class UserService {
  constructor() {
    this.urlBase = "/users";
  }

  async getUsers() {
    const res = await fetch(this.urlBase);
    return res.json();
  }

  async getUser(id) {
    const res = await fetch(`${this.urlBase}/${id}`);
    return res.json();
  }

  async findUser(name) {
    const res = await fetch(`${this.urlBase}?name=${name}`);
    return res.json();
  }

  async createUser(user) {
    const res = await fetch(this.urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return res.json();
  }

  async updateUser(id, user) {
    const res = await fetch(`${this.urlBase}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return res.json();
  }

  async toggleFavorite(user, drinkId) {
    const favs = user.favorites;
    if (favs.includes(drinkId)) {
      const index = favs.indexOf(drinkId);
      favs.splice(index, 1);
    } else {
      favs.push(drinkId);
    }

    const { id, ...objUser } = user;

    const userUpdated = {
      ...objUser,
      favorites: favs,
    };

    const newUser = await userService.updateUser(id, userUpdated);

    sessionStorage.setItem("currentUser", JSON.stringify(newUser));

    return favs;
  }

  async deleteUser(id) {
    const res = await fetch(`${this.urlBase}/${id}`, {
      method: "DELETE",
    });

    return res.json();
  }
}

const userService = new UserService();

export default userService;

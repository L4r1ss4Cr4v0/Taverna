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

  async toggleFavorite(userId, drinkId) {
    const response = await fetch(`${this.baseUrl}/users/${userId}`);
    const user = await response.json();

    const favorites = user.favorites.includes(drinkId)
      ? user.favorites.filter((id) => id !== drinkId)
      : [...user.favorites, drinkId];

    await fetch(`${this.baseUrl}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorites }),
    });
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

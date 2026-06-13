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
  async createUser(country) {
    const res = await fetch(this.urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(country),
    });

    return res.json();
  }
  async updateUser(id, country) {
    const res = await fetch(`${this.urlBase}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(country),
    });

    return res.json();
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

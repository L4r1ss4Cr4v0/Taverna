class DrinkService {
  constructor() {
    this.urlBase = "/drinks";
  }

  async getDrinks() {
    const res = await fetch(this.urlBase);
    return res.json();
  }
  async getDrink(id) {
    const res = await fetch(`${this.urlBase}/${id}`);
    return res.json();
  }
  async createDrink(drink) {
    const res = await fetch(this.urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(drink),
    });

    return res.json();
  }
  async updateDrink(id, drink) {
    const res = await fetch(`${this.urlBase}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(drink),
    });

    return res.json();
  }
  async deleteDrink(id) {
    const res = await fetch(`${this.urlBase}/${id}`, {
      method: "DELETE",
    });

    return res.json();
  }
}

const drinkService = new DrinkService();

export default drinkService;

class DrinkService {
  constructor() {
    this.urlBase = "/drinks";
  }

  async getDrinks() {
    const res = await fetch(`${this.urlBase}?_expand=country`);
    return res.json();
  }

  async getDrink(id) {
    const res = await fetch(`${this.urlBase}/${id}?_expand=country`);
    return res.json();
  }

  async findDrinks(text, countryId) {
    const params = new URLSearchParams();

    params.append("_expand", "country");

    if (text) {
      params.append("q", text);
    }

    if (countryId != 0) {
      params.append("countryId", countryId);
    }

    console.log(`${this.urlBase}?${params.toString()}`);

    const response = await fetch(`${this.urlBase}?${params.toString()}`);

    return response.json();
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

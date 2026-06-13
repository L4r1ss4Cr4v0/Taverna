class CountryService {
  constructor() {
    this.urlBase = "/countries";
  }

  async getCountries() {
    const res = await fetch(this.urlBase);
    return res.json();
  }
  async getCountry(id) {
    const res = await fetch(`${this.urlBase}/${id}`);
    return res.json();
  }
  async createCountry(country) {
    const res = await fetch(this.urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(country),
    });

    return res.json();
  }
  async updateCountry(id, country) {
    const res = await fetch(`${this.urlBase}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(country),
    });

    return res.json();
  }
  async deleteCountry(id) {
    const res = await fetch(`${this.urlBase}/${id}`, {
      method: "DELETE",
    });

    return res.json();
  }
}

const countryService = new CountryService();

export default countryService;

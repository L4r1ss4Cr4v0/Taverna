import drinkService from "../../services/drink-service.js";

export default async function renderChart(chart) {

  const countries = await getCountries();
  const drinks = await drinkService.getDrinks();

  const countryNames = countries.map((country) => country.name);

  const countDrinksByCountry = drinks.reduce((acc, drink) => {
    const country = drink.country.name;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const countDrinks = countryNames.map(
    (country) => countDrinksByCountry[country] || 0
  );

  new Chart(chart, {
    type: "bar",
    data: {
      labels: countryNames,
      datasets: [
        {
          label: "Número de drinks",
          data: countDrinks,
          borderWidth: 1,
          backgroundColor: "gold",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

(function () {
  const form1 = document.getElementById("form1");
  const answer = document.getElementById("answer");

  form1.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("inp1").value;

    answer.innerHTML = "Loading...";
    fetch(`https://api.restcountries.com/countries/v5?names.common=${query}`, {
      headers: {
        Authorization: "Bearer rc_live_7ec52d516a6d4a8da514dd5341264cb7",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          console.log(json.data.objects);

          const countries = Array.isArray(json.data.objects)
            ? json.data.objects
            : [json.data.objects];

          if (countries.length === 0) {
            answer.innerHTML = "<p>Brak wyników dla podanego zapytania.</p>";
            return;
          }

          let tableHTML = `
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Capital</th>
                  <th>Population</th>
                  <th>Region</th>
                  <th>Subregion</th>
                </tr>
              </thead>
              <tbody>
          `;

          countries.forEach((country) => {
            const name = country.names?.common || "Brak danych";
            const capital = country.capitals?.[0]?.name || "Brak danych";
            const population = country.population
              ? country.population.toLocaleString()
              : "Brak danych";
            const region = country.region || "Brak danych";
            const subregion = country.subregion || "Brak danych";

            tableHTML += `
              <tr>
                <td>${name}</td>
                <td>${capital}</td>
                <td>${population}</td>
                <td>${region}</td>
                <td>${subregion}</td>
              </tr>
            `;
          });

          tableHTML += `
              </tbody>
            </table>
          `;

          answer.innerHTML = tableHTML;
        } else {
          const textError = await response.text();
          throw new Error(`Błąd serwera ${response.status}: ${textError}`);
        }
      })
      .catch((error) => {
        answer.innerHTML =
          "<p style='color: red;'>Wystąpił błąd podczas pobierania danych.</p>";
        console.error(error.message);
      });
  });
})();

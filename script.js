(function () {
  const form1 = document.getElementById("form1");
  const form2 = document.getElementById("form2");
  const form3 = document.getElementById("form3");
  const answer = document.getElementById("answer");

  const apiKey = "rc_live_5210b6adbcf94753b98fcc8bdc71a4c0";

  async function fetchInfo(ccn, row) {
    const existingDetails = row.nextElementSibling;
    if (existingDetails?.classList.contains("country-details-row")) {
      existingDetails.remove();
      return;
    }

    const detailsRow = document.createElement("tr");
    detailsRow.className = "country-details-row";

    const detailsCell = document.createElement("td");
    detailsCell.colSpan = row.cells.length;

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "country-details";
    detailsDiv.textContent = "Loading...";

    detailsCell.appendChild(detailsDiv);
    detailsRow.appendChild(detailsCell);
    row.after(detailsRow);

    try {
      const response = await fetch(
        `https://api.restcountries.com/countries/v5?codes.ccn3=${encodeURIComponent(ccn)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );

      if (!response.ok) {
        const textError = await response.text();
        throw new Error(`Błąd serwera ${response.status}: ${textError}`);
      }

      const json = await response.json();
      const countryData = json.data.objects[0];
      const officialName = countryData.names.official;
      const currency = countryData.currencies[0].name;
      const flag = countryData.flag.url_png;

      detailsDiv.replaceChildren();

      if (flag) {
        const flagImage = document.createElement("img");
        flagImage.src = flag;
        flagImage.alt = `Flaga: ${officialName}`;
        flagImage.className = "country-details__flag";
        detailsDiv.appendChild(flagImage);
      }

      const info = document.createElement("div");
      info.className = "country-details__info";

      const officialParagraph = document.createElement("p");
      const currencyParagraph = document.createElement("p");
      officialParagraph.append("Official name: ", officialName);
      currencyParagraph.append("Currency: ", currency);
      info.append(officialParagraph, currencyParagraph);
      detailsDiv.appendChild(info);
    } catch (error) {
      detailsDiv.textContent = "Nie udało się pobrać dodatkowych informacji.";
      console.error(error.message);
    }
  }

  answer.addEventListener("click", function (e) {
    const row = e.target.closest("tr.country-row");
    if (row) {
      fetchInfo(row.dataset.country, row);
    }
  });

  form1.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("inp1").value;

    answer.innerHTML = "Loading...";
    fetch(`https://api.restcountries.com/countries/v5?names.common=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
              <tr class="country-row" data-country="${country.codes.ccn3}">
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
          '<p class="error-message">Wystąpił błąd podczas pobierania danych.</p>';
        console.error(error.message);
      });
  });

  form2.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("inp2").value;

    answer.innerHTML = "Loading...";
    fetch(`https://api.restcountries.com/countries/v5?capitals=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
                  <th>Languages</th>
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
            var languages = country.languages.length === 0 ? "Brak danych" : "";
            country.languages?.forEach((lang) => {
              languages += `${lang.name}, `;
            });
            languages = languages.slice(0, -2);

            tableHTML += `
              <tr class="country-row" data-country="${country.codes.ccn3}">
                <td>${name}</td>
                <td>${capital}</td>
                <td>${population}</td>
                <td>${region}</td>
                <td>${languages}</td>
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
          '<p class="error-message">Wystąpił błąd podczas pobierania danych.</p>';
        console.error(error.message);
      });
  });

  form3.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("region").value;
    if (query === "") {
      answer.innerHTML = '<p class="error-message">Wybierz region.</p>';
      return;
    }

    answer.innerHTML = "Loading...";
    fetch(`https://api.restcountries.com/countries/v5/region/${query}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
                  <th>Subregion</th>
                </tr>
              </thead>
              <tbody>
          `;

          countries.sort((a, b) => {
            const nameA = a.names?.common || "";
            const nameB = b.names?.common || "";
            return nameA.localeCompare(nameB);
          });

          countries.forEach((country) => {
            const name = country.names?.common || "Brak danych";
            const capital = country.capitals?.[0]?.name || "Brak danych";
            const population = country.population
              ? country.population.toLocaleString()
              : "Brak danych";
            const subregion = country.subregion || "Brak danych";

            tableHTML += `
              <tr class="country-row" data-country="${country.codes.ccn3}">
                <td>${name}</td>
                <td>${capital}</td>
                <td>${population}</td>
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
          '<p class="error-message">Wystąpił błąd podczas pobierania danych.</p>';
        console.error(error.message);
      });
  });
})();

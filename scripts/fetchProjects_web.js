const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRi2Uj_P_OakaICp-PNz5wcAb4A3emJp59kb3TYFCxqx_A012wK3179JgwyboLPcMC6K6xY4dIK_CTm/pub?output=csv";

document.addEventListener("DOMContentLoaded", () => {
  fetch(csvUrl)
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.split("\n").map(row => row.split(","));
      const headers = rows[0];
      const container = document.querySelector(".projects-gallery");

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 5) continue;

        const [stt, title, genre, engine, icon] = row;

        container.innerHTML += `
                    <div class="project-item">
                        <img src="assets/game-icons/${icon}.png" alt="${title}">
                        <p class="project-title">${title}</p>
                        <p class="project-genre">${genre}</p>
                        <p class="project-engine">${engine}</p>
                    </div>
                `;
      }
    })
    .catch(error => {
      console.error("Lỗi khi fetch CSV:", error);
    });
});

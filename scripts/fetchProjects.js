const sheetURL = 'https://docs.google.com/spreadsheets/d/2PACX-1vRi2Uj_P_OakaICp-PNz5wcAb4A3emJp59kb3TYFCxqx_A012wK3179JgwyboLPcMC6K6xY4dIK_CTm/pubhtml'; // Thay YOUR_SHEET_ID

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://docs.google.com/spreadsheets/d/1lVXyVclrvgyTuZIN98NVBBQu2vNEAsmIbBTBRS5mwOI/pub?gid=0&single=true&output=csv")
    .then(response => response.text())
    .then(text => {
      const rows = text.trim().split("\n").map(row => row.split(","));
      const container = document.querySelector('.projects-gallery');
      const headers = rows[0];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const [title, genre, engine, icon] = row;

        const html = `
                    <div class="project-item">
                        <img src="assets/game-icons/${icon}.png" alt="${title}">
                        <p class="project-title">${title}</p>
                        <p class="project-genre">${genre}</p>
                        <p class="project-engine">${engine}</p>
                    </div>`;
        container.innerHTML += html;
      }
    });
});

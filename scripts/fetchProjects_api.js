const API_KEY = '';
const SHEET_ID = '1lVXyVclrvgyTuZIN98NVBBQu2vNEAsmIbBTBRS5mwOI'; // Thay bằng ID của bạn
const SHEET_NAME = 'Projects';

document.addEventListener("DOMContentLoaded", () => {
  fetchSheetData();
});

function fetchSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => renderProjects(data))
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function renderProjects(data) {
  const container = document.querySelector('.projects-gallery');
  if (!container || !data.values || data.values.length < 2) return;

  const [headers, ...rows] = data.values;

  container.innerHTML = ''; // Clear old content

  rows.forEach(row => {
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index] || '';
    });

    container.innerHTML += `
            <div class="project-item">
                <img src="assets/game-icons/${rowData.Icon}.png" alt="${rowData.Title}">
                <p class="project-title">${rowData.Title}</p>
                <p class="project-genre">${rowData.Genre}</p>
                <p class="project-engine">${project.Engine.replace(/^"+|"+$/g, "")}</p>
            </div>
        `;
  });
}

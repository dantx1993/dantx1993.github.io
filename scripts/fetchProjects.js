document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/data/projects.csv")
        .then(res => res.text())
        .then(csvText => {
            const data = parseCSV(csvText);
            renderProjects(data);
        })
        .catch(err => console.error("Lỗi tải CSV:", err));
});

function parseCSV(csvText) {
    const lines = csvText.trim().split("\n");

    const headers = lines[0].split(",").map(h => h.trim());

    const data = lines.slice(1).map(line => {
        const values = [];
        let value = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && line[i + 1] === '"') {
                value += '"';
                i++; // skip the escaped quote
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(value.trim());
                value = '';
            } else {
                value += char;
            }
        }
        values.push(value.trim());

        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = values[i]?.replace(/^"|"$/g, '').trim(); // remove leading/trailing quotes
        });
        return obj;
    });

    return data;
}

function parseCSVLine(line) {
    const regex = /("([^"]|"")*"|[^",\s]+)(?=\s*,|\s*$)/g;
    const matches = [...line.matchAll(regex)].map(match => {
        let val = match[0].trim();
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1).replace(/""/g, '"'); // Escape dấu "
        }
        return val;
    });
    return matches;
}

function renderProjects(projects) {
    const container = document.querySelector(".projects-gallery");
    if (!container) return;

    container.innerHTML = ""; // Xóa cũ

    projects.forEach(project => {
        container.innerHTML += `
      <div class="project-item">
        <img src="assets/game-icons/${project.Icon}.png" alt="${project.Title}">
        <p class="project-title">${project.Title}</p>
        <p class="project-genre">${project.Genre}</p>
        <p class="project-engine">${project.Engine}</p>
      </div>
    `;
    });
}
document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/data/resume.csv")
        .then(res => res.text())
        .then(csvText => {
            const resumeData = parseCSV(csvText);
            renderResume(resumeData);
        })
        .catch(error => console.error("Lỗi tải CSV:", error));
});

function parseCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
        const values = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"' && line[i + 1] === '"') {
                current += '"';
                i++; // Skip escaped quote
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
                values.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }

        values.push(current.trim());

        const row = {};
        headers.forEach((header, i) => {
            row[header.trim()] = values[i] || "";
        });

        return row;
    });
}

function renderResume(data) {
    const container = document.querySelector(".resume-timeline");

    if (!container) return;

    const resumeHTML = data.map(entry => `
        <div class="resume-item">
            <h3>${entry.Company}</h3>
            <span class="type"><strong>${entry.Type}</strong></span>
            <span class="duration">${entry.Duration}</span>
            <p>${entry.Description.replace(/\\n/g, "<br>")}</p>
        </div>
    `).join("");

    container.innerHTML += resumeHTML;
}

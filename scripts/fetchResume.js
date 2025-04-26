import { parseCSV } from './js/csvUtils.js';

document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/data/resume.csv")
        .then(res => res.text())
        .then(csvText => {
            const resumeData = parseCSV(csvText);
            renderResume(resumeData);
        })
        .catch(error => console.error("Lỗi tải CSV:", error));
});

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

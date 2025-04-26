import { parseCSV } from './js/csvUtils.js';

const urlParams = new URLSearchParams(window.location.search);
let highlightParam = urlParams.get("highlight");
let cvParam = getCVParam(window.location.href);
let highlightedIds = highlightParam ? highlightParam.split(",") : [];
let cachedProjects = null;

const viewer = urlParams.get("viewer");

document.addEventListener("DOMContentLoaded", () => {
    const cvButton = document.getElementById('cvDownloadButton');
    const loadingIndicator = document.getElementById('cv-loading');
    if (viewer) {
        if (cvButton) {
            cvButton.style.display = 'none';
        }
        if (loadingIndicator) {
            loadingIndicator.style.display = 'inline-block';
        }
        fetchAndRenderProjects((projects) => {
            renderRegularProjects(projects);
        });
        fetch(`https://script.google.com/macros/s/AKfycbzzXfzMTLpLmlnjg1HNLq6zg0WJJ1B9ZXezlwlIylhVXk9NaO8rlq3-Nzvf-HeDrNNE/exec?viewer=${viewer}`)
            .then(res => res.json())
            .then(config => {
                let finalCvLink = null;
                if (config.cv) {
                    finalCvLink = config.cv;

                    const gDriveMatch = finalCvLink.match(/\/file\/d\/([^/]+)\//);
                    if (gDriveMatch) {
                        const fileId = gDriveMatch[1];
                        finalCvLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
                    }

                    if (cvButton) {
                        cvButton.href = finalCvLink;
                        if (finalCvLink.startsWith('http')) {
                            cvButton.removeAttribute('download');
                        } else {
                            cvButton.setAttribute('download', '');
                        }
                    }
                }

                // Luôn xử lý hiện/hide UI dù có CV hay không
                if (cvButton) {
                    cvButton.style.display = 'inline-block';
                }
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }

                // Xử lý highlight như cũ
                if (config.highlight) {
                    highlightParam = config.highlight;
                    highlightedIds = highlightParam.split(",");
                }

                fetchAndRenderProjects((projects) => {
                    renderFeaturedProjects(projects);
                });
            })
            .catch(err => {
                console.error("Lỗi khi fetch viewer config:", err);
                if (cvButton) {
                    cvButton.style.display = 'inline-block';
                }
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                fetchAndRenderProjects((projects) => {
                    renderFeaturedProjects(projects);
                });
            });
    } else {
        if (cvButton) {
            cvButton.style.display = 'inline-block';
        }
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        highlightedIds = highlightParam ? highlightParam.split(",") : [];
        fetchAndRenderProjects((projects) => {
            renderRegularProjects(projects);
            renderFeaturedProjects(projects);
        });
    }
});

function fetchAndRenderProjects(onCompleted) {
    if (cachedProjects) {
        console.log("cachedProjects != null");
        if (typeof onCompleted === "function") {
            onCompleted(cachedProjects);
        }
    } else {
        console.log("cachedProjects == null");
        fetch("assets/data/projects.csv")
            .then(res => res.text())
            .then(csvText => {
                cachedProjects = parseCSV(csvText);
                if (typeof onCompleted === "function") {
                    onCompleted(cachedProjects);
                }
            })
            .catch(err => console.error("Lỗi tải CSV:", err));
    }

}

function renderFeaturedProjects(projects) {
    const featuredContainer = document.querySelector(".featured-gallery");
    if (!featuredContainer) return;

    const loadingIndicator = document.getElementById('featured-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none'; // Ẩn khi đã load xong
    }

    featuredContainer.innerHTML = "";

    let featuredProjects = [];

    if (highlightedIds.length > 0) {
        featuredProjects = highlightedIds
            .map(icon => projects.find(p => p.Icon === icon))
            .filter(p => p);
    } else {
        featuredProjects = projects
            .filter(p => p.IsHighlight && !isNaN(parseInt(p.IsHighlight)))
            .sort((a, b) => parseInt(a.IsHighlight) - parseInt(b.IsHighlight));
    }

    featuredProjects.forEach(project => {
        const item = createProjectItem(project);
        featuredContainer.appendChild(item);
    });
}

function renderRegularProjects(projects) {
    const regularContainer = document.querySelector(".projects-gallery");
    if (!regularContainer) return;

    regularContainer.innerHTML = "";

    projects.forEach(project => {
        const item = createProjectItem(project);
        regularContainer.appendChild(item);
    });
}

function renderProjects(projects) {
    const featuredContainer = document.querySelector(".featured-gallery");
    const regularContainer = document.querySelector(".projects-gallery");
    if (!featuredContainer || !regularContainer) return;

    featuredContainer.innerHTML = "";
    regularContainer.innerHTML = "";

    let featuredProjects = [];

    // Lọc và sắp xếp các dự án tiêu biểu
    if (highlightedIds.length > 0) {
        featuredProjects = highlightedIds
            .map(icon => projects.find(p => p.Icon === icon))
            .filter(p => p);
    } else {
        featuredProjects = projects
            .filter(p => p.IsHighlight && !isNaN(parseInt(p.IsHighlight)))
            .sort((a, b) => parseInt(a.IsHighlight) - parseInt(b.IsHighlight));
    }

    // Render dự án tiêu biểu
    featuredProjects.forEach(project => {
        const item = createProjectItem(project);
        featuredContainer.appendChild(item);
    });

    // Render dự án thường
    projects.forEach(project => {
        const item = createProjectItem(project);
        regularContainer.appendChild(item);
    });
}

function createProjectItem(project) {
    const item = document.createElement("div");
    item.classList.add("project-item");

    item.innerHTML = `
        <img src="assets/game-icons/${project.Icon}.png" alt="${project.Title}" 
             onerror="this.onerror=null; this.src='assets/game-icons/none.svg';">
        <p class="project-title">${project.Title}</p>
        <p class="project-genre">${project.Genre}</p>
        <p class="project-engine">${project.Engine}</p>
    `;

    item.addEventListener("click", () => {
        const queryParams = [];
        if (cvParam) queryParams.push(`cv=${cvParam}`);
        if (highlightParam) queryParams.push(`highlight=${highlightParam}`);
        if (viewer) queryParams.push(`viewer=${viewer}`);

        const targetUrl = `game-detail.html?id=${encodeURIComponent(project.Icon)}` +
            (queryParams.length > 0 ? `&${queryParams.join("&")}` : "");

        window.location.href = targetUrl;
    });

    return item;
}

function getCVParam(url) {
    const cvMatch = url.match(/[?&]cv=([^&#]*)/);
    let cvParam = null;
    if (cvMatch) {
        cvParam = cvMatch[1];
    }
    return cvParam
}
import { parseCSV } from './js/csvUtils.js';

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("id");

    fetch("assets/data/projects.csv")
        .then(res => res.text())
        .then(csvText => {
            const data = parseCSV(csvText);
            const project = data.find(p => p.Icon === gameId);
            if (project) {
                renderDetail(project);
            } else {
                document.body.innerHTML = "<h2 style='text-align:center; color:white'>Game not found</h2>";
            }
        })
        .catch(err => {
            console.error("Lỗi khi tải CSV:", err);
            document.body.innerHTML = "<h2 style='text-align:center; color:white'>Failed to load game data</h2>";
        });
});

function renderDetail(game) {
    document.getElementById("gameTitle").textContent = game.Title;

    const gameIcon = document.getElementById("gameIcon");
    gameIcon.src = `assets/game-icons/${game.Icon}.png`;
    gameIcon.onerror = function () {
        this.onerror = null;
        this.src = "assets/game-icons/none.svg";
    };

    document.getElementById("gameDescription").innerHTML = game.Description || "No description.";

    // Handle Info
    const timeParts = (game.Time || "").split("|").map(t => t.trim());
    const timeHtml = timeParts.length === 1
        ? `<p><strong>Time:</strong> ${timeParts[0]}</p>`
        : `<p><strong>Time:</strong></p>
       <ul class="responsibility-list">
           ${timeParts.map(t => `<li>${t}</li>`).join("")}
       </ul>`;

    const infoHtml = `
        <p><strong>Technology:</strong> ${game.Technology || "N/A"}</p>
        <p><strong>Work Mode:</strong> ${game.WorkMode || "N/A"}</p>
        ${timeHtml}
        <p><strong>Responsibilities:</strong></p>
        <ul class="responsibility-list">
            ${(game.Responsibilities || "")
            .split("|")
            .map(task => `<li>${task.trim()}</li>`)
            .join("")}
        </ul>
    `;
    document.getElementById("infoContent").innerHTML = infoHtml;

    // Handle image(s)
    const imgList = [];
    if (game.Image) {
        const count = parseInt(game.Image);
        for (let i = 1; i <= count; i++) {
            imgList.push(`assets/game-images/${game.Icon}_${i}.png`);
        }
    }

    let currentIndex = 0;
    const carouselImg = document.getElementById("carouselImage");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function updateCarousel() {
        carouselImg.src = imgList[currentIndex];

        // Ẩn/hiện nút prev
        if (currentIndex === 0) {
            prevBtn.style.visibility = "hidden";
        } else {
            prevBtn.style.visibility = "visible";
        }

        // Ẩn/hiện nút next
        if (currentIndex === imgList.length - 1) {
            nextBtn.style.visibility = "hidden";
        } else {
            nextBtn.style.visibility = "visible";
        }
    }

    if (imgList.length > 0) {
        updateCarousel();
        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
            updateCarousel();
        });
        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % imgList.length;
            updateCarousel();
        });
    } else {
        document.getElementById("imagesTab").style.display = "none";
    }

    const videoList = [];
    if (game.Video) {
        const count = parseInt(game.Video);
        for (let i = 1; i <= count; i++) {
            videoList.push(`assets/game-videos/${game.Icon}_${i}.mp4`);
        }
    }

    let currentVideoIndex = 0;
    const videoEl = document.getElementById("carouselVideo");
    const videoPrevBtn = document.getElementById("videoPrevBtn");
    const videoNextBtn = document.getElementById("videoNextBtn");

    function updateVideoCarousel() {
        videoEl.src = videoList[currentVideoIndex];

        videoPrevBtn.style.visibility = currentVideoIndex === 0 ? "hidden" : "visible";
        videoNextBtn.style.visibility = currentVideoIndex === videoList.length - 1 ? "hidden" : "visible";
    }

    if (videoList.length > 0) {
        updateVideoCarousel();

        if (videoList.length === 1) {
            videoPrevBtn.style.display = "none";
            videoNextBtn.style.display = "none";
        } else {
            videoPrevBtn.addEventListener("click", () => {
                currentVideoIndex = Math.max(0, currentVideoIndex - 1);
                updateVideoCarousel();
            });

            videoNextBtn.addEventListener("click", () => {
                currentVideoIndex = Math.min(videoList.length - 1, currentVideoIndex + 1);
                updateVideoCarousel();
            });
        }
    } else {
        document.getElementById("videosTab").style.display = "none";
    }

    // Handle reference
    if (game.References) {
        const refList = game.References.split(","); // Tách các ref
        refList.forEach(ref => {
            const [text, url] = ref.split("|"); // Tách tên và link
            if (text && url) {
                const a = document.createElement("a");
                a.href = url.trim();
                a.textContent = text.trim();
                a.target = "_blank";
                a.style.display = "block";
                document.getElementById("refLinks").appendChild(a);
            }
        });
    } else {
        document.getElementById("refTab").style.display = "none";
    }

    // Tabs switching
    document.querySelectorAll(".tab-button").forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("tab-" + tab).classList.add("active");
        });
    });
}

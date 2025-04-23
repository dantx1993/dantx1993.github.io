// copy-email.js
const emailText = "dan.tx.work@gmail.com";

// Gắn vào HTML khi trang load
document.addEventListener("DOMContentLoaded", () => {
    const emailContainer = document.getElementById("email");
    if (emailContainer) {
        emailContainer.innerHTML = `<a href="#" class="email-link" onclick="copyEmail(event)">${emailText}</a>`;
    }
});

// Copy khi click
function copyEmail(event) {
    event.preventDefault(); // tránh nhảy top
    navigator.clipboard.writeText(emailText).then(() => {
        alert("Email copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy email:", err);
    });
}

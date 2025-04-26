const backButton = document.getElementById('backButton');
if (backButton) {
    const url = window.location.href;
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);

    const highlightParam = searchParams.get("highlight");
    const viewerParam = searchParams.get("viewer");

    // Giữ nguyên cv=... đã được encode
    const rawCvMatch = url.match(/[?&]cv=([^&#]*)/);
    const rawCvParam = rawCvMatch ? rawCvMatch[1] : null;

    // Tự build lại query string thủ công
    const queryParts = [];
    if (highlightParam) queryParts.push(`highlight=${encodeURIComponent(highlightParam)}`);
    if (rawCvParam) queryParts.push(`cv=${rawCvParam}`);
    if (viewerParam) queryParts.push(`viewer=${viewerParam}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    backButton.href = `index.html${queryString}`;
}
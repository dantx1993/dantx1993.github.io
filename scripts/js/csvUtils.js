// csvUtils.js

export function parseCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());

    return lines.slice(1).map(line => {
        const values = [];
        let value = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && line[i + 1] === '"') {
                value += '"';
                i++; // skip escaped quote
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
}

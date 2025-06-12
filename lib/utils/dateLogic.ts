export function formatDate(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${mm}/${dd}/${yyyy}`
}

export function getSunSat() {
    const today = new Date();

    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay()); // Sunday

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6); // Saturday

    // Optional: zero out time for exact day match
    sunday.setHours(0, 0, 0, 0);
    saturday.setHours(23, 59, 59, 999);

    return { sunday, saturday };
}
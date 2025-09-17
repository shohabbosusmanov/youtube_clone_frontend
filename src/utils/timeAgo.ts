export function timeAgo(dateString: string, locale: string = "en") {
    const now = new Date();
    const date = new Date(dateString);

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const diff = Math.floor(seconds / value);
        if (diff >= 1) {
            const rtf = new Intl.RelativeTimeFormat(locale, {
                numeric: "auto",
            });
            return rtf.format(-diff, unit as Intl.RelativeTimeFormatUnit);
        }
    }

    return "just now";
}

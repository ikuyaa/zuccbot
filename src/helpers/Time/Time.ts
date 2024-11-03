export default class Time {
    public static secs(secs: number) {
        return secs * 1000;
    }

    public static mins(mins: number) {
        return mins * 60000;
    }

    public static hours(hours: number) {
        return hours * 60 * 60 * 1000;
    };

    public static days(days: number) {
        return days * 24 * 60 * 60 * 1000;
    }

    public static weeks(weeks: number) {
        return weeks * 7 * 24 * 60 * 60 * 1000;
    }

    public static months(months: number) {
        return months * 30 * 24 * 60 * 60 * 1000;
    }
}
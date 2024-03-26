import { getMinutes } from "date-fns";

export class DateService {
  static translateDateTime(date: Date): string {
    const now = new Date();

    const minutesDifference = getMinutes(date) - getMinutes(now);
    const hoursDifference = date.getHours() - now.getHours();
    const daysDifference = date.getDate() - now.getDate();

    if (daysDifference > 0) return `${daysDifference} days`;
    if (hoursDifference > 0) return `${hoursDifference} hours`;
    if (minutesDifference > 0) return `${minutesDifference} minutes`;

    return "Just now";
  }
}

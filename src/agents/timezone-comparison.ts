import { FunctionTool } from "llamaindex";
import axios from 'axios';
import { DateTime } from 'luxon';

async function fetchCityTimezone(city: string): Promise<string> {
    try {
        const response = await axios.get(`http://worldtimeapi.org/api/timezone/${city}`);
        return response.data.timezone; // Returns the timezone of the city
    } catch (error: any) {
        throw new Error(`Error fetching timezone for ${city}: ${error.message}`);
    }
}

function getCityTime(timezone: string): DateTime {
    return DateTime.now().setZone(timezone);
}

async function getTimeDifference(city1: string, city2: string): Promise<string> {
    try {
        // Fetch timezones for both cities
        const timezone1 = await fetchCityTimezone(city1);
        const timezone2 = await fetchCityTimezone(city2);

        // Get the current time in both cities
        const city1Time = getCityTime(timezone1);
        const city2Time = getCityTime(timezone2);

        // Calculate the difference in hours and minutes
        const diffInMillis = city1Time.diff(city2Time, ['hours', 'minutes']);
        const hoursDifference = Math.floor(diffInMillis.hours);
        const minutesDifference = Math.abs(diffInMillis.minutes % 60); // Always positive minutes difference

        // Determine the time difference direction (ahead or behind)
        const direction = hoursDifference >= 0 ? "ahead" : "behind";

        const result = `
        The time difference between ${city1} and ${city2} is:
        - ${Math.abs(hoursDifference)} hours and ${minutesDifference} minutes.
        - ${city1} is ${Math.abs(hoursDifference)} hours ${direction} of ${city2}.
        - Current time in ${city1}: ${city1Time.toString()}
        - Current time in ${city2}: ${city2Time.toString()}
        `;

        return result;

    } catch (error: any) {
        return `Error calculating time difference: ${error.message}`;
    }
}

async function compareTimeBetweenCities(city1: string, city2: string): Promise<string> {
    try {
        const result = await getTimeDifference(city1, city2);
        return result;
    } catch (error: any) {
        return `Error calculating time difference: ${error.message}`;
    }
}

compareTimeBetweenCities("America/New_York", "Asia/Tokyo").then(response => console.log(response));

export const timezoneComparisonAgent = FunctionTool.from(
    async ({ city1, city2 }: { city1: string, city2: string }) => {
        try {
            const result = await compareTimeBetweenCities(city1, city2);
            return result;
        } catch (err: any) {
            return `Error while comparing timezones: ${err.message}`;
        }
    },
    {
        name: "timezoneComparisonAgent",
        description: "This agent compares the time difference between two cities based on real-time data.",
        parameters: {
            type: "object",
            properties: {
                city1: {
                    type: "string",
                    description: "First city to compare (e.g., 'America/New_York')",
                },
                city2: {
                    type: "string",
                    description: "Second city to compare (e.g., 'Asia/Tokyo')",
                },
            },
            required: ["city1", "city2"],
        },
    }
);

import { FunctionTool } from "llamaindex";
import axios from "axios";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";

// @ts-ignore
export const getHotelsAgent = FunctionTool.from(
    async ({ location, maxResults = 10 }: { location: string; maxResults?: number }) => {
        try {
            const response = await axios.get(GOOGLE_PLACES_BASE_URL, {
                params: {
                    query: `hotels in ${location}`,
                    type: "lodging",
                    key: GOOGLE_PLACES_API_KEY,
                },
            });

            if (response.data.status !== "OK") {
                throw new Error(`Error: ${response.data.status}`);
            }

            const hotels = response.data.results.slice(0, maxResults).map((hotel: any) => ({
                name: hotel.name,
                address: hotel.formatted_address,
                rating: hotel.rating,
                price_level: hotel.price_level,
                place_id: hotel.place_id,
            }));

            return hotels;
        } catch (error: any) {
            console.log({error})
            return { error: "Failed to fetch hotels", details: error.message };
        }
    },
    {
        name: "getHotelsAgent",
        description: "Fetches hotel details based on a given location using Google Places API.",
        parameters: {
            type: "object",
            properties: {
                location: {
                    type: "string",
                    description: "The city or region to search hotels in (e.g., 'Mumbai').",
                },
                maxResults: {
                    type: "number",
                    description: "The maximum number of hotel results to return (default is 10).",
                },
            },
            required: ["location"],
        },
    }
);

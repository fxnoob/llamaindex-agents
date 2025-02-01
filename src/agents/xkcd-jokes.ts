import { FunctionTool } from "llamaindex";
import fetch from 'node-fetch';

export const getXkcdJoke = FunctionTool.from(
    async ({ dummy }: { dummy: string }): Promise<string> => {
        async function fetchJSON(url: string) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
            return response.json();
        }

        const latestComicUrl = "https://xkcd.com/info.0.json";
        const latestComicData = await fetchJSON(latestComicUrl);
        const maxComicNum = latestComicData.num;
        const randomComicNum = Math.floor(Math.random() * maxComicNum) + 1;
        const randomComicUrl = `https://xkcd.com/${randomComicNum}/info.0.json`;
        const comicData = await fetchJSON(randomComicUrl);

        return `Here's a random XKCD comic for you:\nTitle: ${comicData.title}\nAlt-text: ${comicData.alt}\nImage URL: ${comicData.img}`;
    },
    {
        name: "getXkcdJoke",
        description: "Use this function to fetch a random XKCD comic (joke) from a free third-party API. It returns the title, alt-text, and image URL.",
        parameters: {
            type: "object",
            properties: {
                dummy: {
                    type: "string",
                    description:
                        "This is a placeholder parameter and will be ignored",
                },
            },
            required: ["dummy"],
        },
    }
);


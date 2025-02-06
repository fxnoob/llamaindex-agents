export async function callLLM(promptText: string): Promise<string> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const props = {
        text: promptText,
    };

    const raw = JSON.stringify(props);

    const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    const response = await fetch(`https://api.smrtxt.xyz/vertex`, requestOptions);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data.text;
}

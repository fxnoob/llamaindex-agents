# llamaindex-agents

## Overview

A **non-deterministic CLI tool** that consolidates various dynamic functionalities like database exploration, time zone comparisons, simple math operations, and more. It provides an interactive command-line interface to quickly retrieve information.

## Key Features

- **Database Schema Exploration**: View tables, columns, primary keys, and foreign keys.
- **XKCD Jokes**: Fetch random XKCD jokes with title and alt-text.
- **Number Operations**: Simple arithmetic (addition, division) and number comparisons.
    - *Note*: For basic math, LLMs are overkill—this tool is faster and more efficient.
- **Time Zone Comparisons**: Compare the current time/date across cities or countries.
- **Flexible Queries**: Query various features interactively from the CLI.

## Why You Need It

This tool combines multiple tasks like database inspection, time zone comparisons, and basic operations into one easy-to-use CLI tool, saving time and effort. It’s a more efficient alternative for performing quick math tasks without relying on complex LLMs.

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/fxnoob/llamaindex-agents.git
   cd llamaindex-agents.git
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Run the tool:
   ```bash
   yarn dev
   ```

## Example

```bash
Enter your query (or type 'exit' to quit): which number is bigger 3.11 or 3.9 ?
Response: 3.9 is greater than 3.11
```

**ChatGPT(LLM) Response:**

![ChatGPT Response Image](./llm-response.png)


## License

MIT License






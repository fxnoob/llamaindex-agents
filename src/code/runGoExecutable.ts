import {execSync} from "child_process";
import path from 'path'

export function getGoFunctionSignatures(): string {
    const executablePath = path.join(process.cwd(), "list-all-funcs");
    let result: string = "";
    try {
        result = execSync(executablePath, {encoding: "utf-8"})
    } catch (error) {
        console.error("Error running Go executable:", error);
    }
    return result;
}

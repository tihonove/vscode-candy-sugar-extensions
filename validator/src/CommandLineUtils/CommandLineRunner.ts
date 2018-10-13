/* tslint:disable:no-console */
import { CommandLineArgError } from "./ParseArguments";

export async function runCommandLineApp(entryPoint: () => void | Promise<void>): Promise<void> {
    try {
        await entryPoint();
    } catch (error) {
        if (error instanceof CommandLineArgError) {
            console.log(error.message);
            console.log(error.commandLineUsage);
        } else if (error instanceof Error) {
            console.log("Fatal error");
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

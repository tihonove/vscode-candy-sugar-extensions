/* tslint:disable:no-console */
import { CommandLineArgError } from "./ParseArguments";

export async function runCommandLineApp(entryPoint: () => void | Promise<void>): Promise<void> {
    try {
        await entryPoint();
    } catch (error) {
        if (error instanceof CommandLineArgError) {
            console.error(error.message);
            console.error(error.commandLineUsage);
        } else if (error instanceof Error) {
            console.error("Fatal error");
            console.error(error.message);
        } else {
            console.error(error);
        }
    }
}

import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";

import { SettingsResolver } from "../../server/src/Validator/Settings/SettingsResolver";
import { createDefaultValidator } from "../../server/src/Validator/ValidatorFactory";

import { StaticSugarProjectContext } from "./staticSugarProjectContext";
import { runCommandLineApp } from "./CommandLineUtils/CommandLineRunner";
import { parseArguments } from "./CommandLineUtils/ParseArguments";
import { createReporter } from "./Reporters/ReporterFactory";

async function sugarValidatorEntryPoint(): Promise<void> {
    const options = parseArguments(process.argv);
    const filesToValidate = options.fileGlobs
        .map(fileGlob => glob.sync(fileGlob))
        .reduce((x, y) => x.concat(y), [])
        .map(x => path.resolve(x));

    if (filesToValidate.length === 0) {
        throw new Error("Файлов для проверки не найдено. Проверьте список паттернов.");
    }
    const reporter = createReporter(options.reporter);
    reporter.beginValidate();
    for (const fileToValidate of filesToValidate) {
        const sugarProject = loadProjectBySugarFile(fileToValidate);
        const validator = createDefaultValidator(sugarProject);
        const fileContent = fs.readFileSync(fileToValidate, "utf8");

        const validationResult = validator.validate(
            fileContent,
            await SettingsResolver.resolveSettings(fileToValidate)
        );
        reporter.report(fileToValidate, validationResult);
    }
    reporter.endValidate();
}

function loadProjectBySugarFile(sugarFilePath: string): StaticSugarProjectContext {
    return new StaticSugarProjectContext(findProjectRootBySugarFile(sugarFilePath));
}

function findProjectRootBySugarFile(sugarFilePath: string): string {
    const filename = sugarFilePath;
    return path.dirname(path.dirname(filename));
}

runCommandLineApp(sugarValidatorEntryPoint);

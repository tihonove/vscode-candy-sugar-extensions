import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";

import { createDefaultValidator } from "../../server/src/Validator/ValidatorFactory";

import { runCommandLineApp } from "./CommandLineUtils/CommandLineRunner";
import { parseArguments } from "./CommandLineUtils/ParseArguments";
import { createReporter } from "./Reporters/ReporterFactory";

function sugarValidatorEntryPoint(): void {
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
        const validator = createDefaultValidator();
        const fileContent = fs.readFileSync(fileToValidate, "utf8");
        const validationResult = validator.validate(fileContent);
        reporter.report(fileToValidate, validationResult);
    }
    reporter.endValidate();
}

runCommandLineApp(sugarValidatorEntryPoint);

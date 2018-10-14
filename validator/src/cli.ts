import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";

import { DataSchemaElementNode } from "../../server/src/DataSchema/DataSchemaNode";
import { SchemaRngConverter } from "../../server/src/SchemaParser/SchemaRngConverter";
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
        const validator = createDefaultValidator(findAndParseDataSchema(fileToValidate));
        const fileContent = fs.readFileSync(fileToValidate, "utf8");
        const validationResult = validator.validate(fileContent);
        reporter.report(fileToValidate, validationResult);
    }
    reporter.endValidate();
}

function findAndParseDataSchema(sugarFilePath: string): undefined | DataSchemaElementNode {
    const filename = sugarFilePath;
    const formDirName = path.basename(path.dirname(path.dirname(filename)));
    const schemaFile = path.join(path.dirname(filename), "..", "schemas", formDirName + ".rng.xml");
    const schemaParser = new SchemaRngConverter();
    try {
        const schemaFileContent = fs.readFileSync(schemaFile, "utf8");
        return schemaParser.toDataSchema(schemaFileContent);
    } catch (e) {
        return undefined;
    }
}

runCommandLineApp(sugarValidatorEntryPoint);

/* tslint:disable:no-console */
import { ValidationReportItem } from "../../../server/src/Validator/Validator/SugarValidator";
import { ReporterType } from "../CommandLineUtils/ParseArguments";

interface IReporter {
    beginValidate(): void;
    report(filePath: string, validationResult: ValidationReportItem[]): void;
    endValidate(): void;
}

export function createReporter(reporter: ReporterType): IReporter {
    if (reporter === ReporterType.Text) {
        return new TextReporter();
    } else if (reporter === ReporterType.TeamCity) {
        throw new Error("Teamcity reporter пока не реализован.");
    }
    throw new Error("Not supported reporter type");
}

class TextReporter implements IReporter {
    public beginValidate(): void {
        // no output
    }

    public endValidate(): void {
        // no output
    }

    public report(filePath: string, validationResult: ValidationReportItem[]): void {
        if (validationResult.length === 0) {
            return;
        }
        console.log(filePath);
        for (const validationResultItem of validationResult) {
            console.log(
                `${validationResultItem.ruleName} (${validationResultItem.position.start.line}, ${
                    validationResultItem.position.start.column
                })`
            );
            console.log("  " + validationResultItem.message);
        }
        console.log("");
        console.log("");
    }
}

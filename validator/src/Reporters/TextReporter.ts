import { ValidationReportItem } from "../../../server/src/Validator/Validator/SugarValidator";
import { IReporter } from "./IReporter";

export class TextReporter implements IReporter {
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

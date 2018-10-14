import { ValidationReportItem } from "../../../server/src/Validator/Validator/SugarValidator";

export interface IReporter {
    beginValidate(): void;
    report(filePath: string, validationResult: ValidationReportItem[]): void;
    endValidate(): void;
}

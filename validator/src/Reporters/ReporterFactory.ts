/* tslint:disable:no-console */
import { ValidationReportItem } from "../../../server/src/Validator/Validator/SugarValidator";
import { ReporterType } from "../CommandLineUtils/ParseArguments";

import { IReporter } from "./IReporter";
import { TextReporter } from "./TextReporter";

export function createReporter(reporter: ReporterType): IReporter {
    if (reporter === ReporterType.Text) {
        return new TextReporter();
    } else if (reporter === ReporterType.TeamCity) {
        return new TeamcityReporter();
        throw new Error("Teamcity reporter пока не реализован.");
    }
    throw new Error("Not supported reporter type");
}

class TeamcityReporter implements IReporter {
    public beginValidate(): void {
        this.write("##teamcity[testSuiteStarted name='Sugar Validator']");
    }

    public endValidate(): void {
        this.write("##teamcity[testSuiteFinished name='Sugar Validator']");
    }

    public report(filePath: string, validationResult: ValidationReportItem[]): void {
        const escapeTestName = this.escapeValue(filePath);
        this.write(`##teamcity[testStarted name='${escapeTestName}']`);
        try {
            if (validationResult.length > 0) {
                this.write(
                    `##teamcity[testFailed name='${escapeTestName}' ` +
                        `message='File contains sugar validator violations' details='${this.escapeValue(
                            this.formatErrors(validationResult)
                        )}']`
                );
            }
        } finally {
            this.write(`##teamcity[testFinished name='${this.escapeValue(filePath)}']`);
        }
    }

    private formatErrors(validationResult: ValidationReportItem[]): string {
        return validationResult
            .map(x => `${x.ruleName} (${x.position.start.line}, ${x.position.start.column}) ${x.message}`)
            .join("\n");
    }

    private escapeValue(str: string): string {
        if (!str) {
            return "";
        }
        return str
            .toString()
            .replace(/\x1B.*?m/g, "")
            .replace(/\|/g, "||")
            .replace(/\n/g, "|n")
            .replace(/\r/g, "|r")
            .replace(/\[/g, "|[")
            .replace(/\]/g, "|]")
            .replace(/\u0085/g, "|x")
            .replace(/\u2028/g, "|l")
            .replace(/\u2029/g, "|p")
            .replace(/'/g, "|'");
    }

    private write(message: string): void {
        console.log(message);
    }
}

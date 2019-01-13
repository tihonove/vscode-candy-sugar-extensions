import { pathExists, readJson } from "fs-extra";
import * as path from "path";

import { ValidatorSettings } from "./ValidatorSettings";

export class SettingsResolver {
    public static async resolveSettings(pathToFile: string): Promise<ValidatorSettings> {
        const nearestSugarRcFile = await this.findNearestSugarRc(path.resolve(path.dirname(pathToFile)));
        if (nearestSugarRcFile == undefined) {
            return {};
        }
        return this.resolveSettingsFromFile(nearestSugarRcFile);
    }

    private static async resolveSettingsFromFile(sugarRcFilePath: string): Promise<ValidatorSettings> {
        // tslint:disable no-any no-unsafe-any
        const fileContent: any = await readJson(sugarRcFilePath);
        let rules = this.normalizeRules(fileContent.rules);
        const extendsFiles: string[] = fileContent.extends || [];
        for (const extendFile of extendsFiles) {
            const extendingRules = await this.resolveSettingsFromFile(
                path.join(path.dirname(sugarRcFilePath), extendFile)
            );
            rules = {
                ...rules,
                ...extendingRules,
            };
        }
        return rules;
        // tslint:enable no-any no-unsafe-any
    }

    // tslint:disable-next-line:no-any
    private static normalizeRules(rules: any): ValidatorSettings {
        // tslint:disable no-unsafe-any
        if (rules == undefined || typeof rules !== "object") {
            return {};
        }
        const result: ValidatorSettings = {};
        const ruleNames = Object.keys(rules);
        for (const ruleName of ruleNames) {
            const ruleSetting = rules[ruleName];
            if (Array.isArray(ruleSetting)) {
                // @ts-ignore
                result[ruleName] = ruleSetting;
            }
            if (typeof ruleSetting === "string") {
                // @ts-ignore
                result[ruleName] = [ruleSetting];
            }
        }
        return result;
        // tslint:enable no-unsafe-any
    }

    private static async findNearestSugarRc(startDirectoryName: string): Promise<undefined | string> {
        let currentDir = startDirectoryName;
        while (true) {
            const result = path.join(currentDir, ".sugarrc.json");
            if (await pathExists(result)) {
                return result;
            }
            if (currentDir === path.dirname(currentDir)) {
                return undefined;
            }
            currentDir = path.dirname(currentDir);
        }
    }
}

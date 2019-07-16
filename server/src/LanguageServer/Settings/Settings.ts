import { Connection } from "vscode-languageserver";

import { ISettings } from "./ISettings";

interface SugarExtensionsSettings {
    showTypeUsageInfoAsCodeLens: boolean;
}

export class Settings implements ISettings {
    private readonly connection: Connection;

    public constructor(connection: Connection) {
        this.connection = connection;
    }

    public async getShowTypeUsageInfoAsCodeLens(): Promise<boolean> {
        const settings = await this.getSugarExtensionsSettings();
        return settings.showTypeUsageInfoAsCodeLens;
    }

    private async getSugarExtensionsSettings(): Promise<SugarExtensionsSettings> {
        return this.connection.workspace.getConfiguration({
            section: "candySugarExtension",
        });
    }
}

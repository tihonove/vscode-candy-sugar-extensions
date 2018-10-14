import { RemoteConsole } from "vscode-languageserver";

export interface ILogger {
    info(message: string): void;
}

export class VsCodeServerLogger implements ILogger {
    private readonly remoteConsole: RemoteConsole;
    private readonly showLogs: boolean;

    public constructor(remoteConsole: RemoteConsole) {
        this.remoteConsole = remoteConsole;
        this.showLogs = false;
    }

    public info(message: string): void {
        if (this.showLogs) {
            this.remoteConsole.log(message);
        }
    }
}

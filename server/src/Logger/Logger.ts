import { RemoteConsole } from "vscode-languageserver";

export interface ILogger {
    info(message: string): void;
}

export class VsCodeServerLogger implements ILogger {
    private readonly remoteConsole: RemoteConsole;

    public constructor(remoteConsole: RemoteConsole) {
        this.remoteConsole = remoteConsole;
    }

    public info(message: string): void {
        this.remoteConsole.log(message);
    }
}

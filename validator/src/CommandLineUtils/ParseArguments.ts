import commandLineArgs from "command-line-args";
import commandLineUsage, { OptionDefinition, Section } from "command-line-usage";

export enum ReporterType {
    TeamCity = "TeamCity",
    Text = "Text",
}

interface Options {
    fileGlobs: string[];
    reporter: ReporterType;
}

export class CommandLineArgError extends Error {
    public readonly commandLineUsage: undefined | string;

    public constructor(message: undefined | string, commandLineUsage?: string) {
        super(message);
        this.commandLineUsage = commandLineUsage;
    }
}
const optionList: OptionDefinition[] = [
    {
        name: "help",
        alias: "h",
        type: Boolean,
        defaultValue: false,
        description: "Выводит данную справку",
        typeLabel: "",
    },
    {
        name: "files",
        alias: "f",
        type: String,
        multiple: true,
        defaultOption: true,
        defaultValue: [],
        description: "Список шаблонов файлов, которые должны быть провалидированы (например, forms/**/*.sugar.xml).",
        typeLabel: "[glob]",
    },
    {
        name: "reporter",
        alias: "r",
        type: String,
        multiple: false,
        defaultValue: "text",
        description: "Указывает, в каком формате выводить найденные ошибки. (default: text)",
        typeLabel: "[text|teamcity]",
    },
];

const optionsUsage: Section[] = [
    {
        header: "sugar-validator",
        content: "Инструмент для валидации сахара.",
    },
    {
        header: "Использование",
        content: "sugar-validator [options...] fileGlob1 fileGlob2 ...",
    },
    {
        header: "Параметры",
        optionList: optionList,
    },
];

export function parseArguments(argv: string[]): Options {
    try {
        const parsedOptions = commandLineArgs(optionList, { argv: argv });
        if (parsedOptions.help) {
            throw new CommandLineArgError(undefined, commandLineUsage(optionsUsage));
        }
        // tslint:disable-next-line no-unsafe-any
        const reporterFromOptions: string = parsedOptions.reporter;
        // tslint:disable-next-line no-unsafe-any
        const filesFromOptions: string[] = parsedOptions.files;

        let reporter: ReporterType;
        if (reporterFromOptions.toLowerCase() === "text") {
            reporter = ReporterType.Text;
        } else if (reporterFromOptions.toLowerCase() === "teamcity") {
            reporter = ReporterType.TeamCity;
        } else {
            throw new Error(
                `Неизвестный тип reporter-а: '${parsedOptions.reporter}'. Возможные значения: text, teamcity`
            );
        }
        return {
            fileGlobs: filesFromOptions,
            reporter: reporter,
        };
    } catch (e) {
        // tslint:disable-next-line no-unsafe-any
        throw new CommandLineArgError(e.message, commandLineUsage(optionsUsage));
    }
}

import { config, exec, popd, pushd } from "shelljs";

import { sugarElementsGroups } from "../server/src/SugarElements/DefaultSugarElementInfos/DefaultSugarElementsGrouped";

import { SugarDocumentationGenerator } from "./src/SugarDocumentationGenerator";

config.fatal = true;

function entryPoint(argv: string[]): void {
    const outDir = argv[1];
    const docsGenerator = new SugarDocumentationGenerator(outDir);
    docsGenerator.generateGroups(sugarElementsGroups);
    if (argv[2] === "--publish" || argv[2] === "-p") {
        pushd(outDir);
        try {
            exec("git add -A");
            exec('git commit -m "Update docs"');
            exec("git push origin master");
        } finally {
            popd();
        }
    }
}

entryPoint(process.argv.slice(2));

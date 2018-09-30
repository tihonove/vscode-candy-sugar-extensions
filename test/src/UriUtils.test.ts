import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { UriUtils } from "../../server/src/UriUtils";

@suite
export class UriUtilsTest {
    @test
    public testToFileName(): void {
        const uri = "file:///c%3A/Utils/new.file.sugar.xml";
        expect(UriUtils.toFileName(uri)).to.eql("c:\\Utils\\new.file.sugar.xml");
    }

    @test
    public testToUri(): void {
        const filename = "c:\\Utils\\new.file.sugar.xml";
        expect(UriUtils.fileNameToUri(filename)).to.eql("file:///c%3A/Utils/new.file.sugar.xml");
    }

    @test
    public testJoin(): void {
        const uri = "file:///c%3A/Utils/some/dir";
        expect(UriUtils.join(uri, "..", "..", "another", "cat")).to.eql("file:///c%3A/Utils/another/cat");
    }

    @test
    public testDirName(): void {
        const uri = "file:///c%3A/Utils/some/dir";
        expect(UriUtils.dirname(uri)).to.eql("file:///c%3A/Utils/some");
    }
}

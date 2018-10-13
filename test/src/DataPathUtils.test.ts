import { suite, test } from "mocha-typescript";

import { DataPathUtils } from "../../server/src/DataSchema/DataPathUtils";

import { expect } from "./Utils/Expect";

@suite
export class DataPathUtilsTest {
    @test
    public joinTwoSimplePaths(): void {
        expect(DataPathUtils.joinDataPaths(["a"], ["b"])).to.eql(["a", "b"]);
    }

    @test
    public joinTwoPathWithAbsoluteOnRight(): void {
        expect(DataPathUtils.joinDataPaths(["a"], ["", "b"])).to.eql(["", "b"]);
    }

    @test
    public joinTwoAbsolutePathOnRight(): void {
        expect(DataPathUtils.joinDataPaths(["", "a"], ["", "b"])).to.eql(["", "b"]);
    }

    @test
    public joinPathWithGoUp(): void {
        expect(DataPathUtils.joinDataPaths(["a"], ["..", "b"])).to.eql(["b"]);
        expect(DataPathUtils.joinDataPaths(["a"], ["c", "..", "b"])).to.eql(["a", "b"]);
        expect(DataPathUtils.joinDataPaths(["a", "c"], ["..", "b"])).to.eql(["a", "b"]);
        expect(DataPathUtils.joinDataPaths(["a", "c"], [".."])).to.eql(["a"]);
        expect(DataPathUtils.joinDataPaths(["a", "c"], ["..", ".."])).to.eql([]);
    }
}

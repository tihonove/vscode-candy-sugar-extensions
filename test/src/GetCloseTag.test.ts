import { suite, test } from "mocha-typescript";

import { getCloseTag } from "../../client/src/GetCloseTag";

import { expect } from "./Utils/Expect";

@suite
export class GetCloseTagTest {
    @test
    public testSimpleCase(): void {
        expect(getCloseTag("<page></", [])).to.eql("page>");
    }

    @test
    public testReproduce(): void {
        expect(
            getCloseTag(
                `
<form>
    <page>
        <text
            fetchfn="formsclientinfo_inn"
            type="inn_fl"
            requisite="true"
            disabled="true"
        ></`,
                []
            )
        ).to.eql("text>");
    }

    @test
    public testReproduce2(): void {
        expect(
            getCloseTag(
                `
<form>
    <page>
        <text
            a="formsclient"
            type="innfl"
            requisite="true"
            disabled="true"
        />
    </`,
                []
            )
        ).to.eql("page>");
    }
}

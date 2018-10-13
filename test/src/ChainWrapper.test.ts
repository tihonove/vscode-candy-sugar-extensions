import { suite, test } from "mocha-typescript";

import { oc } from "../../server/src/Utils/ChainWrapper";

import { expect } from "./Utils/Expect";

interface Zzz {
    qxx?: { z1: number };
}

@suite
export class ChainWrapperTest {
    @test
    public test01(): void {
        const a: Zzz = {};
        expect(
            oc(a)
                .with(x => x.qxx)
                .with(x => x.z1)
                .return(x => x, 2)
        ).to.equal(2);
    }

    @test
    public test02(): void {
        const a: Zzz = { qxx: { z1: 1 } };
        expect(
            oc(a)
                .with(x => x.qxx)
                .with(x => x.z1)
                .if(() => false)
                .return(x => x, 2)
        ).to.equal(2);
    }
}

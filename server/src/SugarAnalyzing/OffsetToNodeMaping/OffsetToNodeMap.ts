import { CodePosition } from "../../Utils/PegJSUtils/Types";

import { NodeWithDefinition } from "./OffsetToNodeMapBuilder";

class PositionUtils {
    public static includes(position: CodePosition, offset: number): boolean {
        return position.start.offset <= offset && offset <= position.end.offset;
    }
}

export class OffsetToNodeMap {
    private readonly nodes: NodeWithDefinition[];

    public constructor(nodes: NodeWithDefinition[]) {
        this.nodes = nodes;
    }

    public getNodeByOffset(offset: number): undefined | NodeWithDefinition {
        return this.nodes.find(x => PositionUtils.includes(x.position, offset));
    }
}

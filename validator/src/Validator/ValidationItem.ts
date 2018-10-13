import { CodePosition } from "../../../server/src/PegJSUtils/Types";

export interface ValidationItem {
    position: CodePosition;
    message: string;
}

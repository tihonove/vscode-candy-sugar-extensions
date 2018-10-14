export interface CodeLocation {
    offset: number;
    line: number;
    column: number;
}

export interface CodePosition {
    start: CodeLocation;
    end: CodeLocation;
}

export enum RuleAction {
    Match = "rule.match",
    Enter = "rule.enter",
    Fail = "rule.fail",
}

export interface TraceContext {
    type: RuleAction;
    rule: string;
    location: CodePosition;
    // tslint:disable-next-line no-any
    result: any;
}

export interface IPegJSTracer {
    trace(context: TraceContext): void;
}

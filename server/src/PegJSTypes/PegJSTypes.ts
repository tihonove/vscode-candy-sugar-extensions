export interface CodeLocation {
    offset: number;
    line: number;
    column: number;
}

export interface CodePosition {
    start: CodeLocation;
    end: CodeLocation;
}

export interface TraceContext {
    type: "rule.match" | "rule.fail" | "rule.enter";
    rule: string;
    location: CodePosition;
    // tslint:disable-next-line no-any
    result: any;
}

export interface IPegJSTracer {
    trace(context: TraceContext): void;
}

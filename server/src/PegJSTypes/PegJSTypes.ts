export interface CodeLocation {
    offset: number;
    line: number;
    column: number;
}

export interface TraceContext {
    type: "rule.match" | "rule.fail" | "rule.enter";
    rule: string;
    location: { start: CodeLocation; end: CodeLocation };
    // tslint:disable-next-line no-any
    result: any;
}

export interface IPegJSTracer {
    trace(context: TraceContext): void;
}

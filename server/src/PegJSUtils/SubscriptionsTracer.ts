import { CodePosition, IPegJSTracer, RuleAction, TraceContext } from "./Types";

export type RuleHandler<TResult> = (result: TResult, location: CodePosition, action: RuleAction) => void;

export class SubscriptionsTracer implements IPegJSTracer {
    private readonly handlers: {
        [ruleName: string]: undefined | { [value in RuleAction]?: RuleHandler<any> };
    } = {};

    protected register<TResult>(action: RuleAction, ruleName: string, handler: RuleHandler<TResult>): void {
        let handlerMap = this.handlers[ruleName];
        if (handlerMap == undefined) {
            handlerMap = {};
            this.handlers[ruleName] = handlerMap;
        }
        handlerMap[action] = handler;
    }

    public trace(context: TraceContext): void {
        const handlerMap = this.handlers[context.rule];
        if (handlerMap != undefined) {
            const handler = handlerMap[context.type];
            if (handler != undefined) {
                handler(context.result, context.location, context.type);
            }
        }
    }
}

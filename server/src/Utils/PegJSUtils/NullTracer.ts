import { IPegJSTracer, TraceContext } from "./Types";

export class NullTracer implements IPegJSTracer {
    public trace(_context: TraceContext): void {
        // Пустая реализация
    }
}

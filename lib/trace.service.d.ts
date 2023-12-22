import { Span, Tracer } from 'dd-trace';
export declare class TraceService {
    getTracer(): Tracer;
    getActiveSpan(): Span | null;
}

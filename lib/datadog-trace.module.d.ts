import { DynamicModule } from '@nestjs/common';
export declare class DatadogTraceModule {
    static forRoot(options?: {
        controllers?: boolean;
        providers?: boolean;
    }): DynamicModule;
    private static buildInjectors;
}

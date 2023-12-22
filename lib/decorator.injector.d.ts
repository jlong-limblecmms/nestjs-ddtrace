import { ModulesContainer } from '@nestjs/core';
import { Injector } from './injector.interface';
export declare class DecoratorInjector implements Injector {
    private readonly modulesContainer;
    private readonly metadataScanner;
    private readonly logger;
    constructor(modulesContainer: ModulesContainer);
    inject(options: {
        controllers?: boolean;
        providers?: boolean;
    }): void;
    private isDecorated;
    private isAffected;
    private getSpanName;
    private static recordException;
    private injectProviders;
    private injectControllers;
    private wrap;
    private getControllers;
    private getProviders;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DecoratorInjector_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoratorInjector = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const core_1 = require("@nestjs/core");
const dd_trace_1 = require("dd-trace");
let DecoratorInjector = DecoratorInjector_1 = class DecoratorInjector {
    constructor(modulesContainer) {
        this.modulesContainer = modulesContainer;
        this.metadataScanner = new core_1.MetadataScanner();
        this.logger = new common_1.Logger();
    }
    inject(options) {
        this.injectProviders(options.providers);
        this.injectControllers(options.controllers);
    }
    isDecorated(prototype) {
        return Reflect.hasMetadata(constants_1.Constants.SPAN_METADATA, prototype);
    }
    isAffected(prototype) {
        return Reflect.hasMetadata(constants_1.Constants.SPAN_METADATA_ACTIVE, prototype);
    }
    getSpanName(prototype) {
        return Reflect.getMetadata(constants_1.Constants.SPAN_METADATA, prototype);
    }
    static recordException(error, span) {
        span.setTag('error', error);
        throw error;
    }
    injectProviders(injectAll) {
        const providers = this.getProviders();
        for (const provider of providers) {
            if (injectAll) {
                Reflect.defineMetadata(constants_1.Constants.SPAN_METADATA, 1, provider.metatype);
            }
            const isProviderDecorated = this.isDecorated(provider.metatype);
            const methodNames = this.metadataScanner.getAllFilteredMethodNames(provider.metatype.prototype);
            for (const methodName of methodNames) {
                const method = provider.metatype.prototype[methodName];
                if ((isProviderDecorated && !this.isAffected(method)) || (this.isDecorated(method) && !this.isAffected(method))) {
                    const spanName = this.getSpanName(method) || `${provider.name}.${methodName}`;
                    provider.metatype.prototype[methodName] = this.wrap(method, spanName);
                    this.logger.log(`Mapped ${provider.name}.${methodName}`, this.constructor.name);
                }
            }
        }
    }
    injectControllers(injectAll) {
        const controllers = this.getControllers();
        for (const controller of controllers) {
            if (injectAll) {
                Reflect.defineMetadata(constants_1.Constants.SPAN_METADATA, 1, controller.metatype);
            }
            const isControllerDecorated = this.isDecorated(controller.metatype);
            const methodNames = this.metadataScanner.getAllFilteredMethodNames(controller.metatype.prototype);
            for (const methodName of methodNames) {
                const method = controller.metatype.prototype[methodName];
                if ((isControllerDecorated && !this.isAffected(method)) || (this.isDecorated(method) && !this.isAffected(method))) {
                    const spanName = this.getSpanName(method) || `${controller.name}.${methodName}`;
                    controller.metatype.prototype[methodName] = this.wrap(method, spanName);
                    this.logger.log(`Mapped ${controller.name}.${methodName}`, this.constructor.name);
                }
            }
        }
    }
    wrap(prototype, spanName) {
        const method = {
            [prototype.name]: function (...args) {
                const activeSpan = dd_trace_1.default.scope().active();
                const span = dd_trace_1.default.startSpan(spanName, { childOf: activeSpan });
                return dd_trace_1.default.scope().activate(span, () => {
                    if (prototype.constructor.name === 'AsyncFunction') {
                        return prototype
                            .apply(this, args)
                            .catch(error => {
                            DecoratorInjector_1.recordException(error, span);
                        })
                            .finally(() => span.finish());
                    }
                    else {
                        try {
                            const result = prototype.apply(this, args);
                            return result;
                        }
                        catch (error) {
                            DecoratorInjector_1.recordException(error, span);
                        }
                        finally {
                            span.finish();
                        }
                    }
                });
            }
        }[prototype.name];
        Reflect.defineMetadata(constants_1.Constants.SPAN_METADATA_ACTIVE, 1, prototype);
        const source = prototype;
        const keys = Reflect.getMetadataKeys(source);
        for (const key of keys) {
            const meta = Reflect.getMetadata(key, source);
            Reflect.defineMetadata(key, meta, method);
        }
        return method;
    }
    *getControllers() {
        var _a;
        for (const module of this.modulesContainer.values()) {
            for (const controller of module.controllers.values()) {
                if (controller && ((_a = controller.metatype) === null || _a === void 0 ? void 0 : _a.prototype)) {
                    yield controller;
                }
            }
        }
    }
    *getProviders() {
        var _a;
        for (const module of this.modulesContainer.values()) {
            for (const provider of module.providers.values()) {
                if (provider && ((_a = provider.metatype) === null || _a === void 0 ? void 0 : _a.prototype)) {
                    yield provider;
                }
            }
        }
    }
};
DecoratorInjector = DecoratorInjector_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.ModulesContainer])
], DecoratorInjector);
exports.DecoratorInjector = DecoratorInjector;
//# sourceMappingURL=decorator.injector.js.map
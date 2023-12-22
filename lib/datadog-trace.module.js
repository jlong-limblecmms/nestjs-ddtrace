"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var DatadogTraceModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatadogTraceModule = void 0;
const common_1 = require("@nestjs/common");
const trace_service_1 = require("./trace.service");
const decorator_injector_1 = require("./decorator.injector");
const constants_1 = require("./constants");
let DatadogTraceModule = DatadogTraceModule_1 = class DatadogTraceModule {
    static forRoot(options = {}) {
        return {
            global: true,
            module: DatadogTraceModule_1,
            providers: [trace_service_1.TraceService, decorator_injector_1.DecoratorInjector, this.buildInjectors(options)],
            exports: [trace_service_1.TraceService]
        };
    }
    static buildInjectors(options) {
        return {
            provide: constants_1.Constants.TRACE_INJECTORS,
            useFactory: async (...injectors) => {
                var e_1, _a;
                try {
                    for (var injectors_1 = __asyncValues(injectors), injectors_1_1; injectors_1_1 = await injectors_1.next(), !injectors_1_1.done;) {
                        const injector = injectors_1_1.value;
                        if (injector.inject)
                            await injector.inject(options);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (injectors_1_1 && !injectors_1_1.done && (_a = injectors_1.return)) await _a.call(injectors_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            },
            inject: [decorator_injector_1.DecoratorInjector]
        };
    }
};
DatadogTraceModule = DatadogTraceModule_1 = __decorate([
    (0, common_1.Module)({})
], DatadogTraceModule);
exports.DatadogTraceModule = DatadogTraceModule;
//# sourceMappingURL=datadog-trace.module.js.map
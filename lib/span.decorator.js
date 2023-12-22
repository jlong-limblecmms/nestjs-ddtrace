"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Span = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const Span = (name) => (0, common_1.SetMetadata)(constants_1.Constants.SPAN_METADATA, name);
exports.Span = Span;
//# sourceMappingURL=span.decorator.js.map
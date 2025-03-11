"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    username: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
    firstname: zod_1.default.string(),
    lastname: zod_1.default.string(),
    mobile: zod_1.default.number().int(),
});
exports.signinSchema = zod_1.default.object({
    mobile: zod_1.default.number().int().optional(),
    email: zod_1.default.string().email().optional(),
    password: zod_1.default.string()
});
exports.metadataSchema = zod_1.default.object({
    firstname: zod_1.default.string().optional(),
    lastname: zod_1.default.string().optional(),
    password: zod_1.default.string().optional()
});

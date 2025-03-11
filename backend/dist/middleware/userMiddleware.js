"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = userMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const db_1 = require("../db/db");
function userMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            res.status(400).json({
                msg: 'no token provided'
            });
            return;
        }
        const validate = yield jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (!validate) {
            res.status(400).json({
                msg: "invalid token"
            });
            return;
        }
        try {
            const userDetails = yield db_1.userModel.findOne({ mobile: validate.mobile });
            if (!userDetails) {
                res.status(400).json({
                    msg: "user not found"
                });
                return;
            }
            req.userId = userDetails._id.toString();
            next();
        }
        catch (e) {
            res.status(400).json({
                error: e.message
            });
        }
    });
}

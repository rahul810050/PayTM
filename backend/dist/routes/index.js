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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const types_1 = require("../types");
const db_1 = require("../db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
exports.router = express_1.default.Router();
exports.router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.signinSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            msg: "Invalid credentials"
        });
        return;
    }
    try {
        const user = yield db_1.userModel.findOne({
            email: parsedData === null || parsedData === void 0 ? void 0 : parsedData.data.email,
            mobile: parsedData === null || parsedData === void 0 ? void 0 : parsedData.data.mobile
        });
        if (!user || !user.password) {
            res.status(400).json({
                msg: "user does not exist"
            });
            return;
        }
        const isCorrectPass = yield bcrypt_1.default.compare(parsedData.data.password, user.password);
        if (!isCorrectPass) {
            res.status(400).json({
                msg: "password incorrect"
            });
            return;
        }
        const token = yield jsonwebtoken_1.default.sign({ mobile: user.mobile, username: user.username }, config_1.JWT_SECRET);
        res.status(200).json({
            token
        });
    }
    catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}));
exports.router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            msg: "please provide all the credentials"
        });
        return;
    }
    const existUser = yield db_1.userModel.findOne({ mobile: parsedData.data.mobile, email: parsedData.data.email });
    if (existUser) {
        res.status(500).json({
            msg: "user already exist please go to signin page"
        });
    }
    const hashedPass = yield bcrypt_1.default.hash(parsedData.data.password, 5);
    try {
        yield db_1.userModel.create({
            username: parsedData.data.username,
            email: parsedData.data.email,
            password: hashedPass,
            firstname: parsedData.data.firstname,
            lastname: parsedData.data.lastname,
            mobile: parsedData.data.mobile
        });
        res.status(200).json({
            msg: "successfully signed up"
        });
    }
    catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}));
exports.router.use("/users", users_1.userRouter);

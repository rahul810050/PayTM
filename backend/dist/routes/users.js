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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const types_1 = require("../types");
const userMiddleware_1 = require("../middleware/userMiddleware");
const db_1 = require("../db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.userRouter = express_1.default.Router();
exports.userRouter.put("/metadata", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.metadataSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            msg: "please provide all the credentials"
        });
        return;
    }
    const userId = req.userId;
    try {
        const user = yield db_1.userModel.findOne({ _id: userId });
        if (!user) {
            res.status(400).json({
                msg: "user not found"
            });
            return;
        }
        if (parsedData.data.firstname) {
            user.firstname = parsedData.data.firstname;
        }
        if (parsedData.data.lastname) {
            user.lastname = parsedData.data.lastname;
        }
        if (parsedData.data.password) {
            const hashedPass = yield bcrypt_1.default.hash(parsedData.data.password, 5);
            user.password = hashedPass;
        }
        yield user.save();
        res.status(200).json({
            msg: "user data updated successfully"
        });
    }
    catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}));
exports.userRouter.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || "";
    try {
        const users = yield db_1.userModel.find({
            $or: [{
                    firstname: {
                        "$regex": filter,
                        "$options": "i"
                    },
                    lastname: {
                        "$regex": filter,
                        "$options": "i"
                    }
                }]
        });
        if (!users) {
            res.status(403).json({
                msg: "no user found"
            });
            return;
        }
        res.status(200).json({
            user: users.map(u => ({
                username: u.username,
                firstname: u.firstname,
                lastname: u.lastname,
                id: u._id
            }))
        });
    }
    catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}));

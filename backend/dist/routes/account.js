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
exports.accountRouter = void 0;
const express_1 = __importDefault(require("express"));
const userMiddleware_1 = require("../middleware/userMiddleware");
const db_1 = require("../db/db");
const types_1 = require("../types");
const mongoose_1 = __importDefault(require("mongoose"));
exports.accountRouter = express_1.default.Router();
exports.accountRouter.get("/balance", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(403).json({
            msg: "no userid"
        });
        return;
    }
    try {
        const account = yield db_1.accountModel.findOne({ userId: userId });
        if (!account || !account.balance) {
            res.status(403).json({
                msg: "no balance"
            });
            return;
        }
        res.status(200).json({
            balance: account === null || account === void 0 ? void 0 : account.balance
        });
    }
    catch (e) {
        res.status(403).json({
            error: e.message
        });
    }
}));
exports.accountRouter.post("/transfer", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.transferSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            msg: "invalid credentials"
        });
        return;
    }
    const userId = req.userId;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userAccount = yield db_1.accountModel.findOne({ userId: userId }).session(session);
        if (!userAccount || !userAccount.balance) {
            yield session.abortTransaction();
            session.endSession();
            res.status(400).json({
                msg: "user has no account"
            });
            return;
        }
        if (parsedData.data.amount > (userAccount === null || userAccount === void 0 ? void 0 : userAccount.balance)) {
            yield session.abortTransaction();
            session.endSession();
            res.status(400).json({
                msg: "insufficient balance"
            });
            return;
        }
        const toUserAccount = yield db_1.accountModel.findOne({ userId: parsedData.data.to });
        if (!toUserAccount) {
            yield session.abortTransaction();
            session.endSession();
            res.status(400).json({
                msg: "user does not exist"
            });
            return;
        }
        // we have to use transaction to prevent any type of data inconsistancy
        userAccount.balance -= parsedData.data.amount;
        toUserAccount.balance += parsedData.data.amount;
        yield userAccount.save({ session });
        yield toUserAccount.save({ session });
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            msg: "Transaction successful"
        });
    }
    catch (e) {
        yield session.abortTransaction();
        session.endSession();
        res.status(400).json({
            error: e.message
        });
    }
}));

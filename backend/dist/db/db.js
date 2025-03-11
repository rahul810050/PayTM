"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Schema.Types.ObjectId;
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true, trim: true, minLength: 3, maxLength: 30 },
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    firstname: { type: String, required: true, trim: true, maxLength: 50 },
    lastname: { type: String, required: true, trim: true, maxLength: 50 },
    mobile: {
        type: Number,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v.toString());
            },
            message: "Mobile number must be exactly 10 digits",
        },
    },
});
const accountSchema = new mongoose_1.default.Schema({
    userId: { type: ObjectId, ref: "users", require: true },
    balance: { type: Number, require: true, default: 0 }
});
const userModel = mongoose_1.default.model("users", userSchema);
exports.userModel = userModel;
const accountModel = mongoose_1.default.model("accounts", accountSchema);
exports.accountModel = accountModel;

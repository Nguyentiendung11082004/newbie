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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const error_1 = require("../middlewares/error");
const auth_1 = require("../schema/auth");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account, password } = req.body;
        const error = auth_1.AuthValidate.validate(req.body, { abortEarly: false });
        console.log("error", error);
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.register = register;

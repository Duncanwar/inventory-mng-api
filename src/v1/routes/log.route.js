"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const log_controller_1 = __importDefault(require("../controllers/log.controller"));
const router = (0, express_1.Router)();
router.get("/", log_controller_1.default.getLogs);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = exports.addLog = void 0;
const eventsLogs = [];
const addLog = (action, productId, details) => {
    eventsLogs.push({
        action,
        productId,
        details,
        timestamp: new Date(),
    });
};
exports.addLog = addLog;
const getLogs = () => {
    return eventsLogs;
};
exports.getLogs = getLogs;

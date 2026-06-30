"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const index_js_1 = require("./config/index.js");
const index_js_2 = require("./database/index.js");
const startServer = async () => {
    try {
        // Connect to database
        await (0, index_js_2.connectDatabase)();
        // Start Express server
        app_js_1.default.listen(index_js_1.config.port, () => {
            console.log(`[Server] Portiva AI API running in ${index_js_1.config.env} mode on http://localhost:${index_js_1.config.port}`);
        });
    }
    catch (error) {
        console.error('Failed to bootstrap server:', error);
        process.exit(1);
    }
};
startServer();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appConfig_controller_1 = require("./appConfig.controller");
const router = (0, express_1.Router)();
router.get("/", appConfig_controller_1.getConfig);
router.post("/", appConfig_controller_1.createConfig);
router.put("/", appConfig_controller_1.updateConfig);
exports.default = router;

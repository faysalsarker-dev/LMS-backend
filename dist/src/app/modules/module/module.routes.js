"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const module_controller_1 = require("./module.controller");
const module_validation_1 = require("./module.validation");
const validateRequest_middleware_1 = __importDefault(require("../../middleware/validateRequest.middleware"));
const router = express_1.default.Router();
router.post("/", (0, validateRequest_middleware_1.default)(module_validation_1.createModuleSchema), module_controller_1.ModuleController.createModule);
router.get("/", module_controller_1.ModuleController.getAllModules);
router.get("/:id", module_controller_1.ModuleController.getModuleById);
router.put("/:id", (0, validateRequest_middleware_1.default)(module_validation_1.updateModuleSchema), module_controller_1.ModuleController.updateModule);
router.delete("/:id", module_controller_1.ModuleController.deleteModule);
exports.default = router;

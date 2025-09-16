"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
exports.AuthValidation = {
    register: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(1),
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
            role: zod_1.z.enum(['rider', 'driver', 'admin']),
            isBlocked: zod_1.z.boolean().optional(),
            driverProfile: zod_1.z
                .object({
                isApproved: zod_1.z.boolean().optional(),
                isOnline: zod_1.z.boolean().optional(),
                vehicleInfo: zod_1.z
                    .object({
                    model: zod_1.z.string().optional(),
                    licensePlate: zod_1.z.string().optional(),
                    color: zod_1.z.string().optional(),
                })
                    .optional(),
            })
                .optional(),
        }),
    }),
    login: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
        }),
    }),
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSLService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config/config"));
const ApiError_1 = require("../../errors/ApiError");
const sslPaymentInit = async (payload) => {
    try {
        const data = {
            store_id: config_1.default.ssl.sslId,
            store_passwd: config_1.default.ssl.sslPass,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${config_1.default.ssl.sslSuccessBackendUrl}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success&email=${payload.email}&courseId=${payload.courseId}`,
            fail_url: `${config_1.default.ssl.sslFailBackendUrl}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${config_1.default.ssl.sslCancelBackendUrl}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            // ipn_url: config.ssl.SSL_IPN_URL,
            shipping_method: "N/A",
            product_name: "Course Purchase",
            product_category: "N/A",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.city,
            cus_add2: "N/A",
            cus_city: payload.city,
            cus_state: "N/A",
            cus_postcode: "N/A",
            cus_country: payload.country,
            cus_phone: payload.phoneNumber,
            cus_fax: "N/A",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        };
        const response = await (0, axios_1.default)({
            method: "POST",
            url: config_1.default.ssl.sslPayment,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return response.data;
    }
    catch (error) {
        console.log("Payment Error Occured", error);
        throw new ApiError_1.ApiError(400, error.message);
    }
};
const validatePayment = async (payload) => {
    try {
        const response = await (0, axios_1.default)({
            method: "GET",
            url: `${config_1.default.ssl.sslValidationApi}?val_id=${payload.val_id}&store_id=${config_1.default.ssl.sslId}&store_passwd=${config_1.default.ssl.sslPass}`
        });
        console.log("sslcomeerz validate api response", response.data);
        // await Payment.updateOne(
        //     { transactionId: payload.tran_id },
        //     { paymentGatewayData: response.data },
        //     { runValidators: true })
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.ApiError(401, `Payment Validation Error, ${error.message}`);
    }
};
exports.SSLService = {
    sslPaymentInit,
    validatePayment
};

import axios from "axios";
import config from "../../config/config";
import { ISSLCommerz } from "./sslCommersz.interface";
import { ApiError } from "../../errors/ApiError";


const sslPaymentInit = async (payload: ISSLCommerz) => {

    try {
        const data = {
            store_id: config.ssl.sslId,
            store_passwd: config.ssl.sslPass,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${config.ssl.sslSuccessBackendUrl}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success&email=${payload.email}&courseId=${payload.courseId}`,
            fail_url: `${config.ssl.sslFailBackendUrl}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${config.ssl.sslCancelBackendUrl}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            // ipn_url: config.ssl.SSL_IPN_URL,
            shipping_method: "N/A",
            product_name: "Course Purchase",
            product_category: "N/A",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax: "01884570877",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        }

        const response = await axios({
            method: "POST",
            url: config.ssl.sslPayment,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })

        return response.data;

    } catch (error: any) {
        console.log("Payment Error Occured", error);
        throw new ApiError(400, error.message)
    }
}










const validatePayment = async (payload: any) => {
    try {
        const response = await axios({
            method: "GET",
            url: `${config.ssl.sslValidationApi}?val_id=${payload.val_id}&store_id=${config.ssl.sslId}&store_passwd=${config.ssl.sslPass}`
        })

        console.log("sslcomeerz validate api response", response.data);

        // await Payment.updateOne(
        //     { transactionId: payload.tran_id },
        //     { paymentGatewayData: response.data },
        //     { runValidators: true })
    } catch (error: any) {
        console.log(error);
        throw new ApiError(401, `Payment Validation Error, ${error.message}`)
    }
}

export const SSLService = {
    sslPaymentInit,
    validatePayment
}
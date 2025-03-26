// const { response } = require("express");
const response_code = require("../../../../utilities/response-error-code");
const constant = require("../../../../config/constant");
const common = require("../../../../utilities/common");
const userModel = require("../models/driver-model");
// const authModel = require("../models/auth-model");
const Validator = require('Validator')
const {default: localizify} = require('localizify');
const validationRules  = require('../../../validation_rules');
const middleware = require("../../../../middleware/validators");
const { t } = require("localizify");
const { email_id } = require("../../../../language/en");


class User {
    async signup(req, res) {
        try{
                // { "user_name": "rakhi", "email_id": "ra@example.com", "phone_number": "6214872340", "code_id": 1, "password_": "mypassword1", "device_type": "Android", "os_version": "13.0", "app_version": "1.2.0", "time_zone": "2025-03-10T10:30:00Z" }
        const request_data = JSON.parse(common.decryptPlain(req.body));
        const rules = validationRules.signup;
        let message = {
            required: req.language.required,
            'email_id': t('email'),
            'phone_number.regex': t('mobile_number_numeric'),
            'password_.min': t('passwords_min'),
            'code_id': t('code_id'),
            'full_name': t('user_name'),
            'signup_type': t('signup_type')
        };
    
        let keywords = {
            'email_id': t('email'),
            'phone_number.regex': t('mobile_number_numeric'),
            'password_.min': t('passwords_min'),
            'code_id': t('code_id'),
            'full_name': t('user_name'),
            'signup_type': t('signup_type')
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        
        const responseData = await userModel.signup(request_data);
        return common.response(res, responseData);
        }catch(error){
            console.error("Error in login:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async login(req, res) {
        try{
    console.log(req.body);
    
        const request_data = JSON.parse(common.decryptPlain(req.body));

        console.log(request_data);
        const rules = validationRules.login;

        let message={
            required: req.language.required,
            email_id: t('email'),
            'password_.min': t('passwords_min')
        }

        let keywords={
            'email_id': t('rest_keywords_email_id'),
            'password_':t('rest_keywords_password')
        }
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            
            const responseData = await userModel.login(request_data);
            
            // Send response
            return common.response(res, responseData);
        }catch(error){
            console.error("Error in login:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }

    }

    async validateOTP(req, res) {

        const request_data = JSON.parse(common.decryptPlain(req.body));
        const rules = validationRules.validateOTP;
        let message = {
            required: req.language.required,
            'phone_number.regex': t('mobile_number_numeric'),
            'otp': t('otp')
        };
    
        let keywords = {
            'phone_number.regex': t('mobile_number_numeric'),
            'otp': t('otp')
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        
        const responseData = await userModel.validateOTP(request_data);
        return common.response(res, responseData);
    }
    resendOTP(req, res) {
        // var request_data = req.body;
        const request_data = JSON.parse(common.decryptPlain(req.body));
        const rules = validationRules.validateOTP;
        let message = {
            required: req.language.required,
            email_id: t('email')
        };
    
        let keywords = {
            email_id: t('email'),
        };

        const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
    
        if (valid) {
            authModel.validateOTP(request_data, (_responseData) => {
                common.response(res, _responseData);
            });
        }
        // const request_data = JSON.parse(common.decryptPlain(req.body));
        // authModel.resendOTP(request_data, (_responseData) => {
        //     common.response(res, _responseData);
        // });
    }

    async forgotPassword(req, res) {
        // {
        //     "email_id":"ra@example.com"
        // }
        try{
            const request_data = JSON.parse(common.decryptPlain(req.body));

            const rules = validationRules.forgotPassword;
            let message = {
                required: req.language.required,
                email_id: t('email'),
            };  
        
            let keywords = {
                'email_id': t('rest_keywords_email_id')
            };
    
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            
            const responseData = await userModel.forgotPassword(request_data);
            return common.response(res, responseData);

        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
       
    }

    async validateForgotPasswordOTP(req, res) {
        // {
        //     "user_id": 1,
        //     "otp": 7652
        //   }
          
        const request_data = JSON.parse(common.decryptPlain(req.body));
        const rules = validationRules.validateOTP;
        let message = {
            required: req.language.required,
            'phone_number.regex': t('mobile_number_numeric'),
            'otp': t('otp')
        };
    
        let keywords = {
            'phone_number.regex': t('mobile_number_numeric'),
            'otp': t('otp')
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        
        const responseData = await userModel.validateForgotPasswordOTP(request_data);
        return common.response(res, responseData);
    }

    async resetPassword(req, res) {
        // {
        //     "user_id": 1,
        //     "email_id":"ra@example.com",
        //     "password_": "mypassword2"
        
        // }
        
        try{
            const request_data = JSON.parse(common.decryptPlain(req.body));
            const rules = validationRules.resetPassword;
            let message = {
                required: req.language.required,
                email_id: t('email'),
                'password_.min': t('passwords_min')
            };
        
            let keywords = {
                'email_id': t('rest_keywords_email_id')
            };
    
            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            if (!valid) return;
            const responseData = await userModel.resetPassword(request_data);

            return common.response(res, responseData);

        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong')
            });
        }
      

        // userModel.resetPassword(request_data, (_responseData) => {
        //     common.response(res, _responseData);
        // });
    }

    async changePassword(req, res) {
        // {
        //     "old_password": "mypassword2",
        //     "new_password":"mypassword3"
        // }
        
        try{
            // var request_data = req.body;
            const request_data = JSON.parse(common.decryptPlain(req.body));

            const rules = validationRules.changePassword

            let message={
                required:req.language.required,
                required: t('required'),
                'old_password.min': t('passwords_min'),
                'new_password.min': t('passwords_min')
            }
 
            let keywords={
                'new_password': t('rest_keywords_password'),
                'old_password': t('rest_keywords_password')
            }

            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            
        if (!valid) return;
            console.log("-----------------")
            console.log("Request Data:", req.user_id); 
            const responseData = await userModel.changePassword(request_data,req.user_id);
            
            // Send response
            return common.response(res, responseData);
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    // async add_vehicle_data(req,res){
    //     try{
    //         // var request_data = req.body;
    //         // const request_data = JSON.parse(common.decryptPlain(req.body));

    //         // const rules = validationRules.add_vehicle_data

    //         // let message={
    //         //     required:req.language.required,
    //         //     required: t('required'),
    //         //     'vehicle_type_id': t('vehicle_type_id'),
    //         //     'vehicle_company': t('vehicle_company'),
    //         //     'vehicle_model': t('vehicle_model'),
    //         //     'vehicle_number': t('vehicle_number'),
    //         //     'vehicle_rto': t('vehicle_rto')
    //         // }
 
    //         // let keywords={
    //         //     'vehicle_type_id': t('vehicle_type_id'),
    //         //     'vehicle_company': t('vehicle_company'),
    //         //     'vehicle_model': t('vehicle_model'),
    //         //     'vehicle_number': t('vehicle_number'),
    //         //     'vehicle_rto': t('vehicle_rto')
    //         // }
    //         console.log("Request Body:", req.body, "Type:", typeof req.body);
    
    //         let request_data = {};
 
    //         if (req.body && Object.keys(req.body).length > 0) {
    //             const decryptedData = common.decryptString(req.body);
                
    //             // Ensure decrypted data is a valid JSON string before parsing
    //             if (typeof decryptedData === "string" && decryptedData.trim() !== "") {
    //                 request_data = JSON.parse(decryptedData);
    //             } else {
    //                 return common.response(res, {
    //                     code: response_code.OPERATION_FAILED,
    //                     message: "Invalid decrypted data format"
    //                 });
    //             }
    //         }
    //         const rules = validationRules.delete;
    //         const valid = middleware.checkValidationRules(req, res, request_data, rules);
    //         console.log("Valid", valid);
    //         if (!valid) return;
    
    //         // Call the delete function
    //         const responseData = await userModel.add_vehicle_data(request_data, req.user_id);
    
    //         // Send response
    //         return common.response(res, responseData);
    
    //     //     console.log("Request Data after decryption:", request_data);

    //     //     const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            
    //     // if (!valid) return;
    //     //     console.log("-----------------")
    //     //     console.log("Request Data:", req.user_id); 
    //     //     const responseData = await userModel.add_vehicle_data(request_data,req.user_id);
            
    //     //     // Send response
    //     //     return common.response(res, responseData);
    //     }catch(error){
    //         return common.response(res, {
    //             code: response_code.OPERATION_FAILED,
    //             message: t('rest_keywords_something_went_wrong') + error
    //         });
    //     }
    // }
    async add_vehicle_data(req, res) {
        try {
            console.log("Request Body:", req.body, "Type:", typeof req.body);
            console.log("Request Files:", req.files);
            let request_data = {};
    
            if (req.body && Object.keys(req.body).length > 0) {
                let decryptedData;
    
                if (typeof req.body === "string") {
                    // Only decrypt if the request body is a string
                    decryptedData = common.decryptString(req.body);
                    console.log("Decrypted Data:", decryptedData);
    
                    if (typeof decryptedData === "string" && decryptedData.trim() !== "") {
                        request_data = JSON.parse(decryptedData);
                    } else {
                        return common.response(res, {
                            code: response_code.OPERATION_FAILED,
                            message: "Invalid decrypted data format"
                        });
                    }
                } else {
                    // If request body is already an object, use it directly
                    request_data = req.body;
                }
            }
    
            console.log("Final Request Data:", request_data);
            request_data.files = req.files || {};
            
            const rules = validationRules.delete;
            const valid = middleware.checkValidationRules(req, res, request_data, rules);
            console.log("Valid:", valid);
            if (!valid) return;
    
            // Call the delete function
            const responseData = await userModel.add_vehicle_data(request_data, req.user_id);
    
            // Send response
            return common.response(res, responseData);
    
        } catch (error) {
            console.error("Error in add_vehicle_data:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error.message
            });
        }
    }
    

    async acceptOrder(req,res){
        try{
            // var request_data = req.body;
            const request_data = JSON.parse(common.decryptPlain(req.body));

            const rules = validationRules.acceptOrder

            let message={
                required:req.language.required,
                required: t('required'),
                'order_id': t('order_id')
            }
 
            let keywords={
                'order_id': t('order_id')
            }

            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            
        if (!valid) return;
            console.log("-----------------")
            console.log("Request Data:", req.user_id); 
            const responseData = await userModel.acceptOrder(request_data,req.user_id);
            
            // Send response
            return common.response(res, responseData);
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async deliveryStatus(req,res){
        try{
            // var request_data = req.body;
            const request_data = JSON.parse(common.decryptPlain(req.body));

            const rules = validationRules.deliveryStatus

            let message={
                required:req.language.required,
                required: t('required'),
                'order_id': t('order_id'),
                'delivery_status': t('status')
            }
 
            let keywords={
                'order_id': t('order_id'),
                'delivery_status': t('status')
            }

            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            
        if (!valid) return;

            const responseData = await userModel.deliveryStatus(request_data,req.user_id);
            
            // Send response
            return common.response(res, responseData);
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async verifyDelivery(req,res){
        try{
            const request_data = JSON.parse(common.decryptPlain(req.body));

            const rules = validationRules.verifyDelivery

            let message={
                required:req.language.required,
                required: t('required'),
                'order_id': t('order_id'),
                'delivery_otp': t('delivery_otp')
            }
 
            let keywords={
                'order_id': t('order_id'),
                'delivery_otp': t('delivery_otp')
            }

            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            
        if (!valid) return;

            const responseData = await userModel.verifyDelivery(request_data,req.user_id);
            
            // Send response
            return common.response(res, responseData);
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async setAvailability(req,res){
        try{
            const request_data = JSON.parse(common.decryptPlain(req.body));

            const rules = validationRules.setAvailability

            let message={
                required:req.language.required,
                required: t('required'),
                'days': t('days'),
                'startTime': t('start_time'),
                'endTime': t('end_time'),
                'radius_km': t('radius_km')
            }
 
            let keywords={
                'days': t('days'),
                'startTime': t('start_time'),
                'endTime': t('end_time'),
                'radius_km': t('radius_km')
            }

            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            
        if (!valid) return;

            const responseData = await userModel.setAvailability(request_data,req.user_id);

            return common.response(res, responseData);
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async showEarnings(req,res){
        try{
            const request_data = JSON.parse(common.decryptPlain(req.body));

            const rules = validationRules.showEarnings

            let message={
                required:req.language.required,
                required: t('required'),
               
            }
 
            let keywords={
            }

            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            
        if (!valid) return;

            const responseData = await userModel.showEarnings(request_data,req.user_id);

            return common.response(res, responseData);
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async show_nearby_orders(req, res) {
        try {
            console.log("Request Body:", req.body, "Type:", typeof req.body);
    
            let request_data = {};

            if (req.body && Object.keys(req.body).length > 0) {
                const decryptedData = common.decryptString(req.body);

                if (typeof decryptedData === "string" && decryptedData.trim() !== "") {
                    request_data = JSON.parse(decryptedData);
                } else {
                    return common.response(res, {
                        code: response_code.OPERATION_FAILED,
                        message: "Invalid decrypted data format"
                    });
                }
            }
    
            console.log("Request Data after decryption:", request_data);
    
            // Validate request data
            const rules = validationRules.delete;
            const valid = middleware.checkValidationRules(req, res, request_data, rules);
            console.log("Valid", valid);
            if (!valid) return;
    
            // Call the delete function
            const responseData = await userModel.show_nearby_orders(request_data, req.user_id);
    
            // Send response
            return common.response(res, responseData);
    
        } catch (error) {
            console.error("Error in showing near by orders:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: `Oopss... Something Went Wrong! ${error.message}`
            });
        }
    }
    async getUpcomingDeliveries(req, res) {
        try {
            console.log("Request Body:", req.body, "Type:", typeof req.body);
    
            let request_data = {};
 
            if (req.body && Object.keys(req.body).length > 0) {
                const decryptedData = common.decryptString(req.body);
                
                // Ensure decrypted data is a valid JSON string before parsing
                if (typeof decryptedData === "string" && decryptedData.trim() !== "") {
                    request_data = JSON.parse(decryptedData);
                } else {
                    return common.response(res, {
                        code: response_code.OPERATION_FAILED,
                        message: "Invalid decrypted data format"
                    });
                }
            }
    
            console.log("Request Data after decryption:", request_data);
    
            // Validate request data
            const rules = validationRules.delete;
            const valid = middleware.checkValidationRules(req, res, request_data, rules);
            console.log("Valid", valid);
            if (!valid) return;
    
            // Call the delete function
            const responseData = await userModel.getUpcomingDeliveries(request_data, req.user_id);
    
            // Send response
            return common.response(res, responseData);
    
        } catch (error) {
            console.error("Error in showing near by orders:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: `Oopss... Something Went Wrong! ${error.message}`
            });
        }
    }

    async delete(req, res) {
        try {
            console.log("Request Body:", req.body, "Type:", typeof req.body);
    
            let request_data = {};
    
            // Decrypt only if req.body is not empty
            if (req.body && Object.keys(req.body).length > 0) {
                const decryptedData = common.decryptString(req.body);
                
                // Ensure decrypted data is a valid JSON string before parsing
                if (typeof decryptedData === "string" && decryptedData.trim() !== "") {
                    request_data = JSON.parse(decryptedData);
                } else {
                    return common.response(res, {
                        code: response_code.OPERATION_FAILED,
                        message: "Invalid decrypted data format"
                    });
                }
            }
    
            console.log("Request Data after decryption:", request_data);
    
            // Validate request data
            const rules = validationRules.delete;
            const valid = middleware.checkValidationRules(req, res, request_data, rules);
            console.log("Valid", valid);
            if (!valid) return;
    
            // Call the delete function
            const responseData = await userModel.delete(request_data, req.user_id);
    
            // Send response
            return common.response(res, responseData);
    
        } catch (error) {
            console.error("Error in delete:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: `Oopss... Something Went Wrong! ${error.message}`
            });
        }
    }


};
module.exports = new User();
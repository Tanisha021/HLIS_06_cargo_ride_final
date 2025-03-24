// const { response } = require("express");
const response_code = require("../../../../utilities/response-error-code");
const constant = require("../../../../config/constant");
const common = require("../../../../utilities/common");
const userModel = require("../models/user-model");
const authModel = require("../models/auth-model");
const Validator = require('Validator')
const {default: localizify} = require('localizify');
const validationRules  = require('../../../validation_rules');
const middleware = require("../../../../middleware/validators");
const { t } = require("localizify");
const { email_id } = require("../../../../language/en");


class User {
    async signup(req, res) {
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
        
        const responseData = await authModel.signup(request_data);
        return common.response(res, responseData);
    }

    async login(req, res) {
        try{
    console.log(req.body);
    
        const request_data = JSON.parse(common.decryptPlain(req.body));

        console.log(request_data);
        const rules = validationRules.login;

        let message={
            required: req.language.required,
            email: t('email'),
            'password_.min': t('passwords_min')
        }

        let keywords={
            'email_id': t('rest_keywords_email_id'),
            'password_':t('rest_keywords_password')
        }
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            
            const responseData = await authModel.login(request_data);
            
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
        
        const responseData = await authModel.validateOTP(request_data);
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
                email: t('email'),
            };  
        
            let keywords = {
                'email_id': t('rest_keywords_email_id')
            };
    
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            
            const responseData = await authModel.forgotPassword(request_data);
            return common.response(res, responseData);

        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong')
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
        
        const responseData = await authModel.validateForgotPasswordOTP(request_data);
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
            const responseData = await authModel.resetPassword(request_data);

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
        
            const responseData = await authModel.changePassword(request_data,req.user_id);
            
            // Send response
            return common.response(res, responseData);
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong')
            });
        }
    }

    async ListOfVehicles(req, res) {

        try{
            // var request_data = req.body;
            const request_data = JSON.parse(common.decryptPlain(req.body));

            const rules = validationRules.ListOfVehicles

            let message={
                required:req.language.required,
                required: t('required'),
                "pickup_latitude":t('pickup_latitude'),
                "pickup_longitude":t('pickup_longitude'),
                "dropoff_latitude":t('drop_latitude'),
                "dropoff_longitude":t('drop_longitude')
            }

            let keywords={
                "pickup_latitude":t('pickup_latitude'),
                "pickup_longitude":t('pickup_longitude'),
                "dropoff_latitude":t('drop_latitude'),
                "dropoff_longitude":t('drop_longitude')
            }

            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            
        if (!valid) return;
        
            const responseData = await userModel.ListOfVehicles(request_data,req.user_id);
            
            // Send response
            return common.response(res, responseData);
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async createDeliveryOrder(req, res) {
        
        try{
            // var request_data = req.body;
            const request_data = JSON.parse(common.decryptPlain(req.body));

            const rules = validationRules.ListOfVehicles

            let message={
                required:req.language.required,
                required: t('required'),
               
            }

            let keywords={
                
            }

            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            
        if (!valid) return;
        
            const responseData = await userModel.createDeliveryOrder(request_data,req.user_id);
            
            // Send response
            return common.response(res, responseData);
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }


    async notification(req, res) {
        try{
            // const request_data = JSON.parse(common.decryptPlain(req.body));
            const request_data=req.body;
            if (Object.keys(request_data).length != 0) {
                request_data = JSON.parse(common.decryptString(req.body));
            }
            console.log("Request Data after decryption:", request_data);
            console.log(request_data);
            const rules = validationRules.displayHomePage;

        const valid = middleware.checkValidationRules(req,res,request_data,rules)
        console.log("Valid",valid);
        if (!valid) return;
        const responseData = await userModel.notification(request_data,req.user_id);
        
        // Send response
        return common.response(res, responseData);

        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
    }
    }

    async cancelOrder(req, res) {
        try{
            try{
             
                const request_data = JSON.parse(common.decryptPlain(req.body));
        
                console.log(request_data);
                const rules = validationRules.cancelOrder;
        
                let message = {
                    required: req.language.required,
                    order_id: t('order_id'),

                };
                
                let keywords = {
                    order_id: t('order_id')
                };
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            const responseData = await userModel.cancelOrder(request_data,req.user_id);
            
            // Send response
            return common.response(res, responseData);
        
            }catch(error){
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
        }
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async contactUs(req, res) {
        try{
            try{
             
                const request_data = JSON.parse(common.decryptPlain(req.body));
        
                console.log(request_data);
                const rules = validationRules.contactUs;
        
                let message = {
                    required: req.language.required,
                    full_name: t("full_name"),
                    email_address: t("email_address"),
                    code_id: t("code_id"),
                    phone_number: t("phone_number")
                };
                
                let keywords = {
                    full_name: t("full_name"),
                    email_address: t("email_address"),
                    code_id: t("code_id"),
                    phone_number: t("phone_number")
                };
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            const responseData = await userModel.contactUs(request_data,req.user_id);
            
            // Send response
            return common.response(res, responseData);
        
            }catch(error){
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
        }
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async listUserOrders(req,res){
        try{
            try{
             
                const request_data = JSON.parse(common.decryptPlain(req.body));
        
                console.log(request_data);
                const rules = validationRules.listUserOrders;
        
                let message = {
                    required: req.language.required,
                };
                
                let keywords = {
                   
                };
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            const responseData = await userModel.listUserOrders(request_data,req.user_id);
            
            return common.response(res, responseData);
        
            }catch(error){
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
        }
        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }


    async logout(req, res) {
        try{
            const request_data = JSON.parse(common.decryptPlain(req.body));

            console.log(request_data);
            const rules = validationRules.logout;

        const valid = middleware.checkValidationRules(req,res,request_data,rules)
        console.log("Valid",valid);
        if (!valid) return;
        const responseData = await userModel.logout(request_data,req.user_id);
        
        // Send response
        return common.response(res, responseData);

        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
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
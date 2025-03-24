const response_code = require("../../../../utilities/response-error-code");
const constant = require("../../../../config/constant");
const common = require("../../../../utilities/common");
const adminModel = require("../models/admin-model");
// const authModel = require("../models/auth-model");
const Validator = require('Validator')
const {default: localizify} = require('localizify');
const validationRules  = require('../../../validation_rules');
const middleware = require("../../../../middleware/validators");
const { t } = require("localizify");
const { item_id } = require("../../../../language/en");

class Admin {
        async login_admin(req, res) {
            try{
            // var request_data = req.body;
            // { "email_id": "john.doe@example.com", "password_": "mypassword1" }
        // console.log(req);
        console.log(req.body);
        
            const request_data = JSON.parse(common.decryptPlain(req.body));
    
            console.log(request_data);
            const rules = validationRules.login_admin;
    
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
                
                const responseData = await adminModel.login_admin(request_data);
                
                // Send response
                return common.response(res, responseData);
            // if(middleware.checkValidation(req,res,request,rule,message,keywords)){
            //     userModel.login(request_data, (_responseData) => {
            //         middleware.send_responseresponse(res, _responseData);
            //     });
            // }
            }catch(error){
                console.error("Error in login:", error);
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
            }
    
        }
    async add_item_by_admin(req, res) {
        // { "item_name": "Grilled Chicken", "kcal": 350, "carbs": 10, "protein": 40, "fat": 15, "desc_": "Delicious grilled chicken", "image_id": 3, "ingredient_ids": [1, 3, 2] }
        try {

            let request_data = common.decryptPlain(req.body);
    
            if (typeof request_data === "string") {
                request_data = JSON.parse(request_data);
            }
    
            console.log("Decrypted Request Data:", request_data);
    
            const rules = validationRules.add_item_by_admin;
    
            let message = {
                required: req.language.required,
                item_name: t('item_name'),
                kcal: t('kcal'),
                carbs: t('carbs'),
                protein: t('protein'),
                fat: t('fat'),
                desc_: t('desc_'),
                image_id: t('image_id'),
                ingredient_id: t('ingredient_ids')
            };
    
            let keywords = { ...message };
    
            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            console.log("Valid:", valid);
            if (!valid) return;
    
            const responseData = await adminModel.add_item_by_admin(request_data, req.admin_id);
    
            return common.response(res, responseData);
    
        } catch (error) {
            console.log("Error in add_item_by_admin", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async delete_item(req, res) {
        try {

            const request_data = JSON.parse(common.decryptPlain(req.body));
                        // console.log(req.body);
                        const rules = validationRules.getItemDetails;
            
                        let message={
                            required: req.language.required,
                            item_id: t('item_id'),      
                        }
            
                        let keywords={
                            item_id: t('item_id')
                        }
    
            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);
            console.log("Valid:", valid);
            if (!valid) return;
    
            const responseData = await adminModel.delete_item(request_data, req.admin_id);
    
            return common.response(res, responseData);
    
        } catch (error) {
            console.log("Error in add_item_by_admin", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async analytics_dashboard(req, res) {
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
                        const rules = validationRules.delete;
            const valid = middleware.checkValidationRules(req, res, request_data, rules);
            console.log("Valid:", valid);
            if (!valid) return;
    
            const responseData = await adminModel.analytics_dashboard(request_data, req.admin_id);
    
            return common.response(res, responseData);
    
        } catch (error) {
            console.log("Error in add_item_by_admin", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async logout_admin(req, res) {
        try{
            const request_data = JSON.parse(common.decryptPlain(req.body));

            console.log(request_data);
            const rules = validationRules.logout_admin;

        const valid = middleware.checkValidationRules(req,res,request_data,rules)
        console.log("Valid",valid);
        if (!valid) return;
        console.log("Request Data:", req);
        const responseData = await adminModel.logout_admin(request_data,req.user_id);
        
        // Send response
        return common.response(res, responseData);

        }catch(error){
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
    }
    }
};
module.exports = new Admin();
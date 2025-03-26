const Validator = require('Validator')
const {default: localizify} = require('localizify')
const en = require('../language/en.js')
const ar = require('../language/ar.js')
const hn = require('../language/hn.js')
const common = require('../utilities/common.js')
const {t} = require('localizify')
const response_code = require("../utilities/response-error-code");

const con = require('../config/database.js')

const middleware = {

    checkValidationRules: function (req, res, request, rules, messages, keywords) {
        // console.log("Original request:", request);
        // console.log("Type of item_id:", typeof request.item_id);
        // console.log("Validation rules:", rules);
        // console.log("Validation keywords:", keywords);
    
        // Ensure all request fields are strings
        console.log('validation',request);

        // Object.keys(request).forEach(key => {
        //     if (typeof request[key] !== "number") {
        //         request[key] = request[key] !== undefined ? String(request[key]) : "";
        //     }
        // });
        
        // Object.keys(request).forEach(key => {
        //     request[key] = request[key] !== undefined ? String(request[key]) : "";
        // });
    
        console.log("Modified request (after type conversion):", request);
    
        const v = Validator.make(request, rules, messages);
    
        try {
            if (v.fails()) {
                console.log("Validation failed");
                const errors = v.getErrors();
                console.log(errors);
    
                let errorMessage = "";
                for (let key in errors) {
                    errorMessage = errors[key][0]; // Get first error message
                    break;
                }
    
                console.log("Error message:", errorMessage);
    
                const response_data = {
                    code: response_code.OPERATION_FAILED,
                    message: errorMessage
                };
    
                console.log(response_data);
    
                res.send(common.encrypt(response_data));
    
                return false;
            } else {
                console.log("Validation passed");
                return true;
            }
        } catch (error) {
            console.error("Validation error:", error);
            return false;
        }
    },    
        
    getMessage: function (language, message, callback) {
        console.log(language);
        
        localizify.add('en', en)
            .add('ar', ar)
            .add('hn', hn)
            .setLocale(language);
        //console.log(message);
        let translateMessage = t(message.keyword);
        console.log(message.content, 'message content');
        
        if (message.content) {
            Object.keys(message.content).forEach(key => {
                translateMessage = translateMessage.replace(`{${key}}`, message.content[key]);
            });
        }
        callback(translateMessage);
    },
    
    send_response :function(req, res,message){
        console.log(req.lang);
        
        this.getMessage(req.lang,message,function(translated_message){
            console.log(translated_message);
            
            if (message.data == null) {
                response_data = {
                    code : message.code,
                    message:translated_message,
                    data: message.data 
                }
                
                // res.status(200).send(response_data);
                const response = common.encrypt(response_data);
        console.log(response);
        
        res.status(200).send(response);
                // middleware.encryption(response_data,function(response){
                    // res.status(200);
                    // res.send(response);    
                // });
            
            } else {
                response_data = {
                    code :code,
                    message:translated_message,
                    data: data 
                }
                // middleware.encryption(response_data,function(response){
                    res.status(200).send(response_data);  
                // });
            }
        })
    },
    
    extractHeaderLanguage:function(req,res,callback){

        // return req.headers["accept-language"] || "en";
        var headerLang = req.headers['accept-language'] && req.headers['accept-language'].trim() !== ""
        ? req.headers['accept-language'] 
        : "en";  // Default to English if not provided
        
        if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
            if (req.body && typeof req.body === 'object' && !req.body.userLang) {
                req.lang = headerLang;
            }
            return callback();
        }
        
    req.lang = headerLang;

    // Assign the correct language object based on the header
    if (headerLang === 'en') {
        req.language = en;
    } else if (headerLang === 'ar') {
        req.language = ar;
    } else if (headerLang === 'hn') {  // Add Hindi support
        req.language = hn;
    } else {
        req.language = en; // Fallback to English if the language is unknown
    }

    // Add all language files to localizify
    localizify.add('en', en);
    localizify.add('ar', ar);
    localizify.add('hn', hn);  // Register Hindi language
    localizify.setLocale(req.lang);

    // // Handle decryption/encryption of request body if it exists
    // if (req.body && Object.keys(req.body).length > 0) {
    //     try{
    //         if(!req.body.headerLang){
    //             const req_body = JSON.parse(common.decryptPlain(req.body));
    //             console.log(req_body);
    //             req_body.headerLang = req.headerLang;
    //             req.body = common.encrypt(req_body);
    //             console.log("Req body: ", req.body);
    //         }
    //     }catch (error) {
    //         console.error("Error processing request body:", error);
    //         // Continue processing even if there's an error with the body
    //     }
    // }



    callback();
    },

   
}
module.exports = middleware;


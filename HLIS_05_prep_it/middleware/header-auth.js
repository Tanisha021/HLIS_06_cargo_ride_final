const {default: localizify} = require('localizify');
const database = require("../config/database");
const { t } = require('localizify');
const common = require("../utilities/common");
const response_code = require("../utilities/response-error-code");
const en = require("../language/en");
const hn = require("../language/hn");
const ar = require("../language/ar");
const lodash = require('lodash');
var lib = require('cryptlib');

class headerAuth{

    validateApiKey(req,res,next){        
        var api_key = (req.headers['api-key'] != undefined && req.headers['api-key'] != "" ? req.headers['api-key'] : '');
        if(api_key != ""){
            try{
                var api_dec = common.decryptString(api_key).replace(/\0/g, '').replace(/[^\x00-\xFF]/g, "");
                console.log(api_dec);
                console.log(api_dec === process.env.API_KEY);
                if(api_dec === process.env.API_KEY){
                    console.log("iF")
                    next();
                } else{
                    console.log("here");
                    const response_data = {
                        code: response_code.UNAUTHORIZED,
                        message: "Invalid API Key"
                    }
                    res.status(401).send(response_data);
                }
                // if(api_key === process.env.API_KEY){
                //     console.log("✅ API Key Valid. Proceeding to next middleware...");

                //     next();
                // } else{
                //     const response_data = {
                //         code: response_code.UNAUTHORIZED,
                //         message: "Invalid API Key"
                //     }
                //     res.status(401).send(response_data);
                // }

            } catch(error){
                console.log("⚠️ Error in validateApiKey:", error);
                    const response_data = {
                        code: response_code.UNAUTHORIZED,
                        message: "Invalid API Key"
                    }

                    res.status(401).send(response_data);
            }
        } else{
            console.log("❌ API Key is missing!");
            const response_data = {
                code: response_code.UNAUTHORIZED,
                message: "Invalid API Key"
            }
            res.status(401).send(response_data);
        }
    }

    extractMethod(request){ 
        let url = request.originalUrl;
        let segment = []
        url.split('/').forEach(element => {
            if(!lodash.isEmpty(element)){
                segment.push(element.trim());
            }
        });
        request.appVersion = segment[0]; //v1
        request.requestedModule = segment[1]; //user
        console.log("Extracted module:", request.requestedModule);
        request.requestMethod = segment[segment.length - 1]; //login
        console.log("Extracted request method:", request.requestMethod);


        return request;
    }

    async getRequestOwner(token){
        try{
            console.log("Getting user from token:", token);
            const selectQuery = `SELECT * FROM tbl_device_info WHERE user_token = ?`;
            const [owner] = await database.query(selectQuery, [token]);
            console.log(owner);
            if(owner.length > 0){
                return owner[0];
            }else{
                throw new Error("Invalid access token");
            }
        }catch (error) {
            throw error;
        }
    }
    async getRequestAdmin(token){
        try{
            console.log("Getting user from token:", token);
            const selectQuery = `SELECT * FROM admin_ WHERE token = ?`;
            const [owner] = await database.query(selectQuery, [token]);
            console.log(owner);
            if(owner.length > 0){
                return owner[0];
            }else{
                throw new Error("Invalid access token");
            }
        }catch (error) {
            throw error;
        }
    }
    async getRequestDriver(token){
        try{
            console.log("Getting user from token:", token);
            const selectQuery = `SELECT * FROM tbl_device_info_driver WHERE driver_token = ?`;
            const [owner] = await database.query(selectQuery, [token]);
            console.log(owner);
            if(owner.length > 0){
                return owner[0];
            }else{
                throw new Error("Invalid access token");
            }
        }catch (error) {
            throw error;
        }
    }

    async header(req,res,next){
        try{
            let headers = req.headers;
            
            var supportedLanguages = ['en', 'hn', 'ar'];
            let lng = (headers['accept-language'] && supportedLanguages.includes(headers['accept-language'])
                ? headers['accept-language']
                : 'en');
                
            process.env.LANGUAGE = lng;
            localizify.add('en', en)
                    .add('ar', ar)
                    .add('hn', hn);

            const byPassApi=['forgot-password', 'resendOTP', 'login', 'signup','login_admin',
                            ,'validate-forgot-password','verify-otp', 'reset-password','check-verification'];

                             let headerObj = new headerAuth();
                             req = headerObj.extractMethod(req);

                if(byPassApi.includes(req.requestMethod)){
                    return next();
                }else{
                    const token = headers.authorization_token;
                    if(!token){
                        return res.status(401).json({
                            code: response_code.UNAUTHORIZED,
                            message: "Authorization token is missing"
                        });
                    }

                    try{

                        console.log("Checking token:", token);
                        let user;
                
                        // Determine whether request is for 'admin' or 'user'
                        if (req.requestedModule === 'admin') {
                            user = await headerObj.getRequestAdmin(token);
                            console.log("Admin found:", user);
                            req.user_id = user.admin_id; // Assign admin_id if admin
                        } else if(req.requestedModule === 'driver'){
                            user = await headerObj.getRequestDriver(token);
                            console.log("Driver found:", user);
                            req.user_id = user.driver_id; // Assign driver_id if driver
                        }
                        else {
                            user = await headerObj.getRequestOwner(token);
                            console.log("User found:", user);
                            req.user_id = user.user_id;
                        }
                        // console.log("User found:", user);
                        // console.log("User ID:", user.user_id);
                        // console.log("Admin ID:", req.user_id)
                        // console.log("User ID:", user.admin_id);
                        // req.user_id = user.user_id;
                        req.user = user;
                        console.log("Assigned User/Admin ID:", req.user_id);
                        return next();
                    }catch (error) {
                        console.log(error);
                        
                        return res.status(401).json({
                            code: response_code.UNAUTHORIZED,
                            message: "Invalid Access Token"
                        });
                    }
                }
         
        }catch (error) {
            return res.status(500).json({
                code: response_code.UNAUTHORIZED,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    }
}

module.exports =new headerAuth();
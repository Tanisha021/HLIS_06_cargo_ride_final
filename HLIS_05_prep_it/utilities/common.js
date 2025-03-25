const database = require("../config/database");
var cryptLib = require("cryptlib");
var constants = require("../config/constant");
const {default: localizify} = require('localizify');
const response_code = require("../utilities/response-error-code");
const { t } = require("localizify");
const nodemailer = require("nodemailer");
class common{
    generateOTP(){
        console.log("Hello");
        
        return Math.floor(1000 + Math.random() * 9000);
    }
    generateToken(length){
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
           
    async response(res, message){
        // res.status(statusCode);
        const response = await this.encrypt(message);
        console.log(response,' responseee');
        
        res.status(200).send(response);
    //    return res.json(message);
    }

    async updateOtp(user_id) {
        const newOtp = this.generateOTP(4);
        console.log("OTP SENT: ", newOtp);
        const updateOtpQuery = `UPDATE tbl_otp SET otp = ?, verify = 0, is_deleted = 0, is_active = 1 WHERE user_id = ?`;
        await database.query(updateOtpQuery, [newOtp, user_id]);
    }

    async findExistingUser(database, email_id, phone_number = null) {
        const findUserQuery = `SELECT * FROM tbl_user WHERE (email_id = ? OR phone_number = ?) AND is_deleted = 0 AND is_active = 1`;
        const [existingUser] = await database.query(findUserQuery, [email_id, phone_number || email_id]);
        return existingUser;
    }
    async findExistingDriver(database, email_id, phone_number = null) {
        const findUserQuery = `SELECT * FROM tbl_driver WHERE (email_id = ? OR phone_number = ?) AND is_deleted = 0 AND is_active = 1`;
        const [existingUser] = await database.query(findUserQuery, [email_id, phone_number || email_id]);
        return existingUser;
    }
    
    async handleExistingUserOTP(database, user) {
        if (user.otp) {
            return {
                code: response_code.VERIFICATION_PENDING,
                message: t('verify_account_user_exists')
            };
        }
    
        const otp_ = common.generateOtp(4);
        const updateOtpQuery = `UPDATE tbl_user SET otp = ? WHERE user_id = ?`;
        await database.query(updateOtpQuery, [otp_, user.user_id]);
    
        return {
            code: response_code.VERIFICATION_PENDING,
            message: t('otp_sent_please_verify_acc'),
            data: user.email_id
        };
    }
    
    async handleExistingDriverOTP(database, user) {
        if (user.otp) {
            return {
                code: response_code.VERIFICATION_PENDING,
                message: t('verify_account_user_exists')
            };
        }
    
        const otp_ = this.generateOTP();
        const subject = "Cargo Rider - OTP for Verification";
        const message = `Your OTP for verification is ${otp_}`;
        const email = user.email_id;
        console.log("USERR", user);
        console.log("emailllllll:", email);
        // console.log("driver_id---------:", driver_id);
        console.log("user.driver_id",user.driver_id);
        
        const updateOtpQuery = `UPDATE tbl_driver SET otp = ? WHERE email_id = ?`;
        await database.query(updateOtpQuery, [otp_,email]);

        try {
            await this.sendMail(subject, email, message);
            console.log("OTP email sent successfully!");
        } catch (error) {
            console.error("Error sending OTP email:", error);
        }
    
        return {
            code: response_code.SUCCESS,
            message: t('otp_sent_please_verify_acc'),
            data: user.email_id
        };
    }

    async getUserDetail(user_id, callback) {
        const selectUserQuery = "SELECT * FROM tbl_user WHERE user_id = ?";
        
        try {
            const [user] = await database.query(selectUserQuery, [user_id]);
                    console.log(user);
                    
            if (user.length > 0) {
                callback(null, user[0]); 
            } else {
                callback("User not found", null); 
            }
        } catch (error) {
            callback(error.message, null); 
        }
    }
    
    async updateUserInfo(user_id, user_data) {
        if (!user_id || Object.keys(user_data).length === 0) {
            throw new Error("Invalid update request: No data provided.");
        }   
    
        let fields = Object.keys(user_data).map(field => `${field} = ?`).join(', ');
        let values = Object.values(user_data);
        values.push(user_id);
    
        const updateQuery = `UPDATE tbl_user SET ${fields} WHERE user_id = ?`;
    
        try {
            const [result] = await database.query(updateQuery, values);
    
            console.log("Update Result:", result);
    
            if (result.affectedRows === 0) {
                console.warn("No rows updated - Either user not found or no changes made");
                return null;
            }
    
            const selectUserQuery = `
                SELECT user_id, latitude, longitude, gender, current_weight_kg, target_weight_kg, 
                       current_height_cm, activity_level, is_profile_completed, goal_id, isstep_
                FROM tbl_user 
                WHERE user_id = ?
            `;
    
            const [updatedUser] = await database.query(selectUserQuery, [user_id]);
    
            console.log("Updated User Data:", updatedUser);
    
            return updatedUser.length > 0 ? updatedUser[0] : null;
    
        } catch (error) {
            console.error("Error in updateUserInfo:", error);
            throw error;
        }
    }
    
    async getUserDetailLogin(user_id, login_type) {
        console.log("User ID:", user_id);
        console.log("Login Type:", login_type);
        
        // Modified to get user details directly from tbl_user without joining tbl_socials
        const selectUserQuery = "SELECT * FROM tbl_user WHERE user_id = ? ";
        
        try {
            const [user] = await database.query(selectUserQuery, [user_id]);
            console.log("User", user);
            
            if (user.length > 0) {
                // Return the user object directly
                return undefined, user[0];
            } else {
                return t('no_data_found'), [];
            }
        } catch (error) {
            console.error("Error in getUserDetailLogin:", error);
            return error.message || error, [];
        }
    }

    async getDriverDetailLogin(user_id, login_type) {
        console.log("User ID:", user_id);
        console.log("Login Type:", login_type);

        const selectUserQuery = "SELECT * FROM tbl_driver WHERE driver_id = ? ";
        
        try {
            const [user] = await database.query(selectUserQuery, [user_id]);
            console.log("User", user);
            
            if (user.length > 0) {
                // Return the user object directly
                return undefined, user[0];
            } else {
                return t('no_data_found'), [];
            }
        } catch (error) {
            console.error("Error in getUserDetailLogin:", error);
            return error.message || error, [];
        }
    }
    async getAdminDetailLogin(user_id, login_type) {
        console.log("User ID:", user_id);
        console.log("Login Type:", login_type);
        
        // Modified to get user details directly from tbl_user without joining tbl_socials
        const selectUserQuery = "SELECT * FROM admin_ WHERE admin_id = ? ";
        
        try {
            const [user] = await database.query(selectUserQuery, [user_id]);
            console.log("User", user);
            
            if (user.length > 0) {
                // Return the user object directly
                return { error: null, data: user[0] };
            } else {
                return t('no_data_found'), [];
            }
        } catch (error) {
            console.error("Error in getUserDetailLogin:", error);
            return error.message || error, [];
        }
    }
    
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    async requestValidation(v) {
        if (v.fails()) {
            const Validator_errors = v.getErrors();
            const error = Object.values(Validator_errors)[0][0];
            return {
                code: true,
                message: error
            };
        } 
        return {
            code: false,
            message: ""
        };
    }

    async sendMail(subject, to_email, message) {
        try {
            if (!to_email || to_email.trim() === "") {
                throw new Error("Recipient email is empty or undefined!");
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: constants.mailer_email,
                    pass: constants.mailer_password
                }
            });

            const mailOptions = {
                from: constants.from_email,
                to: to_email,
                subject: subject,
                text: message
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(info)
;
            return { success: true, info };
        } catch (error) {
            console.log(error);
            return { success: false, error };
        }
    }
  
    async encrypt (data) {
        try{
            console.log(data,'encry');
            
            return cryptLib.encrypt(JSON.stringify(data), constants.encryptionKey, constants.encryptionIV);
        }catch(error){
            return error;
        }
    } 

    decryptPlain(data) {
        console.log('data======c',data);
        
        const decData = cryptLib.decrypt(data, constants.encryptionKey, constants.encryptionIV);
        // console.log('decData======c',decData);
        return decData
        
    }

    decryptString (data){
        console.log('data======c',data);
        try{

            if(data){
                return cryptLib.decrypt(data, constants.encryptionKey, constants.encryptionIV);
            }else{
                return;
            }
        }catch(error){
            return error;
        }
    }
    // encrypt(data){
    //     return cryptolib.encrypt(JSON.stringify(data));
    // }
}
module.exports = new common;
/*
async compeleteUserProfile(request_data, callback) {
    console.log("Request Data:", request_data);
    if (!request_data || !request_data.user_id) {
        return callback({
            code: response_code.OPERATION_FAILED,
            message: "Invalid request data"
        });
    }    
    try {
        
        await common.getUserDetail(request_data.user_id, async(err, userResult) => {
            if (err || !userResult) {
                return callback({
                    code: response_code.OPERATION_FAILED,
                    message: t('user_not_found')
                });
            }

            console.log("User Result:", userResult);
            // Step-by-step verification
            if (parseInt(userResult.isstep_) < 1) {
                return callback({
                    code: response_code.OPERATION_FAILED,
                    message: "Please verify your OTP before updating your profile."
                });
            }

            let updatedData = {};
            let nextStep = parseInt(userResult.isstep_);  // Convert to number

            console.log("Current step (as number):", nextStep);

            // Compare with numbers, not strings
            if(nextStep === 1){
                if (!request_data.latitude || !request_data.longitude) {
                    return callback({
                        code: response_code.OPERATION_FAILED,
                        message: "Please provide latitude and longitude."
                    });
                }
                // Debug the values being set
                console.log("Setting latitude:", request_data.latitude);
                console.log("Setting longitude:", request_data.longitude);

                updatedData = {
                    latitude: request_data.latitude,
                    longitude: request_data.longitude,
                    isstep_: '2'
                };
                nextStep = 2;
            }else if(nextStep === 2){
                if (!request_data.goal_id) {
                    return callback({
                        code: response_code.OPERATION_FAILED,
                        message: "Please provide a fitness goal."
                    });
                }
                updatedData = {
                    goal_id: request_data.goal_id,
                    isstep_: '3'
                };
                nextStep = 3;
            }else if(nextStep === 3){
                if (!request_data.gender || !request_data.current_weight_kg || 
                    !request_data.target_weight_kg || !request_data.current_height_cm || 
                    !request_data.activity_level) {
                    return callback({
                        code: response_code.OPERATION_FAILED,
                        message: "Please provide all required profile details."
                    });
                }

                updatedData = {
                    gender: request_data.gender,
                    current_weight_kg: request_data.current_weight_kg,
                    target_weight_kg: request_data.target_weight_kg,
                    current_height_cm: request_data.current_height_cm,
                    activity_level: request_data.activity_level,
                    isstep_: '4',
                    is_profile_completed: 1
                };
                nextStep = 4;
            }
            // Debug before update
            console.log("Data to update:", updatedData);
            console.log("Updated data keys length:", Object.keys(updatedData).length);
            
            // Check if we have data to update
            if (Object.keys(updatedData).length === 0) {
                return callback({
                    code: response_code.OPERATION_FAILED,
                    message: "No data to update for current step."
                });
            }

            try{
                const updatedUser = await common.updateUserInfo(request_data.user_id, updatedData);
                console.log("Update result:", updatedUser);
                
                if (nextStep === 4) {
                    // Step 5: Profile Completion - Generate Token
                    const userToken = common.generateToken(40);
                    const deviceToken = common.generateToken(40);

                    await Promise.all([
                        database.query("UPDATE tbl_user SET token = ? WHERE user_id = ?", [userToken, request_data.user_id]),
                        database.query("UPDATE tbl_device_info SET device_token = ? WHERE user_id = ?", [deviceToken, request_data.user_id])
                    ]);

                    return callback({
                        code: response_code.SUCCESS,
                        message: "Profile completed successfully.",
                        data: {
                            token: userToken,
                            device_token: deviceToken
                        }
                    });
                }

                return callback({
                    code: response_code.SUCCESS,
                    message: "Step completed successfully.",
                    nextStep: nextStep
                });
            }catch (updateError) {
                callback({
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + updateError.message
                });
            }
        });
    } catch (error) {
        callback({
            code: response_code.OPERATION_FAILED,
            message: t('rest_keywords_something_went_wrong') + error.message
        }, null);
    }  
}
    */
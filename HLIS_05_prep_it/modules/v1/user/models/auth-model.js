const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const md5 = require("md5");
const {default: localizify} = require('localizify');
const { t } = require("localizify");


class UserModel {
    
    async signup(request_data) {
        try {
            const { email_id, signup_type, device_type, os_version, app_version, time_zone, full_name, code_id, phone_number, password_, social_id } = request_data;

            const device_data = {
                device_type,
                os_version,
                app_version,
                time_zone
            };

            let userData;

            // Check if user already exists
            const existingUser = signup_type === 'S'
                ? await common.findExistingUser(database, email_id, phone_number)
                : await common.findExistingUser(database, email_id);

            if (existingUser.length > 0) {
                return await common.handleExistingUserOTP(database, existingUser[0]);
            }

            if (signup_type === 'S') {
                userData = {
                    full_name,
                    email_id,
                    code_id,
                    phone_number,
                    password_: md5(password_),
                    signup_type,
                    login_type: signup_type
                };
            } else {
                userData = {
                    email_id,
                    social_id,
                    signup_type
                };
            }
            const insertIntoUser = `INSERT INTO tbl_user SET ?`;
            const [insertResult] = await database.query(insertIntoUser, [userData]);

            device_data.device_token = common.generateToken(40);
            console.log("Device Data:", device_data); 
            
            device_data.user_id = insertResult.insertId;

            const insertDeviceData = `INSERT INTO tbl_device_info SET ?`;
            await database.query(insertDeviceData, device_data);

            const otp_ = common.generateOTP();
            console.log("Generated OTP:", otp_);

            const updateOtpQuery = `UPDATE tbl_user SET otp = ?, is_profile_completed = 0 WHERE user_id = ?`;
            await database.query(updateOtpQuery, [otp_, insertResult.insertId]);

            // Fetch user details
            const userFind = `SELECT full_name FROM tbl_user WHERE user_id = ? AND is_active = 1 AND is_deleted = 0`;
            const [user] = await database.query(userFind, [insertResult.insertId]);

            return {
                code: response_code.SUCCESS,
                message: t('signup_success'),
                data: user
            };

        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async validateOTP(request_data) {
        try {
                       const { phone_number, otp } = request_data;
                       const selectUserQuery = `
                           SELECT user_id, otp, is_profile_completed 
                           FROM tbl_user 
                           WHERE phone_number = ? AND is_active = 1 AND is_deleted = 0
                       `;
                       const [userResult] = await database.query(selectUserQuery, [phone_number]);
               
                       if (userResult.length === 0) {
                           return {
                               code: response_code.NOT_FOUND,
                               message: t('phone_number_not_registered')
                           };
                       }
               
                       const user = userResult[0];
                       const user_id = user.user_id;
               
                       if (!user.otp) {
                           return {
                               code: response_code.OPERATION_FAILED,
                               message: t('otp_not_found')
                           };
                       }
                       console.log("User OTP:", user.otp);
                          console.log("Request OTP:", otp == user.otp);
                       if (otp == user.otp) {
                           const updateUserQuery = `
                               UPDATE tbl_user 
                               SET otp = NULL, 
                                   is_profile_completed = 1 
                               WHERE user_id = ?
                           `;
                           await database.query(updateUserQuery, [user_id]);

                        const userToken = common.generateToken(40);
                        const deviceToken = common.generateToken(40);
                
                        await database.query(
                            "UPDATE tbl_device_info SET device_token = ?, user_token = ? WHERE user_id = ?", 
                            [deviceToken, userToken, user_id]
                        );

                         return callback({
                            code: response_code.SUCCESS,
                            message: "OTP verified successfully",
                            data: {
                                 token: userToken,
                                 device_token: deviceToken
                            }
                        });
                       } else {
                           return {
                               code: response_code.OPERATION_FAILED,
                               message: t('invalid_otp')
                           };
                       }
               
                   } catch (error) {
                       return {
                           code: response_code.OPERATION_FAILED,
                           message: t('some_error_occurred'),
                           data: error.message
                       };
                   }
    };

    async resendOTP(request_data, callback) {
        try {
           
            if (!request_data.email_id) {
                return callback({
                    code: response_code.OPERATION_FAILED,
                    message: "Email address is required"
                });
            }
    
            // Find user by email
            const checkUserQuery = "SELECT * FROM tbl_user WHERE email_id = ?";
            const [userResult] = await database.query(checkUserQuery, [request_data.email_id]);
            
            if (!userResult || userResult.length === 0) {
                return callback({
                    code: response_code.OPERATION_FAILED,
                    message: "User not found with this email"
                });
            }
    
            const user_id = userResult[0].user_id;
            
            // Generate new OTP
            const generated_otp = common.generateOTP();
            console.log("Generated new OTP:", generated_otp);
    
            // Check if OTP record already exists for this user
            const checkOTPQuery = "SELECT * FROM tbl_otp WHERE user_id = ? AND action = 'signup'";
            const [existingOTP] = await database.query(checkOTPQuery, [user_id]);
    
            if (existingOTP && existingOTP.length > 0) {
                // Update existing OTP
                const updateOtpQuery = "UPDATE tbl_otp SET otp = ?, verify = 0, created_at = ? WHERE user_id = ? AND action = 'signup'";
                const [updateResult] = await database.query(updateOtpQuery, [
                    generated_otp, 
                    new Date(), 
                    user_id
                ]);
                
                console.log("Update OTP Result:", updateResult);
                
                if (updateResult.affectedRows === 0) {
                    return callback({
                        code: response_code.OPERATION_FAILED,
                        message: "Failed to update OTP"
                    });
                }
            } else {
                // Create new OTP record
                const otp_data = {
                    user_id: user_id,
                    action: "signup",
                    verify_with: "email",
                    verify: 0,
                    otp: generated_otp,
                    created_at: new Date()
                };
                
                const insertOtpQuery = "INSERT INTO tbl_otp SET ?";
                console.log("Executing insert query:", insertOtpQuery, otp_data);
                const [insertResult] = await database.query(insertOtpQuery, otp_data);
                
                console.log("Insert OTP Result:", insertResult);
                
                if (!insertResult || insertResult.affectedRows === 0) {
                    return callback({
                        code: response_code.OPERATION_FAILED,
                        message: "Failed to create new OTP"
                    });
                }
            }
            
            return callback({
                code: response_code.SUCCESS,
                message: "OTP resent successfully to your email"
            });
            
        } catch (error) {
            console.error("Error in resendOTP:", error);
            return callback({
                code: response_code.OPERATION_FAILED,
                message: "Error resending OTP: " + (error.message || error)
            });
        }
    }

    async forgotPassword(request_data) {
        try {
            const emailOrPhone = request_data.email_id || request_data.phone_number;
    
            if (!emailOrPhone) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Please provide either email or phone number"
                };
            }
    
            // Fetch user based on provided input
            const selectQuery = `SELECT user_id, email_id, phone_number FROM tbl_user WHERE email_id = ? OR phone_number = ?`;
            const [result] = await database.query(selectQuery, [emailOrPhone, emailOrPhone]);
    
            if (result.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "User not found"
                };
            }
    
            const user = result[0];
    
            // Generate OTP
            const otp = common.generateOTP();
            console.log("Generated OTP:", otp);
    
            // Determine whether email or phone should be used
            const identifierField = user.email_id === emailOrPhone ? "email_id" : "phone_number";
            const identifierValue = user.email_id === emailOrPhone ? user.email_id : user.phone_number;
    
            // Store OTP in `tbl_forgot_passwords`
            const insertOtpQuery = `
                INSERT INTO tbl_forgot_passwords (${identifierField}, otp, created_at, expires_at) 
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 10 MINUTE)) 
                ON DUPLICATE KEY UPDATE 
                otp = VALUES(otp), created_at = NOW(), expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE)`;
    
            await database.query(insertOtpQuery, [identifierValue, otp]);
    
            return {
                code: response_code.SUCCESS,
                message: "OTP sent successfully. Please verify.",
                user_id: user.user_id
            };
    
        } catch (error) {
            console.error("Database Error:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Database error occurred: " + (error.sqlMessage || error.message)
            };
        }
    }
    
    async validateForgotPasswordOTP(request_data) {
        try {
            const { email_id, phone_number, otp } = request_data;
    
            // Step 1: Fetch OTP from forgot password table
            const selectOtpQuery = `
                SELECT otp FROM tbl_forgot_passwords 
                WHERE (email_id = ? OR phone_number = ?) 
                AND expires_at > NOW() 
                AND is_deleted = 0
            `;
            const [otpResult] = await database.query(selectOtpQuery, [email_id, phone_number]);
            
            if (!otpResult || otpResult.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: "OTP not found or expired"
                };
            }
    
            const storedOtp = otpResult[0].otp;
            console.log("Stored OTP:", storedOtp);
            console.log("Request OTP:", otp);
    
            if (otp != storedOtp) {  
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Invalid OTP."
                };
            }
    
            // Step 2: Fetch user_id from tbl_user using email_id or phone_number
            const selectUserQuery = `
                SELECT user_id FROM tbl_user 
                WHERE (email_id = ? OR phone_number = ?) 
                AND is_active = 1 AND is_deleted = 0
            `;
            const [userResult] = await database.query(selectUserQuery, [email_id, phone_number]);
    
            if (!userResult || userResult.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: "User not found"
                };
            }
    
            const user_id = userResult[0].user_id;
    
            // Step 3: Mark OTP as verified
            const updateOtpStatus = `
                UPDATE tbl_forgot_passwords 
                SET is_verified = 1
                WHERE (email_id = ? OR phone_number = ?)
            `;
            await database.query(updateOtpStatus, [email_id, phone_number]);
    
            // Step 4: Generate user token & device token
            const userToken = common.generateToken(40);
            const deviceToken = common.generateToken(40);
    
            // Step 5: Update tbl_device_info with new tokens
            await database.query(
                "UPDATE tbl_device_info SET device_token = ?, user_token = ? WHERE user_id = ?", 
                [deviceToken, userToken, user_id]
            );
    
            return {
                code: response_code.SUCCESS,
                message: "OTP verified successfully",
                data: {
                    token: userToken,
                    device_token: deviceToken
                }
            };
    
        } catch (error) {
            console.error("Database Error:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Database error occurred: " + (error.sqlMessage || error.message)
            };
        }
    }
    
    
    async resetPassword(request_data) {
        try {
            const { email_id, phone_number, password_ } = request_data;
    
            if (!password_) {
                return {
                    code: 400,
                    message: "Password is required"
                };
            }

            const checkVerificationQuery = `
                SELECT is_verified FROM tbl_forgot_passwords 
                WHERE (email_id = ? OR phone_number = ?) 
                AND is_deleted = 0
            `;
            const [verificationResult] = await database.query(checkVerificationQuery, [email_id, phone_number]);
    
            if (!verificationResult.length || verificationResult[0].is_verified !== 1) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "OTP verification required before resetting password"
                };
            }
            const getUserQuery = "SELECT user_id FROM tbl_user WHERE email_id = ? OR phone_number = ?";
            const [userResult] = await database.query(getUserQuery, [email_id, phone_number]);
    
            if (!userResult || userResult.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "User not found"
                };
            }
    
            const user_id = userResult[0].user_id;
            const passwordHash = md5(password_);

            const updateQuery = "UPDATE tbl_user SET password_ = ? WHERE user_id = ?";
            const [result] = await database.query(updateQuery, [passwordHash, user_id]);
    
            if (result.affectedRows === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Password reset failed"
                };
            }
    
            const softDeleteOtpQuery = `
                UPDATE tbl_forgot_passwords 
                SET is_deleted = 1 
                WHERE (email_id = ? OR phone_number = ?)
            `;
            await database.query(softDeleteOtpQuery, [email_id, phone_number]);
    
            return {
                code: response_code.SUCCESS,
                message: "Password reset successful"
            };
    
        } catch (error) {
            console.error("Database Error:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Database error occurred: " + (error.sqlMessage || error.message)
            };
        }
    }
    
    async changePassword(request_data,user_id) {
        console.log("USER ID:", user_id);
        try {
            let oldPassword = request_data.old_password; // Old password from user input
            let newPassword = request_data.new_password; // New password from user input
            let confirmPassword = request_data.confirm_password; // Confirm password from user input
            // Hash the passwords
            const oldPasswordHash = md5(oldPassword || "");
            const newPasswordHash = md5(newPassword || "");
            const confirmPasswordHash = md5(confirmPassword || "");

            const selectQuery = `SELECT password_ FROM tbl_user WHERE user_id = ?`;
            const [result] = await database.query(selectQuery,[user_id]);

            if (result[0].password_ !== oldPasswordHash) {
                return {    
                    code: response_code.OPERATION_FAILED,
                    message: "Old password is incorrect"
                };
            }
            if (oldPasswordHash === newPasswordHash) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Old password and new password should not be same"
                };
            }
            if (newPasswordHash !== confirmPasswordHash) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "New password and confirm password should be same"
                };
            }
            const updateQuery = `UPDATE tbl_user SET password_ = ? WHERE user_id = ${user_id}`;
            const [updateResult] = await database.query(updateQuery, [newPasswordHash]);
            // Check if the update was successful
            if (updateResult.affectedRows === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Failed to update password"
                };
            }
           return {
                code: response_code.SUCCESS,
                message: "Password updated successfully"
            };


        } catch (error) {
            console.error("Database Error:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Database error occurred: " + (error.sqlMessage || error.message)
            };
        }
    }

    async login(request_data) {
        try {
            
            if (!request_data.email_id) {
                return {
                    code: response_code.BAD_REQUEST,
                    message: "Email is required"
                };
            }
    
            // const passwordHash = md5(request_data.password_);
    
            let selectUserWithCred;
            let params;

            if (request_data.login_type === "S") {
                if (!request_data.password_) {
                    return {
                        code: response_code.BAD_REQUEST,
                        message: "Password is required for standard login"
                    };
                }
                const passwordHash = md5(request_data.password_);
                selectUserWithCred = "SELECT * FROM tbl_user WHERE email_id = ? AND password_ = ? AND signup_type = ?";
                params = [request_data.email_id, passwordHash, "S"];
            } else if (["G", "F", "A"].includes(request_data.login_type)) {
                selectUserWithCred = "SELECT * FROM tbl_user WHERE social_id = ? AND email_id = ? AND signup_type = ?";
                params = [request_data.social_id, request_data.email_id, request_data.login_type.toLowerCase()];
            } else {
                return {
                    code: response_code.INVALID_REQUEST,
                    message: "Invalid Login Type"
                };
            }

            const [status] = await database.query(selectUserWithCred, params);
    
            if (status.length === 0) {
                console.log("No user found");
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_data_found')
                };
            }
    
            const user_id = status[0].user_id;
    
            const userToken = common.generateToken(40);
            const deviceToken = common.generateToken(40);

            await database.query("UPDATE tbl_device_info SET device_token = ?, user_token = ? WHERE user_id = ?", [deviceToken, userToken, user_id]);

            const userInfo = await common.getUserDetailLogin(user_id);
            if (!userInfo) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_data_found')
                };
            }
    
            return {
                code: response_code.SUCCESS,
                message: t('login_success'),
                data: userInfo
            };
    
        } catch (error) {
            console.error("Login error:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: error.sqlMessage || error.message
            };
        }
    }
    





}
module.exports = new UserModel();

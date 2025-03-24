const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const md5 = require("md5");
const {default: localizify} = require('localizify');
const { t } = require("localizify");


class UserModel {
    
    async signup(request_data) {
        try {
            const { email_id, signup_type, device_type, os_version, app_version, time_zone, full_name, code_id, phone_number, password_, social_id,company_name} = request_data;

            const device_data = {
                device_type,
                os_version,
                app_version,
                time_zone
            };

            let userData;

            // Check if user already exists
            const existingUser = signup_type === 'S'
                ? await common.findExistingDriver(database, email_id, phone_number)
                : await common.findExistingDriver(database, email_id);

            if (existingUser.length > 0) {
                return await common.handleExistingDriverOTP(database, existingUser[0]);
            }

            if (signup_type === 'S') {
                userData = {
                    full_name,
                    email_id,
                    code_id,
                    phone_number,
                    password_: md5(password_),
                    company_name: company_name,
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
            const insertIntoUser = `INSERT INTO tbl_driver SET ?`;
            const [insertResult] = await database.query(insertIntoUser, [userData]);

            device_data.device_token = common.generateToken(40);
            console.log("Device Data:", device_data); 
                        
            device_data.driver_id = insertResult.insertId;
            
            const insertDeviceData = `INSERT INTO tbl_device_info_driver SET ?`;
            await database.query(insertDeviceData, device_data);
            
            const otp_ = common.generateOTP();
            console.log("Generated OTP:", otp_);

            const updateOtpQuery = `UPDATE tbl_driver SET otp = ?, is_profile_completed = 0 WHERE driver_id = ?`;
            await database.query(updateOtpQuery, [otp_, insertResult.insertId]);

            // Fetch user details
            const userFind = `SELECT full_name FROM tbl_driver WHERE driver_id = ? AND is_active = 1 AND is_deleted = 0`;
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
                           SELECT driver_id, otp, is_profile_completed 
                           FROM tbl_driver 
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
                       const driver_id = user.driver_id;
               
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
                               UPDATE tbl_driver
                               SET otp = NULL, 
                                   is_profile_completed = 1 
                               WHERE driver_id = ?
                           `;
                           await database.query(updateUserQuery, [driver_id]);

                        const userToken = common.generateToken(40);
                        const deviceToken = common.generateToken(40);
                        console.log("User Token:", userToken);
                        console.log("Device Token:", deviceToken);
                        console.log("Driver ID:", driver_id);
                
                        await database.query(
                            "UPDATE tbl_device_info_driver SET device_token = ?, driver_token = ? WHERE driver_id = ?", 
                            [deviceToken, userToken, driver_id]
                        );

                         return {
                            code: response_code.SUCCESS,
                            message: "OTP verified successfully",
                            data: {
                                 token: userToken,
                                 device_token: deviceToken
                            }
                        };
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

    // async resendOTP(request_data, callback) {
    //     try {
           
    //         if (!request_data.email_id) {
    //             return callback({
    //                 code: response_code.OPERATION_FAILED,
    //                 message: "Email address is required"
    //             });
    //         }
    
    //         // Find user by email
    //         const checkUserQuery = "SELECT * FROM tbl_user WHERE email_id = ?";
    //         const [userResult] = await database.query(checkUserQuery, [request_data.email_id]);
            
    //         if (!userResult || userResult.length === 0) {
    //             return callback({
    //                 code: response_code.OPERATION_FAILED,
    //                 message: "User not found with this email"
    //             });
    //         }
    
    //         const user_id = userResult[0].user_id;
            
    //         // Generate new OTP
    //         const generated_otp = common.generateOTP();
    //         console.log("Generated new OTP:", generated_otp);
    
    //         // Check if OTP record already exists for this user
    //         const checkOTPQuery = "SELECT * FROM tbl_otp WHERE user_id = ? AND action = 'signup'";
    //         const [existingOTP] = await database.query(checkOTPQuery, [user_id]);
    
    //         if (existingOTP && existingOTP.length > 0) {
    //             // Update existing OTP
    //             const updateOtpQuery = "UPDATE tbl_otp SET otp = ?, verify = 0, created_at = ? WHERE user_id = ? AND action = 'signup'";
    //             const [updateResult] = await database.query(updateOtpQuery, [
    //                 generated_otp, 
    //                 new Date(), 
    //                 user_id
    //             ]);
                
    //             console.log("Update OTP Result:", updateResult);
                
    //             if (updateResult.affectedRows === 0) {
    //                 return callback({
    //                     code: response_code.OPERATION_FAILED,
    //                     message: "Failed to update OTP"
    //                 });
    //             }
    //         } else {
    //             // Create new OTP record
    //             const otp_data = {
    //                 user_id: user_id,
    //                 action: "signup",
    //                 verify_with: "email",
    //                 verify: 0,
    //                 otp: generated_otp,
    //                 created_at: new Date()
    //             };
                
    //             const insertOtpQuery = "INSERT INTO tbl_otp SET ?";
    //             console.log("Executing insert query:", insertOtpQuery, otp_data);
    //             const [insertResult] = await database.query(insertOtpQuery, otp_data);
                
    //             console.log("Insert OTP Result:", insertResult);
                
    //             if (!insertResult || insertResult.affectedRows === 0) {
    //                 return callback({
    //                     code: response_code.OPERATION_FAILED,
    //                     message: "Failed to create new OTP"
    //                 });
    //             }
    //         }
            
    //         return callback({
    //             code: response_code.SUCCESS,
    //             message: "OTP resent successfully to your email"
    //         });
            
    //     } catch (error) {
    //         console.error("Error in resendOTP:", error);
    //         return callback({
    //             code: response_code.OPERATION_FAILED,
    //             message: "Error resending OTP: " + (error.message || error)
    //         });
    //     }
    // }

    async forgotPassword(request_data) {
        try {
            const emailOrPhone = request_data.email_id || request_data.phone_number;
    
            if (!emailOrPhone) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Please provide either email or phone number"
                };
            }

            const selectQuery = `SELECT driver_id, email_id, phone_number FROM tbl_driver WHERE email_id = ? OR phone_number = ?`;
            const [result] = await database.query(selectQuery, [emailOrPhone, emailOrPhone]);
    
            if (result.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "User not found"
                };
            }
    
            const user = result[0];

            const otp = common.generateOTP();
            console.log("Generated OTP:", otp);

            const identifierField = user.email_id === emailOrPhone ? "email_id" : "phone_number";
            const identifierValue = user.email_id === emailOrPhone ? user.email_id : user.phone_number;

            const insertOtpQuery = `
                INSERT INTO tbl_forgot_password_driver (${identifierField}, otp, created_at, expires_at) 
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 10 MINUTE)) 
                ON DUPLICATE KEY UPDATE 
                otp = VALUES(otp), created_at = NOW(), expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE)`;
    
            await database.query(insertOtpQuery, [identifierValue, otp]);
    
            return {
                code: response_code.SUCCESS,
                message: "OTP sent successfully. Please verify.",
                user_id: user.driver_id
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
                SELECT otp FROM tbl_forgot_password_driver
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
                SELECT driver_id FROM tbl_driver 
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
    
            const driver_id = userResult[0].driver_id;
    
            // Step 3: Mark OTP as verified
            const updateOtpStatus = `
                UPDATE tbl_forgot_password_driver 
                SET is_verified = 1
                WHERE (email_id = ? OR phone_number = ?)
            `;
            await database.query(updateOtpStatus, [email_id, phone_number]);
    
            // Step 4: Generate user token & device token
            const userToken = common.generateToken(40);
            const deviceToken = common.generateToken(40);
    
            const checkDeviceQuery = `
                SELECT 1 FROM tbl_device_info_driver WHERE driver_id = ?
            `;
            const [deviceExists] = await database.query(checkDeviceQuery, [driver_id]);

            if (deviceExists.length === 0) {
                // Insert new device info
                const insertDeviceQuery = `
                    INSERT INTO tbl_device_info_driver (driver_id, device_token, driver_token) 
                    VALUES (?, ?, ?)
                `;
                await database.query(insertDeviceQuery, [driver_id, deviceToken, userToken]);
            } else {
                // Update existing device info
                const updateDeviceQuery = `
                    UPDATE tbl_device_info_driver 
                    SET device_token = ?, driver_token = ? 
                    WHERE driver_id = ?
                `;
                await database.query(updateDeviceQuery, [deviceToken, userToken, driver_id]);
            }
    
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
                SELECT is_verified FROM tbl_forgot_password_driver
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
            const getUserQuery = "SELECT driver_id FROM tbl_driver WHERE email_id = ? OR phone_number = ?";
            const [userResult] = await database.query(getUserQuery, [email_id, phone_number]);
    
            if (!userResult || userResult.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "User not found"
                };
            }
    
            const driver_id = userResult[0].driver_id;
            const passwordHash = md5(password_);

            const updateQuery = "UPDATE tbl_driver SET password_ = ? WHERE driver_id = ?";
            const [result] = await database.query(updateQuery, [passwordHash, driver_id]);
    
            if (result.affectedRows === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Password reset failed"
                };
            }
    
            const softDeleteOtpQuery = `
                UPDATE tbl_forgot_password_driver
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
    
    async changePassword(request_data,driver_id) {
        console.log("USER ID:", driver_id);
        try {
            let oldPassword = request_data.old_password; // Old password from user input
            let newPassword = request_data.new_password; // New password from user input
            let confirmPassword = request_data.confirm_password; // Confirm password from user input
            // Hash the passwords
            const oldPasswordHash = md5(oldPassword || "");
            const newPasswordHash = md5(newPassword || "");
            const confirmPasswordHash = md5(confirmPassword || "");

            const selectQuery = `SELECT password_ FROM tbl_driver WHERE driver_id = ?`;
            const [result] = await database.query(selectQuery,[driver_id]);

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
            const updateQuery = `UPDATE tbl_driver SET password_ = ? WHERE driver_id = ${driver_id}`;
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
                selectUserWithCred = "SELECT * FROM tbl_driver WHERE email_id = ? AND password_ = ? AND signup_type = ?";
                params = [request_data.email_id, passwordHash, "S"];
            } else if (["G", "F", "A"].includes(request_data.login_type)) {
                selectUserWithCred = "SELECT * FROM tbl_driver WHERE social_id = ? AND email_id = ? AND signup_type = ?";
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
    
            const driver_id = status[0].driver_id;
    
            const userToken = common.generateToken(40);
            const deviceToken = common.generateToken(40);

            await database.query("UPDATE tbl_device_info_driver SET device_token = ?, driver_token = ? WHERE driver_id = ?", [deviceToken, userToken, driver_id]);

            const userInfo = await common.getDriverDetailLogin(driver_id);
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

    async add_vehicle_data(request_data, driver_id){
        try{
            const vehicle_data = {
                driver_id: driver_id,
                vehicle_type_id: request_data.vehicle_type_id,
                vehicle_company: request_data.vehicle_company,
                vehicle_model: request_data.vehicle_model,
                vehicle_number: request_data.vehicle_number,
                vehicle_rto: request_data.vehicle_rto,
                
            }

            const [existing_data] = await database.query(`SELECT vehicle_number FROM tbl_vehicle_details WHERE vehicle_number = ?`, [vehicle_data.vehicle_number]);
            if(existing_data.length > 0){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('vehicle_already_added')
                };
            }

            const insertVechicleData = `INSERT INTO tbl_vehicle_details SET ?`;
            const [newvehicle] = await database.query(insertVechicleData, [vehicle_data]);

            return {
                code: response_code.SUCCESS,
                message: t('vehicle_data_added'),
                data: "Thank you for adding vehicle data"
            };

        } catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            }
        }
    } 
        
    async show_nearby_orders(request_data, driver_id){
        try{
           if(!driver_id){
                return {
                     code: response_code.OPERATION_FAILED,
                     message: t('driver_id_required')
                };
           }
           const [driver]=await database.query(`SELECT latitude, longitude FROM tbl_driver WHERE driver_id = ? AND is_active = 1`,[driver_id])

           if (!driver || driver.length === 0) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('driver_not_found')
            };
        }
            const driver_latitude = parseFloat(driver[0].latitude);
            const driver_longitude = parseFloat(driver[0].longitude);

            if (!driver_latitude || !driver_longitude) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('driver_location_not_available')
                };
            }

            const [orders] = await database.query(` SELECT 
                        do.*,
                        v.vehicle_model,
                        v.vehicle_number,
                        (
                            6371 * acos(
                                cos(radians(?)) * cos(radians(do.pickup_latitude)) * 
                                cos(radians(do.pickup_longitude) - radians(?)) + 
                                sin(radians(?)) * sin(radians(do.pickup_latitude))
                            )
                        ) AS distance_from_driver
                    FROM tbl_delivery_order do
                    LEFT JOIN tbl_vehicle_details v ON do.veh_det_id = v.veh_det_id
                    WHERE do.status = 'pending'
                    AND do.is_canceled = 0
                    HAVING distance_from_driver <= 0
                    ORDER BY distance_from_driver ASC
                    LIMIT 20`, [driver_latitude, driver_longitude, driver_latitude]);

                    if (orders.length === 0) {
                        return {
                            code: response_code.SUCCESS,
                            message: t('no_nearby_orders_found'),
                            data: {
                                orders: []
                            }
                        };
                    }

                    const [user_data] = await database.query(`SELECT full_name, phone_number FROM tbl_user WHERE user_id = ?`, [orders[0].user_id]);
                    const user = user_data[0];
    
                    const formattedOrders = orders.map(order => ({
                        order_id: order.order_id,
                        user: user,
                        pickup: {
                            latitude: order.pickup_latitude,
                            longitude: order.pickup_longitude,
                            address: order.pickup_address
                        },
                        dropoff: {
                            latitude: order.dropoff_latitude,
                            longitude: order.dropoff_longitude,
                            address: order.dropoff_address
                        },
                        distance_km: order.distance_km,
                        total_price: order.total_price,
                        requires_pod: order.requires_pod,
                        scheduled_time: order.scheduled_time,
                        status: order.status,
                        distance_from_driver: Math.round(order.distance_from_driver * 100) / 100,
                        created_at: order.created_at,
                        updated_at: order.updated_at
                    }));
    
                    return {
                        code: response_code.SUCCESS,
                        message: t('nearby_orders_listed_successfully'),
                        data: {
                            orders: formattedOrders
                        }
                    };
        
        }catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
        }
    }
    }

    async acceptOrder(request_data, driver_id){
        try{
            const {order_id} = request_data;
            if(!order_id){
                return {
                     code: response_code.OPERATION_FAILED,
                     message: t('order_id_required')
                };
            }
            const [order] = await database.query(`SELECT * FROM tbl_delivery_order WHERE order_id = ? and status='pending' and is_canceled=0`, [order_id]);
            if (!order || order.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('order_not_found')
                };
            }

            const [driver] = await database.query(`SELECT * FROM tbl_driver WHERE driver_id = ? AND is_active = 1`, [driver_id]);
            if (!driver || driver.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('driver_not_found')
                };
            }
            const [vehicle] = await database.query(`SELECT * FROM tbl_vehicle_details WHERE driver_id= ?`, [driver_id]);
            if (!vehicle || vehicle.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('vehicle_not_found')
                };
            }
            const veh_det_id = vehicle[0].veh_det_id;
            const updateOrder = `UPDATE tbl_delivery_order SET status = 'accepted', delivery_status = 'confirmed',veh_det_id = ? WHERE order_id = ?`;
            await database.query(updateOrder, [veh_det_id, order_id]);
            return {
                code: response_code.SUCCESS,
                message: t('order_accepted_successfully')
            }

            

        }catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
        }
    }
    }

    async deliveryStatus(request_data,driver_id){
        try{
            const {order_id, delivery_status} = request_data;
            if(!order_id || !delivery_status){
                return {
                     code: response_code.OPERATION_FAILED,
                     message: t('missing_mandatory_fields')
                };
            }
            const [order] = await database.query(`SELECT * FROM tbl_delivery_order WHERE order_id = ? and status="accepted" and is_canceled=0`, [order_id]);
            if (!order || order.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('order_not_found')
                };
            }
            const [driver] = await database.query(`SELECT * FROM tbl_driver WHERE driver_id = ? AND is_active = 1`, [driver_id]);
            if(driver[0].driver_id !==driver_id){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('unauthorized_driver')
                };
            }

            const validStatuses = ['waytopickup', 'waytodropoff'];
            if(!validStatuses.includes(delivery_status)){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('invalid_delivery_status')
                };
            }
            if(delivery_status=="waytodropoff"){
                const otp=common.generateOTP();
                await database.query(`UPDATE tbl_delivery_order SET delivery_otp=? WHERE order_id = ?`, [otp, order_id]);
            }
            const updateOrder = `UPDATE tbl_delivery_order SET delivery_status = ?,updated_at=NOW() WHERE order_id = ?`;
            await database.query(updateOrder, [delivery_status, order_id]);

            return{
                code: response_code.SUCCESS,
                message: t('delivery_status_updated_successfully')
            }
        }catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
        }
    }
    }

    async verifyDelivery(request_data,driver_id){
        try{
            const {order_id, delivery_otp} = request_data;
            if(!order_id || !delivery_otp){
                return {
                     code: response_code.OPERATION_FAILED,
                     message: t('missing_mandatory_fields')
                };
            }
            
            const [order] = await database.query(`SELECT * FROM tbl_delivery_order WHERE order_id = ?`, [order_id]);
            if (!order || order.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('order_not_found')
                };
            }
            const [driver] = await database.query(`SELECT * FROM tbl_vehicle_details WHERE driver_id = ? AND is_active = 1`, [driver_id]);
            const vehicle_id = driver[0].veh_det_id;
            if(order[0].veh_det_id !== vehicle_id){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('unauthorized_driver')
            }
        }
            if(order[0].delivery_otp !== delivery_otp){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('invalid_otp')
                };
            }

            const updateOrder = `UPDATE tbl_delivery_order SET delivery_status = 'delivered',status ='completed' updated_at=NOW() WHERE order_id = ?`;
            await database.query(updateOrder, [order_id]);

            const distance_km = order[0].distance_km;
                const order_points = distance_km * 100;
                console.log(order_points);
                const earnings_rs = (order_points / 50) * 20;
                console.log(earnings_rs);
        
                await database.query(`
                    UPDATE tbl_delivery_order
                    SET delivery_otp = NULL, order_points = ?, 
                    earnings_rs = ?, updated_at = NOW()
                    WHERE order_id = ?
                `, [order_points, earnings_rs, order_id]);
        
                return {
                    code: response_code.SUCCESS,
                    message: t('otp_verified_successfully'),
                    data: order[0]
                };

        }catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
        }
    }
    }  

    async getUpcomingDeliveries(request_data, driver_id) {
        try {
            const [driverData] = await database.query(
                `SELECT * FROM tbl_vehicle_details WHERE driver_id = ?`,
                [driver_id]
            );
    
            console.log("Driver Data:", driverData[0]);
    
            if (!driverData || driverData.length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "No vehicle found"
                };
            }
    
            const vehicle_id = driverData[0].veh_det_id;
            console.log("Vehicle ID:", vehicle_id);
    
            const [orders] = await database.query(
                `SELECT * FROM tbl_delivery_order WHERE veh_det_id = ? AND status = 'accepted' AND delivery_status = 'confirmed'`,
                [vehicle_id]
            );
    
            console.log("Orders:", orders);
    
            if (orders.length === 0) {
                return {
                    code: response_code.SUCCESS,
                    message: t('no_upcoming_deliveries_found')
                };
            }
            const formattedOrders = orders.map(order => {
                let scheduledTime;
                try {
                    scheduledTime = new Date(order.scheduled_time);
                    if (isNaN(scheduledTime)) {
                        throw new Error("Invalid scheduled time");
                    }
                } catch (error) {
                    return {
                        pickup_address: order.pickup_address,
                        dropoff_address: order.dropoff_address,
                        order_date: "Invalid Date",
                        order_time: "Invalid Time"
                    };
                }
    
                const order_date = scheduledTime.toISOString().split('T')[0];
    
                let hours = scheduledTime.getHours();
                const minutes = String(scheduledTime.getMinutes()).padStart(2, '0');
                const seconds = String(scheduledTime.getSeconds()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
    
                const order_time = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    
                return {
                    pickup_address: order.pickup_address,
                    dropoff_address: order.dropoff_address,
                    order_date,
                    order_time
                };
            });
    
            return {
                code: response_code.SUCCESS,
                message: "Upcoming deliveries found",
                data: formattedOrders  // ✅ Returns an array
            };
    
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async showEarnings(request_data, driver_id) {
        try{

            const [driver] = await database.query(`SELECT * FROM tbl_vehicle_details where driver_id = ?`, [driver_id]);
            const vehicle_ids = driver.map(vehicle => vehicle.veh_det_id);
            var query;
            if(request_data.week){
                console.log("WEEK");
                    query = `
                    SELECT order_id, pickup_address, dropoff_address, earnings_rs
                    FROM tbl_delivery_order
                    WHERE veh_det_id IN (?)
                    AND status = 'completed'
                    AND delivery_status = 'delivered'
                    AND updated_at >= NOW() - INTERVAL 7 DAY`;
            }else if(request_data.month){
                console.log("MONTH");
                    query = `
                    SELECT order_id, pickup_address, dropoff_address, earnings_rs
                    FROM tbl_delivery_order
                    WHERE veh_det_id IN (?)
                    AND status = 'completed'
                    AND delivery_status = 'delivered'
                    AND updated_at >= NOW() - INTERVAL 30 DAY`;
            }else if(request_data.year){
                console.log("YEAR");
                    query = `
                    SELECT order_id, pickup_address, dropoff_address, earnings_rs
                    FROM tbl_delivery_order
                    WHERE veh_det_id IN (?)
                    AND status = 'completed'
                    AND delivery_status = 'delivered'
                    AND updated_at >= NOW() - INTERVAL 365 DAY`;
            }else{
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('missing_required_fields')
                };
            }

            const [orders] = await database.query(query, [vehicle_ids]);
            const formattedOrders= orders.map(order=>({
                order_id: order.order_id,
                pickup_address: order.pickup_address,
                dropoff_address: order.dropoff_address,
                earnings_rs: order.earnings_rs
            }))
            const totalEarnings = formattedOrders.reduce((sum, order) => sum + order.earnings_rs, 0).toFixed(2);
            const response ={
                orders: formattedOrders,
                total_earnings: totalEarnings
            }
            return {
                code: response_code.SUCCESS,
                message: t('orders_and_earnings_fetched_successfully'),
                data: response
            }; 
        }catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
        }
    }
}   
}
module.exports = new UserModel();

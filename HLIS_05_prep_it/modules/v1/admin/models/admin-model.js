const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const md5 = require("md5");
const {default: localizify} = require('localizify');
const { t } = require("localizify");
// const response_code=  require('../../../../utilities/response-error-code');

class AdminModel {
    async login_admin(request_data) {
        try {
            
            if (!request_data.email_id || !request_data.password_) {
                return {
                    code: response_code.BAD_REQUEST,
                    message: "Email and password are required"
                };
            }   
            
            const passwordHash = request_data.password_;
    
                // Query the user from the database
            const selectUserWithCred = "SELECT * FROM admin_ WHERE email_id = ? AND password_ = ?";
            const [status] = await database.query(selectUserWithCred, [request_data.email_id, passwordHash]);

            // If no user found
            if (status.length === 0) {
                console.log("No user found");
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_data_found')
                };
            }

            const admin_id = status[0].admin_id;
    
            const token = common.generateToken(40);
            const updateTokenQuery = "UPDATE admin_ SET token = ?, is_login = 1 WHERE admin_id = ?";
            await database.query(updateTokenQuery, [token, admin_id]);
    
            const device_token = common.generateToken(40);
            const updateDeviceToken = "UPDATE tbl_device_info_admin SET device_token = ? WHERE admin_id = ?";
            await database.query(updateDeviceToken, [device_token, admin_id]);
    
            // Using await with a Promise wrapper instead of callback pattern for getUserDetailLogin
            // const userInfo = await new Promise((resolve, reject) => {
            //     common.getAdminDetailLogin(admin_id, (err, userResult) => {
            //         if (err) {
            //             reject(err);
            //         } else {
            //             resolve(userResult);
            //         }
            //     });
            // });
            
            const userInfo = await common.getAdminDetailLogin(admin_id);
                if (!userInfo) {
                    return {
                        code: response_code.NOT_FOUND,
                        message: t('no_data_found')
                    };
                }

            userInfo.token = token;
            userInfo.device_token = device_token;
            
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
    async add_item_by_admin(request_data){
        try{
            const item_data = {
                item_name: request_data.item_name,
                kcal: request_data.kcal,
                carbs: request_data.carbs,
                protein: request_data.protein,
                fat: request_data.fat,
                about: request_data.about,
                image_id: request_data.image_id,
                category: request_data.category,
            };

            const query = `INSERT INTO tbl_item SET ?`;
            const [insertResult] = await database.query(query, [item_data]);

            const item_id = insertResult.insertId;
            // console.log("show",request_data.ingredient_id)
            // // Convert string to an array if needed
            // if (typeof request_data.ingredient_id === "string") {
            //     request_data.ingredient_id = request_data.ingredient_id.split(",").map(id => parseInt(id.trim(), 10));
            // }
            // console.log("show2",request_data.ingredient_id)
            // if (Array.isArray(request_data.ingredient_id) && request_data.ingredient_id.length > 0) {
            //     const ingredientValues = request_data.ingredient_id.map(ingredient_id => [ingredient_id, item_id]);
            //     const insertIngredientQuery = `INSERT INTO ing_item_rel (ing_id, item_id) VALUES ?`;
            //     await database.query(insertIngredientQuery, [ingredientValues]);
            // }
            if(request_data.ingredient_id && request_data.ingredient_id.length > 0){
                const ingredientValues = request_data.ingredient_id.map(ingredient_id => [ingredient_id, item_id]);
                const insertIngredientQuery = `INSERT INTO ing_item_rel (ing_id, item_id) VALUES ?`;
                await database.query(insertIngredientQuery, [ingredientValues]);
            }
            return {
                code: response_code.SUCCESS,
                message: "Item and ingredients added successfully",
                item_id: item_id
            };
        }catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: "ERROR",
                data: error.message
            };
        }
    }

    async analytics_dashboard(request_data) {
        try {
            const queries = {
                non_active_users: `SELECT COUNT(*)AS non_active_users FROM tbl_user WHERE is_active = 0;`,
                active_users: `SELECT COUNT(*) AS active_users FROM tbl_user WHERE is_active = 1;`,
                total_logins: `SELECT COUNT(*) AS total_logins FROM tbl_user WHERE is_login=1;`,
                orders_confirmed: `SELECT COUNT(*) AS confirmed_orders FROM tbl_order WHERE status_ = 'Confirmed';`,
                orders_completed: `SELECT COUNT(*) AS confirmed_orders FROM tbl_order WHERE status_ = 'Completed';`
            };
            const [nonActiveUsers] = await database.query(queries.non_active_users);
            const [activeUsers] = await database.query(queries.active_users);
        const [totalLogins] = await database.query(queries.total_logins);
        const [confirmedOrders] = await database.query(queries.orders_confirmed);
        const [completedOrders] = await database.query(queries.orders_completed);

        console.log("Active Users:", activeUsers[0].active_users);
        console.log("Total Logins:", totalLogins);
        console.log("Confirmed Orders:", confirmedOrders);
        console.log("Completed Orders:", completedOrders);

        // Extract values safely
        const analyticsData = {
            non_active_users: nonActiveUsers[0].non_active_users || 0,
            active_users: activeUsers[0].active_users || 0,
            total_logins: totalLogins[0].total_logins || 0,
            confirmed_orders: confirmedOrders[0].confirmed_orders || 0,
            completed_orders: completedOrders[0].completed_orders || 0
        };
    
            return {
                code: response_code.SUCCESS,
                message: "Analytics fetched successfully",
                data: analyticsData
            };
        } catch (error) {
            console.log("Error in analytics_dashboard", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Failed to fetch analytics",
                error: error.message
            };
        }
    }
        async logout_admin(request_data,admin_id){
            try{
                const select_user_query = "SELECT * FROM admin_ WHERE admin_id = ? and is_login = 1";
                console.log("admin_id=====",admin_id)
                const [info] = await database.query(select_user_query, [admin_id]);
                console.log("info=====",info);
                
                if(info.length>0){
                    const updatedUserQuery="update tbl_device_info_admin set device_token_admin = '', updated_at = NOW() where admin_id = ?"
                    const updatedTokenQuery="update admin_ set token = '', is_login = 0 where admin_id = ?"
                
                await Promise.all([
                    database.query(updatedUserQuery, [admin_id]),
                    database.query(updatedTokenQuery, [admin_id])
                ]);
            
                const getUserQuery = "SELECT * FROM admin_ WHERE admin_id = ?";
                const [updatedUser] = await database.query(getUserQuery, [admin_id]);
        
                return {
                    code: response_code.SUCCESS,
                    message: t('logout_success'),
                    data: updatedUser[0]
                };
            }else{
                return {
                    code: response_code.NOT_FOUND,
                    message: t('user_not_found_or_logged_out')
                };
            }
            }catch(error){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('some_error_occurred'),
                    data: error
                };
            }
        }

        async delete_item(request_data){
            try{
                const item_id = request_data.item_id;
    
                if (!item_id) {
                    return {
                        code: response_code.BAD_REQUEST,
                        message: "Item ID is required"
                    };
                }
                // Check if the item exists and is active
                const checkQuery = `SELECT * FROM tbl_item WHERE item_id = ? AND is_deleted = 0`;
                const [result] = await database.query(checkQuery, [item_id]);
        
                if (result.length === 0) {
                    return {
                        code: response_code.NOT_FOUND,
                        message: "Item not found or already deleted"
                    };
                }
        
                // Soft delete the item
                const query = `UPDATE tbl_item SET is_active = 0, is_deleted = 1 WHERE item_id = ?`;
                await database.query(query, [item_id]);
        
                return {
                    code: response_code.SUCCESS,
                    message: "ITEM DELETED SUCCESSFULLY",
                    data: { item_id }
                };
    
            }catch (error) {
                console.log(user_id);
                console.log(error);
                return {
                    code: response_code.OPERATION_FAILED,
                    message: error
                };
            }
        }
    
}
module.exports = new AdminModel();
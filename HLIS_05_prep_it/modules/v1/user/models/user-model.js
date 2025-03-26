const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const md5 = require("md5");
// const resul = require("../../../../views")
const {default: localizify} = require('localizify');
const { t } = require("localizify");
const moment = require('moment');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// const response_code=  require('../../../../utilities/response-error-code');
const {contactUs,orderConfirmationEmail} = require("../../../../template");

class UserModel {
    
    async ListOfVehicles(request_data, user_id) {
            try{
                const latitude_pickup = request_data.pickup_latitude;
                const longitude_pickup = request_data.pickup_longitude;
                const latitude_drop = request_data.dropoff_latitude;
                const longitude_drop = request_data.dropoff_longitude;

                if(!latitude_pickup || !longitude_pickup || !latitude_drop || !longitude_drop){
                    return {
                        code: response_code.MISSING_MANDATORY_FIELD,
                        message: t('missing_mandatory_fields')
                    };
                }

                const distance_km = common.calculateDistance(latitude_pickup, longitude_pickup, latitude_drop, longitude_drop);
                const [vehicle_types] = await database.query(`
                    SELECT 
                    vt.vehicle_type_id,
                    vt.vehicle_type_name,,
                    v.veh_det_id
                    MIN(vt.vehicle_weight_kg) AS vehicle_weight_kg,
                    MIN(vt.height) AS height,
                    MIN(vt.width) AS width,
                    MIN(vt.depth) AS depth,
                    MIN(vt.unit) AS unit,
                    MIN(vt.speed_limit_kmh) AS speed_limit_kmh,
                    MIN(p.base_price) AS base_price,
                    MIN(p.price_per_km) AS price_per_km,
                    MIN(p.pod_fee) AS pod_fee,
                    COUNT(v.vehicle_id) AS available_count,
                    MIN(va.latitude) AS vehicle_latitude,
                MIN(va.longitude) AS vehicle_longitude
                FROM tbl_vehicle_type vt
                LEFT JOIN tbl_vehicle_details v ON vt.vehicle_type_id = v.vehicle_type_id
                LEFT JOIN tbl_vehicle_availability va ON v.vehicle_id = va.vehicle_id
                LEFT JOIN tbl_pricing p ON vt.vehicle_type_id = p.vehicle_type_id
                WHERE vt.is_active = 1 
                AND vt.is_deleted = 0
                AND v.is_active = 1
                AND v.is_deleted = 0
                AND va.is_available = 1
                GROUP BY vt.vehicle_type_id, vt.vehicle_type_name
                HAVING available_count > 0
                `);
                const availableVehicleTypes=vehicle_types.map(vt=>{
                    const totalPrice = vt.base_price + (vt.price_per_km * distance_km);
                    const speed_kmh=vt.speed_limit_kmh ||20;
                    const estimated_time_hours= distance_km/speed_kmh;
                    const estimated_arrival_minutes=Math.round(estimated_time_hours * 60);

                    const vehicleLatitude = Number(vt.vehicle_latitude);
                    const vehicleLongitude = Number(vt.vehicle_longitude);

                    let estimated_time_vehicle_to_pickup_minutes = 0;
                    if (vehicleLatitude && vehicleLongitude) {
                        const distance_km_vehicle_to_pickup = common.calculateDistance(
                            vehicleLatitude,
                            vehicleLongitude,
                            latitude_pickup,
                            longitude_pickup
                        );

                        const speed_kmh = Number(vt.speed_limit_kmh) || 20;
                        const estimated_time_vehicle_to_pickup_hours = distance_km_vehicle_to_pickup / speed_kmh;
                        estimated_time_vehicle_to_pickup_minutes = Math.round(estimated_time_vehicle_to_pickup_hours * 60);
                    }
                    return{
                        vehicle_type_id: vt.vehicle_type_id,
                        name: vt.vehicle_type_name,
                        estimated_time_vehicle_to_pickup: `${estimated_time_vehicle_to_pickup_minutes} min`,
                        estimated_order_arrival: `${estimated_arrival_minutes} min`,
                        weight_capacity: `${vt.vehicle_weight_kg} kgs`,
                        dimensions: `${vt.width} x ${vt.height} x ${vt.depth} ${vt.unit}`,
                        price: `₹${totalPrice}`,
                        pod_fee: vt.pod_fee,
                        available_count: vt.available_count
                    }
                })
                availableVehicleTypes.sort((a, b) => parseInt(a.estimated_order_arrival) - parseInt(b.estimated_order_arrival));
                return {
                    code: response_code.SUCCESS,
                    message: t('vehicles_listed_successfully'),
                    data: {
                        distance_km: Math.round(distance_km),
                        vehicle_types: availableVehicleTypes
                    }
                };
            }catch(error){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('some_error_occurred'),
                    data: error
                };
            }
    }

    async createDeliveryOrder(request_data,user_id){
        try{
            const data={
                package_type_id: request_data.package_type_id,
                weight_kg: request_data.weight_kg,
                unit: request_data.unit,
                height_feet: request_data.height_feet,
                width_feet: request_data.width_feet,
                notes: request_data.notes
            }

            const basePrice=100;
            const pricePerKm=10;
            const podFee=20;
            
            const insertPackageQuery="INSERT INTO tbl_package_details SET ?";
            const [insertResult]=await database.query(insertPackageQuery,[data]);
            console.log(insertResult);
            const package_id = insertResult.insertId;

            const scheduled_time = request_data.scheduled_time 
                ? moment(request_data.scheduled_time).format('YYYY-MM-DD HH:mm:ss') 
                : moment().format('YYYY-MM-DD HH:mm:ss');

            const orderData={
                user_id: user_id,
                // package_id: package_id,
                pickup_latitude: request_data.pickup_latitude,
                pickup_longitude: request_data.pickup_longitude,
                pickup_address: request_data.pickup_address,
                dropoff_latitude: request_data.dropoff_latitude,
                dropoff_longitude: request_data.dropoff_longitude,
                dropoff_address: request_data.dropoff_address,
                status: 'pending',
                scheduled_time: scheduled_time,
                // veh_det_id: request_data.veh_det_id,
                tax: 100,
                discount: 10,
            }

            if(request_data.requires_pod && request_data.requires_pod === 1){
                orderData.requires_pod = 1;
                orderData.pos_charge = podFee;
            }

            const insertOrderQuery="INSERT INTO tbl_delivery_order SET ?";
            const [insertOrderResult]=await database.query(insertOrderQuery,[orderData]);
            const order_id = insertOrderResult.insertId;
            
            console.log(order_id);
            const updatePackageQuery="UPDATE tbl_package_details SET order_id = ? WHERE package_id = ?";
            await database.query(updatePackageQuery,[order_id,package_id]);

            const receiver_data = {
                full_name: request_data.full_name,
                email_id: request_data.email_id,
                code_id: request_data.code_id,
                phone_number: request_data.phone_number,
                address: request_data.address,
                latitude: request_data.latitude,
                longitude: request_data.longitude
            };

            const findReceiver = "SELECT * FROM tbl_receiver WHERE email_id = ? AND phone_number = ?";
            const [receiverData] = await database.query(findReceiver, [receiver_data.email_id, receiver_data.phone_number]);

            let rec_id ;
            let receiver;

            if(receiverData.length === 0){
                const insertReceiver = "INSERT INTO tbl_receiver SET ?";
                const [insertedReceiver] = await database.query(insertReceiver, [receiver_data]);
                rec_id = insertedReceiver.insertId;

                const getRecData = `SELECT * FROM tbl_receiver WHERE rec_id = ?`;
                const [receiver_] = await database.query(getRecData, [rec_id]);
                receiver = receiver_[0];
            }else{
                rec_id = receiverData[0].rec_id;
                receiver = receiverData[0];
            }

            console.log(receiver);

            const updateOrderData = `UPDATE tbl_delivery_order SET rec_id = ? WHERE order_id = ?`;
            await database.query(updateOrderData, [rec_id, order_id]);

            const getpackageData = `SELECT * FROM tbl_package_details WHERE package_id = ?`;
            const [packageData] = await database.query(getpackageData, [package_id]);

            const distance_km = await common.calculateDistance(
                request_data.pickup_latitude,
                request_data.pickup_longitude,  
                request_data.dropoff_latitude,
                request_data.dropoff_longitude
            );

            const subtotal = basePrice + (pricePerKm * distance_km);
            const total_price = subtotal + orderData.tax - orderData.discount;
            await database.query(`UPDATE tbl_delivery_order SET distance_km = ?, total_price = ?, subtotal = ? WHERE order_id = ?`, [distance_km, total_price, subtotal, order_id]);
            
            const getUserQuery = `SELECT full_name, email_id, phone_number, address FROM tbl_user WHERE user_id = ?`;
            const [senderData] = await database.query(getUserQuery, [user_id]);
            const sender = senderData.length ? senderData[0] : null;

            const getOrderDateQuery = `SELECT created_at FROM tbl_delivery_order WHERE order_id = ?`;
            const [orderDateResult] = await database.query(getOrderDateQuery, [order_id]);
            const order_date_time = moment(orderDateResult[0].created_at).format('DD-MMM YYYY hh:mm a');

            const delivery_time_in_minutes = Math.round(distance_km / 20 * 60); // Assuming 20 km/h avg speed
            const delivery_date_time = moment(orderDateResult[0].created_at)
            .add(delivery_time_in_minutes, 'minutes')
            .format('DD-MMM YYYY hh:mm a'); 

            const resp = {
                pick_up_loc: request_data.pickup_address,
                drop_off_loc: request_data.dropoff_address,
                sender: sender,
                receiver: receiver,
                item: packageData[0],
                payment_data: "Cash on delivery",
                order_status: "pending",
                delivery_status: "confirmed",
                distance: `${distance_km} km`,
                time: `${Math.round(distance_km / 20)} min`,
                order_date_time: order_date_time,
                delivery_date_time: delivery_date_time,
                subtotal: subtotal,
                tax: orderData.tax,
                discount: orderData.discount,
                total_price: total_price,
            };

            const subject = "Cargo Rider - Order Summary";
            const orderDataEmail = { 
                order_id: order_id,
                order_status: resp.order_status,
                delivery_status: resp.delivery_status,
                pick_up_loc: resp.pick_up_loc,
                drop_off_loc: resp.drop_off_loc,
                
                receiver: {
                    name: resp.receiver.full_name,
                    email: resp.receiver.email_id,
                    phone: resp.receiver.phone_number,
                    address: resp.receiver.address,
                },
            
                sender: {
                    name: resp.sender.full_name,
                    email: resp.sender.email_id,
                    phone: resp.sender.phone_number,
                    address: resp.sender.address,
                },
            
                item: resp.item,
                distance: resp.distance,
                time: resp.time,
                order_date_time: resp.order_date_time,
                delivery_date_time: resp.delivery_date_time,
            
                payment_data: resp.payment_data,
                subtotal: resp.subtotal,
                tax: resp.tax,
                discount: resp.discount,
                total_price: resp.total_price
            };
            

              const email =sender.email_id;
                
                try {
                    const htmlMessage = orderConfirmationEmail(orderDataEmail)
                    await common.sendMail(subject, email, htmlMessage);
                    console.log("Order email sent successfully!");
                } catch (error) {
                    console.error("Error sending OTP email:", error);
                }
            return {
                code: response_code.SUCCESS,
                message: t('order_created_successfully'),
                data: resp
            };

        }catch(error){
            return{
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error
            }
        }
    }

    async notification(request_data,user_id){
        try{
            const getNotifications = `SELECT * FROM tbl_notification WHERE user_id = ?`;
            const [notifications] = await database.query(getNotifications, [user_id]);

            if(notifications.length === 0){
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_notifications_found')
                };
            }
    
            return {
                code: response_code.SUCCESS,
                message: t('notifications_listed_successfully'),
                data: notifications
            };
    
        } catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async cancelOrder(request_data,user_id){
        try{
            const order_id = request_data.order_id;
            const getOrder = `SELECT * FROM tbl_delivery_order WHERE order_id = ? AND user_id = ?`;
            const [order] = await database.query(getOrder, [order_id, user_id]);
            
                if (order.length === 0) {
                    return {
                        code: response_code.NOT_FOUND,
                        message: t('order_not_found')
                    };
                }
        
                const currentStatus = order[0].status;
                const current_delivery_status = order[0].delivery_status;
                const vehicle_id = order[0].veh_det_id;
                const cancellableStatuses = ['pending', 'accepted'];
                const cancellable_delivery_statuses = ['confirmed'];

                const [driver] = await database.query(`SELECT * FROM tbl_vehicle_details WHERE veh_det_id = ?`, [vehicle_id]);
                const driver_id = driver[0].driver_id;
        
                if (currentStatus === 'cancelled'){
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('order_already_cancelled')
                    };
                }
        
                if (!cancellableStatuses.includes(currentStatus) && !cancellable_delivery_statuses.includes(current_delivery_status)) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('order_cannot_be_cancelled')
                    };
                }

                if (vehicle_id) {
                    await database.query(`
                        UPDATE tbl_vehicle_availability 
                        SET is_available = 1, estimated_arrival_minutes = NULL 
                        WHERE veh_det_id = ?
                    `, [vehicle_id]);
                }

                const cancel_order = `
                    UPDATE tbl_delivery_order 
                    SET status = 'cancelled' 
                    WHERE order_id = ? AND user_id = ?
                `;
                await database.query(cancel_order, [order_id, user_id]);
                
                if(cancellable_delivery_statuses.includes(current_delivery_status)){
                    const notificationQuery = `
                    INSERT INTO tbl_notification_driver
                    (title, descriptions, driver_id, notification_type) 
                    VALUES (?, ?, ?, ?)
                    `;

                    const title = "Order Cancelled";
                    const descriptions = `Order #${order_id} has been cancelled successfully.`;
                    const notificationType = "cancel";
                    await database.query(notificationQuery, [title, descriptions, driver_id, notificationType]);

                }

                return {
                    code: response_code.SUCCESS,
                    message: t('order_cancelled_successfully')
                };
        }catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error
            };
        }   
    }

    async contactUs(request_data,user_id){
        console.log("REQUEST DATA",request_data)
        try{
            const data = {
                full_name: request_data.full_name,
                email_address: request_data.email_address,
                code_id: request_data.code_id,
                phone_number: request_data.phone_number,
                user_id :user_id
            }

            const insertContact = `INSERT INTO tbl_contact_us SET ?`;
            const [contactInsert] = await database.query(insertContact, [data]);

            const subject = `Thank you for contacting us!`;
            const email = request_data.email_address;

            const contact_data = {
                name: request_data.full_name,
                email: request_data.email_address,
                phone: request_data.phone_number,
                code_id: request_data.code_id
            }

            try {
                const htmlMessage = contactUs(contact_data);
                await common.sendMail(subject, email, htmlMessage);
                console.log("Contact us Email Sent Success");
            } catch (error) {
                console.error("Error sending Contact Us email:", error);
            }

            return {
                code: response_code.SUCCESS,
                message: t('contact_us_success'),
                data: contactInsert.insertId
            };

        } catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occured'),
                data: error.message
            }
        }
    }

    async listUserOrders(request_data, user_id) {
        try {
            const { is_running, is_upcoming } = request_data;
    
            if ((is_running === 1 && is_upcoming === 1) || (is_running === 0 && is_upcoming === 0)) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('invalid_request')
                };
            }
    
            let query = `SELECT o.*, r.* 
                         FROM tbl_delivery_order o 
                         LEFT JOIN tbl_receiver r ON o.rec_id = r.rec_id
                         WHERE o.user_id = ? AND o.status != 'cancelled'`;
    
            let queryParams = [user_id];
    
            if (is_running === 1) {
                query += ` AND o.scheduled_time < NOW()`;
            } else if (is_upcoming === 1) {
                query += ` AND o.scheduled_time > NOW()`;
            }
    
            const [orders] = await database.query(query, queryParams);
    
            if (orders.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_orders_found')
                };
            }
    
            const order_list = orders.map(order => {
                const createdAt = new Date(order.created_at);
    
                return {
                    receiver_details: {
                        rec_id: order.rec_id,
                        name: order.name,
                        phone: order.phone_number, 
                        address: order.address
                    },
                    order_id: order.order_id,
                    order_date: createdAt.toISOString().split('T')[0], // YYYY-MM-DD
                    order_time: createdAt.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    })
                };
            });
    
            return {
                code: response_code.SUCCESS,
                message: t('orders_fetched_successfully'),
                data: order_list
            };
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async logout(request_data,user_id){
        try{
            const select_user_query = "SELECT * FROM tbl_user WHERE user_id = ? and is_login = 1";
            console.log(user_id)
            const [info] = await database.query(select_user_query, [user_id]);
            console.log(info);
            
            if(info.length>0){
                const updatedUserQuery="update tbl_device_info set device_token = '', updated_at = NOW() where user_id = ?"
                const updatedTokenQuery="update tbl_user set token = '', is_login = 0 where user_id = ?"
            
            await Promise.all([
                database.query(updatedUserQuery, [user_id]),
                database.query(updatedTokenQuery, [user_id])
            ]);
        
            const getUserQuery = "SELECT * FROM tbl_user WHERE user_id = ?";
            const [updatedUser] = await database.query(getUserQuery, [user_id]);
    
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

    async delete(request_data,user_id){
        try{
            console.log(user_id);
            const queries = [
                `UPDATE tbl_user SET is_deleted = 1, is_active = 0, token = null, is_login = 0 WHERE user_id =${user_id}`,
                `UPDATE tbl_otp SET is_deleted = 1, is_active = 0, verify = 0 WHERE user_id = ${user_id}`,
                `UPDATE tbl_order SET is_deleted = 1, is_active = 0 WHERE user_id = ${user_id}`,
                `UPDATE tbl_meal SET is_deleted = 1, is_active = 0 WHERE user_id = ${user_id}`,
                `UPDATE tbl_device_info SET is_deleted = 1, is_active = 0 WHERE user_id = ${user_id}`,
                `UPDATE tbl_notification SET is_deleted = 1, is_active = 0 WHERE user_id = ${user_id}`,
                `UPDATE tbl_help_support SET is_deleted = 1, is_active = 0 WHERE user_id = ${user_id}`
            ];

            for (const query of queries) {
                await database.query(query, [user_id]);
            }

            return {
                code: response_code.SUCCESS,
                message: "ACCOUNT DELETED SUCCESSFULLY"
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

    async report(request_data,user_id){
        try{
            const {order_id,subject,description,images=[]}=request_data;
            if (!order_id || !subject || !description || !user_id) {
                return callback(common.encrypt({
                    code: response_code.OPERATION_FAILED,
                    message: t('missing_required_fields')
                }));
            }

            const [order] = await database.query(`SELECT status, user_id FROM tbl_delivery_order WHERE order_id = ?`, [order_id]);
            if(!order && order.length===0){
                return {
                    code: response_code.NOT_FOUND,
                    message: t('order_not_found')
                };
            }
            if (order[0].status !== 'completed') {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('order_not_completed')
                };
            }
            if (order[0].user_id !== user_id) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('unauthorized_user')
                };
            }
            const [report] = await database.query(`SELECT * FROM tbl_report WHERE order_id = ?`, [order_id]);
            if(report && report.length>0){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('report_already_submitted')
                };
            }   
            const data={
                subject:subject,
                order_id:order_id,
                description:description,
                user_id:user_id,
                is_active:1,
                is_deleted:0
            }
            const [reportResult] = await database.query(`INSERT INTO tbl_report SET ?`, [data]);
            const report_id = reportResult.insertId;
            if (images.length > 0) {
                const imageValues = images.map(image_name => [image_name, report_id]);
                await database.query(`
                    INSERT INTO tbl_image_report (
                        image_name,
                        report_id
                    ) VALUES ?
                `, [imageValues]);
            }
            return {
                code: response_code.SUCCESS,
                message: t('report_created_successfully'),
                data: {
                    report_id,
                    order_id
                }
            };
        }catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error
            };
        }
    }

    async add_driver_rating(request_data, user_id) {
        try {
            const { rating, review, order_id } = request_data;
            console.log(request_data);
            if (!rating || !review || !order_id) {
                return {
                    code: response_code.MISSING_MANDATORY_FIELD,
                    message: t('missing_mandatory_fields')
                };
            }

            const findVehicle = `SELECT veh_det_id FROM tbl_delivery_order WHERE order_id = ? AND status = 'completed' AND delivery_status = 'delivered'`;
            const [vehicle_data] = await database.query(findVehicle, [order_id]);
    
            if (!vehicle_data || vehicle_data.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('vehicle_not_found')
                };
            }
    
            const vehicle_id = vehicle_data[0].veh_det_id;

            const findDriver = `SELECT driver_id FROM tbl_vehicle_details WHERE veh_det_id = ?`;
            const [driver_data] = await database.query(findDriver, [vehicle_id]);
    
            if (!driver_data || driver_data.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('driver_not_found')
                };
            }
    
            const driver_id = driver_data[0].driver_id;

            const driverQuery = `SELECT driver_id FROM tbl_driver WHERE driver_id = ?`;
            const [driverResult] = await database.query(driverQuery, [driver_id]);
    
            if (!driverResult || driverResult.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('driver_not_found')
                };
            }

            const ratingQuery = `SELECT * FROM tbl_rating_review_driver WHERE driver_id = ? AND user_id = ?`;
            const [ratingResult] = await database.query(ratingQuery, [driver_id, user_id]);
    
            if (ratingResult.length > 0) {
                return {
                    code: response_code.ALREADY_EXISTS,
                    message: t('rating_already_exists')
                };
            }
    
            const rating_data = {
                driver_id,
                user_id,
                order_id,
                rating,
                review,
            };
    
            const insertRating = `INSERT INTO tbl_rating_review_driver SET ?`;
            await database.query(insertRating, [rating_data]);
    
            return {
                code: response_code.SUCCESS,
                message: t('rating_added_successfully')
            };
    
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }
    

}
module.exports = new UserModel();

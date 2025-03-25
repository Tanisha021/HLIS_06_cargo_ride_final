const User = require('../controller/driver');  
const { vehicleDocumentUpload } = require('../../../../middleware/uploadFiles');
const customerRoute = (app) => {
    //authentication
     app.post("/v1/driver/signup", User.signup); 
     app.post("/v1/driver/login", User.login);
     app.post("/v1/driver/verify-otp", User.validateOTP);
     app.post("/v1/driver/resend-otp", User.resendOTP);
     app.post("/v1/driver/forgot-password", User.forgotPassword);
     app.post("/v1/driver/validate-forgot-password", User.validateForgotPasswordOTP);
     app.post("/v1/driver/reset-password", User.resetPassword);
     app.post("/v1/driver/change-password", User.changePassword);

    
     app.post("/v1/driver/add_vehicle_data", vehicleDocumentUpload.fields([
        { name: 'adhar_card_front', maxCount: 1 },
        { name: 'adhar_card_back', maxCount: 1 },
        { name: 'pan_card_front', maxCount: 1 },
        { name: 'pan_card_back', maxCount: 1 },
        { name: 'driving_lic_card_front', maxCount: 1 },
        { name: 'driving_lic_card_back', maxCount: 1 }
    ]), User.add_vehicle_data);
    app.post("/v1/driver/show-nearby-orders", User.show_nearby_orders);
    app.post("/v1/driver/accept-order", User.acceptOrder);
    app.post("/v1/driver/delivery-status", User.deliveryStatus);
    app.post("/v1/driver/verify-delivery", User.verifyDelivery);
    app.post("/v1/driver/get-upcoming-deliveries", User.getUpcomingDeliveries);
    app.post("/v1/driver/set-availability", User.setAvailability);
    app.post("/v1/driver/show-earnings", User.showEarnings);
    // app.post("/v1/user/logout", User.logout);
    app.post("/v1/driver/delete", User.delete);

};

module.exports = customerRoute;




const User = require('../controller/user');  

const customerRoute = (app) => {
    //authentication
     app.post("/v1/user/signup", User.signup); 
     app.post("/v1/user/login", User.login);
     app.post("/v1/user/verify-otp", User.validateOTP);
     app.post("/v1/user/resend-otp", User.resendOTP);
     app.post("/v1/user/forgot-password", User.forgotPassword);
     app.post("/v1/user/validate-forgot-password", User.validateForgotPasswordOTP);
     app.post("/v1/user/reset-password", User.resetPassword);
     app.post("/v1/user/change-password", User.changePassword);

    app.post("/v1/user/create-delivery-order", User.createDeliveryOrder);
    app.post("/v1/user/list-of-vehicles", User.ListOfVehicles);
    app.post("/v1/user/notification", User.notification);
    app.post("/v1/user/contact-us", User.contactUs);
    app.post("/v1/user/cancel-order", User.cancelOrder);
    app.post("/v1/user/list-user-orders", User.listUserOrders);
    app.post("/v1/user/report", User.report);
    app.post("/v1/user/add-driver-rating", User.add_driver_rating);
    app.post("/v1/user/logout", User.logout);
    app.post("/v1/user/delete", User.delete);

};

module.exports = customerRoute;




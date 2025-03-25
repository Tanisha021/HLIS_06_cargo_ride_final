const { phone_number } = require("../language/en");
const { report } = require("./v1/user/models/user-model");

const checkValidatorRules = {

    login: {
        email_id: 'required|email',
        login_type: 'required|string|in:S,G,F,A',
        password_: 'required_if:login_type,S',
        social_id: 'required_if:login_type,G,F,A'
        // Social ID should only be required for social logins
        // social_id: 'required_if:login_type,G,F,A'
    },  
    login_admin: {
        email_id: 'required|email',
        // password_: 'required'
    },  
    signup: {    
        email_id: 'required|email',
        // full_name: 'required_if:signup_type,S|required',
        // password_: 'required_if:signup_type,S|min:8',
        // phone_number: 'required_if:signup_type,S|string|size:10|regex:/^[0-9]{10}$/',
        // code_id: 'required_if:signup_type,S|required|numeric',
        signup_type: 'required|in:S,G,F,A',
    },
    validateOTP:{
        // phone_number: 'required',
        otp: 'required'
    },
    resendOTP:{
        email_id: 'required|email',
    },
    forgotPassword:{
        email_id: "required|email"

    },
    addProfilePic:{
        user_id: "required",
        profile_pic: "required"
    },
    verifyOTP: {
        email_id: 'required',
        otp: 'required'
    },
    resetPassword:{
        email_id: "required|email",
        password_: "required|min:8"
    },
    changePassword:{
        old_password: "required|min:8",
        new_password: "required|min:8"
    },
    getItemDetails:{
        item_id: "required"
    },
    getOrderDetails:{
        order_id: "required"
    },
    addDeliveryAddress: {
        latitude: "required",
        longitude: "required",
        area_name: "required",
        flat_number: "required",
        block_number: "required",
        road_name: "required",
        delivery_info: "required",
        type_: "required|in:home,office"
    },
    helpAndSupport: {
        user_id: "required|numeric",
        full_name: "required|string",
        phone_number: "required|digits:10",
        email_id: "required|email",
        descp: "required|string|min:10"
    },
    place_order: {
        delivery_id: "required|numeric",
        meals: "required|array|min:1",
        category: "required|string",
        // item_id: "required|numeric",
        // qty: "required|numeric|min:1"
    },
    add_item_by_admin:{
            item_name: "required|string",
            kcal: "required|numeric",
            carbs: "required|numeric",
            protein: "required|numeric",
            fat: "required|numeric",
            about: "required|string",
            image_id: "required|numeric",
            ingredient_id: "required|min:1"
    },
    add_vehicle_data:{
        vehicle_number: "required",
        vehicle_model: "required",
        vehicle_company: "required",
        vehicle_rto: "required",
        vehicle_type_id: "required"
    },
    acceptOrder:{
        order_id: "required"
    },
    deliveryStatus:{
        order_id: "required",
        delivery_status: "required"
    },
    setAvailability:{
        days: "required",
        startTime: "required",
        endTime: "required",
        radius_km: "required"
    },
    report:{
        order_id: "required",
        subject: "required",
        description: "required"
    },
    add_driver_rating:{
        order_id: "required",
        rating: "required",
        review: "required"
        
    },
    


};

module.exports = checkValidatorRules;


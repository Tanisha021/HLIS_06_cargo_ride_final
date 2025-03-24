class Routing {
    v1(app) {
        let user = require("./v1/user/routes/routes");
        let admin = require("./v1/admin/routes/routes");  
        let driver = require("./v1/driver/routes/routes");  
        
        user(app);
        admin(app); 
        driver(app);
    }
}

module.exports = new Routing();

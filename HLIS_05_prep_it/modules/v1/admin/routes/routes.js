const Admin = require('../controller/admin');  

const adminRoute = (app) => {
    app.post("/v1/admin/login", Admin.login_admin);
    app.post("/v1/admin/add-item", Admin.add_item_by_admin);
    app.post("/v1/admin/analytics-dashboard", Admin.analytics_dashboard);
    app.post("/v1/admin/logout-admin", Admin.logout_admin);
    app.post("/v1/admin/delete-item", Admin.delete_item);

};

module.exports = adminRoute;    




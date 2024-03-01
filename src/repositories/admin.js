const Admin = require("../models/admin");

class AdminRepository {
    async findAdminById(id) {
        return await Admin.findById(id).select("-password");
    };

    async findAdminByUserName(username) {
        return await Admin.findOne({ username });
    };
};

module.exports = AdminRepository;

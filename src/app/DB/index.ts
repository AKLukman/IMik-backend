import config from "../config";
import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

if (!config.super_admin_password) {
  throw new Error("Super admin password is missing from env");
}

const superUser = {
  email: "abulkashemlukman@gmail.com",
  password: config.super_admin_password,
  role: USER_ROLE.superAdmin,
  status: "in-progress" as const,
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;

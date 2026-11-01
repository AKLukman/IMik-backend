import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { CustomerController } from "./customer.controller";
import { CustomerValidations } from "./customer.validation";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CustomerController.getAllCustomers,
);

router.get(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CustomerController.getSingleCustomer,
);

router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CustomerValidations.updateCustomerValidationSchema),
  CustomerController.updateCustomer,
);

router.delete(
  "/:customerId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CustomerController.deleteCustomer,
);

export const CustomerRoutes = router;

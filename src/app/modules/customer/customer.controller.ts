import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CustomerService } from "./customer.service";

const getSingleCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CustomerService.getSingleCustomerFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer is retrieved successfully",
    data: result,
  });
});

const getAllCustomers = catchAsync(async (req, res) => {
  const result = await CustomerService.getAllCustomersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customers are retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const updateCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { customer } = req.body;
  const result = await CustomerService.updateCustomerIntoDB(
    id as string,
    customer,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer is updated successfully",
    data: result,
  });
});

const deleteCustomer = catchAsync(async (req, res) => {
  const { customerId } = req.params;
  const result = await CustomerService.deleteCustomerFromDB(
    customerId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer is deleted successfully",
    data: result,
  });
});

export const CustomerController = {
  getSingleCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
};

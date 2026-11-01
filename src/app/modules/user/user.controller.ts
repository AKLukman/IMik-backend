import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserServices } from "./user.services";
import config from "../../config";

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;
  const result = await UserServices.createAdminIntoDB(
    req.file,
    password,
    adminData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is created successfully",
    data: result,
  });
});
const createCustomerIntoDB = catchAsync(async (req, res) => {
  const { password, customer: customerData } = req.body;

  const result = await UserServices.createCustomerIntoDB(
    req.file,
    password,
    customerData,
  );

  const { accessToken, refreshToken, newCustomer } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer is created successfully",
    data: {
      accessToken,
      refreshToken,
      newCustomer,
    },
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email, role } = req.user;
  const result = await UserServices.getMe(email, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status is updated successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { email, role } = req.user;
  const result = await UserServices.updateProfile(email, role, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createCustomerIntoDB,
  changeStatus,
  getMe,
  updateProfile,
};

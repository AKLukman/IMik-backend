import httpStatus from "http-status";
import { TAdmin } from "../admin/admin.interface";
import { TUser } from "./user.interface";
import mongoose from "mongoose";
import { User } from "./user.model";
import { Admin } from "../admin/admin.model";
import config from "../../config";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import AppError from "../../error/AppError";
import { TCustomer } from "../customer/customer.interface";
import { Customer } from "../customer/customer.model";
import { createToken } from "../auth/auth.utils";

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // user is exist or not
  const existingUser = await Admin.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "This email already exists");
  }

  //if password is not given , use deafult password
  userData.password = password || (config.admin_password as string);

  //set student role
  userData.role = "admin";
  //set admin email
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      const imageName = `${Date()}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const [newUser] = await User.create([userData], { session });

    //create a admin
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    //  _id as user
    payload.user = newUser._id; //reference _id
    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createCustomerIntoDB = async (
  file: any,
  password: string,
  payload: TCustomer,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // user is exist or not
  const existingUser = await Customer.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "This email already exists");
  }

  //password
  userData.password = password;

  //set  role
  userData.role = "customer";
  //set customer email
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      const imageName = `${Date()}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const [newUser] = await User.create([userData], { session });

    //create a customer
    if (!newUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to create user for customer",
      );
    }

    const jwtPayload = {
      email: newUser.email,
      role: newUser.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    // _id as user
    payload.user = newUser._id; //reference _id
    // create a customer (transaction-2)
    const newCustomer = await Customer.create([payload], { session });

    if (!newCustomer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create customer");
    }

    await session.commitTransaction();
    await session.endSession();

    return {
      newCustomer,
      accessToken,
      refreshToken,
    };
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (email: string, role: string) => {
  let result = null;
  if (role === "customer") {
    result = await Customer.findOne({ email }).populate("user");
  }
  if (role === "admin") {
    result = await Admin.findOne({ email: email }).populate("user");
  }

  if (role === "superAdmin") {
    result = await Admin.findOne({ email: email }).populate("user");
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const updateProfile = async (email: string, role: string, file: any) => {
  const payload: any = {
    email,
  };
  if (file) {
    const imageName = `${Date()}${role}`;
    const path = file?.path;
    //send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.profileImg = secure_url as string;
  }

  let result = null;
  if (role === "customer") {
    result = await Customer.findOneAndUpdate({ email }, payload, {
      new: true,
    });
  }
  if (role === "admin") {
    result = await Admin.findOneAndUpdate({ email }, payload, { new: true });
  }

  if (role === "superAdmin") {
    result = await Admin.findOneAndUpdate({ email }, payload, { new: true });
  }

  return result;
};

export const UserServices = {
  createAdminIntoDB,
  createCustomerIntoDB,
  getMe,
  changeStatus,
  updateProfile,
};

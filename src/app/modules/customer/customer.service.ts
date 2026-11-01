/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/queryBuilder";
import AppError from "../../error/AppError";
import { CustomerSearchableFields } from "./customer.constant";
import { Customer } from "./customer.model";
import { TCustomer } from "./customer.interface";

const getAllCustomersFromDB = async (query: Record<string, unknown>) => {
  const customerQuery = new QueryBuilder(
    Customer.find().populate("user"),
    query,
  )
    .search(CustomerSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await customerQuery.modelQuery;
  const meta = await customerQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleCustomerFromDB = async (id: string) => {
  const result = await Customer.findById({ _id: id });
  return result;
};

const updateCustomerIntoDB = async (
  id: string,
  payload: Partial<TCustomer>,
) => {
  const { name, ...remainingCustomerData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingCustomerData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Customer.findByIdAndUpdate(
    { _id: id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

const deleteCustomerFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedCustomer = await Customer.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedCustomer) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete customer");
    }

    // get user _id from deletedCustomer
    const userId = deletedCustomer.user;

    const deletedUser = await User.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedCustomer;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const CustomerService = {
  getAllCustomersFromDB,
  getSingleCustomerFromDB,
  updateCustomerIntoDB,
  deleteCustomerFromDB,
};

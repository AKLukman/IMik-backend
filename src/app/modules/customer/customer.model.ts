import { Schema, model } from "mongoose";
import {
  CustomerModel,
  TAddress,
  TCustomer,
  TUserName,
} from "./customer.interface";
import { Gender } from "./customer.constant";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    trim: true,
    maxlength: [20, "Name can not be more than 20 characters"],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Last Name is required"],
    maxlength: [20, "Name can not be more than 20 characters"],
  },
});

const customerAddressSchema = new Schema<TAddress>({
  address1: {
    type: String,
    required: [true, "Street address is required"],
    trim: true,
    maxlength: [80, "Street address can not be more than 80 characters"],
  },
  address2: {
    type: String,
    trim: true,
    maxlength: [80, "Street address can not be more than 80 characters"],
  },
  address3: {
    type: String,
    trim: true,
    maxlength: [80, "Street address can not be more than 80 characters"],
  },
  town: {
    type: String,
    required: [true, "Town name is required"],
    trim: true,
    maxlength: [80, "Town name can not be more than 80 characters"],
  },
  county: {
    type: String,
    required: [true, "County name is required"],
    trim: true,
    maxlength: [80, "County name can not be more than 80 characters"],
  },

  postcode: {
    type: String,
    required: [true, "Postcode is required"],
    trim: true,
    maxlength: [10, "Postcode can not be more than 80 characters"],
  },
  doorNo: {
    type: String,
    required: [true, "Door number is required"],
    trim: true,
    maxlength: [5, "Door number can not be more than 5 characters"],
  },
});

const customerSchema = new Schema<TCustomer, CustomerModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User id is required"],
      unique: true,
      ref: "User",
    },

    name: {
      type: userNameSchema,
      required: [true, "Name is required"],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: "{VALUE} is not a valid gender",
      },
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    contactNo: { type: String, required: [true, "Contact number is required"] },
    address: {
      type: customerAddressSchema,
    },
    profileImg: { type: String, default: "" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// generating full name
customerSchema.virtual("fullName").get(function () {
  return (
    this?.name?.firstName +
    "" +
    this?.name?.middleName +
    "" +
    this?.name?.lastName
  );
});

// filter out deleted documents

//checking if user is already exist!
customerSchema.statics.isUserExists = async function (email: string) {
  const existingUser = await Customer.findOne({ email });
  return existingUser;
};

export const Customer = model<TCustomer, CustomerModel>(
  "Customer",
  customerSchema,
);

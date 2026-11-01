import { z } from "zod";
import { Gender } from "./customer.constant";

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  middleName: z.string().max(20),
  lastName: z.string().max(20),
});
const createAddressValidationSchema = z.object({
  address1: z.string().min(1).max(80),
  address2: z.string().min(1).max(80).optional(),
  address3: z.string().min(1).max(80).optional(),
  town: z.string().max(80),
  county: z.string().max(80),
  postcode: z.string().max(10),
  doorNo: z.string().min(1).max(5),
});

const createCustomerValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    customer: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      address: createAddressValidationSchema.optional(),
      // profileImg: z.string(),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(3).max(20).optional(),
  middleName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
});

const updateAddressValidationSchema = z.object({
  address1: z.string().min(1).max(80).optional(),
  town: z.string().max(80).optional(),
  county: z.string().max(80).optional(),
  postcode: z.string().max(10).optional(),
  doorNo: z.string().min(1).max(5).optional(),
});

const updateCustomerValidationSchema = z.object({
  body: z.object({
    customer: z.object({
      name: updateUserNameValidationSchema,
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      address: updateAddressValidationSchema,
      // profileImg: z.string().optional(),
    }),
  }),
});

export const CustomerValidations = {
  createCustomerValidationSchema,
  updateCustomerValidationSchema,
};

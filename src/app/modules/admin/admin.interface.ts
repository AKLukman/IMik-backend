import { Model, Types } from "mongoose";

export type TGender = "male" | "female" | "other";
export type TBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TAddress = {
  address1: string;
  town: string;
  county: string;
  postcode: string;
  country: "UK";
};

export type TAdmin = {
  user: Types.ObjectId;
  name: TUserName;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo?: string;
  bloodGroup?: TBloodGroup;
  address: TAddress;
  profileImg?: string;
  isDeleted: boolean;
};

export interface AdminModel extends Model<TAdmin> {
  isUserExists(email: string): Promise<TAdmin | null>;
}

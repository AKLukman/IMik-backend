import { Model, Types } from "mongoose";

export type TGender = "male" | "female" | "other";

export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TAddress = {
  address1: string;
  address2?: string;
  address3?: string;
  town: string;
  county: string;
  postcode: string;
  doorNo: string;
  country: "UK";
};

export type TCustomer = {
  user: Types.ObjectId;
  name: TUserName;
  gender?: TGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  address?: TAddress;
  profileImg?: string;
  isDeleted: boolean;
};

export interface CustomerModel extends Model<TCustomer> {
  isUserExists(email: string): Promise<TCustomer | null>;
}

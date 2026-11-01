import { TGender } from "./customer.interface";

export const Gender: TGender[] = ["male", "female", "other"];

export const CustomerSearchableFields = [
  "email",
  "contactNo",
  "emergencyContactNo",
  "name.firstName",
  "name.middleName",
  "name.lastName",
  "address.address1",
  "address.town",
  "address.county",
  "address.postcode",
  "address.doorNo",
];

export const CustomerFilterableFields = ["searchTerm", "isDeleted"];

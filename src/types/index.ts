/**
 * The types which are generic falls here
 */

// The base document returned by MongoDB
export interface Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isDelete: boolean;
}

/**
 * @description This is the type where we reference to an object
 *
 * Case 1: It is string, then it is the `_id` of the object it refers to
 *
 * Case 2: It is an object, then it is the populated object from the backend, which definitely contains `_id` and timestamps
 */
export type Reference<T> = string | (Document & T);

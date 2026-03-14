export interface ProductInterface {
  _id: string;
  name: string;
  price: number;
  description?: string;
  providerId: string;
  createdAt?: string;
  updatedAt?: string;
}
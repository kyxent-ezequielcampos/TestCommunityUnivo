import { model, Schema } from "mongoose";
import { ProductInterface } from "../interfaces/Products.interface";

export const productSchema = new Schema<ProductInterface>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    providerId: { type: String, required: true, ref: "Provider" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret._id = String(ret._id);
        return ret;
      },
    },
  },
);

productSchema.index({ name: 1 });
productSchema.index({ providerId: 1 });
productSchema.index({ price: 1 });

export const productModel = model<ProductInterface>("Product", productSchema);
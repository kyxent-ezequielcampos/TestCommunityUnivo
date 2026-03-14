import { model, Schema } from "mongoose";
import { ProviderInterface } from "../interfaces/Providers.interface";

export const providerSchema = new Schema<ProviderInterface>({
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
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

export const providerModel = model<ProviderInterface>(
  "Provider",
  providerSchema,
);

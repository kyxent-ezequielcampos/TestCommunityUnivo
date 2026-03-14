export type ProviderStatus = "active" | "inactive";

export interface ProviderInterface {
    _id?: string;
    name: string;
    address: string;
    phone: string;
    description?: string;
    email?: string;
    status?: ProviderStatus;
    createdAt?: Date;
    updatedAt?: Date;
}


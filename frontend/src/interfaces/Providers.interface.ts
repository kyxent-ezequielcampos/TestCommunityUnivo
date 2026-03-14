export interface ProviderInterface {
    _id: string;
    name: string;
    address: string;
    phone: string;
    description?: string;
    email?: string;
    status?: "active" | "inactive";
    createdAt?: string;
    updatedAt?: string;
}


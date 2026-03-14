import React from "react";
import { useForm } from "react-hook-form";
import { useProductService } from "../../hooks/useProduct.service";
import type { ProviderInterface } from "../../interfaces/Providers.interface";
import type { ProductInterface } from "../../interfaces/Products.interface";
import { providersService } from "../../services/Providers.service";
import { Modal } from "../atoms/Modal";
import { Toast } from "../atoms/Toast";

export const ProductComponent = () => {
  const { register, handleSubmit, reset, formState } = useForm<Partial<ProductInterface>>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      providerId: "",
    },
  });

  const {
    products,
    loading,
    error,
    pagination,
    query,
    selectedProduct,
    setSelectedProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    updateQuery,
  } = useProductService();

  const [providers, setProviders] = React.useState<ProviderInterface[]>([]);

  React.useEffect(() => {
    const fetchProviders = async () => {
      const response = await providersService.getAllProviders({
        page: 1,
        limit: 100,
        sort: "name",
        fields: "_id,name",
      });
      setProviders(response.items);
    };

    void fetchProviders();
  }, []);

  const [formOpen, setFormOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const onSubmit = async (data: Partial<ProductInterface>) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
      };

      if (data._id) {
        await updateProduct(data._id, payload);
        showToast("Product updated", "success");
      } else {
        await createProduct(payload);
        showToast("Product created", "success");
      }

      reset({ name: "", description: "", price: 0, providerId: "" });
      setFormOpen(false);
    } catch {
      showToast("Product action failed", "error");
    }
  };

  const onEdit = (product: ProductInterface) => {
    reset(product);
    setFormOpen(true);
  };

  const onView = async (productId: string) => {
    const result = await getProductById(productId);
    if (result) {
      setSelectedProduct(result);
      setViewOpen(true);
    }
  };

  const onDelete = async (productId: string) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this product?");
    if (!shouldDelete) return;

    try {
      await deleteProduct(productId);
      showToast("Product deleted", "success");
    } catch {
      showToast("Could not delete product", "error");
    }
  };

  const providerMap = React.useMemo(() => {
    return new Map(providers.map((provider) => [provider._id, provider.name]));
  }, [providers]);

  return (
    <section className="space-y-4">
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-base-content/70">Full CRUD with provider relationship</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            reset({ name: "", description: "", price: 0, providerId: "" });
            setFormOpen(true);
          }}
        >
          Add Product
        </button>
      </div>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body grid gap-3 md:grid-cols-5">
          <label className="form-control">
            <span className="label-text">Search by name</span>
            <input
              className="input input-bordered"
              value={query.nameLike}
              onChange={(event) => updateQuery({ nameLike: event.target.value })}
              placeholder="laptop"
            />
          </label>

          <label className="form-control">
            <span className="label-text">Min price</span>
            <input
              className="input input-bordered"
              type="number"
              min={0}
              value={query.minPrice}
              onChange={(event) => updateQuery({ minPrice: event.target.value })}
              placeholder="100"
            />
          </label>

          <label className="form-control">
            <span className="label-text">Max price</span>
            <input
              className="input input-bordered"
              type="number"
              min={0}
              value={query.maxPrice}
              onChange={(event) => updateQuery({ maxPrice: event.target.value })}
              placeholder="1000"
            />
          </label>

          <label className="form-control">
            <span className="label-text">Provider</span>
            <select
              className="select select-bordered"
              value={query.providerId}
              onChange={(event) => updateQuery({ providerId: event.target.value })}
            >
              <option value="">All providers</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="label-text">Sort</span>
            <select
              className="select select-bordered"
              value={query.sort}
              onChange={(event) => updateQuery({ sort: event.target.value })}
            >
              <option value="-createdAt">Newest first</option>
              <option value="createdAt">Oldest first</option>
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
              <option value="price">Price low-high</option>
              <option value="-price">Price high-low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Provider</th>
              <th>Description</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  <span className="loading loading-spinner loading-md" />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-base-content/60">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{providerMap.get(product.providerId) ?? "Unknown"}</td>
                  <td className="max-w-xs truncate">{product.description ?? "-"}</td>
                  <td className="space-x-2">
                    <button className="btn btn-sm" onClick={() => void onView(product._id)}>
                      View
                    </button>
                    <button className="btn btn-sm btn-info" onClick={() => onEdit(product)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => void onDelete(product._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-base-content/70">
          Page {pagination.page} of {pagination.totalPages} · Total {pagination.totalItems}
        </p>
        <div className="join">
          <button
            className="join-item btn"
            disabled={pagination.page <= 1}
            onClick={() => updateQuery({ page: pagination.page - 1 })}
          >
            Previous
          </button>
          <button
            className="join-item btn"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => updateQuery({ page: pagination.page + 1 })}
          >
            Next
          </button>
        </div>
      </div>

      {error ? <div className="alert alert-error"><span>{error}</span></div> : null}

      <Modal title="Product Form" open={formOpen} onClose={() => setFormOpen(false)}>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-control w-full">
            <span className="label-text">Name</span>
            <input className="input input-bordered w-full" {...register("name", { required: true })} />
            {formState.errors.name ? <span className="text-error text-sm">Name is required</span> : null}
          </label>

          <label className="form-control w-full">
            <span className="label-text">Price</span>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input input-bordered w-full"
              {...register("price", { required: true, valueAsNumber: true, min: 0 })}
            />
            {formState.errors.price ? <span className="text-error text-sm">Valid price is required</span> : null}
          </label>

          <label className="form-control w-full">
            <span className="label-text">Provider</span>
            <select className="select select-bordered w-full" {...register("providerId", { required: true })}>
              <option value="">Select provider</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
            {formState.errors.providerId ? (
              <span className="text-error text-sm">Provider is required</span>
            ) : null}
          </label>

          <label className="form-control w-full">
            <span className="label-text">Description</span>
            <textarea className="textarea textarea-bordered w-full" rows={3} {...register("description")} />
          </label>

          <div className="modal-action">
            <button type="button" className="btn" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal title="Product Details" open={viewOpen} onClose={() => setViewOpen(false)}>
        {selectedProduct ? (
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {selectedProduct.name}</p>
            <p><span className="font-semibold">Price:</span> ${selectedProduct.price.toFixed(2)}</p>
            <p><span className="font-semibold">Provider:</span> {providerMap.get(selectedProduct.providerId) ?? "Unknown"}</p>
            <p><span className="font-semibold">Description:</span> {selectedProduct.description ?? "-"}</p>
            <p><span className="font-semibold">Created:</span> {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleString() : "-"}</p>
          </div>
        ) : null}
      </Modal>
    </section>
  );
};
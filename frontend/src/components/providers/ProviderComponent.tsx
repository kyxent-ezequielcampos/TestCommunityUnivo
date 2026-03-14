import React from "react";
import { useForm } from "react-hook-form";
import type { ProviderInterface } from "../../interfaces/Providers.interface";
import { useProviderService } from "../../hooks/useProvider.service";
import { Modal } from "../atoms/Modal";
import { Toast } from "../atoms/Toast";

export const ProviderComponent = () => {
  const { handleSubmit, formState, reset, register } = useForm<
    Partial<ProviderInterface>
  >({
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      description: "",
      email: "",
      status: "active",
    },
  });

  const {
    createProvider,
    updateProvider,
    deleteProvider,
    getProviderById,
    providers,
    pagination,
    query,
    updateQuery,
    loading,
    error,
  } = useProviderService();

  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const onSubmit = async (data: Partial<ProviderInterface>) => {
    try {
      if (data._id) {
        await updateProvider(data._id, data);
        showToast("Provider updated", "success");
      } else {
        await createProvider(data);
        showToast("Provider created", "success");
      }
      reset({
        name: "",
        address: "",
        phone: "",
        description: "",
        email: "",
        status: "active",
      });
      setOpen(false);
    } catch {
      showToast("Provider action failed", "error");
    }
  };

  const [open, setOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<ProviderInterface | null>(null);

  const onEdit = (provider: ProviderInterface) => {
    reset(provider);
    setOpen(true);
  };

  const onView = async (providerId: string) => {
    const result = await getProviderById(providerId);
    if (result) {
      setSelectedProvider(result);
      setViewOpen(true);
    }
  };

  const onDelete = async (providerId: string) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this provider?");
    if (!shouldDelete) return;

    try {
      await deleteProvider(providerId);
      showToast("Provider deleted", "success");
    } catch {
      showToast("Could not delete provider", "error");
    }
  };

  return (
    <section className="space-y-4">
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Providers</h2>
          <p className="text-base-content/70">Manage your provider catalog</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            reset({
              name: "",
              address: "",
              phone: "",
              description: "",
              email: "",
              status: "active",
            });
            setOpen(true);
          }}
        >
          Add Provider
        </button>
      </div>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body grid gap-3 md:grid-cols-4">
          <label className="form-control">
            <span className="label-text">Search by name</span>
            <input
              className="input input-bordered"
              placeholder="tech"
              value={query.nameLike}
              onChange={(event) => updateQuery({ nameLike: event.target.value })}
            />
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
            </select>
          </label>

          <label className="form-control">
            <span className="label-text">Per page</span>
            <select
              className="select select-bordered"
              value={query.limit}
              onChange={(event) => updateQuery({ limit: Number(event.target.value) })}
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>
          </label>

          <div className="stats shadow">
            <div className="stat py-3">
              <div className="stat-title">Total</div>
              <div className="stat-value text-primary text-2xl">{pagination.totalItems}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
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
            ) : providers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-base-content/60">
                  No providers found
                </td>
              </tr>
            ) : (
              providers.map((provider) => (
                <tr key={provider._id}>
                  <td>{provider.name}</td>
                  <td>{provider.address}</td>
                  <td>{provider.phone}</td>
                  <td>
                    <span className={`badge ${provider.status === "inactive" ? "badge-error" : "badge-success"}`}>
                      {provider.status ?? "active"}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button className="btn btn-sm" onClick={() => void onView(provider._id)}>
                      View
                    </button>
                    <button className="btn btn-sm btn-info" onClick={() => onEdit(provider)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => void onDelete(provider._id)}>
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
          Page {pagination.page} of {pagination.totalPages}
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

      <Modal title="Provider Form" open={open} onClose={() => setOpen(false)}>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-control w-full">
            <span className="label-text">Name</span>
            <input className="input input-bordered w-full" type="text" {...register("name", { required: true })} />
            {formState.errors.name ? <span className="text-error text-sm">Name is required</span> : null}
          </label>

          <label className="form-control w-full">
            <span className="label-text">Address</span>
            <input className="input input-bordered w-full" type="text" {...register("address", { required: true })} />
            {formState.errors.address ? <span className="text-error text-sm">Address is required</span> : null}
          </label>

          <label className="form-control w-full">
            <span className="label-text">Phone</span>
            <input className="input input-bordered w-full" type="text" {...register("phone", { required: true })} />
            {formState.errors.phone ? <span className="text-error text-sm">Phone is required</span> : null}
          </label>

          <label className="form-control w-full">
            <span className="label-text">Email</span>
            <input className="input input-bordered w-full" type="email" {...register("email")} />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Description</span>
            <textarea className="textarea textarea-bordered w-full" rows={3} {...register("description")} />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Status</span>
            <select className="select select-bordered w-full" {...register("status")}>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </label>

          <div className="modal-action">
            <button className="btn" type="button" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal title="Provider Details" open={viewOpen} onClose={() => setViewOpen(false)}>
        {selectedProvider ? (
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {selectedProvider.name}</p>
            <p><span className="font-semibold">Address:</span> {selectedProvider.address}</p>
            <p><span className="font-semibold">Phone:</span> {selectedProvider.phone}</p>
            <p><span className="font-semibold">Email:</span> {selectedProvider.email ?? "-"}</p>
            <p><span className="font-semibold">Description:</span> {selectedProvider.description ?? "-"}</p>
            <p><span className="font-semibold">Status:</span> {selectedProvider.status ?? "active"}</p>
          </div>
        ) : null}
      </Modal>
    </section>
  );
};

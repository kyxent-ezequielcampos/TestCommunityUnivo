import Elysia from "elysia";
import { providerController } from "../controllers/Provider.controller";

class ProviderRouter {
  controller = providerController;

  initService(
    router = new Elysia({
      prefix: "/providers",
    }),
  ) {
    router.get("/", (c) => this.controller.getAllProviders(c));
    router.get("/:id", (c) => this.controller.getProviderById(c));
    router.post("/", (c) => this.controller.createProvider(c));
    router.put("/:id", (c) => this.controller.updateProvider(c));
    router.patch("/:id", (c) => this.controller.updateProvider(c));
    router.delete("/:id", (c) => this.controller.deleteProvider(c));
    return router;
  }
}

export const providerRouter = new ProviderRouter();

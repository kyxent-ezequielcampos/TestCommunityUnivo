import Elysia from "elysia";
import { productController } from "../controllers/Product.controller";

class ProductRouter {
  controller = productController;

  initService(
    router = new Elysia({
      prefix: "/products",
    }),
  ) {
    router.get("/", (c) => this.controller.getAllProducts(c));
    router.get("/:id", (c) => this.controller.getProductById(c));
    router.post("/", (c) => this.controller.createProduct(c));
    router.put("/:id", (c) => this.controller.updateProduct(c));
    router.delete("/:id", (c) => this.controller.deleteProduct(c));

    return router;
  }
}

export const productRouter = new ProductRouter();
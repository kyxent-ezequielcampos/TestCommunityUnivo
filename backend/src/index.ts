import { Elysia } from "elysia";
import { providerRouter } from "./routes/Provider.router";
import { mongoService } from "./database/Mongo.service";
import cors from "@elysiajs/cors";
import { productRouter } from "./routes/Product.router";

if (!Bun.env.MONGO_URL)
  throw new Error("MONGO_URL is not defined in the environment variables");

await mongoService();

const app = new Elysia().get("/", () => ({
  success: true,
  message: "API running",
}));


app.use(cors());

app.use(providerRouter.initService());
app.use(productRouter.initService());

app.listen(Number(Bun.env.PORT || 3000));

console.log(
  `Backend is running at ${app.server?.hostname}:${app.server?.port}`,
);

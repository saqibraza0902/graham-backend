import dotev from "dotenv";
dotev.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
// mongodb-->
const mongoURI = process.env.MONGO_URI as string;
mongoose
  .connect(mongoURI)
  .then(async () => {
    // handle creation of admins
    try {
      // await ensureAdminExists()
    } catch (error) {}
    // handle creation of admins
    console.log(`DB Connected.`);
  })
  .catch((err) => console.log(err));
// routes *
import authRoute from "./src/routes/auth.routes.js";
import userAddRoute from "./src/routes/USER/add.user.routes.js";
import categoryRoute from "./src/routes/category.routes.js";
import brandRoute from "./src/routes/brand.routes.js";
import taxRoute from "./src/routes/tax.routes.js";
import subscriptionRoute from "./src/routes/subscription.routes.js";
import userCategory from "./src/routes/USER/category.user.routes.js";
import userBrand from "./src/routes/USER/brand.user.routes.js";
import userSubscription from "./src/routes/USER/subscription.user.routes.js";
import addRoute from "./src/routes/add.routes.js";
import userAdminRoute from "./src/routes/user.routes.js";
import likedProductRoute from "./src/routes/USER/likedproduct.user.routes.js";
import adminAuthRoute from "./src/routes/auth.admin.routes.js";
import { ensureAdminExists } from "./src/lib/ensureAdminExists.js";
import orderUserRoute from "./src/routes/USER/order.user.routes.js";
import orderAdminRoute from "./src/routes/order.routes.js";
import userRouter from "./src/routes/USER/user.user.routes.js";
app.use(authRoute);
app.use(userAddRoute);
app.use("/category", categoryRoute);
app.use("/brand", brandRoute);
app.use("/tax", taxRoute);
app.use("/subscription", subscriptionRoute);
app.use("/category/user", userCategory);
app.use("/brand/user", userBrand);
app.use("/subscription/user", userSubscription);
app.use("/admin", addRoute);
app.use("/admin", userAdminRoute);
app.use("/liked-product/user", likedProductRoute);
app.use("/admin", adminAuthRoute);
app.use("/order", orderUserRoute);
app.use("/admin", orderAdminRoute);
app.use("/user", userRouter);
// routes *
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});

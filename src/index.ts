import dotev from 'dotenv'
dotev.config()
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
// mongodb-->
const mongoURI = process.env.MONGO_URI as string
mongoose.connect(mongoURI).then(async () => {
    // handle creation of admins
    try {
        // await ensureAdminExists()
    } catch (error) {

    }
    // handle creation of admins
    console.log(`DB Connected.`)
}).catch((err) => console.log(err))
// routes *
import authRoute from './routes/auth.routes.js'
import userAddRoute from './routes/USER/add.user.routes.js'
import categoryRoute from './routes/category.routes.js'
import brandRoute from './routes/brand.routes.js'
import taxRoute from './routes/tax.routes.js'
import subscriptionRoute from './routes/subscription.routes.js'
import userCategory from './routes/USER/category.user.routes.js'
import userBrand from './routes/USER/brand.user.routes.js'
import userSubscription from './routes/USER/subscription.user.routes.js'
import addRoute from './routes/add.routes.js'
import userAdminRoute from './routes/user.routes.js'
import likedProductRoute from './routes/USER/likedproduct.user.routes.js'
import adminAuthRoute from './routes/auth.admin.routes.js'
import { ensureAdminExists } from './lib/ensureAdminExists.js'
import orderUserRoute from './routes/USER/order.user.routes.js'
import orderAdminRoute from './routes/order.routes.js'
import userRouter from './routes/USER/user.user.routes.js'
app.use(authRoute)
app.use(userAddRoute)
app.use('/category', categoryRoute)
app.use('/brand', brandRoute)
app.use('/tax', taxRoute)
app.use("/subscription", subscriptionRoute)
app.use("/category/user", userCategory)
app.use("/brand/user", userBrand)
app.use("/subscription/user", userSubscription)
app.use("/admin", addRoute)
app.use("/admin", userAdminRoute)
app.use("/liked-product/user", likedProductRoute)
app.use("/admin", adminAuthRoute)
app.use("/order", orderUserRoute)
app.use("/admin", orderAdminRoute)
app.use("/user", userRouter)
// routes *
const PORT = process.env.PORT
app.listen(PORT, () => { console.log(`server is running at http://localhost:${PORT}`) })
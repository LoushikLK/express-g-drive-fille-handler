import express from "express";
import errorHandler from "./middlewares/error.middleware";
import topLevelMiddlewares from "./middlewares/topLevel.middleware";
import connectToDb from "./services/db.service";
import routeParser from "./services/route.service";
require("dotenv").config();

const PORT = process.env.PORT || 8000;

//initialize the app
const app = express();

//connect to the database
connectToDb();

//set up all the primary middlewares
topLevelMiddlewares(app);

//set up all routes
routeParser(app);

//handles error and not found routes
errorHandler(app);

//start the server and  listen to the port specified
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

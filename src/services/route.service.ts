import { Application } from "express";
import { readdirSync } from "fs";
import path from "path";

const routeParser = (app: Application) => {
  //found all the file inside route folder

  const allFiles = readdirSync(path.join(__dirname, "../", "routes"));

  //loop over all the files and setup them as routes

  allFiles?.forEach((file) => {
    //if they are of specific file name then import them and user them as routes
    if (file?.includes(".routes.")) {
      let router = require(path.join(__dirname, "../", "routes", file));
      app.use(`/api/v1/${file.split(".")[0]}`, router.default);
    }
  });
};

export default routeParser;

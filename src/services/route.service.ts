import { Application } from "express";
import { readdirSync } from "fs";
import path from "path";

/**
 * Parses all route files and sets them up as routes in the application. present in the routes folder
 * @param {Application} app - The Express application instance.
 */
const routeParser = (app: Application) => {
  // Find all the files inside the routes folder
  const allFiles = readdirSync(path.join(__dirname, "../", "routes"));

  // Loop over all the files and set them up as routes
  allFiles?.forEach((file) => {
    // If they are of specific file name then import them and use them as routes
    if (file?.includes(".routes.")) {
      let router = require(path.join(__dirname, "../", "routes", file));
      app.use(`/api/v1/${file.split(".")[0]}`, router.default);
    }
  });
};

export default routeParser;

import authRoute from "./authRoute";
import appsRoute from "./appsRoute";
import uiComponentsRoute from "./uiComponentsRoute";
import pagesRoute from "./pagesRoute";
import menuRoute from "./menuRoute";

export const publicRoutes = [...authRoute];

export const protectedRoutes = [
  ...appsRoute,
  // ...uiComponentsRoute,
  // ...pagesRoute,
  // ...authDemoRoute,
  // ...docsRoute,
  ...menuRoute,
];

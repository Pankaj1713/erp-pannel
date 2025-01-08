import appsNavigationConfig from "./apps.navigation.config";
// import uiComponentNavigationConfig from "./ui-components.navigation.config";
// import pagesNavigationConfig from "./pages.navigation.config";
// import authNavigationConfig from "./auth.navigation.config";
// import docNavigationConfig from "./doc.navigation.config";
import menuNavigationConfig from "./menu.navigation.config";

let navigationConfig = [...menuNavigationConfig];

if (process.env.NODE_ENV === "development") {
  navigationConfig = [
    ...menuNavigationConfig,
    // ...appsNavigationConfig,
    // ...uiComponentNavigationConfig,
    // ...pagesNavigationConfig,
    // ...authNavigationConfig,
    // ...docNavigationConfig,
  ];
}

export default navigationConfig;

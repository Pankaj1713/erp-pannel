import store from "store";

export const ACCESS = {
  READ: "read",
  WRITE: "edit",
  DELETE: "delete",
};

export const MODULE = {
  DASHBOARD: "dashboard",
  CATEGORIES: "categories",
  SERVICES: "services",
  BANNERS: "banners",
  PACKAGES: "packages",
  BOOKINGS: "bookings",
  DISCOUNTS: "discounts",
  TAXATION: "taxation",
  CANCELATION: "taxation",
  STAFF: "staff and admins",
  CUSTOMERS: "customers",
  CONTACT: "contact",
  APPCONFIG: "appConfig",
};

export const newColumn = (columns, module) => {
  let newColumns = [];

  if (
    !hasPermission(module, ACCESS.DELETE) &&
    !hasPermission(module, ACCESS.WRITE)
  ) {
    newColumns = columns.filter((col, index) => {
      return index !== 0;
    });
  } else {
    newColumns = columns;
  }

  return newColumns;
};

const hasPermission = (module, access) => {
  const user = store?.getState()?.auth?.user?.data;

  if (user?.type === 1) {
    return true;
  }

  const userRoles = user?.access;


  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  const moduleAccess = userRoles.find((role) => role.name === module);

  if (moduleAccess && moduleAccess[access]) {
    return true;
  }

  return false;
};

export default hasPermission;

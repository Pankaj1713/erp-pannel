import React from "react";
import { APP_PREFIX_PATH } from "constants/route.constant";
import { ADMIN, USER } from "constants/roles.constant";
import hasPermisson, { ACCESS, MODULE } from "utils/hasPermission";

const menuRoute = [
  {
    key: "routes.bookingDashboard",
    path: `${APP_PREFIX_PATH}/booking-dashboard`,
    component: React.lazy(() => import("views/bookingDashboard")),
    authority: [ADMIN, USER],
    show: () => true,
  },
  {
    key: "routes.salesDashboard",
    path: `${APP_PREFIX_PATH}/sales-dashboard`,
    component: React.lazy(() => import("views/salesDashboard")),
    authority: [ADMIN, USER],
    show: () => true,
  },
  {
    key: "routes.service",
    path: `${APP_PREFIX_PATH}/service`,
    component: React.lazy(() => import("views/services")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SERVICES, ACCESS.READ),
    meta: {
      header: "Services",
      headerContainer: true,
    },
  },
  {
    key: "routes.service",
    path: `${APP_PREFIX_PATH}/service/add`,
    component: React.lazy(() => import("views/services/addEdit")),
    authority: [ADMIN, USER],
    show: () => {
      return hasPermisson(MODULE.SERVICES, ACCESS.WRITE);
    },
    meta: {
      header: "Add New Service",
      headerContainer: true,
    },
  },
  {
    key: "routes.services",
    path: `${APP_PREFIX_PATH}/services/edit/:id`,
    component: React.lazy(() => import("views/services/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SERVICES, ACCESS.WRITE),
    meta: {
      header: "Edit Services",
      headerContainer: true,
    },
  },
  {
    key: "routes.packages",
    path: `${APP_PREFIX_PATH}/packages`,
    component: React.lazy(() => import("views/packages")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.PACKAGES, ACCESS.READ),
    meta: {
      header: "Packages",
      headerContainer: true,
    },
  },
  {
    key: "routes.packages",
    path: `${APP_PREFIX_PATH}/packages/add`,
    component: React.lazy(() => import("views/packages/addEdit")),
    authority: [ADMIN, USER],
    show: () => {
      return hasPermisson(MODULE.PACKAGES, ACCESS.WRITE);
    },
    meta: {
      header: "Add New Packages",
      headerContainer: true,
    },
  },
  {
    key: "routes.packages",
    path: `${APP_PREFIX_PATH}/packages/edit/:id`,
    component: React.lazy(() => import("views/packages/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.PACKAGES, ACCESS.WRITE),
    meta: {
      header: "Edit packages",
      headerContainer: true,
    },
  },
  {
    key: "routes.banners",
    path: `${APP_PREFIX_PATH}/banners`,
    component: React.lazy(() => import("views/banners")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.BANNERS, ACCESS.READ),
    meta: {
      header: "Banners",
      headerContainer: true,
    },
  },
  {
    key: "routes.banners",
    path: `${APP_PREFIX_PATH}/banners/add`,
    component: React.lazy(() => import("views/banners/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.BANNERS, ACCESS.WRITE),
    meta: {
      header: "Add New Banners",
      headerContainer: true,
    },
  },
  {
    key: "routes.banners",
    path: `${APP_PREFIX_PATH}/banners/edit/:id`,
    component: React.lazy(() => import("views/banners/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.BANNERS, ACCESS.WRITE),
    meta: {
      header: "Edit Banners",
      headerContainer: true,
    },
  },
  {
    key: "routes.bookings",
    path: `${APP_PREFIX_PATH}/bookings`,
    component: React.lazy(() => import("views/bookings")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.BOOKINGS, ACCESS.READ),
    meta: {
      header: "Bookings",
      headerContainer: true,
    },
  },
  {
    key: "routes.bookings",
    path: `${APP_PREFIX_PATH}/bookings/add`,
    component: React.lazy(() => import("views/bookings/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.BOOKINGS, ACCESS.WRITE),
    meta: {
      header: "Add Booking",
      headerContainer: true,
    },
  },
  {
    key: "routes.bookings",
    path: `${APP_PREFIX_PATH}/bookings/edit/:orderNumber`,
    component: React.lazy(() => import("views/bookings/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.BOOKINGS, ACCESS.WRITE),
    meta: {
      header: "Edit Booking",
      headerContainer: true,
    },
  },
  {
    key: "routes.taxation",
    path: `${APP_PREFIX_PATH}/taxation`,
    component: React.lazy(() => import("views/taxation")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.TAXATION, ACCESS.READ),
    meta: {
      header: "Taxation",
    },
  },
  {
    key: "routes.cancelation",
    path: `${APP_PREFIX_PATH}/cancelation`,
    component: React.lazy(() => import("views/cancelation")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.CANCELATION, ACCESS.READ),
    meta: {
      header: "Cancellation Rules",
    },
  },
  {
    key: "routes.staff",
    path: `${APP_PREFIX_PATH}/staff`,
    component: React.lazy(() => import("views/staff")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.STAFF, ACCESS.READ),
    meta: {
      header: "Staff And Admins",
    },
  },
  {
    key: "routes.staff",
    path: `${APP_PREFIX_PATH}/staff/add`,
    component: React.lazy(() => import("views/staff/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.STAFF, ACCESS.WRITE),
    meta: {
      header: "Add Staff And Admins",
    },
  },
  {
    key: "routes.staff",
    path: `${APP_PREFIX_PATH}/staff/edit/:id`,
    component: React.lazy(() => import("views/staff/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.STAFF, ACCESS.WRITE),
    meta: {
      header: "Edit Staff And Admins",
    },
  },
  {
    key: "routes.discounts",
    path: `${APP_PREFIX_PATH}/discounts`,
    component: React.lazy(() => import("views/discounts")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.DISCOUNTS, ACCESS.READ),
    meta: {
      header: "Discounts",
    },
  },
  {
    key: "routes.discounts",
    path: `${APP_PREFIX_PATH}/discounts/add`,
    component: React.lazy(() => import("views/discounts/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.DISCOUNTS, ACCESS.WRITE),
    meta: {
      header: "Add Discount",
    },
  },
  {
    key: "routes.discounts",
    path: `${APP_PREFIX_PATH}/discounts/edit/:id`,
    component: React.lazy(() => import("views/discounts/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.DISCOUNTS, ACCESS.WRITE),
    meta: {
      header: "Edit Discount",
    },
  },
  {
    key: "routes.customers",
    path: `${APP_PREFIX_PATH}/customers`,
    component: React.lazy(() => import("views/customers")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.CUSTOMERS, ACCESS.READ),
    meta: {
      header: "Customers",
    },
  },
  {
    key: "routes.category",
    path: `${APP_PREFIX_PATH}/category`,
    component: React.lazy(() => import("views/category")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.CATEGORIES, ACCESS.WRITE),
    meta: {
      header: "Category",
    },
  },
  {
    key: "routes.appConfig",
    path: `${APP_PREFIX_PATH}/appConfig`,
    component: React.lazy(() => import("views/appConfig")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.APPCONFIG, ACCESS.READ),
    meta: {
      header: "AppConfig",
    },
  },
  {
    key: "routes.appConfig",
    path: `${APP_PREFIX_PATH}/appConfig/add`,
    component: React.lazy(() => import("views/appConfig/addEdit")),
    authority: [ADMIN, USER],
    show: () => {
      return hasPermisson(MODULE.APPCONFIG, ACCESS.WRITE);
    },
    meta: {
      header: "Add New Config",
      headerContainer: true,
    },
  },
  {
    key: "routes.appConfig",
    path: `${APP_PREFIX_PATH}/appConfig/edit/:id`,
    component: React.lazy(() => import("views/appConfig/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.APPCONFIG, ACCESS.WRITE),
    meta: {
      header: "Edit Timings",
      headerContainer: true,
    },
  },
  {
    key: "routes.purchaseReturn",
    path: `${APP_PREFIX_PATH}/purchase-return`,
    component: React.lazy(() => import("views/purchaseReturn")),
    authority: [ADMIN, USER],
    show: () => true,
    meta: {
      header: "Purchase Return",
      headerContainer: true,
    },
  },
  {
<<<<<<< HEAD
    key: "routes.posinvoice",
    path: `${APP_PREFIX_PATH}/posinvoice`,
    component: React.lazy(() => import("views/posinvoice")),
    authority: [ADMIN, USER],
    show: () => true,
=======
    key: "routes.configuration",
    path: `${APP_PREFIX_PATH}/companySetup`,
    component: React.lazy(() => import("views/configuration")),
    authority: [ADMIN, USER],
    show: () => true,
    meta: {
      header: "Configuration",
      headerContainer: true,
    },
  },
  {
    key: "routes.purchaseBill",
    path: `${APP_PREFIX_PATH}/purchase-bill`,
    component: React.lazy(() => import("views/purchaseBill")),
    authority: [ADMIN, USER],
    show: () => true,
    meta: {
      header: "Purchase Bill",
      headerContainer: true,
    },
>>>>>>> 5a0970598754a2e139849aaec1e383e3b1950d9a
  },
];

export default menuRoute;

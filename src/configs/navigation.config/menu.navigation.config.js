import { APP_PREFIX_PATH } from "constants/route.constant";
import {
  NAV_ITEM_TYPE_ITEM,
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_COLLAPSE,
} from "constants/navigation.constant";
import { ADMIN, USER } from "constants/roles.constant";

import hasPermisson, { ACCESS, MODULE } from "utils/hasPermission";

const menuNavigationConfig = [
  {
    key: "menu",
    path: "",
    title: "Menu",
    // translateKey: "nav.docs.guide",
    icon: "guide",
    type: NAV_ITEM_TYPE_TITLE,
    authority: [ADMIN, USER],
    subMenu: [
      {
        key: "routes.dashboard",
        // path: `${APP_PREFIX_PATH}/dashboard`,
        title: "Dashboard",
        // translateKey: "nav.docs.documentation",
        icon: "home",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        isVisible: () => true,
        subMenu: [
          {
            key: "routes.bookingDashboard",
            path: `${APP_PREFIX_PATH}/booking-dashboard`,
            title: "Booking Dashboard ",
            // translateKey: "nav.docs.documentation",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            isVisible: () => true,
            subMenu: [],
          },
          {
            key: "routes.salesDashboard",
            path: `${APP_PREFIX_PATH}/sales-dashboard`,
            title: "Sales Dashboard ",
            // translateKey: "nav.docs.documentation",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            isVisible: () => true,
            subMenu: [],
          },
        ],
      },
      {
        key: "routes.purchase",
        title: "Purchase",
        icon: "bag",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        isVisible: () => true,
        subMenu: [
          {
            key: "routes.purchaseReturn",
            path: `${APP_PREFIX_PATH}/purchase-return`,
            title: "Purchase Return",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            isVisible: () => true,
            subMenu: [],
          },
        ],
      },
      {
        key: "routes.pointofsale",
        title: "Point of Sale",
        icon: "crypto",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        isVisible: () => true,
        subMenu: [
          {
            key: "routes.posinvoice",
            path: `${APP_PREFIX_PATH}/posinvoice`,
            title: "POS Invoice",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            isVisible: () => true,
            subMenu: [],
          },
        ],
      },
      {
        key: "apps.catalogues",
        // path: '',
        title: "Catalogues",
        // translateKey: "nav.appsProject.project",
        icon: "catalogues",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        isVisible: () => {
          return (
            hasPermisson(MODULE.STAYS, ACCESS.READ) ||
            hasPermisson(MODULE.ADVENTURES, ACCESS.READ) ||
            hasPermisson(MODULE.JOURNEYS, ACCESS.READ)
          );
        },
        subMenu: [
          {
            key: "routes.category",
            path: `${APP_PREFIX_PATH}/category`,
            title: "Categories",
            // translateKey: "nav.docs.utilsDoc",
            icon: "project",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.STAYS, ACCESS.READ),
          },
          {
            key: "routes.service",
            path: `${APP_PREFIX_PATH}/service`,
            title: "Services",
            // translateKey: "nav.docs.sharedComponentDoc",
            icon: "navigation",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.ADVENTURES, ACCESS.READ),
          },
          {
            key: "routes.banners",
            path: `${APP_PREFIX_PATH}/banners`,
            title: "Banners",
            // translateKey: "nav.docs.changeLog",
            icon: "banners",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.JOURNEYS, ACCESS.READ),
          },
          {
            key: "routes.packages",
            path: `${APP_PREFIX_PATH}/packages`,
            title: "Packages",
            // translateKey: "nav.docs.changeLog",
            icon: "packages",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.JOURNEYS, ACCESS.READ),
          },
        ],
      },
      {
        key: "apps.orderManagement",
        // path: '',
        title: "Order Management",
        // translateKey: "nav.appsProject.project",
        icon: "orderManagement",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        isVisible: () => {
          return (
            hasPermisson(MODULE.BOOKINGS, ACCESS.READ) ||
            hasPermisson(MODULE.DISCOUNTS, ACCESS.READ) ||
            hasPermisson(MODULE.TAXATION, ACCESS.READ)
          );
        },
        subMenu: [
          {
            key: "routes.bookings",
            path: `${APP_PREFIX_PATH}/bookings`,
            title: "Bookings",
            // translateKey: "nav.docs.changeLog",
            icon: "crypto",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.BOOKINGS, ACCESS.READ),
          },
          {
            key: "routes.discounts",
            path: `${APP_PREFIX_PATH}/discounts`,
            title: "Discounts",
            // translateKey: "nav.docs.changeLog",
            icon: "changeLog",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.DISCOUNTS, ACCESS.READ),
          },
          {
            key: "routes.taxation",
            path: `${APP_PREFIX_PATH}/taxation`,
            title: "Taxation",
            // translateKey: "nav.docs.changeLog",
            icon: "taxation",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.TAXATION, ACCESS.READ),
          },
          {
            key: "routes.cancelation",
            path: `${APP_PREFIX_PATH}/cancelation`,
            title: "Cancellation Rules",
            // translateKey: "nav.docs.changeLog",
            icon: "cancelation",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.CANCELATION, ACCESS.READ),
          },
        ],
      },
      {
        key: "apps.userManagement",
        // path: '',
        title: "User Management",
        // translateKey: "nav.appsProject.project",
        icon: "userManagement",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        isVisible: () => {
          return (
            hasPermisson(MODULE.STAFF, ACCESS.READ) ||
            hasPermisson(MODULE.CUSTOMERS, ACCESS.READ)
          );
        },
        subMenu: [
          {
            key: "routes.staff",
            path: `${APP_PREFIX_PATH}/staff`,
            title: "Staff and Admins",
            // translateKey: "nav.docs.changeLog",
            icon: "account",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.STAFF, ACCESS.READ),
          },
          {
            key: "routes.customers",
            path: `${APP_PREFIX_PATH}/customers`,
            title: "Customers",
            // translateKey: "nav.docs.changeLog",
            icon: "crm",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.CUSTOMERS, ACCESS.READ),
          },
        ],
      },
      {
        key: "apps.content",
        // path: '',
        title: "Content",
        // translateKey: "nav.appsProject.project",
        icon: "content",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        isVisible: () => {
          return (
            hasPermisson(MODULE.CONTACT, ACCESS.READ) ||
            hasPermisson(MODULE.BLOGS, ACCESS.READ)
          );
        },

        subMenu: [
          {
            key: "routes.contact",
            path: `${APP_PREFIX_PATH}/contact`,
            title: "Contact Form Entries",
            // translateKey: "nav.docs.changeLog",
            icon: "forms",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.CONTACT, ACCESS.READ),
          },
          {
            key: "routes.appConfig",
            path: `${APP_PREFIX_PATH}/appConfig`,
            title: "App Config",
            // translateKey: "nav.docs.changeLog",
            icon: "forms",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.APPCONFIG, ACCESS.READ),
          },
        ],
      },
    ],
  },
];

export default menuNavigationConfig;

import React from "react";
import { APP_PREFIX_PATH } from "constants/route.constant";
import { ADMIN, USER } from "constants/roles.constant";

const appsRoute = [
  {
    key: "appsProject.dashboard",
    path: `${APP_PREFIX_PATH}/project/dashboard`,
    component: React.lazy(() => import("views/project/ProjectDashboard")),
    authority: [ADMIN, USER],
  },
  {
    key: "appsProject.scrumBoard",
    path: `${APP_PREFIX_PATH}/project/scrum-board`,
    component: React.lazy(() => import("views/project/ScrumBoard")),
    authority: [ADMIN, USER],
    meta: {
      pageContainerType: "gutterless",
    },
  },
  {
    key: "appsProject.issue",
    path: `${APP_PREFIX_PATH}/project/issue`,
    component: React.lazy(() => import("views/project/Issue")),
    authority: [ADMIN, USER],
  },

  {
    key: "appsAccount.settings",
    path: `${APP_PREFIX_PATH}/account/settings/:tab`,
    component: React.lazy(() => import("views/account/Settings")),
    authority: [ADMIN, USER],
    show: () => true,
    meta: {
      header: "Settings",
      headerContainer: true,
    },
  },
  {
    key: "appsAccount.invoice",
    path: `${APP_PREFIX_PATH}/account/invoice/:id`,
    component: React.lazy(() => import("views/account/Invoice")),
    authority: [ADMIN, USER],
  },
  {
    key: "appsAccount.activityLog",
    path: `${APP_PREFIX_PATH}/account/activity-log`,
    component: React.lazy(() => import("views/account/ActivityLog")),
    authority: [ADMIN, USER],
  },
  {
    key: "appsAccount.kycForm",
    path: `${APP_PREFIX_PATH}/account/kyc-form`,
    component: React.lazy(() => import("views/account/KycForm")),
    authority: [ADMIN, USER],
  },
];

export default appsRoute;

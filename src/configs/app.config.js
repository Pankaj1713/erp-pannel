const appConfig = {
  apiBaseUrl: process.env.REACT_APP_API_ENDPOINT,
  pdfBaseUrl: `${process.env.REACT_APP_API_ENDPOINT}bucket/catalogues/`,
  authenticatedEntryPath: "/app/booking-dashboard",
  unAuthenticatedEntryPath: "/sign-in",
  tourPath: "/app/account/kyc-form",
  enableMock: false,
};

export default appConfig;

/**
 * Map Base44 page names to our React Router paths.
 * Add entries here as you enable more pages.
 */
export const routeMap = {
  Home: "/",
  HowItWorks: "/how-it-works",
  Investors: "/investors",
  Documentation: "/docs",

  Register: "/register",
  InvestorRegistration: "/investor/register",
  InvestorLogin: "/investor/login",
  InvestorDashboard: "/investor/dashboard",
  ForgotPassword: "/forgot-password",
  EmailConfirmation: "/email-confirmation",

  PropertyDetails: "/property/details",
  PropertyListed: "/property/listed",
  PhotoUpload: "/photo/upload",
  PhotoUploadIntro: "/photo/upload/intro",

  InvestorSuccess: "/investor/success",
  Congratulations: "/congratulations",
};

/**
 * Accepts either "PageName" or "PageName?query=..." and returns a path.
 */
export function getRoutePath(pageName) {
  if (!pageName) return "/";
  const [base, query] = String(pageName).split("?");
  const path = routeMap[base] || "/";
  return query ? `${path}?${query}` : path;
}

/** Back-compat for existing code that used Base44’s helper name */
export const createPageUrl = getRoutePath;

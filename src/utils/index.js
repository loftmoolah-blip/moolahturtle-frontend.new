/**
 * Map Base44 page names to our React Router paths.
 * Add entries here as you enable more pages.
 *
 * This file is the single source of truth for route paths. If you need a
 * path or page name, look it up here instead of hard-coding it elsewhere.
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

/**
 * Accepts a path (optionally with query) and returns the matching page name.
 */
export function pageNameFromPath(pathname) {
  if (!pathname) return "Home";
  const cleanPath = String(pathname).split("?")[0];
  for (const [pageName, path] of Object.entries(routeMap)) {
    if (path === cleanPath) return pageName;
  }
  return "Home";
}

/** Back-compat for existing code that used Base44’s helper name */
export const createPageUrl = getRoutePath;

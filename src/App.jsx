import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LayoutComponent from "@/components/common/LayoutComponent.jsx";
import { routeMap, pageNameFromPath } from "@/utils/index.js";

// Pages we’ve wired so far (add more as you go)
import Home from "@/pages/Home.jsx";
import HowItWorks from "@/pages/HowItWorks.jsx";
import Investors from "@/pages/Investors.jsx";
import Documentation from "@/pages/Documentation.jsx";

import Register from "@/pages/Register.jsx";
import InvestorRegistration from "@/pages/InvestorRegistration.jsx";
import InvestorLogin from "@/pages/InvestorLogin.jsx";
import InvestorDashboard from "@/pages/InvestorDashboard.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import ForgotPassword from "@/pages/ForgotPassword.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";
import EmailConfirmation from "@/pages/EmailConfirmation.jsx";

import PropertyDetails from "@/pages/PropertyDetails.jsx";
import PropertyListed from "@/pages/PropertyListed.jsx";
import PhotoUpload from "@/pages/PhotoUpload.jsx";
import PhotoUploadIntro from "@/pages/PhotoUploadIntro.jsx";

import InvestorSuccess from "@/pages/InvestorSuccess.jsx";
import Congratulations from "@/pages/Congratulations.jsx";

const pageComponents = {
  Home,
  HowItWorks,
  Investors,
  Documentation,
  Register,
  InvestorRegistration,
  InvestorLogin,
  InvestorDashboard,
  Dashboard,
  ForgotPassword,
  EmailConfirmation,
  PropertyDetails,
  PropertyListed,
  PhotoUpload,
  PhotoUploadIntro,
  InvestorSuccess,
  Congratulations,
};

function Shell() {
  const { pathname } = useLocation();
  const currentPageName = pageNameFromPath(pathname);

  return (
    <LayoutComponent currentPageName={currentPageName}>
      <Routes>
        {Object.entries(routeMap).map(([pageName, path]) => {
          if (pageName === "ResetPassword") return null;
          const Component = pageComponents[pageName];
          return <Route key={pageName} path={path} element={<Component />} />;
        })}
        <Route
          path={routeMap.ResetPassword}
          element={<ResetPassword />}
        />
      </Routes>
    </LayoutComponent>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

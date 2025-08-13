import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import LayoutComponent from "@/components/common/LayoutComponent.jsx";

// Pages we’ve wired so far (add more as you go)
import Home from "@/pages/Home.jsx";
import HowItWorks from "@/pages/HowItWorks.jsx";
import Investors from "@/pages/Investors.jsx";
import Documentation from "@/pages/Documentation.jsx";

import Register from "@/pages/Register.jsx";
import InvestorRegistration from "@/pages/InvestorRegistration.jsx";
import InvestorLogin from "@/pages/InvestorLogin.jsx";
import InvestorDashboard from "@/pages/InvestorDashboard.jsx";
import ForgotPassword from "@/pages/ForgotPassword.jsx";
import EmailConfirmation from "@/pages/EmailConfirmation.jsx";

import PropertyDetails from "@/pages/PropertyDetails.jsx";
import PropertyListed from "@/pages/PropertyListed.jsx";
import PhotoUpload from "@/pages/PhotoUpload.jsx";
import PhotoUploadIntro from "@/pages/PhotoUploadIntro.jsx";

import InvestorSuccess from "@/pages/InvestorSuccess.jsx";
import Congratulations from "@/pages/Congratulations.jsx";

// Map paths back to “page names” for the header’s current page label
const pathToPageName = (pathname) => {
  const map = {
    "/": "Home",
    "/how-it-works": "HowItWorks",
    "/investors": "Investors",
    "/docs": "Documentation",

    "/register": "Register",
    "/investor/register": "InvestorRegistration",
    "/investor/login": "InvestorLogin",
    "/investor/dashboard": "InvestorDashboard",
    "/forgot-password": "ForgotPassword",
    "/email-confirmation": "EmailConfirmation",

    "/property/details": "PropertyDetails",
    "/property/listed": "PropertyListed",
    "/photo/upload": "PhotoUpload",
    "/photo/upload/intro": "PhotoUploadIntro",

    "/investor/success": "InvestorSuccess",
    "/congratulations": "Congratulations",
  };
  return map[pathname] || "Home";
};

function Shell() {
  const { pathname } = useLocation();
  const currentPageName = pathToPageName(pathname);

  return (
    <LayoutComponent currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/docs" element={<Documentation />} />

        <Route path="/register" element={<Register />} />
        <Route path="/investor/register" element={<InvestorRegistration />} />
        <Route path="/investor/login" element={<InvestorLogin />} />
        <Route path="/investor/dashboard" element={<InvestorDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />

        <Route path="/property/details" element={<PropertyDetails />} />
        <Route path="/property/listed" element={<PropertyListed />} />
        <Route path="/photo/upload" element={<PhotoUpload />} />
        <Route path="/photo/upload/intro" element={<PhotoUploadIntro />} />

        <Route path="/investor/success" element={<InvestorSuccess />} />
        <Route path="/congratulations" element={<Congratulations />} />
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

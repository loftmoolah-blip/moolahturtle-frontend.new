import Layout from "./Layout.jsx";

import Home from "./Home";

import HowItWorks from "./HowItWorks";

import Investors from "./Investors";

import Register from "./Register";

import PropertyDetails from "./PropertyDetails";

import PhotoUpload from "./PhotoUpload";

import Congratulations from "./Congratulations";

import InvestorRegistration from "./InvestorRegistration";

import InvestorSuccess from "./InvestorSuccess";

import PhotoUploadIntro from "./PhotoUploadIntro";

import PropertyListed from "./PropertyListed";

import InvestorDashboard from "./InvestorDashboard";

import InvestorLogin from "./InvestorLogin";

import Documentation from "./Documentation";

import ForgotPassword from "./ForgotPassword";

import ResetPassword from "./ResetPassword";

import EmailConfirmation from "./EmailConfirmation";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    HowItWorks: HowItWorks,
    
    Investors: Investors,
    
    Register: Register,
    
    PropertyDetails: PropertyDetails,
    
    PhotoUpload: PhotoUpload,
    
    Congratulations: Congratulations,
    
    InvestorRegistration: InvestorRegistration,
    
    InvestorSuccess: InvestorSuccess,
    
    PhotoUploadIntro: PhotoUploadIntro,
    
    PropertyListed: PropertyListed,
    
    InvestorDashboard: InvestorDashboard,
    
    InvestorLogin: InvestorLogin,
    
    Documentation: Documentation,
    
    ForgotPassword: ForgotPassword,
    
    ResetPassword: ResetPassword,
    
    EmailConfirmation: EmailConfirmation,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/HowItWorks" element={<HowItWorks />} />
                
                <Route path="/Investors" element={<Investors />} />
                
                <Route path="/Register" element={<Register />} />
                
                <Route path="/PropertyDetails" element={<PropertyDetails />} />
                
                <Route path="/PhotoUpload" element={<PhotoUpload />} />
                
                <Route path="/Congratulations" element={<Congratulations />} />
                
                <Route path="/InvestorRegistration" element={<InvestorRegistration />} />
                
                <Route path="/InvestorSuccess" element={<InvestorSuccess />} />
                
                <Route path="/PhotoUploadIntro" element={<PhotoUploadIntro />} />
                
                <Route path="/PropertyListed" element={<PropertyListed />} />
                
                <Route path="/InvestorDashboard" element={<InvestorDashboard />} />
                
                <Route path="/InvestorLogin" element={<InvestorLogin />} />
                
                <Route path="/Documentation" element={<Documentation />} />
                
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                
                <Route path="/ResetPassword" element={<ResetPassword />} />
                
                <Route path="/EmailConfirmation" element={<EmailConfirmation />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
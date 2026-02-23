import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import AboutUs from "../pages/aboutus"
import Parah from "../pages/parah"
import Login from "../pages/loguser";
import Payment from "../pages/payment"
import Subscription from "../pages/subscriptions"
import NotFound from "../pages/notfound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/parah" element={<Parah />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

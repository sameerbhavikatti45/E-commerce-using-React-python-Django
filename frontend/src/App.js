import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Auth from "./Pages/Auth";
import Cart from "./Pages/Cart";
import ForgotPassword from "./Components/ForgotPassword";
import CategoryProducts from './Components/CategoryProducts';
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
         <Route path="/categories/:id" element={<CategoryProducts />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

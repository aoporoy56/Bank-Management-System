import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"; // Added useNavigate here
import "bootstrap/dist/css/bootstrap.min.css";
import CustomerDeshboard from "./Pages/CustomerDeshboard";
import CustomerRegister from "./Pages/CustomerRegister";
import CustomerLogin from "./Pages/CustomerLogin";
import TransferMoney from "./Components/TransferMoney";
import AdminDeshboard from "./Pages/AdminDeshboard";
import AllAccountList from "./Components/AllAccountList";
import Header from "./Components/Header";
import AdminLogin from "./Pages/AdminLogin";
import UserProvider, { useUser } from "./Context/UserProvider";
import Track from "./Pages/Track";
import ProtectedRoute from "./Context/ProtectedRoute";
import TransitionHistory from "./Components/TransactionList";
import ChangePassword from "./Components/ChangePassword";
import PasswordReset from "./Pages/PasswordReset";
import NewPassword from "./Pages/NewPassword";
import Balance from "./Components/Balance";
import CustomerTransactionHistory from "./Components/CustomerTransactionHistory";
import AccountPreview from "./Components/AccountPreview";
import SearchAccount from "./Components/SearchAccount";
import MyProfile from "./Pages/MyProfile";
import DepositMoney from "./Pages/DepositMoney";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <UserProvider>
            <Header />
              <Routes>
                {/* Public Routes */}
                <Route path="/customer/register" element={<CustomerRegister />} />
                <Route path="/customer/login" element={<CustomerLogin />} />
                <Route path="/customer/reset" element={<PasswordReset />} />
                <Route path="/customer/new-password" element={<NewPassword />} />


                <Route path="/admin" element={<AdminDeshboard />}  />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/allaccountlist" element={<AllAccountList />} />
                <Route path="/admin/searchAccount" element={<SearchAccount />} />
                <Route path="/admin/depositMoney" element={<DepositMoney />} />
                <Route path="/" element={<Home />} />
                <Route path="/track" element={<Track />} />

                {/* Private Routes */}
                <Route path="/customer" element={<ProtectedRoute component={CustomerDeshboard} />} />
                <Route path="/customer/myAccount" element={<ProtectedRoute component={MyProfile} />} />
                <Route path="/customer/transfer" element={<ProtectedRoute component={TransferMoney} />} />
                <Route path="/customer/balance" element={<ProtectedRoute component={Balance} />} />
                <Route path="/customer/transactions" element={<ProtectedRoute component={CustomerTransactionHistory} />} />
                <Route path="/customer/changePassword" element={<ProtectedRoute component={ChangePassword} />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
              </Routes>
          </UserProvider>
        </BrowserRouter>
    </div>
  );
}



export default App;

import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Admin
import AdminHome from "./admin/AdminHome";
import Users from "./admin/Users";
import Stores from "./admin/Stores";
import UserDetails from "./admin/UserDetails";

// Normal User
import UserDashboard from "./user/UserDashboard";

// Store Owner
import OwnerDashboard from "./owner/OwnerDashboard";
import OwnerRatings from "./owner/OwnerRatings";

const AUTH_ROUTES = ["/", "/login", "/signup"];

function AppContent() {
    const location = useLocation();
    const hideNavbar = AUTH_ROUTES.includes(location.pathname);

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>

                {/* ================= PUBLIC ROUTES ================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />


                {/* ================= ADMIN ROUTES ================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminHome />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <Users />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users/:id"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <UserDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/stores"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <Stores />
                        </ProtectedRoute>
                    }
                />


                {/* ================= NORMAL USER ROUTES ================= */}

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute allowedRoles={["USER"]}>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ================= STORE OWNER ROUTES ================= */}

                <Route
                    path="/owner"
                    element={
                        <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/ratings"
                    element={
                        <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
                            <OwnerRatings />
                        </ProtectedRoute>
                    }
                />


                {/* ================= CHANGE PASSWORD ================= */}

                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "USER",
                                "STORE_OWNER",
                            ]}
                        >
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
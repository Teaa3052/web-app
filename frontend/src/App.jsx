import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "@/utils/ProtectedRoutes";
import AppLayout from "@/layouts/AppLayout";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Stats from "@/pages/Stats";
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/NotFound";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/homepage" replace />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* zaštićene stranice: prvo provjera prijave (ProtectedRoutes), zatim zajednički layout sa sidebarom (AppLayout) */}
            <Route element={<ProtectedRoutes />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/habits" element={<ComingSoon title="Habits" />} />
                    <Route path="/diary" element={<ComingSoon title="Diary" />} />
                    <Route path="/plans" element={<ComingSoon title="Plans" />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/settings" element={<ComingSoon title="Settings" />} />
                </Route>
            </Route>

            {/* sve ostale adrese -> 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;

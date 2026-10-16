 import { useAuth } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom"; 

function ProtectedRoutes () {
   const { user, loading } = useAuth();

   // još čekamo odgovor od /me - ne znamo je li netko prijavljen pa ne odlučujemo ništa
   if (loading) {
      return <p className="p-6">Loading...</p>
   }
   // odg je stigao: prijavljen -> prikazi stranicu, nije prijavljen -> na login
   return user ? <Outlet/> : <Navigate to="/login" replace />;
 }

 export default ProtectedRoutes
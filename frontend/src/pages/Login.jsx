import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function Login() {

    const {
        register, 
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm()


    const navigate = useNavigate() 
    const { login } = useAuth() 

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password)
            navigate("/dashboard")
            }
        catch (error) {
            setError("root", { message: error.response?.data?.message || error.message || "Login failed" })
        }
    };

    return(
        <div className="flex items-center justify-center h-96 no-bg">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-gray-700">
                    Login
                </h2>
                {errors.root && ( 
                    <p className="text-red-500 text-sm text-center">
                        {errors.root.message}
                    </p>
                )}

                {/* Email */}
                <div>
                    <input 
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: true })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message || "Email is required"}                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { 
                        required: "Password is required",
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message || "Password is required"}
                        </p>
                    )}
                </div>

                {/* Button */ }
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login
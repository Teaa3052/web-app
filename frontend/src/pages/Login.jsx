import { useForm } from "react-hook-form";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login() {
    const {
        register, 
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate(); 


    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email: data.email,
                password: data.password
            });

            localStorage.setItem('token', response.data.token);
            navigate("/dashboard");
        } catch (error) {
            setError("root", { message: error.response?.data?.message || "Login failed" })
        }
    };

    return(
        <div className="flex items-center justify-center h-96 bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-gray-700">
                    Login
                </h2>

                {/* Email */}
                <div>
                    <input 
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: true })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue.400"
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
                    {...register("password", { required: true })}
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
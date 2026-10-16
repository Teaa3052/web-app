import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/client"



function Register() {
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm(); 


    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
                await api.post('/auth/register', { 
                    nickname: data.name,
                    email: data.email,
                    password: data.password
                 })

                console.log("Registration successful!"); 
                navigate("/login");
        }
        catch (error) {
            setError("root", { message: error.response?.data?.message || "Registration failed" });
        }
    }

    return (
        <div className="flex items-center justify-center h-96 no-bg">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-gray-700">
                    Register
                </h2>

                { errors.root && ( 
                    <p className="text-red-500 text-sm text-center">
                        {errors.root.message}
                    </p>
                )}

                {/* Name */}
                <div>
                    <input 
                        type="text"
                        placeholder="Name"
                        {...register("name", { required: true })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            Name is required
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <input 
                        type="text"
                        placeholder="Email"
                        {...register("email", { required: true })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            Email is required
                        </p>
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
                            Password is required
                        </p>
                    )}
                </div>

                {/* Repeat the Password */}
                <div>
                    <input 
                        type="password"
                        placeholder="Repeat the Password"
                        {...register("confirmPassword", { 
                            required: true,
                            validate: (value) => 
                                value === watch("password") || "Passwords do not match",
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
                {/* Button */ }
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                    Register
                </button>
            </form>
        </div>

    )
}

export default Register
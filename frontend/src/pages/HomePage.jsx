import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[url('/forest.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center gap-8">
            <button
                onClick={() => navigate('/login')}
                className="w-60 h-60 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex items-center justify-center"
            >
                <div className="flex flex-col space-y-1">
                    <h2 className="text-3xl font-bold text-gray-700">Login</h2>
                    <h3 className="text-l text-gray-700">Already have account?</h3>
                </div>
            </button>

            <button
                onClick={() => navigate('/register')}
                className="w-60 h-60 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex items-center justify-center"
            >
                <div className="flex flex-col space-y-1">
                    <h2 className="text-3xl font-bold text-gray-700">Register</h2>
                    <h3 className="text-l text-gray-700">Join us</h3>
                </div>
            </button>
        </div>
    );
}

export default HomePage;
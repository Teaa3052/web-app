
const Dashboard = ({ onLogout }) => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                Dashboard (ulogirani korisnik)
            </h1>
             <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                > Logout
            </button>
        </div>
    );
};

export default Dashboard;



export default function Navbar({ user, onLogout }) {
    return (
        <div className="w-full bg-white shadow px-6 py-3 mb-6 flex justify-between items-center">

            <h1 className="text-lg font-bold text-blue-600">
                Playto KYC
            </h1>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                    {user.role.toUpperCase()}
                </span>

                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
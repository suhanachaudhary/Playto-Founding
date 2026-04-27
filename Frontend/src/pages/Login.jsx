
import { useState } from "react";
import { setUser } from "../auth";

export default function Login({ onLogin }) {
    const [id, setId] = useState("");
    const [role, setRole] = useState("merchant");

    const handleLogin = async () => {
        const res = await fetch("http://127.0.0.1:8000/api/v1/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: id })
        });

        const data = await res.json();

        if (!res.ok) return alert("Login failed");

        const user = {
            id: data.id,
            role: data.role
        };

        setUser(user);
        onLogin(user);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

            <div className="w-[380px] bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-200">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Playto KYC
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Login to continue
                    </p>
                </div>

                {/* User ID */}
                <div className="mb-4">
                    <label className="text-sm text-gray-600 mb-1 block">
                        Username
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Username"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>

                {/* Role Selection */}
                <div className="mb-6">
                    <label className="text-sm text-gray-600 mb-2 block">
                        Select Role
                    </label>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setRole("merchant")}
                            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition
                            ${role === "merchant"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Merchant
                        </button>

                        <button
                            onClick={() => setRole("reviewer")}
                            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition
                            ${role === "reviewer"
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Reviewer
                        </button>
                    </div>
                </div>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={!id}
                    className={`w-full py-2 rounded-lg font-semibold transition
                    ${id
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Login
                </button>

                {/* Footer hint */}
                <p className="text-xs text-center text-gray-400 mt-4">
                    Demo login system (no password required)
                </p>

            </div>
        </div>
    );
}

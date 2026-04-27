
import { useEffect, useState } from "react";

export default function ReviewerDashboard({ user }) {
    const [data, setData] = useState([]);
    const [metrics, setMetrics] = useState({});

    const [filter, setFilter] = useState("draft");

    console.log("USER:", user);

    const filteredData = data.filter(item => {
        if (filter === "submitted") {
            return item.state === "submitted" || item.state === "under_review";
        }
        return item.state === filter;
    });

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/v1/review-queue/", {
            headers: {
                "Content-Type": "application/json",
                "X-USER-ID": String(user.id)
            }
        })
            .then(res => res.json())
            .then(setData);

        fetch("http://127.0.0.1:8000/api/v1/metrics/", {
            headers: {
                "Content-Type": "application/json",
                "X-USER-ID": String(user.id)
            }
        })
            .then(res => res.json())
            .then(setMetrics);
    }, []);


    const handleAction = async (id, currentState, action) => {
        try {
            if (currentState === "submitted") {
                await fetch(`http://127.0.0.1:8000/api/v1/review/${id}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-USER-ID": String(user.id)
                    },
                    body: JSON.stringify({ state: "under_review" }),
                });
            }

            await fetch(`http://127.0.0.1:8000/api/v1/review/${id}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-USER-ID": String(user.id)
                },
                body: JSON.stringify({ state: action }),
            });

            // window.location.reload();
            setData(prev => prev.map(item =>
                item.id === id ? { ...item, state: action } : item
            ));
        } catch (err) {
            console.error(err);
        }
    };


    const getStatusStyle = (state) => {
        switch (state) {
            case "draft":
                return "bg-yellow-100 text-yellow-700";
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Reviewer Dashboard</h1>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow-md rounded-xl p-4">
                    <p className="text-gray-500 text-sm">Queue</p>
                    <p className="text-xl font-bold">{metrics.queue_count}</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-4">
                    <p className="text-gray-500 text-sm">At Risk</p>
                    <p className="text-xl font-bold">{metrics.at_risk_count}</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-4">
                    <p className="text-gray-500 text-sm">Approval Rate</p>
                    <p className="text-xl font-bold">
                        {Math.round(metrics.approval_rate_last_7_days * 100 || 0)}%
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-6">
                {["draft", "submitted", "approved", "rejected"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 
                        ${filter === f
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {f.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="space-y-4 mb-24">

                {filteredData.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">
                        No {filter.toUpperCase()} submissions
                    </p>
                )}


                {filteredData.map((item) => (
                    <div key={item.id} className="bg-white shadow-2xl p-4 rounded">
                        <div className="flex justify-between items-start mb-3">
                            <div className="mb-4">
                                <p className="text-[18px] text-blue-600">User</p>
                                <p className="font-semibold text-gray-800">{item.merchant_username}</p>
                                <p className="text-sm text-gray-500">{item.merchant_email}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusStyle(item.state)}`}>
                                {item.state.toUpperCase()}
                            </span>
                        </div>

                        {/* PERSONAL DETAILS */}
                        <div className="mb-4">
                            <p className="text-[18px] text-blue-600 mb-1">Personal Details</p>
                            <p className="text-gray-700 text-sm">Name: {item.personal_details?.name}</p>
                            <p className="text-gray-700 text-sm">Email: {item.personal_details?.email}</p>
                            <p className="text-gray-700 text-sm">Phone: {item.personal_details?.phone}</p>
                        </div>

                        {/* BUSINESS DETAILS */}
                        <div className="mb-4">
                            <p className="text-[18px] text-blue-600 mb-1">Business Details</p>
                            <p className="text-gray-700 text-sm">Name: {item.business_details?.business_name}</p>
                            <p className="text-gray-700 text-sm">Type: {item.business_details?.type}</p>
                            <p className="text-gray-700 text-sm">Volume: {item.business_details?.volume}</p>
                        </div>


                        <div className="flex gap-2 mt-4">

                            {item.state === "draft" && (
                                <>
                                    <button
                                        onClick={() => handleAction(item.id, item.state, "approved")}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => handleAction(item.id, item.state, "rejected")}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
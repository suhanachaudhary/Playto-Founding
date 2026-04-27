
import MerchantForm from "./MerchantForm";
import { useEffect, useState } from "react";

export default function MerchantDashboard({ user }) {
    const [kyc, setKyc] = useState([]);

    console.log("USER:", user);

    useEffect(() => {
        if (!user?.id) return;

        fetch("http://127.0.0.1:8000/api/v1/all-submissions/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-USER-ID": String(user.id),
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log("KYC DATA:", data);
                setKyc(Array.isArray(data) ? data : []);
            });
    }, [user]);



    const latestKyc = kyc?.[0];

    console.log("latest kyc...", latestKyc)

    const isEmptyDraft =
        latestKyc?.state === "draft" ||
        (!latestKyc?.personal_details || !latestKyc?.business_details);

    if (!latestKyc || isEmptyDraft) {
        return <MerchantForm user={user} />;
    }


    return (
        <div className="w-full mx-auto p-6">

            <h1 className="text-2xl font-bold mb-4">
                Merchant KYC Portal
            </h1>

            <div className="bg-white shadow-2xl p-5 rounded-xl border">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-blue-600 text-lg font-semibold">
                            Merchant KYC
                        </p>
                        <p className="text-sm text-gray-500">
                            Current Application Status
                        </p>
                    </div>

                    <span className={`px-3 py-1 text-xs rounded-full font-semibold
            ${latestKyc.state === "approved"
                            ? "bg-green-100 text-green-700"
                            : latestKyc.state === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}>
                        {latestKyc.state}
                    </span>
                </div>

                {/* PERSONAL DETAILS */}
                <div className="mb-4">
                    <p className="text-blue-600 font-semibold mb-1">
                        Personal Details
                    </p>

                    <div className="text-sm text-gray-700 space-y-1">
                        <p><b>Name:</b> {latestKyc?.personal_details?.name}</p>
                        <p><b>Email:</b> {latestKyc?.personal_details?.email}</p>
                        <p><b>Phone:</b> {latestKyc?.personal_details?.phone}</p>
                    </div>
                </div>

                {/* BUSINESS DETAILS */}
                <div className="mb-4">
                    <p className="text-blue-600 font-semibold mb-1">
                        Business Details
                    </p>

                    <div className="text-sm text-gray-700 space-y-1">
                        <p><b>Business Name:</b> {latestKyc.business_details?.business_name}</p>
                        <p><b>Type:</b> {latestKyc.business_details?.type}</p>
                        <p><b>Volume:</b> {latestKyc.business_details?.volume}</p>
                    </div>
                </div>

                {/* ACTIONS */}
                {latestKyc.state === "rejected" && (
                    <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                        Resubmit KYC
                    </button>
                )}

            </div>

        </div>
    );
}
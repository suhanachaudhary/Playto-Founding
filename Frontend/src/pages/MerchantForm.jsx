
import { useState } from "react";
import toast from "react-hot-toast";
export default function MerchantForm({ user }) {
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        business_name: "",
        type: "",
        volume: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveDraft = async () => {
        await fetch("http://127.0.0.1:8000/api/v1/save-draft/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-USER-ID": String(user.id)
            },
            body: JSON.stringify({
                personal_details: {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                },
                business_details: {
                    business_name: form.business_name,
                    type: form.type,
                    volume: form.volume,
                },
            }),
        });
        toast.success("Draft Saved");
    };

    const submitKYC = async () => {
        await fetch("http://127.0.0.1:8000/api/v1/submit/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-USER-ID": String(user.id)
            }
        });
        toast.success("KYC Submitted");
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-blue-600">
                KYC Onboarding
            </h1>

            {/* STEP BAR */}
            <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${step >= s ? "bg-blue-600" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
                <div className="space-y-5">
                    <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
                    <Input label="Email Address" name="email" value={form.email} onChange={handleChange} />
                    <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />

                    <div className="pt-4">
                        <button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition w-full">
                            Next →
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-5">
                    <Input label="Business Name" name="business_name" value={form.business_name} onChange={handleChange} />
                    <Input label="Business Type" name="type" value={form.type} onChange={handleChange} />
                    <Input label="Monthly Volume (USD)" name="volume" value={form.volume} onChange={handleChange} />

                    <div className="flex justify-between gap-3 pt-4">
                        <button onClick={() => setStep(1)} className="bg-gray-300 hover:bg-gray-400 text-black py-2.5 rounded-lg font-medium transition w-1/2">
                            ← Back
                        </button>

                        <button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition w-1/2">
                            Next →
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <button
                        onClick={saveDraft}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium"
                    >
                        Save Draft
                    </button>

                    <button
                        onClick={submitKYC}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                    >
                        Submit KYC
                    </button>

                    <button
                        onClick={() => setStep(2)}
                        className="w-full text-gray-500 mt-2"
                    >
                        ← Back
                    </button>
                </div>
            )}
        </div>
    );
}

function Input({ label, name, value, onChange }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={label}
                className="border border-gray-300 rounded-lg px-3 py-2.5 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-blue-500 transition-all"
            />
        </div>
    );
}
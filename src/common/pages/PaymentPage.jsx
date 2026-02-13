
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, CreditCardIcon, QrCodeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tenantName } = useParams();
    const plan = location.state?.plan || { id: 'default', name: 'Subscription Plan', price: 0 };

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('modal'); // 'modal' or 'qr'
    const [qrData, setQrData] = useState(null);
    const [polling, setPolling] = useState(false);
    const [message, setMessage] = useState('');

    // --- 1. RAZORPAY MODAL METHOD ---
    const handleModalPayment = async () => {
        setLoading(true);
        try {
            // Step 1: Create Order on Backend
            const token = localStorage.getItem('token');
            const orderResponse = await fetch('https://bt-erp-backend-edww.onrender.com/api/v1/subscription-payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planId: plan.id })
            });
            const data = await orderResponse.json();

            if (!data.success) throw new Error(data.message || "Failed to create order");

            const { orderId, amount, key, planName } = data;

            // Step 2: Configure Razorpay Options
            const options = {
                key: key,
                amount: amount,
                currency: "INR",
                name: "BT-ERP",
                description: `Subscription for ${planName}`,
                order_id: orderId,
                handler: async function (response) {
                    // Step 3: Verify Payment on Backend
                    const token = localStorage.getItem('token');
                    const verifyResponse = await fetch('https://bt-erp-backend-edww.onrender.com/api/v1/subscription-payment/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: plan.id
                        })
                    });

                    const result = await verifyResponse.json();
                    if (result.success) {
                        setMessage("✅ Subscription Activated Successfully!");
                        setTimeout(() => navigate(`/${tenantName}/plan-history`), 2000);
                    } else {
                        throw new Error(result.message || "Verification failed");
                    }
                },
                prefill: {
                    name: "Tenant Admin",
                    email: "admin@tenant.com"
                },
                theme: { color: "#6366f1" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed", error);
            setMessage("❌ Payment Failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. QR CODE METHOD ---
    const handleQrPayment = async () => {
        setLoading(true);
        setQrData(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://bt-erp-backend-edww.onrender.com/api/v1/subscription-payment/create-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planId: plan.id })
            });

            const data = await response.json();
            if (data.success) {
                setQrData(data);
                setPaymentMethod('qr');
                startPolling(data.qr_id);
            } else {
                throw new Error(data.message || "Failed to create QR code");
            }
        } catch (error) {
            console.error("QR Error:", error);
            setMessage("❌ QR Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- 3. POLLING FOR QR PAYMENT STATUS ---
    const startPolling = (qrId) => {
        setPolling(true);
        const interval = setInterval(async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`https://bt-erp-backend-edww.onrender.com/api/v1/subscription-payment/check-status/${qrId}?planId=${plan.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    clearInterval(interval);
                    setPolling(false);
                    setMessage("✅ Payment Received! Subscription Activated.");
                    setTimeout(() => navigate(`/${tenantName}/plan-history`), 2000);
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        }, 5000); // Poll every 5 seconds

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    };

    return (
        <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Left Side: Order Summary */}
                <div className="p-10 bg-gradient-to-br from-indigo-600/10 to-transparent flex flex-col justify-between border-r border-slate-800/50">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Back to Plans
                        </button>
                        <h2 className="text-3xl font-black mb-2">Order Summary</h2>
                        <p className="text-slate-400 mb-8 border-b border-slate-800 pb-4">Complete your subscription for {plan.name}</p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-slate-300">{plan.name} Plan</span>
                                <span className="font-bold">₹{plan.price}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-500">
                                <span>Duration</span>
                                <span>30 Days</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-500">
                                <span>Platform Fee</span>
                                <span className="text-emerald-500">Free</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-medium">Total Amount</span>
                            <span className="text-3xl font-black text-indigo-400">₹{plan.price}</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-500" />
                            Secured by Razorpay Encryption
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Options */}
                <div className="p-10 flex flex-col">
                    <h3 className="text-xl font-bold mb-6">Select Payment Method</h3>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setPaymentMethod('modal')}
                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === 'modal' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                        >
                            <CreditCardIcon className="w-8 h-8" />
                            <span className="text-sm font-semibold">Pay with Card/Net</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('qr')}
                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === 'qr' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                        >
                            <QrCodeIcon className="w-8 h-8" />
                            <span className="text-sm font-semibold">Pay via UPI QR</span>
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {paymentMethod === 'modal' ? (
                            <motion.div
                                key="modal"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col flex-1 justify-center"
                            >
                                <p className="text-slate-400 text-center mb-8">
                                    Continue with Razorpay's secure checkout modal for a wide range of payment options including Cards, Netbanking, and Wallets.
                                </p>
                                <button
                                    onClick={handleModalPayment}
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>Pay ₹{plan.price} Now</>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="qr"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col flex-1 items-center justify-center text-center"
                            >
                                {!qrData ? (
                                    <>
                                        <p className="text-slate-400 mb-8">Generate a one-time UPI QR code to pay instantly from your mobile app.</p>
                                        <button
                                            onClick={handleQrPayment}
                                            disabled={loading}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 py-4 rounded-xl font-bold text-lg transition-all"
                                        >
                                            {loading ? 'Generating...' : 'Generate QR Code'}
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl">
                                            <img src={qrData.image_url} alt="Razorpay UPI QR" className="w-48 h-48" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-emerald-400 font-bold animate-pulse">Waiting for payment...</p>
                                            <p className="text-slate-500 text-xs">Scan the code using any UPI app (GPay, PhonePe, etc.)</p>
                                        </div>
                                        <button
                                            onClick={() => setQrData(null)}
                                            className="text-slate-400 text-sm hover:underline"
                                        >
                                            Generate new code
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-6 p-4 rounded-xl text-center text-sm font-medium ${message.includes('✅') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
                        >
                            {message}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentPage;

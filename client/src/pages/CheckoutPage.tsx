import { useState } from "react"
import { motion } from "framer-motion"
import { BanknoteIcon as BankIcon, DollarSign } from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  company?: string
  country: string
  address: string
  city: string
  province: string
  zipCode: string
  phone: string
  notes?: string
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cash">("bank")
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    company: "",
    country: "Algeria",
    address: "",
    city: "",
    province: "Blida",
    zipCode: "",
    phone: "",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData, paymentMethod)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-2xl font-semibold mb-8 text-gray-900">Billing Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  required
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  required
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name (Optional)
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country / Region *
              </label>
              <select
                required
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="Sri Lanka">Sri Lanka</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                required
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Town / City *
                </label>
                <input
                  required
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                  Province *
                </label>
                <select
                  required
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option value="Western Province">Western Province</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  required
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  required
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Notes about your order, e.g. special notes for delivery"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </form>
        </div>

        {/*Order Summary */}
        <div className="lg:pl-12">
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-4">
                <span>Price</span>
                <span>$ 250,000.00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-4">
                <span>Subtotal</span>
                <span>$ 250,000.00</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2">
                <span>Total</span>
                <span className="text-blue-600">$ 250,000.00</span>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>

              <motion.div className="space-y-4" initial={false}>
                <div
                  className={`relative flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "bank"
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "border-2 border-gray-200 hover:border-blue-200"
                  }`}
                  onClick={() => setPaymentMethod("bank")}
                >
                  <input
                    type="radio"
                    id="bank"
                    name="payment"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="bank" className="flex items-center space-x-3 cursor-pointer">
                    <BankIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Direct Bank Transfer</span>
                  </label>
                </div>

                {paymentMethod === "bank" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-gray-600 ml-7 mt-2"
                  >
                    Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                  </motion.p>
                )}

                <div
                  className={`relative flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "cash"
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "border-2 border-gray-200 hover:border-blue-200"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="cash" className="flex items-center space-x-3 cursor-pointer">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Cash by Hand</span>
                  </label>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 text-sm text-gray-600">
              Your personal data will be used to support your experience throughout this website, to manage access to
              your account, and for other purposes described in our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                privacy policy
              </a>
              .
            </div>

            <button className="btn-auth mt-3">Pay</button>
          </div>
        </div>
      </div>
    </main>
  )
}


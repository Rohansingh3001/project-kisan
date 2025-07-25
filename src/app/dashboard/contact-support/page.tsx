import { LogOut } from "lucide-react";

export default function ContactSupport() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center mb-6">
          <LogOut className="w-8 h-8 text-blue-600 mr-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Support</h1>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Need help? Our support team is here for you.</p>
        <div className="mb-4">
          <span className="font-semibold text-gray-900 dark:text-white">Email:</span>
          <a href="mailto:support@agrisaarthi.com?subject=AgriSaarthi%20Support" className="ml-2 text-blue-600 dark:text-blue-400 underline">support@agrisaarthi.com</a>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">We aim to respond within 24 hours.</div>
      </div>
    </div>
  );
}

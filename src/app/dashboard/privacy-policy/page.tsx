import { FileText } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center mb-6">
          <FileText className="w-8 h-8 text-green-600 mr-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Your privacy is important to us. This page explains how we collect, use, and protect your data.</p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>We only collect data necessary for providing our services.</li>
          <li>Your data is stored securely and never shared with third parties.</li>
          <li>You can request a copy or deletion of your data at any time.</li>
        </ul>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">Last updated: 15 Jul 2025</div>
      </div>
    </div>
  );
}

import { Zap } from "lucide-react";

export default function HelpCenter() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center mb-6">
          <Zap className="w-8 h-8 text-yellow-500 mr-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help Center</h1>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Find answers to common questions and get support for usingAgrosaathi.</p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>How do I update my profile?</li>
          <li>How to use the voice assistant?</li>
          <li>How to monitor crop health?</li>
        </ul>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">Need more help? Contact support from the settings page.</div>
      </div>
    </div>
  );
}

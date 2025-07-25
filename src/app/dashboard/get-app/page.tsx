import { Award } from "lucide-react";

export default function GetApp() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center mb-6">
          <Award className="w-8 h-8 text-purple-600 mr-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GetAgrosaathi App</h1>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Download theAgrosaathi mobile app for the best farming experience.</p>
        <a href="https://Agrosaathi.com/app" target="_blank" rel="noopener" className="inline-block bg-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200">Download Now</a>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">Available for Android & iOS.</div>
      </div>
    </div>
  );
}

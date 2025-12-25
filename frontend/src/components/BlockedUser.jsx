import { ShieldAlert, Mail, Phone } from "lucide-react";

const BlockedUser = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        <div className="flex justify-center mb-6">
          <ShieldAlert className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Account Blocked
        </h1>

        <p className="text-gray-600 mb-6">
          Your account has been temporarily blocked due to policy or security
          reasons. Please contact our support team to resolve this issue.
        </p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <Mail className="w-4 h-4" />
            <span>DigitalWealth38@gmail.com</span>
          </div>
   <div className="flex items-center justify-center gap-2 text-gray-700">
            <Mail className="w-4 h-4" />
            <span>info.digitalwealthpk@gmail.com</span>
          </div>
         
        </div>

        <div className="mt-8 text-xs text-gray-400">
          If you believe this is a mistake, please contact support.
        </div>
      </div>
    </div>
  );
};

export default BlockedUser;

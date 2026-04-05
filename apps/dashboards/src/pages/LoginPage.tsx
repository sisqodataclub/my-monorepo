import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="mb-8 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          DDEEP<span className="text-blue-600">HQ</span>
        </h2>
      </div>
      
      {/* Clerk handles absolutely everything inside this component */}
      <SignIn routing="path" path="/login" fallbackRedirectUrl="/" />
    </div>
  );
}

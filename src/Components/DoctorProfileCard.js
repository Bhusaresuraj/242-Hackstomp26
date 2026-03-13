import { CheckCircle } from "lucide-react";
import Link from "next/link";
export default function DoctorProfileCard() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-6">

      <img
        src="/doctor.jpg"
        alt="doctor"
        className="w-24 h-24 rounded-full object-cover"
      />

      <div className="flex-1">

        <h2 className="text-2xl font-semibold text-green-800">
          Dr. Rajesh Sharma
        </h2>

        <p className="text-gray-600">
          MBBS, MD
        </p>

        <div className="flex items-center gap-2 text-green-600 mt-2">
          <CheckCircle size={18} />
          Verified Medical Professional
        </div>

        <p className="text-gray-500 mt-2">
          Apollo Hospital • 12 years experience
        </p>

      </div>

      <button className="border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50">
        Edit Profile
      </button>
<Link href="/">
      <button className="border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50">
       Verify
      </button>
</Link>
    </div>
  );
}
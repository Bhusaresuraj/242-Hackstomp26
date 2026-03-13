import DoctorProfileCard from "@/Components/DoctorProfileCard";
import DoctorSidebar from "@/Components/DoctorSidebar";
import NgoCard from "@/Components/NgoCard";
import BlogCard from "@/Components/BlogCard";
import StatCard from "@/Components/NgoCard";
export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">

      <DoctorSidebar />

      <div className="flex-1 p-8">
<DoctorProfileCard/>
   

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-6">

          <StatCard title="NGOs Worked With" value="8" />

          <StatCard title="Patients Helped" value="540+" />

          <StatCard title="Blogs Written" value="12" />

          <StatCard title="Consultations" value="64" />

        </div>

        {/* NGO Activity */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <NgoCard />
          <NgoCard />

        </div>

        {/* Blogs */}

        <div className="mt-10">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-semibold text-gray-700">
              Your Blogs
            </h2>

            <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600">
              Write Blog
            </button>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <BlogCard />
            <BlogCard />

          </div>

        </div>

      </div>
    </div>
  );
}
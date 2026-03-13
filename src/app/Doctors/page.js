'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

import DoctorProfileCard from "@/Components/DoctorProfileCard";
import DoctorSidebar from "@/Components/DoctorSidebar";
import NgoCard from "@/Components/NgoCard";
import BlogCard from "@/Components/BlogCard";
import StatCard from "@/Components/StatCard";
import DoctorProfileModal from "@/Components/DoctorProfileModal";
import { createOrFetchDoctor } from "../../../actions/useractions";

export default function Dashboard() {

  const searchParams = useSearchParams();

  const nameParam = searchParams.get('name');
  const emailParam = searchParams.get('email');

  const doctorName = nameParam ? decodeURIComponent(nameParam) : 'Doctor';
  const doctorEmail = emailParam
    ? decodeURIComponent(emailParam)
    : 'No email available';

  const [doctor, setDoctor] = useState(null);
const [showModal, setShowModal] = useState(false);
 

   useEffect(() => {

  async function setupDoctor() {
    const doctorData = await createOrFetchDoctor();
    setDoctor(doctorData);
  }

  setupDoctor();

}, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <DoctorSidebar />

      <div className="flex-1 p-8">

        {/* Doctor Info */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">
            Authenticated Doctor
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Name: {doctorName}
          </h1>

          <p className="mt-2 text-base text-slate-600">
            Email: {doctorEmail}
          </p>

        </div>

     <DoctorProfileCard
  doctor={doctor}
  openModal={() => setShowModal(true)}
/>

{showModal && (
  <DoctorProfileModal
    doctor={doctor}
    setDoctor={setDoctor}
    closeModal={() => setShowModal(false)}
  />
)}

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
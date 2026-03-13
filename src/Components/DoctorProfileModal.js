'use client';

import { useState } from "react";
import { updateDoctorProfile } from "../../actions/useractions";

export default function DoctorProfileModal({ doctor, setDoctor, closeModal }) {

  const [formData, setFormData] = useState({
    name: doctor?.name || "",
    degree: doctor?.degree || "",
    specialization: doctor?.specialization || "",
    experience_years: doctor?.experience_years || "",
    hospital: doctor?.hospital || "",
    bio: doctor?.bio || "",
    profile_image: doctor?.profile_image || "",
    registration_number: doctor?.registration_number || ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const updatedDoctor = await updateDoctorProfile(doctor.id, formData);

    if (updatedDoctor) {
      setDoctor(updatedDoctor);
      closeModal();
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

      <div className="bg-white w-[600px] rounded-2xl p-8 shadow-xl text-blue-700">

        <h2 className="text-2xl font-bold mb-6">
          Update Doctor Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-3 rounded-lg"
          />

          <input
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="Degree (MBBS, MD...)"
            className="border p-3 rounded-lg"
          />

          <input
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Specialization"
            className="border p-3 rounded-lg"
          />

          <input
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            placeholder="Years of Experience"
            className="border p-3 rounded-lg"
          />

          <input
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            placeholder="Hospital"
            className="border p-3 rounded-lg"
          />

          <input
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            placeholder="Medical Registration Number"
            className="border p-3 rounded-lg"
          />

          <input
            name="profile_image"
            value={formData.profile_image}
            onChange={handleChange}
            placeholder="Profile Image URL"
            className="border p-3 rounded-lg"
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Doctor Bio"
            className="border p-3 rounded-lg"
          />

          <div className="flex justify-end gap-4 mt-4">

            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
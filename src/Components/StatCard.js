export default function StatCard({ title, value }) {
  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl transition">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-blue-600 mt-2">
        {value}
      </h2>

    </div>
  );
}
export default function BlogCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

      <h3 className="text-lg font-semibold text-green-800">
        Importance of Rural Healthcare
      </h3>

      <p className="text-gray-600 text-sm mt-2">
        Access to medical services in rural areas remains a major challenge...
      </p>

      <p className="text-gray-400 text-sm mt-3">
        Posted 2 days ago
      </p>

      <button className="mt-3 text-green-700 font-medium">
        Read More →
      </button>

    </div>
  );
}
export default function BlogCard({ blog }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

      {blog.image && (
        <img
          src={blog.image}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}

      <h3 className="text-lg font-semibold text-gray-700">
        {blog.title}
      </h3>

      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
        {blog.content}
      </p>

      <p className="text-gray-400 text-xs mt-3">
        {new Date(blog.created_at).toLocaleDateString()}
      </p>

    </div>
  );
}
import { FaCartPlus, FaRegHeart, FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({ item }) => {
  // Truncate title after a few words (e.g., 5 words)
  const truncateTitle = (title, wordLimit = 5) => {
    const words = title.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : title;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg flex flex-col items-center relative group">
      {/* Image with hover effect */}
      <div className="relative w-full h-56">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover rounded-lg transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

        {/* Icons appear on hover */}
        <div className="absolute right-3 top-7 flex flex-col gap-x-2 gap-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Cart Button */}
          <button className="bg-white text-gray-600 p-3 rounded-lg hover:bg-[#ffd90c] relative">
            <FaCartPlus size={20} />
          </button>

          {/* Wishlist Button */}
          <button className="bg-white text-gray-600 p-3 rounded-lg hover:bg-[#ffd90c] relative">
            <FaRegHeart size={20} />
          </button>

          {/* Quick View Button */}
          <button className="bg-white text-gray-600 p-3 rounded-lg hover:bg-[#ffd90c] relative">
            <FaRegEye size={20} />
          </button>
        </div>
      </div>

      <Link to={`/product/${item._id}`}>
        <div className="p-4 flex items-center flex-col">
          <h3 className="mt-2 font-semibold text-md tracking-tight text-gray-900">
            {truncateTitle(item.name, 5)}
          </h3>
          <p className="text-gray-700 font-bold">
            Ksh. {Number(item.price).toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

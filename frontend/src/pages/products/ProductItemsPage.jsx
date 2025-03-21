import { useEffect, useState } from "react";
import { FaCheck, FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import { fetchProductsByID } from "../../services/productService";
import { Progress } from "flowbite-react";

const ProductItemPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await fetchProductsByID(id);
        setProduct(fetchedProduct);
        if (fetchedProduct?.images?.length > 0) {
          setMainImage(fetchedProduct.images[0]); // Set first image as main image
        }
      } catch (err) {
        console.log("Failed to load product:", err);
        toast.error("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Handle missing product
  if (!product) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black opacity-75 z-50">
        <RingLoader color="#4A90E2" size={100} />
      </div>
    );
  }

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity("");
    }
  };

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const renderTabContent = () => {
    if (activeTab === "description") {
      return (
        <div className="bg-white px-4 py-8 rounded-lg">
          <p className="font-light">{product.description}</p>
        </div>
      );
    } else if (activeTab === "additionalInfo") {
      return (
        <div className="bg-white px-4 py-8 rounded-lg flex gap-x-1">
          <h3 className="font-semibold">Category: </h3>
          <p className="">{product.category}</p>
        </div>
      );
    }
  };

  return (
    <>
      {/* Full-screen loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black opacity-75 z-50">
          <RingLoader color="#4A90E2" size={100} />
        </div>
      )}
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex gap-x-5">
          {/* Main Image */}
          <div className="w-[45%] flex flex-col">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-[65vh] object-contain rounded-lg"
            />

            {/* Thumbnails */}
            <div className="flex items-center gap-x-2 h-[12vh] w-full mt-4 px-5">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group h-full w-full cursor-pointer rounded-xl overflow-hidden"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Mask overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Placeholder for additional product details */}
          <div className="w-[55%] p-8">
            <h1 className="text-2xl font-semibold pt-4">{product.name}</h1>
            <p className="font-semibold text-2xl my-3 text-black">
              Kshs. {Number(product.price).toLocaleString()}
            </p>
            <span
              className={`py-2 font-semibold ${
                product.stock === 0
                  ? "text-[#ed3a3a]"
                  : product.stock < 10
                  ? "text-[#c5a60c]"
                  : "text-green-500"
              }`}
            >
              <p className="mb-2">
                {product.stock === 0
                  ? "Out of stock"
                  : `Hurry up! Only ${product.stock} products left in stock`}
              </p>
              <Progress progress={45} color="yellow" />
            </span>

            <div className="flex items-center gap-x-1 my-5">
              <h4 className="text-lg mr-3">Availability:</h4>
              <p className="text-green-500 font-semibold">In Stock</p>
              <span className="text-green-500">
                <FaCheck />
              </span>
            </div>

            <div className="flex flex-col">
              <p className="font-semibold mb-2">Quantity:</p>
              <div className="flex items-center gap-x-2">
                {/* Minus Button */}
                <button
                  className="py-4 px-4 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
                  onClick={handleDecrease}
                >
                  <FaMinus size={12} />
                </button>

                {/* Quantity Input */}
                <input
                  id="quantity"
                  className="h-12 w-12 text-center rounded-lg"
                  type="text"
                  value={quantity}
                  onChange={handleInputChange}
                  onBlur={() => setQuantity((prev) => (prev === "" ? 1 : prev))}
                />

                {/* Plus Button */}
                <button
                  className="py-4 px-4 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
                  onClick={handleIncrease}
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            <div className="flex gap-x-4 py-4 mt-5">
              <button className="hover:bg-[#021639] hover:text-white uppercase border-2 border-[#021639] rounded-lg py-3 px-6">
                Add to Cart
              </button>
              <Link
                to={`/product/repayment-plan/${product._id}`}
                state={{ product, quantity }}
              >
                <button className="bg-[#021639] text-white hover:bg-[#ffd90c] hover:text-black uppercase font-semibold rounded-lg py-3 px-10">
                  Buy Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs for Product Description and Additional Information */}
        <div className="mt-8">
          <div className="flex gap-x-4">
            <button
              className={`py-2 px-4 border-b-2 text-xl font-semibold ${
                activeTab === "description"
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Product Description
            </button>
            <button
              className={`py-2 px-4 border-b-2 text-xl font-semibold ${
                activeTab === "additionalInfo"
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("additionalInfo")}
            >
              Additional Information
            </button>
          </div>
          <div className="mt-4">{renderTabContent()}</div>
        </div>
      </div>
    </>
  );
};

export default ProductItemPage;

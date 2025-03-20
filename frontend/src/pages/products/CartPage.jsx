import { Button } from "flowbite-react";
import { RiDeleteBack2Line } from "react-icons/ri";
import { Link } from "react-router-dom";

const CartPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 my-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div>
        {/* List of Items */}
        <div className="flex items-center justify-between mb-4 border-b pb-4">
          {/* Image */}
          <div className="w-1/4 flex justify-center">
            <img src="" alt="" className="w-20 h-20 object-cover rounded" />
          </div>

          {/* Product Details */}
          <div className="w-1/2 flex flex-col justify-center">
            <h3 className="font-semibold">Name</h3>
            <p className="text-gray-500">$100</p>
            <p className="text-sm text-gray-600">Qty: 5</p>
          </div>

          {/* Actions */}
          <div className="w-1/4 flex flex-col items-center">
            <button className="text-red-500 hover:text-red-700 focus:outline-none">
              <RiDeleteBack2Line className="text-3xl" />
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="mt-6 flex justify-end">
          <p className="text-lg font-bold">Total: $1000</p>
        </div>

        {/* Checkout Button */}
        <div className="mt-6 flex justify-end">
          <Link to="/checkout">
            <Button className="bg-blue-500 text-white px-6 py-2 rounded-md enabled:hover:bg-blue-400 transition">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

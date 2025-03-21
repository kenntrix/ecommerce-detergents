import { Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { fetchUserCart } from "../../services/cartService";
import { useSelector } from "react-redux";
import { RingLoader } from "react-spinners";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]); // State for cart items
  const [loading, setLoading] = useState(false); // State for loading
  const [subtotal, setSubtotal] = useState(0); // State for subtotal
  // eslint-disable-next-line no-unused-vars
  const [shippingCost, setShippingCost] = useState(50); // Fixed shipping cost
  const [total, setTotal] = useState(0); // State for total
  const { currentUser } = useSelector((state) => state.authentication);
  const userId = currentUser?.user._id;

  // Fetch cart items from the backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await fetchUserCart(userId);
        console.log(response);
        const items = response.cart.items;

        // Calculate subtotal
        const calculatedSubtotal = items.reduce(
          (sum, item) => sum + item.productId.price * item.quantity,
          0
        );
        setCartItems(items);
        setSubtotal(calculatedSubtotal);
        setTotal(calculatedSubtotal + shippingCost);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8 py-10 px-6 bg-white shadow-lg rounded-lg my-5">
      {/* Full-screen loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black opacity-75 z-50">
          <RingLoader color="#4A90E2" size={100} />
        </div>
      )}

      <div className="w-full space-y-6">
        <div>
          <h1 className="font-semibold mb-4 text-3xl">Delivery</h1>
          <div className="flex gap-x-5 mb-4 w-full">
            <div className="w-1/2">
              <TextInput
                id="firstName"
                name="firstName"
                required
                placeholder="First Name"
                type="text"
              />
            </div>
            <div className="w-1/2">
              <TextInput
                id="lastName"
                name="lastName"
                required
                placeholder="Last Name"
                type="text"
              />
            </div>
          </div>

          <div className="mb-4">
            <TextInput
              id="address"
              name="address"
              required
              placeholder="Address"
              type="text"
            />
          </div>

          <div className="flex gap-x-5">
            <div className="w-1/2">
              <TextInput
                id="city"
                name="city"
                required
                placeholder="City"
                type="text"
              />
            </div>
            <div className="w-1/2">
              <TextInput
                id="postalCode"
                name="postalCode"
                required
                placeholder="Postal Code"
                type="text"
              />
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-semibold mb-4 text-3xl">Payment</h1>
          <div className="mb-4">
            <TextInput
              id="cardNumber"
              name="cardNumber"
              required
              placeholder="Card Number"
              type="text"
            />
          </div>

          <div className="flex gap-x-5 mb-4">
            <div className="w-1/2">
              <TextInput
                id="date"
                name="date"
                required
                placeholder="Expiration Date"
                type="date"
              />
            </div>
            <div className="w-1/2">
              <TextInput
                id="csv"
                name="csv"
                required
                placeholder="Security Code"
                type="number"
              />
            </div>
          </div>

          <div className="mb-4">
            <TextInput
              id="name"
              name="name"
              required
              placeholder="Card Holder Name"
              type="text"
            />
          </div>

          <Button className="w-full">Pay Now</Button>
        </div>
      </div>

      <div className="w-full bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center border-b mb-2 py-2 w-full"
              >
                {/* Image */}
                <div className="w-1/4 flex justify-center">
                  <img
                    src={item.productId.images[0]} // Use the product image URL
                    alt={item.productId.name}
                    className="w-12 h-12 object-cover"
                  />
                </div>
                {/* Name and Price */}
                <div className="w-1/2 flex flex-col text-left">
                  <h3 className="font-semibold">{item.productId.name}</h3>
                  <p className="text-gray-500">{item.productId.category}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>

                <div className="w-1/4">
                  <p>${(item.productId.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-y-1 mt-4">
              <div className="flex justify-between">
                <p>SubTotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>${shippingCost.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold text-lg">Total</p>
                <p className="font-semibold text-lg">${total.toFixed(2)}</p>
              </div>
            </div>
          </>
        ) : (
          <p>No items in the cart.</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;

import { HiMenuAlt1, HiSearch } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import {
  Dropdown,
  Label,
  TextInput,
  Navbar,
  Avatar,
  Button,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { FaTruck } from "react-icons/fa6";
import { LuLogOut, LuPackage, LuUser } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { signoutSuccess } from "../redux/reducers/authSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { fetchUserCart, removeItemFromCart } from "../services/cartService";
import { RiDeleteBack2Line } from "react-icons/ri";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

const NavbarHeader = () => {
  const { currentUser } = useSelector((state) => state.authentication);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]); // State for cart items
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false); // State for loading
  const userId = currentUser?.user._id;

  const handleSignout = async () => {
    try {
      const data = await logoutUser();
      toast.success(data.message);
      dispatch(signoutSuccess());
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while trying to log out");
    }
  };

  const fetchCart = async (userId) => {
    try {
      setLoading(true);

      const response = await fetchUserCart(userId);
      if (!response.cart) {
        throw new Error("Failed to fetch cart data.");
      }

      setCartItems(response.cart.items);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Function to handle removing an item from the cart
  const handleRemoveItem = async (productId) => {
    try {
      setLoading(true);

      // Call the backend API to remove the item
      const response = await removeItemFromCart({ productId });
      if (!response.success) {
        throw new Error(response.message || "Failed to remove item from cart.");
      }

      // Update the cart items state by filtering out the removed item
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );

      await fetchCart(userId);
      toast.success("Item removed from cart");

      setLoading(false);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error(error.message || "Failed to remove item from cart.");
      setLoading(false);
    }
  };

  // Fetch cart data from the server
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCart(userId);
    }, 5000); // Fetch notifications every 5 seconds

    // Initial fetch on component mount
    fetchCart(userId);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <Navbar fluid className="border-b-2 shadow-lg">
      <div className="w-full lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Toggle Sidebar</span>
              <HiMenuAlt1 className="h-6 w-6" />
            </button>
            <Navbar.Brand href="/">
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Soapify Shop.
              </span>
            </Navbar.Brand>
            <form action="" className="ml-16 hidden md:block">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <TextInput
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                size={32}
                type="search"
                required
              />
            </form>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <button className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden">
                <span className="sr-only">Search</span>
                <HiSearch className="h-6 w-6" />
              </button>
            </div>
            <div>
              <CartDropdown
                cartItems={cartItems}
                handleRemoveItem={handleRemoveItem}
              />
            </div>
            <div className="hidden lg:block">
              <UserDropdown
                handleSignout={handleSignout}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

const CartDropdown = ({ cartItems, handleRemoveItem }) => {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="p-2 hover:bg-gray-100 rounded-full">
          <span className="sr-only">Cart</span>
          <HiOutlineShoppingBag className="text-2xl text-gray-500 hover:text-gray-900" />
        </span>
      }
      className="w-[24rem] p-3"
    >
      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <Dropdown.Item className="flex text-center text-lg">
          <MdOutlineRemoveShoppingCart className="text-3xl pr-2" />
          Your cart is empty
        </Dropdown.Item>
      ) : (
        cartItems.map((item, index) => (
          <Dropdown.Item
            key={index}
            className="flex items-center justify-between border border-gray-200 bg-white shadow-md hover:bg-gray-50"
          >
            {/* Image */}
            <div className="w-1/4 flex justify-center">
              <img
                src={item.productId.images[0]} // Display the first image
                alt={item.productId.name}
                className="w-12 h-12 object-cover"
              />
            </div>
            {/* Name and Price */}
            <div className="w-1/2 flex flex-col text-left">
              <h3 className="font-semibold">{item.productId.name}</h3>
              <p className="text-gray-500">${item.productId.price}</p>
            </div>

            {/* Delete Icon */}
            <div className="w-1/4 flex justify-center">
              <span
                onClick={() => handleRemoveItem(item.productId._id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <RiDeleteBack2Line className="text-xl" />
              </span>
            </div>
          </Dropdown.Item>
        ))
      )}

      <Dropdown.Divider className="py-1" />

      <Dropdown.Header>
        <div className="flex justify-between">
          <Link to={"/cart"}>
            <Button color="gray" className="px-4">
              View Cart
            </Button>
          </Link>
          <Link to={"/product/checkout"}>
            <Button className="bg-yellow-400 px-4">Check out</Button>
          </Link>
        </div>
      </Dropdown.Header>
    </Dropdown>
  );
};

const UserDropdown = ({ handleSignout, currentUser }) => {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span>
          <span className="sr-only">User menu</span>
          <Avatar alt="" rounded size="sm" />
        </span>
      }
      className="w-56"
    >
      <Dropdown.Header>
        {currentUser ? (
          <>
            <span className="block text-sm">
              Username:{" "}
              <span className="underline italic">
                {currentUser.user.username}
              </span>
            </span>
            <span className="block truncate text-sm font-medium">
              {currentUser.user.email}
            </span>
          </>
        ) : (
          <div className="flex justify-between">
            <Link to={"/login"}>
              <Button color="gray">Sign in</Button>
            </Link>
            <Link to={"/register"}>
              <Button color="blue">Sign Up</Button>
            </Link>
          </div>
        )}
      </Dropdown.Header>
      <Link to={"/track-orders"}>
        <Dropdown.Item className="flex item-center px-2 py-4">
          <FaTruck className="mx-4 h-5 w-5" />
          Track your Order
        </Dropdown.Item>
      </Link>
      <Link to={"/my-orders"}>
        <Dropdown.Item className="flex item-center px-2 py-4">
          <LuPackage className="mx-4 h-5 w-5" />
          My Orders
        </Dropdown.Item>
      </Link>
      <Link to={"/user-profile"}>
        <Dropdown.Item className="flex item-center px-2 py-4">
          <LuUser className="mx-4 h-5 w-5" />
          My Profile
        </Dropdown.Item>
      </Link>
      <Dropdown.Divider />
      <Dropdown.Item
        className="flex item-center px-2 py-4"
        onClick={handleSignout}
      >
        <LuLogOut className="mx-4 h-5 w-5" />
        Sign out
      </Dropdown.Item>
    </Dropdown>
  );
};

export default NavbarHeader;

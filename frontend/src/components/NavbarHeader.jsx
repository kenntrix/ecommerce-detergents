import { HiMenuAlt1, HiSearch } from "react-icons/hi";
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

const NavbarHeader = () => {
  const { currentUser } = useSelector((state) => state.authentication);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const data = await logoutUser();
      toast.success(data.message);
      dispatch(signoutSuccess());
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while trying to logout out");
    }
  };
  return (
    <Navbar fluid className="border-b-2 shadow-lg ">
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

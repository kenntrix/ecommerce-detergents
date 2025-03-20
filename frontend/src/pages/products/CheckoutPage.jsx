import { Button, TextInput } from "flowbite-react";

const CheckoutPage = () => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8 py-10 px-6 bg-white shadow-lg rounded-lg my-5">
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

        <div className="flex items-center border-b mb-2 py-2 w-full">
          {/* Image */}
          <div className="w-1/4 flex justify-center">
            <img
              src="" // Display the first image
              alt=""
              className="w-12 h-12 object-cover"
            />
          </div>
          {/* Name and Price */}
          <div className="w-1/2 flex flex-col text-left">
            <h3 className="font-semibold">Detergent</h3>
            <p className="text-gray-500">category</p>
          </div>

          <div className="w-1/4">
            <p>$100</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          <div className="flex justify-between">
            <p>SubTotal</p>
            <p>$1000</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>$1000</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-lg">Total</p>
            <p className="font-semibold text-lg">$1000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

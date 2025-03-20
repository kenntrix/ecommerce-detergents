import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

const FooterSection = () => {
  return (
    <Footer container className="bg-[#172134]">
      <div className="w-full">
        <div className="grid w-full items-center justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="px-10">
            <Footer.Brand href="/" src="" alt="">
              <span className="text-3xl text-gray-200 font-semibold">
                Soapify Shop
              </span>
            </Footer.Brand>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" className="text-gray-400" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  className="text-white hover:text-yellow-500"
                >
                  Home
                </Footer.Link>
                <Footer.Link
                  href="#"
                  className="text-white hover:text-yellow-500"
                >
                  Products
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" className="text-gray-400" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  className="text-white hover:text-yellow-500"
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href="#"
                  className="text-white hover:text-yellow-500"
                >
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" className="text-gray-400" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  className="text-white hover:text-yellow-500"
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href="#"
                  className="text-white hover:text-yellow-500"
                >
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Frodenz Labs" year={2025} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon
              href="#"
              icon={BsFacebook}
              className="text-white hover:text-yellow-500"
            />
            <Footer.Icon
              href="#"
              icon={BsInstagram}
              className="text-white hover:text-yellow-500"
            />
            <Footer.Icon
              href="#"
              icon={BsTwitter}
              className="text-white hover:text-yellow-500"
            />
            <Footer.Icon
              href="#"
              icon={BsGithub}
              className="text-white hover:text-yellow-500"
            />
            <Footer.Icon
              href="#"
              icon={BsDribbble}
              className="text-white hover:text-yellow-500"
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterSection;

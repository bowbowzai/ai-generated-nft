import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="mt-5">
        <div className="flex justify-center w-full max-w-screen-xl mx-auto pb-2">
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023{" "}
            <a href="https://github.com/bowbowzai" className="hover:underline">
              Ng Ju Peng
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="bg-dark font-poppins min-h-screen flex flex-col items-center justify-center text-color1">
      <img
        src="/images/Confused-Man.gif"
        width={"200"}
        alt=""
        className="mb-4"
      />
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg mb-4 mx-auto text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <div className="space-y-4 text-center">
        <Link to="/" className="bg-gray-700 px-2 py-1 rounded-lg">
          Go back to Home
        </Link>
        <div
          onClick={() => window.history.go(-1)}
          className="bg-gray-700 px-2 py-1 rounded-lg cursor-pointer"
        >
          Go back to previous page
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Bags */}
      <div className="flex space-x-4">
        <div className="w-10 h-12 bg-yellow-original rounded-t-md relative animate-bounce [animation-delay:0s]">
          <div className="absolute top-[-10px] left-2 w-6 h-2 border-2 border-black border-b-0 rounded-full"></div>
        </div>
        <div className="w-10 h-12 bg-yellow-original rounded-t-md relative animate-bounce [animation-delay:0.2s]">
          <div className="absolute top-[-10px] left-2 w-6 h-2 border-2 border-black border-b-0 rounded-full"></div>
        </div>
        <div className="w-10 h-12 bg-yellow-original rounded-t-md relative animate-bounce [animation-delay:0.4s]">
          <div className="absolute top-[-10px] left-2 w-6 h-2 border-2 border-black border-b-0 rounded-full"></div>
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-6 text-3xl font-bold text-yellow-original">Wearist</h1>
    </div>
  );
};

export default Loader;

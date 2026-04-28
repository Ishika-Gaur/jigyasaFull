"use client";

const Getinvolve = () => {
  return (
    <>
      {/* Get Involve Section */}
      <div className="relative px-[5%] py-[60px] sm:py-[80px] md:py-[100px] flex justify-start items-center bg-cover bg-center bg-no-repeat min-h-[450px] sm:min-h-[500px] md:min-h-[600px] text-white z-0" style={{ backgroundImage: "url('/icu.png')" }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,174,239,0.85)] to-[rgba(43,132,177,0.75)] z-[1]" />

        {/* Content */}
        <div className="relative z-[2] max-w-[750px] text-left pr-4 sm:pr-10 md:pr-0 animate-fadeInLeft">
          <button className="bg-[#1a5f7a] text-white border-none py-2 px-4 sm:py-2.5 sm:px-5 font-semibold rounded mb-3 sm:mb-5 cursor-pointer text-[0.85rem] sm:text-[0.95rem] uppercase tracking-wide transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.15)] hover:bg-[#134a5e] hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgba(0,0,0,0.2)]">
            GET INVOLVE
          </button>

          <h1 className="text-[1.8rem] sm:text-[2.2rem] md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-5 text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)] tracking-wide leading-tight">
            Modern & Advanced <br />
            Technology for You & Your <br />
            Family Health Care
          </h1>

          <p className="text-sm sm:text-base md:text-[1.15rem] leading-[1.6] sm:leading-[1.8] mb-5 sm:mb-[30px] text-[#f0f8ff] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.15)] font-normal">
            "We leverage the latest medical technology and innovative treatments
            to provide the highest standard of care. Our advanced diagnostic
            tools, state-of-the-art equipment, and skilled professionals ensure
            that you and your family receive the best possible healthcare
            services, tailored to meet your unique needs."
          </p>

          <button className="bg-gradient-to-br from-[#00b5ad] to-[#009a93] text-white py-2.5 px-6 sm:py-3.5 sm:px-8 border-none text-sm sm:text-[1.05rem] font-semibold rounded-md cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,181,173,0.3)] uppercase tracking-wide hover:bg-gradient-to-br hover:from-[#019c95] hover:to-[#017d77] hover:-translate-y-[3px] hover:shadow-[0_6px_16px_rgba(0,181,173,0.4)] active:translate-y-[-1px] active:shadow-[0_3px_8px_rgba(0,181,173,0.3)]">
            MAKE AN APPOINTMENT
          </button>
        </div>
      </div>

      {/* Stats Bar Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 bg-gradient-to-b from-white to-[#f8fbfd] px-[5%] py-[50px] md:py-10 shadow-[0_-5px_20px_rgba(0,0,0,0.08)] -mt-10 z-10 relative rounded-t-xl">
        <div className="text-center p-[25px_15px] md:p-[30px_20px] bg-gradient-to-br from-white to-[#f0f9ff] rounded-xl transition-all duration-[0.4s] shadow-[0_4px_15px_rgba(0,0,0,0.08)] border-2 border-transparent relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(0,181,173,0.2)] hover:border-[#00b5ad]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b5ad] to-[#00aeef] scale-x-0 transition-transform duration-[0.4s] group-hover:scale-x-100" />
          <h2 className="text-[2.2rem] md:text-[2.8rem] bg-gradient-to-br from-[#00b5ad] to-[#0095d5] bg-clip-text text-transparent m-0 font-bold mb-2.5">
            120K +
          </h2>
          <p className="text-[0.9rem] md:text-[1.05rem] font-semibold text-[#2c5f77] mt-2 tracking-wide">
            HAPPY PATIENTS
          </p>
        </div>

        <div className="text-center p-[25px_15px] md:p-[30px_20px] bg-gradient-to-br from-white to-[#f0f9ff] rounded-xl transition-all duration-[0.4s] shadow-[0_4px_15px_rgba(0,0,0,0.08)] border-2 border-transparent relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(0,181,173,0.2)] hover:border-[#00b5ad]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b5ad] to-[#00aeef] scale-x-0 transition-transform duration-[0.4s] group-hover:scale-x-100" />
          <h2 className="text-[2.2rem] md:text-[2.8rem] bg-gradient-to-br from-[#00b5ad] to-[#0095d5] bg-clip-text text-transparent m-0 font-bold mb-2.5">
            200
          </h2>
          <p className="text-[0.9rem] md:text-[1.05rem] font-semibold text-[#2c5f77] mt-2 tracking-wide">
            SPECIALIST DOCTORS
          </p>
        </div>

        <div className="text-center p-[25px_15px] md:p-[30px_20px] bg-gradient-to-br from-white to-[#f0f9ff] rounded-xl transition-all duration-[0.4s] shadow-[0_4px_15px_rgba(0,0,0,0.08)] border-2 border-transparent relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(0,181,173,0.2)] hover:border-[#00b5ad]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b5ad] to-[#00aeef] scale-x-0 transition-transform duration-[0.4s] group-hover:scale-x-100" />
          <h2 className="text-[2.2rem] md:text-[2.8rem] bg-gradient-to-br from-[#00b5ad] to-[#0095d5] bg-clip-text text-transparent m-0 font-bold mb-2.5">
            30+
          </h2>
          <p className="text-[0.9rem] md:text-[1.05rem] font-semibold text-[#2c5f77] mt-2 tracking-wide">
            MEDICAL SERVICES
          </p>
        </div>

        <div className="text-center p-[25px_15px] md:p-[30px_20px] bg-gradient-to-br from-white to-[#f0f9ff] rounded-xl transition-all duration-[0.4s] shadow-[0_4px_15px_rgba(0,0,0,0.08)] border-2 border-transparent relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(0,181,173,0.2)] hover:border-[#00b5ad]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b5ad] to-[#00aeef] scale-x-0 transition-transform duration-[0.4s] group-hover:scale-x-100" />
          <h2 className="text-[2.2rem] md:text-[2.8rem] bg-gradient-to-br from-[#00b5ad] to-[#0095d5] bg-clip-text text-transparent m-0 font-bold mb-2.5">
            150K
          </h2>
          <p className="text-[0.9rem] md:text-[1.05rem] font-semibold text-[#2c5f77] mt-2 tracking-wide">
            PROBLEM SOLVE
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 1s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Getinvolve;
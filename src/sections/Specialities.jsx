"use client";

import Link from "next/link";

const Specialities = () => {
  const leftLabels = [
  { name: "Ear", route: "/bodyparts/ear", top: "10%", lineWidth: "w-32" },
  { name: "Eye", route: "/bodyparts/eye", top: "6%", lineWidth: "w-36" },
  { name: "Throat", route: "/bodyparts/throat", top: "17%", lineWidth: "w-32" },
  { name: "Liver", route: "/bodyparts/liver", top: "38%", lineWidth: "w-40" },
  { name: "Arm", route: "/bodyparts/arm", top: "24%", lineWidth: "w-16" },
  { name: "Kidney", route: "/bodyparts/kidney", top: "43%", lineWidth: "w-20" },
  { name: "Lower Back", route: "/bodyparts/lowerback", top: "48%", lineWidth: "w-12" },
  { name: "Reproductive System", route: "/bodyparts/reproductive", top: "55%", lineWidth: "w-6" },
  { name: "Thigh", route: "/bodyparts/thigh", top: "61%", lineWidth: "w-24" },
  { name: "Varicose Vein", route: "/bodyparts/varicose", top: "72%", lineWidth: "w-8" },
  { name: "Foot", route: "/bodyparts/foot", top: "90%", lineWidth: "w-32" },
];


 const rightLabels = [
  { name: "Brain", route: "/bodyparts/brain", top: "6%", lineWidth: "w-32" },
  { name: "Nose", route: "/bodyparts/nose", top: "11.5%", lineWidth: "w-32" },
  { name: "Heart", route: "/bodyparts/heart", top: "22%", lineWidth: "w-32" },
  { name: "Chest", route: "/bodyparts/chest", top: "27%", lineWidth: "w-28" },
  { name: "Elbow", route: "/bodyparts/elbow", top: "35%", lineWidth: "w-10" },
  { name: "Stomach", route: "/bodyparts/stomach", top: "45%", lineWidth: "w-32" },
  { name: "Hip", route: "/bodyparts/hip", top: "55%", lineWidth: "w-24" },
  { name: "Knee", route: "/bodyparts/knee", top: "73%", lineWidth: "w-28" },
  { name: "Ankle", route: "/bodyparts/ankle", top: "88%", lineWidth: "w-28" },
];


  return (
    <div className="bg-white box-border">
      <h1 className="text-center text-[40px] text-[#083e3b] font-bold py-8">
        Various Specialities
      </h1>

      <div className="relative max-w-[400px] md:max-w-[300px] sm:max-w-[260px] w-full mx-auto my-[50px] p-5">
        <img
          src="/human_body_manmap.webp"
          alt="human-body"
          className="w-full h-auto block rounded-[10px]"
        />

        {/* Left Labels */}
        {leftLabels.map((item, index) => (
          <div
            key={index}
            className="absolute left-0 flex flex-row items-center"
            style={{ top: item.top }}
          >
            <Link
              href={item.route}
              className="bg-white/[0.93] text-[#0a0a23] py-[5px] md:py-1 sm:py-[3px] px-2.5 md:px-2 sm:px-1.5 rounded-md font-semibold text-[0.85rem] md:text-[0.7rem] sm:text-[0.6rem] no-underline shadow-[0_2px_5px_rgba(0,0,0,0.15)] transition-all duration-300 whitespace-nowrap z-10 hover:bg-[#ffce45] hover:text-black"
            >
              {item.name}
            </Link>
            <div className={`h-0.5 bg-orange-500 flex-shrink-0 mr-2 ${item.lineWidth}`} />
          </div>
        ))}

        {/* Right Labels */}
        {rightLabels.map((item, index) => (
          <div
            key={index}
            className="absolute right-0 flex flex-row-reverse items-center"
            style={{ top: item.top }}
          >
            <Link
              href={item.route}
              className="bg-white/[0.93] text-[#0a0a23] py-[5px] md:py-1 sm:py-[3px] px-2.5 md:px-2 sm:px-1.5 rounded-md font-semibold text-[0.85rem] md:text-[0.7rem] sm:text-[0.6rem] no-underline shadow-[0_2px_5px_rgba(0,0,0,0.15)] transition-all duration-300 whitespace-nowrap z-10 hover:bg-[#ffce45] hover:text-black"
            >
              {item.name}
            </Link>
            <div className={`h-0.5 bg-orange-500 flex-shrink-0 ml-2 ${item.lineWidth}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Specialities;
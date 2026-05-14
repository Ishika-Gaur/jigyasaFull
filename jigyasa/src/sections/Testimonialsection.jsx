"use client";

export default function TestimonialSection() {
  const testimonials = [
    {
      stars: 5,
      title: "Exceptional care and service!",
      text: "I've been to many hospitals, but the level of care here is unmatched. The staff is friendly, and the doctors take the time to listen and address all concerns. I felt truly cared for throughout my entire visit.",
      name: "Ravi",
      city: "Shahranpur",
    },
    {
      stars: 5,
      title: "Highly recommended!",
      text: "The treatment I received was top-notch. The team was knowledgeable and made me feel comfortable during my procedure. I couldn't be more satisfied with the results.",
      name: "Priya",
      city: "Moradabad",
    },
    {
      stars: 4,
      title: "A truly caring and professional team.",
      text: "I've had a wonderful experience here. From the friendly reception staff to the expert doctors, everyone was professional and caring. I felt supported every step of the way.",
      name: "Kanika",
      city: "Moradabad",
    },
  ];

  return (
    <section className="px-[5%] py-[60px] bg-white max-w-[1200px] mx-auto text-center">
      
      {/* Subtitle */}
      <h2 className="inline-block text-base text-teal-500 font-semibold mb-2.5 bg-teal-100 px-3 py-1 rounded uppercase">
        Testimonials
      </h2>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4 max-md:text-2xl">
        Patient Experience
      </h1>

      {/* Description */}
      <p className="max-w-3xl mx-auto mb-10 text-gray-700 leading-relaxed">
        We prioritize patient satisfaction and well-being at every step of
        their healthcare journey. Our patients' experiences reflect our
        commitment to providing compassionate, high-quality care.
      </p>

      {/* Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md border border-teal-500 hover:-translate-y-2 transition duration-300 text-left"
          >
            {/* Stars */}
            <div className="text-yellow-400 text-xl mb-3">
              {"★".repeat(item.stars)}
              {"☆".repeat(5 - item.stars)}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-lg mb-2">
              "{item.title}"
            </h3>

            {/* Text */}
            <p className="text-gray-600 italic mb-5">
              "{item.text}"
            </p>

            {/* Footer */}
            <div>
              <strong className="block text-gray-900">
                {item.name}
              </strong>
              <span className="text-sm text-gray-500">
                {item.city}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

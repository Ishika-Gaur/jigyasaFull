import Footer from "@/components/Footer";

const testimonials = [
  {
    stars: 5,
    title: "Exceptional care and service!",
    text: "I've been to many hospitals, but the level of care here is unmatched. The staff is friendly, and the doctors truly listen.",
    name: "Ravi",
    city: "Saharanpur",
  },
  {
    stars: 5,
    title: "Highly recommended!",
    text: "The treatment I received was top-notch. The team was knowledgeable and made me feel comfortable.",
    name: "Priya",
    city: "Moradabad",
  },
  {
    stars: 4,
    title: "A truly caring and professional team.",
    text: "From reception to doctors, everyone was professional and supportive.",
    name: "Kanika",
    city: "Bareilly",
  },
  {
    stars: 5,
    title: "Excellent service and friendly staff.",
    text: "Doctors and nurses explained everything clearly and made sure I was comfortable.",
    name: "Manoj",
    city: "Saharanpur",
  },
  {
    stars: 5,
    title: "A great place for quality healthcare.",
    text: "Every visit has been a positive experience. The staff is welcoming and thorough.",
    name: "Amit",
    city: "Moradabad",
  },
  {
    stars: 4,
    title: "Life-changing experience!",
    text: "The team worked tirelessly to ensure I received the best possible care.",
    name: "Tarun",
    city: "Sharanpur",
  },
];

export default function Testimonial() {
  return (
    <>
      <div className="bg-gray-50 min-h-screen">

        {/* HERO SECTION */}
        <section
          className="h-[40vh] md:h-[60vh] flex items-center justify-center text-white text-center px-4 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(9,33,83,0.9), rgba(9,33,83,0.6)), url('/hospital.png')",
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            Testimonials
          </h1>
        </section>

        {/* TESTIMONIAL SECTION */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            What Our Patients Say
          </h2>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100
                transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Stars */}
                <div className="text-yellow-500 mb-3 text-lg">
                  {"★".repeat(item.stars)}
                  {"☆".repeat(5 - item.stars)}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  "{item.title}"
                </h3>

                {/* Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  "{item.text}"
                </p>

                {/* Footer */}
                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.city}
                    </p>
                  </div>

                  {/* Decorative Quote Icon */}
                  <span className="text-teal-500 text-3xl font-bold">
                    ""
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
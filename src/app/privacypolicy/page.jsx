import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="bg-gray-50 min-h-screen">

        {/* HERO SECTION */}
        <section
          className="h-[40vh] flex items-center justify-center text-white text-center px-4 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(9,33,83,0.9), rgba(9,33,83,0.6)), url('/hospital.png')",
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
            Privacy Policy
          </h1>
        </section>

        {/* CONTENT SECTION */}
        <div className="max-w-4xl mx-auto px-6 py-16 bg-white shadow-md rounded-xl -mt-16 relative z-10">

          <div className="space-y-10">

            <Section
              title="Who We Are"
              content="Our website address is: http://jigyasahospital.com."
            />

            <Section
              title="Comments"
              content="When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection. An anonymized string created from your email address may be provided to the Gravatar service."
            />

            <Section
              title="Media"
              content="If you upload images to the website, avoid uploading images with embedded location data (EXIF GPS). Visitors may extract location data from images."
            />

            <Section
              title="Cookies"
              content="If you leave a comment, you may opt-in to saving your name, email address, and website in cookies. Login cookies last for two days, and screen options cookies last for a year."
            />

            <Section
              title="Embedded Content from Other Websites"
              content="Articles may include embedded content such as videos or images. These websites may collect data about you and use cookies."
            />

            <Section
              title="Who We Share Your Data With"
              content="If you request a password reset, your IP address will be included in the reset email."
            />

            <Section
              title="How Long We Retain Your Data"
              content="Comments and their metadata are retained indefinitely. Registered users can edit or delete their personal information."
            />

            <Section
              title="Your Data Rights"
              content="You may request an exported file of personal data we hold about you or request deletion of your data."
            />

            <Section
              title="Where Your Data Is Sent"
              content="Visitor comments may be checked through an automated spam detection service."
            />

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* Reusable Section Component */
function Section({ title, content }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        {title}
      </h2>
      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
        {content}
      </p>
    </div>
  );
}

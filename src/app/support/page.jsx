import Footer from "@/components/Footer";

export default function Support() {
  return (
    <>
      <div className="bg-gray-50 min-h-screen">

        {/* HERO */}
        <section
          className="h-[40vh] flex items-center justify-center text-white text-center px-4 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(9,33,83,0.9), rgba(9,33,83,0.6)), url('/hospital.png')",
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
            Support – Jigyasa Hospital
          </h1>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6 py-16 bg-white shadow-md rounded-xl -mt-16 relative z-10 space-y-12">

          {/* Intro */}
          <p className="text-gray-700 leading-relaxed text-base">
            <strong>At Jigyasa Hospital,</strong> we are committed to providing
            not just excellent medical care, but also dedicated support before,
            during, and after your visit. If you have any questions, concerns,
            or need assistance, our support team is here to help you.
          </p>

          {/* Help Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              How Can We Help You?
            </h2>

            <div className="space-y-8">

              <SupportItem
                title="Appointment Assistance"
                content={
                  <>
                    📞 Call us at: <span className="font-medium">+91-7900793333</span><br />
                    📧 Email: support@jigyasahospital.com
                  </>
                }
              />

              <SupportItem
                title="Medical Records & Reports"
                content={
                  <>
                    📧 records@jigyasahospital.com<br />
                    ⏱ Response time: Within 24-48 working hours
                  </>
                }
              />

              <SupportItem
                title="Billing & Payment Queries"
                content={
                  <>
                    💳 billing@jigyasahospital.com
                  </>
                }
              />

              <SupportItem
                title="Feedback & Complaints"
                content={
                  <>
                    📧 feedback@jigyasahospital.com<br />
                    📝 www.jigyasahospital.com/feedback
                  </>
                }
              />

              <SupportItem
                title="Technical Support"
                content={
                  <>
                    💻 techsupport@jigyasahospital.com
                  </>
                }
              />

            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Timing Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Visiting Hours & Support Timing
            </h2>

            <div className="space-y-6">

              <SupportItem
                title="Support Team Hours"
                content={
                  <>
                    🕘 Monday to Saturday: 9:00 AM – 6:00 PM<br />
                    📞 Sunday: Emergency support only
                  </>
                }
              />

              <SupportItem
                title="Hospital Visiting Hours"
                content={
                  <>
                    🕙 Morning: 10:00 AM – 1:00 PM<br />
                    🕒 Evening: 5:00 PM – 7:00 PM
                  </>
                }
              />

            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Emergency */}
          <div>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Emergency Support
            </h2>

            <p className="text-gray-700 leading-relaxed">
              For medical emergencies, please call our 24/7 emergency helpline:
              <br />
              📞 <span className="font-bold text-red-600">+91-7900903333</span> (Emergency Only)
              <br />
              🚑 Ambulance services available round-the-clock.
            </p>
          </div>

          {/* Closing */}
          <div>
            <p className="text-gray-700 leading-relaxed">
              We are here to serve you with compassion and care.
              <br />
              <strong>
                Thank you for choosing Jigyasa Hospital – Your Health, Our Priority.
              </strong>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

/* Reusable Component */
function SupportItem({ title, content }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-teal-600 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
        {content}
      </p>
    </div>
  );
}



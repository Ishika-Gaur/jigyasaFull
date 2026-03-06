import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions | Jigyasa Hospital",
  description: "Read the Terms and Conditions of Jigyasa Hospital.",
};

export default function TandC() {
  return (
    <>
      <div className="max-w-4xl mx-auto my-16 px-6 text-gray-800 leading-relaxed">
        
        <h1 className="text-4xl font-semibold mb-6 text-gray-900">
          Terms and Conditions
        </h1>

        <p className="mb-6 text-gray-700">
          <strong>Welcome to Jigyasa Hospital.</strong> By accessing or using
          our services, you agree to be bound by the following terms and
          conditions. Please read them carefully before proceeding.
        </p>

        <ol className="list-decimal pl-6 space-y-8">
          
          <li>
            <h2 className="text-xl font-semibold mb-2">
              Medical Disclaimer
            </h2>
            <p className="text-gray-600">
              All content and services provided by Jigyasa Hospital are
              intended for informational purposes only. They should not be
              treated as medical advice. Always consult a qualified healthcare
              professional for any diagnosis, treatment, or medical concerns.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold mb-2">
              Appointments and Cancellations
            </h2>
            <p className="text-gray-600">
              Patients can book appointments through our website, by phone,
              or in person. We request that cancellations or rescheduling be
              done at least 24 hours in advance. Repeated no-shows may affect
              future appointment scheduling.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold mb-2">
              Privacy and Confidentiality
            </h2>
            <p className="text-gray-600">
              Jigyasa Hospital respects patient confidentiality. All personal
              and medical information shared with us is protected and will not
              be disclosed to any third party without patient consent, except
              as required by law.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold mb-2">
              Billing and Payments
            </h2>
            <p className="text-gray-600">
              All services rendered must be paid in accordance with our billing
              policy. Patients are responsible for understanding the costs
              involved in their treatment. Any discrepancies must be reported
              within 7 days.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold mb-2">
              Use of Website
            </h2>
            <p className="text-gray-600">
              By using our website, you agree not to engage in any activity that
              may harm or misuse our digital services. Unauthorized access may
              result in legal action.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold mb-2">
              Limitation of Liability
            </h2>
            <p className="text-gray-600">
              Jigyasa Hospital shall not be held liable for any direct or
              indirect damages arising from the use of our services or website.
              Treatment outcomes may vary depending on individual conditions.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold mb-2">
              Modifications to Terms
            </h2>
            <p className="text-gray-600">
              We reserve the right to change these Terms and Conditions at any
              time. Continued use of our services indicates acceptance of
              updates.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold mb-2">
              Contact Information
            </h2>
            <p className="text-gray-600">
              For any queries regarding these Terms and Conditions, contact us at:
              <br />
              <strong>Email:</strong> info@jigyasahospital.com
              <br />
              <strong>Phone:</strong> +91-7900793333
            </p>
          </li>

        </ol>
      </div>

      <Footer />
    </>
  );
}

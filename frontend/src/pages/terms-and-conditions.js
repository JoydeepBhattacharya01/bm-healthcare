import Layout from '../components/Layout';

export default function TermsAndConditions() {
  return (
    <Layout title="Terms and Conditions - BM Healthcare">
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
            <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString('en-IN')}</p>

            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  Welcome to BM Healthcare. By accessing or using our website, mobile application, or diagnostic services (collectively, the "Services"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Services.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and BM Healthcare. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting on our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Provided</h2>
                <p className="mb-4">BM Healthcare provides diagnostic and pathology services, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Diagnostic laboratory tests and investigations</li>
                  <li>Home sample collection services</li>
                  <li>Online test booking and appointment scheduling</li>
                  <li>Digital test reports and medical records</li>
                  <li>Doctor consultations (where applicable)</li>
                  <li>Health packages and preventive health check-ups</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Registration and Account</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
                <p className="mb-4">
                  To use certain features of our Services, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Security</h3>
                <p className="mb-4">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Eligibility</h3>
                <p className="mb-4">
                  You must be at least 18 years old to create an account. If you are under 18, you may use our Services only with the involvement of a parent or guardian.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Booking and Appointments</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Test Booking</h3>
                <p className="mb-4">
                  When you book a diagnostic test through our platform, you agree to provide accurate information about the patient, including medical history if required. Test bookings are subject to availability and confirmation.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Appointment Scheduling</h3>
                <p className="mb-4">
                  Appointments are scheduled based on availability. We will make reasonable efforts to accommodate your preferred time slot, but we cannot guarantee specific appointment times.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Cancellation and Rescheduling</h3>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Cancellations must be made at least 2 hours before the scheduled appointment</li>
                  <li>Refunds for cancelled appointments will be processed as per our refund policy</li>
                  <li>We reserve the right to cancel or reschedule appointments due to unforeseen circumstances</li>
                  <li>No-shows without prior cancellation may result in forfeiture of payment</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Pricing</h3>
                <p className="mb-4">
                  All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. We reserve the right to change prices at any time without prior notice.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Payment Methods</h3>
                <p className="mb-4">We accept the following payment methods:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Online payment (Credit/Debit Cards, UPI, Net Banking, Digital Wallets)</li>
                  <li>Payment at diagnostic centre</li>
                  <li>Cash on home collection (where applicable)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Refund Policy</h3>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Refunds for cancelled tests will be processed within 7-10 business days</li>
                  <li>Refund amount may be subject to cancellation charges as per our policy</li>
                  <li>Refunds will be credited to the original payment method</li>
                  <li>No refunds for completed tests or services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sample Collection</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Home Collection</h3>
                <p className="mb-4">
                  For home sample collection services, you agree to provide a safe and accessible location for our collection staff. Additional charges may apply for home collection services.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Sample Quality</h3>
                <p className="mb-4">
                  You must follow all pre-test instructions provided by us to ensure sample quality. We are not responsible for inaccurate results due to non-compliance with preparation instructions.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Centre Visit</h3>
                <p className="mb-4">
                  If you choose to visit our diagnostic centre, please arrive at your scheduled time. You may be required to present a valid government-issued ID for verification.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Test Reports and Results</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Report Delivery</h3>
                <p className="mb-4">
                  Test reports will be delivered within the specified turnaround time. Reports are available online through your account dashboard and may also be sent via email or SMS.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Report Accuracy</h3>
                <p className="mb-4">
                  While we strive for accuracy, test results should be interpreted by a qualified healthcare professional. We are not liable for any diagnosis or treatment decisions made based on test results.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Report Access</h3>
                <p className="mb-4">
                  You are responsible for maintaining the confidentiality of your test reports. We will not share your reports with third parties without your explicit consent, except as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Medical Disclaimer</h2>
                <p className="mb-4">
                  <strong>Important:</strong> BM Healthcare provides diagnostic services only. We do not provide medical advice, diagnosis, or treatment. All test results should be reviewed by a qualified healthcare professional.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Test results are for informational purposes only</li>
                  <li>Do not use test results for self-diagnosis or self-treatment</li>
                  <li>Always consult with a qualified doctor for medical advice</li>
                  <li>In case of medical emergency, call emergency services immediately</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
                <p className="mb-4">
                  All content on our website and mobile application, including text, graphics, logos, images, and software, is the property of BM Healthcare and is protected by Indian and international copyright laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, or create derivative works from our content without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. User Conduct</h2>
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Use our Services for any unlawful purpose</li>
                  <li>Provide false or misleading information</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with or disrupt our Services</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems to access our Services</li>
                  <li>Harass, abuse, or harm other users or our staff</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
                <p className="mb-4">
                  To the maximum extent permitted by Indian law, BM Healthcare shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses.
                </p>
                <p>
                  Our total liability for any claim arising out of or relating to these Terms or our Services shall not exceed the amount paid by you for the specific service giving rise to the claim.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless BM Healthcare, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of our Services or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Privacy and Data Protection</h2>
                <p>
                  Your use of our Services is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Compliance with Laws</h2>
                <p className="mb-4">
                  We comply with all applicable Indian laws and regulations, including:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Clinical Establishments (Registration and Regulation) Act, 2010</li>
                  <li>Information Technology Act, 2000</li>
                  <li>Consumer Protection Act, 2019</li>
                  <li>Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations, 2002</li>
                  <li>Bio-Medical Waste Management Rules, 2016</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Dispute Resolution</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">15.1 Governing Law</h3>
                <p className="mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">15.2 Jurisdiction</h3>
                <p className="mb-4">
                  Any disputes arising out of or relating to these Terms or our Services shall be subject to the exclusive jurisdiction of the courts in Kolkata, West Bengal, India.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">15.3 Arbitration</h3>
                <p className="mb-4">
                  Before initiating any legal proceedings, parties agree to attempt to resolve disputes through good faith negotiations. If negotiations fail, disputes may be resolved through arbitration in accordance with the Arbitration and Conciliation Act, 1996.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Force Majeure</h2>
                <p>
                  We shall not be liable for any failure or delay in performing our obligations due to circumstances beyond our reasonable control, including but not limited to natural disasters, pandemics, government actions, strikes, or technical failures.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Severability</h2>
                <p>
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable to the fullest extent permitted by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Entire Agreement</h2>
                <p>
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and BM Healthcare regarding the use of our Services and supersede all prior agreements and understandings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">19. Contact Information</h2>
                <p className="mb-4">
                  For any questions or concerns regarding these Terms and Conditions, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="font-semibold mb-2">BM Healthcare</p>
                  <p>AS/85, Christanpara, P.O-Krishnapur</p>
                  <p>Kestopur, 24 North Parganas</p>
                  <p>Kolkata, West Bengal - 700102</p>
                  <p className="mt-3">Phone: +91 9830016600 / +91 9830036600</p>
                  <p>Email: info@bmhealthcare.com</p>
                  <p className="mt-3">Working Hours: Monday - Sunday, 8:00 AM - 8:00 PM</p>
                </div>
              </section>

              <section className="border-t pt-8 mt-8">
                <p className="text-sm text-gray-600">
                  By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

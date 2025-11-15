import Layout from '../components/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy - BM Healthcare">
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString('en-IN')}</p>

            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="mb-4">
                  Welcome to BM Healthcare ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our diagnostic services.
                </p>
                <p>
                  By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
                <p className="mb-4">We collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Register for an account</li>
                  <li>Book diagnostic tests or appointments</li>
                  <li>Make a payment</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletter</li>
                </ul>
                
                <p className="mb-4">This information may include:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Name, email address, phone number</li>
                  <li>Date of birth, gender</li>
                  <li>Address and location information</li>
                  <li>Medical history and health information</li>
                  <li>Payment and billing information</li>
                  <li>Government-issued ID (for verification purposes)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Health Information</h3>
                <p className="mb-4">
                  As a diagnostic service provider, we collect sensitive health information including test results, medical reports, prescriptions, and related health data. This information is protected under applicable Indian healthcare privacy laws.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Automatically Collected Information</h3>
                <p className="mb-4">When you visit our website, we automatically collect certain information about your device, including:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>IP address and browser type</li>
                  <li>Operating system and device information</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">We use your information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>To provide and maintain our diagnostic services</li>
                  <li>To process test bookings and appointments</li>
                  <li>To generate and deliver test reports</li>
                  <li>To process payments and prevent fraud</li>
                  <li>To send appointment reminders and notifications</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To improve our services and website functionality</li>
                  <li>To comply with legal obligations and regulations</li>
                  <li>To send promotional communications (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                <p className="mb-4">We may share your information in the following situations:</p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 With Healthcare Professionals</h3>
                <p className="mb-4">
                  We share your health information with doctors, pathologists, and other healthcare professionals involved in your care and diagnosis.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 With Service Providers</h3>
                <p className="mb-4">
                  We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, and customer service.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 For Legal Compliance</h3>
                <p className="mb-4">
                  We may disclose your information if required by law, court order, or governmental authority, or to protect our rights, property, or safety.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 With Your Consent</h3>
                <p className="mb-4">
                  We may share your information for any other purpose with your explicit consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                <p className="mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection</li>
                  <li>Secure data storage and backup systems</li>
                </ul>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
                <p className="mb-4">Under Indian data protection laws, you have the following rights:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li><strong>Access:</strong> You can request access to your personal information</li>
                  <li><strong>Correction:</strong> You can request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> You can request deletion of your information (subject to legal requirements)</li>
                  <li><strong>Opt-out:</strong> You can opt-out of marketing communications</li>
                  <li><strong>Data Portability:</strong> You can request a copy of your data in a portable format</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at info@bmhealthcare.com or call +91 9830016600.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Medical records and test reports are retained as per Indian medical record retention guidelines (minimum 5 years from the date of last treatment).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                <p>
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies and Tracking Technologies</h2>
                <p className="mb-4">
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Compliance with Indian Laws</h2>
                <p className="mb-4">
                  We comply with applicable Indian laws and regulations, including:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                  <li>Information Technology Act, 2000</li>
                  <li>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
                  <li>Digital Personal Data Protection Act, 2023</li>
                  <li>Clinical Establishments (Registration and Regulation) Act, 2010</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
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
                  By using our services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

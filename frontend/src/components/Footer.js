import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4" style={{fontFamily: 'Poppins, sans-serif'}}>
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">BM Healthcare</span>
            </h3>
            <p className="text-sm mb-4">
              Your trusted partner in healthcare. We provide quality medical services,
              diagnostic tests, and expert consultations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-all duration-300 hover:scale-110">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-all duration-300 hover:scale-110">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-all duration-300 hover:scale-110">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-all duration-300 hover:scale-110">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-primary-600 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link href="/tests" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Diagnostic Tests
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-primary-600 pb-2 inline-block">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#consultation" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Doctor Consultation
                </Link>
              </li>
              <li>
                <Link href="/services#lab-tests" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Laboratory Tests
                </Link>
              </li>
              <li>
                <Link href="/services#imaging" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Medical Imaging
                </Link>
              </li>
              <li>
                <Link href="/services#health-packages" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Health Packages
                </Link>
              </li>
              <li>
                <Link href="/services#home-collection" className="hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Home Sample Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-primary-600 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span>AS/85, Christanpara, P.O-Krishnapur, Kestopur, 24 North Parganas, Kolkata, West Bengal - 700102</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="flex-shrink-0" />
                <span>+91 9830016600 / +91 9830036600</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="flex-shrink-0" />
                <span>info@bmhealthcare.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm font-semibold">Working Hours:</p>
              <p className="text-sm">Monday - Sunday</p>
              <p className="text-sm">8:00 AM - 8:00 PM (Open Every Day)</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} BM Healthcare. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="hover:text-primary-400 transition-all duration-300">
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/terms-and-conditions" className="hover:text-primary-400 transition-all duration-300">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

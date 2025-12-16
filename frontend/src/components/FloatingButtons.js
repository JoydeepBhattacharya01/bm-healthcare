import { useState } from 'react';
import { FiPhone, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingButtons = () => {
  const [showOptions, setShowOptions] = useState(false);

  const phoneNumbers = [
    { number: '+919830016600', display: '+91 9830016600' },
    { number: '+919830036600', display: '+91 9830036600' }
  ];

  const whatsappNumber = '919830016600';

  return (
    <>
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-28 right-4 sm:right-6 z-50 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-4"
        aria-label="Book via WhatsApp"
      >
        <FaWhatsapp size={24} className="sm:w-7 sm:h-7" />
        <span className="text-sm sm:text-base font-semibold whitespace-nowrap">Book via WhatsApp</span>
      </a>

      {/* Emergency Call Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {showOptions && (
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-4 mb-2 animate-fadeIn border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">Emergency Call</h3>
              <button
                onClick={() => setShowOptions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {phoneNumbers.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${phone.number}`}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiPhone className="text-white" size={20} />
                  </div>
                  <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                    {phone.display}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowOptions(!showOptions)}
          className="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-4"
          aria-label="Book via Call"
        >
          {showOptions ? (
            <FiX size={24} className="sm:w-7 sm:h-7" />
          ) : (
            <>
              <FiPhone size={24} className="sm:w-7 sm:h-7" />
              <span className="text-sm sm:text-base font-semibold whitespace-nowrap">Book via Call</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingButtons;

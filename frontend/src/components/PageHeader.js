import Image from 'next/image';

const PageHeader = ({ title, subtitle, backgroundImage = '/images/hero-1.jpeg' }) => {
  return (
    <div className="relative h-48 md:h-64 overflow-hidden mt-20">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      
      {/* Opaque Overlay */}
      <div className="absolute inset-0 bg-gray-900/60" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3" style={{fontFamily: 'Poppins, sans-serif'}}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-base md:text-lg text-white/90">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

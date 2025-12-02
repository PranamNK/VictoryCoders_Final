import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown } from "lucide-react";

const EducationSection = () => {
  const { language } = useLanguage();
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    {
      id: 1,
      title: language === 'kn' ? 'ಕರಾವಳಿ ದೇವಾಲಯಗಳು' : 'Coastal Temples',
      description: language === 'kn' ? 'ಕರ್ನಾಟಕದ ಕರಾವಳಿ ದೇವಾಲಯ ಪರಂಪರೆ' : 'Coastal Karnataka temple heritage',
      embedUrl: 'https://youtube.com/shorts/KVqN8RUD_4Y?si=gbDaj8Ox0oYYW5Jz'
    },
    {
      id: 2,
      title: language === 'kn' ? 'ದೇವಾಲಯ ದರ್ಶನ' : 'Temple Darshan',
      description: language === 'kn' ? 'ತುಳುನಾಡಿನ ದೇವಾಲಯ ದರ್ಶನ' : 'Temple visit and traditions of Tulunadu',
      embedUrl: 'https://youtube.com/shorts/qqgmhvDEthE?si=xwnWIETscvDWdWi-'
    },
    {
      id: 3,
      title: language === 'kn' ? 'ದೇವಾಲಯ ಸಂಪ್ರದಾಯಗಳು' : 'Temple Traditions',
      description: language === 'kn' ? 'ಪ್ರಾಚೀನ ದೇವಾಲಯ ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ಆಚರಣೆಗಳು' : 'Ancient temple traditions and practices',
      embedUrl: 'https://youtube.com/shorts/-KkLRVa75eI?si=yRP7-nQ9kbdWPwBf'
    },
    {
      id: 4,
      title: language === 'kn' ? 'ಪವಿತ್ರ ಸ್ಥಳಗಳು' : 'Sacred Places',
      description: language === 'kn' ? 'ತುಳುನಾಡಿನ ಪವಿತ್ರ ದೇವಾಲಯ ಸ್ಥಳಗಳು' : 'Sacred temple sites of Tulunadu',
      embedUrl: 'https://www.youtube.com/embed/BwgsjiWiYII'
    }
  ];

  const handleScroll = () => {
    const container = document.getElementById('shorts-container');
    if (container) {
      const scrollPosition = container.scrollTop;
      const videoHeight = container.clientHeight;
      const newIndex = Math.round(scrollPosition / videoHeight);
      if (newIndex !== currentVideo && newIndex < videos.length) {
        setCurrentVideo(newIndex);
      }
    }
  };

  const scrollToNext = () => {
    const container = document.getElementById('shorts-container');
    if (container && currentVideo < videos.length - 1) {
      container.scrollTo({
        top: (currentVideo + 1) * container.clientHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = document.getElementById('shorts-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentVideo]);

  return (
    <section className="h-screen w-full bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-20 left-0 right-0 z-50 text-center px-4 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
          {language === 'kn' ? 'ಶಿಕ್ಷಣ' : 'Temple Shorts'}
        </h2>
        <p className="text-sm text-white/80 mt-1">
          {language === 'kn' ? 'ಸ್ಕ್ರಾಲ್ ಮಾಡಿ' : 'Scroll to watch more'}
        </p>
      </div>

      {/* Shorts Container */}
      <div 
        id="shorts-container"
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          #shorts-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {videos.map((video, index) => (
          <div 
            key={video.id}
            className="h-screen w-full snap-start snap-always relative flex items-center justify-center"
          >
            {/* Video Container */}
            <div className="relative w-full h-full max-w-md mx-auto bg-black">
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Video Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2">
                  {video.title}
                </h3>
                <p className="text-white/90 text-sm">
                  {video.description}
                </p>
                
                {/* Video Counter */}
                <div className="mt-3 text-white/70 text-xs">
                  {index + 1} / {videos.length}
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            {index < videos.length - 1 && (
              <button
                onClick={scrollToNext}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
              >
                <ChevronDown className="h-8 w-8" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Side Navigation Dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 space-y-3">
        {videos.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentVideo === index 
                ? 'bg-white h-8' 
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default EducationSection;

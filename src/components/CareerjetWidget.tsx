import { useEffect, useRef } from 'react';

export default function CareerjetWidget() {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!isLoaded.current) {
      const script = document.createElement('script');
      script.id = 'cj-search-box-script';
      script.async = true;
      // Appending a cache-buster or using the one provided
      script.src = 'https://static.careerjet.org/js/all_widget_search_box_3rd_party.min.js?t=' + Date.now();
      document.body.appendChild(script);
      isLoaded.current = true;
    }
  }, []);

  return (
    <div className="w-full">
      {/* The container required by Careerjet's script */}
      <div 
        className="cj-search-box" 
        data-url="https://widget.careerjet.net/search-box/4ede6c89dec9637ed909ea4eeaaabddc"
      ></div>
    </div>
  );
}

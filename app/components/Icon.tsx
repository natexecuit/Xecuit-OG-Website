'use client';

import React, { useEffect } from 'react';

interface IconProps {
  icon: string;
  className?: string;
}

export default function Icon({ icon, className = '' }: IconProps) {
  useEffect(() => {
    // Dynamically load Iconify script if not present
    if (!document.querySelector('script[src*="iconify-icon"]')) {
      const script = document.createElement('script');
      script.src = 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js';
      document.head.appendChild(script);
    }
  }, []);

  return React.createElement('iconify-icon', { icon, class: className });
}

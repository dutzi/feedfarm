import React, { useRef, useEffect, useState } from 'react';

export default function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}

import gsap from 'gsap/gsap-core';

export function pop(splitText: any) {
  return gsap.timeline().from(splitText.chars, {
    stagger: 0.02,
    scale: 0.7,
    autoAlpha: 0,
    // rotationY: -180,
    // rotationX: -90,
    // rotationZ: -45,
    transformOrigin: '50% 50%',
    ease: 'back.out(3)',
    duration: 0.4,
  });
}

export function skewyPop(splitText: any) {
  return gsap.timeline().from(splitText.chars, {
    stagger: 0.02,
    scale: 0,
    autoAlpha: 0,
    rotationY: -180,
    rotationX: -90,
    rotationZ: -45,
    transformOrigin: '50% 50%',
    ease: 'back.out(3)',
    duration: 0.4,
  });
}

export function wave(splitText: any) {
  return gsap
    .timeline()
    .from(splitText.chars, {
      duration: 0.8,
      opacity: 0,
      scale: 0,
      y: 80,
      rotationX: 180,
      transformOrigin: '0% 50% -50',
      ease: 'back',
      stagger: 0.02,
    })
    .fromTo(
      splitText.chars,
      { color: '#bfbfbf' },
      {
        color: '#ffffff',
        ease: 'out',
        delay: -0.3,
        duration: 0.2,
        stagger: 0.02,
      },
    )
    .to(splitText.chars, {
      color: '#bfbfbf',
      ease: 'in',
      duration: 0.2,
      stagger: 0.02,
    });
}

export function complex(splitText: any) {
  return gsap
    .timeline()
    .fromTo(
      splitText.chars,
      { color: '#bfbfbf', opacity: 0 },
      {
        color: '#ffffff',
        ease: 'out',
        duration: 0.2,
        stagger: 0.02,
        opacity: 1,
      },
    )
    .to(splitText.chars, {
      color: '#ffffff',
      ease: 'out',
      delay: -0.3,
      duration: 0.2,
      stagger: 0.02,
    })
    .to(splitText.chars, {
      color: '#bfbfbf',
      ease: 'in',
      duration: 0.2,
      stagger: 0.02,
    })
    .to(splitText.chars, {
      delay: -1,
      stagger: 0.02,
      duration: 0.3,
      // '-webkit-text-stroke-width': '2px',
    })
    .fromTo(
      splitText.chars,
      {
        textShadow: '0px 0px #0000004d',
      },
      {
        x: -3,
        y: -3,
        stagger: 0.02,
        duration: 0.3,
        textShadow: `3px 3px #0000004d`,
      },
    );
}

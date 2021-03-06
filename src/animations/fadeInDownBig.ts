export const fadeInDownBig: ja.IAnimationOptions = {
  keyframes: [
    {
      opacity: 0,
      transform: 'translate3d(0, -2000px, 0)'
    },
    {
      opacity: 1,
      transform: 'none'
    }
  ],
  timings: {
    duration: 1300,
    fill: 'both',
    easing: 'ease-out'
  },
  name: 'fadeInDownBig'
};
export const bounceOut: ja.IAnimationOptions = {
  keyframes: [
    {
      offset: 0,
      opacity: 1,
      transform: 'none'
    },
    {
      offset: 0.2,
      transform: 'scale3d(.9, .9, .9)'
    },
    {
      offset: 0.5,
      opacity: 1,
      transform: 'scale3d(1.1, 1.1, 1.1)'
    },
    {
      offset: 0.55,
      opacity: 1,
      transform: 'scale3d(1.1, 1.1, 1.1)'
    },
    {
      offset: 1,
      opacity: 0,
      transform: 'scale3d(.3, .3, .3)'
    }
  ],
  timings: {
    duration: 900,
    fill: 'both'
  },
  name: 'bounceOut'
};

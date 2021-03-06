export const shake: ja.IAnimationOptions = {
  keyframes: [
    {
      transform: 'translate3d(0, 0, 0)'
    },
    {
      transform: 'translate3d(-10px, 0, 0)'
    },
    {
      transform: 'translate3d(10px, 0, 0)'
    },
    {
      transform: 'translate3d(-10px, 0, 0)'
    },
    {
      transform: 'translate3d(10px, 0, 0)'
    },
    {
      transform: 'translate3d(-10px, 0, 0)'
    },
    {
      transform: 'translate3d(10px, 0, 0)'
    },
    {
      transform: 'translate3d(-10px, 0, 0)'
    },
    {
      transform: 'translate3d(10px, 0, 0)'
    },
    {
      transform: 'translate3d(-10px, 0, 0)'
    },
    {
      transform: 'translate3d(0, 0, 0)'
    }
  ],
  timings: {
    duration: 1000
  },
  name: 'shake'
};
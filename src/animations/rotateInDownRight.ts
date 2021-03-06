export const rotateInDownRight: ja.IAnimationOptions = {
  keyframes: [
    {
      'transform-origin': 'right bottom',
      transform: 'rotate3d(0, 0, 1, 45deg)',
      opacity: 0
    },
    {
      'transform-origin': 'right bottom',
      transform: 'none',
      opacity: 1
    }
  ],
  timings: {
    duration: 1000
  },
  name: 'rotateInDownRight'
};
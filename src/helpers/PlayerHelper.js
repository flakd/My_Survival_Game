let g = window;

const PlayerHelper = () => {
  g.p.lastYInt = g.p.yInt;
  g.p.lastXInt = g.p.xInt;
  g.p.dirLegend = {
    up: {
      key: 'up',
      char1: 'ArrowUp',
      char2: 'w',
      move: -1,
      axis: 'y',
      CSS: 'top',
    },
    left: {
      key: 'left',
      char1: 'ArrowLeft',
      char2: 'a',
      move: -1,
      axis: 'x',
      CSS: 'left',
    },
    down: {
      key: 'down',
      char1: 'ArrowDown',
      char2: 's',
      move: 1,
      axis: 'y',
      CSS: 'top',
    },
    right: {
      key: 'right',
      char1: 'ArrowRight',
      char2: 'd',
      move: 1,
      axis: 'x',
      CSS: 'left',
    },
  };
};

export default PlayerHelper;

const game = import('/assets/js/qr_state.js');
game.then(js => {
  const { QRState } = wasm_bindgen;
  let intervalId = null;

  function run(version, speed, data) {
    let prevX = null;
    let prevY = null;
    let prevBit = null;

    const qrState = window.qr = QRState.new(version, data);
    const canvas = document.getElementById('qr-body');
    const size = Math.sqrt(qrState.size());
    canvas.setAttribute('height', size * 20);
    canvas.setAttribute('width', size * 20);
    const ctxt = canvas.getContext('2d');
    const canvas_size = size - 1;
    const cellIndices = allIndexLocations();
    let canvasIndex = 0;
    let prevBitLocation = null;

    const VERSION_INFO = {
      color: { fill: 'rgba(40, 43, 221, 0.5)', stroke: 'red' },
      shapes: [
        {
          start: { x: size - 11, y: 0 },
          pattern: [3, 6, -3, -6]
        },
        {
          start: { x: 0, y: size - 11 },
          pattern: [6, 3, -6, -3]
        }
      ]
    }

    const SEPARATORS = {
      color: { fill: 'rgba(77, 255, 21, 0.5)', stroke: 'yellow' },
      shapes: [
        {
          start: { x: 7, y: 0 },
          pattern: [1, 8, -8, -1, 7, -8]
        },
        {
          start: { x: 0, y: size - 8 },
          pattern: [8, 8, -1, -7, -7, -1]
        },
        {
          start: { x: size - 8, y: 0 },
          pattern: [1, 7, 7, 1, -8, -8]
        }
      ]
    };

    const TIMERS = {
      color: { fill: 'rgba(255, 0, 0, 0.5)', stroke: 'blue' },
      shapes: [
        {
          start: { x: 6, y: 9 },
          pattern: [1, size - 17, -1, -(size - 17)]
        },
        {
          start: { x: 9, y: 6 },
          pattern: [size - 17, 1, -(size - 17), -1]
        }
      ]
    }

    const FORMAT = {
      color: { fill: 'rgba(222, 246, 0, 0.5)', stroke: 'green' },
      shapes: [
        {
          start: { x: 0, y: 8 },
          pattern: [8, -8, 1, 9, -9, -1]
        },
        {
          start: { x: 8, y: size - 7 },
          pattern: [1, 7, -1, -7]
        },
        {
          start: { x: size - 8, y: 8 },
          pattern: [8, 1, -8, -1]
        }
      ]
    }

    const FINDERS = {
      shapes: [
        {
          start: { x: 0, y: 0 },
          pattern: [7, 7, -7, -7],
        },
        {
          start: { x: size - 7, y: 0 },
          pattern: [7, 7, -7, -7],
        },
        {
          start: { x: 0, y: size - 7 },
          pattern: [7, 7, -7, -7],
        }
      ],
      color: { fill: 'rgba(18, 79, 59, 0.5)', stroke: 'rgb(19, 79, 0)' }
    }

    let codewordShape = [];

    function highlightAlignmentPoints() {
      let indices = Array.from(qrState.alignment_points());
      let start = indices.pop();
      let points = getBoundaries(start % size, Math.floor(start / size));

      for (const index of indices) {
        let x = index % size;
        let y = Math.floor(index / size);

        points = updateShape(x, y, points);
      }

      drawCodewordOutline(points);
    }

    function allIndexLocations() {
      let indices = [];
      let inc = -1;
      let row = canvas_size;
      let col = canvas_size;

      while (true) {

        if (col === 0) {
          let index = row * size;
          indices.push(index);
        } else {
          for (let xmod = 0; xmod < 2; xmod++) {
            let index = (row * size) + (col - xmod);
            indices.push(index);
          }  
        }

        if (row - 1 === -1 && inc === -1) {
          col -= 2;
          inc = 1;
        } else if (row + 1 === size && inc === 1) {
          col -= 2;
          inc = -1;
        } else {
          row += inc;
        }

        if (indices.length >= (size * size) + 1) {
          break;
        }

      }
      return indices;
    }

    const renderTracer = (cx, cy, currentBit) => {
      
      if (prevX === null) {
        return;
      }
      
      if (prevBit === currentBit) {
        return;
      }

      if (prevBitLocation) {
        return;
      }

      let diffX = cx - prevX;
      let diffY = cy - prevY;
      const xmod = diffX * 20;
      const ymod = diffY * 20;
      // console.log('cx, cy', cx, cy, 'prev', prevX, prevY, 'diff', diffX, diffY, '\n', 'xmod', xmod, ymod);

      let fx = (prevX * 20) + 10;
      let fy = (prevY * 20) + 10;
      ctxt.beginPath();
      ctxt.moveTo(fx, fy);
      ctxt.lineTo(
        fx + xmod,
        fy + ymod
      );
      ctxt.strokeStyle = 'red';
      ctxt.closePath();

      ctxt.stroke();
    }

    const updateShape = (x, y, coords) => {
      const boundaries = getBoundaries(x, y, coords);
      const newLines = [];
      const oldLines = [];

      for (const boundary of boundaries) {
        let [origin, dest] = boundary;
        const index = coords.findIndex(([from, to]) => {
          return to.x === origin.x && to.y === origin.y && from.x === dest.x && from.y === dest.y;
        });

        // const what = coords.filter(([from, to]) => {
        //   return to.x === origin.x && to.y === origin.y && from.x === dest.x && from.y === dest.y;
        // });

        // if (what.length > 0) {
        //   debugger
        // }


        if (index === -1) {
          newLines.push(boundary);
        } else {
          coords = coords.slice(0, index).concat(coords.slice(index + 1));
        }
      }

      // let f = prevX;
      // let a = prevY;
      return coords.concat(newLines);
    }

    const reconnectTracer = (cx, cy) => {
      let { x, y } = prevBitLocation;

      let diffX = cx - x;
      let diffY = cy - y;

      const xmod = diffX * 20;
      const ymod = diffY * 20;

      let fx = (x * 20) + 10;
      let fy = (y * 20) + 10;

      ctxt.beginPath();
      ctxt.moveTo(fx, fy);
      ctxt.lineTo(
        fx + xmod,
        fy + ymod
      );
      ctxt.strokeStyle = 'red';
      ctxt.stroke();
      ctxt.closePath();
    }

    const getBoundaries = (x, y, coords) => {
      const lines = [
        [{ x: x * 20, y: y * 20 }, { x: (x * 20) + 20, y: y * 20 }], // right
        [{ x: (x * 20) + 20, y: y * 20 }, { x: (x * 20) + 20, y: (y * 20) + 20 }], // down
        [{ x: (x * 20) + 20, y: (y * 20) + 20 }, { x: x * 20, y: (y * 20) + 20 }], // right
        [{ x: x * 20, y: (y * 20) + 20 }, { x: x * 20, y: y * 20 }] /// down
      ];

      return lines;
    }

    const renderQR = () => {
      if (canvasIndex >= cellIndices.length) {
        highlightSeparatorSection();
        shadeSection(FINDERS);
        shadeSection(TIMERS);

        if (version > 6) {
          shadeSection(VERSION_INFO);
        }

        shadeSection(FORMAT);
        highlightAlignmentPoints();
        clearInterval(intervalId);
      }

      let index = cellIndices[canvasIndex];
      prevBit = qrState.current_bit();
      let currentCodeword = qrState.current_codeword();

      qrState.tick(index);
      let currentBit = qrState.current_bit();
      let x = index % size;
      let y = Math.floor(index / size);
      
        ctxt.fillStyle = qrState.dark() ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
        ctxt.fillRect(x * 20, y * 20, 20, 20);


      if (prevBit !== currentBit) {
        if (codewordShape.length > 0 && currentCodeword === qrState.current_codeword()) {
          codewordShape = updateShape(x, y, codewordShape.slice());
        } else if (codewordShape.length === 0 && currentCodeword === qrState.current_codeword()) {
          codewordShape = getBoundaries(x, y);
        } else {
          codewordShape = updateShape(x, y, codewordShape.slice());
          drawCodewordOutline(codewordShape);
          codewordShape = [];
        }
      }


      if (currentBit === prevBit && prevBitLocation === null) {
        prevBitLocation = { x: prevX, y: prevY };
      } else if (currentBit !== prevBit && prevBitLocation !== null) {
        reconnectTracer(x, y);
        prevBitLocation = null;
      } else {
        renderTracer(x, y, currentBit);
      }

      canvasIndex += 1;
      prevX = x;
      prevY = y;
    }

    const matchCoordinates = (coords) => {
      let count = coords.length;
      let path = coords.slice(0, 1);
      let [start, end] = path[0];
      let truncatedSegmentPath = [];
      let i = 0;

      while (i < 100) {
        i += 1;
        let next = coords.findIndex(([s, e]) => {
          return s.x === end.x && s.y === end.y // || e.x === start.x && e.y === start.y;
        });

        if (next > -1) {
          let coord = coords[next];
          start = coord[0];
          end = coord[1];
          coords = coords.slice(0, next).concat(coords.slice(next + 1));

          path.push(coord);
        }
      }

      return path;
    }

    const highlightFinderSection = () => {
      ctxt.save();

      // upper left
      ctxt.beginPath();
      ctxt.moveTo(0, 0);
      ctxt.lineTo(7 * 20, 0);
      ctxt.lineTo(7 * 20, 7 * 20);
      ctxt.lineTo(0, 7 * 20);
      ctxt.lineTo(0, 0);

      // bottom left
      ctxt.moveTo(0, (size - 7) * 20);
      ctxt.lineTo(7 * 20, (size - 7) * 20);
      ctxt.lineTo(7 * 20, size * 20);
      ctxt.lineTo(0, size * 20);
      ctxt.lineTo(0, (size - 6) * 20);

      // upper right
      ctxt.moveTo((size - 7) * 20, 0);
      ctxt.lineTo(size * 20, 0);
      ctxt.lineTo(size * 20, 7 * 20);
      ctxt.lineTo((size - 7) * 20, 7 * 20);
      ctxt.lineTo((size - 7) * 20, 0);

      ctxt.strokeStyle = 'rgb(19, 79, 0)';
      ctxt.fillStyle = 'rgba(18, 79, 59, 0.5)'
      ctxt.stroke();
      ctxt.fill();
      ctxt.closePath();
    }


    /*
    create([1, 6, 6, 1, 6, 6], [0, 0], )

    ex. [1, -6, -6, -1, 6, 6]

    over one,
    back six
    back six again
    back one
    over six
    over six again

    even/odd = alternating travel on x / y axis
    positive means increasing on that axis
    negative means decreasing on that axis

    */

    const shadeSection = (section) => {
      const { shapes, color } = section;

      for (const shape of shapes) {
        const { start, pattern } = shape;
        let { x, y } = start;

        ctxt.beginPath();
        ctxt.moveTo(start.x * 20, start.y * 20);

        for (const [index, length] of pattern.entries()) {    
          if (index % 2 === 0) {
            x += length;
            ctxt.lineTo(x * 20, y * 20);
          } else {
            y += length;
            ctxt.lineTo(x * 20, y * 20);
          }
        }

        ctxt.fillStyle = color.fill;
        ctxt.strokeStyle = color.stroke;
        ctxt.stroke();
        ctxt.fill();
        ctxt.closePath();
      }
    }

    const highlightSeparatorSection = () => {
      // ctxt.save();
      ctxt.beginPath();

      let coords = [
        {
          start: { x: 0, y: 7 * 20 },
          points: [
            { x: 7 * 20, y: 7 * 20 },
            { x: 7 * 20, y: 0 },
            { x: 8 * 20, y: 0 },
            { x: 8 * 20, y: 8 * 20 },
            { x: 0, y: 8 * 20 },
            { x: 0, y: 7 * 20 }
          ]
        },
        {
          start: { x: (size - 7) * 20, y: 0 },
          points: [
            // { x:  }
          ]
        }
      ];
      let coord = coords.pop();

      ctxt.moveTo(coord.start.x, coord.start.y);
      for (const c of coord.points) {
        ctxt.lineTo(c.x, c.y);
      }

      ctxt.strokeStyle = 'rgb(19, 79, 0)';
      ctxt.fillStyle = 'rgba(18, 79, 59, 0.5)'
      ctxt.stroke();
      ctxt.fill();
      ctxt.closePath();
    }

    const drawCodewordOutline = (coords) => {
      let count = coords.length;
      let path = coords.slice(0, 1);
      let [start, end] = path[0];
      let truncatedSegmentPath = [];
      let i = 0;

      while (i < 100) {
        i += 1;
        let next = coords.findIndex(([s, e]) => {
          return s.x === end.x && s.y === end.y // || e.x === start.x && e.y === start.y;
        });

        if (next > -1) {
          let coord = coords[next];
          start = coord[0];
          end = coord[1];
          coords = coords.slice(0, next).concat(coords.slice(next + 1));

          path.push(coord);
        }
      }
      ctxt.beginPath();
      ctxt.moveTo(start.x, start.y);
      for (const [s, e] of path) {
        ctxt.lineTo(e.x, e.y);
      }

      if (coords.length > 0) {
        let extraCoords = matchCoordinates(coords);
        start = extraCoords[0][0];
        ctxt.moveTo(start.x, start.y);
        for (const [s, e] of extraCoords) {
          ctxt.lineTo(e.x, e.y);
        }
      }


      ctxt.strokeStyle = 'green';
      ctxt.fillStyle = 'rgba(150, 15, 20, 0.5)'
      ctxt.stroke();
      ctxt.fill();

      ctxt.closePath();
    }

    intervalId = setInterval(() => {
      requestAnimationFrame(renderQR);
    }, speed);
  }

  wasm_bindgen("/assets/js/qr_state_bg.wasm").then(function() {
    const versionButton = document.querySelector('#version');
    let qrVersion = 1;
    versionButton.addEventListener('click', function() {
      const input = document.querySelector('#qr-ver');
      const range = document.querySelector('#qr-speed');
      const speed = parseInt(range.value);
      const dataInput = document.querySelector('#data');
      const val = dataInput.value;
      let bytes = [];
      for (let i = 0; i < val.length; i++) {
        bytes.push(val.charCodeAt(i));
      }

      qrVersion = parseInt(input.value) || 1;
      run(qrVersion, speed, bytes);
    });

    const pauseButton = document.querySelector('#pause');
    pauseButton.addEventListener('click', function() {
      clearInterval(intervalId);
    });
  });
});
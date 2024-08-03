const VSHADER_SOURCE = /*glsl*/`
attribute vec4 a_Position;
attribute float a_PointSize;

void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
}
`;

const FSHADER_SOURCE = /*glsl*/`
precision mediump float;
uniform vec4 u_FragColor;

void main() {
    gl_FragColor = u_FragColor;
}
`;

function main() {
  const canvas = document.getElementById('webgl');

  const gl = getWebGLContext(canvas);

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders');
    return;
  }

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');


  canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position, u_FragColor); };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);
}

const g_points = [];
const g_colors = [];

function click(ev, gl, canvas, a_Position, u_FragColor) {
  let x = ev.clientX;
  let y = ev.clientY;

  const rect = ev.target.getBoundingClientRect();

  const halfWidth = canvas.width / 2;
  const halfHeight = canvas.height / 2;

  x = ((x - rect.left) - halfWidth) / halfWidth;
  y = (halfHeight - (y - rect.top)) / halfHeight;
  const size = 10 * Math.random() + 5;

  g_points.push([x, y, size]);

  if (x >= 0.0 && y >= 0.0) {
    g_colors.push([1.0, 0.0, 0.0, 1.0]); // 第一象限红色
  } else if (x < 0.0 && y < 0.0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0]); // 第三象限绿色
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0]); // 其他白色
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  const len = g_points.length;

  for (let i = 0; i < len; i++) {
    const xy = g_points[i];
    var rgba = g_colors[i];

    gl.vertexAttrib2f(a_Position, xy[0], xy[1]);

    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    if (a_PointSize < 0) {
      console.log('Failed to get the storage location of a_PointSize');
      return;
    }

    gl.vertexAttrib1f(a_PointSize, xy[2]);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])

    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

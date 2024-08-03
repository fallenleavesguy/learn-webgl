const VSHADER_SOURCE = /*glsl*/`
attribute vec4 a_Position;
attribute float a_PointSize;

void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
}
`;

var FSHADER_SOURCE = /*glsl*/`
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function main() {
  var canvas = document.getElementById('webgl');

  var gl = getWebGLContext(canvas);

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders');
    return;
  }

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }


  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return;
  }

  canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position); };

  gl.vertexAttrib1f(a_PointSize, 10.0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);
}

const g_points = [];

function click(ev, gl, canvas, a_Position) {
  let x = ev.clientX;
  let y = ev.clientY;

  const rect = ev.target.getBoundingClientRect();

  const halfWidth = canvas.width / 2;
  const halfHeight = canvas.height / 2;

  x = ((x - rect.left) - halfWidth) / halfWidth;
  y = (halfHeight - (y - rect.top)) / halfHeight;

  g_points.push(x);
  g_points.push(y);

  gl.clear(gl.COLOR_BUFFER_BIT);

  const len = g_points.length;

  for (let i = 0; i < len; i += 2) {
    gl.vertexAttrib2f(a_Position, g_points[i], g_points[i + 1]);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

const VSHADER_SOURCE = /*glsl*/`
attribute vec4 a_Position;
attribute float a_PointSize;

void main() {
    gl_Position = a_Position;
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

  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  const n = initVertextBuffers(gl);

  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);


  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function initVertextBuffers(gl) {
  const vertices = new Float32Array([
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    0.5, -0.5
  ]);

  var n = 4;

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  return n;
}
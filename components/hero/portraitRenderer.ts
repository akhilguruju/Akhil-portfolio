/**
 * WebGL renderer for the hero portrait.
 *
 * `res` (0–1) is the resolution on a log scale: 0 is ~8 blocks across, 1 is
 * native. `tint` blends the photo toward the ink→rim duotone. The lens is a
 * circular "debug view" under the pointer: 1-bit ordered dither on a visible
 * pixel grid, ringed in rim teal.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
precision highp float;

uniform sampler2D uTex;
uniform vec2 uSize;
uniform float uBlock;
uniform float uTint;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uLensBlock;
uniform vec3 uInk;
uniform vec3 uRim;
uniform vec3 uPaper;

varying vec2 vUv;

float bayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }

vec4 sampleBlock(vec2 px, float b) {
  vec2 uv = b > 1.0 ? (floor(px / b) + 0.5) * b / uSize : px / uSize;
  return texture2D(uTex, uv);
}

void main() {
  vec2 px = vUv * uSize;
  float d = distance(px, uMouse);
  float inside = step(0.5, uRadius) * (1.0 - step(uRadius, d));

  float b = inside > 0.5 ? max(uBlock, uLensBlock) : uBlock;
  vec4 c = sampleBlock(px, b);
  float a = c.a;
  vec3 rgb = a > 0.001 ? c.rgb / a : vec3(0.0);
  float l = dot(rgb, vec3(0.299, 0.587, 0.114));

  vec3 duo = mix(uInk, uRim, smoothstep(0.02, 0.5, l));
  duo = mix(duo, uPaper, smoothstep(0.55, 0.95, l));
  rgb = mix(rgb, duo, uTint);

  if (inside > 0.5) {
    float on = step(bayer4(floor(px / b)), l * 1.3 + 0.04);
    rgb = mix(uInk, uRim, on);
    vec2 g = fract(px / b) * b;
    float grid = 1.0 - step(1.0, min(g.x, g.y));
    rgb = mix(rgb, uRim * 0.55, grid * a);
    if (a < 0.02) rgb = uRim;
    a = max(a, grid * 0.28);
  }

  float ring = step(0.5, uRadius) * (1.0 - smoothstep(0.6, 1.8, abs(d - uRadius)));
  rgb = mix(rgb, uRim, ring);
  a = max(a, ring);

  gl_FragColor = vec4(rgb * a, a);
}`

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number]

export interface PortraitState {
  res: number
  tint: number
  lens: number
  mx: number
  my: number
}

export interface Portrait {
  state: PortraitState
  resize: () => void
  render: () => void
  /** Blocks across at the current resolution, or null when native */
  columns: () => number | null
  destroy: () => void
}

const LENS_RADIUS = 92
const LENS_COLUMNS = 72
const MIN_COLUMNS = 8

export function createPortrait(canvas: HTMLCanvasElement, image: HTMLImageElement): Portrait | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader')
    return s
  }

  let program: WebGLProgram
  try {
    program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link')
  } catch {
    return null
  }
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(program, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const u = (name: string) => gl.getUniformLocation(program, name)
  const uni = {
    size: u('uSize'),
    block: u('uBlock'),
    tint: u('uTint'),
    mouse: u('uMouse'),
    radius: u('uRadius'),
    lensBlock: u('uLensBlock'),
  }
  gl.uniform1i(u('uTex'), 0)
  gl.uniform3fv(u('uInk'), hex('#0b0c0c'))
  gl.uniform3fv(u('uRim'), hex('#45cdbd'))
  gl.uniform3fv(u('uPaper'), hex('#e3e5e0'))

  const state: PortraitState = { res: 1, tint: 0, lens: 0, mx: -9999, my: -9999 }
  let width = 1
  let height = 1
  let dpr = 1
  let last = ''

  const columns = () => {
    if (state.res >= 0.999) return null
    return MIN_COLUMNS * Math.pow(width / MIN_COLUMNS, Math.max(0, state.res))
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = Math.max(1, Math.round(rect.width * dpr))
    height = Math.max(1, Math.round(rect.height * dpr))
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)
    last = ''
  }

  const render = () => {
    const cols = columns()
    const block = cols === null ? 1 : width / cols
    const radius = LENS_RADIUS * dpr * state.lens
    const mx = state.mx * dpr
    const my = height - state.my * dpr
    const key = `${block.toFixed(2)}|${state.tint.toFixed(3)}|${radius.toFixed(1)}|${mx.toFixed(1)}|${my.toFixed(1)}|${width}x${height}`
    if (key === last) return
    last = key

    gl.uniform2f(uni.size, width, height)
    gl.uniform1f(uni.block, block)
    gl.uniform1f(uni.tint, state.tint)
    gl.uniform2f(uni.mouse, mx, my)
    gl.uniform1f(uni.radius, radius)
    gl.uniform1f(uni.lensBlock, width / LENS_COLUMNS)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  const destroy = () => {
    gl.deleteTexture(texture)
    gl.deleteBuffer(buffer)
    gl.deleteProgram(program)
  }

  return { state, resize, render, columns, destroy }
}

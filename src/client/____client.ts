import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

// Set up the scene, camera, and renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Create a sphere to apply the glow effect to
const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

// Create a render target for the glow effect
const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)

// Create a custom shader for the glow effect
const glowShader = {
    uniforms: {
        tDiffuse: { value: null },
        glowColor: { value: new THREE.Color(0xff5555) },
    },
    vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
    fragmentShader: `
  uniform sampler2D tDiffuse;
  uniform vec3 glowColor;
  varying vec2 vUv;

  void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec3 glow = glowColor * pow(texel.rgb, vec3(2.0));
    gl_FragColor = vec4(glow, texel.a);
  }`,
}

// Create a shader material with the glow shader
const glowMaterial = new THREE.ShaderMaterial({
    uniforms: glowShader.uniforms,
    vertexShader: glowShader.vertexShader,
    fragmentShader: glowShader.fragmentShader,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
})

// Create a glow mesh with the sphere's geometry and the glow material
const glowMesh = new THREE.Mesh(geometry, glowMaterial)
sphere.add(glowMesh)

// Set up the post-processing pass for the glow effect
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)
const glowPass = new ShaderPass(glowMaterial)
glowPass.uniforms.glowColor.value = new THREE.Color(0xffffff)
glowPass.renderToScreen = true
composer.addPass(glowPass)

// Animate the sphere
function animate() {
    requestAnimationFrame(animate)
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01
    composer.render()
}
animate()

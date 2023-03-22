import * as THREE from 'three'

// Create the scene, camera, renderer, and lights
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

var ambientLight = new THREE.AmbientLight(0x404040)
scene.add(ambientLight)

var directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(-1, 2, 4)
scene.add(directionalLight)

// Create the floor plane
var floorTexture = new THREE.TextureLoader().load('path/to/floor/texture.jpg')
var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture })
var floorGeometry = new THREE.PlaneGeometry(10, 10)
var floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

// Create the LED strip
var ledGeometry = new THREE.BufferGeometry()

// Create an array to hold the vertices and colors of each LED
var vertices = []
var colors = []

// Create a series of rectangular shapes and stack them up
for (var i = 0; i < 10; i++) {
    var x = i - 5
    var y = 0
    var z = 0
    var width = 0.2
    var height = 0.05
    var depth = 0.05

    // Add vertices for each corner of the rectangle
    vertices.push(
        x,
        y,
        z,
        x + width,
        y,
        z,
        x + width,
        y + height,
        z,
        x,
        y + height,
        z,
        x,
        y + height,
        z + depth,
        x + width,
        y + height,
        z + depth,
        x + width,
        y,
        z + depth,
        x,
        y,
        z + depth
    )

    // Add colors for each vertex (use different colors for each LED)
    var color = new THREE.Color().setHSL(i / 10, 1, 0.5)
    for (var j = 0; j < 8; j++) {
        colors.push(color.r, color.g, color.b)
    }
}

// Set the vertex colors for the LED strip geometry
ledGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
ledGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

// Create the LED strip material
var ledMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition: { value: directionalLight.position },
        lightColor: { value: directionalLight.color },
        ambientColor: { value: ambientLight.color },
    },
    //   vertexShader: `
    //   varying vec3 vColor;

    //   void main() {
    //     vColor = color;
    //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //   }
    // `,
    //   fragmentShader: `
    //   uniform vec3 lightPosition;
    //   uniform vec3 lightColor;
    //   uniform vec3 ambientColor;

    //   varying vec3 vColor;

    //   void main() {
    //     vec3 color = vColor * (lightColor * max(dot(normalize(normalMatrix * vec3(0, 0, 1)), normalize(lightPosition - vec3(modelMatrix * vec4(position, 1.0)))), 0.0) + ambientColor);
    //     gl_FragColor = vec4(color, 1.0);
    //   }
    //     `,
})

// Add the LED strip to the scene
var ledStrip = new THREE.Mesh(ledGeometry, ledMaterial)
ledStrip.position.set(0, 0.05, 0)
scene.add(ledStrip)

// Animate the LED strip
var time = 0
var timer = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)

    // Update the color of each LED based on the current time
    for (var i = 0; i < colors.length; i += 3) {
        var color = new THREE.Color().setHSL((i / 3 + time) % 1, 1, 0.5)
        colors[i] = color.r
        colors[i + 1] = color.g
        colors[i + 2] = color.b
    }
    ledGeometry.getAttribute('color').needsUpdate = true

    // Update the time and render the scene
    time += timer.getDelta()
    renderer.render(scene, camera)
}

animate()

import * as THREE from 'three'
import { BoxGeometry, Color, CylinderGeometry, Mesh, RingGeometry, TubeGeometry } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { getRandomHexColor, resizeRendererToDisplaySize } from './utils'

function generateRgbLedStrip(x: number, y: number, length: number, spacing: number, color: number) {
    // Create a new group to hold the cubes
    const ledStrip = new THREE.Group()

    // Calculate the total length of the LED strip
    const totalLength = (x - 1) * spacing + x * length

    // Create a loop to generate the cubes
    for (let i = 0; i < x; i++) {
        // Calculate the position of the current cube
        const posX = i * (length + spacing)
        const posY = 0
        const posZ = 0

        // Create a new cube with the specified dimensions and position
        const cubeGeometry = new THREE.BoxGeometry(length, y, y)
        const cubeMaterial = new THREE.MeshBasicMaterial({ color })
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

        // cube.castShadow = true
        // cube.receiveShadow = true
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
        // cube.add(ambientLight)
        cube.position.set(posX, posY, posZ)
        // Add the cube to the LED strip group
        ledStrip.add(cube)
    }

    // Position the LED strip group so that it's centered on the origin
    ledStrip.position.x = -totalLength / 2

    // Return the LED strip group
    return ledStrip
}

function main() {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    document.body.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 2
    camera.position.set(-0.09156989822285803, 4.298980723302594, 17.634938238807294)
    // @ts-ignore
    window.camera = camera
    const controls = new OrbitControls(camera, renderer.domElement)

    const scene = new THREE.Scene()
    const geometry = new THREE.BoxGeometry(1, 1, 1)

    const material = new THREE.MeshPhongMaterial({
        color: 'pink',
    })

    let objects: THREE.Mesh<any, THREE.MeshPhongMaterial>[] = []

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(10, 10, 10)
    light.castShadow = true
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048

    // function makeInstance(geometry: any, color: Color, x: number) {
    //     const material = new THREE.MeshPhongMaterial({ color })

    //     const g = new THREE.Mesh(geometry, material)
    //     scene.add(g)

    //     g.position.x = x

    //     objects.push(g)

    //     return g
    // }

    // makeInstance(new BoxGeometry(1, 1, 1), new Color(0xff000), -0.3)
    // makeInstance(new CylinderGeometry(0.5, 0.2, 0.3), new Color(0xff0ff0), 1)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    const mesh = generateRgbLedStrip(10, 1, 1, 0.5, 0xff0000)
    scene.add(mesh)

    const auraMaterial = new THREE.ShaderMaterial({
        uniforms: {
            auraColor: { value: new THREE.Color(0x0088ff) },
        },
        vertexShader: `
        uniform vec3 auraColor;
        varying vec3 vNormal;
    
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position.z += 0.01; // push the vertex forward
        }
      `,
        fragmentShader: `
        uniform vec3 auraColor;
        varying vec3 vNormal;
    
        void main() {
          float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
          gl_FragColor = vec4(auraColor * intensity, 1.0);
        }
      `,
    })

    for (let i = 0; i < mesh.children.length; i++) {
        // @ts-ignore
        const m = (mesh.children[i].material.color = new Color(
            Math.random(),
            Math.random(),
            Math.random()
        ))
    }

    // {
    //     let light = new THREE.DirectionalLight('white', 0.3)

    //     light.position.set(-1, 2, 4)
    //     const helper = new THREE.DirectionalLightHelper(light, 5)
    //     scene.add(helper)
    //     scene.add(light)
    // }

    // {
    //     const light = new THREE.DirectionalLight('white', 0.5)

    //     light.position.set(10, 1, -4)
    //     const helper = new THREE.DirectionalLightHelper(light, 5)
    //     scene.add(helper)
    //     scene.add(light)
    // }

    renderer.domElement.addEventListener('pointermove', onPointerMove)

    function onPointerMove(event: any) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        const pointer = { x: 0, y: 0 }
        pointer.x = (event.layerX / window.innerWidth) * 2 - 1
        pointer.y = -(event.layerY / window.innerHeight) * 2 + 1
    }

    function render(time: number) {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        time *= 0.003 // convert time to seconds

        for (let o of objects) {
            o.rotation.x = time
            o.rotation.y = time / 1.2
        }

        renderer.render(scene, camera)

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)

    setInterval(() => {
        material.color = new Color(Math.random() * 16 ** 6)
    }, 1000)
}

main()

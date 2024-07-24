import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

import './style.css'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

//Floor
const floorAlphaTexture = textureLoader.load('../static/floor/alpha.jpg')
const floorColorTexture = textureLoader.load('../static/floor/ground/color.jpg')
const floorARMTexture = textureLoader.load('../static/floor/ground/arm.jpg')
const floorNormalTexture = textureLoader.load('../static/floor/ground/normal.jpg')
const floorDisplacementTexture = textureLoader.load('../static/floor/ground/disp.jpg')


floorColorTexture.repeat.set(8, 8)
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping

floorARMTexture.repeat.set(8, 8)
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping

floorNormalTexture.repeat.set(8, 8)
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorDisplacementTexture.repeat.set(8, 8)
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping


// Wall
const wallARMTexture = textureLoader.load('../static/floor/wall/arm.jpg')
const wallColorTexture = textureLoader.load('../static/floor/wall/color.jpg')
const wallNormalTexture = textureLoader.load('../static/floor/wall/normal.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

//roof
const roofARMTexture = textureLoader.load('../static/floor/roof/arm.jpg')
const roofColorTexture = textureLoader.load('../static/floor/roof/color.jpg')
const roofNormalTexture = textureLoader.load('../static/floor/roof/normal.jpg')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 2);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;
roofARMTexture.repeat.set(3, 2);
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.repeat.set(3, 2);
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;

//bushes
const bushColorTexture = textureLoader.load('../static/floor/leaves/color.jpg')
const bushARMTexture = textureLoader.load('../static/floor/leaves/arm.jpg')
const bushNormalTexture = textureLoader.load('../static/floor/leaves/normal.jpg')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 2)
bushColorTexture.wrapS = THREE.RepeatWrapping
bushColorTexture.wrapT = THREE.RepeatWrapping

bushARMTexture.repeat.set(2, 2)
bushARMTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapT = THREE.RepeatWrapping

bushNormalTexture.repeat.set(2, 2)
bushNormalTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapT = THREE.RepeatWrapping

//graves
const graveColorTexture = textureLoader.load('../static/floor/graves/color.jpg')
const graveARMTexture = textureLoader.load('../static/floor/graves/arm.jpg')
const graveNormalTexture = textureLoader.load('../static/floor/graves/normal.jpg')


graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveColorTexture.wrapS = THREE.RepeatWrapping
graveColorTexture.wrapT = THREE.RepeatWrapping

graveARMTexture.repeat.set(0.3, 0.4)
graveARMTexture.wrapS = THREE.RepeatWrapping
graveARMTexture.wrapT = THREE.RepeatWrapping

graveNormalTexture.repeat.set(0.3, 0.4)
graveNormalTexture.wrapS = THREE.RepeatWrapping
graveNormalTexture.wrapT = THREE.RepeatWrapping

//Door
const doorColorTexture = textureLoader.load('../static/door/color.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('../static/door/ambientOcclusion.jpg')
const doorNormalTexture = textureLoader.load('../static/door/normal.jpg')
const doorARMTexture = textureLoader.load('../static/door/arm.jpg')
const doorHeightTexture = textureLoader.load('../static/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('../static/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('../static/door/roughness.jpg')



doorColorTexture.colorSpace = THREE.SRGBColorSpace


/**
 * House
 */
//House container
const house = new THREE.Group()
scene.add(house)

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial(
        {
            map: wallColorTexture,
            aoMap: wallARMTexture,
            roughnessMap: wallARMTexture,
            metalnessMap: wallARMTexture,
            normalMap: wallNormalTexture,
        }
    )
)
walls.position.y = 1.25
house.add(walls)


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial(
        { 
            alphaMap: floorAlphaTexture,
            transparent: true,
            map: floorColorTexture,
            displacementMap: floorDisplacementTexture,
            displacementScale: 0.3,
            displacementBias: -0.2,
            normalMap: floorNormalTexture,
            aoMap: floorARMTexture,
            roughnessMap: floorARMTexture,
            metalnessMap: floorARMTexture
            
            
        }
    )
)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

//gui add for displacement
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')

//Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial(
        {
            map: roofColorTexture,
            aoMap: roofARMTexture,
            roughnessMap: roofARMTexture,
            metalnessMap: roofARMTexture,
            normalMap: roofNormalTexture,
        }
    )
    )
    roof.position.y = 2.5 + 0.75
    roof.rotation.y = Math.PI * 0.25
    house.add(roof)

//Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial(
        {
            map: doorColorTexture,
            aoMap: doorAmbientOcclusionTexture,
            displacementMap: doorHeightTexture,
            displacementScale: 0.15,
            //displacementBias: -0.04,
            roughnessMap: doorRoughnessTexture,
            metalnessMap: doorMetalnessTexture,
            normalMap: doorNormalTexture,
            
        }
    )
      
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

//bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial(
    {
        color: '#ccffcc',
        map: bushColorTexture,
        aoMap: bushARMTexture,
        roughnessMap: bushARMTexture,
        metalnessMap: bushARMTexture,
        normalMap: bushNormalTexture
        
    }
)

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.9, 0.2, 2.5)
bush1.rotation.x = -0.75
house.add(bush1)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75
house.add(bush2)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75
house.add(bush3)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -0.75
house.add(bush4)

// Graves

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial(
    {
        color: '#000000',
        map: graveColorTexture,
        aoMap: graveARMTexture,
        roughnessMap: graveARMTexture,
        metalnessMap: graveARMTexture,
        normalMap: graveNormalTexture
        
    }
)

const graves = new THREE.Group()
scene.add(graves)

for(let i = 0; i < 30; i++)
{
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    //Mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z

    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

//Door light
const doorLight = new THREE.PointLight('#ff7d46', 0.5)
doorLight.position.set(0, 2.2, 2.4)
scene.add(doorLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
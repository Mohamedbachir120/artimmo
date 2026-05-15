import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import Button from '../common/Button'

const ThreeViewer = ({ isFullscreen = false, onClose }) => {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)
  const [dayMode, setDayMode] = useState(true)
  const [material, setMaterial] = useState('wood')

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(8, 6, 8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, dayMode ? 0.6 : 0.2)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(dayMode ? 0xfff5e6 : 0x4a6fa5, dayMode ? 1 : 0.5)
    dirLight.position.set(10, 15, 10)
    scene.add(dirLight)

    // Floor
    const floorMaterials = {
      wood: new THREE.MeshStandardMaterial({ color: 0x8B5A2B }),
      marble: new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.2 }),
      tile: new THREE.MeshStandardMaterial({ color: 0x808080 })
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), floorMaterials[material])
    floor.rotation.x = -Math.PI / 2
    scene.add(floor)

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: dayMode ? 0xfafafa : 0x2a3a4a })
    const walls = [
      { geometry: [0.2, 3, 12], position: [-6, 1.5, 0] },
      { geometry: [0.2, 3, 12], position: [6, 1.5, 0] },
      { geometry: [12, 3, 0.2], position: [0, 1.5, -6] }
    ]
    walls.forEach(w => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(...w.geometry), wallMat)
      wall.position.set(...w.position)
      scene.add(wall)
    })

    // Furniture
    const sofa = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.8, 1),
      new THREE.MeshStandardMaterial({ color: 0x26405B })
    )
    sofa.position.set(-2, 0.4, 2)
    scene.add(sofa)

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.4, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x4a3728 })
    )
    table.position.set(-2, 0.2, 0)
    scene.add(table)

    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.5, 2.5),
      new THREE.MeshStandardMaterial({ color: 0xBACBC1 })
    )
    bed.position.set(3, 0.25, 3)
    scene.add(bed)

    // Animation
    let angle = 0
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      angle += 0.003
      camera.position.x = Math.cos(angle) * 10
      camera.position.z = Math.sin(angle) * 10
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [dayMode, material])

  const content = (
    <div 
      ref={containerRef} 
      className={`w-full ${isFullscreen ? 'h-screen' : 'h-[500px]'} relative`}
      role="img"
      aria-label="Visite virtuelle 3D d'un appartement"
    >
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setDayMode(!dayMode)}
        >
          {dayMode ? 'Mode Jour' : 'Mode Nuit'}
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        {['wood', 'marble', 'tile'].map(mat => (
          <Button
            key={mat}
            variant={material === mat ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setMaterial(mat)}
          >
            {mat === 'wood' ? 'Bois' : mat === 'marble' ? 'Marbre' : 'Carrelage'}
          </Button>
        ))}
      </div>

      {isFullscreen && (
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 glass-strong p-3 rounded-full text-white hover:bg-brand-primary transition-all"
          aria-label="Fermer la visite 3D"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )

  if (isFullscreen) {
    return (
      <AnimatePresence>
        <motion.div 
          className="fixed inset-0 z-[100] bg-brand-dark" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    )
  }

  return content
}

export default ThreeViewer
"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useThemeStore } from "@/lib/store"

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useThemeStore()
  const [resetTrigger, setResetTrigger] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    // ----- SETUP: Scene, Camera, Renderer -----
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(0, 50, 100)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    scene.background = new THREE.Color(theme === "dark" ? 0x000000 : 0xffffff)

    // ----- CURSOR INTERACTIVITY -----
    let targetX = 0
    let targetY = 0
    function onMouseMove(event: MouseEvent) {
      targetX = (event.clientX / window.innerWidth) * 2 - 1
      targetY = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    // ----- CREATE THE "INFINITE" WAVE SURFACE -----
    const planeWidth = 2000
    const planeHeight = 10000
    const segmentsW = 200
    const segmentsH = 200
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsW, segmentsH)
    geometry.rotateX(-Math.PI / 2)
    const material = new THREE.MeshBasicMaterial({
      color: theme === "dark" ? 0x00ff00 : 0x0000ff,
      wireframe: true,
    })
    const plane = new THREE.Mesh(geometry, material)
    plane.position.z = -planeHeight / 2
    scene.add(plane)

    const originalPositions = geometry.attributes.position.array.slice(0)

    // ----- ANIMATION PARAMETERS -----
    let cameraForward = 0
    const forwardSpeed = 2
    let time = 0
    const frequency = 0.05
    const baseAmplitude = 5
    const amplitudeFactor = 2
    const maxAngle = Math.PI / 16

    // ----- ANIMATION LOOP -----
    function animate() {
      requestAnimationFrame(animate)
      time += 0.02

      cameraForward += forwardSpeed
      camera.position.z -= forwardSpeed

      const targetCamX = targetX * 0
      const targetCamY = targetY * 5 + 50
      camera.position.x += (targetCamX - camera.position.x) * 0.05
      camera.position.y += (targetCamY - camera.position.y) * 0.05

      camera.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z - 100))

      const angle = targetX * maxAngle
      const amplitude = baseAmplitude + amplitudeFactor * targetY

      const scrollOffset = cameraForward

      const positions = geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        const baseX = originalPositions[i]
        const baseZ = originalPositions[i + 2]
        const rotated = baseX * Math.cos(angle) + (baseZ + scrollOffset) * Math.sin(angle)
        const displacement = Math.sin(rotated * frequency) * amplitude
        positions[i + 1] = displacement
      }
      geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    // ----- RESIZE HANDLING -----
    function onResize() {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener("resize", onResize)

    // ----- RESET ANIMATION -----
    const resetInterval = setInterval(() => {
      cameraForward = 0
      camera.position.set(0, 50, 100)
      camera.lookAt(0, 0, 0)
      setResetTrigger((prev) => prev + 1)
    }, 40000) // Reset every 40 seconds

    // ----- CLEANUP -----
    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)
      clearInterval(resetInterval)
      containerRef.current?.removeChild(renderer.domElement)
      scene.clear()
      renderer.dispose()
    }
  }, [theme])

  return <div ref={containerRef} className="absolute inset-0" />
}


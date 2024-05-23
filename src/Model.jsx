import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei/native'

export function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/avatarNew.glb')
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" position={[0, -0.064, 0.959]} rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={nodes.Hips} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/avatarNew.glb')

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ZoomIn, ZoomOut, RotateCcw, Move, Sparkles } from 'lucide-react';

interface Embedded3DCanvasProps {
  categoryName: string;
  materialName: string;
  materialColorHex: string;
  roughness?: number;
  metalness?: number;
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  accentIds: string[];
  finishId: string;
  hasDrawers?: boolean;
  drawerCount?: number;
  hasCarvedLegs?: boolean;
  hasBrassPillars?: boolean;
  hasMarbleTop?: boolean;
  marbleColor?: 'white' | 'black';
  hasBottomShelf?: boolean;
  hasGlassTop?: boolean;
  hasBrassInlays?: boolean;
  hasApronCarving?: boolean;
  aiPromptText?: string;
}

export const Embedded3DCanvas: React.FC<Embedded3DCanvasProps> = ({
  categoryName,
  materialName,
  materialColorHex,
  roughness = 0.4,
  metalness = 0.1,
  lengthFt,
  widthFt,
  heightFt,
  accentIds,
  finishId,
  hasDrawers = false,
  drawerCount = 2,
  hasCarvedLegs = false,
  hasBrassPillars = false,
  hasMarbleTop = false,
  marbleColor = 'white',
  hasBottomShelf = false,
  hasGlassTop = false,
  hasBrassInlays = false,
  hasApronCarving = false,
  aiPromptText = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const accentMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Mouse Orbit Drag State
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x120b08);

    // Camera with comfortable initial perspective
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Bright Warm Studio Lighting Setup (Prevents Pitch Black or Blue Glare)
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff0dd, 2.2);
    mainLight.position.set(6, 8, 6);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xe0ecff, 1.2);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe4cc, 1.4);
    rimLight.position.set(0, 5, -8);
    scene.add(rimLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0xea580c, 0x2a1e17);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    // Build Mesh Group
    const group = new THREE.Group();
    meshGroupRef.current = group;

    const buildModel = () => {
      group.clear();

      const catLower = categoryName.toLowerCase();
      const promptLower = (aiPromptText || '').toLowerCase();

      // -------------------------------------------------------------
      // 1. FRAME / WOOD TIMBER PBR MATERIAL
      // -------------------------------------------------------------
      let frameColor = new THREE.Color(materialColorHex || '#9C562B');
      let frameRoughness = finishId === 'fin-pu-gloss' ? 0.15 : (roughness ?? 0.4);
      let frameMetalness = metalness ?? 0.1;

      if (promptLower.includes('sheesham') || promptLower.includes('rosewood')) {
        frameColor = new THREE.Color('#5c2518'); // Deep Rosewood
      } else if (promptLower.includes('teak') || promptLower.includes('sagwan')) {
        frameColor = new THREE.Color('#9c562b'); // Golden Teak
      } else if (promptLower.includes('oak')) {
        frameColor = new THREE.Color('#c29b63'); // Pale Oak
      } else if (promptLower.includes('walnut') || promptLower.includes('dark beeswax')) {
        frameColor = new THREE.Color('#4a2e1b'); // Rich Dark Walnut
      } else if (promptLower.includes('mango') || promptLower.includes('rubberwood')) {
        frameColor = new THREE.Color('#c49a45'); // Eco Mango Wood
      } else if (promptLower.includes('metal frame') || promptLower.includes('wrought iron') || promptLower.includes('steel')) {
        frameColor = new THREE.Color('#34373a'); // Dark Industrial Steel
        frameMetalness = 0.85;
        frameRoughness = 0.3;
      }

      const baseMat = new THREE.MeshStandardMaterial({
        color: frameColor,
        roughness: frameRoughness,
        metalness: frameMetalness,
      });
      materialRef.current = baseMat;

      // -------------------------------------------------------------
      // 2. UPHOLSTERY / CUSHION / MARBLE / GLASS / FABRIC PBR MATERIAL
      // -------------------------------------------------------------
      let uphColor = new THREE.Color('#d9c5b2'); // Warm Ivory default
      let uphRoughness = 0.7;
      let uphMetalness = 0.05;

      if (promptLower.includes('genuine leather') || promptLower.includes('leather')) {
        uphColor = new THREE.Color('#7c3f1d'); // Rich Cognac Saddle Leather
        uphRoughness = 0.35;
      } else if (promptLower.includes('faux/pu') || promptLower.includes('faux leather')) {
        uphColor = new THREE.Color('#3e2518'); // Dark Espresso PU Leather
        uphRoughness = 0.3;
      } else if (promptLower.includes('velvet')) {
        uphColor = new THREE.Color('#1b4d3e'); // Royal Emerald Green Velvet
        uphRoughness = 0.8;
      } else if (promptLower.includes('suede')) {
        uphColor = new THREE.Color('#8c684d'); // Warm Tan Suede
        uphRoughness = 0.9;
      } else if (promptLower.includes('linen') || promptLower.includes('cotton')) {
        uphColor = new THREE.Color('#d8c8b8'); // Soft Linen
        uphRoughness = 0.85;
      } else if (promptLower.includes('wool') || promptLower.includes('chenille')) {
        uphColor = new THREE.Color('#8c7e6c'); // Warm Woven Wool
        uphRoughness = 0.9;
      } else if (promptLower.includes('mesh')) {
        uphColor = new THREE.Color('#34373a'); // Charcoal Mesh
        uphRoughness = 0.6;
      } else if (promptLower.includes('marble') || promptLower.includes('makrana')) {
        uphColor = promptLower.includes('black marble') ? new THREE.Color('#1e1e24') : new THREE.Color('#f4f3ef');
        uphRoughness = 0.08;
        uphMetalness = 0.05;
      } else if (promptLower.includes('cane') || promptLower.includes('rattan')) {
        uphColor = new THREE.Color('#e3c08d'); // Natural Cane
        uphRoughness = 0.75;
      }

      const upholsteryMat = new THREE.MeshStandardMaterial({
        color: uphColor,
        roughness: uphRoughness,
        metalness: uphMetalness,
      });

      // -------------------------------------------------------------
      // 3. HARDWARE & FEET ACCENT PBR MATERIAL
      // -------------------------------------------------------------
      let hwColor = new THREE.Color('#d4af37'); // Solid Brass Gold default
      let hwRoughness = 0.15;
      let hwMetalness = 0.92;

      if (promptLower.includes('chrome') || promptLower.includes('stainless steel feet') || promptLower.includes('metal feet') || promptLower.includes('aluminium')) {
        hwColor = new THREE.Color('#d0d4d9'); // Chrome Silver
        hwRoughness = 0.1;
        hwMetalness = 0.95;
      } else if (promptLower.includes('solid wood legs')) {
        hwColor = frameColor.clone();
        hwRoughness = 0.4;
        hwMetalness = 0.1;
      }

      const accentMat = new THREE.MeshStandardMaterial({
        color: hwColor,
        roughness: hwRoughness,
        metalness: hwMetalness,
      });
      accentMaterialRef.current = accentMat;

      // Translucent Beveled Glass Surface Material
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.92,
        opacity: 0.65,
        transparent: true,
        roughness: 0.05,
        metalness: 0.1,
        ior: 1.5,
        thickness: 0.1,
        reflectivity: 0.95
      });

      // -------------------------------------------------------------
      let surfaceMat: THREE.Material;
      if (promptLower.includes('mirror')) {
        surfaceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.0, metalness: 1.0 });
      } else if (promptLower.includes('glass') || hasGlassTop) {
        surfaceMat = glassMat;
      } else if (promptLower.includes('acrylic') || promptLower.includes('gloss') || promptLower.includes('duco') || finishId === 'fin-pu-gloss') {
        surfaceMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(materialColorHex || '#ffffff'),
          roughness: 0.05, metalness: 0.1
        });
      } else {
        surfaceMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(materialColorHex || '#8B4513'),
          roughness: roughness ?? 0.4,
          metalness: metalness ?? 0.1
        });
      }

      if (catLower.includes('mandir') || catLower.includes('temple')) {
        // --- 13. HOME TEMPLE (MANDIR) ---
        const baseGeo = new THREE.BoxGeometry(2.2, 0.4, 1.4);
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = -0.7;
        baseMesh.castShadow = true;
        group.add(baseMesh);

        const backGeo = new THREE.BoxGeometry(2.0, 1.8, 0.1);
        const backMesh = new THREE.Mesh(backGeo, baseMat);
        backMesh.position.set(0, 0.4, -0.6);
        group.add(backMesh);

        const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16);
        const p1 = new THREE.Mesh(pillarGeo, accentMat);
        p1.position.set(-0.9, 0.4, 0.5);
        const p2 = new THREE.Mesh(pillarGeo, accentMat);
        p2.position.set(0.9, 0.4, 0.5);
        group.add(p1, p2);

        const domeGeo = new THREE.ConeGeometry(0.7, 0.9, 16);
        const domeMesh = new THREE.Mesh(domeGeo, baseMat);
        domeMesh.position.y = 1.6;
        group.add(domeMesh);

        const kalashGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const kalashMesh = new THREE.Mesh(kalashGeo, accentMat);
        kalashMesh.position.y = 2.15;
        group.add(kalashMesh);

        if (hasDrawers) {
          const dGeo = new THREE.BoxGeometry(0.95, 0.25, 1.2);
          const d1 = new THREE.Mesh(dGeo, baseMat);
          d1.position.set(-0.5, -0.7, 0.1);
          const d2 = new THREE.Mesh(dGeo, baseMat);
          d2.position.set(0.5, -0.7, 0.1);
          group.add(d1, d2);

          const handleGeo = new THREE.SphereGeometry(0.04, 8, 8);
          const h1 = new THREE.Mesh(handleGeo, accentMat);
          h1.position.set(-0.5, -0.7, 0.72);
          const h2 = new THREE.Mesh(handleGeo, accentMat);
          h2.position.set(0.5, -0.7, 0.72);
          group.add(h1, h2);
        }

      } else if (catLower.includes('sofa')) {
        // --- 1. SOFA (MULTI-MATERIAL REALISTIC RENDERING) ---
        const seatGeo = new THREE.BoxGeometry(2.4, 0.3, 1.4);
        const seatMesh = new THREE.Mesh(seatGeo, baseMat);
        seatMesh.position.y = -0.3;
        group.add(seatMesh);

        // Upholstery Cushion (Leather, Velvet, Linen, Cotton, Suede)
        const cushionGeo = new THREE.BoxGeometry(2.3, 0.25, 1.3);
        const cushionMesh = new THREE.Mesh(cushionGeo, upholsteryMat);
        cushionMesh.position.y = -0.05;
        cushionMesh.castShadow = true;
        group.add(cushionMesh);

        const backGeo = new THREE.BoxGeometry(2.4, 1.1, 0.3);
        const backMesh = new THREE.Mesh(backGeo, upholsteryMat);
        backMesh.position.set(0, 0.5, -0.55);
        backMesh.castShadow = true;
        group.add(backMesh);

        const armGeo = new THREE.BoxGeometry(0.3, 0.7, 1.4);
        const arm1 = new THREE.Mesh(armGeo, upholsteryMat);
        arm1.position.set(-1.25, 0.15, 0);
        const arm2 = new THREE.Mesh(armGeo, upholsteryMat);
        arm2.position.set(1.25, 0.15, 0);
        group.add(arm1, arm2);

        // Sofa Legs (Wood, Brass, Chrome Metal Feet)
        const legGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.3, 12);
        [[-1.1, -0.6, -0.55], [1.1, -0.6, -0.55], [-1.1, -0.6, 0.55], [1.1, -0.6, 0.55]].forEach(pos => {
          const leg = new THREE.Mesh(legGeo, accentMat);
          leg.position.set(pos[0], pos[1], pos[2]);
          leg.castShadow = true;
          group.add(leg);
        });

      } else if (catLower.includes('study')) {
        // --- 3. STUDY TABLE ---
        const topGeo = new THREE.BoxGeometry(2.5, 0.12, 1.3);
        const topMesh = new THREE.Mesh(topGeo, baseMat);
        topMesh.position.y = 0.4;
        group.add(topMesh);

        const pedGeo = new THREE.BoxGeometry(0.7, 0.8, 1.1);
        const pedMesh = new THREE.Mesh(pedGeo, baseMat);
        pedMesh.position.set(-0.8, -0.1, 0);
        group.add(pedMesh);

        const knobGeo = new THREE.SphereGeometry(0.035, 12, 12);
        [0.1, -0.1, -0.3].forEach(y => {
          const knob = new THREE.Mesh(knobGeo, accentMat);
          knob.position.set(-0.8, y, 0.56);
          group.add(knob);
        });

        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 12);
        const l1 = new THREE.Mesh(legGeo, accentMat);
        l1.position.set(0.9, -0.05, -0.5);
        const l2 = new THREE.Mesh(legGeo, accentMat);
        l2.position.set(0.9, -0.05, 0.5);
        group.add(l1, l2);

      } else if (catLower.includes('bed') && !catLower.includes('side')) {
        // --- 4. BED ---
        const platformGeo = new THREE.BoxGeometry(2.6, 0.35, 2.4);
        const platformMesh = new THREE.Mesh(platformGeo, baseMat);
        platformMesh.position.y = -0.4;
        group.add(platformMesh);

        const matMat = new THREE.MeshStandardMaterial({ color: 0xf5f0eb, roughness: 0.8 });
        const mattressGeo = new THREE.BoxGeometry(2.45, 0.35, 2.25);
        const mattressMesh = new THREE.Mesh(mattressGeo, matMat);
        mattressMesh.position.y = -0.05;
        group.add(mattressMesh);

        const headGeo = new THREE.BoxGeometry(2.7, 1.6, 0.25);
        const headMesh = new THREE.Mesh(headGeo, baseMat);
        headMesh.position.set(0, 0.55, -1.2);
        group.add(headMesh);

        const rimGeo = new THREE.BoxGeometry(2.74, 0.05, 0.27);
        const rimMesh = new THREE.Mesh(rimGeo, accentMat);
        rimMesh.position.set(0, 1.35, -1.2);
        group.add(rimMesh);

      } else if (catLower.includes('wardrobe')) {
        // --- 5. WARDROBE ---
        const bodyGeo = new THREE.BoxGeometry(2.2, 2.4, 1.2);
        const bodyMesh = new THREE.Mesh(bodyGeo, baseMat);
        bodyMesh.position.y = 0.2;
        group.add(bodyMesh);

        const doorGeo = new THREE.BoxGeometry(1.05, 2.25, 0.05);
        const d1 = new THREE.Mesh(doorGeo, surfaceMat);
        d1.position.set(-0.54, 0.2, 0.61);
        const d2 = new THREE.Mesh(doorGeo, surfaceMat);
        d2.position.set(0.54, 0.2, 0.61);
        group.add(d1, d2);

        const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 12);
        const h1 = new THREE.Mesh(handleGeo, accentMat);
        h1.position.set(-0.08, 0.2, 0.65);
        const h2 = new THREE.Mesh(handleGeo, accentMat);
        h2.position.set(0.08, 0.2, 0.65);
        group.add(h1, h2);

      } else if (catLower.includes('coffee')) {
        // --- 6. COFFEE TABLE ---
        const topGeo = new THREE.BoxGeometry(2.2, 0.1, 1.2);
        const topMesh = new THREE.Mesh(topGeo, baseMat);
        topMesh.position.y = 0.1;
        group.add(topMesh);

        const shelfGeo = new THREE.BoxGeometry(2.0, 0.04, 1.0);
        const shelfMesh = new THREE.Mesh(shelfGeo, baseMat);
        shelfMesh.position.y = -0.3;
        group.add(shelfMesh);

        const legGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.7, 12);
        [[-1.0, -0.25, -0.5], [1.0, -0.25, -0.5], [-1.0, -0.25, 0.5], [1.0, -0.25, 0.5]].forEach(pos => {
          const leg = new THREE.Mesh(legGeo, accentMat);
          leg.position.set(pos[0], pos[1], pos[2]);
          group.add(leg);
        });

      } else if (catLower.includes('chair')) {
        // --- 7. CHAIR ---
        const seatGeo = new THREE.BoxGeometry(1.3, 0.12, 1.3);
        const seatMesh = new THREE.Mesh(seatGeo, baseMat);
        seatMesh.position.y = -0.1;
        group.add(seatMesh);

        const cushionMat = new THREE.MeshStandardMaterial({ color: 0xc49a45, roughness: 0.6 });
        const cushMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.2), cushionMat);
        cushMesh.position.y = 0.04;
        group.add(cushMesh);

        const backGeo = new THREE.BoxGeometry(1.3, 1.1, 0.1);
        const backMesh = new THREE.Mesh(backGeo, baseMat);
        backMesh.position.set(0, 0.65, -0.6);
        group.add(backMesh);

        const slatGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8);
        [-0.4, -0.2, 0, 0.2, 0.4].forEach(x => {
          const slat = new THREE.Mesh(slatGeo, accentMat);
          slat.position.set(x, 0.6, -0.6);
          group.add(slat);
        });

        const legGeo = new THREE.CylinderGeometry(0.05, 0.03, 0.8, 12);
        [[-0.55, -0.5, -0.55], [0.55, -0.5, -0.55], [-0.55, -0.5, 0.55], [0.55, -0.5, 0.55]].forEach(pos => {
          const leg = new THREE.Mesh(legGeo, baseMat);
          leg.position.set(pos[0], pos[1], pos[2]);
          group.add(leg);
        });

      } else if (catLower.includes('bookshelf')) {
        // --- 8. BOOKSHELF ---
        const sideGeo = new THREE.BoxGeometry(0.1, 2.4, 1.1);
        const s1 = new THREE.Mesh(sideGeo, baseMat);
        s1.position.set(-1.0, 0.2, 0);
        const s2 = new THREE.Mesh(sideGeo, baseMat);
        s2.position.set(1.0, 0.2, 0);
        group.add(s1, s2);

        const shelfGeo = new THREE.BoxGeometry(2.0, 0.08, 1.1);
        [-0.8, -0.3, 0.2, 0.7, 1.2].forEach(y => {
          const shelf = new THREE.Mesh(shelfGeo, baseMat);
          shelf.position.set(0, y, 0);
          group.add(shelf);
        });

        const backGeo = new THREE.BoxGeometry(2.0, 2.4, 0.04);
        const backMesh = new THREE.Mesh(backGeo, baseMat);
        backMesh.position.set(0, 0.2, -0.53);
        group.add(backMesh);

      } else if (catLower.includes('dressing')) {
        // --- 9. DRESSING TABLE ---
        const deskGeo = new THREE.BoxGeometry(2.2, 0.6, 1.2);
        const deskMesh = new THREE.Mesh(deskGeo, baseMat);
        deskMesh.position.y = -0.3;
        group.add(deskMesh);

        const mirrorFrameGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.06, 32);
        const mirrorFrame = new THREE.Mesh(mirrorFrameGeo, accentMat);
        mirrorFrame.rotation.x = Math.PI / 2;
        mirrorFrame.position.set(0, 0.8, -0.3);
        group.add(mirrorFrame);

        const mirrorMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.0, metalness: 1.0 });
        const mirrorInner = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.07, 32), mirrorMat);
        mirrorInner.rotation.x = Math.PI / 2;
        mirrorInner.position.set(0, 0.8, -0.28);
        group.add(mirrorInner);

      } else if (catLower.includes('shoe')) {
        // --- 10. SHOE RACK ---
        const bodyGeo = new THREE.BoxGeometry(2.0, 1.4, 1.1);
        const bodyMesh = new THREE.Mesh(bodyGeo, baseMat);
        bodyMesh.position.y = -0.1;
        group.add(bodyMesh);

        const slatGeo = new THREE.BoxGeometry(0.9, 0.04, 0.02);
        [-0.4, -0.2, 0, 0.2, 0.4].forEach(y => {
          const sl1 = new THREE.Mesh(slatGeo, accentMat);
          sl1.position.set(-0.48, y - 0.1, 0.56);
          const sl2 = new THREE.Mesh(slatGeo, accentMat);
          sl2.position.set(0.48, y - 0.1, 0.56);
          group.add(sl1, sl2);
        });

      } else if (catLower.includes('tv') || (catLower.includes('cabinet') && !catLower.includes('bar') && !catLower.includes('crockery'))) {
        // --- 11. TV UNIT / CABINET ---
        const bodyGeo = new THREE.BoxGeometry(3.0, 0.7, 1.2);
        const bodyMesh = new THREE.Mesh(bodyGeo, baseMat);
        bodyMesh.position.y = -0.2;
        group.add(bodyMesh);

        const topMarbleMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.1, metalness: 0.1 });
        const topSlab = new THREE.Mesh(new THREE.BoxGeometry(3.04, 0.08, 1.24), topMarbleMat);
        topSlab.position.y = 0.19;
        group.add(topSlab);

        const slotGeo = new THREE.BoxGeometry(0.9, 0.25, 1.15);
        const slotMat = new THREE.MeshStandardMaterial({ color: 0x0f0a07, roughness: 0.9 });
        const slotMesh = new THREE.Mesh(slotGeo, slotMat);
        slotMesh.position.set(0, 0.02, 0.05);
        group.add(slotMesh);

      } else if (catLower.includes('side table') || (catLower.includes('side') && !catLower.includes('bedside'))) {
        // --- 12. SIDE TABLE ---
        const topGeo = new THREE.BoxGeometry(1.3, 0.1, 1.3);
        const topMesh = new THREE.Mesh(topGeo, baseMat);
        topMesh.position.y = 0.3;
        group.add(topMesh);

        const legGeo = new THREE.CylinderGeometry(0.04, 0.025, 0.9, 12);
        [[-0.5, -0.15, -0.5], [0.5, -0.15, -0.5], [-0.5, -0.15, 0.5], [0.5, -0.15, 0.5]].forEach(pos => {
          const leg = new THREE.Mesh(legGeo, accentMat);
          leg.position.set(pos[0], pos[1], pos[2]);
          group.add(leg);
        });

      } else if (catLower.includes('bench')) {
        // --- 14. WOODEN BENCH ---
        const plankGeo = new THREE.BoxGeometry(2.8, 0.15, 1.1);
        const plankMesh = new THREE.Mesh(plankGeo, baseMat);
        plankMesh.position.y = 0.0;
        group.add(plankMesh);

        const ironLegGeo = new THREE.BoxGeometry(0.1, 0.8, 1.1);
        const l1 = new THREE.Mesh(ironLegGeo, accentMat);
        l1.position.set(-1.1, -0.4, 0);
        const l2 = new THREE.Mesh(ironLegGeo, accentMat);
        l2.position.set(1.1, -0.4, 0);
        group.add(l1, l2);

      } else if (catLower.includes('crockery')) {
        // --- 15. CROCKERY CABINET ---
        const frameGeo = new THREE.BoxGeometry(2.0, 2.4, 1.2);
        const frameMesh = new THREE.Mesh(frameGeo, baseMat);
        frameMesh.position.y = 0.2;
        group.add(frameMesh);

        const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 0.05), surfaceMat);
        glassDoor.position.set(0, 0.2, 0.6);
        group.add(glassDoor);

      } else if (catLower.includes('jhula') || catLower.includes('swing')) {
        // --- 16. INDOOR SWING (JHULA) ---
        const beamGeo = new THREE.BoxGeometry(2.6, 0.15, 0.15);
        const topBeam = new THREE.Mesh(beamGeo, baseMat);
        topBeam.position.y = 1.4;
        group.add(topBeam);

        const seatGeo = new THREE.BoxGeometry(1.8, 0.15, 0.9);
        const seatMesh = new THREE.Mesh(seatGeo, baseMat);
        seatMesh.position.y = -0.2;
        group.add(seatMesh);

        const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
        [[-0.8, 0.6, 0], [0.8, 0.6, 0]].forEach(pos => {
          const c = new THREE.Mesh(chainGeo, accentMat);
          c.position.set(pos[0], pos[1], pos[2]);
          group.add(c);
        });

      } else if (catLower.includes('chest') || catLower.includes('drawers')) {
        // --- 17. CHEST OF DRAWERS ---
        const chestGeo = new THREE.BoxGeometry(2.0, 1.6, 1.2);
        const chestMesh = new THREE.Mesh(chestGeo, baseMat);
        chestMesh.position.y = 0.0;
        group.add(chestMesh);

        [0.5, 0.15, -0.2, -0.55].forEach(y => {
          const d = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.3, 0.05), surfaceMat);
          d.position.set(0, y, 0.61);
          group.add(d);

          const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), accentMat);
          knob.position.set(0, y, 0.65);
          group.add(knob);
        });

      } else if (catLower.includes('bar')) {
        // --- 18. BAR CABINET ---
        const barGeo = new THREE.BoxGeometry(2.0, 1.8, 1.2);
        const barMesh = new THREE.Mesh(barGeo, baseMat);
        barMesh.position.y = 0.1;
        group.add(barMesh);

        const brassGrid = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.02, 1.1), accentMat);
        brassGrid.position.set(0, 0.5, 0);
        group.add(brassGrid);

      } else if (catLower.includes('console')) {
        // --- 19. CONSOLE TABLE ---
        const topGeo = new THREE.BoxGeometry(2.8, 0.1, 1.0);
        const topMesh = new THREE.Mesh(topGeo, baseMat);
        topMesh.position.y = 0.4;
        group.add(topMesh);

        const pinGeo = new THREE.CylinderGeometry(0.03, 0.015, 1.1, 12);
        [[-1.2, -0.15, -0.4], [1.2, -0.15, -0.4], [-1.2, -0.15, 0.4], [1.2, -0.15, 0.4]].forEach(pos => {
          const pin = new THREE.Mesh(pinGeo, accentMat);
          pin.position.set(pos[0], pos[1], pos[2]);
          group.add(pin);
        });

      } else if (catLower.includes('bedside')) {
        // --- 20. BEDSIDE TABLE ---
        const bodyGeo = new THREE.BoxGeometry(1.2, 0.8, 1.1);
        const bodyMesh = new THREE.Mesh(bodyGeo, baseMat);
        bodyMesh.position.y = 0.0;
        group.add(bodyMesh);

        const chargerRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.01, 16, 32), accentMat);
        chargerRing.rotation.x = Math.PI / 2;
        chargerRing.position.set(0, 0.41, 0);
        group.add(chargerRing);

        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), accentMat);
        knob.position.set(0, 0.1, 0.56);
        group.add(knob);

      } else if (catLower.includes('door')) {
        // --- 21. DOOR ---
        const jambGeo = new THREE.BoxGeometry(2.2, 3.0, 0.15);
        const jambMesh = new THREE.Mesh(jambGeo, accentMat);
        jambMesh.position.y = 0.2;
        group.add(jambMesh);

        const doorLeafGeo = new THREE.BoxGeometry(1.9, 2.8, 0.1);
        const doorLeaf = new THREE.Mesh(doorLeafGeo, baseMat);
        doorLeaf.position.y = 0.2;
        group.add(doorLeaf);

        const windowInset = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.08), glassMat);
        windowInset.position.set(0, 0.8, 0.2);
        group.add(windowInset);

        const lockset = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.14), accentMat);
        lockset.position.set(0.75, 0.1, 0.2);
        group.add(lockset);

      } else if (catLower.includes('urli') || catLower.includes('fountain') || catLower.includes('bowl')) {
        // --- URLI / FOUNTAIN GEOMETRY ---
        const bowlGeo = new THREE.CylinderGeometry(1.4, 0.8, 0.5, 32);
        const bowlMesh = new THREE.Mesh(bowlGeo, baseMat);
        bowlMesh.position.y = -0.2;
        group.add(bowlMesh);

        const pedestalGeo = new THREE.CylinderGeometry(0.5, 0.9, 0.6, 24);
        const pedMesh = new THREE.Mesh(pedestalGeo, baseMat);
        pedMesh.position.y = -0.75;
        group.add(pedMesh);

        const ringGeo = new THREE.TorusGeometry(1.42, 0.04, 16, 40);
        const ringMesh = new THREE.Mesh(ringGeo, accentMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 0.05;
        group.add(ringMesh);

      } else if (catLower.includes('fluted') || catLower.includes('oval') || catLower.includes('japandi') || catLower.includes('pedestal')) {
        // --- JAPANDI OVAL CAPSULE TABLETOP WITH DUAL FLUTED TAMBOUR PEDESTAL PILLARS ---
        const topCenterGeo = new THREE.BoxGeometry(1.6, 0.12, 1.4);
        const topCenterMesh = new THREE.Mesh(topCenterGeo, baseMat);
        topCenterMesh.position.set(0, 0.38, 0);

        const capLeftGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.12, 32, 1, false, Math.PI / 2, Math.PI);
        const capLeftMesh = new THREE.Mesh(capLeftGeo, baseMat);
        capLeftMesh.position.set(-0.8, 0.38, 0);

        const capRightGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.12, 32, 1, false, -Math.PI / 2, Math.PI);
        const capRightMesh = new THREE.Mesh(capRightGeo, baseMat);
        capRightMesh.position.set(0.8, 0.38, 0);

        group.add(topCenterMesh, capLeftMesh, capRightMesh);

        const createFlutedPedestal = (posX: number) => {
          const pedGroup = new THREE.Group();
          const pedCoreGeo = new THREE.CylinderGeometry(0.38, 0.38, 1.1, 32);
          pedCoreGeo.scale(0.8, 1, 1.35);
          const pedCoreMesh = new THREE.Mesh(pedCoreGeo, baseMat);
          pedCoreMesh.position.y = -0.22;
          pedGroup.add(pedCoreMesh);

          const slatCount = 20;
          const radiusX = 0.32;
          const radiusZ = 0.54;
          const slatGeo = new THREE.CylinderGeometry(0.024, 0.024, 1.1, 8);

          for (let i = 0; i < slatCount; i++) {
            const angle = (i / slatCount) * Math.PI * 2;
            const x = Math.cos(angle) * radiusX;
            const z = Math.sin(angle) * radiusZ;
            const slatMesh = new THREE.Mesh(slatGeo, baseMat);
            slatMesh.position.set(x, -0.22, z);
            pedGroup.add(slatMesh);
          }

          const brassRimGeo = new THREE.TorusGeometry(0.44, 0.025, 16, 32);
          brassRimGeo.scale(0.8, 1, 1.35);
          const brassRimMesh = new THREE.Mesh(brassRimGeo, accentMat);
          brassRimMesh.rotation.x = Math.PI / 2;
          brassRimMesh.position.y = -0.76;
          pedGroup.add(brassRimMesh);

          pedGroup.position.set(posX, 0, 0);
          return pedGroup;
        };

        const leftPedestal = createFlutedPedestal(-0.75);
        const rightPedestal = createFlutedPedestal(0.75);
        group.add(leftPedestal, rightPedestal);

      } else {

        // --- BESPOKE DINING TABLE / DESK WITH DYNAMIC AI PROMPT 3D MODELING ---

        // 1. MARBLE OR WOOD TOP SLAB
        if (hasMarbleTop) {
          const marbleMat = new THREE.MeshStandardMaterial({
            color: marbleColor === 'black' ? new THREE.Color(0x1a1a1a) : new THREE.Color(0xf5f3ed),
            roughness: 0.12,
            metalness: 0.05
          });
          const topGeo = new THREE.BoxGeometry(2.8, 0.12, 1.5);
          const topMesh = new THREE.Mesh(topGeo, marbleMat);
          topMesh.position.y = 0.38;
          topMesh.castShadow = true;
          topMesh.receiveShadow = true;
          group.add(topMesh);

          // Golden Brass Rim Border around Marble Slab
          const rimGeo = new THREE.BoxGeometry(2.84, 0.04, 1.54);
          const rimMesh = new THREE.Mesh(rimGeo, accentMat);
          rimMesh.position.y = 0.38;
          group.add(rimMesh);
        } else {
          const topGeo = new THREE.BoxGeometry(2.8, 0.12, 1.5);
          const topMesh = new THREE.Mesh(topGeo, baseMat);
          topMesh.position.y = 0.38;
          topMesh.castShadow = true;
          topMesh.receiveShadow = true;
          group.add(topMesh);
        }

        // 2. GLASS TOP OVERLAY
        if (hasGlassTop) {
          const glassTopGeo = new THREE.BoxGeometry(2.86, 0.035, 1.56);
          const glassMesh = new THREE.Mesh(glassTopGeo, glassMat);
          glassMesh.position.y = 0.45;
          glassMesh.castShadow = true;
          group.add(glassMesh);

          // Brass Standoff Pads under Glass Top
          const standoffGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.04, 12);
          [[-1.3, 0.43, -0.65], [1.3, 0.43, -0.65], [-1.3, 0.43, 0.65], [1.3, 0.43, 0.65]].forEach(([x, y, z]) => {
            const pad = new THREE.Mesh(standoffGeo, accentMat);
            pad.position.set(x, y, z);
            group.add(pad);
          });
        }

        // 3. BRASS WIRE INLAYS & APRON DETAILED SKIRT
        if (hasBrassInlays || accentIds.length > 0) {
          const inlayStripGeo = new THREE.BoxGeometry(2.6, 0.015, 0.02);
          const stripFront = new THREE.Mesh(inlayStripGeo, accentMat);
          stripFront.position.set(0, 0.44, 0.74);
          const stripBack = new THREE.Mesh(inlayStripGeo, accentMat);
          stripBack.position.set(0, 0.44, -0.74);
          group.add(stripFront, stripBack);
        }

        if (hasApronCarving || hasCarvedLegs) {
          const apronGeoFront = new THREE.BoxGeometry(2.6, 0.14, 0.04);
          const apronFront = new THREE.Mesh(apronGeoFront, baseMat);
          apronFront.position.set(0, 0.26, 0.7);
          const apronBack = new THREE.Mesh(apronGeoFront, baseMat);
          apronBack.position.set(0, 0.26, -0.7);
          group.add(apronFront, apronBack);
        }

        // 4. LEGS GENERATION (DYNAMIC BASED ON AI TEXT)
        if (hasBrassPillars) {
          // --- MORADABAD CAST BRASS PILLARS ---
          const brassPillarMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xd4af37),
            roughness: 0.15,
            metalness: 0.92
          });

          const pillarGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.05, 24);
          const baseCapGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 24);

          const positions = [
            [-1.1, -0.15, -0.55],
            [1.1, -0.15, -0.55],
            [-1.1, -0.15, 0.55],
            [1.1, -0.15, 0.55]
          ];

          positions.forEach(([x, y, z]) => {
            const pillar = new THREE.Mesh(pillarGeo, brassPillarMat);
            pillar.position.set(x, y, z);
            pillar.castShadow = true;

            const footCap = new THREE.Mesh(baseCapGeo, brassPillarMat);
            footCap.position.set(x, -0.66, z);

            const topCap = new THREE.Mesh(baseCapGeo, brassPillarMat);
            topCap.position.set(x, 0.31, z);

            group.add(pillar, footCap, topCap);
          });

          // Brass Cross Stretcher Beam
          const stretchGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.2, 16);
          const stretchLeft = new THREE.Mesh(stretchGeo, brassPillarMat);
          stretchLeft.rotation.z = Math.PI / 2;
          stretchLeft.position.set(0, -0.4, -0.55);
          const stretchRight = new THREE.Mesh(stretchGeo, brassPillarMat);
          stretchRight.rotation.z = Math.PI / 2;
          stretchRight.position.set(0, -0.4, 0.55);
          group.add(stretchLeft, stretchRight);

        } else if (hasCarvedLegs) {
          // --- RAJASTHANI HAND-CARVED FLUTED TURNED LEGS ---
          const createCarvedLeg = (posX: number, posZ: number) => {
            const legGroup = new THREE.Group();

            // Capital Box
            const boxGeo = new THREE.BoxGeometry(0.18, 0.2, 0.18);
            const boxMesh = new THREE.Mesh(boxGeo, baseMat);
            boxMesh.position.y = 0.24;

            // Turned Ring
            const ringGeo = new THREE.SphereGeometry(0.11, 16, 16);
            ringGeo.scale(1, 0.5, 1);
            const ringMesh = new THREE.Mesh(ringGeo, baseMat);
            ringMesh.position.y = 0.11;

            // Fluted Reeded Main Column with vertical ridges
            const colGeo = new THREE.CylinderGeometry(0.085, 0.08, 0.55, 16);
            const colMesh = new THREE.Mesh(colGeo, baseMat);
            colMesh.position.y = -0.2;

            // 12 Vertical micro fluting slats around column
            const slatCount = 12;
            const slatGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8);
            for (let i = 0; i < slatCount; i++) {
              const ang = (i / slatCount) * Math.PI * 2;
              const sx = Math.cos(ang) * 0.088;
              const sz = Math.sin(ang) * 0.088;
              const slat = new THREE.Mesh(slatGeo, baseMat);
              slat.position.set(sx, -0.2, sz);
              legGroup.add(slat);
            }

            // Lower Turned Tapered Vase
            const vaseGeo = new THREE.CylinderGeometry(0.09, 0.04, 0.25, 16);
            const vaseMesh = new THREE.Mesh(vaseGeo, baseMat);
            vaseMesh.position.y = -0.52;

            // Bottom Moradabad Brass Ferrule Foot Cap
            const footGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.1, 16);
            const footMesh = new THREE.Mesh(footGeo, accentMat);
            footMesh.position.y = -0.66;

            legGroup.add(boxMesh, ringMesh, colMesh, vaseMesh, footMesh);
            legGroup.position.set(posX, 0, posZ);
            return legGroup;
          };

          group.add(
            createCarvedLeg(-1.15, -0.55),
            createCarvedLeg(1.15, -0.55),
            createCarvedLeg(-1.15, 0.55),
            createCarvedLeg(1.15, 0.55)
          );

          // Connecting Apron Frame
          const apronLongGeo = new THREE.BoxGeometry(2.3, 0.12, 0.05);
          const a1 = new THREE.Mesh(apronLongGeo, baseMat);
          a1.position.set(0, 0.24, -0.55);
          const a2 = new THREE.Mesh(apronLongGeo, baseMat);
          a2.position.set(0, 0.24, 0.55);
          group.add(a1, a2);

        } else {
          // --- DEFAULT SCULPTURAL A-FRAME TRESTLE PILLARS ---
          const trestleGroupLeft = new THREE.Group();
          const trestleBeamGeo = new THREE.BoxGeometry(0.18, 1.05, 0.22);

          const legLeftOuter = new THREE.Mesh(trestleBeamGeo, baseMat);
          legLeftOuter.position.set(0, 0, -0.38);
          legLeftOuter.rotation.x = 0.24;

          const legLeftInner = new THREE.Mesh(trestleBeamGeo, baseMat);
          legLeftInner.position.set(0, 0, 0.38);
          legLeftInner.rotation.x = -0.24;

          const crossStretcher = new THREE.BoxGeometry(0.18, 0.12, 0.95);
          const stretchMeshLeft = new THREE.Mesh(crossStretcher, baseMat);
          stretchMeshLeft.position.y = -0.3;

          trestleGroupLeft.add(legLeftOuter, legLeftInner, stretchMeshLeft);
          trestleGroupLeft.position.set(-1.0, -0.2, 0);

          const trestleGroupRight = trestleGroupLeft.clone();
          trestleGroupRight.position.set(1.0, -0.2, 0);

          const spineGeo = new THREE.BoxGeometry(2.0, 0.12, 0.16);
          const spineMesh = new THREE.Mesh(spineGeo, baseMat);
          spineMesh.position.set(0, -0.5, 0);

          if (accentIds.length > 0 || hasBrassInlays) {
            const capGeo = new THREE.BoxGeometry(0.2, 0.14, 0.2);
            const cap1 = new THREE.Mesh(capGeo, accentMat);
            cap1.position.set(-1.0, 0.25, -0.38);
            const cap2 = new THREE.Mesh(capGeo, accentMat);
            cap2.position.set(1.0, 0.25, 0.38);
            group.add(cap1, cap2);
          }

          group.add(trestleGroupLeft, trestleGroupRight, spineMesh);
        }

        // 5. DYNAMIC 3D DRAWERS FEATURE
        if (hasDrawers) {
          const numDrawers = drawerCount || 2;

          if (numDrawers === 4) {
            // 4 Drawers (2 left, 2 right)
            const dGeo = new THREE.BoxGeometry(0.9, 0.15, 1.25);
            [-0.6, 0.6].forEach(x => {
              [0.26, 0.10].forEach(y => {
                const d = new THREE.Mesh(dGeo, surfaceMat);
                d.position.set(x, y, 0.02);
                d.castShadow = true;
                group.add(d);

                const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), accentMat);
                knob.position.set(x, y, 0.65);
                group.add(knob);
              });
            });
          } else {
            // 2 Drawers (1 left, 1 right)
            const drawerGeo = new THREE.BoxGeometry(1.0, 0.20, 1.3);
            const d1 = new THREE.Mesh(drawerGeo, surfaceMat);
            d1.position.set(-0.6, 0.2, 0.02);
            d1.castShadow = true;
            const d2 = new THREE.Mesh(drawerGeo, surfaceMat);
            d2.position.set(0.6, 0.2, 0.02);
            d2.castShadow = true;
            group.add(d1, d2);

            const knobGeo = new THREE.SphereGeometry(0.04, 16, 16);
            const knob1 = new THREE.Mesh(knobGeo, accentMat);
            knob1.position.set(-0.6, 0.2, 0.68);
            const knob2 = new THREE.Mesh(knobGeo, accentMat);
            knob2.position.set(0.6, 0.2, 0.68);
            group.add(knob1, knob2);
          }
        }

        // 6. DYNAMIC BOTTOM STORAGE SHELF
        if (hasBottomShelf) {
          const shelfGeo = new THREE.BoxGeometry(2.3, 0.05, 1.1);
          const shelfMesh = new THREE.Mesh(shelfGeo, baseMat);
          shelfMesh.position.y = -0.45;
          shelfMesh.castShadow = true;
          group.add(shelfMesh);

          // Slats detail on bottom shelf
          const slatBarGeo = new THREE.BoxGeometry(0.04, 0.02, 1.1);
          for (let i = -1.0; i <= 1.0; i += 0.2) {
            const slatBar = new THREE.Mesh(slatBarGeo, accentMat);
            slatBar.position.set(i, -0.42, 0);
            group.add(slatBar);
          }
        }
      }

      scene.add(group);
    };

    buildModel();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Mouse Interaction Handlers for 360° Orbiting
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !meshGroupRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      meshGroupRef.current.rotation.y += deltaX * 0.008;
      meshGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElem = mountRef.current;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (meshGroupRef.current && !isDraggingRef.current) {
        meshGroupRef.current.rotation.y += 0.005; // Smooth idle rotation
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [
    categoryName,
    materialColorHex,
    hasDrawers,
    drawerCount,
    hasCarvedLegs,
    hasBrassPillars,
    hasMarbleTop,
    marbleColor,
    hasBottomShelf,
    hasGlassTop,
    hasBrassInlays,
    hasApronCarving,
    aiPromptText,
  ]);

  // Update material properties dynamically on state change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(materialColorHex || '#8B4513');
      materialRef.current.roughness = finishId === 'fin-gloss' ? 0.15 : roughness;
      materialRef.current.metalness = materialName.toLowerCase().includes('brass') ? 0.85 : metalness;
      materialRef.current.needsUpdate = true;
    }
  }, [materialColorHex, finishId, roughness, metalness, materialName]);

  // Dynamic Scale & Auto-Framing update based on user dimension inputs (Length, Width, Height)
  useEffect(() => {
    if (meshGroupRef.current) {
      // Normalize baseline scale (Baseline: L=6ft, W=3.5ft, H=2.5ft)
      const scaleX = Math.max(0.4, Math.min(2.2, lengthFt / 6.0));
      const scaleZ = Math.max(0.4, Math.min(2.2, widthFt / 3.5));
      const scaleY = Math.max(0.4, Math.min(2.2, heightFt / 2.5));

      meshGroupRef.current.scale.set(scaleX, scaleY, scaleZ);

      // Auto-adjust camera distance so large objects fit comfortably without clipping
      if (cameraRef.current) {
        const maxScale = Math.max(scaleX, scaleY, scaleZ);
        const targetDist = 5.2 * (0.7 + maxScale * 0.3);
        cameraRef.current.position.z = targetDist;
        setZoomLevel(Math.round((5.2 / targetDist) * 100));
      }
    }
  }, [lengthFt, widthFt, heightFt]);

  // Zoom Button Controls
  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(2.2, cameraRef.current.position.z * 0.85);
      setZoomLevel(Math.round((5.2 / cameraRef.current.position.z) * 100));
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(8.5, cameraRef.current.position.z * 1.15);
      setZoomLevel(Math.round((5.2 / cameraRef.current.position.z) * 100));
    }
  };

  const handleResetView = () => {
    if (cameraRef.current && meshGroupRef.current) {
      meshGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 1.8, 5.2);
      setZoomLevel(100);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (cameraRef.current) {
      const zoomDelta = e.deltaY * 0.003;
      cameraRef.current.position.z = Math.max(2.0, Math.min(9.0, cameraRef.current.position.z + zoomDelta));
      setZoomLevel(Math.round((5.2 / cameraRef.current.position.z) * 100));
    }
  };

  return (
    <div
      onWheel={handleWheel}
      className="relative w-full h-[400px] sm:h-[440px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border-2 border-[#3E2E24] shadow-2xl bg-[#120B08] group"
    >
      {/* Three.js Mounting Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Interactive Zoom & View Controls (Top-Right) */}
      <div className="absolute top-3 right-3 flex flex-col space-y-1.5 bg-[#120B08]/90 backdrop-blur-xl p-1.5 rounded-xl border border-[#EA580C]/50 shadow-xl z-20">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 rounded-lg bg-[#1F1510] hover:bg-[#EA580C] text-slate-300 hover:text-white transition-all shadow border border-[#2A1E17] hover:scale-105"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 rounded-lg bg-[#1F1510] hover:bg-[#EA580C] text-slate-300 hover:text-white transition-all shadow border border-[#2A1E17] hover:scale-105"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetView}
          className="p-2 rounded-lg bg-[#1F1510] hover:bg-[#EA580C] text-slate-300 hover:text-white transition-all shadow border border-[#2A1E17] hover:scale-105"
          title="Reset 3D View (↺)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom Level & AI Dynamic Feature Badges (Top-Left) */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-20 max-w-[80%]">
        <div className="flex items-center space-x-1.5 bg-[#120B08]/90 backdrop-blur-xl px-3 py-1 rounded-xl border border-[#2A1E17] text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#EA580C] animate-pulse" />
          <span className="text-white">Zoom: <strong className="text-[#EAB308]">{zoomLevel}%</strong></span>
        </div>

        {hasDrawers && (
          <span className="bg-[#EA580C] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shadow glow-orange animate-fadeIn">
            + {drawerCount} Front Drawers
          </span>
        )}
        {hasCarvedLegs && (
          <span className="bg-amber-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shadow animate-fadeIn">
            + Carved Fluted Legs
          </span>
        )}
        {hasBrassPillars && (
          <span className="bg-yellow-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shadow animate-fadeIn">
            + Brass Pillars
          </span>
        )}
        {hasMarbleTop && (
          <span className="bg-slate-200 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shadow animate-fadeIn">
            + {marbleColor === 'black' ? 'Black' : 'White'} Marble Top
          </span>
        )}
        {hasGlassTop && (
          <span className="bg-cyan-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shadow animate-fadeIn">
            + Glass Top Overlay
          </span>
        )}
        {hasBrassInlays && (
          <span className="bg-[#EA580C]/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shadow animate-fadeIn">
            + Brass Wire Inlay
          </span>
        )}
        {hasBottomShelf && (
          <span className="bg-emerald-700 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shadow animate-fadeIn">
            + Bottom Storage Shelf
          </span>
        )}
      </div>

      {/* Helper Orbit Overlay Indicator (Bottom Bar) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-mono bg-[#120B08]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#2A1E17] pointer-events-none z-20 shadow-lg">
        <span className="flex items-center space-x-2 text-amber-400">
          <Move className="w-3.5 h-3.5 text-[#EA580C] animate-bounce" />
          <span>360° Drag & Scroll Wheel Zoom</span>
        </span>
        <span className="text-emerald-400 font-bold">
          Scale: {lengthFt.toFixed(1)}' × {widthFt.toFixed(1)}' × {heightFt.toFixed(1)}'
        </span>
      </div>
    </div>
  );
};

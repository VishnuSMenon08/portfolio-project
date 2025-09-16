import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export class LabelHandler {
    constructor(labelRenderer, content){
        this.labelRenderer = labelRenderer;
        this.content = content;
        this.label;

    }

    attachHtml(scene, labelPos) {
        const div = document.createElement('div');
        div.className = 'terminal';
        div.innerHTML = this.content;
        this.label = new CSS2DObject(div);
        this.label.position.set(labelPos[0], labelPos[1], labelPos[2]);
        scene.add(this.label);
    }

    updateLabels(camera) {
        const screenPos = new THREE.Vector3();
        this.label.getWorldPosition(screenPos);
    
        const distance = camera.position.distanceTo(screenPos);
        const div = this.label.element;
    
        if (div) {
            // Scale inversely with distance
            const scale = THREE.MathUtils.clamp(10 / distance , 0, 0.5);
            // div.style.transform = `scale(${scale})`;
            // div.style.zoom = scale;
    
            // Fade in when closer than X
            const opacity = THREE.MathUtils.clamp(1 - distance / 15, 0, 1);
            div.style.opacity = opacity;
        }
    }
}
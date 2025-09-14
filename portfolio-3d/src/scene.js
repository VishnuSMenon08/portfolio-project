import * as THREE from 'three';

export class SpaceStation {
    filePath = "./models/space_station/scene.gltf"
    constructor(gltfLoader){
        this.modelGltf;
        this.model;
        this.mixer;
        this.gltfLoader = gltfLoader;
        this.pointLightA = new THREE.PointLight( "#fa9f28", 200);
        this.pointLightB = new THREE.PointLight( "#fa9f28", 200);
    }

    async loadAndInitialize (scene) {
        this.modelGltf = await this.loadModel(this.filePath);
        this.model = this.modelGltf.scene;
        this.model.position.set(-9, -5, -20);
        scene.add(this.model);
        this.pointLightA.position.set(0,1,5);
        this.pointLightB.position.set(0,-1,-5);
        this.model.add(this.pointLightA);
        this.model.add(this.pointLightB);
        this.mixer = new THREE.AnimationMixer(this.model);
        this._applyAnimations();
    }

    _applyAnimations(){
        this.modelGltf.animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            action.play();
          });
    }

    loadModel (url){
        return new Promise((resolve, reject) => {
          this.gltfLoader.load(url, (gltf) => resolve(gltf), undefined, reject);
        });
      }

    playAnimationLoop(){
        if (this.mixer) {
            this.mixer.update(0.005);
          }
    }

}

export class SpaceShip{
    filePath = "./models/space_ship/scene.gltf"
    constructor(gltfLoader, textureLoader){
        this.modelGltf;
        this.model;
        this.gltfLoader = gltfLoader;
        this.textureLoader = textureLoader;
        this.textureMap;
        this.pointLightA = new THREE.PointLight("#5fc991", 100);
        this.pointLightB = new THREE.PointLight("#5fc991", 100);
    }

    async loadAndInitialize (scene) {
        this.modelGltf = await this.loadModel(this.filePath);
        this.model = this.modelGltf.scene;
        this.model.position.set(-12, -5, -20);
        this.model.scale.set(0.004,0.004,0.004);
        scene.add(this.model);
        this.pointLightA.position.set(0,2,2);
        this.pointLightB.position.set(0,-2, -2);
        this.model.add(this.pointLightA);
        this.model.add(this.pointLightB);
        this._applyTextures();
    }

    loadAllTextures(){
        const shipColorTexture = this.textureLoader.load("./models/space_ship/material_0_baseColor.png");
        const shipNormalTexture = this.textureLoader.load("./models/space_ship/material_0_normal.png");
        const shipMetalnessTexture= this.textureLoader.load("./models/space_ship/material_0_metallicRoughness.png");
        const shipEmissiveTexture = this.textureLoader.load("./models/space_ship/material_0_emissive.png");
        this.textureMap = {
            "colorMap"  : shipColorTexture,
            "normalMap" : shipNormalTexture,
            "roughnessMap" :  shipMetalnessTexture,
            "emissiveMap" : shipEmissiveTexture
        }
    }

    _applyTextures() {
        this.loadAllTextures();
        this.model.traverse((child) => {
        if (child.isMesh) {
            child.material.map = this.textureMap.colorMap;
            // add PBR maps:
            child.material.normalMap = this.textureMap.normalMap;
            child.material.roughnessMap = this.textureMap.roughnessMap;
            child.material.emissiveMap = this.textureMap.emissiveMap;
            child.material.needsUpdate = true;
        }});
    }

    loadModel (url){
        return new Promise((resolve, reject) => {
          this.gltfLoader.load(url, (gltf) => resolve(gltf), undefined, reject);
        });
      }
}

export class DeepSpace {
    filePath = "./models/space_station_3/scene.gltf"
    constructor(gltfLoader, textureLoader){
        this.modelGltf;
        this.model;
        this.mixer;
        this.gltfLoader = gltfLoader;
        this.textureLoader = textureLoader;
        this.textureMap;
        this.pointLightA = new THREE.PointLight("#fa9f28", 100);
        this.pointLightB = new THREE.PointLight("#fa9f28", 100);
    }

    async loadAndInitialize (scene) {
        this.modelGltf = await this.loadModel(this.filePath);
        this.model = this.modelGltf.scene;
        this.model.position.set(-15, -5, -50); 
        this.model.scale.set(1.3,1.3,1.3);
        scene.add(this.model);
        this.pointLightA.position.set(0,2,2);
        // this.pointLightB.position.set(0,-2, -2);
        this.model.add(this.pointLightA);
        // this.model.add(this.pointLightB);
        // this._applyTextures();
        this.mixer = new THREE.AnimationMixer(this.model);
        this._applyAnimations();
    }

    _applyAnimations(){
        this.modelGltf.animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            action.play();
          });
        }

    loadModel (url){
        return new Promise((resolve, reject) => {
          this.gltfLoader.load(url, (gltf) => resolve(gltf), undefined, reject);
        });
        }

    playAnimationLoop(){
        if (this.mixer) {
            this.mixer.update(0.01);
          }
    }

}

export class Launchpad {
    filePath = "./models/launchpad/scene.gltf"
    constructor(gltfLoader, textureLoader){
        this.modelGltf;
        this.model;
        this.mixer;
        this.customAnimations = [];
        this.gltfLoader = gltfLoader;
        this.textureLoader = textureLoader;
        this.textureMap;
        this.pointLightA = new THREE.PointLight("#fa9f28", 0.3);
        this.pointLightB = new THREE.PointLight("#fa9f28", 30);
        this.customAnimation = true;
    }

    async loadAndInitialize (scene) {
        this.modelGltf = await this.loadModel(this.filePath);
        this.model = this.modelGltf.scene;
        this.model.position.set(20, -5, 7);
        this.model.rotation.x = -0.2;
        this.model.scale.set(0.06,0.06,0.06);
        scene.add(this.model);
        // this.pointLightA.position.set(0,2,2);
        // this.pointLightB.position.set(0,-2, -2);
        // this.model.add(this.pointLightA);
        // this.model.add(this.pointLightB);
        // this._applyTextures();
        this.mixer = new THREE.AnimationMixer(this.model);
        this._applyAnimations();
    }

    _rotateAnimation(ellpasedTime){
        if (this.model){
            this.model.rotation.y = Math.PI * ellpasedTime * 0.1;
        }
    }

    _gravityAnimation(ellpasedTime){
        if (this.model){
            this.model.position.y = Math.sin(ellpasedTime) - 5;
        }
    }

    _applyAnimations(){
        this.modelGltf.animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            action.play();
          });
        }

    loadModel (url){
        return new Promise((resolve, reject) => {
          this.gltfLoader.load(url, (gltf) => resolve(gltf), undefined, reject);
        });
        }

    playAnimationLoop(){
        if (this.mixer) {
            this.mixer.update(0.01);
          }
    }

    playCustomAnimations(ellpasedTime){
        this._rotateAnimation(ellpasedTime);
        this._gravityAnimation(ellpasedTime);

    }

}
export * from './lib/three.module.js';
export { GLTFLoader } from './lib/GLTFLoader.js';
export { DRACOLoader } from './lib/DRACOLoader.js';

// components
import './components/Audio.js';
import './components/AudioListener.js';
import './components/Camera.js';
import './components/Geometry.js';
import './components/Light.js';
import './components/Material.js';
import './components/Model.js';
import './components/Renderable.js';

// physics components
import './components/physics/Shape.js';
import './components/physics/Spring.js';
import './components/physics/Constraint.js';
import './components/physics/Rigidbody.js';

// core
export { Entity } from './core/Entity.js';
export { Scene } from './core/Scene.js';
export { Renderer } from './core/Renderer.js';
export { App } from './core/App.js';
export { ComponentManager, registerComponent } from './core/ComponentManager.js';

// CANNON
export { Vec3 } from './lib/cannon-es.js';

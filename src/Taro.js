export * from './lib/three.module.js';
export { GLTFLoader } from './lib/GLTFLoader.js';
export { DRACOLoader } from './lib/DRACOLoader.js';

// components
import './components/Camera.js';
import './components/Geometry.js';
import './components/Light.js';
import './components/Material.js';
import './components/Model.js';
import './components/Renderable.js';

// physics components
import './components/physics/Shape.js';
import './components/physics/Constraint.js';
import './components/physics/Rigidbody.js';

// core
export { Entity } from './core/Entity.js';
export { Scene } from './core/Scene.js';
export { Application } from './core/Application.js';
export { ComponentManager } from './core/ComponentManager.js';

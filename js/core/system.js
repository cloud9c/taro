import * as THREE from "./three.module.js";
import OIMO from "./oimoPhysics.js";
import Component from "./component.js";

const System = {
	init() {
		const cachedConfig = localStorage.getItem("config");
		const cached = cachedConfig !== null;
		const config = cached
			? JSON.parse(cachedConfig)
			: {
					controls: {},
			  };
		this.config = config;
		initMenu(cached, config);

		this.behavior.init();
		this.camera.init();
		this.input.init();
		this.physics.init();
		this.render.init();

		this.lastTimestamp = undefined;
	},
	gameLoop(timestamp) {
		timestamp /= 1000;
		const dt = timestamp - System.lastTimestamp || 0;
		System.lastTimestamp = timestamp;

		// custom updates
		System.behavior.update();

		// physics-y stuff
		System.physics.update(dt);

		// rendering info
		System.camera.update();
		System.render.update();

		// resets delta movements
		System.input.update();

		window.requestAnimationFrame(System.gameLoop);
	},
	animation: {
		init() {
			this.Animation = Component.components.Animation;
		},
		update() {
			for (const entity in this.Animation) {
				this.Animation[entity].mixer.update();
			}
		},
	},
	behavior: {
		init() {
			this.Behavior = Component.components.Behavior;
		},
		update() {
			for (const entity in this.Behavior) {
				this.Behavior[entity]();
			}
		},
	},
	camera: {
		init() {
			const config = System.config;

			let aspectRatio = window.innerWidth / window.innerHeight;
			if (config.aspectRatio != "native") {
				const configRatio = config.aspectRatio.split(":");
				aspectRatio = configRatio[0] / configRatio[1];
			}
			const camera = new THREE.PerspectiveCamera(
				+config.fov,
				aspectRatio,
				1,
				+config.renderDistance
			);
			camera.rotation.order = "YXZ";
			this.perspectiveCamera = camera;
			this.target = null;
		},
		thirdPersonMode() {
			const camera = this.perspectiveCamera;
			this.firstPerson = false;
			if (!this.renderFirstPerson)
				camera.parent.traverse((node) => {
					if (node.material) {
						node.material.colorWrite = true;
						node.material.depthWrite = true;
					}
				});
			camera.position.set(-2, 10, -15);
			camera.rotation.set((-160 * Math.PI) / 180, 0, Math.PI);
			this.cameraRadius = Math.sqrt(
				camera.position.z * camera.position.z +
					camera.position.y * camera.position.y
			);
			this.cameraArc = Math.acos(-camera.position.z / this.cameraRadius);
			camera.zoom = 1.65;
		},
		firstPersonMode() {
			const camera = this.perspectiveCamera;
			this.firstPerson = true;
			if (!this.renderFirstPerson)
				camera.parent.traverse((node) => {
					if (node.material) {
						node.material.colorWrite = false;
						node.material.depthWrite = false;
					}
				});
			camera.position.set(0, 4, 0);
			camera.rotation.set(0, Math.PI, 0);
			camera.zoom = 1;
		},
		setTarget(target, firstPerson = true, renderFirstPerson = false) {
			target.components.Object3D.add(this.perspectiveCamera);

			this.target = target;

			this.renderFirstPerson = renderFirstPerson;

			if (firstPerson) this.firstPersonMode();
			else this.thirdPersonMode();
		},
		update() {
			const camera = this.perspectiveCamera;
			const keyInput = System.input.keyInput;

			if (keyInput.MouseX != 0) {
				// temp solution
				this.target.components.Transform.rotation.y -= keyInput.MouseX;
			}

			if (keyInput.MouseY != 0) {
				if (this.firstPerson) {
					const newX = camera.rotation.x - keyInput.MouseY;
					if (newX < 1.5 && newX > -1.5) camera.rotation.x = newX;
				} else {
					const newCameraArc = this.cameraArc + keyInput.MouseY;
					if (newCameraArc < 1.1 && newCameraArc > 0.1) {
						const newX = camera.rotation.x + keyInput.MouseY;
						this.cameraArc = newCameraArc;
						camera.position.z =
							-Math.cos(newCameraArc) * this.cameraRadius;
						camera.position.y =
							Math.sin(newCameraArc) * this.cameraRadius;
						camera.rotation.x = newX;
					}
				}
			}

			if (keyInput.WheelY != 0) {
				if (keyInput.WheelY < 0) {
					camera.zoom = Math.max(camera.zoom - 0.05, 1);
					if (this.firstPerson) {
						this.thirdPersonMode();
					}
				} else {
					const newZoom = camera.zoom + 0.05;
					if (!this.firstPerson) {
						if (camera.zoom >= 1.65) {
							this.firstPersonMode();
						} else {
							camera.zoom = Math.min(newZoom, 1.65);
						}
					}
				}
				camera.updateProjectionMatrix();
			}
		},
	},
	input: {
		init() {
			const config = System.config;
			this.sensitivityX = config.mouseSensitivity / 1400;
			this.sensitivityY = config.mouseSensitivity / 1400;
			if (config.mouseInvert === "true") this.sensitivityY *= -1;

			const keyInput = {
				MouseX: 0,
				MouseY: 0,
				WheelX: 0,
				WheelY: 0,
			};

			for (const control in System.config.controls) {
				keyInput[control] = () => {
					return keyInput[System.config.controls[control]] || false;
				};
			}

			document.getElementById("c").addEventListener("click", () => {
				if (config.displayMode === "fullscreen")
					document.body.requestFullscreen();
				document.body.requestPointerLock();
			});

			window.addEventListener("blur", () => {
				for (const property in keyInput) {
					if (typeof keyInput[property] === "boolean")
						keyInput[property] = false;
					else if (typeof keyInput[property] === "number")
						keyInput[property] = 0;
				}
				System.lastTimestamp = undefined;
			});

			window.addEventListener("resize", () => {
				System.camera.perspectiveCamera.aspect =
					window.innerWidth / window.innerHeight;
				System.camera.perspectiveCamera.updateProjectionMatrix();
				System.render.renderer.setSize(
					window.innerWidth,
					window.innerHeight
				);
			});

			document
				.getElementById("setting-back")
				.addEventListener("click", () => {
					document.getElementById("menu").style.display = "none";
					if (config.displayMode === "fullscreen")
						document.body.requestFullscreen();
					document.body.requestPointerLock();
				});

			window.addEventListener("beforeunload", (event) => {
				event.preventDefault();
				localStorage.setItem("config", JSON.stringify(System.config));
				event.returnValue = "";
			});

			const onMouseMove = (event) => {
				keyInput.MouseX = event.movementX * this.sensitivityX;
				keyInput.MouseY = event.movementY * this.sensitivityY;
			};

			const onWheel = () => {
				keyInput.WheelX = event.wheelDeltaX;
				keyInput.WheelY = event.wheelDeltaY;
			};

			const onKeyDown = () => {
				if (event.repeat) return;

				keyInput[event.code] = true;

				if (event.code === "Tab") {
					enterMenu();
					document.getElementById("menu").style.display = "";
					document.exitPointerLock();
				}
			};

			const onMenuKeyDown = () => {
				if (event.code === "Tab") {
					document.getElementById("menu").style.display = "none";
					exitMenu();
					if (config.displayMode === "fullscreen")
						document.body.requestFullscreen();
					document.body.requestPointerLock();
				}
			};

			const onKeyUp = () => {
				keyInput[event.code] = false;
			};

			const exitMenu = () => {
				document.removeEventListener("keydown", onMenuKeyDown);
				document.addEventListener("mousemove", onMouseMove);
				document.addEventListener("wheel", onWheel);
				document.addEventListener("keydown", onKeyDown);
				document.addEventListener("keyup", onKeyUp);
			};

			const enterMenu = () => {
				document.addEventListener("keydown", onMenuKeyDown);
				document.removeEventListener("mousemove", onMouseMove);
				document.removeEventListener("wheel", onWheel);
				document.removeEventListener("keydown", onKeyDown);
				document.removeEventListener("keyup", onKeyUp);
			};

			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("wheel", onWheel);
			document.addEventListener("keydown", onKeyDown);
			document.addEventListener("keyup", onKeyUp);

			this.keyInput = keyInput;
		},
		update() {
			const keyInput = this.keyInput;
			keyInput.MouseX = 0;
			keyInput.MouseY = 0;
			keyInput.WheelX = 0;
			keyInput.WheelY = 0;
		},
	},
	physics: {
		init() {
			this.accumulator = 0;
			this.Rigidbody = Component.components.Rigidbody;
			this.UPDATE_PERIOD = 0.01;
			this.alpha = 0;

			this.world = new OIMO.World(2, OIMO.Vec3(0, -9.8, 0));
			this.world.setNumPositionIterations(8);
			this.world.setNumVelocityIterations(8);
		},
		update(dt) {
			// https://gafferongames.com/post/fix_your_timestep/
			this.accumulator += dt > 0.25 ? 0.25 : dt;

			while (this.accumulator >= this.UPDATE_PERIOD) {
				this.world.step(this.UPDATE_PERIOD);

				for (const entity in this.Rigidbody) {
					const rigidbody = this.Rigidbody[entity];

					rigidbody._previousState.position.copy(rigidbody._position);
					rigidbody._previousState.rotation.copy(rigidbody._rotation);

					rigidbody._position.copy(rigidbody.getPosition());
					rigidbody._rotation.copy(
						rigidbody.getRotation().toEulerXyz()
					);
				}
				this.accumulator -= this.UPDATE_PERIOD;
			}

			this.alpha = this.accumulator / this.UPDATE_PERIOD;
		},
	},
	render: {
		init() {
			const config = System.config;

			document.getElementById("c").style.filter =
				"brightness(" + (+config.brightness + 50) / 100 + ")";

			if (config.displayMode === "fullscreen") {
				document.body.requestFullscreen();
			}

			const renderer = new THREE.WebGLRenderer({
				canvas: document.getElementById("c"),
				precision: config.shadowPrecision,
				antialias: config.antiAliasing === "true",
				powerPreference: config.powerPreference,
			});
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE[config.shadowMap];
			renderer.physicallyCorrectLights =
				config.physicallyCorrectLights === "true";
			renderer.toneMapping = THREE[config.toneMap];

			renderer.setPixelRatio(+config.resolution);
			this.renderer = renderer;

			const maxFiltering = renderer.capabilities.getMaxAnisotropy();
			const filterLevels = document.querySelector(
				"select[name=textureFiltering]"
			).children;
			for (let i = filterLevels.length - 1; i >= 0; i--) {
				const element = filterLevels[i];
				if (element.value > maxFiltering) {
					element.remove();
				}
			}

			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0x0080ff);
			this.scene = scene;
			this.camera = System.camera.perspectiveCamera;

			this.Object3D = Component.components.Object3D;
			this.Rigidbody = Component.components.Rigidbody;
			this.Transform = Component.components.Transform;
		},
		update() {
			for (const entity in this.Object3D) {
				const obj = this.Object3D[entity];
				const transform = this.Transform[entity];
				const alpha = System.physics.alpha;

				// physics interpolation
				if (this.Rigidbody.hasOwnProperty(entity)) {
					const _previousState = this.Rigidbody[entity]
						._previousState;

					obj.position.copy(
						transform.position
							.clone()
							.lerp(_previousState.position, alpha)
					);

					obj.rotation.setFromQuaternion(
						new THREE.Quaternion()
							.setFromEuler(transform.rotation)
							.slerp(
								new THREE.Quaternion().setFromEuler(
									_previousState.rotation
								),
								alpha
							)
					);
				} else {
					obj.position.copy(transform.position);
					obj.rotation.copy(transform.rotation);
				}
				obj.scale.copy(transform.scale);
			}
			this.renderer.render(this.scene, this.camera);
		},
	},
};

function initMenu(cached, config) {
	function applyChanges(name) {
		const config = System.config;
		switch (name) {
			case "mouseSensitivity":
				System.input.sensitivityX = config.mouseSensitivity / 1400;
				System.input.sensitivityY = config.mouseSensitivity / 1400;
				break;
			case "mouseInvert":
				if (config.mouseInvert === "true")
					System.input.sensitivityY *= -1;
				break;
			case "resolution":
				System.render.renderer.setPixelRatio(+config.resolution);
				break;
			case "brightness":
				document.getElementById("c").style.filter =
					"brightness(" + (+config.brightness + 50) / 100 + ")";
				break;
			case "fov":
				System.camera.perspectiveCamera.fov = +config.fov;
				break;
			case "aspectRatio":
				let aspectRatio = window.innerWidth / window.innerHeight;
				if (config.aspectRatio != "native") {
					const configRatio = config.aspectRatio.split(":");
					aspectRatio = configRatio[0] / configRatio[1];
				}
				System.camera.perspectiveCamera.aspect = aspectRatio;
				break;
			case "renderDistance":
				System.camera.perspectiveCamera.far = +config.renderDistance;
				break;
		}
		System.camera.perspectiveCamera.updateProjectionMatrix();
	}

	function rangeOnInput() {
		const percent =
			(100 * (this.value - this.getAttribute("min"))) /
			(this.getAttribute("max") - this.getAttribute("min"));
		this.style.background =
			"linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) " +
			percent +
			"%, rgba(255,255,255,0.4) " +
			percent +
			"%, rgba(255,255,255,0.4) 100%)";
		this.nextElementSibling.value = this.value;
		config[this.name] = this.value;
		applyChanges(this.name);
	}

	function textOnKeydown() {
		const key = event.code;

		if (key === "Tab") return;

		const controls = document.querySelectorAll("input[type=text]");
		for (const control of controls) {
			if (control.value === key) {
				config.controls[control.name] = control.value = "";
			}
		}
		config.controls[this.name] = this.value = key;
		this.blur();
	}

	function textOnClick() {
		System.input.controls[this.name] = config.controls[
			this.name
		] = this.value = "";
	}

	function onInput() {
		config[this.name] = this.value;
		applyChanges(this.name);
	}

	for (const element of document.getElementById("menu-sidebar").children) {
		element.addEventListener("click", () => {
			document
				.querySelector(".setting-label[data-selected]")
				.removeAttribute("data-selected");
			document
				.querySelector(".setting[data-selected]")
				.removeAttribute("data-selected");
			element.setAttribute("data-selected", "");
			document
				.querySelector(
					".setting[data-setting=" +
						element.getAttribute("data-setting") +
						"]"
				)
				.setAttribute("data-selected", "");
		});
	}

	for (const element of document.querySelectorAll(
		".setting input:not([type=number]), .setting select"
	)) {
		if (element.type === "text") {
			if (!(cached || config.controls.hasOwnProperty(element.name)))
				config.controls[element.name] = element.getAttribute(
					"data-default"
				);
			else element.value = config.controls[element.name];
		} else {
			if (!(cached || config.hasOwnProperty(element.name)))
				config[element.name] = element.getAttribute("data-default");
			else element.value = config[element.name];
		}

		switch (element.type) {
			case "range":
				const percent =
					(100 * (element.value - element.getAttribute("min"))) /
					(element.getAttribute("max") - element.getAttribute("min"));
				element.style.background =
					"linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) " +
					percent +
					"%, rgba(255,255,255,0.4) " +
					percent +
					"%, rgba(255,255,255,0.4) 100%)";
				element.nextElementSibling.value = element.value;
				element.addEventListener("input", rangeOnInput);
				break;
			case "text":
				element.addEventListener("keydown", textOnKeydown);
				element.nextElementSibling.addEventListener(
					"click",
					textOnClick
				);
				break;
			default:
				element.addEventListener("input", onInput);
		}
	}

	document
		.getElementById("restore-defaults")
		.addEventListener("click", () => {
			for (const element of document.querySelectorAll(
				".setting[data-selected] input:not([type=number]), .setting select"
			)) {
				const dataDefault = element.getAttribute("data-default");

				if (element.type === "range") {
					const percent =
						(100 * (dataDefault - element.getAttribute("min"))) /
						(element.getAttribute("max") -
							element.getAttribute("min"));
					element.style.background =
						"linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) " +
						percent +
						"%, rgba(255,255,255,0.4) " +
						percent +
						"%, rgba(255,255,255,0.4) 100%)";
					element.nextElementSibling.value = dataDefault;
				}

				element.value = dataDefault;
				if (element.type === "text")
					config.controls[element.name] = dataDefault;
				else config[element.name] = dataDefault;
				applyChanges(element.name);
			}
		});
}

export default System;

import * as THREE from "https://threejs.org/build/three.module.js";
import * as Engine from "./core/Engine.js";
import * as GameObject from "./GameObject.js";

let peer,
	connections = [],
	serverID,
	peerID,
	isHosting,
	nickname;

window.addEventListener("load", () => {
	const oldNickname = localStorage.getItem("nickname");
	if (oldNickname !== null) {
		document.getElementsByClassName("nickname")[0].value = oldNickname;
		document.getElementsByClassName("nickname")[1].value = oldNickname;
	}

	document.getElementById("join-submit").addEventListener("submit", loadGame);
	document.getElementById("host-submit").addEventListener("submit", loadGame);
	document.getElementById("next-button").addEventListener("click", () => {
		document.getElementById("splash-page").style.display = "none";
		document.getElementById("host-submit").style.display = "block";
	});
});

function init() {
	let geo, mat, mesh;

	//html stuff
	document.getElementById("log").textContent = "Server Code: " + serverID;
	document.getElementById("launcher").remove();
	document.getElementById("loading").remove();
	document.getElementById("game").style.display = "";

	Engine.System.init();

	// lighting
	const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
	hemiLight.color.setHSL(0.6, 1, 0.6);
	hemiLight.groundColor.setHSL(0.095, 1, 0.75);
	hemiLight.position.set(0, 100, 0);
	new Engine.Entity().addComponent("Object3D", hemiLight);

	const dirLight = new THREE.DirectionalLight(0xffffff, 1);
	dirLight.color.setHSL(0.1, 1, 0.95);
	dirLight.position.set(-1, 1.75, 1);
	dirLight.position.multiplyScalar(100);

	dirLight.castShadow = true;

	dirLight.shadow.mapSize.width = 2048;
	dirLight.shadow.mapSize.height = 2048;

	const d = 50;

	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;

	dirLight.shadow.camera.far = 3500;
	dirLight.shadow.bias = -0.0001;

	new Engine.Entity().addComponent("Object3D", dirLight);

	// floor
	geo = new THREE.PlaneBufferGeometry(200, 200);
	mat = new THREE.MeshPhongMaterial({
		color: 0x718e3e,
	});
	mesh = new THREE.Mesh(geo, mat);
	mesh.position.y = 0;
	mesh.rotation.x = -Math.PI / 2;
	mesh.receiveShadow = true;

	new Engine.Entity().addComponent("Object3D", mesh).addComponent("Collider");
	new Engine.Entity().addComponent(
		"Object3D",
		new THREE.GridHelper(1000, 1000, 0x0000ff, 0x808080)
	);

	GameObject.Cube();
	GameObject.Player();
	GameObject.Ball();

	window.requestAnimationFrame(Engine.System.gameLoop);
}

async function loadGame(event) {
	document.getElementById("launcher").style.display = "none";
	document.getElementById("loading").style.display = "flex";

	isHosting = event.target.id === "host-submit";
	nickname = document.getElementsByClassName("nickname")[+isHosting].value;
	localStorage.setItem("nickname", nickname);
	serverID = document.getElementById("join").value.replace(/\s/g, "");

	await Engine.Asset.init();

	document.getElementById("loading-info").textContent =
		"Connecting to server...";

	newPeer();
}

function addNewConnection(conn) {
	const id = conn.peer;

	if (id === peerID || connections.hasOwnProperty(id)) return;

	conn.on("open", () => {
		if (connections.hasOwnProperty(id)) return;
		if (id === serverID) {
			init();
		}
		connections[id] = [conn];
		gameObjects[id] = new GAMEOBJECT.OtherPlayer(id);
		conn.send({
			type: "overhead",
			id: peerID,
			nickname: nickname,
		});
	});

	conn.on("data", (data) => {
		if (gameObjects.hasOwnProperty(data.id)) {
			const object = gameObjects[id];
			switch (data.type) {
				case "update":
					const pos = data.pos;
					object.pos.set(pos.x, pos.y, pos.z);
					object.rotationY = data.rotationY;
					object.animationName = data.animationName;
					object.animationDir = data.animationDir;
					break;
				case "overhead":
					object.addOverhead(data.nickname);
					break;
			}
		} else {
			switch (data.type) {
				case "playerList":
					const playerList = data.playerList;
					for (const player of playerList)
						addNewConnection(peer.connect(player));
					break;
			}
		}
	});

	conn.on("error", (err) => {
		const conn = peer.connect(id);
		addNewConnection(conn);
	});

	conn.on("close", () => {
		const id = conn.peer;
		if (gameObjects[id]) {
			gameObjects[id].delete();
			delete gameObjects[id];
		}
		delete connections[id];
	});
}

async function newPeer() {
	const options = {
		secure: true,
		host: "peerjs-cloud9c.herokuapp.com",
	};

	if (isHosting) {
		let id = "";
		const response = await fetch("./js/words.json");
		const data = await response.json();
		for (let i = 0; i < 3; i++)
			id += data
				.splice(Math.floor(Math.random() * data.length), 1)
				.toString();
		peer = new Peer(id, options);
	} else {
		peer = new Peer(options);
	}

	peer.on("open", (id) => {
		peerID = id;
		if (isHosting) {
			serverID = id;
			init();
		} else {
			const conn = peer.connect(serverID);
			addNewConnection(conn);
		}
	});

	peer.on("connection", addNewConnection);

	peer.on("error", (err) => {
		//TODO, add all errors
		if (err.type === "unavailable-id") newPeer();
	});

	peer.on("disconnected", () => {
		peer.reconnect();
	});

	window.addEventListener("unload", () => {
		peer.destroy();
	});
}

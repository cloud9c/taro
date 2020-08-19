import { OIMO } from "./lib/oimoPhysics.js";
const Physics = {
	_accumulator: 0,
	fixedTimestep: 0.02,
	_world: new OIMO.World(2),
};

export { Physics };

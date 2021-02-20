# Time

Interface into the Time system used by App.

## Constructor

### Time( parameters : <span class="param">Object</span> )
**parameters** — Object with properties defining the system's behaviour. In all cases, it will assume defaults when parameters are missing. The following are valid parameters:

**fixedTimestep** — A framerate-independent interval that dictates when physics calculations and fixedUpdate events are performed. Default is **0.02**.<br>
**maxDeltaTime** — Clamps per-frame delta time to an upper bound. Default is **0.1**.<br>
**timeScale** — The speed at which time progresses. Default is **1**.

## Properties

### .<a>deltaTime</a> : <span class="param">Float</span>
The completion time in seconds since the last frame.

### .<a>fixedTimestep</a> : <span class="param">Float</span>
A framerate-independent interval that dictates when physics calculations and fixedUpdate events are performed. Default is **0.02**.

### .<a>lastTimestamp</a> : <span class="param">Float</span>
The last reported DOMHighResTimeStamp. Used to calculate deltaTime.

### .<a>maxDeltaTime</a> : <span class="param">Float</span>
Clamps per-frame delta time to an upper bound. Default is **0.1**.

### .<a>scaledFixedTimestep</a> : <span class="param">Float</span>
fixedTimestep scaled by the timeScale. Used for physics calculations.

### .<a>timeScale</a> : <span class="param">Float</span>
The speed at which time progresses. Change this value to simulate bullet-time effects. A value of 1 means real-time. A value of .5 means half speed; a value of 2 is double speed. Default is **1**.

## Source
[src/core/Time.js](https://github.com/Cloud9c/taro/blob/master/src/core/Time.js)
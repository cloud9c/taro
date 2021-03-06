[Component](api/core/Component) ›

# AudioListener
Representation of a listener in 3D space.

This class implements a microphone-like device. It records the sounds around it and plays that through the player's speakers. You can only have one listener in a Scene.

## Code Example

```javascript
var listener = new Entity();
listener.addComponent('audioListener');

var sound = new Entity();
sound.addComponent('audio', {
	asset: 'sounds/boop.mp3',
	autoplay: true
});
```

## Data Parameters

| Property     | Description                          | Default Value |
|--------------|--------------------------------------|---------------|
| masterVolume | The master volume of the listener.   | 1             |
| timeDelta    | Time delta value for audio entities. | 0             |

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>ref</a> : <span class="param">[AudioListener](https://threejs.org/docs/#api/en/audio/AudioListener)</span>
Reference to the scene's [AudioListener](https://threejs.org/docs/#api/en/audio/AudioListener).

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/components/AudioListener.js](https://github.com/Cloud9c/taro/blob/master/src/components/AudioListener.js)
[Component](api/core/Component) ›

# Audio
A representation of audio sources in 3D. In order to play sounds you also need to have a [AudioListener](api/components/AudioListener).

Positional audio changes based on the entity's position from the AudioListener, while non-positional audio is played globally.

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

## Events

### error
Fires when an asset failed to load. Property `event` is provided (XMLHttpRequest error event).

### load
Fires when an asset failed to load. Property `buffer` is provided (loaded AudioBuffer).

### progress
Fires when an asset is loaded. Property `event` is provided (XMLHttpRequest progress event).

## Data Parameters

| Property     | Description                                                                    | Default Value |
|--------------|--------------------------------------------------------------------------------|---------------|
| asset        | The url to an AudioBuffer or an AudioBuffer instance.                          | ""            |
| autoplay     | Whether to start playback automatically.                                       | false         |
| detune       | Modify pitch, measured in cents. +/- 100 is a semitone. +/- 1200 is an octave. | 0             |
| duration     | Overrides the duration of the audio. Zero will play the whole buffer.          | 0             |
| loop         | Whether playback should loop.                                                  | false         |
| loopEnd      | Where in the AudioBuffer to restart the loop.                                  | 0             |
| loopStart    | Where in the AudioBuffer the restart of the play must happen.                  | 0             |
| offset       | An offset to the time within the audio buffer that playback should begin.      | 0             |
| playbackRate | Speed of playback.                                                             | 1             |
| positional   | Whether the audio is positional.                                               | false         |
| volume       | Volume of playback.                                                            | 1             |

### positional

| Property      | Description                                                                                                        | Default Value |
|---------------|--------------------------------------------------------------------------------------------------------------------|---------------|
| distanceModel | Distance algorithm: linear, inverse, or exponential                                                                | "inverse"     |
| maxDistance   | The maximum distance between the audio source and the listener, after which the volume is not reduced any further. | 10000         |
| refDistance   | Reference distance for reducing volume as the audio source moves further from the listener                         | 1             |
| rolloffFactor | How quickly the volume is reduced as the source moves away from the listener.                                      | 1             |

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>positional</a> : <span class="param">Boolean</span>
Whether the audio is positional. Modifying this property does not change the audio's positionality.

### .<a>ref</a> : <span class="param">[BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry)</span>
Reference to the three.js [Audio](https://threejs.org/docs/#api/en/audio/Audio) or [PositionalAudio](https://threejs.org/docs/#api/en/audio/PositionalAudio).

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/components/Audio.js](https://github.com/Cloud9c/taro/blob/master/src/components/Audio.js)
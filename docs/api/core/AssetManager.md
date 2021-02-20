# AssetManager

A simple asset retrieval system used internally by core components (Geometry, Material, etc.).

## Constructor

### AssetManager()
Creates a new AssetManager object.

## Properties

### .<a>enabled</a> : <span class="param">Boolean</span>
Whether asset caching is enabled. Default is **false**.

### .<a>files</a> : <span class="param">Object</span>
An object that holds cached assets.

## Methods

### .<a>add</a> ( key : <span class="param">String</span>, file : <span class="param">Object</span> ) : <span class="param">null</span>
key — The key to reference the cached file by.
file — The file to be cached.

Adds an cache entry with a key to reference the file. If this key already holds a file, it is overwritten.

### .<a>get</a> ( key : <span class="param">String</span> ) : <span class="param">null</span>
key — A string key

Get the value of key. If the key does not exist **undefined** is returned.

### .<a>remove</a> ( key : <span class="param">String</span> ) : <span class="param">null</span>
key — A string key that references a cached file.

Remove the cached file associated with the key.

### .<a>clear</a> () : <span class="param">null</span>
Remove all values from the cache.

## Source
[src/core/AssetManager.js](https://github.com/Cloud9c/taro/blob/master/src/core/AssetManager.js)
# How to run things locally
If you use just procedural geometries and don't load any textures, webpages should work straight from the file system, just double-click on HTML file in a file manager and it should appear working in the browser (you'll see file:///yourFile.html in the address bar).

## Content loaded from external files
If you load models or textures from external files, due to browsers' same origin policy security restrictions, loading from a file system will fail with a security exception.

There are two ways to solve this:

1. Change security for local files in a browser. This allows you to access your page as:

```http
file:///yourFile.html
```

2. Run files from a local web server. This allows you to access your page as:

```http
http://localhost/yourFile.html
```

## Run a local server
Many programming languages have simple HTTP servers built in. They are not as full featured as production servers such as Apache or NGINX, however they should be sufficient for testing your taro.js application.

### Servez
[Servez](https://greggman.github.io/servez/) is a simple server with a GUI.

### Node.js http-server
Node.js has a simple HTTP server package. To install:
```bash
npm install http-server -g
```
To run (from your local directory):
```bash
http-server . -p 8000
```

### Python server
If you have Python installed, it should be enough to run this from a command line (from your working directory):
```python
//Python 2.x
python -m SimpleHTTPServer

//Python 3.x
python -m http.server
```
This will serve files from the current directory at localhost under port 8000, i.e in the address bar type:

http://localhost:8000/

Other simple alternatives are [discussed here](https://stackoverflow.com/questions/12905426/what-is-a-faster-alternative-to-pythons-http-server-or-simplehttpserver) on Stack Overflow.
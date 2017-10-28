var camera, scene, renderer;
var imgmesh, splmesh, sprmesh;
var element;
var effect, controls;

function init() {

  // SCENE
  scene = new THREE.Scene();

  // CAMERA
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight,
    1, 100);
  camera.position.set(1, 15, 5);
  scene.add(camera);

  // TEXTURES:
  // img
  var imgtex = new THREE.TextureLoader().load('../textures/dog.jpg');
  var imggeo = new THREE.PlaneBufferGeometry(192, 108);
  var imgmat = new THREE.MeshBasicMaterial({
    map: imgtex
  });
  imgmesh = new THREE.Mesh(imggeo, imgmat);
  imgmesh.position.set(0, 0, -100);
  scene.add(imgmesh);

  // floor flr
  var flrtex = new THREE.TextureLoader().load('../textures/grass.jpg');
  flrtex.wrapS = THREE.RepeatWrapping;
  flrtex.wrapT = THREE.RepeatWrapping;
  flrtex.repeat = new THREE.Vector2(50, 50);
  var flrmat = new THREE.MeshBasicMaterial({
    map: flrtex
  });
  var flrgeo = new THREE.PlaneBufferGeometry(1000, 1000);
  var flrmesh = new THREE.Mesh(flrgeo, flrmat);
  flrmesh.rotation.x = -Math.PI / 2;
  scene.add(flrmesh);

  // DEVELOPMENT TEXTURES
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshBasicMaterial({
    color: 0x000000
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(0, 0, 0);
  scene.add(splmesh);
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshBasicMaterial({
    color: 0xFF0000
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(100, 0, 0);
  scene.add(splmesh);
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshBasicMaterial({
    color: 0x00FF00
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(0, 0, 100);
  scene.add(splmesh);
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshBasicMaterial({
    color: 0x0000FF
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(0, 100, 0);
  scene.add(splmesh);

  // RENDERER
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  element = renderer.domElement;
  document.body.appendChild(element);

  // EFFECT
  effect = new THREE.StereoEffect(renderer);

  // CONTROLS
  control = new THREE.OrbitControls(camera, element);
  control.target.set(camera.position.x + 0.15, camera.position.y, camera.position
    .z);
  control.enablePan = true;
  control.enableZoom = true;

  function setOrientationControls(e) {
    // if the data is invalid
    if (!e.alpha) {
      return;
    }

    control = new THREE.DeviceOrientationControls(camera, true);
    control.connect();
    control.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls,
      true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);

  window.addEventListener('resize', onWindowResize, false);
  animate();
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.001;
  // mesh.rotation.y += 0.008;

  renderer.render(scene, camera);
}

// https://github.com/sitepoint-editors/VRWeatherParticles/blob/master/index.html
function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

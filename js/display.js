var camera, scene, renderer;
var imgmesh, splmesh, sprmesh;
var element;
var effect, controls;
var imggeo, imgmesh;
// used for touch events
var objects = [];

function init() {

  // SCENE
  scene = new THREE.Scene();

  // CAMERA
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight,
    1, 10000);
  camera.position.set(1, 5, 5);
  scene.add(camera);

  // RENDERER
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  element = renderer.domElement;
  document.body.appendChild(element);

  // TEXTURES:
  var texloader = new THREE.TextureLoader();
  // img
  var imgtex = texloader.load('../textures/dog.jpg');
  var width = 192,
    height = 108,
    width_segments = 1,
    height_segments = 100;
  imggeo = new THREE.PlaneGeometry(width, height, width_segments,
    height_segments);
  for (var i = 0; i < imggeo.vertices.length / 2; i++) {
    imggeo.vertices[2 * i].z = Math.pow(2, i / 20);
    imggeo.vertices[2 * i + 1].z = Math.pow(2, i / 20);
  }
  // var imggeo = new THREE.PlaneBufferGeometry(192, 108);
  var imgmat = new THREE.MeshBasicMaterial({
    map: imgtex
  });
  imgmesh = new THREE.Mesh(imggeo, imgmat);
  // imgmesh.doubleSided = true;
  // imgmesh.rotation.y = Math.PI / 2 - 0.5;
  // 50 seems to push it up to the bottom edge
  imgmesh.position.set(0, 50, -75);
  scene.add(imgmesh);
  objects.push(imgmesh);


  // var width = 192,
  //   height = 108,
  //   width_segments = 1,
  //   height_segments = 100;
  // imgmmesh = new THREE.Mesh(imggeo, new THREE.MeshBasicMaterial({
  //   color: 0x888888
  // }));
  // scene.add(imgmesh);

  // floor flr
  var flrtex = texloader.load('../textures/grass.jpg');
  flrtex.wrapS = THREE.RepeatWrapping;
  flrtex.wrapT = THREE.RepeatWrapping;
  flrtex.repeat = new THREE.Vector2(50, 50);
  flrtex.anistropy = renderer.getMaxAnistropy;
  var flrmat = new THREE.MeshBasicMaterial({
    map: flrtex
  });
  var flrgeo = new THREE.PlaneBufferGeometry(1000, 1000);
  var flrmesh = new THREE.Mesh(flrgeo, flrmat);
  flrmesh.rotation.x = -Math.PI / 2;
  scene.add(flrmesh);

  // sky
  var skygeo = new THREE.SphereGeometry(10000, 0, 0);
  var skytex = texloader.load('../textures/night.jpg');
  skytex.anistropy = renderer.getMaxAnistropy;
  var skymat = new THREE.MeshBasicMaterial({
    map: skytex
  });
  var skymesh = new THREE.Mesh(skygeo, skymat);
  skymesh.material.side = THREE.BackSide;
  scene.add(skymesh);

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
  splmesh.position.set(5, 0, 0);
  scene.add(splmesh);
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshBasicMaterial({
    color: 0x00FF00
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(0, 0, 5);
  scene.add(splmesh);
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshBasicMaterial({
    color: 0x0000FF
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(0, 5, 0);
  scene.add(splmesh);

  // particle
  particleMaterial = new THREE.SpriteCanvasMaterial({
    color: 0x000000,
    program: function(context) {
      context.beginPath();
      context.arc(0, 0, 0.5, 0, PI2, true);
      context.fill();
    }
  });


  // EFFECT
  effect = new THREE.StereoEffect(renderer);

  // CONTROLS
  // LOOK AROUND
  control = new THREE.OrbitControls(camera, element);
  control.target.set(camera.position.x + 0.15, camera.position.y, camera.position
    .z);
  control.enablePan = false;
  control.enableZoom = false;

  window.addEventListener('deviceorientation', setOrientationControls, true);

  // TOUCH EVENTS
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('touchestart', onDocumentTouchStart, false);

  // WINDOW
  window.addEventListener('resize', onWindowResize, false);
  animate();
}

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

function onDocumentTouchStart(event) {
  event.preventDefault();
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onDocumentMouseDown(event);
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0) {
    intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    // var particle = new THREE.Sprite(particleMaterial);
    // particle.position.copy(intersects[0].point);
    // particle.scale.x = particle.scale.y = 16;
    // scene.add(particle);
  }
}

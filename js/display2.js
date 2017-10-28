var camera;
var imgmesh, splmesh, sprmesh;
var element;
var effect;
var imggeo, imgmesh;
var imageiterator = 0;
var sounditer = 0;
var radioid;
var audiolistener, sound, audioLoader;

var manager = new THREE.LoadingManager();
var texloader = new THREE.TextureLoader(manager);

var renderer = new THREE.WebGLRenderer({
  antialias: true
});
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,
  1, 1000);
var control = new THREE.OrbitControls(camera, element);
var scene = new THREE.Scene();
var origin = new THREE.Object3D();

var recLight, recLightHelper;

function init() {
  // RENDERER
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  element = renderer.domElement;
  document.body.appendChild(element);

  // CAMERA
  camera.position.set(0, 4, 0);
  scene.add(camera);
  scene.add(origin);

  // WARNINGS
  var gl = renderer.context;
  // Check for float-RT support
  // TODO (abelnation): figure out fall-back for float textures
  if (!gl.getExtension('OES_texture_float')) {
    alert('OES_texture_float not supported');
    throw 'missing webgl extension';
  }
  if (!gl.getExtension('OES_texture_float_linear')) {
    alert('OES_texture_float_linear not supported');
    throw 'missing webgl extension';
  }

  // ORIGIN
  scene.add(origin);

  // TEXTURES:
  manager.onProgress = function(item, loaded, total) {
    console.log(item, loaded, total);
  };

  // img
  var src = (arrOfWebpImages.length != 0) ? arrOfWebpImages[imageiterator][
      "webp_images"
    ][0]
    ["source"] : "../textures/dog.jpg";
  var imgtex = texloader.load(src);
  var width = 24,
    height = 13.5,
    width_segments = 1,
    height_segments = 100;
  imggeo = new THREE.PlaneGeometry(width, height, width_segments,
    height_segments);
  // for (var i = 0; i < imggeo.vertices.length / 2; i++) {
  //   imggeo.vertices[2 * i].z = Math.pow(2, i / 20);
  //   imggeo.vertices[2 * i + 1].z = Math.pow(2, i / 20);
  // }
  // var imggeo = new THREE.PlaneBufferGeometry(192, 108);
  var imgmat = new THREE.MeshStandardMaterial({
    map: imgtex,
    polygonOffset: true
  });
  imgmesh = new THREE.Mesh(imggeo, imgmat);
  // imgmesh.doubleSided = true;
  // imgmesh.rotation.y = Math.PI / 2 - 0.5;
  // 50 seems to push it up to the bottom edge
  imgmesh.position.set(0, 6, -24.9);
  imgmesh.castShadow = true;
  imgmesh.receiveShadow = true;
  scene.add(imgmesh);


  // floor flr
  var floorMat = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    color: 0xffffff,
    metalness: 0.2,
    bumpScale: 0.0005
  });
  texloader.load("textures/hardwood2_diffuse.jpg", function(map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(100, 100);
    floorMat.map = map;
    floorMat.needsUpdate = true;
  });
  texloader.load("textures/hardwood2_bump.jpg", function(map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(100, 100);
    floorMat.bumpMap = map;
    floorMat.needsUpdate = true;
  });
  texloader.load("textures/hardwood2_roughness.jpg", function(map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(100, 100);
    floorMat.roughnessMap = map;
    floorMat.needsUpdate = true;
  });
  var floorGeometry = new THREE.PlaneBufferGeometry(200, 200);
  var floorMesh = new THREE.Mesh(floorGeometry, floorMat);
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI / 2.0;
  scene.add(floorMesh);


  // sky
  var skygeo = new THREE.SphereGeometry(10000, 32, 32);
  var skytex = texloader.load('../textures/sky.jpg');
  skytex.anistropy = renderer.getMaxAnistropy;
  var skymat = new THREE.MeshStandardMaterial({
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
  splmesh.position.set(0, 5, 0);
  scene.add(splmesh);
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshBasicMaterial({
    color: 0x0000FF
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(0, 0, 5);
  scene.add(splmesh);

  // AUDIO
  audiolistener = new THREE.AudioListener();
  camera.add(audiolistener);
  sound = new THREE.PositionalAudio(audiolistener);
  audioLoader = new THREE.AudioLoader();
  var track = musicTopTracksPreviewList[sounditer];
  audioLoader.load(
    track,
    function(buffer) {
      sound.setBuffer(buffer);
      sound.setRefDistance(20);
      sound.play();
    });

  // OBJECTS
  THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
  // man
  var manmtlLoader = new THREE.MTLLoader();
  manmtlLoader.setPath('./obj/male02/');
  manmtlLoader.load('male02_dds.mtl', function(materials) {
    materials.preload();
    var manobjLoader = new THREE.OBJLoader();
    manobjLoader.setMaterials(materials);
    manobjLoader.setPath('./obj/male02/');
    manobjLoader.load('male02.obj', function(object) {
      object.castShadow = true;
      object.position.set(15, 0, 0);
      object.scale.set(0.05, 0.05, 0.05);
      object.rotation.y = -Math.PI / 2;
      scene.add(object);
    }, onProgress, onError);
  });
  // radio
  var radioobjloader = new THREE.OBJLoader();
  radioobjloader.setPath('./obj/pocket/');
  radioobjloader.load('RT711.obj', function(object) {
    // object.castShadow = true;
    // object.receiveShadow = true;
    object.position.set(-20, 0, 0);
    object.rotation.set(0, Math.PI / 2, 0);
    object.scale.set(0.65, 0.65, 0.65);
    object.add(sound);
    scene.add(object);
    radioid = object.uuid;
  }, onProgress, onError);
  // man
  var truckmtlloader = new THREE.MTLLoader();
  truckmtlloader.setPath('./obj/red-pickup/');
  truckmtlloader.load('pickup.mtl', function(materials) {
    materials.preload();
    var truckobjloader = new THREE.OBJLoader();
    truckobjloader.setMaterials(materials);
    truckobjloader.setPath('./obj/red-pickup/');
    truckobjloader.load('pickup.obj', function(object) {
      object.castShadow = true;
      object.scale.set(10, 10, 10);
      scene.add(object);
      object.position.set(0, 0, 30);
      object.rotation.set(0, Math.PI / 2, 0);
      scene.add(object);
    }, onProgress, onError);
  });

  // LIGHTING
  rectLight = new THREE.RectAreaLight(0xffffff, 1000, 24, 13.5);
  rectLight.position.set(0, 6, -25);
  rectLightHelper = new THREE.RectAreaLightHelper(rectLight);
  scene.add(rectLightHelper);
  scene.add(rectLight);
  var ambient = new THREE.AmbientLight(0x101010);
  scene.add(ambient);

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
  control.target.set(
    camera.position.x + 0.15, camera.position.y, camera.position
    .z);
  control.enablePan = false;
  control.enableZoom = false;

  window.addEventListener('deviceorientation', setOrientationControls,
    true);

  // TOUCH EVENTS
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  document.addEventListener(
    'mousedown', onDocumentMouseDown, false);
  document.addEventListener(
    'touchestart', onDocumentTouchStart, false);

  // WINDOW
  window.addEventListener('resize', onWindowResize, false);
  animate();
}

var onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
};

var onError = function(xhr) {};

function setOrientationControls(e) {
  // if the data is invalid
  if (!e.alpha) {
    return;
  }

  control = new THREE.DeviceOrientationControls(camera, true);
  control.connect();
  control.update();

  element.addEventListener('click', fullscreen, false);

  window.removeEventListener('deviceorientation',
    setOrientationControls,
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

function render() {
  recLightHelper.update();
  rnd.render(scn, cam);
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
  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    if (arrOfWebpImages.length != 0 && intersects[0].object == imgmesh) {
      imageiterator = (imageiterator + 1) % arrOfWebpImages.length;
      var src = arrOfWebpImages[imageiterator]["webp_images"][0]["source"];
      var imgtex = texloader.load(src);
      var imgmat = new THREE.MeshBasicMaterial({
        map: imgtex
      });
      intersects[0].object.material = imgmat;
    }
    if (musicTopTracksPreviewList.length != 0 && intersects[0].object.parent.uuid ==
      radioid) {
      sounditer = (sounditer + 1) % musicTopTracksPreviewList.length;
      var track = musicTopTracksPreviewList[sounditer];
      sound.stop();
      audioLoader.load(
        track,
        function(buffer) {
          sound.setBuffer(buffer);
          sound.setRefDistance(20);
          sound.play();
        });
    }
  }
}

// https://github.com/mrdoob/three.js/blob/dev/examples/webgl_loader_obj.html
var onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
};

var onError = function(xhr) {};

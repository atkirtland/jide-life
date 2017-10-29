

//  Does this browser support the WebVR API?
//  Here’s how to download and configure one that does:
//  https://webvr.rocks
WEBVR.checkAvailability().catch(function(message) {
  document.body.appendChild(WEBVR.getMessageContainer(message))
})


var camera;
var imgmesh, splmesh, sprmesh;
var element;
var effect;
var imggeo, imgmesh;
var imageiterator = 0;
var sounditer = 0;
var radioid;
var audiolistener, sound, audioLoader;
var spotLight1, spotLight1Helper;
var pointLight;

var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.vr.enabled = true;
renderer.vr.standing = true;
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,
  1, 10000);
var control; // = new THREE.OrbitControls(camera, element);
var scene = new THREE.Scene();
var origin = new THREE.Object3D();

var recLight, recLightHelper, truckpl;

var manager = new THREE.LoadingManager();
var texloader = new THREE.TextureLoader(manager);
var fontloader = new THREE.FontLoader(manager);

var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  size = 256;

function changeCanvas() {
  ctx.font = '20pt Arial';
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
  ctx.fillStyle = 'black';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  var docs = newsList[Math.round(Math.random())].response.docs;
  ctx.fillText(docs[Math.round(Math.random() * docs.length)].abstract, canvas.width / 2, canvas.height / 2);
}

function init(font) {
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
      "images"
    ][0]
    ["source"] : "../textures/dog.jpg";
  var imgtex = texloader.load(src);
  var width = 24,
    height = 13.5,
    width_segments = 1,
    height_segments = 100;
  imggeo = new THREE.PlaneGeometry(width, height, width_segments,
    height_segments);
  var imgmat = new THREE.MeshBasicMaterial({
    map: imgtex,
    polygonOffset: true
  });
  imgmesh = new THREE.Mesh(imggeo, imgmat);
  imgmesh.position.set(0, 6, -24.9);
  imgmesh.castShadow = true;
  imgmesh.receiveShadow = true;
  scene.add(imgmesh);
  // img lighting
  rectLight = new THREE.RectAreaLight(0xffffff, 100, 24, 13.5);
  rectLight.position.set(0, 6, -25);
  rectLightHelper = new THREE.RectAreaLightHelper(rectLight);
  scene.add(rectLightHelper);
  scene.add(rectLight);

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

  // DEVELOPMENT TEXTURES
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshStandardMaterial({
    color: 0x000000
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(0, 0, 0);
  scene.add(splmesh);
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshStandardMaterial({
    color: 0xFF0000
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(5, 0, 0);
  scene.add(splmesh);
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshStandardMaterial({
    color: 0x00FF00
  });
  splmesh = new THREE.Mesh(splgeo, splmat);
  splmesh.position.set(0, 5, 0);
  scene.add(splmesh);
  // spl
  var splgeo = new THREE.BoxGeometry(1, 1, 1);
  var splmat = new THREE.MeshStandardMaterial({
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
  spotLight1 = new THREE.SpotLight(0x404040, 1, 0, Math.PI, 1);
  spotLight1.intensity = 30;
  spotLight1.position.set(-5, 15, -15);
  spotLight1.target.position.set(16, 4, 0);
  spotLight1.angle = 0.3;
  spotLight1.castShadow = true;
  spotLight1.shadow.mapSize.width = 1;
  spotLight1.shadow.mapSize.height = 1;
  spotLight1.shadow.camera.near = 1;
  spotLight1.shadow.camera.far = 100;
  spotLight1.shadow.camera.fov = 3;
  scene.add(spotLight1.target);
  scene.add(spotLight1);
  THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
  var manmtlLoader = new THREE.MTLLoader();
  manmtlLoader.setPath('./obj/male02/');
  manmtlLoader.load('male02_dds.mtl', function(materials) {
    materials.preload();
    var manobjLoader = new THREE.OBJLoader();
    manobjLoader.setMaterials(materials);
    manobjLoader.setPath('./obj/male02/');
    manobjLoader.load('male02.obj', function(object) {
      object.receiveShadow = true;
      object.castShadow = true;
      object.position.set(15, 0, 6);
      object.scale.set(0.05, 0.05, 0.05);
      object.rotation.y = -Math.PI / 2;
      scene.add(object);
    }, onProgress, onError);
  });

  // radio
  var plsphere = new THREE.SphereGeometry(0.2, 0.2, 0.2);
  pointLight = new THREE.PointLight(0xffffff, 0.4, 10);
  pointLight.add(new THREE.Mesh(plsphere, new THREE.MeshBasicMaterial({
    color: 0xffffff
  })));
  pointLight.position.set(-11, 10, -2);
  scene.add(pointLight);

  var radioobjloader = new THREE.OBJLoader();
  radioobjloader.setPath('./obj/pocket/');
  radioobjloader.load('RT711.obj', function(object) {
    object.castShadow = true;
    object.receiveShadow = true;
    object.position.set(-20, 0, 0);
    object.rotation.set(0, Math.PI / 2, 0);
    object.scale.set(0.65, 0.65, 0.65);
    object.add(sound);
    scene.add(object);
    radioid = object.uuid;
  }, onProgress, onError);
  // truck
  var trucksphere = new THREE.SphereGeometry(0.1, 0.1, 0.1);
  truckpl = new THREE.PointLight(0xffffff, 0.4, 10);
  truckpl.add(new THREE.Mesh(trucksphere, new THREE.MeshBasicMaterial({
    color: 0xffffff
  })));
  truckpl.position.set(0, 2, 20);
  scene.add(truckpl);
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
  // news
  texture = new THREE.Texture(canvas);
  var material = new THREE.MeshStandardMaterial({
    map: texture
  });
  geometry = new THREE.PlaneGeometry(12, 12);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(20, 8, 0);
  mesh.rotation.y = 3 * Math.PI / 2;
  scene.add(mesh);
  canvas.width = canvas.height = size;

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
  // effect = new THREE.VREffect(renderer);

  // CONTROLS
  // LOOK AROUND
  // control.target.set(
  //   camera.position.x + 0.15, camera.position.y, camera.position
  //   .z);
  // control.enablePan = false;
  // control.enableZoom = false;
  // fps

  // window.addEventListener('deviceorientation', setOrientationControls,
  //   true);

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

// function setOrientationControls(e) {
//   // if the data is invalid
//   if (!e.alpha) {
//     return;
//   }
//
//   control = new THREE.DeviceOrientationControls(camera, true);
//   control.connect();
//   control.update();
//
//   element.addEventListener('click', fullscreen, false);
//
//   window.removeEventListener('deviceorientation',
//     setOrientationControls,
//     true);
// }


//  This button is important. It toggles between normal in-browser view
//  and the brand new WebVR in-your-goggles view!
WEBVR.getVRDisplay(function(display) {
  renderer.vr.setDevice(display)
  document.body.appendChild(WEBVR.getButton(display, renderer.domElement))
})

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  var time = Date.now() * 0.0005;
  pointLight.position.y = Math.cos(time * 3) * 0.5 + 5;
  truckpl.position.x = Math.cos(time * 3) * 2;

  THREE.VRController.update();
  // effect.render(scene, camera);


  texture.needsUpdate = true;
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
  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
     if (arrOfWebpImages.length != 0 && intersects[0].object == imgmesh) {
       imageiterator = (imageiterator + 1) % arrOfWebpImages.length;
       var src = arrOfWebpImages[imageiterator]["images"][0]["source"];
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
     if (intersects[0].object == mesh){
        changeCanvas();
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



//  Check this out: When THREE.VRController finds a new controller
//  it will emit a custom “vr controller connected” event on the
//  global window object. It uses this to pass you the controller
//  instance and from there you do what you want with it.
window.addEventListener('vr controller connected', function(event) {
  //  Here it is, your VR controller instance.
  //  It’s really a THREE.Object3D so you can just add it to your scene:
  var controller = event.detail
  scene.add(controller)
  //  HEY HEY HEY! This is important. You need to make sure you do this.
  //  For standing experiences (not seated) we need to set the standingMatrix
  //  otherwise you’ll wonder why your controller appears on the floor
  //  instead of in your hands! And for seated experiences this will have no
  //  effect, so safe to do either way:
  controller.standingMatrix = renderer.vr.getStandingMatrix()
  //  And for 3DOF (seated) controllers you need to set the controller.head
  //  to reference your camera. That way we can make an educated guess where
  //  your hand ought to appear based on the camera’s rotation.
  controller.head = window.camera
  //  Right now your controller has no visual.
  //  It’s just an empty THREE.Object3D.
  //  Let’s fix that!
  var
    meshColorOff = 0xDB3236, //  Red.
    meshColorOn = 0xF4C20D, //  Yellow.
    controllerMaterial = new THREE.MeshStandardMaterial({
      color: meshColorOff
    }),
    controllerMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.05, 0.1, 6),
      controllerMaterial
    ),
    handleMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.1, 0.03),
      controllerMaterial
    )
  controllerMaterial.flatShading = true
  controllerMesh.rotation.x = -Math.PI / 2
  handleMesh.position.y = -0.05
  controllerMesh.add(handleMesh)
  controller.userData.mesh = controllerMesh //  So we can change the color later.
  controller.add(controllerMesh)
  castShadows(controller)
  receiveShadows(controller)
  //  Allow this controller to interact with DAT GUI.
  var guiInputHelper = dat.GUIVR.addInputObject(controller)
  scene.add(guiInputHelper)
  //  Button events. How easy is this?!
  //  We’ll just use the “primary” button -- whatever that might be ;)
  //  Check out the THREE.VRController.supported{} object to see
  //  all the named buttons we’ve already mapped for you!
  controller.addEventListener('primary press began', function(event) {
    event.target.userData.mesh.material.color.setHex(meshColorOn)
    guiInputHelper.pressed(true)
  })
  controller.addEventListener('primary press ended', function(event) {
    event.target.userData.mesh.material.color.setHex(meshColorOff)
    guiInputHelper.pressed(false)
  })
  //  Daddy, what happens when we die?
  controller.addEventListener('disconnected', function(event) {
    controller.parent.remove(controller)
  })
})

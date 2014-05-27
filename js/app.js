var container = document.getElementById('container');
var renderer = new THREE.WebGLRenderer( { alpha: true } );
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 10000);


renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);


/**
 *  EARTH
 */
var geometry  = new THREE.SphereGeometry(1, 64, 64);

var material         = new THREE.MeshPhongMaterial();
material.map         = THREE.ImageUtils.loadTexture('img/earthmap1k.jpg');
material.bumpMap     = THREE.ImageUtils.loadTexture('img/earthbump1k.jpg');
material.specularMap = THREE.ImageUtils.loadTexture('img/earthspec1k.jpg');
material.specular    = new THREE.Color('#555555');
material.bumpScale   = 0.05;

var earthMesh = new THREE.Mesh(geometry, material);

earthMesh.position.x = 0;
earthMesh.position.y = 0;
earthMesh.position.z = 0;


/**
 * CLOUDS
 */
var cloudMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1.01, 64, 64),
  new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('img/fair_clouds_4k.png'),
    transparent: true
  })
);
earthMesh.add(cloudMesh);


/**
 * LIGHTS
 */
var light = new THREE.DirectionalLight( 0xffffee, 0.8 );
light.position.set(2,2,10);


/**
 * UNIVERSE
 */
var geometry  = new THREE.SphereGeometry(12, 16, 16);
var material  = new THREE.MeshBasicMaterial();
material.map  = THREE.ImageUtils.loadTexture('img/galaxy_starfield.png');
material.side = THREE.BackSide;
var spaceMesh = new THREE.Mesh(geometry, material);


/**
 * MANAGE CAMERA
 */
camera.position.z = 3;
camera.lookAt(earthMesh.position);


/**
 * ADDING TO THE SCENE
 */
scene.add(light);
scene.add(camera);
scene.add(earthMesh);
scene.add(spaceMesh);


/**
 * RENDERING
 */
renderer.render(scene, camera);


/**
 * MOUSE LISTENER
 */
var mouse = {x : 0, y : 0};
document.addEventListener('mousemove', function(event){
	mouse.x = (event.clientX / window.innerWidth ) - 0.5;
	mouse.y = (event.clientY / window.innerHeight) - 0.5;
	camera.position.x += (mouse.x*10 - camera.position.x) / 1;
	camera.position.y += (mouse.y*10 - camera.position.y) / 1;
	camera.lookAt( scene.position );
	renderer.render(scene, camera);
}, false);


/**
 *  ANIMATION
 */
function animate(){
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 1/256 ;
    cloudMesh.rotation.y += 1/1200 ;
    renderer.render(scene, camera);
};

animate();
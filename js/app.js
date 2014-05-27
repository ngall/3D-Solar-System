var $container = $('#container');
var $button = $('#button');
var renderer = new THREE.WebGLRenderer( { alpha: true } );
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);
var animated = true;

renderer.setSize(window.innerWidth, window.innerHeight);
$container.append(renderer.domElement);


/**
 *  EARTH
 */
var geometry  = new THREE.SphereGeometry(1, 64, 64);

var material         = new THREE.MeshPhongMaterial();
material.map         = THREE.ImageUtils.loadTexture('img/earth/earthmap2k.jpg');
material.bumpMap     = THREE.ImageUtils.loadTexture('img/earth/earthbump2k.jpg');
material.specularMap = THREE.ImageUtils.loadTexture('img/earth/earthspec2k.jpg');
material.specular    = new THREE.Color('#444444');
material.side        = THREE.DoubleSide;
material.bumpScale   = 0.06;

var earth = new THREE.Mesh(geometry, material);

earth.position.x = 0;
earth.position.y = 0;
earth.position.z = 0;

scene.add(earth);


/**
* EARTH CRUST
*/
var crust = new THREE.Mesh(
	new THREE.SphereGeometry(0.98, 16, 16),
	new THREE.MeshLambertMaterial({
		color: 0x883300,
		side: THREE.DoubleSide
	})
);
earth.add(crust);


/**
* CLOUDS
*/
var clouds = new THREE.Mesh(
	new THREE.SphereGeometry(1.02, 64, 64),
	new THREE.MeshPhongMaterial({
		map: THREE.ImageUtils.loadTexture('img/earth/earthclouds4k.png'),
		transparent: true
	})
);
earth.add(clouds);


/**
 * LIGHTS
 */

var light = new THREE.DirectionalLight( 0xffffee, 0.7 );
light.position.set(2,2,10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x111111));



/**
 * STARFIELD
 */
var geometry  = new THREE.SphereGeometry(90, 16, 16);
var material  = new THREE.MeshBasicMaterial();
material.map  = THREE.ImageUtils.loadTexture('img/starfield.png');
material.side = THREE.BackSide;
var space = new THREE.Mesh(geometry, material);
scene.add(space);


/**
 * MANAGE CAMERA
 */
camera.position.z = 3;
camera.lookAt(earth.position);
scene.add(camera);

var controls = new THREE.TrackballControls(camera);


/**
 * RENDERING
 */
(function render() {
	controls.update();   
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	animate();
})();

function animate() {
	if (animated) {
		earth.rotation.y += 1/250 ;
		clouds.rotation.y += 1/1500 ; 
	} else {
		return;
	}
}

$button.click(function() {
	animated = !animated;
	if (animated) {
		buttonTxt = 'Pause';
	} else {
		buttonTxt = 'Play';		
	}
	$button.html(buttonTxt);
});
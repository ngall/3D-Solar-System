if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var $container = $('#container');
var $button = $('#button');
var renderer = new THREE.WebGLRenderer( { alpha: true, antialias: false } );
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 10000);
var controls, stats;
var target = "earth";

var earthDistance = 20;
var earthRadius = 1;


renderer.setSize(window.innerWidth, window.innerHeight);
$container.append(renderer.domElement);



/**
 *  EARTH
 */
var geometry  = new THREE.SphereGeometry(earthRadius, 64, 64);

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
earth.position.z = -earthDistance;

scene.add(earth);

var segmentCount = 64,
    geometry = new THREE.Geometry(),
    material = new THREE.LineBasicMaterial({ color: 0x66aaff });

for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.sin(theta) * (earthRadius + 0.01),
            0,
            Math.cos(theta) * (earthRadius + 0.01)));            
}

var equator = new THREE.Line(geometry, material);
earth.rotation.x = Math.PI/10
earth.add( equator );


/**
 * ORBIT
 */
var segmentCount = 256,
    geometry = new THREE.Geometry(),
    material = new THREE.LineBasicMaterial({ color: 0x666666 });

for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.sin(theta) * earthDistance,
            0,
            Math.cos(theta) * earthDistance));            
}

var orbit = new THREE.Line(geometry, material);
//orbit.rotation.x = Math.PI / 2;

scene.add( orbit );


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
 * SUN
 */
uniforms = {
	time: { type: "f", value: 1.0 },
	resolution: { type: "v2", value: new THREE.Vector2() },
	uvScale: { type: "v2", value: new THREE.Vector2( 3.0, 1.0 ) },
	texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "img/cloud.png" ) },
	texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "img/lavatile.jpg" ) }

};

uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

material = new THREE.ShaderMaterial( {
	uniforms: uniforms,
	vertexShader: document.getElementById('vertexShader').textContent,
	fragmentShader: document.getElementById('fragmentShader').textContent

} );

var sun = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), material);

var customMaterialAtmosphere = new THREE.ShaderMaterial({
	uniforms: {
		"c": { type: "f", value: 0.5 },
		"p": { type: "f", value: 4.0 }
	},
	vertexShader: document.getElementById( 'vertexShaderAtmosphere' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShaderAtmosphere' ).textContent
} ); 

scene.add(sun);



/**
 * LIGHTS
 */
var light = new THREE.PointLight( 0xffffee, 0.7 );
light.position.set(0,0,0);
scene.add(light);
scene.add(new THREE.AmbientLight(0x111111));



/**
 * STARFIELD
 */
var geometry  = new THREE.SphereGeometry(1000, 16, 16);
var material  = new THREE.MeshBasicMaterial();
material.map  = THREE.ImageUtils.loadTexture('img/starfield.png');
material.side = THREE.BackSide;
var space = new THREE.Mesh(geometry, material);
scene.add(space);


/**
 * CAMERA
 */
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 10;
camera.lookAt(earth.position);
scene.add(camera);


/**
 * STATS
 */
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
stats.domElement.style.right = '0px';
stats.domElement.style.zIndex = 100;
$container.append( stats.domElement );

window.addEventListener( 'resize', onWindowResize, false );


/**
 * POSTPROCESS
 */
var composer    = new THREE.EffectComposer( renderer );
var renderModel = new THREE.RenderPass( scene, camera );
var effectBloom = new THREE.BloomPass( 10 );
effectBloom.renderToScreen = true;
composer.addPass( renderModel );
composer.addPass( effectBloom );


/**
 * CONTROLS
 */
controls = new THREE.OrbitControls( camera );
controls.addEventListener( 'change', render );
controls.center.set(earth.position.x, earth.position.y, earth.position.z);


var theta = 0.001;
animate();


/**
 * RESIZE
 */
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	composer.reset();
	render();
}


/**
 * RENDERING
 */
function render() { 
	renderer.render(scene, camera);
	composer.render( 10 );
};


/**
 * ANIMATION
 */
function animate() {

    requestAnimationFrame(animate);

	uniforms.time.value -= 0.015;

	earth.rotation.y += 0.01 ;
	clouds.rotation.y -= 0.0005 ;
	
	earth.position.x = earth.position.x * Math.cos(theta) + earth.position.z * Math.sin(theta);
	earth.position.z = earth.position.z * Math.cos(theta) - earth.position.x * Math.sin(theta);
	
	if (target == "earth")
		controls.center.set(earth.position.x, earth.position.y, earth.position.z);

    render();
    controls.update();
    stats.update();
}


/**
 * BUTTON
 */
$button.click(function() {
	if (target == "sun") {
		controls.center.set(earth.position.x, earth.position.y, earth.position.z);
		$button.html('Centrer sur le Soleil');
		target = "earth";
	} else {
		controls.center.set(sun.position.x, sun.position.y, sun.position.z);
		$button.html('Centrer sur la Terre');
		target = "sun";
	}
});
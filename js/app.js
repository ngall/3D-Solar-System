if (!Detector.webgl) {Detector.addGetWebGLMessage(); }

var $container = $('#container');
var $button = $('#button');
var renderer = new THREE.WebGLRenderer( { alpha: true, antialias: false } );
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 10000);
var controls, stats;

var nbTours, inc = 0;
var target = "earth";


var sunRadius = 2.0;

var earthRadius = 1.0;
var earthDistance = 20;
var earthDaySpeed = Math.PI/200; 
var earthYearSpeed = earthDaySpeed/365.25; 

var moonRadius = 0.3;
var moonDistance = 4;


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
material.specular    = new THREE.Color('#151515');
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
earth.rotation.x = -(Math.PI/180)*23.5; // Earth inclination

var equator = new THREE.Line(geometry, material);
earth.add( equator );


/**
 * EARTH ORBIT
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

var eOrbit = new THREE.Line(geometry, material);
//orbit.rotation.x = Math.PI / 2;

scene.add( eOrbit );


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
 * MOON
 */
var geometry  = new THREE.SphereGeometry(moonRadius, 64, 64);

var material         = new THREE.MeshPhongMaterial();
material.map         = THREE.ImageUtils.loadTexture('img/moon/moonmap1k.jpg');
material.bumpMap     = THREE.ImageUtils.loadTexture('img/moon/moonbump1k.jpg');
material.side        = THREE.DoubleSide;
material.bumpScale   = 0.06;

var moon = new THREE.Mesh(geometry, material);

moon.position.x = 0;
moon.position.y = 0;
moon.position.z = -moonDistance;
moon.rotation.x = -2*((Math.PI/180)*23.5);
earth.add(moon);

/**
 * MOON ORBIT
 */
var segmentCount = 256,
    geometry = new THREE.Geometry(),
    material = new THREE.LineBasicMaterial({ color: 0x333333 });

for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.sin(theta) * moonDistance,
            0,
            Math.cos(theta) * moonDistance));            
}

var mOrbit = new THREE.Line(geometry, material);

earth.add( mOrbit );


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

var sun = new THREE.Mesh(new THREE.SphereGeometry(sunRadius, 32, 32), material);

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
var light = new THREE.PointLight( 0xffffee, 1, 0);
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
camera.position.z = 5;
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


var theta = 0; 

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
	
	nbTours = Math.floor(earth.rotation.y / (Math.PI*2));

	if (inc == nbTours) {
		console.log(nbTours + ' jour(s)');
		inc++;
	}


    requestAnimationFrame(animate);

	uniforms.time.value -= 0.015;

	earth.rotation.y += earthDaySpeed;
	//clouds.rotation.y -= earthDaySpeed-0.02 ;

	
	//earth.position.x = earth.position.x * Math.cos(theta) + earth.position.z * Math.sin(theta);
	//earth.position.z = earth.position.z * Math.cos(theta) - earth.position.x * Math.sin(theta);

	theta += earthYearSpeed;
	earth.position.x = earthDistance * Math.sin(theta);
	earth.position.z = earthDistance * Math.cos(theta);
	
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
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var $container = $('#container');
var $button = $('#button');
var renderer = new THREE.WebGLRenderer( { alpha: true, antialias: false } );
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);
var animated = true;
var controls, stats;


renderer.setSize(window.innerWidth, window.innerHeight);
$container.append(renderer.domElement);


controls = new THREE.OrbitControls( camera );
controls.addEventListener( 'change', render );



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
 * SUN
 */
var sun = new THREE.Mesh(
	new THREE.SphereGeometry(0.98, 16, 16),
	new THREE.MeshBasicMaterial({
		color: 0xffdd66,
		side: THREE.DoubleSide
	})
);
sun.position.z = 20;

//scene.add(sun);


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

mesh = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), material);
mesh.position.z = 20;

var customMaterialAtmosphere = new THREE.ShaderMaterial({
	uniforms: {
		"c": { type: "f", value: 0.5 },
		"p": { type: "f", value: 4.0 }
	},
	vertexShader: document.getElementById( 'vertexShaderAtmosphere' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShaderAtmosphere' ).textContent
} ); 





scene.add(mesh);




/**
 * LIGHTS
 */
var light = new THREE.PointLight( 0xffffee, 0.7 );
light.position.set(0,0,20);
scene.add(light);
scene.add(new THREE.AmbientLight(0x111111));



/**
 * STARFIELD
 */
var geometry  = new THREE.SphereGeometry(128, 16, 16);
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
camera.position.z = 30;
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

    if (animated) {
		earth.rotation.y += 0.001 ;
		clouds.rotation.y -= 0.0002 ; 
	} else {
		return;
	}

    render();
    controls.update();
    stats.update();
}


/**
 * BUTTON
 */
$button.click(function() {
	animated = !animated;
	if (animated) {
		buttonTxt = 'Pause';
	} else {
		buttonTxt = 'Play';		
	}
	$button.html(buttonTxt);
});
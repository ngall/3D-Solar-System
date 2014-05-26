var container = document.getElementById('container');
var renderer = new THREE.CanvasRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
var distance = 1000;
var nbObjects = 1000;
var geometry = new THREE.Geometry();

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

for (var i = 0; i < nbObjects; i++) {
	var particle = new THREE.Particle(new THREE.ParticleCanvasMaterial({
		color: Math.random() * 0x808080 + 0x808080, 
		opacity: 0.5,
		program: function (context) {
			context.beginPath();
			context.arc(0,0,1,0,Math.PI * 2, true);
			context.closePath();
			context.fill();
		}
	}));

	particle.position.x = Math.random() * distance * 4 - distance * 2;
	particle.position.y = Math.random() * distance * 4 - distance * 2;
	particle.position.z = Math.random() * distance * 4 - distance * 2;
	particle.scale.x = particle.scale.y = Math.random() * 10 + 5;

	scene.add(particle);
}

camera.position.z = 100;
camera.lookAt(scene.position);
scene.add(camera);

renderer.render(scene, camera);

document.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
	var mouseX = event.clientX - window.innerWidth/2;
	var mouseY = event.clientY - window.innerHeight/2;
	camera.position.x += (mouseX - camera.position.x) * 0.05;
	camera.position.y += (mouseY - camera.position.y) * 0.05;
	camera.position.z = distance;
	camera.lookAt(scene.position);
	renderer.render(scene, camera);
}

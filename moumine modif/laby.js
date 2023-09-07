import * as THREE from './node_modules/three/build/three.module.js';
import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js';


let storagecheck = false;

if (typeof Storage !== "undefined") 
{
	console.log("localStorage supporté.");
	storagecheck = true;
} else
{
	console.log("localStorage n'est pas pris en charge par le navigateur.");
	storagecheck = false;
}

document.addEventListener("demarrage", ()=>{
	let camera, scene, renderer, controls, raycaster;

	const objects = [];

	let moveForward = false;

	let prevTime = performance.now();
	const velocity = new THREE.Vector3();
	const direction = new THREE.Vector3();
	const vertex = new THREE.Vector3();
	const color = new THREE.Color();

	init();
	animate();
			
    function createGeom(x1,y1,x2,y2,h) {
		let res = [
			x1, 0, y1, 
			x2, 0, y2, 
			x1, h, y1, 
			x1, h, y1,
			x2, 0, y2, 
			x2, h, y2, 
			];
		return res;
	}


	function init() {

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.x = 10;
		camera.position.z = 10;
		camera.position.y = 10;

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xffffff );
		scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

		const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
		light.position.set( 0.5, 1, 0.75 );
		scene.add( light );

		controls = new PointerLockControls( camera, document.body );
		document.querySelector('body').addEventListener('click',()=>{controls.lock();},false);
		//document.addEventListener("")

		scene.add( controls.getObject() );

		const onKeyDown = function ( event ) {
			event.preventDefault();
			var mouse3D = new THREE.Vector3(); 
			mouse3D.normalize();
			controls.getDirection( mouse3D );
			raycaster.set(controls.getObject().position, mouse3D );
			var intersects = raycaster.intersectObjects(objects);
			let mini = Math.min(...intersects.map(x => x.distance));
			if (mini > 10 || isNaN(mini)) {
				switch ( event.code ) {

					case 'ArrowUp':
					case 'KeyW':
						moveForward = true;
						break;
				}
			} else {
				switch ( event.code ) {

					case 'ArrowUp':
					case 'KeyW':
						moveForward = false;
						velocity.z = 20;
						break;
				}
			}			
		};

		const onKeyUp = function ( event ) {

			switch ( event.code ) {

				case 'ArrowUp':
				case 'KeyW':
					moveForward = false;
					break;
			}

		};

		document.addEventListener( 'keydown', onKeyDown );
		document.addEventListener( 'keyup', onKeyUp );

		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
		

		// sol

		let tex = new THREE.TextureLoader().load("sol_rouge.jpg");
		tex.anisotropy = 32;
		tex.repeat.set(100, 100);
		tex.wrapT = THREE.RepeatWrapping;
		tex.wrapS = THREE.RepeatWrapping;
		let geo = new THREE.PlaneGeometry(5000, 5000);
		let mat = new THREE.MeshLambertMaterial({map: tex});

		let mesh = new THREE.Mesh(geo, mat);
		mesh.position.set(0, 0.1, 0);
		mesh.rotation.set(Math.PI / -2, 0, 0);
		scene.add(mesh);

		//plafond

	
		let tex2 = new THREE.TextureLoader().load("plafond_blanc.jpeg");
		/*tex2.anisotropy = 32;
		tex2.repeat.set(10, 10);
		tex2.wrapT = THREE.RepeatWrapping;
		tex2.wrapS = THREE.RepeatWrapping;*/
		let geo2 = new THREE.PlaneGeometry(280, 540);
		let mat2 = new THREE.MeshLambertMaterial({map: tex2, side: THREE.DoubleSide});

		let mesh1 = new THREE.Mesh(geo2, mat2);
		mesh1.position.set(140, 20, 270);
		mesh1.rotation.set(Math.PI / -2, 0, 0);
		scene.add(mesh1);


		// objects
		const materialMur = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('mur.jpg'),  side: THREE.DoubleSide} );
		const materialPorte = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('porte.jpg'), side: THREE.DoubleSide } );

		let tab = [].concat(
			//createGeom(z1,x1,z2,x2,y) -- référence

			//grand axe z mur vertical gauche - mur 1
			createGeom(0,0,280,0,20),
			//grand axe x mur horizontal inferieur - mur 2
			createGeom(0,0,0,540,20),
			//grand axe z mur vertical droite - mur 3
			createGeom(0,540,280,540,20),
			//grand axe x mur horizontal superieur - mur 4
			createGeom(280,0,280,540,20),
			
			//mur 5-8
			createGeom(30,0,30,150,20),
			createGeom(30,150,60,150,20),
			createGeom(60,150,60,190,20),
			createGeom(30,110,60,110,20),
			
			//mur 9 a été aspiré dans les backrooms

			//mur 10-11
			createGeom(120,110,90,110,20),
			createGeom(120,0,120,150,20),


			//mur 12-17
			createGeom(60,220,60,330,20),
			createGeom(120,230,60,230,20),
			createGeom(120,180,120,230,20),
			createGeom(60,250,40,250,20),
			createGeom(0,250,10,250,20),
			createGeom(60,330,0,330,20),

			//mur 18-20
			createGeom(30,360,90,360,20),
			createGeom(30,360,30,480,20),
			createGeom(30,480,45,480,20),

			//mur 21-22
			createGeom(75,480,90,480,20),
			createGeom(90,430,90,540,20),

			//mur 23
			createGeom(190,460,190,540,20),

			//mur 24
			createGeom(250,500,250,540,20),

			//mur 25-27
			createGeom(250,310,250,470,20),
			createGeom(170,340,250,340,20),
			createGeom(190,340,190,430,20),

			//mur 28-30
			createGeom(90,340,140,340,20),
			createGeom(90,260,90,400,20),
			createGeom(90,260,185,260,20),

			//mur 31-39 aussi dans les backrooms

			//mur 40-42
			createGeom(215,260,280,260,20),
			createGeom(250,70,250,280,20),
			createGeom(215,118,250,118,20),

			//mur 43-45
			createGeom(250,20,250,40,20),
			createGeom(160,20,250,20,20),
			createGeom(160,20,160,40,20),

			//mur 46-47
			createGeom(160,70,160,160,20),
			createGeom(160,118,185,118,20),
			
			//mur 48
			createGeom(160,190,160,260,20)
		);
						
		const vertices = new Float32Array(tab);
		let tuv = [0,0, 1,0, 0,1, 0,1, 1,0, 1,1];
		var labGeometry = new THREE.BufferGeometry();
					
		const uvs = [].concat(tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv);
		labGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		labGeometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );	
					
		const mesh2 = new THREE.Mesh(labGeometry, materialMur);
		mesh2.position.set(0,0,0);
		mesh2.name = "laby"

		scene.add(mesh2);
		objects.push( mesh2 );

		let portetab = [].concat(
			//createGeom(z1,x1,z2,x2,y) -- référence

			//Porte 1
			createGeom(10,250,40,250,20),
			
			//Porte 2
			createGeom(60,190,60,220,20),
			
			//Porte 3
			createGeom(120,150,120,180,20),

			//Porte 4
			createGeom(60,110,90,110,20),

			//Porte 5
			createGeom(160,160,160,190,20),

			//Porte 6
			createGeom(160,40,160,70,20),

			//Porte 7
			createGeom(250,40,250,70,20),

			//Porte 8
			createGeom(185,118,215,118,20),

			//Porte 9
			createGeom(185,260,215,260,20),

			//Porte 10
			createGeom(250,280,250,310,20),

			//Porte 11
			createGeom(250,470,250,500,20),
			
			//Porte 12
			createGeom(140,340,170,340,20),

			//Porte 13
			createGeom(190,430,190,460,20),

			//Porte 14
			createGeom(90,400,90,430,20),

			//Porte 15
			createGeom(45,480,75,480,20),
		);

		const vertices2 = new Float32Array(portetab);
		tuv = [0,0, 1,0, 0,1, 0,1, 1,0, 1,1];
		labGeometry = new THREE.BufferGeometry();
					
		const uvs2 = [].concat(tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv,tuv);
		labGeometry.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));
		labGeometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs2 ), 2 ) );	
					
		const mesh3 = new THREE.Mesh(labGeometry, materialPorte);
		mesh3.position.set(0,0,0);
		mesh3.name = "doors";

		scene.add(mesh3);
	
		

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize );
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {
		requestAnimationFrame(animate);
		const time = performance.now();
		if ( controls.isLocked === true ) {
			//raycaster.ray.origin.copy( controls.getObject().position );
			//raycaster.ray.origin.y -= 10;

			const intersections = raycaster.intersectObjects( objects, false );
			const onObject = intersections.length > 0;

			const delta = ( time - prevTime ) / 1000;
			velocity.z -= velocity.z * 5.0 * delta;

			//velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

			direction.z = Number( moveForward )
			direction.normalize(); // this ensures consistent movements in all directions

			if ( moveForward ) velocity.z -= direction.z * 150.0 * delta;

			if ( onObject === true ) {
				console.log("intersect",intersections);
			}

			controls.moveForward( - velocity.z * delta );

			controls.getObject().position.y += ( velocity.y * delta ); // new behavior

			if ( controls.getObject().position.y < 10 ) {
				//console.log("intersect");
				controls.getObject().position.y = 10;
			}

			if (storagecheck == true)
			{
				if (sessionStorage.getItem("playerposition")) {
					sessionStorage.setItem("playerposition", "true");
					sessionStorage.setItem("playerposition_x", Math.abs(Math.floor(camera.position.x - 280)));
					sessionStorage.setItem("playerposition_z", Math.floor(camera.position.z));
				} else {
					sessionStorage.setItem("playerposition", "true");
					sessionStorage.setItem("playerposition_x", Math.abs(Math.floor(camera.position.x - 280)));
					sessionStorage.setItem("playerposition_z", Math.floor(camera.position.z));
				}
			}
		}

		prevTime = time;

		renderer.render( scene, camera );

	}
},false);

	// Set up the scene, camera, and renderer as global variables.
	var scene, camera, controls, renderer, raycaster;
	var scale, WIDTH,HEIGHT;
	var mouse = new THREE.Vector2(), INTERSECTED;

	var prevTime;
	var cardsToDisplay = [];
	var textToDisplay = [];
	var imagesToDisplay = [];
	var randomDeck = [];
	var cardData;
	var leftArrow=null;
	var rightArrow=null;
	var doneButton=null;
	var currentPage = 0;
	var mode = 0;
	var animations = [];
	var timedFunctions = [];

	// Sets up the scene.
	function init() {

	  // Create the scene and set the scene size.
	  scene = new THREE.Scene();
	  
	  var scale = Math.min((window.innerWidth-300)/1920,window.innerHeight/1080);
	  WIDTH = 1920*scale;
	  HEIGHT = 1080*scale;

	  // Create a renderer and add it to the DOM.
	  renderer = new THREE.WebGLRenderer({antialias:true});
	  renderer.setSize(WIDTH,HEIGHT);
	  document.getElementById('render').appendChild(renderer.domElement);
	  
	  // Create a camera, zoom it out from the model a bit, and add it to the scene.
	  camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 1, 20000);
	  camera.position.set(0,0,1500,'XYZ');
	  camera.rotation.set(0,0,0,'XYZ');
	  scene.add(camera);
	  
	  controls = new THREE.OrbitControls( camera, renderer.domElement );
	  //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
	  controls.enableDamping = true;
	  controls.dampingFactor = 0.25;
	  controls.enableZoom = false;

	  // Create an event listener that resizes the renderer with the browser window.
	  window.addEventListener('resize', function() {
		scale = Math.min((window.innerWidth-300)/1920,window.innerHeight/1080);
		WIDTH = 1920*scale;
		HEIGHT = 1080*scale;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	  });
	  
	  document.getElementById('render').addEventListener( 'mousedown', onDocumentMouseDown, false );

	  // Set the background color of the scene.
	  renderer.setClearColor(0x333F47, 1);

	  // Create a light, set its position, and add it to the scene.
	  scene.add( new THREE.AmbientLight( 0x404040, 5 ) );
	  raycaster = new THREE.Raycaster();
	  
	  prevTime = Date.now();
	}

	function onDocumentMouseDown( event ) {
		event.preventDefault();
		mouse.x = ( (event.clientX-300) / WIDTH ) * 2 - 1;
		mouse.y = - (event.clientY / HEIGHT ) * 2 + 1;
		
		raycaster.setFromCamera( mouse, camera );
		var intersects = raycaster.intersectObjects( scene.children,true );
		
		if ( intersects.length > 0 ) {
			INTERSECTED = intersects[ 0 ].object;
			for (var i=0;i<imagesToDisplay.length;i++) {
				if (INTERSECTED==imagesToDisplay[i]) {
					imageClicked(imagesToDisplay[i].name);
				}
			}
			if (mode==0) {
				if (INTERSECTED==rightArrow) {
						currentPage++;
						loadPage(currentPage,collection);
						INTERSECTED=null;
					}
				else if (INTERSECTED==leftArrow) {
						currentPage--;
						loadPage(currentPage,collection);
						INTERSECTED=null;
					}
			}
			else if (mode==2) {
				for (var n=0;n<cardsToDisplay.length;n++) {
					if (INTERSECTED == cardsToDisplay[n].mesh.getObjectByName("back") || INTERSECTED == cardsToDisplay[n].mesh.getObjectByName("front") || INTERSECTED == cardsToDisplay[n].mesh.getObjectByName("barArt")) {
						sealedCardClicked(n);
					}
				}
				if (INTERSECTED==doneButton) {
					doneButtonPressed();
				}
				else if (INTERSECTED==rightArrow) {
						currentPage++;
						loadPage(currentPage,sealedCollection);
						INTERSECTED=null;
					}
				else if (INTERSECTED==leftArrow) {
						currentPage--;
						loadPage(currentPage,sealedCollection);
						INTERSECTED=null;
					}
			}
			else if (mode==3) {
				for (var n=0;n<cardsToDisplay.length;n++) {
					if (INTERSECTED == cardsToDisplay[n].mesh.getObjectByName("front"))
						rushCardClicked(cardsToDisplay[n]);
				}
			}
		} else {
			INTERSECTED = null;
		}
	}


	// Renders the scene and updates the render as needed.
	function animate() {
	  var timeDifference = Date.now()-prevTime;
	  prevTime = Date.now();

	  // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	  requestAnimationFrame(animate);
			
	  controls.update();
	  if (animations.length>0)
		processAnimations(timeDifference);
	  
	  for (var i=0;i<timedFunctions.length;i++) {
		timedFunctions[i].timer+=timeDifference;
		if (timedFunctions[i].timer>=timedFunctions[i].maxTime) {
			timedFunctions[i].onTimeReached();
			timedFunctions.splice(i,1);
		}
	  }
			
	  // Render the scene.
	  render(scene, camera);
	}

	function render() {
		renderer.render( scene, camera );
	}

	function processAnimations(timeDifference) {
		var anim;
		for (var i=0;i<animations.length;i++) {
			anim = animations[i];
			if (anim.type==="rotationY") {
				anim.object.rotation.y+=anim.amount/(anim.endTime/1000)*(timeDifference*.001);
				anim.startTime+=timeDifference;
				if (anim.startTime>anim.endTime) {
					anim.object.rotation.y=anim.startingValue+anim.amount;
					animations.splice(i,1);
				}
			}
			else if (anim.type==="positionY") {
				anim.object.position.y+=anim.amount/(anim.endTime/1000)*(timeDifference*.001);
				anim.startTime+=timeDifference;
				if (anim.startTime>anim.endTime) {
					anim.object.position.y=anim.startingValue+anim.amount;
					animations.splice(i,1);
				}
			}
		}
	}

	function clearAssets() {
		animations=[];
		timedFunctions=[];
		
		for (var i=0;i<cardsToDisplay.length;i++) {
			scene.remove(cardsToDisplay[i].mesh);
			for (var n=0;n<cardsToDisplay[i].mesh.children.length;n++) {
				if (cardsToDisplay[i].mesh.children[n].material.map!=null)
					cardsToDisplay[i].mesh.children[n].material.map.dispose();
				if (cardsToDisplay[i].mesh.children[n].material instanceof THREE.MultiMaterial) {
					cardsToDisplay[i].mesh.children[n].material.materials[0].dispose();
					cardsToDisplay[i].mesh.children[n].material.materials[1].dispose();
				}
				else
					cardsToDisplay[n].mesh.children[n].material.dispose();
				cardsToDisplay[n].mesh.children[n].geometry.dispose();
			}
		}
		cardsToDisplay=[];
		
		for (i=0;i<textToDisplay.length;i++) {
			scene.remove(textToDisplay[i]);
			if (textToDisplay[i].material instanceof THREE.MultiMaterial) {
				textToDisplay[i].material.materials[0].dispose();
				textToDisplay[i].material.materials[1].dispose();
			} else {
				textToDisplay[i].material.dispose();
			}
			textToDisplay[i].geometry.dispose();
		}
		textToDisplay = [];
		
		for (var i=0;i<imagesToDisplay.length;i++) {
			scene.remove(imagesToDisplay[i]);
			imagesToDisplay[i].material.map.dispose();
			imagesToDisplay[i].material.dispose();
			imagesToDisplay[i].geometry.dispose();
		}
		
		if (doneButton!=null) {
			scene.remove(doneButton);
			doneButton.material.dispose();
			doneButton = null;
		}
		if (leftArrow!=null) {
			scene.remove(leftArrow);
			leftArrow.material.dispose();
			leftArrow=null;
		}
		if (rightArrow!=null) {
			scene.remove(rightArrow);
			rightArrow.material.dispose();
			rightArrow=null;
		}
	}

	function setCardBack(cardBackName) {
	var map;
	var material;
	var extension;

	if (cardBackName === "Molten Core" || cardBackName === "Tournament Grounds")
		extension='.gif';
	else
		extension='.png';

	map = new THREE.TextureLoader().load( 'Card Backs/'+cardBackName+extension );
	map.minFilter = THREE.LinearFilter;

	for (var i=0;i<cardsToDisplay.length;i++) {
		if (cardsToDisplay[i].mesh.children.length>0) {
			if (cardsToDisplay[i].mesh.getObjectByName("back").material.map!=null)
				cardsToDisplay[i].mesh.getObjectByName("back").material.map.dispose();
			cardsToDisplay[i].mesh.getObjectByName("back").material.map=map;
			cardsToDisplay[i].mesh.getObjectByName("back").needsUpdate=true;
			cardsToDisplay[i].mesh.getObjectByName("back").visible=true;
		}
	}
	}

	function setCardTexture(num,card) {
	var map;
	var material;

	cardsToDisplay[num].card = card;

	map = new THREE.TextureLoader().load( 'Images/' + card.name.replace(':','_') + '.png' );
	map.minFilter = THREE.LinearFilter;

	if (cardsToDisplay[num].mesh.getObjectByName("front").material.map!=null)
		cardsToDisplay[num].mesh.getObjectByName("front").material.map.dispose();
	cardsToDisplay[num].mesh.getObjectByName("front").material.map=map;	
	cardsToDisplay[num].mesh.getObjectByName("front").material.color.setHex( 0xFFFFFF );
	cardsToDisplay[num].mesh.getObjectByName("front").needsUpdate=true;

	cardsToDisplay[num].mesh.getObjectByName("front").visible=true;
	}

	function copyDeckToClipboard() {
	var deck;
	var deckString="";
	if (mode==1)
		deck=randomDeck;
	else if (mode==2)
		deck=sealedDeck;
	else if (mode==3)
		deck=rushDeck;
		
	for (var i=0;i<deck.length;i++) {
		deckString+=deck[i].amount+" "+deck[i].name+"\n";
	}

	var origSelectionStart, origSelectionEnd;
	var target = document.createElement("textarea");
	target.style.position = "absolute";
	target.style.left = "-9999px";
	target.style.top = "0";
	target.id = "_hiddenCopyText_";
	document.body.appendChild(target);
	target.textContent = deckString;

	var currentFocus = document.activeElement;
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// copy the selection
	var succeed;
	try {
		  succeed = document.execCommand("copy");
	} catch(e) {
		console.log("copy failed");
	}

	if (currentFocus && typeof currentFocus.focus === "function") {
		currentFocus.focus();
	}

	target.parentNode.removeChild(target);
	}

	function loadImage(image,x,y,width,height) {
	map = new THREE.TextureLoader().load( 'Other/' + image + '.png' );
	map.minFilter = THREE.LinearFilter;

	var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.FrontSide, transparent: true } );
	object = new THREE.Mesh(  new THREE.PlaneGeometry( width, height, 4, 4 ), material );
	object.visible = true;
	object.position.set(x,y,1);
	object.name = image;
	imagesToDisplay.push(object);
	scene.add( object );
	}

	function imageClicked(imageName) {
	var theCollection;
	if (mode==0)
		theCollection = collection;
	else if (mode==2)
		theCollection = sealedCollection;

	switch (imageName) {
		case "druidIcon" : {
			currentPage = getFirstPageOfClass("DRUID",theCollection);
			loadPage(currentPage,theCollection);
		} break;
		case "hunterIcon" : {
			currentPage = getFirstPageOfClass("HUNTER",theCollection);
			loadPage(currentPage,theCollection);
		} break;
		case "mageIcon" : {
			currentPage = getFirstPageOfClass("MAGE",theCollection);
			loadPage(currentPage,theCollection);
		} break;
		case "paladinIcon" : {
			currentPage = getFirstPageOfClass("PALADIN",theCollection);
			loadPage(currentPage,theCollection);
		} break;
		case "priestIcon" : {
			currentPage = getFirstPageOfClass("PRIEST",theCollection);
			loadPage(currentPage,theCollection);
		} break;
		case "rogueIcon" : {
			currentPage = getFirstPageOfClass("ROGUE",theCollection);
			loadPage(currentPage,theCollection);
		} break;
		case "shamanIcon" : {
			currentPage = getFirstPageOfClass("SHAMAN",theCollection);
			loadPage(currentPage,theCollection);
		} break;
		case "warlockIcon" : {
			currentPage = getFirstPageOfClass("WARLOCK",theCollection);
			loadPage(currentPage,theCollection);
		} break;
		case "warriorIcon" : {
			currentPage = getFirstPageOfClass("WARRIOR",theCollection);
			loadPage(currentPage,theCollection);
		} break;
		case "neutralIcon" : {
			currentPage = getFirstPageOfClass("NEUTRAL",theCollection);
			loadPage(currentPage,theCollection);
		}
	}
	}

	function loadText(theText,name, size, x, y, z) {
	var loader = new THREE.FontLoader();

	loader.load( 'Font/Harabara_Regular.json', function ( font ) {

		var textGeo = new THREE.TextGeometry( theText, {

			font: font,

			size: size,
			height: 1,
			curveSegments: 12

		} );

		var textMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

		var mesh = new THREE.Mesh( textGeo, textMaterial );
		
		mesh.name = name;
		
		textToDisplay.push(mesh);
		mesh.position.set(x,y,z);
		scene.add(mesh);
	} );
	}
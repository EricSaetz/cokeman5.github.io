// Set up the scene, camera, and renderer as global variables.
var scene, camera, controls, renderer, raycaster;
var scale, WIDTH,HEIGHT;
var mouse = new THREE.Vector2(), INTERSECTED;

var totalGameTime = 0;
var cardsToDisplay = [];
var textToDisplay = [];
var imagesToDisplay = [];
var mode = 0;
var animations = [];
var timedFunctions = [];
var loadedCardImages = [];
var loadedImages = [];
var loadingIcon;
var loadingAnim;
var loadingImages = [];
var amountPreloading = 0;
var audioListener;
var audioLoader;
var lastFrameTime = new Date().getTime();
var font;

// Sets up the scene with the camera, lighting, preloading assets, an various other things
function init() {

	// Create the scene
	scene = new THREE.Scene();
	
	//preload the font
	var loader = new THREE.FontLoader();
	theCollection=collection;
	//start the collection view once the font is loaded
	loader.load( 'Font/Harabara_Regular.json',function(theFont){font=theFont; startCollectionView(0,0,1920,1240, null, null);});
	
	//preload the loading icon
	loadingIcon = new THREE.TextureLoader().load( 'Other/Loading Icon.png');
	loadingIcon.minFilter = THREE.LinearFilter;
	loadingAnim = new TextureAnimator(loadingIcon,12,1,12,100);
	
	//set the size of the three.js scene
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
	
	//old code to allow rotation of the camera, currently not used.
	/*controls = new THREE.OrbitControls( camera, renderer.domElement );
	//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = false;
	controls.enabled=false;*/

	// Create an event listener that resizes the renderer with the browser window.
	window.addEventListener('resize', function() {
		scale = Math.min((window.innerWidth-300)/1920,window.innerHeight/1080);
		WIDTH = 1920*scale;
		HEIGHT = 1080*scale;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	});
	
	//create render loop
	window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
	})();

	//add mouse listener
	document.getElementById('render').addEventListener( 'mousedown', onDocumentMouseDown, false );

	// Set the background color of the scene.
	renderer.setClearColor(0x333F47, 1);
	
	//set up audio stuff
	audioListener = new THREE.AudioListener();
	audioLoader = new THREE.AudioLoader();

	// Create a light, set its position, and add it to the scene.
	scene.add( new THREE.AmbientLight( 0x404040, 5 ) );
	raycaster = new THREE.Raycaster();

	//set the background image of the scene
	loadImage("Parchment",null,false,0,0,-500,3060,1680);
}

//called when the scene is clicked
function onDocumentMouseDown( event ) {
	event.preventDefault();
	//offset click to match scene posistion
	mouse.x = ( (event.clientX-300) / WIDTH ) * 2 - 1;
	mouse.y = - (event.clientY / HEIGHT ) * 2 + 1;
	
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children,true );
	
	if ( intersects.length > 0 ) {
		INTERSECTED = intersects[ 0 ].object;
		//if imageDisplay is clicked call its onClicked function
		for (var i=0;i<imagesToDisplay.length;i++) {
			if (INTERSECTED==imagesToDisplay[i].imgObj && imagesToDisplay[i].onClicked!=null) {
				imagesToDisplay[i].onClicked();
			}
		}
		//if cardDisplay is clicked call its onClicked function
		for (var n=0;n<cardsToDisplay.length;n++) {
			if (INTERSECTED == cardsToDisplay[n].mesh.getObjectByName("back") || INTERSECTED == cardsToDisplay[n].mesh.getObjectByName("front") || INTERSECTED == cardsToDisplay[n].mesh.getObjectByName("barArt")) {
				if (cardsToDisplay[n].onClicked!=null)
					cardsToDisplay[n].onClicked(cardsToDisplay[n]);
			}
		}
	} else {
		INTERSECTED = null;
	}
}

//update loop
function update(dt,t) {
	
	loadingAnim.update(dt);
	
	processAnimations(dt);

	processTimedFunctions(dt);
	
	setTimeout(function() {
        var currTime = new Date().getTime();
        var dt = currTime - (lastFrameTime || currTime);
        totalGameTime += dt;
        
        update(dt, totalGameTime);
    
        lastFrameTime = currTime;
    }, 0);
}

//render loop
function render() {
    renderer.render(scene, camera);
	
    requestAnimFrame(render);
}

//increase timer on every timed function and activate them when their time is up
function processTimedFunctions(timeDifference) {
	for (var i=timedFunctions.length-1;i>=0;i--) {
		timedFunctions[i].timer+=timeDifference;
		if (timedFunctions[i].timer>=timedFunctions[i].maxTime) {
			timedFunctions[i].onTimeReached();
			timedFunctions.splice(i,1);
		}
	}
	
}

//process animations that occur over time
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
				i--;
			}
		}
		else if (anim.type==="positionY") {
			anim.object.position.y+=anim.amount/(anim.endTime/1000)*(timeDifference*.001);
			anim.startTime+=timeDifference;
			if (anim.startTime>anim.endTime) {
				anim.object.position.y=anim.startingValue+anim.amount;
				animations.splice(i,1);
				i--;
			}
		}
	}
}

//update animated images(specifically the loading icon)
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}		


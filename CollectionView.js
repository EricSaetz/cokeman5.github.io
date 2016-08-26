function startCollectionView(theCollection, x, y, width, height) {
  var material;
  var verticalGap,horizontalGap;
  
  clearAssets();
  
  verticalGap = (height-395*2)/3;
  horizontalGap = (width-286*3)/5;
  
	for (var i=0; i<8;i++) {
		var material1 = new THREE.MeshLambertMaterial( { map: null, side: THREE.FrontSide, transparent: true } );
		var material2 = new THREE.MeshLambertMaterial( { map: null, side: THREE.BackSide, transparent: true} );
		object1 = new THREE.Mesh(  new THREE.PlaneGeometry( 286, 395, 4, 4 ), material1 );
		object2 = new THREE.Mesh(  new THREE.PlaneGeometry( 286, 395, 4, 4 ), material2 );
		object1.name = "front";
		object2.name = "back";
		object = new THREE.Object3D();
		object.add(object1);
		object.add(object2);
		object1.visible = false;
		object2.visible = false;
		cardsToDisplay.push({mesh:object,card:null});
		object.position.set( (286+horizontalGap)*(i%4)+horizontalGap-width/2+x, height/2-(Math.floor(i/4)*(verticalGap+395))-verticalGap-395/2+y, 0 );
		scene.add( object );
	}
	setCardBack(document.getElementById("cardBackSelect").value);
	
	loadImage("druidIcon",x-675,y+height/2.2,100,100);
	loadImage("hunterIcon",x-525,y+height/2.2,100,100);
	loadImage("mageIcon",x-375,y+height/2.2,100,100);
	loadImage("paladinIcon",x-225,y+height/2.2,100,100);
	loadImage("priestIcon",x-75,y+height/2.2,100,100);
	loadImage("rogueIcon",x+75,y+height/2.2,100,100);
	loadImage("shamanIcon",x+225,y+height/2.2,100,100);
	loadImage("warlockIcon",x+375,y+height/2.2,100,100);
	loadImage("warriorIcon",x+525,y+height/2.2,100,100);
	loadImage("neutralIcon",x+675,y+height/2.2,100,100);
	
	loadArrows(x,y,width,height);
	currentPage = 0;
	loadPage(currentPage,theCollection);
	scene.add(rightArrow);
	scene.add(leftArrow);
}

function loadPage(page,theCollection) {
	if (page<=0)
		leftArrow.visible=false;
	else
		leftArrow.visible=true;
	
	if (page>=getMaxPages(theCollection)-1)
		rightArrow.visible=false;
	else
		rightArrow.visible=true;
	
	
	for (var n=0;n<textToDisplay.length;n++) {
		scene.remove(textToDisplay[n]);
		textToDisplay[n].material.dispose();
		textToDisplay[n].geometry.dispose();
	}
	
	textToDisplay = [];
	
	var classCards = theCollection.expansionAll.druid;
	var offset = 0;
	var index = page*8;
	
	
	if (index<classCards.length) {
		loadClassCards(index,classCards);
	} else {
		offset+=Math.ceil(classCards.length/8)*8;
		index = page*8-offset;
		classCards = theCollection.expansionAll.hunter;
		if (index<classCards.length) {
			loadClassCards(index,classCards);
		} else {
			offset+=Math.ceil(classCards.length/8)*8;
			index = page*8-offset;
			classCards = theCollection.expansionAll.mage;
			if (index<classCards.length) {
				loadClassCards(index,classCards);
			} else {
				offset+=Math.ceil(classCards.length/8)*8;
				index = page*8-offset;
				classCards = theCollection.expansionAll.paladin;
				if (index<classCards.length) {
					loadClassCards(index,classCards);
				} else {
					offset+=Math.ceil(classCards.length/8)*8;
					index = page*8-offset;
					classCards = theCollection.expansionAll.priest;
					if (index<classCards.length) {
						loadClassCards(index,classCards);
					} else {
						offset+=Math.ceil(classCards.length/8)*8;
						index = page*8-offset;
						classCards = theCollection.expansionAll.rogue;
						if (index<classCards.length) {
							loadClassCards(index,classCards);
						} else {
							offset+=Math.ceil(classCards.length/8)*8;
							index = page*8-offset;
							classCards = theCollection.expansionAll.shaman;
							if (index<classCards.length) {
								loadClassCards(index,classCards);
							} else {
								offset+=Math.ceil(classCards.length/8)*8;
								index = page*8-offset;
								classCards = theCollection.expansionAll.warlock;
								if (index<classCards.length) {
									loadClassCards(index,classCards);
								} else {
									offset+=Math.ceil(classCards.length/8)*8;
									index = page*8-offset;
									classCards = theCollection.expansionAll.warrior;
									if (index<classCards.length) {
										loadClassCards(index,classCards);
									} else {
										offset+=Math.ceil(classCards.length/8)*8;
										index = page*8-offset;
										classCards = theCollection.expansionAll.neutral;
										if (index<classCards.length) {
											loadClassCards(index,classCards);
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
}

function getMaxPages(theCollection) {
	var maxPages = Math.ceil(theCollection.expansionAll.druid.length/8)+
			   Math.ceil(theCollection.expansionAll.hunter.length/8)+
			   Math.ceil(theCollection.expansionAll.mage.length/8)+
			   Math.ceil(theCollection.expansionAll.paladin.length/8)+
			   Math.ceil(theCollection.expansionAll.priest.length/8)+
			   Math.ceil(theCollection.expansionAll.rogue.length/8)+
			   Math.ceil(theCollection.expansionAll.shaman.length/8)+
			   Math.ceil(theCollection.expansionAll.warlock.length/8)+
			   Math.ceil(theCollection.expansionAll.warrior.length/8)+
			   Math.ceil(theCollection.expansionAll.neutral.length/8);
			   
   return maxPages;
}

function getFirstPageOfClass(theClass,theCollection) {
	var page=0;
	if (theClass==="DRUID") {
		return page;
	}
	else
		page+=Math.ceil(theCollection.expansionAll.druid.length/8);
	
	if (theClass==="HUNTER")
		return page;
	else
		page+=Math.ceil(theCollection.expansionAll.hunter.length/8);
	
	if (theClass==="MAGE")
		return page;
	else
		page+=Math.ceil(theCollection.expansionAll.mage.length/8);
	
	if (theClass==="PALADIN")
		return page;
	else
		page+=Math.ceil(theCollection.expansionAll.paladin.length/8);
	
	if (theClass==="PRIEST")
		return page;
	else
		page+=Math.ceil(theCollection.expansionAll.priest.length/8);
	
	if (theClass==="ROGUE")
		return page;
	else
		page+=Math.ceil(theCollection.expansionAll.rogue.length/8);
	
	if (theClass==="SHAMAN")
		return page;
	else
		page+=Math.ceil(theCollection.expansionAll.shaman.length/8);
	
	if (theClass==="WARLOCK")
		return page;
	else
		page+=Math.ceil(theCollection.expansionAll.warlock.length/8);
	
	if (theClass==="WARRIOR")
		return page;
	else
		page+=Math.ceil(theCollection.expansionAll.warrior.length/8);
	
	if (theClass==="NEUTRAL")
		return page;
	else
		page+=Math.ceil(theCollection.expansionAll.neutral.length/8);
}

function loadClassCards(index,classCards) {
	for (var i=0;i<8;i++) {
		if (index+i<classCards.length) {
			setCardTexture(i,classCards[index+i]);
			cardsToDisplay[i].mesh.visible=true;
			if (cardsToDisplay[i].card.amount<=0) {
				cardsToDisplay[i].mesh.getObjectByName("front").material.color.setHex( 0x838383 );
			}
			loadCardAmountText(cardsToDisplay[i], 50,-45,-275, 0);
		} 
		else {
			cardsToDisplay[i].mesh.visible = false;
		}
	}
}

function loadCardAmountText(cardDisplay, size, x, y, z) {
	var loader = new THREE.FontLoader();
	var max;
	var oldText;

	loader.load( 'Font/Harabara_Regular.json', function ( font ) {
		
		oldText = cardDisplay.mesh.getObjectByName("amountText");
		if (oldText!=null) {
			oldText.material.dispose();
			oldText.geometry.dispose();
			cardDisplay.mesh.remove(oldText);
		}
		
		if (cardDisplay.card.rarity==5)
			max='/1';
		else
			max='/2';

		var textGeo = new THREE.TextGeometry( cardDisplay.card.amount+max, {

			font: font,

			size: size,
			height: 1,
			curveSegments: 12

		} );

		var textMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

		var mesh = new THREE.Mesh( textGeo, textMaterial );
		
		mesh.name="amountText";
		
		mesh.position.set(x,y,z);
		cardDisplay.mesh.add(mesh);
	} );
}

function loadArrows(x,y,width,height) {
	var vertices = [new THREE.Vector3(-50,50,0),new THREE.Vector3(50,0,0),new THREE.Vector3(-50,-50,0)];
	var holes = [];
	var triangles, mesh;
	var geometry = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial();
	
	material.color.setHex( 0x000000 );
	geometry.vertices = vertices;
	triangles = THREE.ShapeUtils.triangulateShape( vertices, holes );
	for( var i = 0; i < triangles.length; i++ ){
		geometry.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
	}

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(width/2+x,0,0);
	rightArrow = mesh;
	
	geometry = new THREE.Geometry();
	vertices = [new THREE.Vector3(50,50,0),new THREE.Vector3(-50,0,0),new THREE.Vector3(50,-50,0)];
	geometry.vertices = vertices;
	triangles = THREE.ShapeUtils.triangulateShape( vertices, holes );
	for( var i = 0; i < triangles.length; i++ ){
		geometry.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
	}
	
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(-1*(width/2)+x,0,0);
	leftArrow = mesh;
	
	
}
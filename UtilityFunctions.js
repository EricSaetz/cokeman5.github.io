function clearAssets() {
	animations=[];
	timedFunctions=[];
	
	for (var i=0;i<cardsToDisplay.length;i++) {
		scene.remove(cardsToDisplay[i].mesh);
		for (var n=0;n<cardsToDisplay[i].mesh.children.length;n++) {
			if (cardsToDisplay[i].mesh.children[n].material.map!=null) {
				cardsToDisplay[i].mesh.children[n].material.map.dispose();
			}
			if (cardsToDisplay[i].mesh.children[n].material instanceof THREE.MultiMaterial) {
				cardsToDisplay[i].mesh.children[n].material.materials[0].dispose();
				cardsToDisplay[i].mesh.children[n].material.materials[1].dispose();
			}
			else {
				cardsToDisplay[i].mesh.children[n].material.dispose();
			}
			cardsToDisplay[i].mesh.children[n].geometry.dispose();
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
		if (imagesToDisplay[i].isTemp) {
			unloadImage(imagesToDisplay[i]);
			imagesToDisplay.splice(i,1);
			i--;
		}
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

function createCardDisplay(x,y,z,width,height,isFlipped,onClicked) {
	var cardDisplay;
	var material1 = new THREE.MeshLambertMaterial( { map: null, side: THREE.FrontSide, transparent: true } );
	var material2 = new THREE.MeshLambertMaterial( { map: null, side: THREE.BackSide, transparent: true} );
	object1 = new THREE.Mesh(  new THREE.PlaneGeometry( width, height , 4, 4 ), material1 );
	object2 = new THREE.Mesh(  new THREE.PlaneGeometry( width, height, 4, 4 ), material2 );
	object1.name = "front";
	object2.name = "back";
	object = new THREE.Object3D();
	object.add(object1);
	object.add(object2);
	object1.visible = false;
	object2.visible = false;
	cardDisplay = {mesh:object,onClicked:onClicked,card:null};
	cardsToDisplay.push(cardDisplay);
	if (isFlipped)
		object.rotation.set(0,Math.PI,0,"XYZ");
	object.position.set(x,y,z,"XYZ");
	scene.add( object );
	
	return cardDisplay;
}

function createBarDisplay(x,y,z,width,height,onClicked) {
	var cardDisplay;
	var material = new THREE.MeshLambertMaterial( { map: null, side: THREE.FrontSide, transparent: true } );
	object = new THREE.Mesh(  new THREE.PlaneGeometry( width, height, 4, 4 ), material );
	object.name = "barArt";
	cardDisplay = {mesh:object,onClicked:onClicked,card:null};
	cardsToDisplay.push(cardDisplay);
	object.visible = false;
	object.position.set(x,y,z,"XYZ");
	scene.add( object );
	
	return cardDisplay;
}

function setCardTexture(cardDisplay,card) {
	var map = null;
	var material;
	var loadingImg;

	cardDisplay.card = card;
	
	for (var i=0;i<loadedCardImages.length && map==null;i++) {
		if (loadedCardImages[i].id==card.id && !loadedCardImages[i].isBar) {
			map = loadedCardImages[i].texture;
		}
	}
	
	if (map==null) {
		loadingImg = createLoadingIcon(cardDisplay.mesh.position.x,cardDisplay.mesh.position.y,cardDisplay.mesh.position.z);
		map = loadCardTexture(card,false,function(){doneLoading(map);});
		loadingImages.push({img:map,loadingImg:loadingImg});
	}

	if (cardDisplay.mesh.getObjectByName("front").material.map!=null)
		cardDisplay.mesh.getObjectByName("front").material.map.dispose();
	cardDisplay.mesh.getObjectByName("front").material.map=map;	
	cardDisplay.mesh.getObjectByName("front").material.color.setHex( 0xFFFFFF );
	cardDisplay.mesh.getObjectByName("front").needsUpdate=true;

	cardDisplay.mesh.getObjectByName("front").visible=true;
}

function doneLoading(img) {
	for (var i=0;i<loadingImages.length;i++) {
		if (loadingImages[i].img==img) {
			unloadImage(loadingImages[i].loadingImg);
			loadingImages.splice(i,1);
			i--;
		}
	}
}

function setBarTexture(cardDisplay,card) {
	var map;
	var material;
	
	var barArtObject = cardDisplay.mesh.getObjectByName("barArt");
	var width = barArtObject.geometry.parameters.width;
	var height = barArtObject.geometry.parameters.height;
	
	for (var i=0;i<loadedCardImages.length && map==null;i++) {
		if (loadedCardImages[i].id==card.id && loadedCardImages[i].isBar) {
			map = loadedCardImages[i].texture;
		}
	}
	
	if (map==null)
		map = loadCardTexture(card,true,function(){});
	
	
	var amountText = cardDisplay.mesh.getObjectByName("cardAmountText");
	if (amountText!=null) {
		amountText.material.dispose();
		amountText.geometry.dispose();
		cardDisplay.mesh.remove(amountText);
	}
	
	var manaText = cardDisplay.mesh.getObjectByName("cardManaText");
	if (manaText!=null) {
		if (manaText.material instanceof THREE.MultiMaterial) {
			manaText.material.materials[0].dispose();
			manaText.material.materials[1].dispose();
		}
		manaText.geometry.dispose();
		cardDisplay.mesh.remove(manaText);
	}
	
	if (barArtObject.material.map!=null)
		barArtObject.material.map.dispose();
	
	barArtObject.material.map=map;
	barArtObject.visible=true;
	cardDisplay.card={name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:card.amount, amountGolden:card.amountGolden};
	cardDisplay.mesh.visible=true;
	
	if (card.rarity<5)
		loadTextForDeckList(cardDisplay,"cardAmountText",card.amount,width/390*30,0xD8D63C,null, width/390*160, height/102*-15, 1);
	loadTextForDeckList(cardDisplay,"cardManaText",card.manaCost,width/390*40,0xFFFFFF,0x000000, width/390*-175, height/102*-20, 1);
	
	cardDisplay.mesh.needsUpdate = true;
}

function loadCardTexture(card, isBar, onLoadingFinished) {
	var map;
	
	if (isBar)
		map = new THREE.TextureLoader().load( 'Bars/' + card.name.replace(':','_') + '.png', onLoadingFinished);
	else
		map = new THREE.TextureLoader().load( 'Images/' + card.name.replace(':','_') + '.png', onLoadingFinished);
	map.minFilter = THREE.LinearFilter;
	
	loadedCardImages.push({texture:map,id:card.id,isBar:isBar});
	
	return map;
}

function loadCollectionTextures(theCollection, isBar,onLoadingFinished) {
	var map;
	var alreadyLoaded;
	for (var i=0;i<theCollection.length;i++) {
		for (var z=0;z<loadedCardImages.length;z++) {
			if (loadedCardImages[z].id==theCollection[i].id && loadedCardImages[z].isBar==isBar) {
				alreadyLoaded=true;
				break;
			}
		}
		if (!alreadyLoaded) {
			if (isBar)
				map = new THREE.TextureLoader().load( 'Bars/' + theCollection[i].name.replace(':','_') + '.png', function(){donePreloading(function(){onLoadingFinished();})});
			else
				map = new THREE.TextureLoader().load( 'Images/' + theCollection[i].name.replace(':','_') + '.png', function(){donePreloading(function(){onLoadingFinished();})});
			map.minFilter = THREE.LinearFilter;
			amountPreloading++;
			
			loadedCardImages.push({texture:map,id:theCollection[i].id,isBar:isBar});
		}
	}
}

function donePreloading(onLoadingFinished) {
	amountPreloading--;
	console.log(amountPreloading);
	if (amountPreloading<=0) {
		if (onLoadingFinished!=null) {
			onLoadingFinished();
		}
	}
}

function copyDeckToClipboard() {
	var deck;
	var deckString="";
	if (mode==1)
		deck=randomDeck;
	else if (mode==2)
		deck=currentSealedDeck;
	else if (mode==3)
		deck=rushDeck;
	else if (mode==4)
		deck=arenaDeck;
	else if (mode==5)
		deck=marketDeck;
		
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

function loadImage(theImage,onClicked,isTemp,x,y,z,width,height) {
	var Img;
	var map;
	var flag=true;
	
	for (var i=0;i<loadedImages.length && flag;i++) {
		if (loadedImages[i].name===theImage) {
			flag=false;
			map = loadedImages[i].map;
		}
	}
	
	if (flag) {
		map = new THREE.TextureLoader().load( 'Other/' + theImage + '.png');
		map.minFilter = THREE.LinearFilter;
		loadedImages.push({map:map,name:theImage});
	}
	
	
	var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.FrontSide, transparent: true } );
	object = new THREE.Mesh(  new THREE.PlaneGeometry( width, height, 4, 4 ), material );
	object.visible = true;
	object.position.set(x,y,z);
	object.name = theImage;
	Img = {imgObj:object,isTemp:isTemp,onClicked:onClicked};
	imagesToDisplay.push(Img);
	scene.add( object );
	
	return Img;
}

function createLoadingIcon(x,y,z) {
	var material = new THREE.MeshLambertMaterial( { map: loadingIcon, side: THREE.FrontSide, transparent: true } );
	object = new THREE.Mesh(  new THREE.PlaneGeometry( 100, 100, 4, 4 ), material );
	object.visible = true;
	object.position.set(x,y,z);
	object.name = 'Loading';
	Img = {imgObj:object,isTemp:true,onClicked:null};
	imagesToDisplay.push(Img);
	scene.add( object );
	return Img;
}

function unloadImage(theImage) {
	scene.remove(theImage.imgObj);
	theImage.imgObj.material.map.dispose();
	theImage.imgObj.material.dispose();
	theImage.imgObj.geometry.dispose();
}

function loadText(theText, name, size, x, y, z) {
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
}

function removeText(name) {
	for (var i=0;i<textToDisplay.length;i++) {
		if (textToDisplay[i].name===name) {
			scene.remove(textToDisplay[i]);
			if (textToDisplay[i].material instanceof THREE.MultiMaterial) {
				textToDisplay[i].material.materials[0].dispose();
				textToDisplay[i].material.materials[1].dispose();
			} else {
				textToDisplay[i].material.dispose();
			}
			textToDisplay[i].geometry.dispose();
			textToDisplay.splice(i,1);
			i--;
		}
	}
}

function loadTextForDeckList(cardDisplay, name, theText, size, color, color2, x, y, z) {

	var textGeo;
		
	if (color2!=null)
		textGeo = new THREE.TextGeometry( theText, {font: font,size: size,height: 1,curveSegments: 12,bevelThickness: 1, bevelSize: 4, bevelEnabled: true} );
	else 
		textGeo = new THREE.TextGeometry( theText, {font: font,size: size,height: 1,curveSegments: 12} );
	
	var textMaterial = new THREE.MeshPhongMaterial( { color: color } );
	if (color2!=null) {
		textMaterial = new THREE.MultiMaterial([textMaterial,new THREE.MeshPhongMaterial( { color: color2 } )]);
	}

	var mesh = new THREE.Mesh( textGeo, textMaterial );
	
	mesh.name = name;
	
	mesh.position.set(x,y,z);
	cardDisplay.mesh.add(mesh);
}

function compareCards(card1,card2) {
	if (card1.theClass==='NONE' && !(card2.theClass==='NONE'))
		return 1;
	else if (!(card1.theClass==='NONE') && card2.theClass==='NONE')
		return -1;
	else if (!(card1.theClass===card2.theClass))
		return card1.theClass.localeCompare(card2.theClass);
	else if (card1.manaCost!=card2.manaCost)
		return (card1.manaCost-card2.manaCost);
	else
		return card1.name.localeCompare(card2.name);
}
	
function getRandomClass() {
	var num = Math.floor(Math.random()*9);
	switch (num) {
		case 0 : return "Druid";
			break;
		case 1 : return "Hunter"
			break;
		case 2 : return "Mage"
			break;
		case 3 : return "Paladin"
			break;
		case 4 : return "Priest"
			break;
		case 5 : return "Rogue"
			break;
		case 6 : return "Shaman"
			break;
		case 7 : return "Warlock"
			break;
		case 8 : return "Warrior"
	}
}

function getRandomRarity(commonChance,rareChance,epicChance,legendaryChance) {
	var rand = Math.random();
	if (rand < commonChance)
		return 2;
	rand-=commonChance;
	if (rand < rareChance)
		return 3;
	rand-=epicChance;
	if (rand < epicChance)
		return 4;
	
	return 5;
}
	
function getExpansion(card) {
	if (card.id==251 || card.id==682 || card.id==217 || card.id==559)
		return 0;
	else if (card.id < 683) {
		if (card.rarity==2)
			return 1;
		else
			return 2;
	}
	else if (card.id<12174)
		return 3;
	else if (card.id<14434)
		return 4;
	else if (card.id<22258)
		return 5;
	else if (card.id<27209)
		return 6;
	else if (card.id<27261)
		return 7;
	else if (card.id<42019)
		return 8;
	else if (card.id<49618)
		return 9;
	else
		return 10;
}

function isStandard(card) {
	var exp = getExpansion(card);
	
	return (exp==1 || exp==2 || exp>5);
}

function updateDeckList(deck,offset) {
	deck.sort(function(a, b){return compareCards(a,b)});
	for (var i=0;i<30;i++) {
		if (deck.length>i) {
			if (cardsToDisplay[i+offset].card==null || cardsToDisplay[i+offset].card.id!=deck[i].id || cardsToDisplay[i+offset].card.amount!=deck[i].amount) {
				setBarTexture(cardsToDisplay[i+offset],deck[i]);
			}
		}
		else {
			cardsToDisplay[i+offset].mesh.visible=false;
			cardsToDisplay[i+offset].card=null;
		}
	}
}

function playSound(soundFile, volume) {
	if (document.getElementById("volumeSlider")!=null)
		volume *= document.getElementById("volumeSlider").value/100;
	audioLoader.load( soundFile, function( buffer ) {
		var sound = new THREE.Audio( audioListener );
		sound.setBuffer( buffer );
		sound.setVolume(volume);
		sound.play();
	});
}
function startRandomDeckView() {
	
	loadRandomDeckGUI();
}

function displayRandomDeck() {
	clearAssets();
	
	for (var i=0; i<30;i++) {
		var material = new THREE.MeshLambertMaterial( { map: null, side: THREE.FrontSide, transparent: true } );
		object1 = new THREE.Mesh(  new THREE.PlaneGeometry( 130*3, 34*3, 4, 4 ), material );
			object1.name = "barArt";
			object = new THREE.Object3D();
			object.add(object1);
			object.position.set( 500*Math.floor(i/10)-500,510-34*3*(i%10),0);
			cardsToDisplay.push({mesh:object,card:null});
			object.visible = false;
			scene.add( object );
	}
	
	for (var i=0;i<30;i++) {
		if (i<randomDeck.length) {
			setBarTexture(i,randomDeck[i]);
		}
		else
			cardsToDisplay[i].mesh.visible=false;
	}
}

function createRandomDeck() {
	var index;
	var card;
	var cards;
	var theClass;
	var num;
	var flag = false;
	var percentageClassCards;
	var selectedClass;
	
	percentageClassCards = parseInt(document.getElementById('percentageClassCards').value);
	selectedClass = document.getElementById('classSelect').value;
	
	switch (selectedClass) {
		case 'Random' : theClass = getRandomClass(limitedCollection);
			break;
		case 'Druid' : theClass = limitedCollection.expansionAll.druid;
			break;
		case 'Hunter' : theClass = limitedCollection.expansionAll.hunter;
			break;
		case 'Mage' : theClass = limitedCollection.expansionAll.mage;
			break;
		case 'Paladin' : theClass = limitedCollection.expansionAll.paladin;
			break;
		case 'Priest' : theClass = limitedCollection.expansionAll.priest;
			break;
		case 'Rogue' : theClass = limitedCollection.expansionAll.rogue;
			break;
		case 'Shaman' : theClass = limitedCollection.expansionAll.shaman;
			break;
		case 'Warlock' : theClass = limitedCollection.expansionAll.warlock;
			break;
		case 'Warrior' : theClass = limitedCollection.expansionAll.warrior;
	}
	
	randomDeck=[];
	
	for (var i=0;i<30;i++) {
		flag=false;
		
		if (Math.random()*100<percentageClassCards && theClass.length>0)
			cards = theClass;
		else
			cards = limitedCollection.expansionAll.neutral;
		
		index = Math.floor(Math.random()*cards.length);
		for (var n=0;n<randomDeck.length && !flag;n++) {
			if (randomDeck[n].name===(cards[index].name)) {
				randomDeck[n].amount++;
				flag = true;
			}
		}
		if (!flag) {
			card = {name:cards[index].name,id:cards[index].id,rarity:cards[index].rarity,manaCost:cards[index].manaCost,theClass:cards[index].theClass,amount:1, amountGolden:cards[index].amountGolden};
			randomDeck.push(card);
		}
		cards[index].amount--;
		if (cards[index].amount<=0)
			cards.splice(index,1);
	}
	
	randomDeck.sort(function(a, b){return compareCards(a,b)});
	
	for (var n=0;n<randomDeck.length;n++) {
		addToCollection(randomDeck[n],limitedCollection);
	}
	
	displayRandomDeck();
}

function setBarTexture(num,card) {
	var map;
	var material;
	
	var barArtObject = cardsToDisplay[num].mesh.getObjectByName("barArt");
	var width = barArtObject.geometry.parameters.width;
	var height = barArtObject.geometry.parameters.height;
	
	map = new THREE.TextureLoader().load( 'Bars/' + card.name.replace(':','_') + '.png' );
	map.minFilter = THREE.LinearFilter;
	
	
	if (cardsToDisplay[num].mesh.children.length>=3) {
		var amountText = cardsToDisplay[num].mesh.getObjectByName("cardAmountText");
		if (amountText!=null) {
			amountText.material.dispose();
			amountText.geometry.dispose();
			cardsToDisplay[num].mesh.remove(amountText);
		}
	}
	
	if (cardsToDisplay[num].mesh.children.length>=2) {
		var manaText = cardsToDisplay[num].mesh.getObjectByName("cardManaText");
		if (manaText.material instanceof THREE.MultiMaterial) {
			manaText.material.materials[0].dispose();
			manaText.material.materials[1].dispose();
		}
		manaText.geometry.dispose();
		cardsToDisplay[num].mesh.remove(manaText);
	}
	
	if (barArtObject.material.map!=null)
		barArtObject.material.map.dispose();
	
	barArtObject.material.map=map;
	barArtObject.visible=true;
	cardsToDisplay[num].card=card;
	cardsToDisplay[num].mesh.visible=true;
	
	if (card.rarity<5)
		loadTextForDeckList(cardsToDisplay[num],"cardAmountText",card.amount,width/390*30,0xD8D63C,null, width/390*160, height/102*-15, 1);
	loadTextForDeckList(cardsToDisplay[num],"cardManaText",card.manaCost,width/390*40,0xFFFFFF,0x000000, width/390*-175, height/102*-20, 1);
	
	cardsToDisplay[num].mesh.needsUpdate = true;
}

function loadTextForDeckList(cardDisplay, name, theText, size, color, color2, x, y, z) {
	var loader = new THREE.FontLoader();

	loader.load( 'Font/Harabara_Regular.json', function ( font ) {
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
	} );
}

function filterInput(theEvent) {
	var condition = (theEvent.charCode == 0 || (theEvent.charCode >= 48 && theEvent.charCode <= 57));
	if (theEvent.preventDefault && !condition) 
		theEvent.preventDefault();
}
function startRandomDeckView() {
	
	loadRandomDeckGUI();
}

function displayRandomDeck() {
	clearAssets();
	
	for (var i=0; i<30;i++) {
		var material = new THREE.MeshLambertMaterial( { map: null, side: THREE.FrontSide, transparent: true } );
		object = new THREE.Mesh(  new THREE.PlaneGeometry( 130*3, 34*3, 4, 4 ), material );
			object.position.set( 500*Math.floor(i/10)-500,510-34*3*(i%10),0);
			cardsToDisplay.push({mesh:object,card:null});
			object.visible = false;
			scene.add( object );
	}
	
	for (var i=0;i<30;i++) {
		if (i<randomDeck.length) {
			setBarTexture(i,randomDeck[i].name,randomDeck[i].amount);
			loadTextForDeckList(randomDeck[i].amount,30,0xD8D63C,null, cardsToDisplay[i].mesh.position.x+160, cardsToDisplay[i].mesh.position.y-15, 1);
			loadTextForDeckList(randomDeck[i].manaCost,40,0xFFFFFF,0x000000, cardsToDisplay[i].mesh.position.x-175, cardsToDisplay[i].mesh.position.y-20, 1);
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

function setBarTexture(num,cardName,cardAmount) {
	var map;
	var material;
	
	cardName = cardName.replace(':','_');
	
	map = new THREE.TextureLoader().load( 'Bars/' + cardName + '.png' );
	map.minFilter = THREE.LinearFilter;
	material = new THREE.MeshLambertMaterial( { map: map, side: THREE.FrontSide, transparent: true } );
	
	if (cardAmount<=0) {
			material.color.setHex( 0x838383 );
		}
	
	if (cardsToDisplay[num].mesh.material.map!=null)
		cardsToDisplay[num].mesh.material.map.dispose();
	cardsToDisplay[num].mesh.material.dispose();
	

	cardsToDisplay[num].mesh.material = material;
	cardsToDisplay[num].cardName=cardName;
	cardsToDisplay[num].mesh.visible=true;
	cardsToDisplay[num].mesh.needsUpdate = true;
}

function loadTextForDeckList(theText, size, color, color2, x, y, z) {
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
		
		textToDisplay.push(mesh);
		mesh.position.set(x,y,z);
		scene.add(mesh);
	} );
}

function filterInput(theEvent) {
	var condition = (theEvent.charCode == 0 || (theEvent.charCode >= 48 && theEvent.charCode <= 57));
	if (theEvent.preventDefault && !condition) 
		theEvent.preventDefault();
}
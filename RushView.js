var rushCollection = [];
var rushDeck = [];
var rushDeckSize=0;

function startRushView() {
	
	loadRushGUI();
	
}

function displayRushDeck() {
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
		if (i<rushDeck.length) {
			setBarTexture(i,rushDeck[i].name,rushDeck[i].amount);
			loadTextForDeckList(rushDeck[i].amount,30,0xD8D63C,null, cardsToDisplay[i].mesh.position.x+160, cardsToDisplay[i].mesh.position.y-15, 1);
			loadTextForDeckList(rushDeck[i].manaCost,40,0xFFFFFF,0x000000, cardsToDisplay[i].mesh.position.x-175, cardsToDisplay[i].mesh.position.y-20, 1);
		}
		else
			cardsToDisplay[i].mesh.visible=false;
	}
}

function rushCardClicked(cardDisplay) {
	if (cardDisplay.card.amount>0 && cardDisplay.mesh.position.y>-838) {
		addToRushDeck(cardDisplay.card);
		rushDeckSize++;
		cardDisplay.mesh.material.color.setHex( 0x838383 );
		if (rushDeckSize>30) {
			animations=[];
			rushDeck.sort(function(a, b){return compareCards(a,b)});
			displayRushDeck();
		}
	}
}

function addToRushDeck(card) {
	var flag = false;
	
	for (var n=0;n<rushDeck.length && !flag;n++) {
		if (rushDeck[n].name===card.name) {
			rushDeck[n].amount++;
			flag = true;
		}
	}
	if (!flag) {
		console.log(card.name);
		rushDeck.push({name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1, amountGolden:card.amountGolden});
	}
	
	card.amount--;
}

function startMovingCards(row) {
	if (rushDeckSize<30) {
		var amountOfTime = parseInt(document.getElementById("Time").value)*1000;
		var timeForOneRow = amountOfTime*(1676/(1676+465*Math.floor((rushCollection.length-1)/6)));
		
		for (var i=row*6;i<row*6+6;i++) {
			if (i<rushCollection.length) {
				setCardTexture(i%cardsToDisplay.length,rushCollection[i]);
				if (cardsToDisplay[i%cardsToDisplay.length].mesh.position.y<=-838)
					cardsToDisplay[i%cardsToDisplay.length].mesh.position.y=640+198;
				animations.push({object:cardsToDisplay[i%cardsToDisplay.length].mesh,type:"positionY",amount:-1676,startingValue:cardsToDisplay[i%cardsToDisplay.length].mesh.position.y,startTime:0,endTime:timeForOneRow});
			}
		}
		
		if ((row+1)*6<rushCollection.length)
			timedFunctions.push({timer:0,maxTime:timeForOneRow*(465/1676),onTimeReached:function(){startMovingCards(row+1)}})
	}
}

function startRush() {
	var amountOfCards;
	var index;
	var card;
	var cards;
	var theClass;
	var num;
	var flag = false;
	var selectedClass;
	var material;
	var object;
	
	clearAssets();
  
	for (var i=0; i<24;i++) {
		material = new THREE.MeshLambertMaterial( { map: null, side: THREE.FrontSide, transparent: true } );
		object = new THREE.Mesh(  new THREE.PlaneGeometry( 286, 395, 4, 4 ), material );
			object.position.set( (i%6)*(70+286)-960+70,640+198, 0 );
			object.rotation.set(0,0,0,'XYZ');
			cardsToDisplay.push({mesh:object,card:null});
			object.visible=false;
			scene.add( object );
	}
	
	amountOfCards = parseInt(document.getElementById("amountOfCards").value);
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
	
	rushDeck=[];
	rushCollection=[];
	rushDeckSize=0;
	
	for (var i=0;i<amountOfCards;i++) {
		flag=false;
		
		if (Math.random()<.5 && theClass.length>0)
			cards = theClass;
		else
			cards = limitedCollection.expansionAll.neutral;
		
		index = Math.floor(Math.random()*cards.length);
		for (var n=0;n<rushCollection.length && !flag;n++) {
			if (rushCollection[n].name===(cards[index].name)) {
				rushCollection[n].amount++;
				flag = true;
			}
		}
		if (!flag) {
			card = {name:cards[index].name,id:cards[index].id,rarity:cards[index].rarity,manaCost:cards[index].manaCost,theClass:cards[index].theClass,amount:1, amountGolden:cards[index].amountGolden};
			rushCollection.push(card);
		}
		cards[index].amount--;
		if (cards[index].amount<=0)
			cards.splice(index,1);
	}
	
	for (var n=0;n<rushCollection.length;n++) {
		addToCollection(rushCollection[n],limitedCollection);
	}
	
	startMovingCards(0);
	
}
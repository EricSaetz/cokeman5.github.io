var rushCollection = [];
var rushDeck = [];
var rushDeckSize=0;
var time;
var totalTime;


function startRushView() {
	
	loadRushGUI();
	
}

function displayRushDeck() {
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
		if (i<rushDeck.length) {
			setBarTexture(i,rushDeck[i]);
		}
		else
			cardsToDisplay[i].mesh.visible=false;
	}
}

function rushCardClicked(cardDisplay) {
	if (cardDisplay.card.amount>0 && cardDisplay.mesh.position.y>-838) {
		addToRushDeck(cardDisplay.card);
		rushDeckSize++;
		updateCardCount();
		cardDisplay.mesh.getObjectByName("front").material.color.setHex( 0x838383 );
		if (rushDeckSize>=30) {
			rushOver();
		}
	}
}

function rushOver() {
	var card;
	
	animations=[];
	while (rushDeckSize<30) {
		card = rushCollection[Math.floor(Math.random()*rushCollection.length)];
		if (card.amount>0) {
			rushDeckSize++;
			addToRushDeck(card);
		}
	}
	rushDeck.sort(function(a, b){return compareCards(a,b)});
	displayRushDeck();
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
		rushDeck.push({name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1, amountGolden:card.amountGolden});
	}
	
	card.amount--;
}

function startMovingCards(row) {
	if (rushDeckSize<30) {
		var timeForOneRow = totalTime*(1676/(1676+465*Math.floor((rushCollection.length-1)/6)));
		
		for (var i=row*6;i<row*6+6;i++) {
			if (i<rushCollection.length) {
				setCardTexture(i%cardsToDisplay.length,rushCollection[i]);
				if (cardsToDisplay[i%cardsToDisplay.length].mesh.position.y<=-838)
					cardsToDisplay[i%cardsToDisplay.length].mesh.position.y=640+198;
				animations.push({object:cardsToDisplay[i%cardsToDisplay.length].mesh,type:"positionY",amount:-1676,startingValue:cardsToDisplay[i%cardsToDisplay.length].mesh.position.y,startTime:0,endTime:timeForOneRow});
			}
		}
		
		if ((row+1)*6<rushCollection.length)
			timedFunctions.push({timer:0,maxTime:timeForOneRow*(465/1676),onTimeReached:function(){startMovingCards(row+1)}});
		else {
			timedFunctions.push({timer:0,maxTime:timeForOneRow,onTimeReached:function(){rushOver()}});
		}
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
	var percentageClassCards;
	var amountOfTime;
	
	amountOfCards = parseInt(document.getElementById("amountOfCards").value);
	if (amountOfCards>=30) {
		percentageClassCards = parseInt(document.getElementById('percentageClassCards').value);
		clearAssets();
	  
		for (var i=0; i<24;i++) {
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
			object.position.set( (i%6)*(70+286)-960+70,640+198, 0 );
			scene.add( object );
		}
		
		time = parseInt(document.getElementById("Time").value);
		totalTime = parseInt(document.getElementById("Time").value)*1000;
		
		loadText(Math.floor(time/60),"timerMinutes",100,-675,500,0);
		loadText(":","timerColon",100,-590,500,0);
		loadText(Math.floor((time%60)/10),"timerTenSeconds",100,-550,500,0);
		loadText(time%10,"timerSeconds",100,-470,500,0);
		
		loadText("0/30","amountText",100,400,500,0);
		
		timedFunctions.push({timer:0,maxTime:1000,onTimeReached:function(){updateTime()}});
		
		setCardBack(document.getElementById("cardBackSelect").value);
		
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
			
			if (Math.random()*100<percentageClassCards && theClass.length>0)
				cards = theClass;
			else
				cards = limitedCollection.expansionAll.neutral;
			
			index = Math.floor(Math.random()*cards.length);
			card = {name:cards[index].name,id:cards[index].id,rarity:cards[index].rarity,manaCost:cards[index].manaCost,theClass:cards[index].theClass,amount:1, amountGolden:cards[index].amountGolden};
			rushCollection.push(card);
			cards[index].amount--;
			if (cards[index].amount<=0)
				removeFromCollection(cards[index],limitedCollection);
		}
		
		console.log(rushCollection.length);
		for (var i=0;i<rushCollection.length;i++) {
			card = rushCollection[i];
			card = {name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1, amountGolden:card.amountGolden};
			addToCollection(card, limitedCollection,2);
		}
		console.log(limitedCollection.expansionAll.allCards.length);
		
		startMovingCards(0);
	}
}

function updateTime() {
	if (time>0) {
		var timerText;
		time--;
		if (Math.floor((time+1)/60)!=Math.floor(time/60)) {
			timerText = scene.getObjectByName("timerMinutes");
			scene.remove(timerText);
			timerText.material.dispose();
			timerText.geometry.dispose();
			loadText(Math.floor(time/60),"timerMinutes",100,-675,500,0);
		}
		if (Math.floor(((time+1)%60)/10)!=Math.floor((time%60)/10)) {
			timerText = scene.getObjectByName("timerTenSeconds");
			scene.remove(timerText);
			timerText.material.dispose();
			timerText.geometry.dispose();
			loadText(Math.floor((time%60)/10),"timerTenSeconds",100,-550,500,0);
		}
		
		timerText = scene.getObjectByName("timerSeconds");
		scene.remove(timerText);
		timerText.material.dispose();
		timerText.geometry.dispose();
		loadText(time%10,"timerSeconds",100,-470,500,0);
		
		timedFunctions.push({timer:0,maxTime:1000,onTimeReached:function(){updateTime()}});
	}
}

function updateCardCount() {
	var amountText;
	
	amountText = scene.getObjectByName("amountText")
	scene.remove(amountText);
	amountText.material.dispose();
	amountText.geometry.dispose();
	loadText(rushDeckSize+"/30","amountText",100,400,500,0);
	
}
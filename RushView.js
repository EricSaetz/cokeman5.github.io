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
		createBarDisplay( 500*Math.floor(i/10)-500,510-34*3*(i%10),0,130*3,34*3,null);
	}
	
	for (var i=0;i<30;i++) {
		if (i<rushDeck.length) {
			setBarTexture(cardsToDisplay[i],rushDeck[i]);
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
	
	playSound("Sounds/Rush Draft Over.ogg", 1);
	
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

function startMovingCards() {
	var amountOfRows = Math.ceil(rushCollection.length/6);
	var distance = -1*(1280+396*amountOfRows);
	
	for (var i=0;i<rushCollection.length;i++) {
		setCardTexture(cardsToDisplay[i],rushCollection[i]);
		animations.push({object:cardsToDisplay[i].mesh,type:"positionY",amount:distance,startingValue:cardsToDisplay[i].mesh.position.y,startTime:0,endTime:totalTime});
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
	var neutrals;
	var standardOnly = document.getElementById('standardCheckBox').checked;
	
	amountOfCards = parseInt(document.getElementById("amountOfCards").value);
	if (amountOfCards>=30) {
		percentageClassCards = parseInt(document.getElementById('percentageClassCards').value);
		clearAssets();
		
		createLoadingIcon(0,0,0);
	  
		for (var i=0; i<amountOfCards;i++) {
			createCardDisplay( (i%6)*(70+286)-960+70,640+198+396*Math.floor(i/6), 0 , 286, 395, false, rushCardClicked );
		}
		
		setCardBack(document.getElementById("cardBackSelect").value);
		
		selectedClass = document.getElementById('classSelect').value;
		
		if (selectedClass==="Random")
			selectedClass=getRandomClass();
		
		switch (selectedClass) {
			case 'Druid' : theClass = getSubCollection(collection,function(card){return card.theClass==="DRUID" && card.amount>0 && (!standardOnly || isStandard(card))},true);
				break;
			case 'Hunter' : theClass = getSubCollection(collection,function(card){return card.theClass==="HUNTER" && card.amount>0 && (!standardOnly || isStandard(card))},true);
				break;
			case 'Mage' : theClass = getSubCollection(collection,function(card){return card.theClass==="MAGE" && card.amount>0 && (!standardOnly || isStandard(card))},true);
				break;
			case 'Paladin' : theClass = getSubCollection(collection,function(card){return card.theClass==="PALADIN" && card.amount>0 && (!standardOnly || isStandard(card))},true);
				break;
			case 'Priest' : theClass = getSubCollection(collection,function(card){return card.theClass==="PRIEST" && card.amount>0 && (!standardOnly || isStandard(card))},true);
				break;
			case 'Rogue' : theClass = getSubCollection(collection,function(card){return card.theClass==="ROGUE" && card.amount>0 && (!standardOnly || isStandard(card))},true);
				break;
			case 'Shaman' : theClass = getSubCollection(collection,function(card){return card.theClass==="SHAMAN" && card.amount>0 && (!standardOnly || isStandard(card))},true);
				break;
			case 'Warlock' : theClass = getSubCollection(collection,function(card){return card.theClass==="WARLOCK" && card.amount>0 && (!standardOnly || isStandard(card))},true);
				break;
			case 'Warrior' : theClass = getSubCollection(collection,function(card){return card.theClass==="WARRIOR" && card.amount>0 && (!standardOnly || isStandard(card))},true);
		}
		
		neutrals = getSubCollection(collection,function(card){return card.theClass==="NONE" && card.amount>0 && (!standardOnly || isStandard(card))},true);
		
		rushDeck=[];
		rushCollection=[];
		rushDeckSize=0;
		
		for (var i=0;i<amountOfCards;i++) {
			flag=false;
			
			if (Math.random()*100<percentageClassCards && theClass.length>0)
				cards = theClass;
			else
				cards = neutrals;
			
			if (cards.length>0) {
				index = Math.floor(Math.random()*cards.length);
				card = {name:cards[index].name,id:cards[index].id,rarity:cards[index].rarity,manaCost:cards[index].manaCost,theClass:cards[index].theClass,amount:1, amountGolden:cards[index].amountGolden};
				cards[index].amount--;
				if (cards[index].amount<=0)
					cards.splice(index,1);
			} else {
				card = {name:"Shadow of Nothing",id:-1,rarity:4,manaCost:0,theClass:"PRIEST",amount:1, amountGolden:0};
			}
			rushCollection.push(card);
		}
		
		loadCollectionTextures(rushCollection, false,function(){ onFinishedLoadingRush(); });
	}
}

function onFinishedLoadingRush() {
	for (var i=0;i<imagesToDisplay.length;i++) {
		if (imagesToDisplay[i].imgObj.name==="Loading") {
			unloadImage(imagesToDisplay[i]);
			imagesToDisplay.splice(i,1);
			i--;
		}
	}
	
	time = parseInt(document.getElementById("Time").value);
	totalTime = parseInt(document.getElementById("Time").value)*1000;
	
	loadText(Math.floor(time/60)+' : '+time%60,"timer",100,-470,500,0);
	updateCardCount();
	timedFunctions.push({timer:0,maxTime:1000,onTimeReached:function(){updateTime()}});
	timedFunctions.push({timer:0,maxTime:totalTime,onTimeReached:function(){rushOver();}});
	
	startMovingCards();
}

function updateTime() {
	
	removeText("timer");
	if (time>0) {
		time--;
		console.log(time);
		
		if (time%60<10)
			loadText(Math.floor(time/60)+' : 0'+time%60,"timer",100,-470,500,0);
		else
			loadText(Math.floor(time/60)+' : '+time%60,"timer",100,-470,500,0);
		
		timedFunctions.push({timer:0,maxTime:1000,onTimeReached:function(){updateTime()}});
	}
}

function updateCardCount() {
	removeText("amountText");
	loadText(rushDeckSize+"/30","amountText",100,400,500,0);
	
}
var randomDeck = [];

function startRandomDeckView() {
	loadRandomDeckGUI();
}

function displayRandomDeck() {
	clearAssets();
	
	for (var i=0; i<30;i++) {
		createBarDisplay( 500*Math.floor(i/10)-500,510-34*3*(i%10),0,130*3,34*3,null);
	}
	
	for (var i=0;i<30;i++) {
		if (i<randomDeck.length) {
			setBarTexture(cardsToDisplay[i],randomDeck[i]);
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
	var neutrals;
	var isReno,isStand;
	
	isReno = document.getElementById('renoCheckBox').checked;
	isStand = document.getElementById('standardCheckBox').checked;
	percentageClassCards = parseInt(document.getElementById('percentageClassCards').value);
	selectedClass = document.getElementById('classSelect').value;
	
	createLoadingIcon(0,0,0);
	
	if (selectedClass==="Random")
		selectedClass=getRandomClass();
	
	switch (selectedClass) {
		case 'Druid' : theClass = getSubCollection(collection,function(card){return card.theClass==="DRUID" && card.amount>0},true);
			break;
		case 'Hunter' : theClass = getSubCollection(collection,function(card){return card.theClass==="HUNTER" && card.amount>0},true);
			break;
		case 'Mage' : theClass = getSubCollection(collection,function(card){return card.theClass==="MAGE" && card.amount>0},true);
			break;
		case 'Paladin' : theClass = getSubCollection(collection,function(card){return card.theClass==="PALADIN" && card.amount>0},true);
			break;
		case 'Priest' : theClass = getSubCollection(collection,function(card){return card.theClass==="PRIEST" && card.amount>0},true);
			break;
		case 'Rogue' : theClass = getSubCollection(collection,function(card){return card.theClass==="ROGUE" && card.amount>0},true);
			break;
		case 'Shaman' : theClass = getSubCollection(collection,function(card){return card.theClass==="SHAMAN" && card.amount>0},true);
			break;
		case 'Warlock' : theClass = getSubCollection(collection,function(card){return card.theClass==="WARLOCK" && card.amount>0},true);
			break;
		case 'Warrior' : theClass = getSubCollection(collection,function(card){return card.theClass==="WARRIOR" && card.amount>0},true);
	}
		
		
	neutrals = getSubCollection(collection,function(card){return card.theClass==="NONE" && card.amount>0},true);
	
	if (isStand) {
		theClass = getSubCollection(theClass,function(card){return isStandard(card)},false);
		neutrals = getSubCollection(neutrals,function(card){return isStandard(card)},false);
	}
	
	if (isReno) {
		for (var z=0;z<theClass.length;z++)
			theClass[z].amount=1;
		for (var z=0;z<neutrals.length;z++)
			neutrals[z].amount=1;
	}
	
	randomDeck=[];
	
	for (var i=0;i<30;i++) {
		flag=false;
		
		if (i==0 && isReno) {
			for (var z=0;z<neutrals.length;z++) {
				if (neutrals[z].id==27228) {
					randomDeck.push({name:neutrals[z].name,id:neutrals[z].id,rarity:neutrals[z].rarity,manaCost:neutrals[z].manaCost,theClass:neutrals[z].theClass,amount:1, amountGolden:neutrals[z].amountGolden});
					i++;
					break;
				}
			}
		}
		
		if (Math.random()*100<percentageClassCards && theClass.length>0)
			cards = theClass;
		else
			cards = neutrals;
		
		index = Math.floor(Math.random()*cards.length);
		for (var n=0;n<randomDeck.length && !flag;n++) {
			if (randomDeck[n].id==cards[index].id) {
				randomDeck[n].amount++;
				flag = true;
			}
		}
		if (!flag) {
			if (cards.length>0)
				card = {name:cards[index].name,id:cards[index].id,rarity:cards[index].rarity,manaCost:cards[index].manaCost,theClass:cards[index].theClass,amount:1, amountGolden:cards[index].amountGolden};
			else
				card = {name:"Shadow of Nothing",id:-1,rarity:4,manaCost:0,theClass:"PRIEST",amount:1, amountGolden:0};
			randomDeck.push(card);
		}
		
		
		
		cards[index].amount--;
		if (cards[index].amount<=0)
			cards.splice(index,1);
	}
	
	randomDeck.sort(function(a, b){return compareCards(a,b)});
	
	loadCollectionTextures(randomDeck, true, displayRandomDeck);
}

function filterInput(theEvent) {
	var condition = (theEvent.charCode == 0 || (theEvent.charCode >= 48 && theEvent.charCode <= 57));
	if (theEvent.preventDefault && !condition) 
		theEvent.preventDefault();
}
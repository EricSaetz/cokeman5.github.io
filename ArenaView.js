var arenaDeck = [];
var currentSelection = 1;
var cardsPerSelection;
var arenaCardPool;

function startArenaView() {
	loadArenaGUI();
}

function loadArenaGeometries() {
	cardsPerSelection = parseInt(document.getElementById("cardChoiceAmount").value);
	
	for (var i=0; i<cardsPerSelection;i++) {
		if (cardsPerSelection>4)
			createCardDisplay(-817+395*(i%4),286-572*Math.floor(i/4),0,286,395,false,arenaCardClicked);
		else
			createCardDisplay(-817+395*i,0,0,286,395,false,arenaCardClicked);
	}
	
	for (var i=0; i<30;i++) {
		createBarDisplay( 900,590-i*40,0,255,40,null);
	}
}

function displaySelection(num) {
	for (var i=0;i<cardsPerSelection;i++) {
		setCardTexture(cardsToDisplay[i],arenaPool[num*cardsPerSelection+i]);
	}
}

function arenaCardClicked(cardDisplay) {
	var flag = false;
	var draftCards;
	
	for (var i=0;i<arenaDeck.length && !flag;i++) {
		if (arenaDeck[i].id==cardDisplay.card.id) {
			arenaDeck[i].amount++;
			flag=true;
		}
	}
	if (!flag)
		arenaDeck.push(cardDisplay.card);
	
	updateDeckList(arenaDeck,cardsPerSelection);
	
	if (currentSelection<=30) {
		removeFromCollection(cardDisplay.card.id,1,arenaCardPool);
		draftCards = getDraftCards();
		for (i=0;i<cardsPerSelection;i++)
			setCardTexture(cardsToDisplay[i],draftCards[i]);
	}
	else {
		clearAssets();
		playSound("Sounds/Arena Draft Over.ogg", 1);
		for (var i=0; i<30;i++)
			createBarDisplay( 500*Math.floor(i/10)-500,510-34*3*(i%10),0,130*3,34*3,null);
		updateDeckList(arenaDeck,0);
	}
}

function startArenaDraft() {
	var classes = [1,2,3,4,5,6,7,8,9];
	var index;
	
	clearAssets();
	loadArenaGeometries();
	
	playSound("Sounds/Choose Hero.ogg", 1);
	
	for (var i=0;i<3;i++) {
		index = Math.floor(Math.random()*classes.length);
		
		switch (classes[index]) {
			case 1 : loadImage("DruidPortrait",function(){startDrafting("DRUID"); clearIcons();},true,-600+600*i,0,0,306*1.5,464*1.5);
				break;
			case 2 : loadImage("HunterPortrait",function(){startDrafting("HUNTER"); clearIcons();},true,-600+600*i,0,0,306*1.5,464*1.5);
				break;
			case 3 : loadImage("MagePortrait",function(){startDrafting("MAGE"); clearIcons();},true,-600+600*i,0,0,306*1.5,464*1.5);
				break;
			case 4 : loadImage("PaladinPortrait",function(){startDrafting("PALADIN"); clearIcons();},true,-600+600*i,0,0,306*1.5,464*1.5);
				break;
			case 5 : loadImage("PriestPortrait",function(){startDrafting("PRIEST"); clearIcons();},true,-600+600*i,0,0,306*1.5,464*1.5);
				break;
			case 6 : loadImage("RoguePortrait",function(){startDrafting("ROGUE"); clearIcons();},true,-600+600*i,0,0,306*1.5,464*1.5);
				break;
			case 7 : loadImage("ShamanPortrait",function(){startDrafting("SHAMAN"); clearIcons();},true,-600+600*i,0,0,306*1.5,464*1.5);
				break;
			case 8 : loadImage("WarlockPortrait",function(){startDrafting("WARLOCK"); clearIcons();},true,-600+600*i,0,0,306*1.5,464*1.5);
				break;
			case 9 : loadImage("WarriorPortrait",function(){startDrafting("WARRIOR"); clearIcons();},true,-600+600*i,0,0,306*1.5,464*1.5);
		}
		
		classes.splice(index,1);
	}
}

function startDrafting(theClass) {
	var draftCards;
	var allowBanned = document.getElementById("bannedCardsCheckBox").checked;
	var allowCthun = document.getElementById("c'thunCheckBox").checked;
	var standardOnly = document.getElementById('standardCheckBox').checked;
	
	arenaDeck=[];
	currentSelection=1;
	
	arenaCardPool = getSubCollection(collection,function(card){return card.amount>0 && (card.theClass==="NONE" || card.theClass===theClass) && (!standardOnly || isStandard(card))&& (allowBanned || !isBanned(card)) && (allowCthun || !isCthun(card))},true);
	
	draftCards = getDraftCards();
	
	for (i=0;i<cardsPerSelection;i++)
		setCardTexture(cardsToDisplay[i],draftCards[i]);
}

function isBanned(card) {
	var bannedList = [27216,12230,33178,12212,33135,12259,129,367,216,12234,151,12245,348,27232,327,22387,27256,208,
	148,7726,311,149,12270,22334,193,22320,646,12203,14439,454,12211,101,12224,86,12304,22258,27227,553,415,12278,117,
	22385,22327,22379,207];
	
	for (var i=0;i<bannedList.length;i++)
		if (bannedList[i]==card.id)
			return true;
		
	return false;
}

function isCthun(card) {
	var cthunList = [31114,31112,33123,35189,33154,35192,35196,35197,35202,35211,35212,35239,35242,33121,33122,35191,35201,31110];
	
	for (var i=0;i<cthunList.length;i++)
		if (cthunList[i]==card.id)
			return true;
		
	return false;
}

function getDraftCards() {
	var cardsForRound = [];
	var rarity;
	var neutralCards = [];
	var classCards = [];
	
	if (currentSelection==1 || currentSelection%10==0)
		rarity=getRandomRarity(0,.8,.16,.04);
	else
		rarity = getRandomRarity(.8411,.128,.0255,.0054);
	
	switch (rarity) {
		case 2 : {
			neutralCards = getSubCollection(arenaCardPool,function(card){return (card.rarity==2 || card.rarity==1) && card.theClass=="NONE"},true);
			classCards = getSubCollection(arenaCardPool,function(card){return (card.rarity==2 || card.rarity==1) && card.theClass!="NONE"},true);
		} break;
		case 3 : {
			neutralCards = getSubCollection(arenaCardPool,function(card){return card.rarity==3 && card.theClass=="NONE"},true);
			classCards = getSubCollection(arenaCardPool,function(card){return card.rarity==3 && card.theClass!="NONE"},true);
		} break;
		case 4 : {
			neutralCards = getSubCollection(arenaCardPool,function(card){return card.rarity==4 && card.theClass=="NONE"},true);
			classCards = getSubCollection(arenaCardPool,function(card){return card.rarity==4 && card.theClass!="NONE"},true);
		} break;
		case 5 : {
			neutralCards = getSubCollection(arenaCardPool,function(card){return card.rarity==5 && card.theClass=="NONE"},true);
			classCards = getSubCollection(arenaCardPool,function(card){return card.rarity==5 && card.theClass!="NONE"},true);
		}
	}
	
	var card;
	for (var i=0;i<cardsPerSelection;i++) {
		var classChance = classCards.length/(classCards.length+neutralCards.length)+.25;
		
		if (Math.random()<classChance && classCards.length!=0) {
			card = classCards[Math.floor(Math.random()*classCards.length)];
			removeFromCollection(card.id,999,classCards);
			card = {name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1, amountGolden:card.amountGolden};
		} else if (neutralCards.length!=0) {
			card = neutralCards[Math.floor(Math.random()*neutralCards.length)];
			removeFromCollection(card.id,999,neutralCards);
			card = {name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1, amountGolden:card.amountGolden};
		} else {
			card = {name:"Shadow of Nothing",id:-1,rarity:4,manaCost:0,theClass:"PRIEST",amount:1, amountGolden:0};
		}
		
		cardsForRound.push(card);
	}
	
	currentSelection++;
	
	return cardsForRound;
}

function clearIcons() {
	for (var i=0;i<imagesToDisplay.length;i++) {
		if (imagesToDisplay[i].imgObj.name.includes("Portrait")) {
			unloadImage(imagesToDisplay[i]);
			imagesToDisplay.splice(i,1);
			i--;
		}
	}
}
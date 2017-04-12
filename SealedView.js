var packAmounts = [50,0,0,0,0,0,0,0,0,0,0,0];
var packs = [];
var hiddenCards = [true,true,true,true,true];
var packNum = 0;
var sealedCollection = [];
var sealedDeck1 = [];
var sealedDeck2 = [];
var sealedDeck3 = [];
var currentSealedDeck = [];
var currentSealedDeckSize = 0;
var doneButton;
var whichView;

function startSealedView() {
	loadSealedGUI();
}

function loadSealedOpeningView() {
	clearAssets();
	whichView = 0;
	var scale = 12;
	
	createCardDisplay(-30*scale,7*scale,0,286,395,true,sealedCardClicked);
	createCardDisplay(0,30*scale,0,286,395,true,sealedCardClicked);
	createCardDisplay(30*scale,7*scale,0,286,395,true,sealedCardClicked);
	createCardDisplay(19*scale,-30*scale,0,286,395,true,sealedCardClicked);
	createCardDisplay(-19*scale,-30*scale,0,286,395,true,sealedCardClicked);
	
	setCardBack(document.getElementById("cardBackSelect").value);
	
	doneButton = loadImage("doneButton",doneButtonPressed,true,0,0,0,300,192);
}

function autoOpen() {
	if (document.getElementById("openingModeSelect").value==="Auto") {
		for (var cardIndex=0;cardIndex<5 && !hiddenCards[cardIndex];cardIndex++);
		if (cardIndex<5) {
			setCardTexture(cardsToDisplay[cardIndex],cardsToDisplay[cardIndex].card);
			playCardRevealSound(cardsToDisplay[cardIndex].card);
			animations.push({object:cardsToDisplay[cardIndex].mesh,type:"rotationY",amount:Math.PI,startingValue:cardsToDisplay[cardIndex].mesh.rotation.y,startTime:0,endTime:800});
			hiddenCards[cardIndex]=false;
			if (cardIndex!=4)
				timedFunctions.push({timer:0,maxTime:800,onTimeReached:function(){autoOpen()}});
			else {
				timedFunctions.push({timer:0,maxTime:1600,onTimeReached:function(){autoOpen()}});
				doneButton.imgObj.visible=true;
			}
		} 
		else {
			if (packNum+1<packs.length) {
				packNum++;
				displayPack();
				timedFunctions.push({timer:0,maxTime:800,onTimeReached:function(){autoOpen()}});
			} 
			else {
				loadSealedCollectionView();
			}
		}
	}
}

function loadSealedCollectionView() {
	theCollection=sealedCollection;
	startCollectionView(-180,0,1690,1240, sealedCollectionCardClicked, null);
	whichView=1;
	sealedDeck1=[];
	sealedDeck2=[];
	sealedDeck3=[];
	currentSealedDeck=sealedDeck1;
	
	for (var i=0; i<30;i++) {
		createBarDisplay( 900,550-i*40,0,255,40,sealedCollectionBarClicked);
	}
	
	loadImage("Deck1",switchDeck1,true,820,590,0,85,30);
	loadImage("Deck2",switchDeck2,true,905,590,0,85,30);
	loadImage("Deck3",switchDeck3,true,990,590,0,85,30);
}

function openingModeChanged(value) {
	if (whichView===0) {
		if (value==="Auto" && timedFunctions.length<=0) {
			timedFunctions.push({timer:0,maxTime:800,onTimeReached:function(){autoOpen()}});
		}
		else if (value==="Instant")
			loadSealedCollectionView();
	}
}

function doneButtonPressed() {
	if (document.getElementById("openingModeSelect").value==="Normal") {
		if (packNum+1<packs.length) {
			packNum++;
			displayPack();
		} 
		else {
			loadSealedCollectionView();
		}
	}
}

function sealedCardClicked(cardDisplay) {
	
	if (whichView==0) {
		if (document.getElementById("openingModeSelect").value==="Normal") {
			for (var i=0;i<5;i++) {
				if (cardsToDisplay[i]==cardDisplay) {
					if (hiddenCards[i]) {
						setCardTexture(cardDisplay,cardDisplay.card);
						playCardRevealSound(cardDisplay.card);
						animations.push({object:cardDisplay.mesh,type:"rotationY",amount:Math.PI,startingValue:cardDisplay.mesh.rotation.y,startTime:0,endTime:800});
						hiddenCards[i]=false;
					}
				}
			}
			
			if (!hiddenCards[0] && !hiddenCards[1] && !hiddenCards[2] && !hiddenCards[3] && !hiddenCards[4])
				doneButton.imgObj.visible=true;
		}
	}
}

function playCardRevealSound(card) {
	switch (card.rarity) {
		case 3 : {
			playSound('Sounds/card_turn_over_rare.ogg',.2);
			playSound('Sounds/Rare.ogg',1); 
		}
			break;
		case 4 : {
			playSound('Sounds/card_turn_over_epic.ogg',.2);
			playSound('Sounds/Epic.ogg',1);
		}
			break;
		case 5 : {
			playSound('Sounds/card_turn_over_legendary.ogg',.2);
			playSound('Sounds/Legendary.ogg',1);
		}
			break;
		default : playSound('Sounds/card_turn_over_normal.ogg',.2);
	}
}

function sealedCollectionCardClicked(cardDisplay) {
	var cardFoundInDeck = false;
	
		if (currentSealedDeckSize<30 && cardDisplay.card.amount > 0) {
			currentSealedDeckSize++;
			//if card is not unique to the deck
			for (var i=0;i<currentSealedDeck.length && !cardFoundInDeck;i++) {
				if (currentSealedDeck[i].id==cardDisplay.card.id) {
					if (currentSealedDeck[i].rarity<5 && currentSealedDeck[i].amount<2) {
						currentSealedDeck[i].amount++;
						cardDisplay.card.amount--;
						removeFromCollection(cardDisplay.card.id,1,sealedCollection);
						loadCardAmountText(cardDisplay, 50,-45,-255, 0);
						if (cardDisplay.card.amount<=0)
							cardDisplay.mesh.getObjectByName("front").material.color.setHex( 0x838383 );
						setBarTexture(cardsToDisplay[i+8],currentSealedDeck[i]);
					}
					cardFoundInDeck=true;
				}
			}
			//if card is  unique to the deck
			if (!cardFoundInDeck) {
				currentSealedDeck.push({name:cardDisplay.card.name,id:cardDisplay.card.id,rarity:cardDisplay.card.rarity,manaCost:cardDisplay.card.manaCost,theClass:cardDisplay.card.theClass,amount:1,cardId:cardDisplay.card.cardId});
				cardDisplay.card.amount--;
				removeFromCollection(cardDisplay.card.id,1,sealedCollection);
				loadCardAmountText(cardDisplay, 50,-45,-255, 0);
				if (cardDisplay.card.amount<=0)
					cardDisplay.mesh.getObjectByName("front").material.color.setHex( 0x838383 );
			}
		}
		
		updateDeckList(currentSealedDeck,8);
}

function sealedCollectionBarClicked(cardDisplay) {
	cardDisplay.card.amount--;
	addToCollection({name:cardDisplay.card.name,id:cardDisplay.card.id,rarity:cardDisplay.card.rarity,manaCost:cardDisplay.card.manaCost,theClass:cardDisplay.card.theClass,amount:1,cardId:cardDisplay.card.cardId},sealedCollection,null,1);
	currentSealedDeckSize--;
	for (var i=0;i<8;i++) {
		if (cardsToDisplay[i].card.id==cardDisplay.card.id) {
			cardsToDisplay[i].card.amount++;
			loadCardAmountText(cardsToDisplay[i], 50,-45,-255, 0);
			cardsToDisplay[i].mesh.getObjectByName("front").material.color.setHex( 0xFFFFFF );
		}
	}
	
	for (var i=0;i<currentSealedDeck.length;i++) {
		if (currentSealedDeck[i].id==cardDisplay.card.id) {
			currentSealedDeck[i].amount = cardDisplay.card.amount;
			if (cardDisplay.card.amount>0)
				setBarTexture(cardDisplay,cardDisplay.card);
			else {
				currentSealedDeck.splice(i,1);
				i--;
			}
		}
	}
	
	updateDeckList(currentSealedDeck,8);
}

function displayPack() {
		if (packs.length>0) {
		doneButton.imgObj.visible=false;
		for (var i=0;i<5;i++) {
			setCardBack(document.getElementById("cardBackSelect").value);
			cardsToDisplay[i].card = packs[packNum][i];
			hiddenCards[i]=true;
			cardsToDisplay[i].mesh.getObjectByName("front").visible=false;
			cardsToDisplay[i].mesh.rotation.y=Math.PI;
			animations=[];
		}
	}
}

function addPacks() {
	var amount = parseInt(document.getElementById("amountTextField").value);
	var index = parseInt(document.getElementById("packSelect").selectedIndex);
	
	packAmounts[index]+=amount;
	
	updatePacksTextArea();
}

function removePacks() {
	var amount = parseInt(document.getElementById("amountTextField").value);
	var index = parseInt(document.getElementById("packSelect").selectedIndex);
	
	packAmounts[index]-=amount;
	if (packAmounts[index]<0)
		packAmounts[index]=0;
	
	updatePacksTextArea();
}

function clearPacks() {
	for (var i=0;i<packAmounts.length;i++) {
		packAmounts[i]=0;
	}
	
	updatePacksTextArea();
}

function openPacks() {
	var theExpansion;
	var flag = false;
	
	sealedCollection = [];
	
	packs=[];
	
	createLoadingIcon(0,0,0);
	
	for (var i=0;i<packAmounts.length;i++) {
		if (packAmounts[i]>0) {
			switch (i) {
				case 0 : theExpansion = getSubCollection(collection,function(card){return card.amount>0},true);
					break;
				case 1 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==1},true);
					break;
				case 2 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==2},true);
					break;
				case 3 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==3},true);
					break;
				case 4 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==4},true);
					break;
				case 5 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==5},true);
					break;
				case 6 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==6},true);
					break;
				case 7 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==7},true);
					break;
				case 8 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==8},true);
					break;
				case 9 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==9},true);
					break;
				case 10 : theExpansion = getSubCollection(collection,function(card){return card.amount>0 && getExpansion(card)==10},true);
			}
			
			for (var n=0;n<packAmounts[i];n++) {
				var aPack=generatePack(theExpansion);
				for (var z=0;z<aPack.length;z++) {
					flag = false;
					for (var m=0;m<sealedCollection.length && !flag;m++) {
						if (sealedCollection[m].id==aPack[z].id) {
							sealedCollection[m].amount++;
							flag=true;
						}
					}
					if (!flag) {
						sealedCollection.push(aPack[z]);
					}
				}
				packs.push(aPack);
			}
		}
	}
	
	sealedCollection.sort(function(a, b){return compareCards(a,b)});
	loadCollectionTextures(sealedCollection, false,onFinishedLoadingSealed);
}

function onFinishedLoadingSealed() {
	for (var i=0;i<imagesToDisplay.length;i++) {
		if (imagesToDisplay[i].imgObj.name==="Loading") {
			unloadImage(imagesToDisplay[i]);
			imagesToDisplay.splice(i,1);
			i--;
		}
	}
	
	if (document.getElementById("openingModeSelect").value==="Instant") {
		for (var i=0;i<sealedCollection.length;i++)
			loadCardTexture(sealedCollection[i],true);
		loadSealedCollectionView();
	}
	else if (document.getElementById("openingModeSelect").value==="Auto") {
		loadSealedOpeningView();
		packNum=0;
		displayPack();
		timedFunctions.push({timer:0,maxTime:800,onTimeReached:function(){autoOpen()}});
	}
	else {
		loadSealedOpeningView();
		packNum=0;
		displayPack();
	}
}

function updatePacksTextArea() {
	var textAreaContents = '';
	var packNames = ["Wild", "Basic","Classic","Naxx","GvG","BRM","TGT","LOE","OG","KARA","MSG"];
	for (var i=0;i<packNames.length;i++) {
		if (i!=0)
			textAreaContents+='&#13;&#10;'
		textAreaContents+=packNames[i]+':'+packAmounts[i];
	}
	
	var packAmountsText = document.getElementById('packAmountsText');
	packAmountsText.innerHTML=textAreaContents;
}

function generatePack(expansion) {
	var pack = [];
	var rarity;
	var cardPool;
	var card;
	var commonsInPack=0;
	var index;
	var flag;
	
	var commons = getSubCollection(expansion,function(card){return card.rarity==1 || card.rarity==2},false);
	var rares = getSubCollection(expansion,function(card){return card.rarity==3},false);
	var epics = getSubCollection(expansion,function(card){return card.rarity==4},false);
	var legendaries = getSubCollection(expansion,function(card){return card.rarity==5},false);
	
	for (var z=0;z<5;z++) {
		rarity = Math.random();
		if (rarity<.0110 && legendaries.length>0)
			cardPool=legendaries;
		else if (rarity<.0552 && epics.length>0)
			cardPool=epics;
		else if ((rarity<.2293 || commonsInPack>=4) && rares.length>0)
			cardPool=rares;
		else {
			commonsInPack++;
			cardPool=commons;
		}
		if (cardPool.length>0) {
			index = Math.floor(Math.random()*cardPool.length);
			card = cardPool[index];
			if (card.amount==1 && card.rarity!=5) {
				cardPool.splice(index,1);
				flag = false;
				for (var i=0;!flag && i<expansion.length;i++)
					if (expansion[i].id==card.id) {
						expansion.splice(i,1);
						i--;
						flag=true;
					}
			}
			card = {name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1,cardId:card.cardId};
		} else {
			card = {name:"Shadow of Nothing",id:-1,rarity:4,manaCost:0,theClass:"PRIEST",amount:1,cardId:"EX1_345t"};
		}
		pack.push(card);
	}
	
	return pack;
}

function switchDeck1() {
	currentSealedDeck = sealedDeck1;
	
	currentSealedDeckSize=0;
	for (var i;i<currentSealedDeck.length;i++) {
		currentDeckSealedSize+=currentSealedDeck[i].amount;
	}
	
	updateDeckList(currentSealedDeck,8);
}

function switchDeck2() {
	currentSealedDeck = sealedDeck2;
	
	currentSealedDeckSize=0;
	for (var i;i<currentSealedDeck.length;i++) {
		currentDeckSealedSize+=currentSealedDeck[i].amount;
	}
	
	updateDeckList(currentSealedDeck,8);
}

function switchDeck3() {
	currentSealedDeck = sealedDeck3;
	
	currentSealedDeckSize=0;
	for (var i;i<currentSealedDeck.length;i++) {
		currentDeckSealedSize+=currentSealedDeck[i].amount;
	}
	
	updateDeckList(currentSealedDeck,8);
}
var packAmounts = [0,0,0,0,0,0,0,0,0,0];
var packs = [];
var hiddenCards = [true,true,true,true,true];
var packNum = 0;
var sealedCollection = [];
var sealedDeck = [];
var sealedDeckSize = 0;
var whichView;

function startSealedView() {
	loadSealedGUI();
}

function loadSealedOpeningView() {
	clearAssets();
	whichView = "Opening";
	
	for (var i=0; i<5;i++) {
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
		object.rotation.set(0,Math.PI,0,"XYZ");
		scene.add( object );
	}
	
	setCardBack(document.getElementById("cardBackSelect").value);
	
	var scale = 12;
	cardsToDisplay[0].mesh.position.set(-30*scale,7*scale,0);
	cardsToDisplay[1].mesh.position.set(0,30*scale,0);
	cardsToDisplay[2].mesh.position.set(30*scale,7*scale,0);
	cardsToDisplay[3].mesh.position.set(19*scale,-30*scale,0);
	cardsToDisplay[4].mesh.position.set(-19*scale,-30*scale,0);
	
	loadDoneButton();
}

function autoOpen() {
	if (document.getElementById("openingModeSelect").value==="Auto") {
		for (var cardIndex=0;cardIndex<5 && !hiddenCards[cardIndex];cardIndex++);
		if (cardIndex<5) {
			setCardTexture(cardsToDisplay[cardIndex],cardsToDisplay[cardIndex].card);
			animations.push({object:cardsToDisplay[cardIndex].mesh,type:"rotationY",amount:Math.PI,startingValue:cardsToDisplay[cardIndex].mesh.rotation.y,startTime:0,endTime:800});
			hiddenCards[cardIndex]=false;
			if (cardIndex!=4)
				timedFunctions.push({timer:0,maxTime:800,onTimeReached:function(){autoOpen()}});
			else {
				timedFunctions.push({timer:0,maxTime:1600,onTimeReached:function(){autoOpen()}});
				doneButton.visible=true;
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
	startCollectionView(sealedCollection,-200,0,1670,1240);
	whichView="Collection";
	sealedDeckSize=0;
	sealedDeck=[];
	
	for (var i=0; i<30;i++) {
		var material = new THREE.MeshLambertMaterial( { map: null, side: THREE.FrontSide, transparent: true } );
		object1 = new THREE.Mesh(  new THREE.PlaneGeometry( 255, 40, 4, 4 ), material );
		object1.name = "barArt";
		object = new THREE.Object3D();
		object.add(object1);
		object.position.set( 900,590-i*40,0);
		cardsToDisplay.push({mesh:object,card:null});
		object.visible = false;
		scene.add( object );
	}
}

function openingModeChanged(value) {
	if (whichView==="Opening") {
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

function sealedCardClicked(num) {
	var flag = false;
	var card = cardsToDisplay[num].card;
	if (whichView==="Opening") {
		if (document.getElementById("openingModeSelect").value==="Normal") {
			if (hiddenCards[num]) {
				setCardTexture(cardsToDisplay[num],card);
				animations.push({object:cardsToDisplay[num].mesh,type:"rotationY",amount:Math.PI,startingValue:cardsToDisplay[num].mesh.rotation.y,startTime:0,endTime:800});
				hiddenCards[num]=false;
			}
			
			if (!hiddenCards[0] && !hiddenCards[1] && !hiddenCards[2] && !hiddenCards[3] && !hiddenCards[4])
				doneButton.visible=true;
		}
	}
	else if (whichView==="Collection") {
		if (num<8) {
			if (sealedDeckSize<30) {
				sealedDeckSize++;
				for (var i=0;i<sealedDeck.length && !flag;i++) {
					if (card.amount > 0 && sealedDeck[i].id==card.id) {
						if (sealedDeck[i].rarity<5 && sealedDeck[i].amount<2) {
							sealedDeck[i].amount++;
							card.amount--;
							loadCardAmountText(cardsToDisplay[num], 50,-45,-275, 0);
							if (card.amount<=0)
								cardsToDisplay[num].mesh.getObjectByName("front").material.color.setHex( 0x838383 );
							setBarTexture(cardsToDisplay[i+8],sealedDeck[i]);
						}
						flag=true;
					}
				}
				if (card.amount > 0 && !flag) {
					sealedDeck.push({name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1, amountGolden:card.amountGolden});
					card.amount--;
					loadCardAmountText(cardsToDisplay[num], 50,-45,-275, 0);
					if (card.amount<=0)
						cardsToDisplay[num].mesh.getObjectByName("front").material.color.setHex( 0x838383 );
				}
			}
		}
		else {
			card.amount--;
			addToCollection({name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1, amountGolden:card.amountGolden},sealedCollection,null,1);
			for (var i=0;i<8;i++) {
				if (cardsToDisplay[i].card.id==card.id) {
					loadCardAmountText(cardsToDisplay[i], 50,-45,-275, 0);
					cardsToDisplay[i].mesh.getObjectByName("front").material.color.setHex( 0xFFFFFF );
				}
			}
			if (card.amount>0)
				setBarTexture(cardsToDisplay[num],card);
			else {
				for (var i=0;i<sealedDeck.length;i++) {
					if (sealedDeck[i].id==card.id) {
						sealedDeck.splice(i,1);
					}
				}
			}
		}
		updateDeckList();
	}
}

function updateDeckList() {
	sealedDeck.sort(function(a, b){return compareCards(a,b)});
	console.log(sealedDeck);
	for (var i=0;i<30;i++) {
		if (sealedDeck.length>i) {
			if (cardsToDisplay[i+8].card==null || cardsToDisplay[i+8].card.id!=sealedDeck[i].id) {
				setBarTexture(cardsToDisplay[i+8],sealedDeck[i]);
			}
		}
		else {
			for (var n=0;n<cardsToDisplay[i+8].mesh.children.length;n++) {
				cardsToDisplay[i+8].mesh.children[n].visible=false;
				cardsToDisplay[i+8].card=null;
			}
		}
	}
}

function displayPack() {
	if (packs.length>0) {
		doneButton.visible=false;
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
	
	sealedCollection = initCollection();
	
	packs=[];
	clearPreloadedImages();
	
	for (var i=0;i<packAmounts.length;i++) {
		switch (i) {
			case 0 : theExpansion = limitedCollection.expansionAll;
				break;
			case 1 : theExpansion = limitedCollection.expansionBasic;
				break;
			case 2 : theExpansion = limitedCollection.expansionClassic;
				break;
			case 3 : theExpansion = limitedCollection.expansionNaxx;
				break;
			case 4 : theExpansion = limitedCollection.expansionGvG;
				break;
			case 5 : theExpansion = limitedCollection.expansionBRM;
				break;
			case 6 : theExpansion = limitedCollection.expansionTGT;
				break;
			case 7 : theExpansion = limitedCollection.expansionLOE;
				break;
			case 8 : theExpansion = limitedCollection.expansionOG;
				break;
			case 9 : theExpansion = limitedCollection.expansionKARA;
				break;
		}
		
		for (var n=0;n<packAmounts[i];n++) {
			var aPack=generatePack(theExpansion);
			for (var z=0;z<aPack.length;z++)
				addToCollection(aPack[z],sealedCollection,null,1);
			packs.push(aPack);
		}
	}
	
	sortCollection(sealedCollection);
	
	for (var i=0;i<sealedCollection.expansionAll.allCards.length;i++)
		preloadCardTexture(sealedCollection.expansionAll.allCards[i]);
	
	if (document.getElementById("openingModeSelect").value==="Instant")
		loadSealedCollectionView();
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
	var packNames = ["Wild", "Basic","Classic","Naxx","GvG","BRM","TGT","LOE","OG","KARA"];
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
	
	
	for (var z=0;z<5;z++) {
		rarity = Math.random();
		if (rarity<.0110 && expansion.legendaries.length>0)
			cardPool=expansion.legendaries;
		else if (rarity<.0552 && expansion.epics.length>0)
			cardPool=expansion.epics;
		else if ((rarity<.2293 || commonsInPack>=4) && expansion.rares.length>0)
			cardPool=expansion.rares;
		else {
			commonsInPack++;
			cardPool=expansion.commons;
		}
		if (cardPool.length>0) {
			card = cardPool[Math.floor(Math.random()*cardPool.length)];
			card = {name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1, amountGolden:card.amountGolden};
		} else {
			card = {name:"Shadow of Nothing",id:-1,rarity:4,manaCost:0,theClass:"PRIEST",amount:1, amountGolden:0};
		}
		pack.push(card);
	}
	
	return pack;
}

function loadDoneButton() {
	map = new THREE.TextureLoader().load( 'Other/doneButton.png' );
	map.minFilter = THREE.LinearFilter;
	var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.FrontSide, transparent: true } );
	object = new THREE.Mesh(  new THREE.PlaneGeometry( 300, 192, 4, 4 ), material );
	object.visible=false;
	doneButton = object;
	scene.add( object );
}
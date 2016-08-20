var packAmounts = [0,0,0,0,0,0,0,0,0,0];
var packs = [];
var hiddenCards = [true,true,true,true,true];
var packNum = 0;
var sealedCollection = [];
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
			setCardTextureForSealed(cardIndex,cardsToDisplay[cardIndex].card);
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

function openingModeChanged(value) {
	console.log(value);
	if (whichView==="Opening") {
		if (value==="Auto" && timedFunctions.length<=0) {
			timedFunctions.push({timer:0,maxTime:800,onTimeReached:function(){autoOpen()}});
		}
		else if (value==="Instant")
			loadSealedCollectionView();
	}
}

function loadSealedCollectionView() {
	var material;
	
	clearAssets();
	whichView="Collection";
  
	for (var i=0; i<8;i++) {
		material = new THREE.MeshLambertMaterial( { map: null, side: THREE.FrontSide, transparent: true } );
		object = new THREE.Mesh(  new THREE.PlaneGeometry( 286, 395, 4, 4 ), material );
			object.position.set( (286+212.4)*(i%4)+212.4-960, 620-(Math.floor(i/4)*(150+395))-150-197.5, 0 );
			object.rotation.set(0,0,0,'XYZ');
			cardsToDisplay.push({mesh:object,card:null});
			scene.add( object );
	}
	
	loadArrows();
	currentPage = 0;
	loadPage(currentPage,sealedCollection);
	scene.add(rightArrow);
	scene.add(leftArrow);
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
	if (document.getElementById("openingModeSelect").value==="Normal") {
		if (hiddenCards[num]) {
			setCardTextureForSealed(num,cardsToDisplay[num].card);
			animations.push({object:cardsToDisplay[num].mesh,type:"rotationY",amount:Math.PI,startingValue:cardsToDisplay[num].mesh.rotation.y,startTime:0,endTime:800});
			hiddenCards[num]=false;
		}
		
		if (!hiddenCards[0] && !hiddenCards[1] && !hiddenCards[2] && !hiddenCards[3] && !hiddenCards[4])
			doneButton.visible=true;
	}
}

function displayPack() {
	if (packs.length>0) {
		doneButton.visible=false;
		for (var i=0;i<5;i++) {
			setCardBack(i,document.getElementById("cardBackSelect").value);
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
	
	sealedCollection = {expansionAll:[], expansionBasic:[], expansionClassic:[], expansionNaxx:[], expansionGvG:[], expansionBRM:[],
				  expansionTGT:[], expansionLOE:[], expansionOG:[], expansionKARA:[], expansionOther:[]};
	var n;
	for (n in sealedCollection) {
		sealedCollection[n]={allCards:[],commons:[],rares:[],epics:[],legendaries:[],druid:[],hunter:[],
					mage:[],rogue:[],warlock:[],warrior:[],shaman:[],paladin:[],priest:[],neutral:[]};
	}
	
	packs=[];
	
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
				addToCollection(aPack[z],sealedCollection,null);
			packs.push(aPack);
		}
	}
	
	sortCollection(sealedCollection);
	
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
	for (var z=0;z<5;z++) {
		rarity = Math.random();
		if (rarity<.011 && expansion.legendaries.length>0)
			cardPool=expansion.legendaries;
		else if (rarity<.0552 && expansion.epics.length>0)
			cardPool=expansion.epics;
		else if (rarity<.2836 && expansion.rares.length>0)
			cardPool=expansion.rares;
		else {
			cardPool=expansion.commons;
		}
		card = cardPool[Math.floor(Math.random()*cardPool.length)];
		card = {name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:1, amountGolden:card.amountGolden};
		pack.push(card);
	}
	
	return pack;
}

function setCardBack(num,cardBackName) {
	var map;
	var material;
	
	map = new THREE.TextureLoader().load( 'Card Backs/'+cardBackName+'.png' );
	map.minFilter = THREE.LinearFilter;
	material2 = new THREE.MeshLambertMaterial( { map: map, side: THREE.BackSide, transparent: true } );
	
	if (cardsToDisplay[num].mesh.getObjectByName("back").material.map!=null)
		cardsToDisplay[num].mesh.getObjectByName("back").material.map.dispose();
	cardsToDisplay[num].mesh.getObjectByName("back").material.dispose();
	cardsToDisplay[num].mesh.getObjectByName("back").material=material2;
	cardsToDisplay[num].mesh.getObjectByName("back").needsUpdate=true;
	
	cardsToDisplay[num].mesh.getObjectByName("back").visible=true;
}

function setCardTextureForSealed(num,card) {
	var map;
	var material;
	
	cardsToDisplay[num].card = card;
	
	map = new THREE.TextureLoader().load( 'Images/' + card.name.replace(':','_') + '.png' );
	map.minFilter = THREE.LinearFilter;
	material = new THREE.MeshLambertMaterial( { map: map, side: THREE.FrontSide, transparent: true } );
	
	if (cardsToDisplay[num].mesh.getObjectByName("front").material.map!=null)
		cardsToDisplay[num].mesh.getObjectByName("front").material.map.dispose();
	cardsToDisplay[num].mesh.getObjectByName("front").material.dispose();
	cardsToDisplay[num].mesh.getObjectByName("front").material=material;
	cardsToDisplay[num].mesh.getObjectByName("front").needsUpdate=true;
	
	cardsToDisplay[num].mesh.getObjectByName("front").visible=true;
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
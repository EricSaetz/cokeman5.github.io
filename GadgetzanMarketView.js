var funds;
var prices = [];
var marketCollection;
var marketDeck = [];
var marketDeckSize = 0;

function startMarketView() {
	loadMarketGUI();
}

function loadMarket() {
	var standardOnly = document.getElementById('standardCheckBox').checked;
	
	playSound("Sounds/GadgetzanIntro.ogg", 1);
	marketCollection = getSubCollection(collection,function(card){return (!standardOnly || isStandard(card));},true);
	theCollection=marketCollection;
	startCollectionView(-180,20,1690,1190, marketCollectionCardClicked, loadCardPrices);
	marketDeckSize=0;
	marketDeck=[];
	funds=parseInt(document.getElementById("budgetTextField").value);
	
	for (var i=0; i<30;i++) {
		createBarDisplay( 900,540-i*40,0,255,40,marketCollectionBarClicked);
	}
	
	loadText("Funds: "+funds+"G","fundsText", 40, 750,570,0);
}

function marketCollectionCardClicked(cardDisplay) {
	var cardFoundInDeck = false;
	var price = getPrice(cardDisplay.card);
	
	if (marketDeckSize<30 && cardDisplay.card.amount > 0 && funds>=price) {
		marketDeckSize++;
		funds-=price;
		
		removeText("fundsText");
		loadText("Funds: "+funds+"G","fundsText", 40, 750,570,0);
		removeText("fundsText");
		loadText("Funds: "+funds+"G","fundsText", 40, 750,570,0);
		
		//if card is not unique to the deck
		for (var i=0;i<marketDeck.length && !cardFoundInDeck;i++) {
			if (marketDeck[i].id==cardDisplay.card.id) {
				if (marketDeck[i].rarity<5 && marketDeck[i].amount<2) {
					marketDeck[i].amount++;
					cardDisplay.card.amount--;
					removeFromCollection(cardDisplay.card.id,1,marketCollection);
					loadCardAmountText(cardDisplay, 50,-45,-255, 0);
					if (cardDisplay.card.amount<=0)
						cardDisplay.mesh.getObjectByName("front").material.color.setHex( 0x838383 );
					setBarTexture(cardsToDisplay[i+8],marketDeck[i]);
				}
				cardFoundInDeck=true;
			}
		}
		//if card is  unique to the deck
		if (!cardFoundInDeck) {
			marketDeck.push({name:cardDisplay.card.name,id:cardDisplay.card.id,rarity:cardDisplay.card.rarity,manaCost:cardDisplay.card.manaCost,theClass:cardDisplay.card.theClass,amount:1, amountGolden:cardDisplay.card.amountGolden});
			cardDisplay.card.amount--;
			removeFromCollection(cardDisplay.card.id,1,marketCollection);
			loadCardAmountText(cardDisplay, 50,-45,-255, 0);
			if (cardDisplay.card.amount<=0)
				cardDisplay.mesh.getObjectByName("front").material.color.setHex( 0x838383 );
		}
	}
	
	updateDeckList(marketDeck,8);
}

function marketCollectionBarClicked(cardDisplay) {
	cardDisplay.card.amount--;
	funds+=getPrice(cardDisplay.card);
		
	removeText("fundsText");
	loadText("Funds: "+funds+"G","fundsText", 40, 750,570,0);
	
	addToCollection({name:cardDisplay.card.name,id:cardDisplay.card.id,rarity:cardDisplay.card.rarity,manaCost:cardDisplay.card.manaCost,theClass:cardDisplay.card.theClass,amount:1, amountGolden:cardDisplay.card.amountGolden},marketCollection,null,1);
	for (var i=0;i<8;i++) {
		if (cardsToDisplay[i].card.id==cardDisplay.card.id) {
			cardsToDisplay[i].card.amount++;
			loadCardAmountText(cardsToDisplay[i], 50,-45,-255, 0);
			cardsToDisplay[i].mesh.getObjectByName("front").material.color.setHex( 0xFFFFFF );
		}
	}
	if (cardDisplay.card.amount>0)
		setBarTexture(cardDisplay,cardDisplay.card);
	else {
		for (var i=0;i<marketDeck.length;i++) {
			if (marketDeck[i].id==cardDisplay.card.id) {
				marketDeck.splice(i,1);
				i--;
			}
		}
	}
	
	for (var i=0;i<marketDeck.length;i++) {
		if (marketDeck[i].id==cardDisplay.card.id) {
			marketDeck[i].amount = cardDisplay.card.amount;
			if (cardDisplay.card.amount>0)
				setBarTexture(cardDisplay,cardDisplay.card);
			else {
				marketDeck.splice(i,1);
				i--;
			}
		}
	}
	
	updateDeckList(marketDeck,8);
}

function loadCardPrices() {
	for (var i=0;i<8;i++) {
		if (cardsToDisplay[i].card!=null) {
			loadCardPriceText(cardsToDisplay[i], 50,-65,-315, 0,getPrice(cardsToDisplay[i].card));
		}
	}
}

function generateCardPrice(card) {
	var price;
	var date = new Date();
	var rng;
	
	rng = new Math.seedrandom(""+Math.floor((date.getTime()-date.getTimezoneOffset()*60*1000)/86400000)+card.id);
	
	price = rng()*200+(card.rarity-1)*100;
	price = Math.floor(price);
	
	prices.push({price:price,id:card.id});
	
	return price;
}

function getPrice(card) {
	for (var z=0;z<prices.length;z++) {
		if (prices.id==card.id) {
			return prices[z].price;
		}
	}
	
	return generateCardPrice(card);
}

function loadCardPriceText(cardDisplay, size, x, y, z, price) {
	var max;
	var oldText;

	oldText = cardDisplay.mesh.getObjectByName("priceText");
		if (oldText!=null) {
			oldText.material.dispose();
			oldText.geometry.dispose();
			cardDisplay.mesh.remove(oldText);
		}

		var textGeo = new THREE.TextGeometry( price+'G', {

			font: font,

			size: size,
			height: 1,
			curveSegments: 12

		} );

		var textMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

		var mesh = new THREE.Mesh( textGeo, textMaterial );
		
		mesh.name="priceText";
		
		mesh.position.set(x,y,z);
		cardDisplay.mesh.add(mesh);
}
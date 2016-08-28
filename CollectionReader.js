var collection = [];
var limitedCollection = [];

function handleSubmitAttempt(i) {
		var usernames = document.getElementById('username').value.split(";");
		var html = [];
		var text;
		var splitText;
		var element;
		var tempCollection;
		
		console.log(usernames[i]);
		
		$.ajax({
			type: 'GET',
			url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.hearthpwn.com%2Fmembers%2F"+usernames[i]+"%2Fcollection'&diagnostics=true",
			dataType: 'text',
			success: function(data) {
				text = data.split('\n');
				if (i==0) {
					collection = readCollection(text,2,0);
					limitedCollection = readCollection(text,2,1);
				}
				else {
					tempCollection = readCollection(text,2,0);
					intersectCollections(collection, tempCollection);
					tempCollection = readCollection(text,2,1);
					intersectCollections(limitedCollection, tempCollection);
				}
				
				if (i==usernames.length-1) {
					element = document.getElementById("accountForm");
					element.parentNode.removeChild(element);
					element = document.getElementById("submitButton");
					element.parentNode.removeChild(element);
					element = document.getElementById("appDescriptionText");
					element.parentNode.removeChild(element);
					loadMainGUI();
					init();
					startCollectionView(collection,0,0,1920,1240);
					document.getElementById("modeDescription").innerHTML = "Here you can view your collection.";
					animate();
				} 
				else 
					handleSubmitAttempt(i+1);
			}
		});
}

function initCollection() {
	var theCollection = {expansionAll:[], expansionBasic:[], expansionClassic:[], expansionNaxx:[], expansionGvG:[], expansionBRM:[],
				  expansionTGT:[], expansionLOE:[], expansionOG:[], expansionKARA:[], expansionOther:[]};
				  
	var n;
	for (n in theCollection) {
		theCollection[n]={allCards:[],commons:[],rares:[],epics:[],legendaries:[],druid:[],hunter:[],
					mage:[],rogue:[],warlock:[],warrior:[],shaman:[],paladin:[],priest:[],neutral:[]};
	}
	
	return theCollection;
}

function readCollection(text, max, min) {
		var cardName="";
		var cardAmount=0;
		var rarity=0;
		var manaCost=0;
		var theClass='NEUTRAL';
		var amountGolden=0;
		var isGolden=false;
		var id;
		var cardData;
		var tempCollection;
		
		var card;
		
		tempCollection = initCollection();
		
		for (var n=0;n<text.length;n++) {
			if (text[n].includes('data-card-name')) {
				cardData=text[n].split('"');
				cardName = cardData[15];
				cardName = cardName.replace(/&amp;#27;/g,'\'');
				id = parseInt(cardData[21]);
				rarity = parseInt(cardData[25]);
				manaCost = parseInt(cardData[11]);
				theClass=cardData[5];
				isGolden = (cardData[23]==="TRUE");
			}
			else if (text[n].includes('data-card-count')) {
				cardAmount = parseInt(text[n].split('"')[3]);
				if (isGolden)
					amountGolden=cardAmount;
				
				card = {name:cardName,id:id,rarity:rarity,manaCost:manaCost,theClass:theClass,amount:cardAmount, amountGolden:amountGolden};
				addToCollection(card,tempCollection,max,min);
			}
		}
		
		return tempCollection;
	}
	
	function intersectCollections(collection1,collection2) {
		collection1 = collection1.expansionAll.allCards;
		collection2 = collection2.expansionAll.allCards;
		for (var i=0;i<collection1.length;i++) {
			for (var n=0;n<collection2.length;n++) {
				if (collection1[i].id==collection2[n].id) {
					intersectCards(collection1[i],collection2[n]);
					collection2.splice(n,1);
				}
			}
		}
	}
	
	function intersectCards(card1, card2) {
		card1.amount = Math.min(card1.amount,card2.amount);
	}
	
	function addToCollection(card,theCollection,maxAmount,minAmount) {
		var cards = theCollection.expansionAll.allCards;
		var flag = false;
		
		if (card.amount>=minAmount && card.id!=-1) {
			for (i=0;i<cards.length && !flag;i++) {
				if (cards[i].id==card.id) {
					flag = true;
					cards[i].amount+=card.amount;
					cards[i].amountGolden+=card.amountGolden;
					if (maxAmount!=null) {
						if (cards[i].amount>maxAmount)
							cards[i].amount=maxAmount;
						if (cards[i].amountGolden>maxAmount)
							cards[i].amountGolden=maxAmount;
					}
				}
			}
			
			
			if (!flag) {
				addToExpansion(card,theCollection.expansionAll);
				if (card.id==251 || card.id==682 || card.id==217 || card.id==559)
					addToExpansion(card,theCollection.expansionOther);
				else if (card.id < 683) {
					if (card.rarity==2)
						addToExpansion(card,theCollection.expansionBasic);
					else
						addToExpansion(card,theCollection.expansionClassic);
				}
				else if (card.id<12174)
					addToExpansion(card,theCollection.expansionNaxx);
				else if (card.id<14434)
					addToExpansion(card,theCollection.expansionGvG);
				else if (card.id<22258)
					addToExpansion(card,theCollection.expansionBRM);
				else if (card.id<27209)
					addToExpansion(card,theCollection.expansionTGT);
				else if (card.id<27261)
					addToExpansion(card,theCollection.expansionLOE);
				else if (card.id<42019)
					addToExpansion(card,theCollection.expansionOG);
				else
					addToExpansion(card,theCollection.expansionKARA);
			}
		}
	}
	
	function addToExpansion(card,expansion) {
		expansion.allCards.push(card);
		switch (card.rarity) {
				case 1 : expansion.commons.push(card);
					break;
				case 2 : expansion.commons.push(card);
					break;
				case 3 : expansion.rares.push(card);
					break;
				case 4 : expansion.epics.push(card);
					break;
				case 5 : expansion.legendaries.push(card);
					break;
			}
			
			switch (card.theClass) {
				case 'DRUID': expansion.druid.push(card);
					break;
				case 'HUNTER': expansion.hunter.push(card);
					break;
				case 'MAGE': expansion.mage.push(card);
					break;
				case 'PRIEST': expansion.priest.push(card);
					break;
				case 'PALADIN': expansion.paladin.push(card);
					break;
				case 'ROGUE': expansion.rogue.push(card);
					break;
				case 'SHAMAN': expansion.shaman.push(card);
					break;
				case 'WARLOCK': expansion.warlock.push(card);
					break;
				case 'WARRIOR': expansion.warrior.push(card);
					break;
				case 'NONE': expansion.neutral.push(card);
					break;
			}
		}
		
	function removeFromCollection(card, theCollection) {
		removeFromExpansion(card,theCollection.expansionAll);
		if (card.id==251 || card.id==682 || card.id==217 || card.id==559)
			removeFromExpansion(card,theCollection.expansionOther);
		else if (card.id < 683) {
			if (card.rarity==2)
				removeFromExpansion(card,theCollection.expansionBasic);
			else
				removeFromExpansion(card,theCollection.expansionClassic);
		}
		else if (card.id<12174)
			removeFromExpansion(card,theCollection.expansionNaxx);
		else if (card.id<14434)
			removeFromExpansion(card,theCollection.expansionGvG);
		else if (card.id<22258)
			removeFromExpansion(card,theCollection.expansionBRM);
		else if (card.id<27209)
			removeFromExpansion(card,theCollection.expansionTGT);
		else if (card.id<27261)
			removeFromExpansion(card,theCollection.expansionLOE);
		else if (card.id<42019)
			removeFromExpansion(card,theCollection.expansionOG);
		else
			removeFromExpansion(card,theCollection.expansionKARA);
	}
	
	function removeFromExpansion(card, theExpansion) {
		removeFromCardList(card,theExpansion.allCards);
		switch (card.theClass) {
			case 'DRUID': removeFromCardList(card, theExpansion.druid);
				break;
			case 'HUNTER': removeFromCardList(card, theExpansion.hunter);
				break;
			case 'MAGE': removeFromCardList(card, theExpansion.mage);
				break;
			case 'PRIEST': removeFromCardList(card, theExpansion.priest);
				break;
			case 'PALADIN': removeFromCardList(card, theExpansion.paladin);
				break;
			case 'ROGUE': removeFromCardList(card, theExpansion.rogue);
				break;
			case 'SHAMAN': removeFromCardList(card, theExpansion.shaman);
				break;
			case 'WARLOCK': removeFromCardList(card, theExpansion.warlock);
				break;
			case 'WARRIOR': removeFromCardList(card, theExpansion.warrior);
				break;
			case 'NONE': removeFromCardList(card, theExpansion.neutral);
		}
			
		switch (card.rarity) {
			case 1 : removeFromCardList(card, theExpansion.commons);
				break;
			case 2 : removeFromCardList(card, theExpansion.commons);
				break;
			case 3 : removeFromCardList(card, theExpansion.rares);
				break;
			case 4 : removeFromCardList(card, theExpansion.epics);
				break;
			case 5 : removeFromCardList(card, theExpansion.legendaries);
		}
	}
	
	function removeFromCardList(card, cardList) {
		for (var i=0;i<cardList.length;i++) {
			if (cardList[i].id==card.id)
				cardList.splice(i,1);
		}
	}
		
	function compareCards(card1,card2) {
		if (card1.theClass==='NONE' && !(card2.theClass==='NONE'))
			return 1;
		else if (!(card1.theClass==='NONE') && card2.theClass==='NONE')
			return -1;
		else if (!(card1.theClass===card2.theClass))
			return card1.theClass.localeCompare(card2.theClass);
		else if (card1.manaCost-card2.manaCost!=0)
			return card1.manaCost-card2.manaCost;
		else
			return card1.name.localeCompare(card2.name);
	}
	
	function sortCollection(theCollection) {
		sortExpansion(theCollection.expansionAll);
		sortExpansion(theCollection.expansionBasic);
		sortExpansion(theCollection.expansionClassic);
		sortExpansion(theCollection.expansionNaxx);
		sortExpansion(theCollection.expansionGvG);
		sortExpansion(theCollection.expansionBRM);
		sortExpansion(theCollection.expansionTGT);
		sortExpansion(theCollection.expansionLOE);
		sortExpansion(theCollection.expansionOG);
		sortExpansion(theCollection.expansionKARA);
		sortExpansion(theCollection.expansionOther);
	}
	
	function sortExpansion(theExpansion) {
		theExpansion.druid.sort(function(a, b){return compareCards(a,b)});
		theExpansion.hunter.sort(function(a, b){return compareCards(a,b)});
		theExpansion.mage.sort(function(a, b){return compareCards(a,b)});
		theExpansion.paladin.sort(function(a, b){return compareCards(a,b)});
		theExpansion.priest.sort(function(a, b){return compareCards(a,b)});
		theExpansion.rogue.sort(function(a, b){return compareCards(a,b)});
		theExpansion.shaman.sort(function(a, b){return compareCards(a,b)});
		theExpansion.warlock.sort(function(a, b){return compareCards(a,b)});
		theExpansion.warrior.sort(function(a, b){return compareCards(a,b)});
		theExpansion.neutral.sort(function(a, b){return compareCards(a,b)});
		theExpansion.commons.sort(function(a, b){return compareCards(a,b)});
		theExpansion.rares.sort(function(a, b){return compareCards(a,b)});
		theExpansion.epics.sort(function(a, b){return compareCards(a,b)});
		theExpansion.legendaries.sort(function(a, b){return compareCards(a,b)});
	}
	
	function getRandomClass(collection) {
		var theClass,num;
		
		num = Math.floor(Math.random()*9);
		switch (num) {
			case 0 : theClass = collection.expansionAll.druid;
				break;
			case 1 : theClass = collection.expansionAll.hunter;
				break;
			case 2 : theClass = collection.expansionAll.mage;
				break;
			case 3 : theClass = collection.expansionAll.paladin;
				break;
			case 4 : theClass = collection.expansionAll.priest;
				break;
			case 5 : theClass = collection.expansionAll.rogue;
				break;
			case 6 : theClass = collection.expansionAll.shaman;
				break;
			case 7 : theClass = collection.expansionAll.warlock;
				break;
			case 8 : theClass = collection.expansionAll.warrior;
		}
	
		return theClass;
	}
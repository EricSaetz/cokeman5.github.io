//parses the full collection file and adds the cards to the collection
function parseFullCollection() {
	$.ajax({
		type: 'GET',
		url: "Full Collection.html",
		dataType: 'text',
		success: function(data) {
			text = data.split('\n');
			collection = readFullCollection(text);
			collection.sort(function(a, b){return compareCards(a,b)});
			loadProgram();
		}
	});
}

//loads the collection files from hearthpwn for the given usernames, parses them into the collection then loads the program.
function handleSubmitAttempt(i) {
	var usernames = document.getElementById('usernames').value.split(";");
	var html = [];
	var text;
	var splitText;
	var element;
	var tempCollection;
	
	$.ajax({
		type: 'GET',
		url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.hearthpwn.com%2Fmembers%2F"+usernames[i]+"%2Fcollection'&diagnostics=true",
		dataType: 'text',
		success: function(data) {
			text = data.split('\n');
			if (i==0) {
				//read the first collection and sort the result
				collection = readCollection(text);
				collection.sort(function(a, b){return compareCards(a,b)});
			}
			else {
				//if 2nd or more collection intersects it with the current collection
				intersectCollections(collection,readCollection(text));
			}
			
			//if no cards were read from the file, the collection file was wrong
			if (collection.length<=0)
				alert("The collection entered is private or does not exist!");
			else if (i==usernames.length-1) {
				//all collection files have been processed, load the program
				loadProgram();
			} 
			else //recursively call this function until all usernames have been processed
				handleSubmitAttempt(i+1);
		}
	});
}

//load the program now that all collections have been parsed
function loadProgram() {
	//remove the full collection and custom collection buttons
	element = document.getElementById("fullCollectionButton");
	element.parentNode.removeChild(element);
	element = document.getElementById("customCollectionButton");
	element.parentNode.removeChild(element);
	//load the main gui elements
	loadMainGUI();
	//load up the scene
	init();
	//set the description to the collection view
	document.getElementById("modeDescription").innerHTML = "Here you can view your collection.";
	//start the update loop.
	update(0, totalGameTime);
	//start the render loop
	render();
}

//parse the full collection
function readFullCollection() {
		var cardName="";
		var cardAmount=0;
		var rarity=0;
		var manaCost=0;
		var theClass='NEUTRAL';
		var id;
		var cardData;
		var tempCollection = [];
		
		var someBasics = [2,619,329,620,667,238,22,578,488,101,162,30,177,49,274,44,189,29,260,293,283,438,554,547,671,401,164,378,433,658,90,367,390,151,256,636,348,252,43,529,36,161,81,493,130,182,356,563,510,74,289,663,479,357,388,41,519,47,434,611,31,472,246,659,603,27,84,604,624,325,545,598,414,173,310,323,564];
		
		var card;
		
		for (var n=0;n<text.length;n++) {
			//get the card name, id, rarity, and mana cost
			if (text[n].includes('data-card-name')) {
				cardData=text[n].split('"');
				cardName = cardData[5];
				cardName = cardName.replace(/&#x27;/g,'\'');
				id = parseInt(cardData[1]);
				rarity = parseInt(cardData[3]);
				manaCost = parseInt(cardData[7]);
			}
			else if (text[n].includes('data-card-race')) {
				//get the class of the card
				cardData=text[n].split('"');
				theClass = cardData[3];
			}
			else if (text[n].includes('data-card-count')) {
				//get the amount of cards the player owns
				cardAmount = parseInt(text[n].split('"')[3]);
				
				//correct the rarity of basic cards
				for (var i=0;i<someBasics.length && rarity==1;i++)
					if (id==someBasics[i])
						rarity=2;
				
				if (tempCollection.length==0 || tempCollection[tempCollection.length-1].id!=id) {
					card = {name:cardName,id:id,rarity:rarity,manaCost:manaCost,theClass:theClass,amount:cardAmount};
					tempCollection.push(card);
				}
				else {
					if (tempCollection[tempCollection.length-1].amount<2 && tempCollection[tempCollection.length-1].rarity<5) {
						tempCollection[tempCollection.length-1].amount=Math.min(tempCollection[tempCollection.length-1].amount+cardAmount,2);
					}
					else if (tempCollection[tempCollection.length-1].amount<1 && tempCollection[tempCollection.length-1].rarity==5) {
						tempCollection[tempCollection.length-1].amount=Math.min(tempCollection[tempCollection.length-1].amount+cardAmount,1);
					}
				}
			}
		}
		
		return tempCollection;
}

//same as readFullCollection but with different cardData indexes because of the formatting of the collection file is different
function readCollection(text) {
		var cardName="";
		var cardAmount=0;
		var rarity=0;
		var manaCost=0;
		var theClass='NEUTRAL';
		var id;
		var cardData;
		var tempCollection = [];
		
		var someBasics = [2,619,329,620,667,238,22,578,488,101,162,30,177,49,274,44,189,29,260,293,283,438,554,547,671,401,164,378,433,658,90,367,390,151,256,636,348,252,43,529,36,161,81,493,130,182,356,563,510,74,289,663,479,357,388,41,519,47,434,611,31,472,246,659,603,27,84,604,624,325,545,598,414,173,310,323,564];
		
		var card;
		
		for (var n=0;n<text.length;n++) {
			if (text[n].includes('data-card-name')) {
				cardData = text[n].split('"');
				cardName = cardData[15];
				cardName = cardName.replace(/&amp;#27;/g,'\'');
				id = parseInt(cardData[21]);
				rarity = parseInt(cardData[25]);
				manaCost = parseInt(cardData[11]);
				theClass = cardData[5];
			}
			else if (text[n].includes('data-card-count')) {
				cardAmount = parseInt(text[n].split('"')[3]);
				
				for (var i=0;i<someBasics.length && rarity==1;i++)
					if (id==someBasics[i])
						rarity=2;
					
				if (tempCollection.length==0 || tempCollection[tempCollection.length-1].id!=id) {
					card = {name:cardName,id:id,rarity:rarity,manaCost:manaCost,theClass:theClass,amount:cardAmount};
					tempCollection.push(card);
				}
				else {
					if (tempCollection[tempCollection.length-1].amount<2 && tempCollection[tempCollection.length-1].rarity<5) {
						tempCollection[tempCollection.length-1].amount=Math.min(tempCollection[tempCollection.length-1].amount+cardAmount,2);
					}
					else if (tempCollection[tempCollection.length-1].amount<1 && tempCollection[tempCollection.length-1].rarity==5) {
						tempCollection[tempCollection.length-1].amount=Math.min(tempCollection[tempCollection.length-1].amount+cardAmount,1);
					}
				}
			}
		}
		
		return tempCollection;
	}
	
	//intersects 2 collections by finding matching cards and seeting the amount of the first collection to the smallest of the 2 amounts.
	function intersectCollections(collection1,collection2) {
		for (var i=0;i<collection1.length;i++) {
			if (collection1[i].id==collection2[n].id) {
				intersectCards(collection1[i],collection2[n]);
			}
		}
	}
	
	//intsersects 2 cards by setting the amount of card1 to the lowest of the amounts between the 2 cards.
	function intersectCards(card1, card2) {
		card1.amount = Math.min(card1.amount,card2.amount);
		card2.amount = card1.amount;
	}
	
	//removes all of a card from a given list, such as a collection or decklist.
	function removeFromCardList(card, cardList) {
		for (var i=0;i<cardList.length;i++) {
			if (cardList[i].id==card.id) {
				cardList.splice(i,1);
				i--;
			}
		}
	}
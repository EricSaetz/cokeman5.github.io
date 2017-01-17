var collection = [];

//returns a sublist of a given list of cards that match a specific collection. isCopy determines whether to copy the data or just the references
function getSubCollection(theCollection,conditionFunction,isCopy) {
	var subCollection = [];
	var card;
	
	for (var n=0;n<theCollection.length;n++) {
		card = theCollection[n];
		if (conditionFunction(card)) {
			if (isCopy)
				subCollection.push({name:card.name,id:card.id,rarity:card.rarity,manaCost:card.manaCost,theClass:card.theClass,amount:card.amount});
			else
				subCollection.push(card);
		}
	}
		
	return subCollection;
}

//counts the amount of cards in a card list that matches a specific condition
function getCardCount(collection, conditionFunction) {
	var card;
	var amount=0;
	
	for (var i=0;i<collection.length;i++) {
		card = collection[i];
		if (conditionFunction(card))
			amount++;
	}
	
	return amount;
}

//adds a card to the collection. If the card is already in the collection, it increases the amount by the amount of the given card.
function addToCollection(card,theCollection) {
	for (var n=0;n<theCollection.length;n++) {
		if (theCollection[n].id==card.id) {
			theCollection[n].amount+=card.amount;
			return 1;
		}
	}
	theCollection.push(card);
}

//removes a given amount from a card in a collection, if the amount is less than or equal to 0, removes it from the list.
function removeFromCollection(cardId,amount,theCollection) {
	for (var n=0;n<theCollection.length;n++) {
		if (theCollection[n].id==cardId) {
			theCollection[n].amount-=amount;
			if (theCollection[n].amount<=0) {
				theCollection.splice(n,1);
				n--;
			}
			return 1;
		}
	}
}
var theCollection;
var currentPage = 0;
var leftArrow;
var rightArrow;
var onPageLoaded;

function startCollectionView(x, y, width, height, onClicked, onPageLoad) {
  var material;
  var verticalGap,horizontalGap;
  
  clearAssets();
  
  if (onPageLoaded!=null)
	  onPageLoaded = onPageLoad;
  else
	  onPageLoaded = function() {};
  
  verticalGap = (height-395*2)/3;
  horizontalGap = (width-286*3)/5;
  
	for (var i=0; i<8;i++) {
		createCardDisplay( (286+horizontalGap)*(i%4)+horizontalGap-width/2+x, height/2-(Math.floor(i/4)*(verticalGap+395))-verticalGap-395/2+y, 0, 286, 395, false, onClicked);
	}
	setCardBack(document.getElementById("cardBackSelect").value);
	
	loadImage("druidIcon",druidIconClicked,true,x-width/9.6*4.5,y+height/2.3,0,width/12.8,height/8.4);
	loadImage("hunterIcon",hunterIconClicked,true,x-width/9.6*3.5,y+height/2.3,0,width/12.8,height/8.4);
	loadImage("mageIcon",mageIconClicked,true,x-width/9.6*2.5,y+height/2.3,0,width/12.8,height/8.4);
	loadImage("paladinIcon",paladinIconClicked,true,x-width/9.6*1.5,y+height/2.3,0,width/12.8,height/8.4);
	loadImage("priestIcon",priestIconClicked,true,x-width/9.6*.5,y+height/2.3,0,width/12.8,height/8.4);
	loadImage("rogueIcon",rogueIconClicked,true,x+width/9.6*.5,y+height/2.3,0,width/12.8,height/8.4);
	loadImage("shamanIcon",shamanIconClicked,true,x+width/9.6*1.5,y+height/2.3,0,width/12.8,height/8.4);
	loadImage("warlockIcon",warlockIconClicked,true,x+width/9.6*2.5,y+height/2.3,0,width/12.8,height/8.4);
	loadImage("warriorIcon",warriorIconClicked,true,x+width/9.6*3.5,y+height/2.3,0,width/12.8,height/8.4);
	loadImage("neutralIcon",neutralIconClicked,true,x+width/9.6*4.5,y+height/2.3,0,width/12.8,height/8.4);
	
	leftArrow = loadImage("leftArrow",leftArrowClicked,true,x-width/2+15,y,0,150,100);
	rightArrow = loadImage("rightArrow",rightArrowClicked,true,x+width/2-15,y,0,150,100);
	currentPage = 0;
	loadPage(currentPage);
}

function loadPage(page) {
	
	if (page<=0)
		leftArrow.imgObj.visible=false;
	else
		leftArrow.imgObj.visible=true;
	
	if (page>=getMaxPages()-1)
		rightArrow.imgObj.visible=false;
	else
		rightArrow.imgObj.visible=true;
	
	var classCards = getSubCollection(theCollection, function(card){return card.theClass==="DRUID"},true);
	var offset = 0;
	var index = page*8;
	
	
	if (index<classCards.length) {
		loadClassCards(index,classCards);
	} else {
		offset+=Math.ceil(classCards.length/8)*8;
		index = page*8-offset;
		classCards = getSubCollection(theCollection, function(card){return card.theClass==="HUNTER"},true);
		if (index<classCards.length) {
			loadClassCards(index,classCards);
		} else {
			offset+=Math.ceil(classCards.length/8)*8;
			index = page*8-offset;
			classCards = getSubCollection(theCollection, function(card){return card.theClass==="MAGE"},true);
			if (index<classCards.length) {
				loadClassCards(index,classCards);
			} else {
				offset+=Math.ceil(classCards.length/8)*8;
				index = page*8-offset;
				classCards = getSubCollection(theCollection, function(card){return card.theClass==="PALADIN"},true);
				if (index<classCards.length) {
					loadClassCards(index,classCards);
				} else {
					offset+=Math.ceil(classCards.length/8)*8;
					index = page*8-offset;
					classCards = getSubCollection(theCollection, function(card){return card.theClass==="PRIEST"},true);
					if (index<classCards.length) {
						loadClassCards(index,classCards);
					} else {
						offset+=Math.ceil(classCards.length/8)*8;
						index = page*8-offset;
						classCards = getSubCollection(theCollection, function(card){return card.theClass==="ROGUE"},true);
						if (index<classCards.length) {
							loadClassCards(index,classCards);
						} else {
							offset+=Math.ceil(classCards.length/8)*8;
							index = page*8-offset;
							classCards = getSubCollection(theCollection, function(card){return card.theClass==="SHAMAN"},true);
							if (index<classCards.length) {
								loadClassCards(index,classCards);
							} else {
								offset+=Math.ceil(classCards.length/8)*8;
								index = page*8-offset;
								classCards = getSubCollection(theCollection, function(card){return card.theClass==="WARLOCK"},true);
								if (index<classCards.length) {
									loadClassCards(index,classCards);
								} else {
									offset+=Math.ceil(classCards.length/8)*8;
									index = page*8-offset;
									classCards = getSubCollection(theCollection, function(card){return card.theClass==="WARRIOR"},true);
									if (index<classCards.length) {
										loadClassCards(index,classCards);
									} else {
										offset+=Math.ceil(classCards.length/8)*8;
										index = page*8-offset;
										classCards = getSubCollection(theCollection, function(card){return card.theClass==="NONE"},true);
										if (index<classCards.length) {
											loadClassCards(index,classCards);
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	if (onPageLoaded!=null)
		onPageLoaded();
}

function getMaxPages() {
	var maxPages = Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="DRUID"})/8)+
			   Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="HUNTER"})/8)+
			   Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="MAGE"})/8)+
			   Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="PALADIN"})/8)+
			   Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="PRIEST"})/8)+
			   Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="ROGUE"})/8)+
			   Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="SHAMAN"})/8)+
			   Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="WARLOCK"})/8)+
			   Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="WARRIOR"})/8)+
			   Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="NONE"})/8);
			   
   return maxPages;
}

function getFirstPageOfClass(theClass) {
	var page=0;
	if (theClass==="DRUID") {
		return page;
	}
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="DRUID"})/8);
	
	if (theClass==="HUNTER")
		return page;
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="HUNTER"})/8);
	
	if (theClass==="MAGE")
		return page;
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="MAGE"})/8);
	
	if (theClass==="PALADIN")
		return page;
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="PALADIN"})/8)
	
	if (theClass==="PRIEST")
		return page;
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="PRIEST"})/8)
	
	if (theClass==="ROGUE")
		return page;
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="ROGUE"})/8);
	
	if (theClass==="SHAMAN")
		return page;
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="SHAMAN"})/8);
	
	if (theClass==="WARLOCK")
		return page;
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="WARLOCK"})/8);
	
	if (theClass==="WARRIOR")
		return page;
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="WARRIOR"})/8);
	
	if (theClass==="NONE")
		return page;
	else
		page+=Math.ceil(getCardCount(theCollection,function(card){return card.theClass==="NONE"})/8);
}

function loadClassCards(index,classCards) {
	for (var i=0;i<8;i++) {
		if (index+i<classCards.length) {
			setCardTexture(cardsToDisplay[i],classCards[index+i]);
			cardsToDisplay[i].mesh.visible=true;
			if (cardsToDisplay[i].card.amount<=0) {
				cardsToDisplay[i].mesh.getObjectByName("front").material.color.setHex( 0x838383 );
			}
			loadCardAmountText(cardsToDisplay[i], 50,-45,-255, 0);
		} 
		else {
			cardsToDisplay[i].mesh.visible = false;
		}
	}
}

function rightArrowClicked(rightArrow) {
	currentPage++;
	loadPage(currentPage);
}

function leftArrowClicked() {
	currentPage--;
	loadPage(currentPage);
}

function druidIconClicked() {
	currentPage = getFirstPageOfClass("DRUID",theCollection);
	loadPage(currentPage);
}

function hunterIconClicked() {
	currentPage = getFirstPageOfClass("HUNTER",theCollection);
	loadPage(currentPage);
}

function mageIconClicked() {
	currentPage = getFirstPageOfClass("MAGE",theCollection);
	loadPage(currentPage);
}

function paladinIconClicked() {
	currentPage = getFirstPageOfClass("PALADIN",theCollection);
	loadPage(currentPage);
}

function priestIconClicked() {
	currentPage = getFirstPageOfClass("PRIEST",theCollection);
	loadPage(currentPage);
}

function rogueIconClicked() {
	currentPage = getFirstPageOfClass("ROGUE",theCollection);
	loadPage(currentPage);
}

function shamanIconClicked() {
	currentPage = getFirstPageOfClass("SHAMAN",theCollection);
	loadPage(currentPage);
}

function warlockIconClicked() {
	currentPage = getFirstPageOfClass("WARLOCK",theCollection);
	loadPage(currentPage);
}

function warriorIconClicked() {
	currentPage = getFirstPageOfClass("WARRIOR",theCollection);
	loadPage(currentPage);
}

function neutralIconClicked() {
	currentPage = getFirstPageOfClass("NONE",theCollection);
	loadPage(currentPage);
}

function loadCardAmountText(cardDisplay, size, x, y, z) {
	var max;
	var oldText;

	oldText = cardDisplay.mesh.getObjectByName("amountText");
	if (oldText!=null) {
		oldText.material.dispose();
		oldText.geometry.dispose();
		cardDisplay.mesh.remove(oldText);
	}
	
	if (cardDisplay.card.rarity==5)
		max='/1';
	else
		max='/2';
	
	var textGeo = new THREE.TextGeometry( cardDisplay.card.amount+max, {

		font: font,

		size: size,
		height: 1,
		curveSegments: 12

	} );

	var textMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

	var mesh = new THREE.Mesh( textGeo, textMaterial );
	
	mesh.name="amountText";
	
	mesh.position.set(x,y,z);
	cardDisplay.mesh.add(mesh);
}
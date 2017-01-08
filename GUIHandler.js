function customCollectionPressed() {
	gui = document.getElementById('gui');
	
	aText = document.createElement("p");
	aText.innerHTML="Hearthpwn Username:";
	aText.setAttribute("style","position:fixed; bottom:39.5%; left:33%; font-size:15px");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("style","position:fixed; bottom:42%; left:44%; width:100px")
	input.setAttribute("type","text");
	input.setAttribute("id","usernames");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("style","position:fixed; bottom:41.9%; left:52.3%; width:100px")
	input.setAttribute("type","submit");
	input.setAttribute("id","submitUsernamesButton");
	input.setAttribute("onclick","handleSubmitAttempt(0);");
	input.setAttribute("value","Submit");
	gui.appendChild(input);
	
}

function loadMainGUI() {
	var aText,aSelect,aOption,gui,aPicture;
    var modes = ["Collection","Random Deck", "Sealed", "Rush", "Arena", "Gadgetzan Market"];
	var cardBacks = ["Classic", "Alleria", "Black Temple", "Blizzard 2014", "Blizzard 2015", "Clutch of Yogg-Saron", "Cupcake", "Dalaran Flame", "Darkspear", "Darnassus", 
					"Exodar", "Explorer's Map", "Eyes of C'thun", "Fireside", "Galaxy Gifts", "Gnomes", "Goblins", "Golden Celebration", "Hallow's End", "Heroes of the Storm", 
					"Heroic Naxxramas", "Highmaul", "Hogger", "Icecrown", "Legacy of the Void", "Legend", "Love Is in the Air", "Lunar New Year", "Magni", "Maraad", "Medivh", 
					"Molten Core", "Naxxramas", "Nefarian", "Ninjas", "Overwatch", "Pandaria", "Pirates!", "Power Core", "Ragnaros", "Rainbow", "Shaman Thrall", "Staff of Origination", 
					"Tauren Thunderbluff", "The Grand Tournament", "Tournament Grounds", "Warlords", "Winter Veil Wreath"];
	
	gui = document.getElementById('gui');
	
	aPicture = document.createElement("img");
	aPicture.setAttribute("style", "width:300px;height:1080px,padding:0px; margin:0px");
	aPicture.src = "Other/GUI Frame.png";
	gui.appendChild(aPicture);
	
	aText = document.createElement("p");
	aText.innerHTML="Game Mode:";
	aText.setAttribute("style","position:absolute; top:0px; left:100px; font-size:15px");
	gui.appendChild(aText);
	aSelect = document.createElement("select");
	aSelect.setAttribute("onchange", "changeMode(this.value)");
	aSelect.setAttribute("style","position:absolute; top:40px; left:90px");
	gui.appendChild(aSelect);
	
	for (var i=0;i<modes.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",modes[i]);
		aOption.innerHTML=modes[i];
		aSelect.appendChild(aOption);
	}
	
	aText = document.createElement("p");
	aText.innerHTML="Card Back:";
	aText.setAttribute("style","position:absolute; top:60px; left:38px; font-size:15px");
	aText.setAttribute("id","cardBackText");
	gui.appendChild(aText);
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:absolute; top:75px; left:118px");
	aSelect.setAttribute("id","cardBackSelect");
	aSelect.setAttribute("onchange", "setCardBack(this.value)");
	gui.appendChild(aSelect);
	
	for (var i=0;i<cardBacks.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",cardBacks[i]);
		aOption.innerHTML=cardBacks[i];
		aSelect.appendChild(aOption);
	}
	
	aText = document.createElement("p");
	aText.innerHTML="Volume:";
	aText.setAttribute("style","position:absolute; top:95px; left:34px; font-size:15px");
	aText.setAttribute("id","volumeText");
	gui.appendChild(aText);
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; top:112px; left:91px;");
	input.setAttribute("type","range");
	input.setAttribute("id","volumeSlider");
	input.setAttribute("value","50");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Here you can view your collection";
	aText.setAttribute("id","modeDescription");
	aText.setAttribute("style","position:absolute;  width:250px; height:100px; top:120px; left:25px; text-align:center; font-size:15px");
	gui.appendChild(aText);
}

function loadRandomDeckGUI() {
	var gui,input,aSelect,aText,aOption;
	var classNames = ["Random", "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior" ];
	
	gui = document.getElementById('gui');
	
	document.getElementById("modeDescription").innerHTML = "This mode allows you to generate a random deck using your collection.";
	
	aText = document.createElement("p");
	aText.innerHTML="Standard Only?";
	aText.setAttribute("id","standardText");
	aText.setAttribute("style","position:absolute; bottom:195px; left:85px; font-size:15px");
	gui.appendChild(aText);
	input = document.createElement("input");
	input.setAttribute("type","checkbox");
	input.setAttribute("id","standardCheckBox");
	input.setAttribute("style","position:absolute; bottom:211px; left:180px;width:25px");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Reno Deck?";
	aText.setAttribute("id","renoText");
	aText.setAttribute("style","position:absolute; bottom:165px; left:85px; font-size:15px");
	gui.appendChild(aText);
	input = document.createElement("input");
	input.setAttribute("type","checkbox");
	input.setAttribute("id","renoCheckBox");
	input.setAttribute("style","position:absolute; bottom:181px; left:170px;width:25px");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("type","text");
	input.setAttribute("id","percentageClassCards");
	input.setAttribute("value","50");
	input.setAttribute("maxlength",3);
	input.setAttribute("style","position:absolute; bottom:108px; left:220px;width:25px");
	input.setAttribute("onkeypress","filterInput(event)");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="% Chance of Class Cards:";
	aText.setAttribute("id","%Text");
	aText.setAttribute("style","position:absolute; bottom:95px; left:50px; font-size:15px");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:50px; left:75px; width:150px;height:50px");
	input.setAttribute("type","submit");
	input.setAttribute("id","randomDeckButton");
	input.setAttribute("onclick","createRandomDeck()");
	input.setAttribute("value","Create Random Deck");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Class:";
	aText.setAttribute("style","position:absolute; bottom:130px; left:88px; font-size:15px");
	aText.setAttribute("id","classText");
	gui.appendChild(aText);
	
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:absolute; bottom:145px; left:138px");
	aSelect.setAttribute("id","classSelect");
	gui.appendChild(aSelect);
	
	for (var i=0;i<classNames.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",classNames[i]);
		aOption.innerHTML=classNames[i];
		aSelect.appendChild(aOption);
	}
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:250px; left:70px");
	input.setAttribute("type","submit");
	input.setAttribute("id","clipboardButton");
	input.setAttribute("onclick","copyDeckToClipboard()");
	input.setAttribute("value","Copy Deck to Clipboard");
	gui.appendChild(input);
}

function removeRandomDeckGUI() {
	aElement = document.getElementById('randomDeckButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('classSelect');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('classText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('percentageClassCards');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('%Text');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('clipboardButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('standardText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('standardCheckBox');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('renoText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('renoCheckBox');
	aElement.parentNode.removeChild(aElement);
}

function loadSealedGUI() {
	var gui,aText,aSelect,aOption,aTextArea,input;
	var packNames = ["Wild", "Basic","Classic","Naxx","GvG","BRM","TGT","LOE","OG","KARA","MSG"];
    var openingModes = [ "Normal", "Auto", "Instant" ];
	
	gui = document.getElementById('gui');
	
	document.getElementById("modeDescription").innerHTML = "This mode allows you to open simulated packs that contain only cards you own. Challenge your deckbuilding skills using a limited collection.";
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:340px; left:70px");
	input.setAttribute("type","submit");
	input.setAttribute("id","clipboardButton");
	input.setAttribute("onclick","copyDeckToClipboard()");
	input.setAttribute("value","Copy Deck to Clipboard");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Opening Mode:";
	aText.setAttribute("style","position:absolute; bottom:290px; left:38px; font-size:15px");
	aText.setAttribute("id","openingModeText");
	gui.appendChild(aText);
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:absolute; bottom:305px; left:143px");
	aSelect.setAttribute("id","openingModeSelect");
	aSelect.setAttribute("onchange", "openingModeChanged(this.value)");
	gui.appendChild(aSelect);
	
	for (var i=0;i<openingModes.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",openingModes[i]);
		aOption.innerHTML=openingModes[i];
		aSelect.appendChild(aOption);
	}
	
	aText = document.createElement("p");
	aText.innerHTML="Packs:";
	aText.setAttribute("style","position:absolute; bottom:250px; left:38px; font-size:15px");
	aText.setAttribute("id","packText");
	gui.appendChild(aText);
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:absolute; bottom:265px; left:88px");
	aSelect.setAttribute("id","packSelect");
	gui.appendChild(aSelect);
	
	aTextArea = document.createElement("textarea");
	aTextArea.setAttribute("cols",15);
	aTextArea.setAttribute("readonly","true");
	aTextArea.setAttribute("id","packAmountsText");
	aTextArea.setAttribute("style","position:absolute; bottom:130px; left:38px;overflow-y:scroll; height:100px; font-size:15px");
	gui.appendChild(aTextArea);
	
	var textAreaContents = '';
	for (var i=0;i<packNames.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",packNames);
		aOption.innerHTML=packNames[i]+" Packs";
		aSelect.appendChild(aOption);
		if (i!=0)
			textAreaContents+='&#13;&#10;'
		textAreaContents+=packNames[i]+':'+packAmounts[i];
	}
	
	aTextArea.innerHTML=textAreaContents;
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:210px; left:208px");
	input.setAttribute("type","submit");
	input.setAttribute("id","addButton");
	input.setAttribute("onclick","addPacks()");
	input.setAttribute("value","Add");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:170px; left:208px");
	input.setAttribute("type","submit");
	input.setAttribute("id","removeButton");
	input.setAttribute("onclick","removePacks()");
	input.setAttribute("value","Remove");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:130px; left:208px");
	input.setAttribute("type","submit");
	input.setAttribute("id","clearButton");
	input.setAttribute("onclick","clearPacks()");
	input.setAttribute("value","Clear");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:265px; left:230px; width:45px");
	input.setAttribute("type","text");
	input.setAttribute("maxlength",4);
	input.setAttribute("onkeypress","filterInput(event)");
	input.setAttribute("id","amountTextField");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="#";
	aText.setAttribute("style","position:absolute; bottom:250px; left:215px; font-size:15px");
	aText.setAttribute("id","amountText");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:50px; left:75px; width:150px;height:50px");
	input.setAttribute("type","submit");
	input.setAttribute("onclick","openPacks()");
	input.setAttribute("id","openPacksButton");
	input.setAttribute("value","Open Packs");
	gui.appendChild(input);
}

function removeSealedGUI() {
	aElement = document.getElementById('openingModeText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('openingModeSelect');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('packText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('packSelect');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('packAmountsText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('addButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('removeButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('clearButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('amountTextField');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('amountText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('openPacksButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('clipboardButton');
	aElement.parentNode.removeChild(aElement);
}

function loadRushGUI() {
	var gui,aText,aSelect,aOption,aTextArea,input;
	var classNames = ["Random", "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior" ];
	
	gui = document.getElementById('gui');
	
	document.getElementById("modeDescription").innerHTML = "This mode tests your deckbuilding abilities under stress. Cards will scroll down quickly, requiring you to build your deck on the fly!";
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:260px; left:70px");
	input.setAttribute("type","submit");
	input.setAttribute("id","clipboardButton");
	input.setAttribute("onclick","copyDeckToClipboard()");
	input.setAttribute("value","Copy Deck to Clipboard");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Standard Only?";
	aText.setAttribute("id","standardText");
	aText.setAttribute("style","position:absolute; bottom:215px; left:85px; font-size:15px");
	gui.appendChild(aText);
	input = document.createElement("input");
	input.setAttribute("type","checkbox");
	input.setAttribute("id","standardCheckBox");
	input.setAttribute("style","position:absolute; bottom:231px; left:180px;width:25px");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("type","text");
	input.setAttribute("id","Time");
	input.setAttribute("maxlength",3);
	input.setAttribute("value","100");
	input.setAttribute("style","position:absolute; bottom:205px; left:170px;width:25px");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Time(s):";
	aText.setAttribute("id","timeText");
	aText.setAttribute("style","position:absolute; bottom:190px; left:105px; font-size:15px");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("type","text");
	input.setAttribute("id","amountOfCards");
	input.setAttribute("value","200");
	input.setAttribute("maxlength",3);
	input.setAttribute("style","position:absolute; bottom:175px; left:197px;width:25px");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Amount of Cards:";
	aText.setAttribute("id","amountOfCardsText");
	aText.setAttribute("style","position:absolute; bottom:160px; left:75px; font-size:15px");
	gui.appendChild(aText);
	
	aText = document.createElement("p");
	aText.innerHTML="Class:";
	aText.setAttribute("style","position:absolute; bottom:125px; left:88px; font-size:15px");
	aText.setAttribute("id","classText");
	gui.appendChild(aText);
	
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:absolute; bottom:140px; left:138px");
	aSelect.setAttribute("id","classSelect");
	gui.appendChild(aSelect);
	
	for (var i=0;i<classNames.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",classNames[i]);
		aOption.innerHTML=classNames[i];
		aSelect.appendChild(aOption);
	}
	
	input = document.createElement("input");
	input.setAttribute("type","text");
	input.setAttribute("id","percentageClassCards");
	input.setAttribute("value","30");
	input.setAttribute("maxlength",3);
	input.setAttribute("style","position:absolute; bottom:108px; left:220px;width:25px");
	input.setAttribute("onkeypress","filterInput(event)");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="% Chance of Class Cards:";
	aText.setAttribute("id","%Text");
	aText.setAttribute("style","position:absolute; bottom:95px; left:50px; font-size:15px");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:50px; left:75px; width:150px;height:50px");
	input.setAttribute("type","submit");
	input.setAttribute("onclick","startRush()");
	input.setAttribute("id","rushButton");
	input.setAttribute("value","Start Rush");
	gui.appendChild(input);
	
}

function removeRushGUI() {
	aElement = document.getElementById('Time');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('timeText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('amountOfCards');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('amountOfCardsText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('classText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('classSelect');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('rushButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('percentageClassCards');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('%Text');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('clipboardButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('standardText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('standardCheckBox');
	aElement.parentNode.removeChild(aElement);
}

function loadArenaGUI() {
	var gui,input,aOption,aSelect;
	
	gui = document.getElementById('gui');
	
	document.getElementById("modeDescription").innerHTML = "This mode emulates the Arena from in-game. Choose one card from a selection and repeat until you have a full deck!";
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:240px; left:72px");
	input.setAttribute("type","submit");
	input.setAttribute("id","clipboardButton");
	input.setAttribute("onclick","copyDeckToClipboard()");
	input.setAttribute("value","Copy Deck to Clipboard");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Standard Only?";
	aText.setAttribute("id","standardText");
	aText.setAttribute("style","position:absolute; bottom:195px; left:85px; font-size:15px");
	gui.appendChild(aText);
	input = document.createElement("input");
	input.setAttribute("type","checkbox");
	input.setAttribute("id","standardCheckBox");
	input.setAttribute("style","position:absolute; bottom:211px; left:180px;width:25px");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Allow Banned Cards?";
	aText.setAttribute("id","bannedCardsText");
	aText.setAttribute("style","position:absolute; bottom:170px; left:75px; font-size:15px");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("type","checkbox");
	input.setAttribute("id","bannedCardsCheckBox");
	input.setAttribute("style","position:absolute; bottom:186px; left:210px;width:25px");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Allow C'thun Cards?";
	aText.setAttribute("id","c'thunText");
	aText.setAttribute("style","position:absolute; bottom:140px; left:75px; font-size:15px");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("type","checkbox");
	input.setAttribute("id","c'thunCheckBox");
	input.setAttribute("style","position:absolute; bottom:156px; left:203px;width:25px");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Cards Per Selection:";
	aText.setAttribute("style","position:absolute; bottom:105px; left:65px; font-size:15px");
	aText.setAttribute("id","cardChoiceAmountText");
	gui.appendChild(aText);
	
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:absolute; bottom:120px; left:200px");
	aSelect.setAttribute("id","cardChoiceAmount");
	gui.appendChild(aSelect);
	
	for (var i=2;i<9;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",i);
		aOption.innerHTML=i;
		if (i==3)
			aOption.setAttribute("selected","selected");
		aSelect.appendChild(aOption);
	}
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:50px; left:75px; width:150px;height:50px");
	input.setAttribute("type","submit");
	input.setAttribute("onclick","startArenaDraft()");
	input.setAttribute("id","arenaButton");
	input.setAttribute("value","Start Arena");
	gui.appendChild(input);
}

function removeArenaGUI() {
	aElement = document.getElementById('bannedCardsText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('bannedCardsCheckBox');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById("c'thunText");
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById("c'thunCheckBox");
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('cardChoiceAmountText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('cardChoiceAmount');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('arenaButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('clipboardButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('standardText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('standardCheckBox');
	aElement.parentNode.removeChild(aElement);
}

function loadMarketGUI() {
	document.getElementById("modeDescription").innerHTML = "This mode gives you a budget to spend building a deck. Prices fluctuates daily, and rarer cards are generally more expensive";
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:170px; left:72px");
	input.setAttribute("type","submit");
	input.setAttribute("id","clipboardButton");
	input.setAttribute("onclick","copyDeckToClipboard()");
	input.setAttribute("value","Copy Deck to Clipboard");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Standard Only?";
	aText.setAttribute("id","standardText");
	aText.setAttribute("style","position:absolute; bottom:130px; left:85px; font-size:15px");
	gui.appendChild(aText);
	input = document.createElement("input");
	input.setAttribute("type","checkbox");
	input.setAttribute("id","standardCheckBox");
	input.setAttribute("style","position:absolute; bottom:146px; left:180px;width:25px");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Budget:";
	aText.setAttribute("style","position:absolute; bottom:100px; left:100px; font-size:15px");
	aText.setAttribute("id","budgetText");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:115px; left:155px; width:45px");
	input.setAttribute("type","text");
	input.setAttribute("maxlength",6);
	input.setAttribute("value","10000");
	input.setAttribute("onkeypress","filterInput(event)");
	input.setAttribute("id","budgetTextField");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("style","position:absolute; bottom:50px; left:75px; width:150px;height:50px");
	input.setAttribute("type","submit");
	input.setAttribute("onclick","loadMarket()");
	input.setAttribute("id","marketButton");
	input.setAttribute("value","Enter Market");
	gui.appendChild(input);
}

function removeMarketGUI() {
	aElement = document.getElementById('marketButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('budgetTextField');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('budgetText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('clipboardButton');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('standardText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('standardCheckBox');
	aElement.parentNode.removeChild(aElement);
}

function changeMode(value) {
	if (mode==0 && !(value === "Collection")) {
		clearAssets();
	}
	else if (mode==1 && !(value === "Random Deck")) {
		clearAssets();
		var randomDeck = [];
		removeRandomDeckGUI();
	}
	else if (mode==2 && !(value === "Sealed")) {
		clearAssets();
		packAmounts = [0,0,0,0,0,0,0,0,0,0];
		packs = [];
		hiddenCards = [true,true,true,true,true];
		packNum = 0;
		sealedCollection = [];
		sealedDeck = [];
		sealedDeckSize = 0;
		removeSealedGUI();
	}
	else if (mode==3 && !(value === "Rush")) {
		clearAssets();
		rushCollection = [];
		rushDeck = [];
		rushDeckSize=0;

		removeRushGUI();
	}
	else if (mode==4 && !(value === "Arena")) {
		clearAssets();
		arenaDeck = [];
		arenaPool = [];
		removeArenaGUI();
	}
	else if (mode==5 && !(value === "Gadgetzan Market")) {
		clearAssets();
		removeMarketGUI();
		prices = [];
		marketCollection = [];
		marketDeck = [];
		marketDeckSize = 0;
	}

	if (value === "Collection" && mode!=0) {
		mode=0;
		document.getElementById("modeDescription").innerHTML = "Here you can view your collection.";
		theCollection=collection;
		startCollectionView(0,0,1920,1240);
	}
	else if (value==="Random Deck" && mode!=1) {
		mode = 1;
		startRandomDeckView();
	}
	else if (value==="Sealed" && mode!=2) {
		mode = 2;
		startSealedView();
	}
	else if (value==="Rush" && mode!=3) {
		mode = 3;
		startRushView();
	}
	else if (value==="Arena" && mode!=4) {
		mode = 4;
		startArenaView();
	}
	else if (value==="Gadgetzan Market" && mode!=5) {
		mode = 5;
		startMarketView();
	}
}
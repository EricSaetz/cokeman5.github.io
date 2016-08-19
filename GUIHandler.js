function loadModeSelectGUI() {
	var aText,aSelect,aOption,gui;
    var modes = ["Collection","Random Deck", "Sealed", "Rush"];
	
	gui = document.getElementById('gui');
	
	aText = document.createElement("p");
	aText.innerHTML="Game Mode:";
	aText.setAttribute("style","position:fixed; top:0px; left:100px");
	gui.appendChild(aText);
	aSelect = document.createElement("select");
	aSelect.setAttribute("onchange", "changeMode(this.value)");
	aSelect.setAttribute("style","position:fixed; top:40px; left:90px");
	gui.appendChild(aSelect);
	
	for (var i=0;i<modes.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",modes[i]);
		aOption.innerHTML=modes[i];
		aSelect.appendChild(aOption);
	}
}

function loadRandomDeckGUI() {
	var gui,input,aSelect,aText,aOption;
	var classNames = ["Random", "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior" ];
	
	gui = document.getElementById('gui');
	
	input = document.createElement("input");
	input.setAttribute("type","text");
	input.setAttribute("id","percentageClassCards");
	input.setAttribute("value","50");
	input.setAttribute("maxlength",3);
	input.setAttribute("style","position:fixed; bottom:98px; left:220px;width:25px")
	input.setAttribute("onkeypress","filterInput(event)");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="% Chance of Class Cards:";
	aText.setAttribute("id","%Text");
	aText.setAttribute("style","position:fixed; bottom:85px; left:50px");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("style","position:fixed; bottom:40px; left:75px; width:150px;height:50px")
	input.setAttribute("type","submit");
	input.setAttribute("id","randomDeckButton");
	input.setAttribute("onclick","createRandomDeck()");
	input.setAttribute("value","Create Random Deck");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Class:";
	aText.setAttribute("style","position:fixed; bottom:130px; left:88px");
	aText.setAttribute("id","classText");
	gui.appendChild(aText);
	
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:fixed; bottom:145px; left:138px");
	aSelect.setAttribute("id","classSelect");
	gui.appendChild(aSelect);
	
	for (var i=0;i<classNames.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",classNames[i]);
		aOption.innerHTML=classNames[i];
		aSelect.appendChild(aOption);
	}
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
}

function loadSealedGUI() {
	var gui,aText,aSelect,aOption,aTextArea,input;
	var cardBacks = ["Classic", "Alleria", "Black Temple", "Blizzard 2014", "Blizzard 2015", "Clutch of Yogg-Saron", "Cupcake", "Dalaran Flame", "Darkspear", "Darnassus", 
					"Exodar", "Explorer's Map", "Eyes of C'thun", "Fireside", "Galaxy Gifts", "Gnomes", "Goblins", "Golden Celebration", "Hallow's End", "Heroes of the Storm", 
					"Heroic Naxxramas", "Highmaul", "Hogger", "Icecrown", "Legacy of the Void", "Legend", "Love Is in the Air", "Lunar New Year", "Magni", "Maraad", "Medivh", 
					"Molten Core", "Naxxramas", "Nefarian", "Ninjas", "Overwatch", "Pandaria", "Pirates!", "Power Core", "Ragnaros", "Rainbow", "Shaman Thrall", "Staff of Origination", 
					"Tauren Thunderbluff", "The Grand Tournament", "Tournament Grounds", "Warlords", "Winter Veil Wreath"];
	var packNames = ["Wild", "Basic","Classic","Naxx","GvG","BRM","TGT","LOE","OG","KARA"];
    var openingModes = [ "Normal", "Auto", "Instant" ];
	
	gui = document.getElementById('gui');
	
	aText = document.createElement("p");
	aText.innerHTML="Card Back:";
	aText.setAttribute("style","position:fixed; bottom:330px; left:38px");
	aText.setAttribute("id","cardBackText");
	gui.appendChild(aText);
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:fixed; bottom:345px; left:118px");
	aSelect.setAttribute("id","cardBackSelect");
	gui.appendChild(aSelect);
	
	for (var i=0;i<cardBacks.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",cardBacks[i]);
		aOption.innerHTML=cardBacks[i];
		aSelect.appendChild(aOption);
	}
	
	aText = document.createElement("p");
	aText.innerHTML="Opening Mode:";
	aText.setAttribute("style","position:fixed; bottom:290px; left:38px");
	aText.setAttribute("id","openingModeText");
	gui.appendChild(aText);
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:fixed; bottom:305px; left:143px");
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
	aText.setAttribute("style","position:fixed; bottom:250px; left:38px");
	aText.setAttribute("id","packText");
	gui.appendChild(aText);
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:fixed; bottom:265px; left:88px");
	aSelect.setAttribute("id","packSelect");
	gui.appendChild(aSelect);
	
	aTextArea = document.createElement("textarea");
	aTextArea.setAttribute("cols",15);
	aTextArea.setAttribute("readonly","true");
	aTextArea.setAttribute("id","packAmountsText");
	aTextArea.setAttribute("style","position:fixed; bottom:130px; left:38px;overflow-y:scroll; height:100px");
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
	input.setAttribute("style","position:fixed; bottom:210px; left:208px")
	input.setAttribute("type","submit");
	input.setAttribute("id","addButton");
	input.setAttribute("onclick","addPacks()");
	input.setAttribute("value","Add");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("style","position:fixed; bottom:170px; left:208px")
	input.setAttribute("type","submit");
	input.setAttribute("id","removeButton");
	input.setAttribute("onclick","removePacks()");
	input.setAttribute("value","Remove");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("style","position:fixed; bottom:130px; left:208px")
	input.setAttribute("type","submit");
	input.setAttribute("id","clearButton");
	input.setAttribute("onclick","clearPacks()");
	input.setAttribute("value","Clear");
	gui.appendChild(input);
	
	input = document.createElement("input");
	input.setAttribute("style","position:fixed; bottom:265px; left:230px; width:45px")
	input.setAttribute("type","text");
	input.setAttribute("maxlength",4);
	input.setAttribute("onkeypress","filterInput(event)");
	input.setAttribute("id","amountTextField");
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="#";
	aText.setAttribute("style","position:fixed; bottom:250px; left:215px");
	aText.setAttribute("id","amountText");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("style","position:fixed; bottom:40px; left:75px; width:150px;height:50px")
	input.setAttribute("type","submit");
	input.setAttribute("onclick","openPacks()");
	input.setAttribute("id","openPacksButton");
	input.setAttribute("value","Open Packs");
	gui.appendChild(input);
}

function removeSealedGUI() {
	aElement = document.getElementById('cardBackText');
	aElement.parentNode.removeChild(aElement);
	aElement = document.getElementById('cardBackSelect');
	aElement.parentNode.removeChild(aElement);
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
}

function loadRushGUI() {
	var gui,aText,aSelect,aOption,aTextArea,input;
	var classNames = ["Random", "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior" ];
	
	gui = document.getElementById('gui');
	
	input = document.createElement("input");
	input.setAttribute("type","text");
	input.setAttribute("id","Time");
	input.setAttribute("maxlength",3);
	input.setAttribute("value","100");
	input.setAttribute("style","position:fixed; bottom:175px; left:170px;width:25px")
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Time(s):";
	aText.setAttribute("id","timeText");
	aText.setAttribute("style","position:fixed; bottom:160px; left:105px");
	gui.appendChild(aText);
	
	input = document.createElement("input");
	input.setAttribute("type","text");
	input.setAttribute("id","amountOfCards");
	input.setAttribute("value","200");
	input.setAttribute("maxlength",3);
	input.setAttribute("style","position:fixed; bottom:145px; left:197px;width:25px")
	gui.appendChild(input);
	
	aText = document.createElement("p");
	aText.innerHTML="Amount of Cards:";
	aText.setAttribute("id","amountOfCardsText");
	aText.setAttribute("style","position:fixed; bottom:130px; left:75px");
	gui.appendChild(aText);
	
	aText = document.createElement("p");
	aText.innerHTML="Class:";
	aText.setAttribute("style","position:fixed; bottom:95px; left:88px");
	aText.setAttribute("id","classText");
	gui.appendChild(aText);
	
	aSelect = document.createElement("select");
	aSelect.setAttribute("style","position:fixed; bottom:110px; left:138px");
	aSelect.setAttribute("id","classSelect");
	gui.appendChild(aSelect);
	
	for (var i=0;i<classNames.length;i++) {
		aOption = document.createElement("option");
		aOption.setAttribute("value",classNames[i]);
		aOption.innerHTML=classNames[i];
		aSelect.appendChild(aOption);
	}
	
	input = document.createElement("input");
	input.setAttribute("style","position:fixed; bottom:40px; left:75px; width:150px;height:50px")
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
}

function changeMode(value) {
	if (mode==0 && !(value === "Collection"))
		clearAssets();
	else if (mode==1 && !(value === "Random Deck")) {
		clearAssets();
		removeRandomDeckGUI();
	}
	else if (mode==2 && !(value === "Sealed")) {
		clearAssets();
		removeSealedGUI();
	}
	else if (mode==3 && !(value === "Rush")) {
		clearAssets();
		removeRushGUI();
	}

	if (value === "Collection" && mode!=0) {
		mode=0;
		startCollectionView();
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
}
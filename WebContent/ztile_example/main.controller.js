sap.ui.controller("ztile_example.ztile_example.main", {
	onInit : function (evt) {
		// set mock model
		//var sPath = jQuery.sap.getModulePath("view.Main", "/data.json");
		//var oModel = new sap.ui.model.json.JSONModel(sPath);

		/*	var oModel = new sap.ui.model.json.JSONModel("/sap/bc/ui5_ui5/sap/ztile_example/Model/data.json");
		this.getView().setModel(oModel);*/



		var oModelChips = new sap.ui.model.json.JSONModel();	
		/*var catalogName =  this.getUrlParameter("catalog"); 
		var url = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/Pages('" +catalogName +"')/PageChipInstances";
		oModelChips.loadData(url, null, false);
		 */
		this.generateModel();

		//this.getView().setModel(oModelChips, "Chips");
	},

	onBeforeRendering: function(){

	},

	generateModel: function(){
		var oModelChips = new sap.ui.model.json.JSONModel();	
		var catalogName =  this.getUrlParameter("catalog"); 
		
		var url = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/Catalogs('X-SAP-UI2-CATALOGPAGE%3A" +catalogName +"')/"
		this.pageSetTitle(url);
		url = url + "/Chips";
		oModelChips.loadData(url, null, false);
		var chipArray = [];
		var array = $.map(oModelChips.oData.d, function(value, index) {
			value.forEach(function(entry){
				if (entry.title !== "Target Mapping"){
					var configuration = JSON.parse(entry.configuration);
					var tileConfiguration = JSON.parse(configuration.tileConfiguration);
					entry["TileConfiguration"] = tileConfiguration;
					chipArray.push(entry);
				}
			})
		});	
		var oModelTiles = new sap.ui.model.json.JSONModel();
		oModelTiles.setData({TileCollection : chipArray });
		this.getView().setModel(oModelTiles);
	},
	
	pageSetTitle: function(url){
		var oModelTitle = new sap.ui.model.json.JSONModel();
		oModelTitle.loadData(url, null, false);
		var page = this.getView().byId("navPage");
		page.setTitle(oModelTitle.oData.d.title);

	},

	getUrlParameter: function(sParam) {
		var sPageURL = decodeURIComponent(window.location.hash.substring(1)),
		sURLVariables = sPageURL.split('?'),
		sParameterName,
		i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	},

	/*loadTiles: function(){
		var oModelTiles = new sap.ui.model.json.JSONModel();
		var oModelChips = this.getView().getModel("Chips");
		var that = this;
		var chipArray = [];
		var chipDetails = [];
		var array = $.map(oModelChips.oData.d, function(value, index) {
			value.forEach(function(entry){
				chipArray.push(entry.Chip.__deferred.uri);
			}
			);	
			chipArray.forEach(function(entry){
				var count = 0;
				that.loadChip(entry +"?$format=json").then(function(resolve, reject) {
					var odata = JSON.parse(resolve);
					var json = JSON.parse(JSON.parse(odata.d.configuration).tileConfiguration);
					odata.d["TileConfiguration"] = json;

					chipDetails.push(odata.d);
					oModelTiles.setData({TileCollection : chipDetails });
					that.getView().setModel(oModelTiles);
					count++;
				}, function(err) {
					console.log(err); // Error: "It broke"
				});
			});

		});
	},

	loadChip: function(url){
		return new Promise(function(resolve, reject) {
			// Do the usual XHR stuff
			var req = new XMLHttpRequest();
			req.open('GET', url, false);

			req.onload = function() {
				// This is called even on 404 etc
				// so check the status
				if (req.status == 200) {
					// Resolve the promise with the response text
					resolve(req.response);
				}
				else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error(req.statusText));
				}
			};

			// Handle network errors
			req.onerror = function() {
				reject(Error("Network Error"));
			};

			// Make the request
			req.send();
		});
	},
*/
	handleTilePress : function (evt){

		var property = this.getView().getModel().getProperty(evt.oSource.oBindingContexts.undefined.sPath);
		var configuration = JSON.parse(property.configuration);
		var tileconfiguration = JSON.parse(configuration.tileConfiguration);
		/*oCrossAppNavigator = ( sap.ushell && sap.ushell.Container &&
				sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
					target : { 
						semanticObject : tileconfiguration.navigation_semantic_object, 
						action : tileconfiguration.navigation_semantic_action, 
						context : tileconfiguration.navigation_semantic_parameters  }
				}));*/
		
		var parameterSplit = [],
		parameterCheck = false,
		hash;
		if (tileconfiguration.navigation_semantic_parameters !== ""){
			parameterSplit = tileconfiguration.navigation_semantic_parameters.split("=");
			parameterCheck = true;
		}
		
		if (parameterCheck===true){
			hash = this.navigateWithParameter(tileconfiguration, parameterSplit[1]);
		}
		else{
			hash = this.navigateWithoutParameter(tileconfiguration);
		}
		window.location.hash = hash;
	},
	
	navigateWithParameter: function(tileconfiguration, parameter){
		return hrefForNavigation = ( sap.ushell && sap.ushell.Container &&
				sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
					  target : { semanticObject : tileconfiguration.navigation_semantic_object, action : tileconfiguration.navigation_semantic_action },
					  params : { "catalog"  : parameter }
					})) || "";
	},
	
	navigateWithoutParameter: function(tileconfiguration){
		return hrefForNavigation = ( sap.ushell && sap.ushell.Container &&
				sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
					  target : { semanticObject : tileconfiguration.navigation_semantic_object, action : tileconfiguration.navigation_semantic_action }					})) || "";
	},
	
	NavBack: function(){
		this.getRouter().myNavBack();
	},
	
	onPress: function (oEvent) {
		MessageToast.show(oEvent.getSource().getText() + " has been activated");
	},
	
	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	}

/*	handleEditPress : function (evt) {
		var oTileContainer = this.getView().byId("container");
		var newValue = ! oTileContainer.getEditable();
		oTileContainer.setEditable(newValue);
		evt.getSource().setText(newValue ? "Done" : "Edit");
	},

	handleBusyPress : function (evt) {
		var oTileContainer = this.getView().byId("container");
		var newValue = ! oTileContainer.getBusy();
		oTileContainer.setBusy(newValue);
		evt.getSource().setText(newValue ? "Done" : "Busy state");
	},

	handleTileDelete : function (evt) {
		var tile = evt.getParameter("tile");
		evt.getSource().removeTile(tile);
	}
*/});


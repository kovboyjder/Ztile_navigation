jQuery.sap.declare("ztile_example.Component");
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
], function(UIComponent, Device, models, ErrorHandler) {
	"use strict";

	return UIComponent.extend("ztile_example.Component", {

		metadata : {
	        name : "Navigation App",
	        version : "1.0",
	        includes : [],
	        dependencies : {
	            libs : ["sap.m", "sap.ui.layout", "sap.suite.ui.commons"],
	            components : []
	        },
	 rootView : "ztile_example.ztile_example.App",
	 
	 config : {
         resourceBundle : "i18n/messageBundle.properties",
         serviceConfig : {
             name : "Northwind",
             serviceUrl : "http://services.odata.org/V2/(S(sapuidemotdg))/OData/OData.svc/"
         }
     },
     
     routing : {
			config : {
				routerClass : ztile_example.MyRouter,
				viewType : "XML",
				viewPath : "ztile_example.ztile_example",
				targetAggregation : "pages",
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "main",
					view : "main",
					targetControl : "idAppControl"
					}
			]
		}
 },


		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the resource and application models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function() {
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		     var mConfig = this.getMetadata().getConfig();

		     // always use absolute paths relative to our own component
		     // (relative paths will fail if running in the Fiori Launchpad)
		     var rootPath = jQuery.sap.getModulePath("ztile_example");

		     // set i18n model
		    /* var i18nModel = new sap.ui.model.resource.ResourceModel({
		         bundleUrl : [rootPath, mConfig.resourceBundle].join("/")
		     });
		     this.setModel(i18nModel, "i18n");*/
		     
		     // Create and set domain model to the component
		     var sServiceUrl = mConfig.serviceConfig.serviceUrl;
		     //var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		     //this.setModel(oModel);

		     // set device model
		     var deviceModel = new sap.ui.model.json.JSONModel({
		         isTouch : sap.ui.Device.support.touch,
		         isNoTouch : !sap.ui.Device.support.touch,
		         isPhone : sap.ui.Device.system.phone,
		         isNoPhone : !sap.ui.Device.system.phone,
		         listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
		         listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		     });
		     deviceModel.setDefaultBindingMode("OneWay");
		     this.setModel(deviceModel, "device");
		     
		     jQuery.sap.require("ztile_example.MyRouter");
		     this.getRouter().initialize();
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler are destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			//this._oErrorHandler.destroy();
			//this.getModel().destroy();
			//this.getModel("i18n").destroy();
			//this.getModel("FLP").destroy();
			this.getModel("device").destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		/**
		 * Creates a promise which is resolved when the metadata is loaded.
		 * @param {sap.ui.core.Model} oModel the app model
		 * @private
		 */
		_createMetadataPromise: function(oModel) {
			this.oWhenMetadataIsLoaded = new Promise(function(fnResolve, fnReject) {
				oModel.attachEventOnce("metadataLoaded", fnResolve);
				oModel.attachEventOnce("metadataFailed", fnReject);
			});
		}

	});

});
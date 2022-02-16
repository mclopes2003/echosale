sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "br/com/esale/echosale/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/f/library",    
], function (UIComponent, Device, models, JSONModel, fioriLibrary) {
    "use strict";

    return UIComponent.extend("br.com.esale.echosale.Component", {

	metadata: {
            manifest: "json"
	},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
	init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            //Criando model para Flexible Column Layout
            var oModel = new JSONModel();
            this.setModel(oModel, "MDL_FCL");

            // Model do carrinho de compras
            var oCartModel = new JSONModel({
                cartEntries: {}
            });
            this.setModel(oCartModel, "cartProducts");

            // Crio o model de Cliente
            var oClienteModel = new JSONModel({});
            this.setModel(oClienteModel, "MDL_Cliente");

            // Crio o model de Resposta de Pedidos
            var oRespostaModel = new JSONModel({
                Id: "",
                TotValue: "",
                CustomerId: "",
                Message: "",
                Description: ""
            });
            this.setModel(oRespostaModel, "MDL_Resposta");

        },
        getContentDensityClass: function () {
            if (this._sContentDensityClass === undefined) {
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }        
    });
});

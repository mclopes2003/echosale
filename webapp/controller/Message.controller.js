sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("br.com.esale.echosale.controller.Message", {

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf br.com.braskem.Braskem_Notas.view.Message
         */
        onInit: function () {
            var oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
        },

        handleBtnNovo: function (evt) {
            this._setLayout("Two");
            this.oRouter.navTo("Materiais");
        },

        handleBtnPedidos: function (evt) {
            this._setLayout("Two");
            var oModelResposta = this.getModel("MDL_Resposta");
            var OrdemID = oModelResposta.getProperty("/Id")
            this.oRouter.navTo("Detail", { objDetail: OrdemID });
        }

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf br.com.braskem.Braskem_Notas.view.Message
         */
        //  onBeforeRendering: function() {
        //
        //  },

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf br.com.braskem.Braskem_Notas.view.Message
         */
        //  onAfterRendering: function() {
        //
        //  },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf br.com.braskem.Braskem_Notas.view.Message
         */
        //  onExit: function() {
        //
        //  }

    });

});

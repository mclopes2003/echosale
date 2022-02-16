sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
], function(Controller, MessageToast, UIComponent, History) {
    "use strict";
    
    return Controller.extend("br.com.esale.echosale.controller.BaseController", {

	   getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        onStateChange: function (oEvent) {
            var sLayout = oEvent.getParameter("layout"),
                iColumns = oEvent.getParameter("maxColumnsCount");

            if (iColumns === 1) {
                this.getModel("MDL_FCL").setProperty("/smallScreenMode", true);
            } else {
                this.getModel("MDL_FCL").setProperty("/smallScreenMode", false);
                if (sLayout === "OneColumn") {
                    this._setLayout("Two");
                }
            }
        },

        _setLayout: function (sColumns) {
            if (sColumns) {
                this.getModel("MDL_FCL").setProperty("/layout", sColumns + "Column" + (sColumns === "One" ? "" : "sMidExpanded"));
            }
        },

        _unhideMiddlePage: function () {
            setTimeout(function () {
                this.getOwnerComponent().getRootControl().byId("layout").getCurrentMidColumnPage().removeStyleClass("sapMNavItemHidden");
            }.bind(this), 0);
        },

        onBack: function () {
            this._unhideMiddlePage();
            var oHistory = History.getInstance();
            var oPrevHash = oHistory.getPreviousHash();
            if (oPrevHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("home");
            }
        }
        
    });
});
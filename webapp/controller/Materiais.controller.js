sap.ui.define([
    "./BaseController",
    "br/com/esale/echosale/util/Formatter",
    "sap/f/library",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "br/com/esale/echosale/util/cart",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Formatter, fioriLibrary, History, Filter, FilterOperator, Sorter, JSONModel, DateFormat, cart) {
        "use strict";

        return BaseController.extend("br.com.esale.echosale.controller.Materiais", {
            Formatter: Formatter,

            onInit: function () {
                var t = this;
                var oOwnerComponent = this.getOwnerComponent();
                this.oRouter = oOwnerComponent.getRouter();

            },

            onSearchMateriais: function (oEvent) {
                debugger;
                var sQuery = oEvent.getSource().getValue();
                var filters = [];
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("Id", sap.ui.model.FilterOperator.EQ, sQuery);
                    filters.push(filter);
                }

                var oBinding = this.byId("materiaisList").getBinding("items");
                oBinding.filter(filters);

            },

            onUpdateFinished: function (oEvent) {

                debugger;

                var sTitle, oTable = oEvent.getSource();
                var oTotalItems = oEvent.getParameter("total");
                var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

                if (oTotalItems && oTable.getBinding("items").isLengthFinal()) {
                    sTitle = bundle.getText("totalMateriais", [oTotalItems]);
                } else {
                    sTitle = bundle.getText("totalMateriais", ["0"]);
                }

                oTable.setHeaderText(sTitle);

            },

            onBack: function () {
                debugger;
                this.oRouter.navTo("Clientes");
            },

            onAddToCart: function (oEvent) {

                debugger;
                var oResourceBundle = this.getModel("i18n").getResourceBundle();
                var oProduct = oEvent.getSource().getBindingContext().getObject();
                var oCartModel = this.getModel("cartProducts");
                
                cart.addToCart(oResourceBundle,oProduct,oCartModel);

            }






        });
    });


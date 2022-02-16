sap.ui.define([
    "./BaseController",
    "sap/f/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    function (BaseController, fioriLibrary, Filter, FilterOperator, JSONModel) {
        "use strict";

        return BaseController.extend("br.com.esale.echosale.controller.Clientes", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();           
            },

            onSelectionChange: function (oEvent) {
                debugger;
                var selectedObj = oEvent.getSource().getBindingContext().getProperty("Id");
                this.oRouter.navTo("ClienteMenu", { obj: selectedObj });
            },


            onSearch: function (oEvent) {

                debugger;
                var sQuery = oEvent.getSource().getValue();
                var filters = [];

                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("Id", FilterOperator.EQ, sQuery);
                    filters.push(filter);
                }

                var oBinding = this.byId("listClientes").getBinding("items");
                oBinding.filter(filters);

            },

            onUpdateFinished: function (oEvent) {

                var sTitle, oTable = oEvent.getSource();
                var oTotalItems = oEvent.getParameter("total");
                var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

                if (oTotalItems && oTable.getBinding("items").isLengthFinal()) {
                    sTitle = bundle.getText("totalClientes", [oTotalItems]);
                } else {
                    sTitle = bundle.getText("totalClientes", ["0"]);
                }

                oTable.setHeaderText(sTitle);

                var aItems = oTable.getItems();
                if (aItems.length) {
                  aItems[0].firePress();
                }
            }
        });
    });


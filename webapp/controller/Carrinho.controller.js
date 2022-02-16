sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "br/com/esale/echosale/util/Formatter",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    BaseController,
    JSONModel,
    Device,
    formatter,
    MessageBox,
    MessageToast
) {
    "use strict";

    var sCartModelName = "cartProducts";
    var sCartEntries = "cartEntries";

    return BaseController.extend("br.com.esale.echosale.controller.Carrinho", {
        formatter: formatter,

        onInit: function () {
            
            debugger;
            this._oRouter = this.getRouter();
            var oCartConfigModel = new JSONModel({});
            this.getView().setModel(oCartConfigModel, "cartConfig");
            this.onCartConfigModel();

            var oEditButton = this.byId("editButton");
            oEditButton.addEventDelegate({
                onAfterRendering: function () {
                    oEditButton.focus();
                }
            });
        },

        onEditOrDoneButtonPress: function () {
            this.onCartConfigModel();
        },

        onCartConfigModel: function () {
           
           var oCartConfigModel = this.getView().getModel("cartConfig");
           var oData = oCartConfigModel.getData();
           var oBundle = this.getResourceBundle();
            
		 var sDeviceMode = "SingleSelectMaster";
           var bDataNoSet = !oData.hasOwnProperty("inDelete");
           var bInDelete = (bDataNoSet ? true : oData.inDelete);
           
            oCartConfigModel.setData({
                inDelete: !bInDelete,
                notInDelete: bInDelete,
                listMode: (bInDelete ? sDeviceMode : "Delete"),
                pageTitle: (bInDelete ? oBundle.getText("appTitle") : oBundle.getText("cartTitleEdit"))
            });
        },

        onCartEntriesDelete: function (oEvent) {
            
            this._deleteProduct(sCartEntries, oEvent);
        },
        
        _deleteProduct: function (sCollection, oEvent) {
            
            var oBindingContext = oEvent.getParameter("listItem").getBindingContext(sCartModelName),
                oBundle = this.getResourceBundle(),
                sEntryId = oBindingContext.getProperty("Id"),
                sEntryName = oBindingContext.getProperty("Name");

            MessageBox.show(oBundle.getText("cartDeleteDialogMsg"), {
                title: oBundle.getText("cartDeleteDialogTitle"),
                actions: [
                    MessageBox.Action.DELETE,
                    MessageBox.Action.CANCEL
                ],
                onClose: function (oAction) {
                    if (oAction !== MessageBox.Action.DELETE) {
                        return;
                    }
                    var oCartModel = oBindingContext.getModel();
                    var oCollectionEntries = Object.assign({}, oCartModel.getData()[sCollection]);

                    delete oCollectionEntries[sEntryId];

                    oCartModel.setProperty("/" + sCollection, Object.assign({}, oCollectionEntries));

                    MessageToast.show(oBundle.getText("cartDeleteDialogConfirmDeleteMsg",
                        [sEntryName]));
                }
            });
        },

        onProceedButtonPress: function () {
            this.getRouter().navTo("Checkout");
        },


        

    });
});
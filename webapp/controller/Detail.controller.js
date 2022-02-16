sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "br/com/esale/echosale/util/Formatter"
], function (Controller, Formatter) {
    "use strict";

    return Controller.extend("br.com.esale.echosale.controller.Detail", {
        Formatter: Formatter,
        
        onInit: function () {

            debugger;

            var oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
            
	    //attachPatternMatched
            this.oRouter.getRoute("Master").attachMatched(this._onObjMatched, this);
            this.oRouter.getRoute("Detail").attachMatched(this._onObjMatched, this);

        },

        _onObjMatched: function (oEvent) {

            var oView = this.getView();
            this._obj = oEvent.getParameter("arguments").objDetail;

            var sURL = "/PedidoSet('" + this._obj + "')";

            debugger;
            if (this._obj) {
                oView.bindElement({
                    path: sURL,
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function (d) {
                            oView.setBusy(true)
                        },
                        dataReceived: function (data) {
                            debugger;
                            oView.setBusy(false)
                        }
                    }
                });
            } else {
                this.oRouter.getTargets().display("notFoundPedido");
            }

        },

        _onBindingChange: function (oEvent) {
            var oView = this.getView(),
                oElementBinding = oView.getElementBinding();
debugger;
            if (!oElementBinding.getBoundContext()) {
                this.oRouter.getTargets().display("notFoundPedido");
                return;
            }
        },

        onBeforeRendering: function () {
        
            this.byId("textIdCustomer").bindElement("Cliente");
            this.byId("textCustomer").bindElement("Cliente");
            this.byId("oStatusPay").bindElement("CondPagto");
            this.byId("oStatusShip").bindElement("Frete");
	},

        onUpdateFinished: function (oEvent) {

            debugger;

            var sTitle, oTable = oEvent.getSource();
            var oTotalItems = oEvent.getParameter("total");
            var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

            if (oTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = bundle.getText("totalItems", [oTotalItems]);
            } else {
                sTitle = bundle.getText("totalItems", ["0"]);
            }

            oTable.setHeaderText(sTitle);

        }

        
    });
});

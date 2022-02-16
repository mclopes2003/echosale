sap.ui.define([
    "./BaseController",
    "sap/f/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, fioriLibrary, Filter, FilterOperator, JSONModel) {
        "use strict";

        return BaseController.extend("br.com.esale.echosale.controller.ClienteMenu", {

            onInit: function () {
                var oOwnerComponent = this.getOwnerComponent();
                this.oRouter = oOwnerComponent.getRouter();
                this.oRouter.getRoute("ClienteMenu").attachMatched(this._onObjMatched, this);
            },

            _onObjMatched: function (oEvent) {
                var oView = this.getView();
                this._obj = oEvent.getParameter("arguments").obj;

                debugger;
                var sUrl = "/ClienteSet('" + this._obj + "')";

                if (this._obj) {
                    oView.bindElement({
                        path: sUrl,
                        events: {
                            change: this._onBindingChange.bind(this),
                            dataRequested: function () {
                                oView.setBusy(true);
                            },
                            dataReceived: function () {
                                oView.setBusy(false);
                            }
                        }

                    });
		}

            },

            _onBindingChange: function () {
                var oView = this.getView(),

                    oElementBiding = oView.getElementBinding();

                debugger;

                if (!oElementBiding.getBoundContext()) {
                    this.oRouter.getTargets().display("notFound");
                    return;
                } else {
                    this.setModelCliente(oElementBiding.getBoundContext().getObject());
                }


            },

            setModelCliente: function (objCliente) {

                debugger;
                var oClienteModel = this.getModel("MDL_Cliente");
                oClienteModel.setData(objCliente);

            },

            handlePedidos: function (oEvent) {
                debugger;
                var oClienteModel = this.getModel("MDL_Cliente");
                oClienteModel.setProperty("/operacao", "Pedidos");
                var selectedObj = this.getView().getBindingContext().getObject().Id;
                this.oRouter.navTo("Master", { objMaster: selectedObj });
            },

            handleMateriais: function () {
                debugger;
                var oClienteModel = this.getModel("MDL_Cliente");
                oClienteModel.setProperty("/operacao", "NovoPedido");
                this.oRouter.navTo("Materiais", {});
            },

            onExit: function () {
                this.oRouter.getRoute("ClienteMenu").detachMatched(this._onObjMatched, this);
            }


        });
    });



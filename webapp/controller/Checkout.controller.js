sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "br/com/esale/echosale/util/Formatter",
    "sap/m/MessageBox",
    "sap/m/Link",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/esale/echosale/util/odataAPI"
], function (
    BaseController,
    JSONModel,
    Device,
    formatter,
    MessageBox,
    Link,
    MessagePopover,
    MessagePopoverItem,
    Fragment,
    Filter,
    FilterOperator,
    odataAPI) {
    "use strict";

    return BaseController.extend("br.com.esale.echosale.controller.Checkout", {

        formatter: formatter,

        onInit: function () {
            debugger;

            var oReturnToShopButton = this.byId("returnToShopButton");

            this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

            // altera o layout para 1 coluna e atribui no model pedido o cliente atual 
            this.getRouter().getRoute("Checkout").attachMatched(function () {

                //Cria model Pedido
                this.setModel(this.setModelPedido(), "ModelPedido");

                // Adiciona no model Pedido o cliente atual
                var oModelCliente = this.getModel("MDL_Cliente");
                var oModelPedido = this.getModel("ModelPedido");

                oModelPedido.getData().CustomerId = oModelCliente.getData().Id;

                this._setLayout("One");
            }.bind(this));

            // Seta o foco do botão para voltar as compras
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    oReturnToShopButton.focus();
                }
            });

            this.oRouter = this.getOwnerComponent().getRouter();
        },

        setModelPedido: function () {
            var oModel = new JSONModel({
                Id: "",
                TotValue: "0.00",
                Currency: "USD",
                CustomerId: "",
                PaymentId: "",
                CreationDate: "",
                Status: "",
                ShippingId: "",
                PedidoItemSet: []
            });
            return oModel;

         },

        getCurrentDate: function () {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-ddTHH:mm:ss"
            });
            return oDateFormat.format(new Date());
        },

        onValueHelpRequestFrete: function(){

            debugger;
            if(!this._oValueHelpDialog){
                this._oValueHelpDialog= sap.ui.xmlfragment("br.com.esale.echosale.frags.SH_Frete",this);
                this.getView().addDependent(this._oValueHelpDialog);
            }

            this._oValueHelpDialog.open();

        },

	   onValueHelpSearch: function (oEvent) {

        debugger;
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Name", FilterOperator.Contains, sValue);

            oEvent.getSource().getBinding("items").filter([oFilter]);
        },
        
        onValueHelpCloseFrete: function (oEvent) {

            debugger;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);

            if (!oSelectedItem) {
                return;
            }
            var oModelPedido = this.getModel("ModelPedido");
            oModelPedido.setProperty("/ShippingId", oSelectedItem.getTitle());
            oModelPedido.refresh(true);

            this.byId("freteInput").setDescription(oSelectedItem.getDescription());
            this.checkFretePagtoStep();
        },

        
        onSuggestionFrete: function (oEvent) {
            debugger;
            var oSelectedItem = oEvent.getParameter("selectedItem");          
            
		  if (!oSelectedItem) {
                return;
            }
     
            var oModelPedido = this.getModel("ModelPedido");
            oModelPedido.setProperty("/ShippingId", oSelectedItem.getBindingContext().getObject().Id);
            oModelPedido.refresh(true);

            this.byId("freteInput").setDescription(oSelectedItem.getText());
            this.checkFretePagtoStep();
        },

        onValueHelpRequestPagto: function(){

            debugger;
            if(!this._oPagtoValueHelpDialog){
                this._oPagtoValueHelpDialog= sap.ui.xmlfragment("br.com.esale.echosale.frags.SH_Pagto",this);
                this.getView().addDependent(this._oPagtoValueHelpDialog);
            }

            this._oPagtoValueHelpDialog.open();

        },


        onValueHelpClosePagto: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);

            if (!oSelectedItem) {
                return;
            }

            var oModelPedido = this.getModel("ModelPedido");
            oModelPedido.setProperty("/PaymentId", oSelectedItem.getTitle());
            oModelPedido.refresh(true);
            this.byId("pagtoInput").setDescription(oSelectedItem.getDescription());
            this.checkPagtoStep();
        },

	  checkFretePagtoStep: function () {
            debugger;
            this._checkStep("freteStep", ["freteInput"]); //paymentTypeStep
        },

        checkPagtoStep: function () {
            debugger;
            this._checkStep("pagamentoStep", ["pagtoInput"]);
        },

	  _checkStep: function (sStepName, aInputIds) {
            var oWizard = this.byId("shoppingCartWizard"),
                oStep = this.byId(sStepName),
                bEmptyInputs = this._checkInputFields(aInputIds);
            
		  if (!bEmptyInputs) {
                oWizard.validateStep(oStep);
            } else {
                oWizard.invalidateStep(oStep);
            }
        },


        handleWizardCancel: function () {
            var sText = this.getResourceBundle().getText("checkoutControllerAreYouSureCancel");
            this._handleSubmitOrCancel(sText, "warning", "Cancel", "Clientes");
        },

        handleWizardSubmit: function () {
            var sText = this.getResourceBundle().getText("checkoutControllerAreYouSureSubmit");
            this._handleSubmitOrCancel(sText, "confirm", "Send", "ordercompleted");
        },

        resetWizard: function () {
            var oWizard = this.byId("shoppingCartWizard");
            this._navToWizardStep(this.byId("contentsStep"));
            oWizard.discardProgress(oWizard.getSteps()[0]);
        },

        backToWizardContent: function () {
            this.byId("wizardNavContainer").backToPage(this.byId("wizardContentPage").getId());
        },

        _clearMessages: function () {
            sap.ui.getCore().getMessageManager().removeAllMessages();
        },

        _checkInputFields: function (aInputIds) {
            var oView = this.getView();

            return aInputIds.some(function (sInputId) {
                var oInput = oView.byId(sInputId);

                if (!oInput.getValue()) {
                    oInput.setDescription(null);
                    return true;
                } else {
                    return false;
                }

            });
        },
        
        _checkStep: function (sStepName, aInputIds) {
            var oWizard = this.byId("shoppingCartWizard"),
                oStep = this.byId(sStepName),
                bEmptyInputs = this._checkInputFields(aInputIds);
            if (!bEmptyInputs) {
                oWizard.validateStep(oStep);
            } else {
                oWizard.invalidateStep(oStep);
            }
        },

        checkCompleted: function () {
            this.byId("wizardNavContainer").to(this.byId("summaryPage"));
        },

        onReturnToShopButtonPress: function () {
            this.resetWizard();
            this._setLayout("Two");
            this.getRouter().navTo("Materiais");
        },

        onLimpaModel: function () {
            var oModel = this.getModel("ModelPedido");
            var oCartModel = this.getOwnerComponent().getModel("cartProducts");

            //Limpa Model Pedido
            var oModelData = oModel.getData();
            oModelData.Id = "";
            oModelData.TotValue = "";
            oModelData.Currency = "";
            oModelData.CustomerId = "";
            oModelData.PaymentId = "";
            oModelData.CreationDate = "";
            oModelData.Status = "";
            oModelData.ShippingId = "";
            oModelData.PedidoItemSet = [];
            oModel.setData(oModelData);

            this.byId("freteInput").setDescription(null);
            this.byId("pagtoInput").setDescription(null);

            oModel.refresh(true);

            //Limpa Model Carrinho
            var oCartModelData = oCartModel.getData();
            oCartModelData.cartEntries = {};
            oCartModelData.totalPrice = 0;
            oCartModel.setData(oCartModelData);

            oCartModel.refresh(true);

            // Reset Wizard
            this.resetWizard();

        },

        _handleSubmitOrCancel: function (sMessage, sMessageBoxType, sTypeOper, sRoute) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES,
                MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {

                        //Se cancelar ordem retorna ao layou original e volta para clientes
                        if (sTypeOper === "Cancel") {
                            //Limpa Model Pedido e Carrinho
                            this.onLimpaModel();
                            this._setLayout("Two");
                        } else if (sTypeOper === "Send") { //Envia para o SAP
                            this.enviarOrdem();
                        }

                        this.getRouter().navTo(sRoute);
                    }
                }.bind(this)
            });
        },

                enviarOrdem: function () {

            debugger;
            var t = this;
            var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var oModelResposta = this.getModel("MDL_Resposta");
            var arrayOfPromises = [];


            if (!t.busyDialog) {
                t.busyDialog = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: bundle.getText("sendBusyDialog")

                });
            }

            t.busyDialog.open();

            var objPedido = this.getModel("ModelPedido").getData();
            objPedido.CreationDate = this.getCurrentDate();

            var oCartModel = this.getModel("cartProducts");
            var oCollectionMateriais = oCartModel.getData().cartEntries;

            var sItem = "";
            var qtdeItems = Object.keys(oCollectionMateriais).length;

            var oItems = [];

            for (var i = 0; i < Object.keys(oCollectionMateriais).length; i++) {
                var oItem = {};

                sItem = String((i + 1) * 10).padStart(6, '0');

                oItem.Id = "";
                oItem.Item = sItem;
                oItem.MaterialId = oCollectionMateriais[Object.keys(oCollectionMateriais)[i]].Id;
                oItem.Quantity = oCollectionMateriais[Object.keys(oCollectionMateriais)[i]].Quantity.toString();

                oItems.push(oItem);

            }

            objPedido.PedidoItemSet = oItems;

            debugger;
            var createRequest = this.getODataModel().create("/PedidoSet", objPedido);
            arrayOfPromises.push(createRequest);

            Promise.all(arrayOfPromises).then(function (promiseResolvesArray) {

                debugger;
                if (promiseResolvesArray) {
                    if (promiseResolvesArray[0].response.statusCode === "200" ||
                        promiseResolvesArray[0].response.statusCode === "201" ||
                        promiseResolvesArray[0].response.statusCode === "204"
                    ) {
                        t.busyDialog.close();

                        //Montando meu model de Resposta com as informações vindas do SAP
                        oModelResposta.setProperty("/Id", promiseResolvesArray[0].data.Id);
                        oModelResposta.setProperty("/TotValue", promiseResolvesArray[0].data.TotValue);
                        oModelResposta.setProperty("/CustomerId", promiseResolvesArray[0].data.CustomerId);
                        oModelResposta.setProperty("/Message", bundle.getText("messageSuccess", [promiseResolvesArray[0].data.Id]));
                        oModelResposta.setProperty("/Description", bundle.getText("messageDescription"));

                        //Reset Wizard
                        t.resetWizard();

                        //Limpar Models
                        t.onLimpaModel();

                        //Limpa mensagens
                        t._clearMessages();

                        this.oRouter.getTargets().display("message");

                    }
                }

            }.bind(this)).catch(function (e) {

                t.busyDialog.close();
                var oRet = JSON.parse(e.responseText);
                sap.m.MessageToast.show(oRet.error.message.value, {
                    duration: 3000
                });

            });


        },

        getODataModel: function (objModel) {

            debugger;
            if (!this._odata) {
                this._odata = new odataAPI(this.getView().getModel(objModel));
            }
            return this._odata;

        },
        
        _navBackToStep: function (oEvent) {
            var sStep = oEvent.getSource().data("navBackTo");
            var oStep = this.byId(sStep);
            this._navToWizardStep(oStep);
        },

        _navToWizardStep: function (oStep) {
            var oNavContainer = this.byId("wizardNavContainer");
            var _fnAfterNavigate = function () {
                this.byId("shoppingCartWizard").goToStep(oStep);
                oNavContainer.detachAfterNavigate(_fnAfterNavigate);
            }.bind(this);

            oNavContainer.attachAfterNavigate(_fnAfterNavigate);
            oNavContainer.to(this.byId("wizardContentPage"));
        }
    });
});
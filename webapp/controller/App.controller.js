sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel) {
        "use strict";

        return BaseController.extend("br.com.esale.echosale.controller.App", {
            onInit: function () {
                var oViewModel,
                    fnSetAppNotBusy,
                    iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

                oViewModel = new JSONModel({
                    busy: true,
                    delay: 0,
                    layout: "TwoColumnsMidExpanded",
                    smallScreenMode: true
                });
                this.setModel(oViewModel, "MDL_FCL");

                fnSetAppNotBusy = function () {
                    oViewModel.setProperty("/busy", false);
                    oViewModel.setProperty("/delay", iOriginalBusyDelay);
                };

                this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
                this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);

                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
                
            }
        });
    });

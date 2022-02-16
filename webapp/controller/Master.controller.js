sap.ui.define([
    "./BaseController",
    "sap/f/library",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "br/com/esale/echosale/util/Formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, fioriLibrary, History, Filter, FilterOperator, Sorter, JSONModel, DateFormat, Formatter) {
        "use strict";

        return BaseController.extend("br.com.esale.echosale.controller.Master", {
            Formatter: Formatter,

            onInit: function () {
                var t = this;
                var oOwnerComponent = this.getOwnerComponent();
                this.oRouter = oOwnerComponent.getRouter();
                this.oRouter.getRoute("Master").attachMatched(this._onObjMatched, this);
                this.oRouter.getRoute("Detail").attachMatched(this._onObjMatched, this);


                debugger;
                this.oMasterList = this.getView().byId("masterList");
                var oViewModel = this._createViewModel();
                this.getView().setModel(oViewModel, "masterView");

                Formatter.bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

                this._oListFilterState = {
                    aFilter: [],
                    aSearch: []
            	};

                this._oGroupFunctions = {

                    Status: function (oContext) {
                        var sStatus = oContext.getProperty("Status");
                        return {
                            key: sStatus,
                            text: Formatter.globalStatusText(sStatus)
                        };
                    },

                    CreationDate: function (oContext) {
                        var oDate = new Date(oContext.getProperty("CreationDate"));
                        var iYear = oDate.getFullYear();
                        var iMonth = oDate.getMonth() + 1;
                        var sMonthName = DateFormat.getInstance({ pattern: "MMMM" }).format(oDate);

                        return {
                            key: iYear + " - " + iMonth,
                            text: t.getOwnerComponent().getModel("i18n").getResourceBundle().getText("masterGroupTitleOrderedInPeriod", [sMonthName, iYear])
                        };

                    }.bind(this)


		
		
		};


		
	    },

            _onObjMatched: function (oEvent) {
                var oView = this.getView();
                this._obj = oEvent.getParameter("arguments").objMaster;

                debugger;
                var sUrl = "/ClienteSet('" + this._obj + "')";

                if (this._obj) {
                    oView.bindElement({
                        path: sUrl,
                        events: {
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

            _createViewModel: function () {
                return new JSONModel({
                    isFilterBarVisible: false,
                    filterBarLabel: "",
                    delay: 0,
                    titleCount: 0,
                    noDataText: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("masterListNoDataText")
                });

            },

            onSearch: function (oEvent) {

                debugger;
                var sQuery = oEvent.getSource().getValue();
                var filters = [];
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("Id", sap.ui.model.FilterOperator.EQ, sQuery);
                    filters.push(filter);
                }

                var oBinding = this.byId("masterList").getBinding("items");
                oBinding.filter(filters);

            },

            onOpenFilterGroup: function (oEvent) {
                debugger;
                if (!this._oDialogSort) {
                    this._oDialogSort = sap.ui.xmlfragment("br.com.esale.echosale.frags.FilterGroup", this);
                    this.getView().addDependent(this._oDialogSort);
                }
                this._oDialogSort.open();
            },

            onConfirmViewSettingsDialog: function (oEvent) {
                debugger;
                var aFilterItems = oEvent.getParameter("filterItems"),
                    aFilters = [],
                    aCaptions = [];
                aFilterItems.forEach(function (oItem) {
                    aFilters.push(new Filter("Status", FilterOperator.EQ, oItem.getKey()));
                    aCaptions.push(oItem.getText());
                });
                this._oListFilterState.aFilter = aFilters;
                this._updateFilterBar(aCaptions.join(", "));
                this._applyFilterSearch();
                this._applyGrouper(oEvent);
            },

            _updateFilterBar: function (sFilterBarText) {
                var oViewModel = this.getView().getModel("masterView");
                var bundle = this.getView().getModel("i18n").getResourceBundle();

                oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
                oViewModel.setProperty("/filterBarLabel", bundle.getText("masterFilterBarText", [sFilterBarText]));
            },

            _applyFilterSearch: function () {
                var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
                    oViewModel = this.getView().getModel("masterView");
                var bundle = this.getView().getModel("i18n").getResourceBundle();

                this.oMasterList.getBinding("items").filter(aFilters);

                if (aFilters.length !== 0) {
                    oViewModel.setProperty("/noDataText", bundle.getText("masterListNoDataWithFilterOrSearchText"));
                } else if (this._oListFilterState.aSearch.length > 0) {
                    oViewModel.setProperty("/noDataText", bundle.getText("masterListNoDataText"));
                }
            },

            _applyGrouper: function (oEvent) {
                var mParams = oEvent.getParameters(),
                    sPath,
                    bDescending,
                    aSorters = [];
                if (mParams.groupItem) {
                    mParams.groupItem.getKey() === "CompanyName" ?
                        sPath = "Customer/" + mParams.groupItem.getKey() : sPath = mParams.groupItem.getKey();
                    bDescending = mParams.groupDescending;
                    var vGroup = this._oGroupFunctions[mParams.groupItem.getKey()];
                    aSorters.push(new Sorter(sPath, bDescending, vGroup));
                }
                this.oMasterList.getBinding("items").sort(aSorters);
            },

            onSelectionChange: function (oEvent) {
                var selectedObj = oEvent.getSource().getBindingContext().getProperty("Id");
                this.oRouter.navTo("detail", { objDetail: selectedObj });
            },

            onUpdateFinished: function (oEvent) {
                var sTitle, oTable = oEvent.getSource();
                var oTotalItems = oEvent.getParameter("total");
                var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

                sTitle = bundle.getText("titlePedidos", [this.getView().getBindingContext().getObject().Id]);

                this.getView().byId("page").setTitle(sTitle);

                var aItems = oTable.getItems();
                if (aItems.length) {
                    if (aItems[0]._bGroupHeader) {
                        aItems[1].firePress();
                    } else {
                        aItems[0].firePress();
                    }

                }

            },

            onBack: function () {
                this.oRouter.navTo("Clientes");
            }

        });
    });
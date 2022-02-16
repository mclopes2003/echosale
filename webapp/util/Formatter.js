jQuery.sap.require("sap.ui.core.format.DateFormat");


sap.ui.define([
    "sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
    "use strict";

    var Formatter = {

        state: null,
        bundle: null,

        date: function (value) {
            debugger;
            if (value) {
                var year = new Date(value).getFullYear();
                if (year === 9999) {
                    return "";
                } else {
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern: "dd/MM/yyyy" //"dd-MM-yyyy"
                    });
                    if (Formatter.state === "upd") {
                        return oDateFormat.format(new Date(value));
                    } else {
                        var nDate = new Date(value);
                        //nDate.setDate(nDate.getDate() + 1);
                        return oDateFormat.format(nDate);
                    }
                }
            } else {
                return value;
            }
        },

        globalStatusText: function (fValue) {
            try {
                debugger;
                //var oBundle = this.getView().getModel("i18n").getResourceBundle();

                if (Formatter.bundle == null) {
                    Formatter.bundle = this.getView().getModel("i18n").getResourceBundle();
                    
                }
                if (fValue === "") {
                    fValue = "Z";
                }
                return Formatter.bundle.getText("Status" + fValue, "?");

                //return oBundle.getText("Status" + fValue, "?");
            } catch (err) {
                return "";
            }
        },

        globalStatusState: function (fValue) {
            debugger;
            try {
                if (fValue === "A") {
                    return "Error";
                } else if (fValue === "C") {
                    return sap.ui.core.ValueState.Success;
                } else if (fValue === "B") {
                    return "Warning";
                } else {
                    return "None";
                }
            } catch (err) {
                return "None";
            }
        },

	   hasItems: function (oCollection1, oCollection2) {
            var bCollection1Filled = !!(oCollection1 && Object.keys(oCollection1).length),
                bCollection2Filled = !!(oCollection2 && Object.keys(oCollection2).length);

            return bCollection1Filled || bCollection2Filled;
        },

        totalPrice: function (oCartEntries) {
            var oBundle = this.getResourceBundle(),
                fTotalPrice = 0;

            Object.keys(oCartEntries).forEach(function (sProductId) {
                var oProduct = oCartEntries[sProductId];
                fTotalPrice += parseFloat(oProduct.Price) * oProduct.Quantity;
            });

            return oBundle.getText("cartTotalPrice", [Formatter.price(fTotalPrice)]);
        },

        price: function (sValue) {
            var numberFormat = NumberFormat.getFloatInstance({
                maxFractionDigits: 2,
                minFractionDigits: 2,
                groupingEnabled: true,
                groupingSeparator: ".",
                decimalSeparator: ","
            });
            return numberFormat.format(sValue);
        }



    };

    return Formatter;

}, true);

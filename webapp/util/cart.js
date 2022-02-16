sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    MessageBox,
    MessageToast) {
    "use strict";

    return {

        
        //Chama a função para atualizar o carrinho
        addToCart: function (oBundle, oProduct, oCartModel) {
            this._updateCartItem(oBundle, oProduct, oCartModel);
        },

         //Função que atualiza o carrinho com um novo item ou atualiza a quantidade that updates the cart model when a product is added to the cart.
         _updateCartItem: function (oBundle, oProductToBeAdded, oCartModel) {
            var oCollectionEntries = Object.assign({}, oCartModel.getData()["cartEntries"]);
            var oCartEntry = oCollectionEntries[oProductToBeAdded.Id];

            if (oCartEntry === undefined) {
                // cria um novo produto
                oCartEntry = Object.assign({}, oProductToBeAdded);
                oCartEntry.Quantity = 1;
                oCollectionEntries[oProductToBeAdded.Id] = oCartEntry;
            } else {
                // atualiza quantidade do produto
                oCartEntry.Quantity += 1;
            }

            //atualiza o model carrinho
            oCartModel.setProperty("/cartEntries", Object.assign({}, oCollectionEntries));
            oCartModel.refresh(true);
            MessageToast.show(oBundle.getText("productMsgAddedToCart", [oProductToBeAdded.Name]));
        }
    };
});

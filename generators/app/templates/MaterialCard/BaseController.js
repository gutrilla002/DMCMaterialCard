sap.ui.define(
  ["sap/dm/dme/podfoundation/controller/PluginViewController"],
  function (PluginViewController) {
    "use strict";
    let controller;

    return PluginViewController.extend(
      "<%= nameSpace%>.<%= folder%>.MaterialCard.BaseController",
      {
        onInit: function () {
          PluginViewController.prototype.onInit.apply(this, arguments);
          controller = this;
          this.ownerComponent = this._getPodController().getOwnerComponent();
          this.zPodSelectionModel =
            this.ownerComponent.getModel("zPodSelectionModel");
          this.eventBus = this.ownerComponent.getEventBus();
        },
        _getPodController: function () {
          if (this.getPodController()) {
            return this.getPodController();
          }
          return this;
        },
        getPlant: function () {
          return this.zPodSelectionModel.getProperty("/loginData/plant");
        },
        closeDialog: function (oEvent) {
          oEvent.getSource().getParent().close();
        },
        getResource: function () {
          return this.zPodSelectionModel.getProperty("/loginData/resource");
        },

        get: function (api, params) {
          return new Promise((resolve, reject) => {
            $.ajax({
              url: controller.getApiUrl(api),
              method: "GET",
              headers: {
                "X-Dme-Plant": controller.getPlant(),
              },
              data: params,
              success: resolve,
              error: reject,
            });
          });
        },
        post: function (api, data) {
          return new Promise((resolve, reject) => {
            if (this.getPodController()) {
              this.getPodController()._oPodController.ajaxPostRequest(
                controller.getApiUrl(api),
                data,
                function (oResponseData) {
                  resolve(oResponseData);
                },
                function (oError, sHttpErrorMessage) {
                  var err = oError || sHttpErrorMessage;
                  console.log(err);
                  reject(err);
                }
              );
            } else {
              $.ajax({
                url: controller.getApiUrl(api),
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: resolve,
                error: reject,
              });
            }
          });
        },
        getApiUrl: function (endPoint) {
          if (!this.getPublicApiRestDataSourceUri()) {
            return "/api/" + endPoint;
          }
          return this.getPublicApiRestDataSourceUri() + endPoint;
        },
        getoDataUrl: function (endPoint) {
          if (!this.getPodController()) {
            return "/oData" + endPoint;
          }
          return endPoint;
        },
      }
    );
  }
);

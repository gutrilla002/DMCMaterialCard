sap.ui.define(
  [
    "<%= nameSpace%>/<%= folder%>/MaterialCard/BaseController",
    "sap/ui/model/json/JSONModel",
  ],
  function (BaseController, JSONModel) {
    "use strict";
    let controller;
    const apis = {
      getMaterialDetails: "material/v1/materials",
    };
    const odataSvcs = {
      materialImageSvc:
        "/sapdmdmematerial/dme/product-ms/fileStorage/preview?fileId=",
      operationCustomData: "/sapdmdmeoperation/dme/product.svc/Operations",
    };

    return BaseController.extend(
      "<%= nameSpace%>.<%= folder%>.MaterialCard.MaterialCard",
      {
        materialData: {
          material: "",
          description: "",
          version: "",
          image: "",
          additionalData:{}
        },
        onInit: function () {
          BaseController.prototype.onInit.apply(this, arguments);
          controller = this;
          this.pageModel = new JSONModel(this.materialData);
          this.getView().setModel(this.pageModel);

          this.ownerComponent = this._getPodController().getOwnerComponent();

          this.zPodSelectionModel =
            this.ownerComponent.getModel("zPodSelectionModel");
          this.eventBus = this.ownerComponent.getEventBus();

          this.eventBus.subscribe(
            "MaterialCard",
            "loadMaterialDetails",
            this.loadMaterialDetails,
            this
          );
        },

        loadMaterialDetails: function (
          channel,
          oEvent,
          data = {
            material: "",
            version: "",
            success: function () {},
            error: function () {}
          }
        ) {
          if (!data.material || !data.version) return;
          this.getMaterialDetails(data.material, data.version).then((res) => {
            this.getMaterialImage(
              data.material,
              data.version,
              //on success
              (imageUrl) => {
                controller.pageModel.setProperty("/", {
                  material: data.material,
                  description: res[0].description,
                  version: data.version,
                  image: imageUrl,
                  additionalData:res
                });
                data.success(controller.pageModel.getData());
              }
            ),
              //on Error
              (err) => {
                data.error(err);
              };
          });
        },
        getMaterialImage: function (material, version, success, error) {
          let materialUrl = this.getoDataUrl(
            `/sapdmdmematerial/dme/product.svc/Materials('ItemBO:${controller.getPlant()},${material},${version}')?$select=material&$expand=materialFileAttachments($select=ref,fileId,isDefault)&$format=json`
          );

          $.get({
            url: materialUrl,
            success: function (data) {
              if (data.materialFileAttachments.length) {
                var fileId = data.materialFileAttachments[0].fileId;
                let imgUrl =
                  controller.getoDataUrl(odataSvcs.materialImageSvc) + fileId;
                success(imgUrl);
              }
            },

            error: function (err) {
              console.log(err);
              error(err);
            },
          });
        },
        getMaterialDetails: function (material, version) {
          return this.get(apis.getMaterialDetails, {
            material: material,
            plant: controller.getPlant(),
            version: version,
          });
        }
      }
    );
  }
);

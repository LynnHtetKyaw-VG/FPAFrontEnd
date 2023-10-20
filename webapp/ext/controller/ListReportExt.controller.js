sap.ui.define([
    "sap/m/MessageToast",
    "coa/model/xlsx.full.min",
    "coa/model/jszip"
], function (MessageToast, xlsx, jszip) {
    'use strict';

    return {
        onInit: function () {
            sap.ui.getCore().byId("coa::sap.suite.ui.generic.template.ListReport.view.ListReport::getCOA--template:::ListReportPage:::DynamicPageTitle-_actionsToolbar").setVisible(false);
            sap.ui.getCore().byId("coa::sap.suite.ui.generic.template.ListReport.view.ListReport::getCOA--template::PageVariant-vm").setVisible(false);
            sap.ui.getCore().byId("coa::sap.suite.ui.generic.template.ListReport.view.ListReport::getCOA--addEntry").setVisible(false);
            sap.ui.getCore().byId("coa::sap.suite.ui.generic.template.ListReport.view.ListReport::getCOA--deleteEntry").setVisible(false);

        },
        //To Get Logged in User Client
        onBeforeRendering: function (oEvent) {
            var that = this;

            var odataModel = this.getOwnerComponent().getModel();
            odataModel.read("/GetClient", {

                success: function (response) {


                    var ClientModel = new sap.ui.model.json.JSONModel({
                        values: response.results
                    });
                    that.getView().setModel(ClientModel, "ClientModel");






                },
                error: function (error) {
                    sap.m.MessageBox.error(error);
                }
            });


        },
        //To Open Create Dialog
        onCreate: function (oEvent) {
            if (!this.createDialog) {
                this.createDialog = sap.ui.xmlfragment(
                    "coa.ext.fragments.Create",
                    this
                );
                this.getView().addDependent(this.createDialog);
            }
            else {
                sap.ui.getCore().byId("inp1").setValue("");
                sap.ui.getCore().byId("inp2").setValue("");
                sap.ui.getCore().byId("inp3").setValue("");
                sap.ui.getCore().byId("inp4").setValue("");
                sap.ui.getCore().byId("inp5").setValue("");
                sap.ui.getCore().byId("inp6").setValue("");


            }
            this.createDialog.open();
        },
        //To Save Create Dialog Data
        onAddSave: function (oEvent) {
            var that = this;
            // var reqValuesToBeAdded = oEvent.getSource().getParent().getParent().getContent()[0].getItems()[0];
            var Name = sap.ui.getCore().byId("inp1").getValue();
            var Balance = sap.ui.getCore().byId("inp2").getValue();
            var Currency = sap.ui.getCore().byId("inp3").getSelectedKey();
            var Level = sap.ui.getCore().byId("inp4").getValue();
            var ExternalCode = sap.ui.getCore().byId("inp5").getValue();
            var AccountNumber = sap.ui.getCore().byId("inp6").getValue();
            //var clientid =sap.ui.getCore().byId("inp7").getValue();
            if (Name === "" || Balance === "" || Currency === "" || Level === "" || ExternalCode === "" || AccountNumber === "") {
                sap.m.MessageBox.warning("Please Fill All Details");
            } else {
                var oData = {
                    Name: Name,
                    Balance: Balance,
                    Currencies_ID: parseInt(Currency),
                    Level: parseInt(Level),
                    // PoItem_New: PoItem_New,
                    ExternalCode: parseInt(ExternalCode),
                    Account_Number: AccountNumber,
                    //Client_ClientID:clientid

                };
                var odataModel = that.getView().getModel();
                odataModel.create("/COA", oData, {
                    success: function (data, response) {
                        sap.m.MessageBox.success("Record Created Successfully ");
                        that.createDialog.close();
                        odataModel.refresh();
                    },
                    error: function (error) {
                        sap.m.MessageBox.error("Error while Creating Record");
                    }
                });
            }
        },
        //To Close Create Dialog
        onCloseAddDialog: function (oEvent) {
            this.createDialog.close();
        },
        //To Open Update Dialog
        onUpdate: function (oEvent) {

            var that = this;
            var COAModel = new sap.ui.model.json.JSONModel({
                values: oEvent.getSource().getBindingContext().getObject()
            });
            that.getView().setModel(COAModel, "COAModel");
            if (!that.updateDialog) {
                that.updateDialog = sap.ui.xmlfragment(
                    "coa.ext.fragments.Update",
                    that
                );
                that.getView().addDependent(that.updateDialog);
            }
            that.updateDialog.open();
            sap.ui.getCore().byId("input3").setSelectedKey(oEvent.getSource().getBindingContext().getObject().CID);

        },
        //To Save Update Dialog Data
        onUpdateSave: function (oEvent) {
            var that = this;
            var ID = this.getView().getModel("COAModel").getData().values.ID;
            var Name = sap.ui.getCore().byId("input1").getValue();
            var Balance = sap.ui.getCore().byId("input2").getValue();
            var Currency = sap.ui.getCore().byId("input3").getSelectedKey();
            var Level = sap.ui.getCore().byId("input4").getValue();
            var ExternalCode = sap.ui.getCore().byId("input5").getValue();
            var AccountNumber = sap.ui.getCore().byId("input6").getValue();
            //var clientid =sap.ui.getCore().byId("input7").getValue();
            var path = "/COA(ID=" + ID + ",Currencies_ID=" + Currency + ")";

            var payload = {
                Name: Name,
                Balance: Balance,
                Currencies_ID: Currency,
                Level: parseInt(Level),
                ExternalCode: parseInt(ExternalCode),
                Account_Number: AccountNumber,
                // Client_ClientID:clientid
            };

            var odataModel = that.getView().getModel();
            odataModel.update(path, payload, {
                success: function (data, response) {
                    sap.m.MessageBox.success("Record Updated Successfully ");
                    that.updateDialog.close();
                    odataModel.refresh();
                },
                error: function (error) {
                    sap.m.MessageBox.error("Error while updating Record");
                }
            });
        },
        //To Close Update Dialog
        onCloseUpdateDialog: function (oEvent) {
            this.updateDialog.close();
        },
        //To Delete Selected Record
        onDelete: function (oEvent) {
            var that = this;
            var ID = oEvent.getSource().getBindingContext().getObject().ID;
            // var Balance = oEvent.getSource().getBindingContext().getObject().Balance;
            var Currency = oEvent.getSource().getBindingContext().getObject().CID;
            var path = "/COA(ID=" + ID + ",Currencies_ID=" + Currency + ")";

            var odataModel = that.getView().getModel();


            sap.m.MessageBox.show("Are you sure, you want to delete?", {
                icon: sap.m.MessageBox.Icon.QUESTION,
                title: "Confirm",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === "OK") {
                        odataModel.remove(path, {
                            success: function (response) {
                                sap.m.MessageBox.success("Record Deleted Sucessfully");
                                odataModel.refresh();
                            },
                            error: function (error) {
                                sap.m.MessageBox.error("Record Deletion failed");
                            }
                        })
                    }
                }
            });
        },
        //To Open Excel Uplaod Dialog
        onUploadFile: function () {
            if (!this.UploadFragment) {

                this.UploadFragment = sap.ui.xmlfragment(

                    "coa.ext.fragments.UploadFile",



                    this

                );



                this.getView().addDependent(this.UploadFragment);

                this.UploadFragment.open();


            } else {

                this.UploadFragment.open();
            }
        },
         //To Close Excel Uplaod Dialog
        onCloseUpload: function () {
            var that = this;
            that.UploadFragment.close();
        },
        //To Upload Excel Data
        onUpload: function (e) {
            

            this._import(e.getParameter("files") && e.getParameter("files")[0]);
        },

        _import: function (file) {
          
            var that = this;
            var clienid = that.getView().getModel("ClientModel").getData().values[0].ClientID;
         
            var oModel = that.getOwnerComponent().getModel("ManualUpload");

            var excelData = [];
            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    workbook.SheetNames.forEach(function (sheetName) {
                      
                        excelData.push(XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]));

                    });
                    console.log(excelData);
                 
                    var COA = [];
                 
                    for (var i in excelData) {
                        sap.ui.core.BusyIndicator.show();
                        if (excelData[i].length > 0) {
                            for (var j in excelData[i]) {
                              

                                var payload = {
                                    "Account_Number": excelData[i][j].Account_Number == undefined ? "" : excelData[i][j].Account_Number.toString(),

                                    "Name": excelData[i][j].Name == undefined ? "" : excelData[i][j].Name.toString(),
                                    "Level": excelData[i][j].Level == undefined ? "" : excelData[i][j].Level,
                                    "Balance": excelData[i][j].Balance == undefined ? "" : excelData[i][j].Balance.toString(),
                                    "Currencies_Code": excelData[i][j].Currencies_Code == undefined ? "" : excelData[i][j].Currencies_Code.toString(),
                                    "LocCurrencies_code": excelData[i][j].LocCurrencies_code == undefined ? "" : excelData[i][j].LocCurrencies_code.toString(),
                                    "LocBalance": excelData[i][j].LocBalance == undefined ? "" : excelData[i][j].LocBalance.toString(),
                                    "SysCurrencies_Code": excelData[i][j].SysCurrencies_Code == undefined ? "" : excelData[i][j].SysCurrencies_Code.toString(),
                                    "SysBalance": excelData[i][j].SysBalance == undefined ? "" : excelData[i][j].SysBalance.toString()


                                };
                                COA.push(payload);
                               
                            }

                        }

                    }
                    var oData = {


                        "ClientID": clienid,

                        "COA": COA


                    };
                    that.onPost(oData);


                };
                reader.onerror = function (ex) {
                    console.log(ex);
                };
                reader.readAsBinaryString(file);
            }
        },
        readChecklistEntity: function (path, oData) {
            var that = this;
            var odataModel = that.getView().getModel();
            return new Promise(
                function (resolve, reject) {
                    that.getView().getModel("ManualUpload").create(path, oData, {
                        success: function (oData) {
                            resolve(oData);
                            sap.m.MessageToast.show("File Uploaded");
                            odataModel.refresh();
                            that.UploadFragment.close();
                            sap.ui.core.BusyIndicator.hide();

                        },
                        error: function (oResult) {
                            reject(oResult);
                            sap.m.MessageToast.show("Error");
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });
                });
        },


        onPost: function (oData) {
            var that = this;
            Promise.all([that.readChecklistEntity("/Upload_COA", oData)

            ]);

        }
    };
});
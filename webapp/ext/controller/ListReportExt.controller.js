sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onInit: function(){
            sap.ui.getCore().byId("coa::sap.suite.ui.generic.template.ListReport.view.ListReport::getCOA--template:::ListReportPage:::DynamicPageTitle-_actionsToolbar").setVisible(false);
            sap.ui.getCore().byId("coa::sap.suite.ui.generic.template.ListReport.view.ListReport::getCOA--template::PageVariant-vm").setVisible(false);
            sap.ui.getCore().byId("coa::sap.suite.ui.generic.template.ListReport.view.ListReport::getCOA--addEntry").setVisible(false);
            sap.ui.getCore().byId("coa::sap.suite.ui.generic.template.ListReport.view.ListReport::getCOA--deleteEntry").setVisible(false);
        },
        onCreate: function(oEvent) {
            if (!this.createDialog) {
                this.createDialog = sap.ui.xmlfragment(
                    "coa.ext.fragments.Create",
                    this
                );
                this.getView().addDependent(this.createDialog);
            }
            else{
                sap.ui.getCore().byId("inp1").setValue("");
                sap.ui.getCore().byId("inp2").setValue("");
                sap.ui.getCore().byId("inp3").setValue("");
                sap.ui.getCore().byId("inp4").setValue("");
                sap.ui.getCore().byId("inp5").setValue("");
                sap.ui.getCore().byId("inp6").setValue("");
                
            }
            this.createDialog.open();
        },
        onAddSave:function(oEvent){
            var that = this;
            // var reqValuesToBeAdded = oEvent.getSource().getParent().getParent().getContent()[0].getItems()[0];
            var Name = sap.ui.getCore().byId("inp1").getValue();
            var Balance = sap.ui.getCore().byId("inp2").getValue();
            var Currency = sap.ui.getCore().byId("inp3").getValue();
            var Level = sap.ui.getCore().byId("inp4").getValue();
           var ExternalCode = sap.ui.getCore().byId("inp5").getValue();
            var AccountNumber =sap.ui.getCore().byId("inp6").getValue();
            if(Name === "" || Balance === "" || Currency === "" || Level === ""  || ExternalCode === "" || AccountNumber===""){
                sap.m.MessageBox.warning("Please Fill All Details");
            } else {
                var oData = {
                    Name: Name,
                    Balance: Balance,
                    Currencies_code: Currency,
                    Level: parseInt(Level),
                   // PoItem_New: PoItem_New,
                    ExternalCode: parseInt(ExternalCode),
                    Account_Number: parseInt(AccountNumber),
                  
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
        onCloseAddDialog: function(oEvent){
            this.createDialog.close();
        },
        onUpdate: function(oEvent){

                var that = this;
                var COAModel = new sap.ui.model.json.JSONModel({
                values :oEvent.getSource().getBindingContext().getObject()
             });
             that.getView().setModel(COAModel,"COAModel");
            if (!that.updateDialog) {
                that.updateDialog = sap.ui.xmlfragment(   
                    "coa.ext.fragments.Update",
                    that
                );
                that.getView().addDependent(that.updateDialog);
            }
            that.updateDialog.open();
        
            
        },
        onUpdateSave:function(oEvent){
            var that = this;
            var ID =this.getView().getModel("COAModel").getData().values.ID;
            var Name = sap.ui.getCore().byId("input1").getValue();
            var Balance = sap.ui.getCore().byId("input2").getValue();
            var Currency = sap.ui.getCore().byId("input3").getValue();
            var Level = sap.ui.getCore().byId("input4").getValue();
           var ExternalCode = sap.ui.getCore().byId("input5").getValue();
            var AccountNumber =sap.ui.getCore().byId("input6").getValue();
            var path = "/COA(ID=" +  ID + ",Currencies_code='" + Currency + "')";
        
            var payload = {
                Name: Name,
                Balance: Balance,
                Currencies_code: Currency,
                Level: parseInt(Level),
                ExternalCode: parseInt(ExternalCode),
                Account_Number: parseInt(AccountNumber),
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
        onCloseUpdateDialog: function(oEvent){
            this.updateDialog.close();
        },
        onDelete: function(oEvent){
            var that = this;
            var ID =oEvent.getSource().getBindingContext().getObject().ID;
            // var Balance = oEvent.getSource().getBindingContext().getObject().Balance;
             var Currency = oEvent.getSource().getBindingContext().getObject().code;
            var path = "/COA(ID=" +  ID + ",Currencies_code='" + Currency + "')";

            var odataModel = that.getView().getModel();
                                    
          
            sap.m.MessageBox.show("Are you sure, you want to delete?", {
                icon: sap.m.MessageBox.Icon.QUESTION,
                title: "Confirm",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === "OK") {
                        odataModel.remove(path,{
                            success: function(response){
                                sap.m.MessageBox.success("Record Deleted Sucessfully");
                                odataModel.refresh();
                            },
                            error: function(error){
                                sap.m.MessageBox.error("Record Deletion failed");
                            }
                        })
                    } 
                }
            });
                            },
    };
});
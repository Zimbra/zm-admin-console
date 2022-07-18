/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2022 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2022 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaNewVolumeXWizard
* @contructor ZaNewVolumeXWizard
* @param parent
* @param app
* @author Luis Carlos Enríquez
**/

ZaNewVolumeXWizard = function(parent, entry) {
    ZaXWizardDialog.call(this, parent, null, ZaMsg.VM_Add_Volume_Title, "720px", "340px","ZaNewVolumeXWizard",null,"NEW_VOLUME");

    // Check if we need to make a new model for bucketObj...
    this.initForm(ZaServer.volumeObjModel,this.getMyXForm());

    this._localXForm.setController();
    this._localXForm.addListener(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, new AjxListener(this, ZaNewVolumeXWizard.prototype.handleXFormChange));
    this._localXForm.addListener(DwtEvent.XFORMS_VALUE_ERROR, new AjxListener(this, ZaNewVolumeXWizard.prototype.handleXFormChange));
    this._helpURL = location.pathname + ZaUtil.HELP_URL + "managing_servers/adding_a_new_storage_volume_to_the_server.htm?locid="+AjxEnv.DEFAULT_LOCALE;
}

ZaNewVolumeXWizard.bucketChoices = new XFormChoices([], XFormChoices.OBJECT_LIST, "globalBucketUUID", "bucketName");
ZaNewVolumeXWizard.prototype = new ZaXWizardDialog;
ZaNewVolumeXWizard.prototype.constructor = ZaNewVolumeXWizard;
ZaNewVolumeXWizard.prototype.toString = function() {
    return "ZaNewVolumeXWizard";
}
ZaXDialog.XFormModifiers["ZaNewVolumeXWizard"] = new Array();
ZaNewVolumeXWizard.helpURL = location.pathname + ZaUtil.HELP_URL + "managing_accounts/create_an_account.htm?locid="+AjxEnv.DEFAULT_LOCALE;
ZaNewVolumeXWizard.prototype.handleXFormChange = function () {
    if(this._localXForm.hasErrors()) {
        this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
    } else {
        if(this._containedObject[ZaModel.currentStep] != ZaNewVolumeXWizard.GENERAL_STEP) {
            // Run validations here instead (to do: update volumeObjModel)
            if ((this._containedObject[ZaServer.A_VolumeName] && this._containedObject["compatibleS3Bucket"] && this._containedObject[ZaServer.A_VolumeType]) || (this._containedObject[ZaServer.A_VolumeName] && this._containedObject[ZaServer.A_VolumeRootPath] && this._containedObject[ZaServer.A_VolumeType] && this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.NEW_INTERNAL_VOLUME)) {
                this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
            } else {
                this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
            }
            
        }

        if(this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.NEW_S3_BUCKET) {
            // Run validations here instead (to do: update volumeObjModel)
            if (this.hasEmptyFields(["bucketName","accessKey","secretKey","destinationPath","url"])) {
                this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
            } else {
                this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
            }
            
        }
    }
}

ZaNewVolumeXWizard.prototype.hasEmptyFields = function(fieldArray) {
    var result = false;
    for (var i in fieldArray) {
        if (!this._containedObject[fieldArray[i]] || this._containedObject[fieldArray[i]] == "") {
            result = true;
            break;
        }
    }

    return result;
}

/**
* Overwritten methods that control wizard's flow (open, go next,go previous, finish)
**/
ZaNewVolumeXWizard.prototype.popup =
function (loc) {
    ZaXWizardDialog.prototype.popup.call(this, loc);
    this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
    this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
    this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
}

ZaNewVolumeXWizard.prototype.finishWizard =
function() {
    try {
        // if(!ZaAccount.checkValues(this._containedObject)) {
        //     return false;
        // }
        // var account = ZaItem.create(this._containedObject,ZaAccount,"ZaAccount");
        // if(account != null) {
        //     //ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(ZaMsg.AccountCreated,[account.name]));
        // }
    } catch (ex) {
        switch(ex.code) {
            case ZmCsfeException.ACCT_INVALID_PASSWORD:
                ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_INVALID, ex);
                ZaApp.getInstance().getAppCtxt().getErrorDialog().showDetail(true);
            break;
            default:
                ZaApp.getInstance().getCurrentController()._handleException(ex, "ZaNewVolumeXWizard.prototype.finishWizard", null, false);
            break;
        }
    }
}

ZaNewVolumeXWizard.prototype.goNext =
function() {
    if (this._containedObject[ZaModel.currentStep] == 1) {
        this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
    }
    // Handle Internal volume case
    if (this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.GENERAL_STEP && this._containedObject["selectedVolumeType"] == "Internal") {
        this.goPage(ZaNewVolumeXWizard.NEW_INTERNAL_VOLUME);
        this.setDefaultValues();
    }
    // Handle S3 volume case
    if (this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.GENERAL_STEP && this._containedObject["selectedVolumeType"] == "S3") {
        ZaNewVolumeXWizard.bucketChoices.setChoices(ZaNewVolumeXWizard.getBucketChoices(this.bucketList, "AWS_S3"));
        this.goPage(ZaNewVolumeXWizard.NEW_S3_VOLUME);
        this.setDefaultValues();
    }
    // Handle Ceph volume case
    if (this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.GENERAL_STEP && this._containedObject["selectedVolumeType"] == "Ceph") {
        ZaNewVolumeXWizard.bucketChoices.setChoices(ZaNewVolumeXWizard.getBucketChoices(this.bucketList, "CEPH_S3"));
        this.goPage(ZaNewVolumeXWizard.NEW_CEPH_VOLUME);
    }
    // Handle new S3 bucket case
    if (this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.NEW_S3_BUCKET) {
        // Handle create bucket (callback will take care of going to next step...)
        this.createS3BucketRequest(this._containedObject); 
    }
    // Handle new Ceph bucket case
    if (this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.NEW_CEPH_BUCKET) {
        console.log("Not yet implemented");
    }
}

ZaNewVolumeXWizard.prototype.goPrev =
function() {
    if (this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.NEW_S3_VOLUME || this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.NEW_CEPH_VOLUME) {
        this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
        this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
    } else if(this._containedObject[ZaModel.currentStep] == this._lastStep) {
        this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
    }

    if (this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.NEW_S3_BUCKET) {
        this.goPage(ZaNewVolumeXWizard.NEW_S3_VOLUME);
    } else if (this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.NEW_CEPH_BUCKET) {
        this.goPage(ZaNewVolumeXWizard.NEW_CEPH_VOLUME);
    } else {
        this.goPage(ZaNewVolumeXWizard.GENERAL_STEP);
    }
}

/**
* @method setObject sets the object contained in the view
* @param entry - ZaServer object to display
**/
ZaNewVolumeXWizard.prototype.setObject = function(entry) {
    this._containedObject = {};
    // Set the initial step
    this._containedObject[ZaModel.currentStep] = entry[ZaModel.currentStep] || 1;
    this._containedObject[ZaServer.A_VolumeId] = entry[ZaServer.A_VolumeId];
    this._containedObject["selectedVolumeType"] = entry.selectedVolumeType;
    this._containedObject["region"] = "GovCloud";
    this._containedObject[ZaServer.A_VolumeCompressionThreshold] = 4096;
	this._localXForm.setInstance(this._containedObject);

    // Fetch bucket list (includes all storeProviders)
    this.bucketList = ZaNewVolumeXWizard.getS3BucketConfig();

    // // this._containedObject = new ZaServer();
    // this._containedObject.attrs = new Object();
}

ZaNewVolumeXWizard.prototype.setDefaultValues = function() {
    // Check current step
    const currentStep = this._containedObject[ZaModel.currentStep] || 1;

    if (currentStep === ZaNewVolumeXWizard.NEW_INTERNAL_VOLUME) {
        this._containedObject[ZaServer.A_VolumeName] = "";
        this._containedObject[ZaServer.A_VolumeRootPath] = "/opt/zimbra";
        this._containedObject[ZaServer.A_VolumeCompressBlobs] = false;
        this._containedObject[ZaServer.A_VolumeCompressionThreshold] = 4096;
    } else {
        this._containedObject[ZaServer.A_VolumeName] = "";
        this._containedObject[ZaServer.A_VolumeType] = "";
        delete this._containedObject[ZaServer.A_VolumeRootPath];
        delete this._containedObject[ZaServer.A_VolumeCompressBlobs];
        delete this._containedObject[ZaServer.A_VolumeCompressionThreshold];
    }

    this._localXForm.refresh();
}

ZaNewVolumeXWizard.myXFormModifier = function(xFormObject, entry) {
    const cases = new Array();
    this.bucketList = ZaNewVolumeXWizard.getS3BucketConfig();

    this.stepChoices = [];
    this.TAB_INDEX = 0;

    // Initial step
    ZaNewVolumeXWizard.GENERAL_STEP = ++this.TAB_INDEX;
    this.stepChoices.push({value: ZaNewVolumeXWizard.GENERAL_STEP, label: ZaMsg.TABT_VolumeTypePage});
    const case1 = {type:_CASE_, tabGroupKey:ZaNewVolumeXWizard.GENERAL_STEP, caseKey:ZaNewVolumeXWizard.GENERAL_STEP, numCols:1,  align:_LEFT_, valign:_TOP_};
    const case1Items = [
        {
            type: _OUTPUT_,
            label: null,
            value: 'Please select the type of volume you would like to create.',
        },
        {
            type : _GROUP_,
            numCols : 2,
            items :
                [{
                    type:_SPACER_, height:"15"
                },
                {
                    ref: ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy,
                    type: _RADIO_,
                    groupname: "subscription_settings",
                    label: ZaMsg.LBL_VM_VolumeTypeInternal,
                    onChange: ZaTabView.onFormFieldChanged,
                    updateElement: function () {
                        this.getElement().checked = (this.getInstanceValue("selectedVolumeType") == "Internal");
                    },
                    elementChanged: function(elementValue,instanceValue, event) {
                        this.getForm().setInstanceValue("Internal", "selectedVolumeType");
                        this.getForm().itemChanged(this, "Internal", event);
                    }
                }
                ,
                {
                    ref: ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy,
                    type: _RADIO_,
                    groupname: "subscription_settings",
                    label: ZaMsg.LBL_VM_VolumeTypeS3,
                    onChange: ZaTabView.onFormFieldChanged,
                    updateElement: function () {
                        this.getElement().checked = (this.getInstanceValue("selectedVolumeType") == "S3");
                    },
                    elementChanged: function(elementValue,instanceValue, event) {
                        this.getForm().setInstanceValue("S3", "selectedVolumeType");
                        this.getForm().itemChanged(this, "S3", event);
                    }
                },
                {
                    ref: ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy,
                    type: _RADIO_,
                    groupname: "subscription_settings",
                    label: ZaMsg.LBL_VM_VolumeTypeCeph,
                    onChange: ZaTabView.onFormFieldChanged,
                    updateElement: function () {
                        this.getElement().checked = (this.getInstanceValue("selectedVolumeType") == "Ceph");
                    },
                    elementChanged: function(elementValue,instanceValue, event) {
                        this.getForm().setInstanceValue("Ceph", "selectedVolumeType");
                        this.getForm().itemChanged(this, "Ceph", event);
                    }
                },
                {
                    ref: ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy,
                    type: _RADIO_,
                    groupname: "subscription_settings",
                    label: ZaMsg.LBL_VM_VolumeTypeNASG,
                    // onChange:ZaTabView.onFormFieldChanged,
                    updateElement: function () {
                        this.getElement().checked = (this.getInstanceValue("selectedVolumeType") == "NetApp");
                    },
                    // elementChanged: function(elementValue,instanceValue, event) {
                    //     this.getForm().itemChanged(this, ZaDistributionList.A2_zimbraDLSubscriptionPolicyApproval, event);
                    // }
                }]
        },
    ];

    case1.items = case1Items;
    cases.push(case1);

    // New Internal volume step
    ZaNewVolumeXWizard.NEW_INTERNAL_VOLUME = ++this.TAB_INDEX;
    this.stepChoices.push({value: ZaNewVolumeXWizard.NEW_INTERNAL_VOLUME, label: ZaMsg.TABT_InternalVolumePage});

    cases.push({type: _CASE_, tabGroupKey: ZaNewVolumeXWizard.NEW_INTERNAL_VOLUME, caseKey: ZaNewVolumeXWizard.NEW_INTERNAL_VOLUME, numCols: 1,
        items: [
            {
                type: _ZAWIZGROUP_, isTabGroup: true, numCols: 2, colSizes: ["200px","*"],
				items:[
					{
                        ref: ZaServer.A_VolumeName,
                        type: _TEXTFIELD_,
                        label: ZaMsg.LBL_VM_VolumeName,
                        labelLocation: _LEFT_,
                        labelCssStyle: "text-align:left;",
                        width: 150,
                    },
					{
                        ref: ZaServer.A_VolumeRootPath,
                        type: _TEXTFIELD_,
                        label: ZaMsg.LBL_VM_VolumeRootPath,
                        labelLocation: _LEFT_,
                        labelCssStyle: "text-align:left;",
                        width: 150,
                    },
					{
                        ref: ZaServer.A_VolumeType,
                        type: _OSELECT1_,
                        choices: ZaServer.volumeTypeChoices,
                        width: 155,
                        label: ZaMsg.LBL_VM_VolumeType,
                        labelCssStyle: "text-align:left;",
                    },
					{
                        ref: ZaServer.A_VolumeCompressBlobs,
                        type: _WIZ_CHECKBOX_,
                        label: ZaMsg.VM_VolumeCompressBlobs,
                        labelLocation: _LEFT_,
                        labelCssStyle: "padding-left:3px;",
                        trueValue: true,
                        falseValue: false,
                        align: _LEFT_,
                    },
					{
                        type: _GROUP_, numCols: 3, colSpan: 2, colSizes: ["200px","*","*"],
						items: [
							{
                                ref: ZaServer.A_VolumeCompressionThreshold,
                                type: _TEXTFIELD_,
                                label: ZaMsg.LBL_VM_VolumeCompressThreshold,
                                labelCssStyle: "text-align:left;",
                                width: 50,
                                labelLocation: _LEFT_,
                            },
							{
                                type: _OUTPUT_,
                                label: null,
                                labelLocation: _NONE_,
                                value: ZaMsg.NAD_bytes,
                                align: _LEFT_,
                            }
						]
					}
				]
			}
        ]
    });

    // New S3 volume step
    ZaNewVolumeXWizard.NEW_S3_VOLUME = ++this.TAB_INDEX;
    this.stepChoices.push({value: ZaNewVolumeXWizard.NEW_S3_VOLUME, label: ZaMsg.TABT_S3VolumePage});

    cases.push({type:_CASE_, caseKey:ZaNewVolumeXWizard.NEW_S3_VOLUME, tabGroupKey:ZaNewVolumeXWizard.NEW_S3_VOLUME, numCols:1,
        items: [
            {type:_ZAWIZGROUP_,
                numCols: 2,
                colSizes: ["200px","*"],
                items: [
                    {
                        ref: ZaServer.A_VolumeType,
                        type: _OSELECT1_,
                        label: ZaMsg.LBL_VM_VolumeType,
                        labelCssStyle: "text-align:left;",
                        choices: ZaServer.volumeTypeChoices,
                        width: 155,
                    },
                    {
                        ref: ZaServer.A_VolumeName, type: _TEXTFIELD_,
                        label: ZaMsg.LBL_VM_VolumeName, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150
                    },
                    {
                        ref: ZaServer.A_VolumePrefix, type: _TEXTFIELD_,
                        label: ZaMsg.LBL_VM_VolumePrefix, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150
                    },
                    {
                        type: _OSELECT1_,
                        label: ZaMsg.LBL_VM_S3CompatibleBucket,
                        labelCssStyle: "text-align:left;",
                        align: _LEFT_,
                        selectRef: ZaServer.A_CompatibleS3Bucket,
                        ref: ZaServer.A_CompatibleS3Bucket,
                        choices: ZaNewVolumeXWizard.bucketChoices,
                        width: 155,
                    },
                    {
                        type: _GROUP_, numCols: 2, colSizes: ["200px","*"], colSpan: 2, items: [
                            {type: _CELLSPACER_},
                            {
                                type: _BUTTON_, label: ZaMsg.LBL_VM_NewS3Bucket,
                                onActivate: function () {
                                    // Set selected storeProvider
                                    this.getForm().setInstanceValue("AWS_S3", "storeProvider");
                                    // Go to NEW_S3_BUCKET page
                                    this.getForm().parent.goPage(ZaNewVolumeXWizard.NEW_S3_BUCKET);
                                    this.getForm().parent._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
                                },
                            }
                        ]
                    }
                ]
            },
            {
                type:_SPACER_, height:"20"
            },
            {
                type:_OUTPUT_, label:null, value: 'HSM is compatible with "Amazon S3 Standard - Infrequent Access" storage class, and will set any file larger than the Infrequent Access threshold to this class. For more information about Infrequent Access, please see the official Amazon S3 documentation.',
            },
            {type:_ZAWIZGROUP_,
                colSizes:["200px","*"],numCols:2,
                items:[
                    {
                        ref: ZaServer.A_InfrequentAccess, type: _WIZ_CHECKBOX_, labelLocation: _LEFT_, align: _LEFT_, subLabel: ZaMsg.NAD_Enable,
                        label: ZaMsg.LBL_VM_InfrequentAccess, labelCssStyle: "padding-left:3px;", trueValue: "TRUE", falseValue: "FALSE",
                        enableDisableChangeEventSources: ["intelligentTiering"],
                        enableDisableChecks: [function() {
                            return this.getForm().instance["intelligentTiering"] !== "TRUE";
                        }],
                    },
                    {
                        ref: ZaServer.A_InfrequentAccessThreshold, type: _TEXTFIELD_, label: ZaMsg.LBL_VM_InfrequentAccessTreshold, 
                        labelLocation: _LEFT_, labelCssStyle: "text-align:left;", align: _LEFT_, width: 100,
                        enableDisableChangeEventSources: ["infrequentAccess"],
                        enableDisableChecks: [function() {
                            return this.getForm().instance["infrequentAccess"] === "TRUE";
                        }],
                    },
                    {
                        ref: ZaServer.A_IntelligentTiering, type: _WIZ_CHECKBOX_, labelLocation: _LEFT_, align: _LEFT_, subLabel: ZaMsg.NAD_Enable,
                        label: ZaMsg.LBL_VM_IntelligentTiering, labelCssStyle: "padding-left:3px;", trueValue: "TRUE", falseValue: "FALSE",
                        enableDisableChangeEventSources: ["infrequentAccess"],
                        enableDisableChecks: [function() {
                            return this.getForm().instance["infrequentAccess"] !== "TRUE";
                        }],
                    },
                ]
            }
        ]
    });

    // New S3 bucket step
    ZaNewVolumeXWizard.NEW_S3_BUCKET = ++this.TAB_INDEX;
    
    this.stepChoices.push({value: ZaNewVolumeXWizard.NEW_S3_BUCKET, label: ZaMsg.TABT_S3BucketPage});
    cases.push({type:_CASE_, tabGroupKey:ZaNewVolumeXWizard.NEW_S3_BUCKET, caseKey:ZaNewVolumeXWizard.NEW_S3_BUCKET, numCols:1,
        items: [
            {type:_ZAWIZGROUP_,
                colSizes:["200px","*"],numCols:2,
                items:[
                    {ref: ZaServer.A_BucketName, type: _TEXTFIELD_, label: ZaMsg.LBL_VM_BucketName, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {ref: ZaServer.A_AccessKey, type: _TEXTFIELD_, label: ZaMsg.LBL_VM_AccessKey, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {ref: ZaServer.A_SecretKey, type: _TEXTFIELD_, label: ZaMsg.LBL_VM_SecretAccessKey, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {ref: ZaServer.A_DestinationPath, type: _TEXTFIELD_, label: ZaMsg.LBL_VM_DestinationPath, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {ref: ZaServer.A_URL, type: _TEXTFIELD_, label: ZaMsg.LBL_VM_URL, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {
                        type: _OSELECT1_,
                        label:  ZaMsg.LBL_VM_Region,
                        align: _LEFT_,
                        labelCssStyle: "text-align:left;",
                        selectRef: ZaServer.A_Region,
                        ref: ZaServer.A_Region,
                        choices: ZaNewVolumeXWizard.getRegionList(),
                        width:125,
                    },
                    {
                        type: _GROUP_, colSizes: ["200px", "*"], colSpan: 2, items: [
                            {type: _CELLSPACER_},
                            {
                                type: _BUTTON_, label: ZaMsg.LBL_VM_TestBucket,
                                //  width:20,
                                onActivate:function () {
                                    alert("This functionality is yet to be implemented");
                                    this.getForm().parent.deleteS3BucketRequest();
                                    // ZaNewVolumeXWizard.createS3BucketRequest(this.getForm().instance, "AWS_S3");
                                },
                            }
                        ]
                    }
                ]
            },
        ]
    });

    // New Ceph volume step
    ZaNewVolumeXWizard.NEW_CEPH_VOLUME = ++this.TAB_INDEX;
    this.stepChoices.push({value: ZaNewVolumeXWizard.NEW_CEPH_VOLUME, label: ZaMsg.TABT_CephVolumePage});

    cases.push({type:_CASE_, caseKey:ZaNewVolumeXWizard.NEW_CEPH_VOLUME, tabGroupKey:ZaNewVolumeXWizard.NEW_CEPH_VOLUME, numCols:1,
        items: [
            {type:_ZAWIZGROUP_,
                colSizes:["200px","*"],numCols:2,
                items:[
                    {
                        ref: ZaServer.A_VolumeType,
                        type: _OSELECT1_,
                        label: ZaMsg.LBL_VM_VolumeType,
                        labelCssStyle: "text-align:left;",
                        choices: ZaServer.volumeTypeChoices,
                        width: 155,
                    },
                    {
                        ref: ZaServer.A_VolumeName, type: _TEXTFIELD_,
                        label: ZaMsg.LBL_VM_VolumeName, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150
                    },
                    {
                        ref: ZaServer.A_VolumePrefix, type: _TEXTFIELD_,
                        label: ZaMsg.LBL_VM_VolumePrefix, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150
                    },
                    {
                        type: _OSELECT1_,
                        label: ZaMsg.LBL_VM_CephBucket,
                        labelCssStyle: "text-align:left;",
                        align: _LEFT_,
                        selectRef: ZaServer.A_CompatibleS3Bucket,
                        ref: ZaServer.A_CompatibleS3Bucket,
                        choices: ZaNewVolumeXWizard.bucketChoices,
                        width: 155,
                    },
                    {
                        type: _BUTTON_, label: ZaMsg.LBL_VM_NewCephBucket,
                        //  width:20,
                        onActivate:function () {
                            // Go to NEW_CEPH_BUCKET PAGE
                            this.getForm().parent.goPage(ZaNewVolumeXWizard.NEW_CEPH_BUCKET);
                        },
                    }
                ]
            },
        ]
    });

    // New Ceph bucket step
    ZaNewVolumeXWizard.NEW_CEPH_BUCKET = ++this.TAB_INDEX;
    
    this.stepChoices.push({value: ZaNewVolumeXWizard.NEW_CEPH_BUCKET, label: ZaMsg.TABT_CephBucketPage});
    cases.push({type:_CASE_, tabGroupKey:ZaNewVolumeXWizard.NEW_CEPH_BUCKET, caseKey:ZaNewVolumeXWizard.NEW_CEPH_BUCKET, numCols:1,
        items: [
            {type: _ZAWIZGROUP_,
                colSizes: ["200px","*"], numCols: 2,
                items: [
                    {ref: "bucketName", type: _TEXTFIELD_, label: ZaMsg.LBL_VM_BucketName, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {ref: "accessKey", type: _TEXTFIELD_, label: ZaMsg.LBL_VM_AccessKey, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {ref: "secretKey", type: _TEXTFIELD_, label: ZaMsg.LBL_VM_SecretAccessKey, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {ref: "destinationPath", type: _TEXTFIELD_, label: ZaMsg.LBL_VM_DestinationPath, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {ref: "url", type: _TEXTFIELD_, label: ZaMsg.LBL_VM_URL, labelLocation: _LEFT_, labelCssStyle: "text-align:left;", width: 150},
                    {
                        type: _GROUP_, colSizes: ["200px", "*"], colSpan: 2, items: [
                            {type: _CELLSPACER_},
                            {
                                type:_BUTTON_, label: ZaMsg.LBL_VM_TestBucket,
                                //  width:20,
                                // onActivate:function (event) {
                                //     ZaNewVolumeXWizard.getBucketChoices();
                                // },
                            }
                        ]
                    }
                ]
            },
        ]
    });

    // Left sidebar visibility checks
    const labelVisibility = {};
    labelVisibility[ZaNewVolumeXWizard.GENERAL_STEP] = {};
    labelVisibility[ZaNewVolumeXWizard.NEW_INTERNAL_VOLUME] = {
        checks:[[ZaNewVolumeXWizard.isStep,"InternalVolume",true]],
    };
    labelVisibility[ZaNewVolumeXWizard.NEW_S3_VOLUME] = {
        checks:[[ZaNewVolumeXWizard.isStep,"S3Volume",true]],
    };
    labelVisibility[ZaNewVolumeXWizard.NEW_S3_BUCKET] = {
        checks:[[ZaNewVolumeXWizard.isStep,"S3Bucket",true]],
    };
    labelVisibility[ZaNewVolumeXWizard.NEW_CEPH_VOLUME] = {
        checks:[[ZaNewVolumeXWizard.isStep,"CephVolume",true]],
    };
    labelVisibility[ZaNewVolumeXWizard.NEW_CEPH_BUCKET] = {
        checks:[[ZaNewVolumeXWizard.isStep,"CephBucket",true]],
    };

    this._lastStep = this.stepChoices.length;
    xFormObject.items = [
            {
                type:_OUTPUT_, colSpan:2, align:_CENTER_, 
                valign:_TOP_, ref:ZaModel.currentStep, 
                choices:this.stepChoices, 
                labelVisibility: labelVisibility,
                valueChangeEventSources:[ZaModel.currentStep]
            },
            {type:_SEPARATOR_, align:_CENTER_, valign:_TOP_},
            {type:_SPACER_,  align:_CENTER_, valign:_TOP_},
            {type:_SWITCH_, width:680, align:_LEFT_, valign:_TOP_, items:cases}
        ];
};

ZaNewVolumeXWizard.isStep = function (step) {
    const localForm = this.getForm();
    const currentStep = localForm ? localForm.instance.currentStep : 1;
    if (step === "InternalVolume") {
        return currentStep == ZaNewVolumeXWizard.NEW_INTERNAL_VOLUME;
    } else if (step == "S3Volume") {
        return currentStep == ZaNewVolumeXWizard.NEW_S3_VOLUME || currentStep == ZaNewVolumeXWizard.NEW_S3_BUCKET;
    } else if (step == "S3Bucket") {
        return currentStep == ZaNewVolumeXWizard.NEW_S3_BUCKET;
    } else if (step == "CephVolume") {
        return currentStep == ZaNewVolumeXWizard.NEW_CEPH_VOLUME || currentStep == ZaNewVolumeXWizard.NEW_CEPH_BUCKET;
    } else if (step == "CephBucket") {
        return currentStep == ZaNewVolumeXWizard.NEW_CEPH_BUCKET;
    } else {
        return false;
    }
}

// Actions
ZaNewVolumeXWizard.getS3BucketConfig =
function() {
	const soapDoc = AjxSoapDoc.create("GetS3BucketConfigRequest", ZaZimbraAdmin.URN, null);
	const params = new Object();
	params.soapDoc = soapDoc;
	params.asyncMode = false;
	
	const reqMgrParams = {
		controller : ZaApp.getInstance().getCurrentController(),
		busyMsg : ZaMsg.BUSY_GET_ALL_SERVER
	}

    const resp = ZaRequestMgr.invoke(params, reqMgrParams);
    console.log("resp:", resp);

    if (!resp) {
        throw(new AjxException(ZaMsg.ERROR_EMPTY_RESPONSE_ARG, AjxException.UNKNOWN, "ZaNewVolumeXWizard.getS3BucketConfig"));
    } else {
        const globalS3BucketConfigurations = resp.Body.GetS3BucketConfigResponse.globalS3BucketConfigurations;
        console.log("globalS3BucketConfigurations:",globalS3BucketConfigurations);
        return globalS3BucketConfigurations;
    }
}

ZaNewVolumeXWizard.getBucketChoices = function(globalS3BucketConfigurations, storeProvider) {
    // Filter based on selected storeProvider
    if(!globalS3BucketConfigurations) globalS3BucketConfigurations = [];
    return globalS3BucketConfigurations.filter(function (bucket) {
        return bucket.storeProvider === storeProvider;
    });
}

ZaNewVolumeXWizard.prototype.createS3BucketCallback = function(resp) {
    console.log("createS3BucketResponse:", resp);
    if (!resp) {
        throw(new AjxException(ZaMsg.ERROR_EMPTY_RESPONSE_ARG, AjxException.UNKNOWN, "ZaNewVolumeXWizard.prototype.createS3BucketCallback"));
    } else if(resp.isException()) {
        ZaApp.getInstance().getCurrentController().popupErrorDialog("S3 Bucket is not valid");
	} else {
        const respAttrs = resp.getResponse().Body.CreateS3BucketConfigResponse._attrs;
        // Fetch updated bucket list and reset choices
        this.bucketList = ZaNewVolumeXWizard.getS3BucketConfig();
        ZaNewVolumeXWizard.bucketChoices.setChoices(ZaNewVolumeXWizard.getBucketChoices(this.bucketList, respAttrs.storeProvider));
        ZaNewVolumeXWizard.bucketChoices.dirtyChoices();
        // Get created bucket UUID and make it the selected option
        const newUUID = respAttrs.globalBucketUUID;
        this._containedObject["compatibleS3Bucket"] = newUUID;
        // Finally, go to the next step
        this.goPage(ZaNewVolumeXWizard.NEW_S3_VOLUME);
    }
}

ZaNewVolumeXWizard.prototype.createS3BucketRequest =
function(attrs) {
    console.log(attrs);
	const soapDoc = AjxSoapDoc.create("CreateS3BucketConfigRequest", ZaZimbraAdmin.URN, null);

    var attr = soapDoc.set("a", attrs["storeProvider"]);
    attr.setAttribute("n", "storeProvider");

    attr = soapDoc.set("a", attrs["bucketName"]);
    attr.setAttribute("n", "bucketName");

    attr = soapDoc.set("a", "HTTPS");
    attr.setAttribute("n", "protocol");

    attr = soapDoc.set("a", attrs["accessKey"]);
    attr.setAttribute("n", "accessKey");

    attr = soapDoc.set("a", attrs["secretKey"]);
    attr.setAttribute("n", "secretKey");

    attr = soapDoc.set("a", attrs["destinationPath"]);
    attr.setAttribute("n", "destinationPath");

    attr = soapDoc.set("a", attrs["region"]);
    attr.setAttribute("n", "region");

    attr = soapDoc.set("a", attrs["url"]);
    attr.setAttribute("n", "url");

	const params = new Object();
	params.soapDoc = soapDoc;
	params.asyncMode = true;
    params.callback = new AjxCallback(this, this.createS3BucketCallback);

	const reqMgrParams = {
		controller : ZaApp.getInstance().getCurrentController(),
		busyMsg : ZaMsg.BUSY_GET_ALL_SERVER
	}

    try {
        ZaRequestMgr.invoke(params, reqMgrParams);
    } catch (e) {
        console.log("error:", e);
    }
}

ZaNewVolumeXWizard.prototype.deleteS3BucketCallback = function() {
    this.bucketList = ZaNewVolumeXWizard.getS3BucketConfig();
    ZaNewVolumeXWizard.bucketChoices.setChoices(ZaNewVolumeXWizard.getBucketChoices(this.bucketList, "AWS_S3"));
    ZaNewVolumeXWizard.bucketChoices.dirtyChoices();
    delete this._containedObject["compatibleS3Bucket"];
    // Finally, go to the next step
    this.goPage(ZaNewVolumeXWizard.NEW_S3_VOLUME);
}

ZaNewVolumeXWizard.prototype.deleteS3BucketRequest =
function() {
	const soapDoc = AjxSoapDoc.create("DeleteS3BucketConfigRequest", ZaZimbraAdmin.URN, null);
    const bucetList = ZaNewVolumeXWizard.getS3BucketConfig();
    const lastBucket = bucetList.length - 1;

    const attr = soapDoc.set("a", bucetList[lastBucket]["globalBucketUUID"]);
    attr.setAttribute("n", "globalBucketUUID");

	const params = new Object();
	params.soapDoc = soapDoc;
	params.asyncMode = true;
    params.callback = new AjxCallback(this, this.deleteS3BucketCallback);

	const reqMgrParams = {
		controller : ZaApp.getInstance().getCurrentController(),
		busyMsg : ZaMsg.BUSY_GET_ALL_SERVER
	}

    try {
        ZaRequestMgr.invoke(params, reqMgrParams);
    } catch (e) {
        console.log("error:", e);
    }
}

// Constants
ZaNewVolumeXWizard.getRegionList = function() {
    const regionArray = [
        "GovCloud",
        "us-ashburn-1",
        "us_gov_east_1",
        "us_east_1",
        "us_east_2",
        "us_west_1",
        "us_west_2",
        "eu_west_1",
        "eu_west_2",
        "eu_west_3",
        "eu_central_1",
        "eu_north_1",
        "eu_south_1",
        "ap_east_1",
        "ap_south_1",
        "ap_southeast_1",
        "ap_southeast_2",
        "ap_northeast_1",
        "ap_northeast_2",
        "sa_east_1",
        "cn_north_1",
        "cn_northwest_1",
        "ca_central_1",
        "me_south_1",
        "af_south_1"
    ]

    return regionArray.map(function(region) {
        return {value:region, label:region}
    });
}

ZaXDialog.XFormModifiers["ZaNewVolumeXWizard"].push(ZaNewVolumeXWizard.myXFormModifier);

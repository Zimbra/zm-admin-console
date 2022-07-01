/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZaNewVolumeXWizard = function(parent, entry) {
    ZaXWizardDialog.call(this, parent, null, ZaMsg.VM_Add_Volume_Title, "720px", "300px","ZaNewVolumeXWizard",null,"NEW_VOLUME");

    // Check if we need to make a new model...
    this.initForm(ZaServer.volumeObjModel,this.getMyXForm(entry), null);

    this._localXForm.setController();
    this._localXForm.addListener(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, new AjxListener(this, ZaNewVolumeXWizard.prototype.handleXFormChange));
    this._localXForm.addListener(DwtEvent.XFORMS_VALUE_ERROR, new AjxListener(this, ZaNewVolumeXWizard.prototype.handleXFormChange));
    this._helpURL = location.pathname + ZaUtil.HELP_URL + "managing_servers/adding_a_new_storage_volume_to_the_server.htm?locid="+AjxEnv.DEFAULT_LOCALE;

    this._domains = {} ;
}


ZaNewVolumeXWizard.zimletChoices = new XFormChoices([], XFormChoices.SIMPLE_LIST);
ZaNewVolumeXWizard.themeChoices = new XFormChoices([], XFormChoices.OBJECT_LIST);
ZaNewVolumeXWizard.prototype = new ZaXWizardDialog;
ZaNewVolumeXWizard.prototype.constructor = ZaNewVolumeXWizard;
ZaNewVolumeXWizard.prototype.toString = function() {
    return "ZaNewVolumeXWizard";
}
ZaXDialog.XFormModifiers["ZaNewVolumeXWizard"] = new Array();
ZaNewVolumeXWizard.helpURL = location.pathname + ZaUtil.HELP_URL + "managing_accounts/create_an_account.htm?locid="+AjxEnv.DEFAULT_LOCALE;
ZaNewVolumeXWizard.prototype.handleXFormChange =
function () {
    if(this._localXForm.hasErrors()) {
        var isNeeded = true;

/*
 *Bug 49662 If it is alias step, we check the error'root. If the error is thrown
 *for the username is null, we reset this error's status. For emailaddr item's
 *OnChange() function is called after item value validation. At the stage of
 *value validation, an error is thrown and OnChange can't be called. If we
 *modify the email-address's validation method, it will effect the first stage
 *of account creatin. So we reset the error status here
 */
            if(this._containedObject[ZaModel.currentStep] == ZaNewVolumeXWizard.NEW_S3_BUCKET){
            var args = arguments[0];
            if(args && args.formItem && (args.formItem.type == "emailaddr")){
                isNeeded = !args.formItem.clearNameNullError();
            }
        }

        if(isNeeded){
            this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
            this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
            this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
        }
    } else {
        if(this._containedObject[ZaModel.currentStep] != this._lastStep) {
            this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
        }

        
        // Commented out by Luigi
        // if(this._containedObject.attrs[ZaAccount.A_lastName]
        //         && this._containedObject[ZaAccount.A_name].indexOf("@") > 0
        //         && ZaAccount.isAccountTypeSet(this._containedObject)
        //         ) {
        //     this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
        //     if(this._containedObject[ZaModel.currentStep] != this._lastStep) {
        //         this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
        //     }
        //     if(this._containedObject[ZaModel.currentStep] != ZaNewAccountXWizard.GENERAL_STEP) {
        //         this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
        //     }
        // }
    }
}

/*
ZaNewVolumeXWizard.onNameFieldChanged =
function (value, event, form) {
    if(value && value.length > 0) {
        form.parent._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
    } else {
        form.parent._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
    }
    this.setInstanceValue(value);
    return value;
}*/

/**
* Overwritten methods that control wizard's flow (open, go next,go previous, finish)
**/
ZaNewVolumeXWizard.prototype.popup =
function (loc) {
    ZaXWizardDialog.prototype.popup.call(this, loc);
    // this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
    this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
    this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
    this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
}

ZaNewVolumeXWizard.prototype.createDomainAndAccount = function(domainName) {
    try {
        var newDomain = new ZaDomain();
        newDomain.name=domainName;
        newDomain.attrs[ZaDomain.A_domainName] = domainName;
        var domain = ZaItem.create(newDomain,ZaDomain,"ZaDomain");
        if(domain != null) {
            ZaApp.getInstance().getCurrentController().closeCnfrmDelDlg();
            this.finishWizard();
        }
    } catch(ex) {
        ZaApp.getInstance().getCurrentController()._handleException(ex, "ZaNewVolumeXWizard.prototype.createDomainAndAccount", null, false);
    }
}

ZaNewVolumeXWizard.prototype.finishWizard =
function() {
    try {
        if(this._containedObject.attrs[ZaAccount.A_password]) {
            if(this._containedObject.attrs[ZaAccount.A_password] != this._containedObject[ZaAccount.A2_confirmPassword]) {
                ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
                return false;
            }
        }

        if (AjxUtil.isEmailAddress(this._containedObject.attrs[ZaAccount.A_manager], false)){
            this._containedObject.attrs[ZaAccount.A_manager] = ZaApp.getInstance().getAccountViewController()._getLDAPAttr(this._containedObject.attrs[ZaAccount.A_manager]);
        }

        // if(!ZaAccount.checkValues(this._containedObject)) {
        //     return false;
        // }
        // var account = ZaItem.create(this._containedObject,ZaAccount,"ZaAccount");
        // if(account != null) {
        //     //if creation took place - fire an change event
        //     ZaApp.getInstance().getAccountListController().fireCreationEvent(account);
        //     this.popdown();
        //     ZaApp.getInstance().getAppCtxt().getAppController().setActionStatusMsg(AjxMessageFormat.format(ZaMsg.AccountCreated,[account.name]));
        //     //ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(ZaMsg.AccountCreated,[account.name]));
        // }
    } catch (ex) {
        switch(ex.code) {
            case ZmCsfeException.ACCT_EXISTS:
                ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_ACCOUNT_EXISTS);
            break;
            case ZmCsfeException.NO_SUCH_COS:
                ZaApp.getInstance().getCurrentController().popupErrorDialog(AjxMessageFormat.format(ZaMsg.ERROR_NO_SUCH_COS,[this._containedObject.attrs[ZaAccount.A_COSId]]), ex);
            break;
            case ZmCsfeException.ACCT_INVALID_PASSWORD:
                ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_INVALID, ex);
                ZaApp.getInstance().getAppCtxt().getErrorDialog().showDetail(true);
            break;
            // case ZmCsfeException.NO_SUCH_DOMAIN:
            //     ZaApp.getInstance().dialogs["confirmMessageDialog2"].setMessage(AjxMessageFormat.format(ZaMsg.CreateDomain_q,[ZaAccount.getDomain(this._containedObject.name)]), DwtMessageDialog.WARNING_STYLE);
            //     ZaApp.getInstance().dialogs["confirmMessageDialog2"].registerCallback(DwtDialog.YES_BUTTON, this.createDomainAndAccount, this, [ZaAccount.getDomain(this._containedObject.name)]);
            //     ZaApp.getInstance().dialogs["confirmMessageDialog2"].registerCallback(DwtDialog.NO_BUTTON, ZaController.prototype.closeCnfrmDelDlg, ZaApp.getInstance().getCurrentController(), null);
            //     ZaApp.getInstance().dialogs["confirmMessageDialog2"].popup();
            // break;
            default:
                ZaApp.getInstance().getCurrentController()._handleException(ex, "ZaNewVolumeXWizard.prototype.finishWizard", null, false);
            break;
        }
    }
}

ZaNewVolumeXWizard.prototype.goNext =
function() {
    if (this._containedObject[ZaModel.currentStep] == 1) {
        //check if passwords match
        // if(this._containedObject.attrs[ZaAccount.A_password]) {
        //     if(this._containedObject.attrs[ZaAccount.A_password] != this._containedObject[ZaAccount.A2_confirmPassword]) {
        //         ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
        //         return false;
        //     }
        // }
        this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
    }
    if(this._containedObject[ZaModel.currentStep] == this._lastStep) {
        this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
    }
    // Handle S3 case
    if (this._containedObject["selectedVolumeType"] == "S3") {
        if (this._containedObject["newBucketClicked"] == true) {
            this.goPage(ZaNewVolumeXWizard.NEW_S3_BUCKET);
        } else {
            this.goPage(ZaNewVolumeXWizard.NEW_S3_VOLUME);
        }
    }
    // Handle Ceph case
    if (this._containedObject["selectedVolumeType"] == "Ceph") {
        if (this._containedObject["newBucketClicked"] == true) {
            this.goPage(ZaNewVolumeXWizard.NEW_CEPH_BUCKET);
        } else {
            this.goPage(ZaNewVolumeXWizard.NEW_CEPH_VOLUME);
        }
    }
    // this.goPage(this._containedObject[ZaModel.currentStep] + 1);
}

ZaNewVolumeXWizard.prototype.goPrev =
function() {
    if (this._containedObject[ZaModel.currentStep] == 2) {
        this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
        this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
    } else if(this._containedObject[ZaModel.currentStep] == this._lastStep) {
        this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
    }
    // Handle S3 case
    if (this._containedObject["selectedVolumeType"] == "S3") {
        if (this._containedObject["newBucketClicked"] == true) {
            this.goPage(ZaNewVolumeXWizard.NEW_S3_VOLUME);
        } else {
            this.goPage(ZaNewVolumeXWizard.GENERAL_STEP);
        }
    }
    // Handle Ceph case
    if (this._containedObject["selectedVolumeType"] == "Ceph") {
        if (this._containedObject["newBucketClicked"] == true) {
            this.goPage(ZaNewVolumeXWizard.NEW_CEPH_VOLUME);
        } else {
            this.goPage(ZaNewVolumeXWizard.GENERAL_STEP);
        }
        
    }
    // this.goPage(this._containedObject[ZaModel.currentStep] - 1);
}

/**
* @method setObject sets the object contained in the view
* @param entry - ZaAccount object to display
**/
ZaNewVolumeXWizard.prototype.setObject =
function(entry) {
    this._containedObject = {};
    // Set the initial step
    this._containedObject[ZaModel.currentStep] = entry[ZaModel.currentStep] || 1;
    this._containedObject["selectedVolumeType"] = null;
	this._localXForm.setInstance(this._containedObject);

    // // this._containedObject = new ZaServer();
    // this._containedObject.attrs = new Object();
}

ZaNewVolumeXWizard.myXFormModifier = function(xFormObject, entry) {
    var cases = new Array();

    this.stepChoices = [];
    this.TAB_INDEX = 0;

    // FIRST STEP
    ZaNewVolumeXWizard.GENERAL_STEP = ++this.TAB_INDEX;
    this.stepChoices.push({value:ZaNewVolumeXWizard.GENERAL_STEP, label:"Volume type"});
    // this.cosChoices = new XFormChoices([], XFormChoices.OBJECT_LIST, "id", "name");
    var case1 = {type:_CASE_, tabGroupKey:ZaNewVolumeXWizard.GENERAL_STEP, caseKey:ZaNewVolumeXWizard.GENERAL_STEP, numCols:1,  align:_LEFT_, valign:_TOP_};
    var case1Items = [
        {
            type:_OUTPUT_, label:null, value: 'Please select the type of volume you would like to create.',
            visibilityChecks:[],
        },
        {
            type : _GROUP_,
            numCols : 2,
            items :
                [{
                    type:_SPACER_, height:"15"
                },
                {
                    ref:ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy,
                    type:_RADIO_,
                    groupname:"subscription_settings",
                    msgName:"name",
                    label:"Internal (any mountpoint)",
                    onChange:ZaTabView.onFormFieldChanged,
                    updateElement:function () {
                        this.getElement().checked = (this.getInstanceValue("selectedVolumeType") == null);
                    },
                    elementChanged: function(elementValue,instanceValue, event) {
                        this.getForm().setInstanceValue("Internal", "selectedVolumeType");
                        this.getForm().itemChanged(this, "selectedVolumeType", event);
                    }
                }
                ,
                {
                    ref:ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy,
                    type:_RADIO_,
                    groupname:"subscription_settings",
                    msgName:"name1",
                    label:"Amazon S3",
                    onChange:ZaTabView.onFormFieldChanged,
                    updateElement:function () {
                        this.getElement().checked = (this.getInstanceValue("selectedVolumeType") == "S3");
                    },
                    elementChanged: function(elementValue,instanceValue, event) {
                        this.getForm().setInstanceValue("S3", "selectedVolumeType");
                        this.getForm().itemChanged(this, "selectedVolumeType", event);
                    }
                },
                {
                    ref:ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy,
                    type:_RADIO_,
                    groupname:"subscription_settings",
                    msgName:"name1",
                    label:"Ceph",
                    onChange:ZaTabView.onFormFieldChanged,
                    updateElement:function () {
                        this.getElement().checked = (this.getInstanceValue("selectedVolumeType") == "Ceph");
                    },
                    elementChanged: function(elementValue,instanceValue, event) {
                        this.getForm().setInstanceValue("Ceph", "selectedVolumeType");
                        this.getForm().itemChanged(this, "selectedVolumeType", event);
                    }
                },
                {
                    ref:ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy,
                    type:_RADIO_,
                    groupname:"subscription_settings",
                    msgName:"name1",
                    label:"NetApp StorageGrid",
                    // onChange:ZaTabView.onFormFieldChanged,
                    // updateElement:function () {
                    //     this.getElement().checked = (this.getInstanceValue(ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy) == ZaDistributionList.A2_zimbraDLSubscriptionPolicyApproval);
                    // },
                    // elementChanged: function(elementValue,instanceValue, event) {
                    //     this.getForm().itemChanged(this, ZaDistributionList.A2_zimbraDLSubscriptionPolicyApproval, event);
                    // }
                },
                {
                    ref:ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy,
                    type:_RADIO_,
                    groupname:"subscription_settings",
                    msgName:"name1",
                    label:"OpenIO",
                    // onChange:ZaTabView.onFormFieldChanged,
                    // updateElement:function () {
                    //     this.getElement().checked = (this.getInstanceValue(ZaDistributionList.A_zimbraDistributionListSubscriptionPolicy) == ZaDistributionList.A2_zimbraDLSubscriptionPolicyApproval);
                    // },
                    // elementChanged: function(elementValue,instanceValue, event) {
                    //     this.getForm().itemChanged(this, ZaDistributionList.A2_zimbraDLSubscriptionPolicyApproval, event);
                    // }
                }]
        },
    ];

    case1.items = case1Items;
    cases.push(case1);

    // NEW_S3_VOLUME STEP
    ZaNewVolumeXWizard.NEW_S3_VOLUME = ++this.TAB_INDEX;
    this.stepChoices.push({value:ZaNewVolumeXWizard.NEW_S3_VOLUME, label:"Amazon S3 compatible volume"});


    var bucketChoices = [
        {value:"bucket1", label:"bucket1"},
        {value:"bucket2", label:"bucket2"},
        {value:"bucket3", label:"bucket3"},
    ];
    var case2={type:_CASE_, caseKey:ZaNewVolumeXWizard.NEW_S3_VOLUME, tabGroupKey:ZaNewVolumeXWizard.NEW_S3_VOLUME, numCols:1,
        items: [
            {type:_ZAWIZGROUP_,
                colSizes:["200px","*"],numCols:2,
                items:[
                    {ref:ZaAccount.A_telephoneNumber, type:_TEXTFIELD_, msgName:ZaMsg.NAD_telephoneNumber,label:"Volume name", labelLocation:_LEFT_,labelCssStyle:"text-align:left;",width:250},
                    {ref:ZaAccount.A_homePhone, type:_TEXTFIELD_, msgName:ZaMsg.NAD_homePhone,label:"Volume prefix", labelLocation:_LEFT_,labelCssStyle:"text-align:left;",width:250},
                    {
                        type:_OSELECT1_,
                        label: "S3 compatible bucket",
                        labelCssStyle:"text-align:left;",
                        align:_LEFT_,
                        selectRef:ZaAccount.A_zimbraAvailableSkin,
                        ref:ZaAccount.A_zimbraAvailableSkin,
                        choices: bucketChoices,
                        visibilityChecks:[],
                        visibilityChangeEventSources:[],
                        width:125,
                        caseKey:ZaNewAccountXWizard.SKINS_STEP, caseVarRef:ZaModel.currentStep,
                    },
                    {
                        type:_BUTTON_, label: "New bucket",
                        //  width:20,
                        onActivate:function (event) {
                            this.getForm().setInstanceValue(true, "newBucketClicked");
                        },
                        // visibilityChecks:[Repeat_XFormItem.haveAnyRows],
                        // visibilityChangeEventSources:[this.getRef()]
                    }
                ]
            },
            {
                type:_SPACER_, height:"20"
            },
            {
                type:_OUTPUT_, label:null, value: 'HSM is compatible with "Amazon S3 Standard - Infrequent Access" storage class, and will set any file larger than the Infrequent Access threshold to this class. For more information about Infrequent Access, please see the official Amazon S3 documentation.',
                visibilityChecks:[],
            },
            {type:_ZAWIZGROUP_,
                colSizes:["200px","*"],numCols:2,
                items:[
                    {
                        ref: ZaAccount.A2_showSameDomain, type: _WIZ_CHECKBOX_, labelLocation:_LEFT_,align:_LEFT_, subLabel:"Enable",
                        label:"Infrequent access", labelCssStyle:"padding-left:3px;", trueValue:"TRUE", falseValue:"FALSE",
                        visibilityChecks:[]
                    },
                    {ref:ZaAccount.A_company, type:_TEXTFIELD_, msgName:ZaMsg.NAD_company,label:"Infrequent access threshold", labelLocation:_LEFT_, labelCssStyle:"text-align:left;", align:_LEFT_,width:100},
                    {
                        ref: ZaAccount.A2_showSameDomain, type: _WIZ_CHECKBOX_, labelLocation:_LEFT_,align:_LEFT_, subLabel:"Enable",
                        label:"Intelligent tiering", labelCssStyle:"padding-left:3px;", trueValue:"TRUE", falseValue:"FALSE",
                        visibilityChecks:[]
                    },
                ]
            }
        ]
    };
    cases.push(case2);

    // NEW_S3_BUCKET STEP
    ZaNewVolumeXWizard.NEW_S3_BUCKET = ++this.TAB_INDEX;
    
    this.stepChoices.push({value:ZaNewVolumeXWizard.NEW_S3_BUCKET, label:"New S3 bucket"});
    cases.push({type:_CASE_, tabGroupKey:ZaNewVolumeXWizard.NEW_S3_BUCKET, caseKey:ZaNewVolumeXWizard.NEW_S3_BUCKET, numCols:1,
        items: [
            {type:_ZAWIZGROUP_,
                colSizes:["200px","*"],numCols:2,
                items:[
                    {ref:ZaAccount.A_telephoneNumber, type:_TEXTFIELD_, msgName:ZaMsg.NAD_telephoneNumber,label:"Bucket name", labelLocation:_LEFT_,labelCssStyle:"text-align:left;", width:250},
                    {ref:ZaAccount.A_homePhone, type:_TEXTFIELD_, msgName:ZaMsg.NAD_homePhone,label:"Access key", labelLocation:_LEFT_,labelCssStyle:"text-align:left;", width:250} ,
                    {ref:ZaAccount.A_mobile, type:_TEXTFIELD_, msgName:ZaMsg.NAD_mobile,label:"Secret", labelLocation:_LEFT_,labelCssStyle:"text-align:left;", width:250} ,
                    {ref:ZaAccount.A_mobile, type:_TEXTFIELD_, msgName:ZaMsg.NAD_mobile,label:"Destination path", labelLocation:_LEFT_, labelCssStyle:"text-align:left;",width:250} ,
                    {
                        type:_OSELECT1_,
                        label: "Region",
                        align:_LEFT_,
                        labelCssStyle:"text-align:left;",
                        selectRef:ZaAccount.A_zimbraAvailableSkin,
                        ref:ZaAccount.A_zimbraAvailableSkin,
                        choices: [
                            {value:"us-west-1", label:"us-west-1"},
                            {value:"us-west-2", label:"us-west-2"},
                        ],
                        visibilityChecks:[],
                        visibilityChangeEventSources:[],
                        width:125,
                        caseKey:ZaNewAccountXWizard.SKINS_STEP, caseVarRef:ZaModel.currentStep,
                    },
                    {
                        type: _GROUP_, colSizes: ["200px", "*"], colSpan: 2, items: [
                            {type: _CELLSPACER_},
                            {
                                type:_BUTTON_, label: "Test Bucket"
                                //  width:20,
                                // onActivate:function (event) {
                                //     var repeatItem = this.getParentItem().getParentItem();
                                //     repeatItem.removeRowButtonClicked(this.getParentItem().instanceNum);
                                // },
                                // visibilityChecks:[Repeat_XFormItem.haveAnyRows],
                                // visibilityChangeEventSources:[this.getRef()]
                            }
                        ]
                    }
                    ]
            },
        ]
    });

    // NEW_S3_VOLUME STEP
    ZaNewVolumeXWizard.NEW_CEPH_VOLUME = ++this.TAB_INDEX;
    this.stepChoices.push({value:ZaNewVolumeXWizard.NEW_CEPH_VOLUME, label:"Ceph compatible volume"});

    cases.push({type:_CASE_, caseKey:ZaNewVolumeXWizard.NEW_CEPH_VOLUME, tabGroupKey:ZaNewVolumeXWizard.NEW_CEPH_VOLUME, numCols:1,
        items: [
            {type:_ZAWIZGROUP_,
                colSizes:["200px","*"],numCols:2,
                items:[
                    {ref:ZaAccount.A_telephoneNumber, type:_TEXTFIELD_, msgName:ZaMsg.NAD_telephoneNumber,label:"Volume name", labelLocation:_LEFT_,labelCssStyle:"text-align:left;",width:250},
                    {ref:ZaAccount.A_homePhone, type:_TEXTFIELD_, msgName:ZaMsg.NAD_homePhone,label:"Volume prefix", labelLocation:_LEFT_,labelCssStyle:"text-align:left;",width:250},
                    {
                        type:_OSELECT1_,
                        label: "Ceph bucket",
                        labelCssStyle:"text-align:left;",
                        align:_LEFT_,
                        selectRef:ZaAccount.A_zimbraAvailableSkin,
                        ref:ZaAccount.A_zimbraAvailableSkin,
                        choices: bucketChoices,
                        visibilityChecks:[],
                        visibilityChangeEventSources:[],
                        width:125,
                        caseKey:ZaNewAccountXWizard.SKINS_STEP, caseVarRef:ZaModel.currentStep,
                    },
                ]
            },
        ]
    });

    // NEW_CEPH_BUCKET Step
    ZaNewVolumeXWizard.NEW_CEPH_BUCKET = ++this.TAB_INDEX;
    
    this.stepChoices.push({value:ZaNewVolumeXWizard.NEW_CEPH_BUCKET, label:"New Ceph bucket"});
    cases.push({type:_CASE_, tabGroupKey:ZaNewVolumeXWizard.NEW_CEPH_BUCKET, caseKey:ZaNewVolumeXWizard.NEW_CEPH_BUCKET, numCols:1,
        items: [
            {type:_ZAWIZGROUP_,
                colSizes:["200px","*"],numCols:2,
                items:[
                    {ref:ZaAccount.A_telephoneNumber, type:_TEXTFIELD_, msgName:ZaMsg.NAD_telephoneNumber,label:"Bucket name", labelLocation:_LEFT_,labelCssStyle:"text-align:left;", width:250},
                    {ref:ZaAccount.A_homePhone, type:_TEXTFIELD_, msgName:ZaMsg.NAD_homePhone,label:"Access key", labelLocation:_LEFT_,labelCssStyle:"text-align:left;", width:250} ,
                    {ref:ZaAccount.A_mobile, type:_TEXTFIELD_, msgName:ZaMsg.NAD_mobile,label:"Secret", labelLocation:_LEFT_,labelCssStyle:"text-align:left;", width:250} ,
                    {ref:ZaAccount.A_mobile, type:_TEXTFIELD_, msgName:ZaMsg.NAD_mobile,label:"Destination path", labelLocation:_LEFT_, labelCssStyle:"text-align:left;",width:250} ,
                    {ref:ZaAccount.A_mobile, type:_TEXTFIELD_, msgName:ZaMsg.NAD_mobile,label:"URL", labelLocation:_LEFT_, labelCssStyle:"text-align:left;",width:250} ,
                    {
                        type: _GROUP_, colSizes: ["200px", "*"], colSpan: 2, items: [
                            {type: _CELLSPACER_},
                            {
                                type:_BUTTON_, label: "Test Bucket"
                                //  width:20,
                                // onActivate:function (event) {
                                //     var repeatItem = this.getParentItem().getParentItem();
                                //     repeatItem.removeRowButtonClicked(this.getParentItem().instanceNum);
                                // },
                                // visibilityChecks:[Repeat_XFormItem.haveAnyRows],
                                // visibilityChangeEventSources:[this.getRef()]
                            }
                        ]
                    }
                ]
            },
        ]
    });

    // Left sidebar visibility checks
    var labelVisibility = {};
    labelVisibility[ZaNewVolumeXWizard.GENERAL_STEP] = {
        checks:[ZaNewVolumeXWizard.isEnabled],
        sources:[]
    };
    labelVisibility[ZaNewVolumeXWizard.NEW_S3_VOLUME] = {
        checks:[ZaNewVolumeXWizard.isS3Volume],
        sources:[]
    };
    labelVisibility[ZaNewVolumeXWizard.NEW_S3_BUCKET] = {
        checks:[ZaNewVolumeXWizard.isNewS3BucketClicked],
        sources:[]
    };
    labelVisibility[ZaNewVolumeXWizard.NEW_CEPH_VOLUME] = {
        checks:[ZaNewVolumeXWizard.isCephVolume],
        sources:[]
    };
    labelVisibility[ZaNewVolumeXWizard.NEW_CEPH_BUCKET] = {
        checks:[ZaNewVolumeXWizard.isNewCephBucketClicked],
        sources:[]
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

ZaNewVolumeXWizard.isS3Volume = function () {
    var localForm = this.getForm();
    var currentStep = localForm ? localForm.instance.currentStep : 1;
    return currentStep == ZaNewVolumeXWizard.NEW_S3_VOLUME || currentStep == ZaNewVolumeXWizard.NEW_S3_BUCKET;
}

ZaNewVolumeXWizard.isNewS3BucketClicked = function () {
    var localForm = this.getForm();
    var currentStep = localForm ? localForm.instance.currentStep : 1;
    return currentStep == ZaNewVolumeXWizard.NEW_S3_BUCKET;
}

ZaNewVolumeXWizard.isCephVolume = function () {
    var localForm = this.getForm();
    var currentStep = localForm ? localForm.instance.currentStep : 1;
    return currentStep == ZaNewVolumeXWizard.NEW_CEPH_VOLUME || currentStep == ZaNewVolumeXWizard.NEW_CEPH_BUCKET;
}

ZaNewVolumeXWizard.isNewCephBucketClicked = function () {
    var localForm = this.getForm();
    var currentStep = localForm ? localForm.instance.currentStep : 1;
    return currentStep == ZaNewVolumeXWizard.NEW_CEPH_BUCKET;
}

ZaNewVolumeXWizard.isEnabled = function () {
	return true;
}

ZaXDialog.XFormModifiers["ZaNewVolumeXWizard"].push(ZaNewVolumeXWizard.myXFormModifier);

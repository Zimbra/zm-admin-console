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

/**
* @class ZaGlobalConfigViewController 
* @contructor ZaGlobalConfigViewController
* @param appCtxt
* @param container
* @param app
* @author Greg Solovyev
**/
ZaGlobalConfigViewController = function(appCtxt, container) {
	ZaXFormViewController.call(this, appCtxt, container, "ZaGlobalConfigViewController");
	this._UICreated = false;
	this._helpURL = location.pathname + ZaUtil.HELP_URL + "managing_global_settings/global_settings.htm?locid="+AjxEnv.DEFAULT_LOCALE;
	this._helpButtonText = ZaMsg.helpManageGlobalSettings;
	this.objType = ZaEvent.S_GLOBALCONFIG;
	this.tabConstructor = GlobalConfigXFormView;
	this._currentSortOrder = true;				
}

ZaGlobalConfigViewController.prototype = new ZaXFormViewController();
ZaGlobalConfigViewController.prototype.constructor = ZaGlobalConfigViewController;

//ZaGlobalConfigViewController.STATUS_VIEW = "ZaGlobalConfigViewController.STATUS_VIEW";
ZaController.initToolbarMethods["ZaGlobalConfigViewController"] = new Array();
ZaController.initPopupMenuMethods["ZaGlobalConfigViewController"] = new Array();
ZaController.setViewMethods["ZaGlobalConfigViewController"] = [];
ZaController.changeActionsStateMethods["ZaGlobalConfigViewController"] = [];
ZaXFormViewController.preSaveValidationMethods["ZaGlobalConfigViewController"] = new Array();
//qin
ZaController.saveChangeCheckMethods["ZaGlobalConfigViewController"] = new Array();

/**
* Adds listener to removal of an ZaDomain 
* @param listener
**/
ZaGlobalConfigViewController.prototype.addSettingsChangeListener = 
function(listener) {
	this._evtMgr.addListener(ZaEvent.E_MODIFY, listener);
}

ZaGlobalConfigViewController.prototype.show = 
function(item, openInNewTab) {
	this._setView(item, false);
}

ZaGlobalConfigViewController.initPopupMenuMethod =
function () {
	this._popupOperations[ZaOperation.SAVE] = new ZaOperation(ZaOperation.SAVE, ZaMsg.TBB_Save, ZaMsg.ALTBB_Save_tt, "Save", "SaveDis", new AjxListener(this, this.saveButtonListener));    			
	this._popupOperations[ZaOperation.DOWNLOAD_GLOBAL_CONFIG] = new ZaOperation(ZaOperation.DOWNLOAD_GLOBAL_CONFIG, ZaMsg.TBB_DownloadConfig, ZaMsg.GLOBTBB_DownloadConfig_tt, "DownloadGlobalConfig", "DownloadGlobalConfig", new AjxListener(this, this.downloadConfigButtonListener));

}
ZaController.initPopupMenuMethods["ZaGlobalConfigViewController"].push(ZaGlobalConfigViewController.initPopupMenuMethod);

ZaGlobalConfigViewController.setViewMethod = function (entry) {
    try {
    	entry.load();
	} catch (ex) {
		this._handleException(ex, "ZaGlobalConfigViewController.prototype.show", null, false);
	}

    if (!entry[ZaModel.currentTab]) {
        entry[ZaModel.currentTab] = "1";
    }

    if (!this._UICreated) {
        this._createUI(entry);
    }

    ZaApp.getInstance().pushView(this.getContentViewId());

    this._view.setDirty(false);
    this._view.setObject(entry); 	//setObject is delayed to be called after pushView in order to avoid jumping of the view

    this._currentObject = entry;
}
ZaController.setViewMethods["ZaGlobalConfigViewController"].push(ZaGlobalConfigViewController.setViewMethod) ;

/**
* @method _createUI
**/
ZaGlobalConfigViewController.prototype._createUI =
function (entry) {
	this._contentView = this._view = new this.tabConstructor(this._container, entry);

    this._initPopupMenu();
	//always add Help button at the end of the toolbar
	
	var elements = new Object();
	elements[ZaAppViewMgr.C_APP_CONTENT] = this._view;
    ZaApp.getInstance().getAppViewMgr().createView(this.getContentViewId(), elements);
	this._UICreated = true;
	ZaApp.getInstance()._controllers[this.getContentViewId ()] = this ;
}

ZaGlobalConfigViewController.prototype.setEnabled = 
function(enable) {
	this._view.setEnabled(enable);
}

ZaGlobalConfigViewController.changeActionsStateMethod =
function () {
    var isToEnable = (this._view && this._view.isDirty());
    if(this._popupOperations[ZaOperation.SAVE]) {
        this._popupOperations[ZaOperation.SAVE].enabled = isToEnable;
    }
}
ZaController.changeActionsStateMethods["ZaGlobalConfigViewController"].push(ZaGlobalConfigViewController.changeActionsStateMethod);


/**
* handles "download" button click. Launches file download in a new window
**/
ZaGlobalConfigViewController.prototype.downloadConfigButtonListener = 
function(ev) {
	window.open("/service/collectldapconfig/");
}

ZaGlobalConfigViewController.prototype._saveChanges =
function () {
	var tmpObj = this._view.getObject();
	var isNew = false;
	if(tmpObj.attrs == null) {
		//show error msg
		this._errorDialog.setMessage(ZaMsg.ERROR_UNKNOWN, null, DwtMessageDialog.CRITICAL_STYLE, null);
		this._errorDialog.popup();		
		return false;	
	}

	//check values
	if(ZaItem.hasWritePermission(ZaGlobalConfig.A_zimbraSmtpPort,tmpObj)) {
		if(!AjxUtil.isNonNegativeLong(tmpObj.attrs[ZaGlobalConfig.A_zimbraSmtpPort])) {
			//show error msg
			this._errorDialog.setMessage(AjxMessageFormat.format(ZaMsg.ERROR_INVALID_VALUE_FOR, [ZaMsg.NAD_SmtpPort]), null, DwtMessageDialog.CRITICAL_STYLE, null);
			this._errorDialog.popup();		
			return false;
		}
	}	
	//check if domain is real
	if(ZaItem.hasWritePermission(ZaGlobalConfig.A_zimbraDefaultDomainName,tmpObj)) {
		if(tmpObj.attrs[ZaGlobalConfig.A_zimbraDefaultDomainName]) {
			if(tmpObj.attrs[ZaGlobalConfig.A_zimbraDefaultDomainName] != this._currentObject.attrs[ZaGlobalConfig.A_zimbraDefaultDomainName]) {
				var testD = new ZaDomain();
				try {
					testD.load("name",tmpObj.attrs[ZaGlobalConfig.A_zimbraDefaultDomainName]);
				} catch (ex) {
					if (ex.code == ZmCsfeException.NO_SUCH_DOMAIN) {
						this._errorDialog.setMessage(AjxMessageFormat.format(ZaMsg.ERROR_WRONG_DOMAIN_IN_GS, [tmpObj.attrs[ZaGlobalConfig.A_zimbraDefaultDomainName]]), null, DwtMessageDialog.CRITICAL_STYLE, null);
						this._errorDialog.popup();	
						return false;	
					} else {
						throw (ex);
					}
				}
			}
		}
	}	
	if(ZaItem.hasWritePermission(ZaGlobalConfig.A_zimbraGalMaxResults,tmpObj)) {
		if(!AjxUtil.isNonNegativeLong(tmpObj.attrs[ZaGlobalConfig.A_zimbraGalMaxResults])) {
			//show error msg
			this._errorDialog.setMessage(AjxMessageFormat.format(ZaMsg.ERROR_INVALID_VALUE_FOR,[ZaMsg.MSG_zimbraGalMaxResults]), null, DwtMessageDialog.CRITICAL_STYLE, null);
			this._errorDialog.popup();		
			return false;
		}	
	}	
	if(ZaItem.hasWritePermission(ZaGlobalConfig.A_zimbraScheduledTaskNumThreads,tmpObj)) {
		if (tmpObj.attrs[ZaGlobalConfig.A_zimbraScheduledTaskNumThreads] &&
		 	 !AjxUtil.isPositiveInt(tmpObj.attrs[ZaGlobalConfig.A_zimbraScheduledTaskNumThreads])) {
				//show error msg
			this._errorDialog.setMessage(AjxMessageFormat.format(ZaMsg.ERROR_INVALID_VALUE_FOR,[ZaMsg.NAD_zimbraScheduledTaskNumThreads]), null, DwtMessageDialog.CRITICAL_STYLE, null);
			this._errorDialog.popup();		
			return false;
		}	
	}	
	// update zimbraMtaRestriction (except RBLs)
	if(ZaItem.hasWritePermission(ZaGlobalConfig.A_zimbraMtaRestriction,tmpObj)) {
		var restrictions = [];
		for (var i = 0; i < ZaGlobalConfig.MTA_RESTRICTIONS.length; i++) {
			var restriction = ZaGlobalConfig.MTA_RESTRICTIONS[i];
			if (tmpObj.attrs["_"+ZaGlobalConfig.A_zimbraMtaRestriction+"_"+restriction]) {
				restrictions.push(restriction);
			}			
		}
		var dirty = restrictions.length > 0;
		if (tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaRestriction]) {
			var prevRestrictions = AjxUtil.isString(tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaRestriction])
			                     ? [ tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaRestriction] ]
			                     : tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaRestriction];
			dirty = AjxStringUtil.getAsString(restrictions.sort()) != AjxStringUtil.getAsString(prevRestrictions.sort());
			if (!dirty) {
				for (var i = 0; i < prevRestrictions.length; i++) {
					var restriction = prevRestrictions[i];
					if (!tmpObj.attrs["_"+ZaGlobalConfig.A_zimbraMtaRestriction+"_"+restriction]) {
						dirty = true;
						break;
					}
				}
			}
		}
		
		//check policy service
		var policyService = tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaPolicyService];
		var currentPolicyService = this._currentObject.attrs[ZaGlobalConfig.A_zimbraMtaPolicyService];
		var policyServiceLength = policyService.length;
		if ((policyServiceLength != currentPolicyService.length) || (policyService.join("") != currentPolicyService.join(""))) {
			dirty = true;
		}
		for (var ix = 0; ix < policyServiceLength; ix++) {
			var policyServiceValue = policyService[ix];
			if (policyServiceValue) {
				restrictions.push("check_policy_service " + policyServiceValue);
			}
		}

        // Check reject_rbl_client - List of Client RBLs
		var rblClient = tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaRejectRblClient];
		var currentRblClient = this._currentObject.attrs[ZaGlobalConfig.A_zimbraMtaRejectRblClient];
		var rblClientLength = rblClient.length;
		if ((rblClientLength != currentRblClient.length) || (rblClient.join("") != currentRblClient.join(""))) {
			dirty = true;
		}
		for (var ix = 0 ; ix < rblClientLength; ix++) {
			var rblClientValue = rblClient[ix];
			if (rblClientValue) {
				restrictions.push("reject_rbl_client " + rblClientValue);
			}
		}

        // Check reject_rhsbl_client - List of Client RHSBLs
		var RHSblClient = tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaRejectRHSblClient];
		var currentRHSblClient = this._currentObject.attrs[ZaGlobalConfig.A_zimbraMtaRejectRHSblClient];
		var RHSblClientLength = RHSblClient.length;
		if ((RHSblClientLength != currentRHSblClient.length) || (RHSblClient.join("") != currentRHSblClient.join(""))) {
			dirty = true;
		}
		for (var ix = 0 ; ix < RHSblClientLength; ix++) {
			var RHSblClientValue = RHSblClient[ix];
			if (RHSblClientValue) {
				restrictions.push("reject_rhsbl_client " + RHSblClientValue);
			}
		}

        // Check reject_rhsbl_reverse_client - List of Reverse Client RHSBLs
		var RHSblReverseClient = tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaRejectRHSblReverseClient];
		var currentRHSblReverseClient = this._currentObject.attrs[ZaGlobalConfig.A_zimbraMtaRejectRHSblReverseClient];
		var RHSblReverseClientLength = RHSblReverseClient.length;
		if ((RHSblReverseClientLength != currentRHSblReverseClient.length) || (RHSblReverseClient.join("") != currentRHSblReverseClient.join(""))) {
			dirty = true;
		}
		for (var ix = 0 ; ix < RHSblReverseClientLength; ix++) {
			var RHSblReverseClientValue = RHSblReverseClient[ix];
			if (RHSblReverseClientValue) {
				restrictions.push("reject_rhsbl_reverse_client " + RHSblReverseClientValue);
			}
		}

        // Check reject_rhsbl_sender - List of Sender RHSBLs
		var RHSblSender = tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaRejectRHSblSender];
		var currentRHSblSender = this._currentObject.attrs[ZaGlobalConfig.A_zimbraMtaRejectRHSblSender];
		var RHSblSenderLength = RHSblSender.length;
		if ((RHSblSenderLength != currentRHSblSender.length) || (RHSblSender.join("") != currentRHSblSender.join(""))) {
			dirty = true;
		}
		for (var ix = 0 ; ix < RHSblSenderLength; ix++) {
			var RHSblSenderValue = RHSblSender[ix];
			if (RHSblSenderValue) {
				restrictions.push("reject_rhsbl_sender " + RHSblSenderValue);
			}
		}

        if (dirty) {
			tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaRestriction] = restrictions;
		}
	}

	// check validation expression, which should be email-like pattern
        if(tmpObj.attrs[ZaGlobalConfig.A_zimbraMailAddressValidationRegex]) {
                var regList = tmpObj.attrs[ZaGlobalConfig.A_zimbraMailAddressValidationRegex];
                var islegal = true;
                var regval = null;
                if(regList && regList instanceof Array) {
                        for(var i = 0; i < regList.length && islegal; i++) {
                                if (regList[i].indexOf("@") == -1) {
                                        islegal = false;
                                        regval = regList[i];
                                }
                        }
                } else if(regList) {
                        if (regList.indexOf("@") == -1) {
                                islegal = false;
                                regval = regList;
                        }
                }
                if(!islegal) {
                        this._errorDialog.setMessage(AjxMessageFormat.format(ZaMsg.ERROR_MSG_EmailValidReg, regval),
                                null, DwtMessageDialog.CRITICAL_STYLE, ZabMsg.zimbraAdminTitle);
                        this._errorDialog.popup();
                        return islegal;
                }
        }

        //transfer the fields from the tmpObj to the _currentObject, since _currentObject is an instance of ZaDomain
        var mods = new Object();

        // execute other plugin methods
        if(ZaController.saveChangeCheckMethods["ZaGlobalConfigViewController"]) {
                var methods = ZaController.saveChangeCheckMethods["ZaGlobalConfigViewController"];
                var cnt = methods.length;
                for(var i = 0; i < cnt; i++) {
                        if(typeof(methods[i]) == "function")
                               methods[i].call(this, mods, tmpObj, this._currentObject);
                }
        }
	
	for (var a in tmpObj.attrs) {
		if(a == ZaItem.A_objectClass || a == ZaGlobalConfig.A_zimbraAccountClientAttr ||
		a == ZaGlobalConfig.A_zimbraServerInheritedAttr || a == ZaGlobalConfig.A_zimbraDomainInheritedAttr ||
		a == ZaGlobalConfig.A_zimbraCOSInheritedAttr || a == ZaGlobalConfig.A_zimbraGalLdapAttrMap || 
		a == ZaGlobalConfig.A_zimbraGalLdapFilterDef || /^_/.test(a) || a == ZaGlobalConfig.A_zimbraMtaBlockedExtension || a == ZaGlobalConfig.A_zimbraMtaCommonBlockedExtension
                || a == ZaItem.A_zimbraACE)
			continue;
		if(!ZaItem.hasWritePermission(a,tmpObj)) {
			continue;
		}		
		
		if ((this._currentObject.attrs[a] != tmpObj.attrs[a]) && !(this._currentObject.attrs[a] == undefined && tmpObj.attrs[a] === "")) {
			if(tmpObj.attrs[a] instanceof Array) {
                if (!this._currentObject.attrs[a])
                	this._currentObject.attrs[a] = [] ;
		else if(!(this._currentObject.attrs[a] instanceof Array))
			this._currentObject.attrs[a] = [this._currentObject.attrs[a]];

                if( tmpObj.attrs[a].join(",").valueOf() !=  this._currentObject.attrs[a].join(",").valueOf()) {
					if (a === ZaGlobalConfig.A_zimbraMtaRestriction) { // Fix for bug 104512
						var mtaRestCustomAttrArr = ZaGlobalConfigViewController.getMTARestCustomAttributes(this._currentObject.attrs[a]);
						tmpObj.attrs[a] =  AjxUtil.mergeArrays(tmpObj.attrs[a],mtaRestCustomAttrArr);
						AjxUtil.dedup(tmpObj.attrs[a]);
					}
					mods[a] = tmpObj.attrs[a];
				}
			} else {
				mods[a] = tmpObj.attrs[a];
			}				
		}
	}
	//check if blocked extensions are changed
	if(ZaItem.hasWritePermission(ZaGlobalConfig.A_zimbraMtaBlockedExtension,tmpObj)) {
		if(!AjxUtil.isEmpty(tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaBlockedExtension])) {
			if(
				(
					(!this._currentObject.attrs[ZaGlobalConfig.A_zimbraMtaBlockedExtension] || !this._currentObject.attrs[ZaGlobalConfig.A_zimbraMtaBlockedExtension].length))
					|| (tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaBlockedExtension].join("") != this._currentObject.attrs[ZaGlobalConfig.A_zimbraMtaBlockedExtension].join(""))
				) {
				mods[ZaGlobalConfig.A_zimbraMtaBlockedExtension] = tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaBlockedExtension];
			} 
		} else if (AjxUtil.isEmpty(tmpObj.attrs[ZaGlobalConfig.A_zimbraMtaBlockedExtension])  && !AjxUtil.isEmpty(this._currentObject.attrs[ZaGlobalConfig.A_zimbraMtaBlockedExtension])) {
			mods[ZaGlobalConfig.A_zimbraMtaBlockedExtension] = "";
		}		
	}

	//validate ephemeral backend url
	var backendLDAP = "ldap";
	var backendSSDB = "ssdb";
	var defaulValue = "//default";

	if (ZaItem.hasWritePermission(ZaGlobalConfig.A_zimbraEphemeralBackendURL, tmpObj)) {
		if (tmpObj.attrs[ZaGlobalConfig.A_zimbraEphemeralBackendURL]) {
			var backendURL = tmpObj.attrs[ZaGlobalConfig.A_zimbraEphemeralBackendURL];
			var chunks = backendURL.split(":");
			
			if (chunks < 2 || chunks > 3) {
				throw new AjxException(AjxMessageFormat.format(ZaMsg.ERROR_INVALID_BACKEND_URL, [backendURL]), AjxException.INVALID_PARAM, "ZaGlobalConfigViewController.prototype._saveChanges");
			}

			//check two or more adjacent colon, colon is at the begin/end of the URL
			for (var i = 0; i < chunks.length; i++) {
				if (chunks[i].length == 0) {
					throw new AjxException(AjxMessageFormat.format(ZaMsg.ERROR_INVALID_BACKEND_URL, [backendURL]), AjxException.INVALID_PARAM, "ZaGlobalConfigViewController.prototype._saveChanges");
				}
			}

			if (chunks.length == 2) {
				if (chunks[0] == backendLDAP) {
					if (chunks.length == 2 && chunks[1] != defaulValue) {
						throw new AjxException(AjxMessageFormat.format(ZaMsg.ERROR_INVALID_BACKEND_URL, [backendURL]), AjxException.INVALID_PARAM, "ZaGlobalConfigViewController.prototype._saveChanges");
					}
				}

				if (chunks[0] == backendSSDB) {
					throw new AjxException(AjxMessageFormat.format(ZaMsg.ERROR_INVALID_BACKEND_URL, [backendURL]), AjxException.INVALID_PARAM, "ZaGlobalConfigViewController.prototype._saveChanges");
				}
			} else {	//chunks.length == 3
				var isIPOrHostName = false;
				//check valid ip or host name
				if (!ZaGlobalConfigViewController.isValidHostName(chunks[1])) {
					isIPOrHostName = false;
				}

				// In case of localhost, lets not verify IPV4
				if (chunks[1] === 'localhost') {
					isIPOrHostName = true;
				}

				if (!isIPOrHostName) {
					try {
						var exIPData = ZaIPUtil.isIPV4(chunks[1]);
						isIPOrHostName = true;
					} catch (ex) {
						isIPOrHostName = false;
					}
				}

				if (!isIPOrHostName) {
					throw new AjxException(AjxMessageFormat.format(ZaMsg.ERROR_INVALID_BACKEND_URL, [backendURL]), AjxException.INVALID_PARAM, "ZaGlobalConfigViewController.prototype._saveChanges");
				}

				//check valid port
				if (!AjxUtil.isInt(chunks[2])) {
					throw new AjxException(AjxMessageFormat.format(ZaMsg.ERROR_INVALID_BACKEND_URL, [backendURL]), AjxException.INVALID_PARAM, "ZaGlobalConfigViewController.prototype._saveChanges");
				}
			}
		} else {
			throw new AjxException(AjxMessageFormat.format(ZaMsg.ERROR_EMPTY_BACKEND_URL, [backendURL]), AjxException.INVALID_PARAM, "ZaGlobalConfigViewController.prototype._saveChanges");
		}
	}

	//save the model
    if (this._currentObject[ZaModel.currentTab]!= tmpObj[ZaModel.currentTab])
             this._currentObject[ZaModel.currentTab] = tmpObj[ZaModel.currentTab];
	//var changeDetails = new Object();
	this._currentObject.modify(mods,tmpObj);

    // skin modification needs to restart server
    if(mods.hasOwnProperty(ZaGlobalConfig.A_zimbraSkinForegroundColor)
            ||  mods.hasOwnProperty(ZaGlobalConfig.A_zimbraSkinBackgroundColor)
            ||  mods.hasOwnProperty(ZaGlobalConfig.A_zimbraSkinSecondaryColor)
            ||  mods.hasOwnProperty(ZaGlobalConfig.A_zimbraSkinSelectionColor)
            ||  mods.hasOwnProperty(ZaGlobalConfig.A_zimbraSkinLogoURL)
            ||  mods.hasOwnProperty(ZaGlobalConfig.A_zimbraSkinLogoLoginBanner)
            ||  mods.hasOwnProperty(ZaGlobalConfig.A_zimbraSkinLogoAppBanner)
            ) {
            	try {
            		var mbxSrvrs = ZaApp.getInstance().getMailServers();
            		var serverList = [];
            		var cnt = mbxSrvrs.length;
            		for(var i=0; i<cnt; i++) {
            			if(ZaItem.hasRight(ZaServer.FLUSH_CACHE_RIGHT,mbxSrvrs[i])) {
            				serverList.push(mbxSrvrs[i]);
            			}
            		}

            		if(serverList.length > 0) {
						ZaApp.getInstance().dialogs["confirmMessageDialog2"].setMessage(ZaMsg.Domain_flush_cache_q, DwtMessageDialog.INFO_STYLE);
						ZaApp.getInstance().dialogs["confirmMessageDialog2"].registerCallback(DwtDialog.YES_BUTTON, this.openFlushCacheDlg, this, [serverList]);
						ZaApp.getInstance().dialogs["confirmMessageDialog2"].registerCallback(DwtDialog.NO_BUTTON, this.closeCnfrmDelDlg, this, null);
						ZaApp.getInstance().dialogs["confirmMessageDialog2"].popup();
            		}

            	} catch (ex) {
                    this._handleException(ex, "ZaGlobalConfigViewController.prototype._saveChange", null, false);
                    return false;
            	}

    }
    ZaApp.getInstance().getAppCtxt().getAppController().setActionStatusMsg(ZaMsg.GlobalConfigModified);
	return true;
}

ZaGlobalConfigViewController.isValidHostName =
function (isHostNameStr) {
	if (!isHostNameStr) {
		return false;
	}
    
	//Invalid host name that has two or more adjacent dot, dot is at index 0 or at the end of host name
	var chunks = isHostNameStr.split(".");
	for (var i = 0; i < isHostNameStr.length; i++) {
		if (isHostNameStr[i].length == 0) {
			return false;
		}
	}
	
	if(AjxUtil.isHostName(isHostNameStr)) {
		return true;
	}
	return false;
}

ZaGlobalConfigViewController.prototype.validateMyNetworks = ZaServerController.prototype.validateMyNetworks;
ZaXFormViewController.preSaveValidationMethods["ZaGlobalConfigViewController"].push(ZaGlobalConfigViewController.prototype.validateMyNetworks);

ZaGlobalConfigViewController.prototype.openFlushCacheDlg =
function (serverList) {
	ZaApp.getInstance().dialogs["confirmMessageDialog2"].popdown();
	
	serverList._version = 1;
	var uuid = [];
	for(var i=0;i<serverList.length;i++) {
		serverList[i]["status"] = 0;
		uuid.push(serverList[i].id)
	}
	obj = {statusMessage:null,flushZimlet:false,flushSkin:true,flushLocale:false,serverList:serverList,status:0, _uuid:(uuid.length > 1 ? uuid.join("__") : uuid[0]), name:(uuid.length > 1 ? ZaMsg.multiple_servers : serverList[0].name)};
	ZaApp.getInstance().dialogs["flushCacheDialog"] = new ZaFlushCacheXDialog(this._container, {id:(uuid.length > 1 ? uuid.join("__") : uuid[0]), name:(uuid.length > 1 ? ZaMsg.multiple_servers : serverList[0].name)});
	ZaApp.getInstance().dialogs["flushCacheDialog"].setObject(obj);
	ZaApp.getInstance().dialogs["flushCacheDialog"].popup();
}

ZaGlobalConfigViewController.getMTARestCustomAttributes = function(savedMtaRestAttrArr) {

	var zimbraMtaRestAttr = ZaGlobalConfig.MTA_RESTRICTIONS;
	var zimbraMtaRestExtraAttr = ['policy_service','reject_rbl_client','reject_rhsbl_client','reject_rhsbl_reverse_client','reject_rhsbl_sender'];

	// Get all defined zimbraMtaRestriction attributes .
	zimbraMtaRestAttr = AjxUtil.mergeArrays(zimbraMtaRestAttr,zimbraMtaRestExtraAttr);
	var _len = savedMtaRestAttrArr.length;
	var zimbraMtaRestAttrStr  =   AjxStringUtil.getAsString(zimbraMtaRestAttr);

	/*Get the  custom MTA Rest. attr. and add them to the request body of modifyConfigRequest.
	 Server MTA Rest. attr. which are not in zimbra defined attr are customized one.
	 Parse the saved attr. and compare it with zimbra defined attr, if it doesnot match, the attr. is customized one. */

	var mtaRestCustomAttrArr = [];
	for (var i = 0; i < _len; i++) {
		var savedMtaRestAttr = savedMtaRestAttrArr[i];
		var savedMtaRestAttrName = savedMtaRestAttr.substring(0,savedMtaRestAttr.indexOf(' ')); //  zimbra attr having array values
		if ( zimbraMtaRestAttrStr.indexOf(savedMtaRestAttr) === -1 &&  zimbraMtaRestExtraAttr.indexOf(savedMtaRestAttrName) === -1) { // getting the customised attribute, excluding  zimbra attr which have array values
			mtaRestCustomAttrArr.push(savedMtaRestAttr);
		}
	}
	return mtaRestCustomAttrArr ;
};

ZaGlobalConfigViewController.prototype.setSortOrder = 
function (sortOrder) {
	this._currentSortOrder = sortOrder;
}

ZaGlobalConfigViewController.prototype.getSortOrder = 
function () {
	return this._currentSortOrder;
}
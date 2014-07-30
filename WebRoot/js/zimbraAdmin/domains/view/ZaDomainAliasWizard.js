/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2011, 2014 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2010, 2011, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */
/**
* @class ZaDomainAliasWizard
* @contructor ZaDomainAliasWizard
* @author Charles Cao
* @param parent
* param app
**/
ZaDomainAliasWizard = function(parent, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, null, title, w, h);
	this._containedObject = {};
	this.initForm(ZaDomain.myXModel, this.getMyXForm());
    this._helpURL = ZaDomainAliasWizard.helpURL;
}

ZaDomainAliasWizard.prototype = new ZaXDialog;
ZaDomainAliasWizard.prototype.constructor = ZaDomainAliasWizard;
ZaDomainAliasWizard.helpURL = location.pathname + ZaUtil.HELP_URL + "managing_domains/creating_a_domain_alias.htm?locid="+AjxEnv.DEFAULT_LOCALE;


ZaDomainAliasWizard.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:1,
		items:[
          {type:_GROUP_,isTabGroup:true, items: [ //allows tab key iteration
                {ref:ZaDomain.A_domainName, type: _TEXTFIELD_, label:ZaMsg.LBL_domainAlias,
                    width: 250, visibilityChecks:[],enableDisableChecks:[]},
                {ref:ZaDomain.A2_zimbraDomainAliasTarget, type:_DYNSELECT_,
					inputWidth: 250,   emptyText:ZaMsg.enterSearchTerm,	
                    label: ZaMsg.LBL_targetDomain, toolTipContent:ZaMsg.tt_StartTypingDomainName,
                    dataFetcherMethod:ZaSearch.prototype.dynSelectSearchOnlyDomains,
                    dataFetcherClass:ZaSearch,editable:true,
                    visibilityChecks:[],enableDisableChecks:[]}
            ]
          }
        ]
	};
	return xFormObject;
}


///////////////////////////////////////////////////////////////////////////////

ZaDomainAliasEditWizard = function(parent, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, null, title, w, h);
	this._containedObject = {};
	this.initForm(ZaDomain.myXModel, this.getMyXForm());
    this._helpURL = ZaDomainAliasEditWizard.helpURL;
}

ZaDomainAliasEditWizard.prototype = new ZaXDialog;
ZaDomainAliasEditWizard.prototype.constructor = ZaDomainAliasEditWizard;
ZaDomainAliasEditWizard.helpURL = location.pathname + ZaUtil.HELP_URL + "managing_domains/creating_a_domain_alias.htm?locid="+AjxEnv.DEFAULT_LOCALE;


ZaDomainAliasEditWizard.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:1,
		items:[
          {type:_GROUP_,isTabGroup:true, items: [ //allows tab key iteration
                {ref:ZaDomain.A_domainName, type: _OUTPUT_, label:ZaMsg.LBL_domainAlias,
                    width: 250, visibilityChecks:[],enableDisableChecks:[]},
                {ref:ZaDomain.A2_zimbraDomainAliasTarget, type:_DYNSELECT_,
					inputWidth: 250,   emptyText:ZaMsg.enterSearchTerm,	
                    label: ZaMsg.LBL_targetDomain, toolTipContent:ZaMsg.tt_StartTypingDomainName,
                    dataFetcherMethod:ZaSearch.prototype.dynSelectSearchDomains,
                    dataFetcherClass:ZaSearch,editable:true,
                    visibilityChecks:[],enableDisableChecks:[]}
            ]
          }
        ]
	};
	return xFormObject;
}

ZaDomainAliasEditWizard.prototype.editDomainAlias = function (domain, reload) {
    var form  = this._localXForm ;
    var instance = form.getInstance () ;

    if (reload) domain.load ("id", domain.id) ;

    var domainAlias = domain.attrs[ZaDomain.A_domainName] ;
    var domainTarget = domain.attrs[ZaDomain.A_zimbraMailCatchAllForwardingAddress] ;

    if (domainTarget!= null) {
        domainTarget = domainTarget.replace("@", "") ;
    }

    if (!instance) instance = {} ;
    if (!instance.attrs) instance.attrs = {} ;
    instance.attrs [ZaDomain.A_domainName] = domainAlias ;
    instance [ZaDomain.A2_zimbraDomainAliasTarget] = domainTarget ;
    instance.type = ZaItem.DOMAIN;
    instance.attrs[ZaDomain.A_domainType] =  ZaDomain.domainTypes.alias;
    instance.attrs[ZaDomain.A_zimbraMailCatchAllForwardingAddress] =  "@" + domainTarget ;
    this.setObject (domain) ;
    form.setInstance (instance);
    this.registerCallback(DwtDialog.OK_BUTTON,
            ZaDomain.prototype.modifyDomainAlias, domain,
            this._localXForm);
    this.popup ();
}


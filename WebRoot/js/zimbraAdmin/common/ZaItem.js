/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaItem
* @param app reference to the application instance
**/
ZaItem = function(iKeyName) {
	if (arguments.length == 0) return;
	this._iKeyName = iKeyName;
    this._uuid = ZaUtil.getItemUUid();
    this.rightsLoaded = false;
	ZaModel.call(this, true);

}

ZaItem.prototype = new ZaModel;
ZaItem.prototype.constructor = ZaItem;

ZaItem.loadMethods = new Object();
ZaItem.initMethods = new Object();
ZaItem.modifyMethods = new Object();
ZaItem.modifyMethodsExt = new Object();
ZaItem.createMethods = new Object();
ZaItem.removeMethods = new Object();
ZaItem.modelExtensions = new Object();
ZaItem.getRelatedMethods = new Object();

ZaItem.ACCOUNT = "account";
ZaItem.DATASOURCE = "dataSource";
ZaItem.DL = "dl";
ZaItem.GROUP = "grp";
ZaItem.ALIAS = "alias";
ZaItem.RESOURCE = "calresource";
ZaItem.DOMAIN = "domain";
ZaItem.COS = "cos";
ZaItem.GLOBAL_CONFIG = "config";
ZaItem.GLOBAL_GRANT = "global";
ZaItem.SERVER = "server";
ZaItem.STATS = "stats";
ZaItem.ZIMLET = "zimlet";
ZaItem.MAILQ_ITEM = "message";
ZaItem.MAILQ = "mailque";
ZaItem.HOME = "home";
ZaItem.A_objectClass = "objectClass";
ZaItem.A_zimbraId = "zimbraId";
ZaItem.A_cn = "cn" ;
ZaItem.A_zimbraACE = "zimbraACE";
ZaItem.A_zimbraCreateTimestamp = "zimbraCreateTimestamp";

/* Translation of  the attribute names to the screen names */
ZaItem._ATTR = new Object();
ZaItem._ATTR[ZaItem.A_zimbraId] = ZaMsg.attrDesc_zimbraId;

ZaItem.ID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

ZaItem.prototype.toString = 
function() {
	if(this.name)
		return this.name;
	else if (this.id)
		return this.id;
	else
		return "ZaItem "+this.type+": name="+this.name+" id="+this.id;
}

ZaItem.compareNamesAsc = 
function(a,b) {
	var al = a.name.toLowerCase();
	var bl = b.name.toLowerCase();

	if (al < bl)
		return -1;
	if (al > bl)
		return 1;
	else
		return 0;
}

ZaItem.compareNamesDesc = 
function(a,b) {
	var al = a.name.toLowerCase();
	var bl = b.name.toLowerCase();

	if (al < bl)
		return 1;
	if (al > bl)
		return -1;
	else
		return 0;
}

ZaItem.compareDescription = 
function(a,b) {
	return ZaItem.compareAttr(a,b,"description");
}

ZaItem.compareAttr = 
function(a, b, attr) {
    if (a.attrs[attr] == null) {
        return -1 ;
    }

    if (b.attrs[attr] == null) {
        return 1 ;    
    }

	if (a.attrs[attr] < b.attrs[attr])
		return -1;
	if (a.attrs[attr] > b.attrs[attr])
		return 1;
	else
		return 0;
}

ZaItem.compareAttrAsc = ZaItem.compareAttr

ZaItem.compareAttrDesc =
function(a, b, attr) {
	if (a.attrs[attr] == null) {
        return 1 ;
    }

    if (b.attrs[attr] == null) {
        return -1 ;    
    }

    if (a.attrs[attr] < b.attrs[attr])
		return 1;
	if (a.attrs[attr] > b.attrs[attr])
		return -1;
	else
		return 0;
}


/**
* Item Factory
**/
ZaItem.getFromType = 
function (type) {
	switch (type) {
		case ZaItem.ACCOUNT:
			return new ZaAccount();

		case ZaItem.ALIAS:
			return new ZaAlias();

		case ZaItem.DL:
            return new ZaDistributionList();

		case ZaItem.RESOURCE:
			return new ZaResource();
		
		case ZaItem.DOMAIN:
			return new ZaDomain();

		case ZaItem.COS:
			return new ZaCos();

		case ZaItem.SERVER:
			return new ZaServer();

		case ZaItem.MAILQ:
			return new ZaMTA();
		
		case ZaItem.DATASOURCE:
			return new ZaDataSource();

	}
}

ZaItem.prototype.remove = 
function () {
	//Instrumentation code start
	if(ZaItem.removeMethods[this._iKeyName]) {
		var methods = ZaItem.removeMethods[this._iKeyName];
		var cnt = methods.length;
		for(var i = 0; i < cnt; i++) {
			if(typeof(methods[i]) == "function") {
				methods[i].call(this);
			}
		}
	}	
	//Instrumentation code end
}


ZaItem.prototype.refresh = 
function (skipRights,expandDefaults) {
	this.load(this.id ? "id" : null, this.id ? this.id : null,skipRights,expandDefaults);
}

ZaItem.prototype.getRelatedList =
function (parentPath) {
	//Instrumentation code start
    var ret = [];
	if(ZaItem.getRelatedMethods[this._iKeyName]) {
		var methods = ZaItem.getRelatedMethods[this._iKeyName];
		var cnt = methods.length;
		for(var i = 0; i < cnt; i++) {
			if(typeof(methods[i]) == "function") {
				ret = ret.concat(methods[i].call(this, parentPath));
			}
		}
	}
    return ret;
	//Instrumentation code end
}

ZaItem.prototype.copyTo = 
function (target, fullRecursion, maxRecursion, currentRecLevel) {
	if(!currentRecLevel) {
		currentRecLevel = 1;
	} else {
		currentRecLevel++;
	}
	if(!maxRecursion) {
		maxRecursion = 4;
	}
	for(var a in this) {
		if (this[a] == null || this[a] == undefined) {
			target[a] = null;
		} else if(fullRecursion && (currentRecLevel <= maxRecursion)) {
			if(this[a] instanceof Array) {
				target[a] = [];
				ZaItem.prototype.copyTo.call(this[a],target[a],fullRecursion,maxRecursion, currentRecLevel)
			} else if(typeof(this[a]) == "object") {
				target[a] = {};
				ZaItem.prototype.copyTo.call(this[a],target[a],fullRecursion,maxRecursion, currentRecLevel)
			} else {
				target[a] = this[a];
			}
		} else {
			target[a] = this[a];
		}
	}
}

ZaItem.prototype.parseTargetsRightsFromJS = function(targetObj) {
	if(targetObj) {
		this.noAttrsAvailable = true;
		this.rights = {};
		if(targetObj.right && targetObj.right instanceof Array) {
			var rights = targetObj.right;
			for(var r in rights) {
				this.rights[rights[r].n] = true;
			}
		}
		
		if(targetObj.id)
			this.id = targetObj.id;
		
		if(targetObj.name)
			this.name = targetObj.name;

		if(!this._defaultValues)
			this._defaultValues = {attrs:{}};

		if(!this.getAttrs)
			this.getAttrs = {};

		if(!this.setAttrs)
			this.setAttrs = {};
		
		if(AjxUtil.isEmpty(targetObj.getAttrs) && AjxUtil.isEmpty(targetObj.setAttrs)) {
			this.getAttrs = null;
			return;
		}
		this.attrsToGet = [];									
		if(targetObj.getAttrs && targetObj.getAttrs instanceof Array && 
			targetObj.getAttrs[0]) {
			if(targetObj.getAttrs[0].a && targetObj.getAttrs[0].a instanceof Array) {
				var getAttrs = targetObj.getAttrs[0].a;
				this.noAttrsAvailable = false;
				for (var a in getAttrs) {
					this.getAttrs[getAttrs[a].n] = true;
					this.attrsToGet.push(getAttrs[a].n);
					if(getAttrs[a]["default"] && getAttrs[a]["default"][0] && getAttrs[a]["default"][0].v && getAttrs[a]["default"][0].v instanceof Array) {
						var cnt = getAttrs[a]["default"][0].v.length; 
						if(cnt == 1) {
							if((getAttrs[a].n == ZaDomain.A_zimbraFreebusyExchangeAuthPassword) &&
								(getAttrs[a]["default"][0].v[0]._content == "VALUE-BLOCKED")) {
								/* Value was replaced in SOAP response.  Treat as empty string so that it is clear it
								 * needs to be typed again before using "Check the settings" */
								this._defaultValues.attrs[getAttrs[a].n] = "";
							} else {
								this._defaultValues.attrs[getAttrs[a].n] = getAttrs[a]["default"][0].v[0]._content;
							}
						} else if (cnt >1) {
							this._defaultValues.attrs[getAttrs[a].n] = new Array();
							for(var i = 0; i<cnt;i++) { 
								this._defaultValues.attrs[getAttrs[a].n][i] = getAttrs[a]["default"][0].v[i]._content;
							}
						}
					}
				}
				if(!getAttrs[ZaItem.A_zimbraId] ) {
					this.attrsToGet.push(ZaItem.A_zimbraId);
				}				
			} 
			if (targetObj.getAttrs[0].all){
				this.getAttrs.all = true;
				this.noAttrsAvailable = false; 	
			}
		} 
				
		if(targetObj.setAttrs && targetObj.setAttrs instanceof Array && 
			targetObj.setAttrs[0]) {
				
			if(targetObj.setAttrs[0].a && targetObj.setAttrs[0].a instanceof Array) {
				var setAttrs = targetObj.setAttrs[0].a;
				if(!this.getAttrs)
					this.getAttrs = {};
					
				this.noAttrsAvailable = false;
				for (var a in setAttrs) {
					this.setAttrs[setAttrs[a].n] = true;
					this.getAttrs[setAttrs[a].n] = true;
					if(setAttrs[a]["default"] && setAttrs[a]["default"][0] && setAttrs[a]["default"][0].v && setAttrs[a]["default"][0].v instanceof Array) {
						var cnt = setAttrs[a]["default"][0].v.length; 
						if(cnt==1) {
							this._defaultValues.attrs[setAttrs[a].n] = setAttrs[a]["default"][0].v[0]._content;
						} else if (cnt > 1) {
							this._defaultValues.attrs[setAttrs[a].n] = new Array();
							for(var i = 0; i<cnt;i++) { 
								this._defaultValues.attrs[setAttrs[a].n][i] = setAttrs[a]["default"][0].v[i]._content;
							}
						}
					}
				}
			} 
			if(targetObj.setAttrs[0].all) {
				this.noAttrsAvailable = false;
				this.setAttrs.all = true;
				this.getAttrs.all = true; 	
			}
		} 
	}
	this.rightsLoaded = true;
}

ZaItem.prototype.initEffectiveRightsFromJS = function(resp) {
	this._defaultValues = {attrs:{}};
	if(resp && resp.target && resp.target instanceof Array) {
		this.parseTargetsRightsFromJS(resp.target[0]);
	}
}

ZaItem.prototype.loadEffectiveRights = function (by, val, expandDefaults, callback) {
	if(!this.type)
		return;

	if(AjxUtil.isUndefined(val) || AjxUtil.isNull(val))
		val = "";

	try {
		if(callback) {
			this._getEffectiveRights(by, val, expandDefaults, callback);
		} else {
			var resp = this._getEffectiveRights(by, val, expandDefaults, callback);
			this.initEffectiveRightsFromJS(resp);
		}
	} catch (ex) {
		throw (ex);
	}
}

ZaItem.RightCache = [];
ZaItem.getCacheName = function (by, val, type, expandDefaults) {
    var cacheName = by + val + " " + type;
    if (expandDefaults)
        cacheName = cacheName + "TRUE";
    else
        cacheName = cacheName + "FALSE";
    return cacheName;
}

ZaItem.inCacheProcess = function (val) {
    if (!val)
        return false;

    return ZaSettings.initializing;
}

ZaItem.prototype._getEffectiveRights = function (by, val, expandDefaults, callback) {
	var cacheName = ZaItem.getCacheName(by, val, this.type, expandDefaults);
    var inCacheProcess =  ZaItem.inCacheProcess(val);
    var resp;
    if (((!ZaItem.RightCache[cacheName])&&inCacheProcess) || !inCacheProcess) {
        var soapDoc = AjxSoapDoc.create("GetEffectiveRightsRequest", ZaZimbraAdmin.URN, null);
        if(expandDefaults) {
            soapDoc.setMethodAttribute("expandAllAttrs","getAttrs");
        }

        var elTarget = soapDoc.set("target", val);

        if(!AjxUtil.isEmpty(by))
            elTarget.setAttribute("by",by);

        elTarget.setAttribute("type",this.type);

        var elGrantee = soapDoc.set("grantee", ZaZimbraAdmin.currentUserId);
        elGrantee.setAttribute("by","id");

        var csfeParams = new Object();
        csfeParams.soapDoc = soapDoc;
        csfeParams.asyncMode = callback ? true : false;
        csfeParams.callback =  callback ? callback : null;
        
        var reqMgrParams = {} ;
        reqMgrParams.controller = (ZaApp.getInstance() && ZaApp.getInstance().getCurrentController()) ? ZaApp.getInstance().getCurrentController() : null;
        reqMgrParams.busyMsg = ZaMsg.BUSY_REQUESTING_ACCESS_RIGHTS ;
        
        try {
        	if(callback) {
        		ZaRequestMgr.invoke(csfeParams, reqMgrParams);
        	} else {
        		resp = ZaRequestMgr.invoke(csfeParams, reqMgrParams).Body.GetEffectiveRightsResponse;
                if (inCacheProcess) {
                    ZaItem.RightCache[cacheName]= resp;
                }
        	}
        } catch (ex) {
            throw (ex);
        }

    } else {
        resp = ZaItem.RightCache[cacheName];
    }
    return resp;
}

ZaItem.prototype.loadNewObjectDefaults = function (domainBy, domain, cosBy, cos) {
	if(!this.type)
		return;
		
	var soapDoc = AjxSoapDoc.create("GetCreateObjectAttrsRequest", ZaZimbraAdmin.URN, null);
	var elTarget = soapDoc.set("target", "");
	elTarget.setAttribute("type",this.type);	

	
	if(!AjxUtil.isEmpty(domain) && !AjxUtil.isEmpty(domainBy)) {
		var elDomain = soapDoc.set("domain", domain);
		elDomain.setAttribute("by",domainBy);
	}

	if(!AjxUtil.isEmpty(cos) && !AjxUtil.isEmpty(cosBy)) {
		var elCos = soapDoc.set("cos", cos);
		elCos.setAttribute("by",cosBy);
	}
	
	var csfeParams = new Object();
	csfeParams.soapDoc = soapDoc;	
	var reqMgrParams = {} ;
	reqMgrParams.controller = (ZaApp.getInstance() && ZaApp.getInstance().getCurrentController()) ? ZaApp.getInstance().getCurrentController() : null;
	reqMgrParams.busyMsg = ZaMsg.BUSY_REQUESTING_ACCESS_RIGHTS ;
	try {
		var resp = ZaRequestMgr.invoke(csfeParams, reqMgrParams ).Body.GetCreateObjectAttrsResponse;
		this.parseTargetsRightsFromJS(resp);
	} catch (ex) {
		//not implemented yet
	}	
}

ZaItem.prototype.load = function (by, val, skipRights, expandDefaults) {
	by = by ? by : "id";
	val = val ? val : this.id;
	//load rights
	if(!skipRights) {
		this.rights = {};
		this.getAttrs = {};
		this.setAttrs = {};
		this.loadEffectiveRights(by,val,expandDefaults);
	}	
	if(this.noAttrsAvailable) {
		return;
	}	
	//Instrumentation code start
	if(ZaItem.loadMethods[this._iKeyName]) {
		var methods = ZaItem.loadMethods[this._iKeyName];
		var cnt = methods.length;
		for(var i = 0; i < cnt; i++) {
			if(typeof(methods[i]) == "function") {
				methods[i].call(this, by, val);
			}
		}
	}	
	//Instrumentation code end
}

/**
 * this - the current instance should be the old instance
 * @param mods: modified attributes
 * @param tmpObj: the new data object of the view
 */
ZaItem.prototype.modify = function (mods, tmpObj) {
	//Instrumentation code start
	if(ZaItem.modifyMethods[this._iKeyName]) {
		var methods = ZaItem.modifyMethods[this._iKeyName];
		var cnt = methods.length;
		for(var i = 0; i < cnt; i++) {
			if(typeof(methods[i]) == "function") {
				methods[i].call(this, mods, tmpObj);

			}
		}
	}	
	//Instrumentation code end
}



/**
* Factory method
* creates a new object of class constructorFunction, then passes the new object to every method in
* ZaItem.createMethods[key] 
* @see ZaItem#createMethods
**/
ZaItem.create = function (tmpObj, constructorFunction, key) {
	var item = new constructorFunction();
	//Instrumentation code start
	if(ZaItem.createMethods[key]) {
		var methods = ZaItem.createMethods[key];
		var cnt = methods.length;
		for(var i = 0; i < cnt; i++) {
			if(typeof(methods[i]) == "function") {
				methods[i].call(this, tmpObj, item);
			}
		}
	}	
	//Instrumentation code end
	return item;
}

ZaItem.prototype.initFromDom =
function(node) {
	this.name = node.getAttribute("name");
	this.id = node.getAttribute("id");
	this.attrs = new Object();
	if(!AjxUtil.isEmpty(node.nodeName))
		this.type = node.nodeName;
	
	var children = node.childNodes;
	var cnt = children.length;
	for (var i=0; i< cnt;  i++) {
		var child = children[i];
		if (child.nodeName != 'a') continue;
		var name = child.getAttribute("n");
		var pd = child.getAttribute("pd");
		if(pd && pd==1)
			continue;
			
		if (child.firstChild != null) {
			var value = child.firstChild.nodeValue;
			if (name in this.attrs) {
				var vc = this.attrs[name];
				if ((typeof vc) == "object") {
					vc.push(value);
				} else {
					this.attrs[name] = [vc, value];
				}
			} else {
				this.attrs[name] = value;
			}
		}
	}
}

ZaItem.prototype.initFromJS = 
function (obj) {
	if(!obj)
		return;

	if(obj.name)	
		this.name = obj.name;

	if(obj.id)
		this.id = obj.id;

	if (obj.isgroup == false) {
		this.isgroup = 0 ;
	}else if (obj.isgroup == true){
		this.isgroup = 1 ;
	}
	this.attrs = new Object();
	if(obj.a) {
		var len = obj.a.length;
		for(var ix = 0; ix < len; ix++) {
			if(obj.a[ix].pd)
				continue;
				
			if(!this.attrs[[obj.a[ix].n]]) {
				this.attrs[[obj.a[ix].n]] = obj.a[ix]._content;
			}else {
				if(!(this.attrs[[obj.a[ix].n]] instanceof Array)) {
					this.attrs[[obj.a[ix].n]] = [this.attrs[[obj.a[ix].n]]];
				} 
				this.attrs[[obj.a[ix].n]].push(obj.a[ix]._content);
			}
		}
	}
	if(obj._attrs) {
		for (var ix in obj._attrs) {
			if(obj._attrs[ix].pd)
				continue;
							
			if(!this.attrs[ix]) {
				this.attrs[ix] = obj._attrs[ix];
			} else {
				if(!(this.attrs[ix] instanceof Array)) {
					this.attrs[ix] = [this.attrs[ix]];
				} 
				this.attrs[ix].push(obj._attrs[ix]);
			}
		}
	}
	if(!this.attrs[ZaAccount.A_description])
		this.attrs[ZaAccount.A_description] = [];
		
	if(!(this.attrs[ZaAccount.A_description] instanceof Array)) {
		this.attrs[ZaAccount.A_description] = [this.attrs[ZaAccount.A_description]];
	}	
	
	if(!this.attrs[ZaItem.A_zimbraId] && this.id) {
		this.attrs[ZaItem.A_zimbraId] = this.id;
	}	
}

ZaItem.initAttrsFromJS =
function (obj) {
	if(!obj)
		return;

    var attrs = {} ;
	if(obj.a) {
		var len = obj.a.length;
		for(var ix = 0; ix < len; ix++) {
			if(obj.a[ix].pd)
				continue;
			
			if(!attrs[[obj.a[ix].n]]) {
				attrs[[obj.a[ix].n]] = obj.a[ix]._content;
			}else {
				if(!(attrs[[obj.a[ix].n]] instanceof Array)) {
					attrs[[obj.a[ix].n]] = [attrs[[obj.a[ix].n]]];
				}
				attrs[[obj.a[ix].n]].push(obj.a[ix]._content);
			}
		}
	}
	if(obj._attrs) {
		for (var ix in obj._attrs) {
			if(obj._attrs[ix].pd)
				continue;
							
			if(!attrs[ix]) {
				attrs[ix] = obj._attrs[ix];
			} else {
				if(!(attrs[ix] instanceof Array)) {
					attrs[ix] = [attrs[ix]];
				}
				attrs[ix].push(obj._attrs[ix]);
			}
		}
	}

    return attrs ;
}


// Adds a row to the tool tip.
ZaItem.prototype._addRow =
function(msg, value, html, idx) {
	if (value != null) {
		html[idx++] = "<tr valign='top'><td align='right' style='padding-right: 5px;'><b>";
		html[idx++] = AjxStringUtil.htmlEncode(msg);
		html[idx++] = "</b></td><td align='left'><div style='white-space:nowrap; overflow:hidden;'>";
		html[idx++] = AjxStringUtil.htmlEncode(value);
		html[idx++] = "</div></td></tr>";
	}
	return idx;
}

// Adds a row to the tool tip.
ZaItem.prototype._addAttrRow =
function(name, html, idx) {
	var value = this.attrs[name];
	if (value != null) {
		var desc = ZaItem._attrDesc(name);
		html[idx++] = "<tr valign='top'><td align='left' style='padding-right: 5px;'><b>";
		html[idx++] = AjxStringUtil.htmlEncode(desc) + ":";
		html[idx++] = "</b></td><td align='left'><div style='white-space:nowrap; overflow:hidden;'>";
		html[idx++] = AjxStringUtil.htmlEncode(value);
		html[idx++] = "</div></td></tr>";
	}
	return idx;
}

ZaItem._attrDesc = 
function(name) {
	var desc = ZaItem._ATTR[name];
	return (desc == null) ? name : desc;
}

ZaItem.prototype._init = function () {
	//Instrumentation code start
	if(ZaItem.initMethods[this._iKeyName]) {
		var methods = ZaItem.initMethods[this._iKeyName];
		var cnt = methods.length;
		for(var i = 0; i < cnt; i++) {
			if(typeof(methods[i]) == "function") {
				methods[i].call(this);
			}
		}
	}	
	//Instrumentation code end
}

/**
* @param newAlias
* addAlias adds one alias to the account. Adding each alias takes separate Soap Request
**/
ZaItem.prototype.addAlias = 
function (newAlias) {
	var soapCmd  ;
	switch(this.type) {
		case ZaItem.ACCOUNT: soapCmd = "AddAccountAliasRequest" ; break ;
		case ZaItem.RESOURCE: soapCmd = "AddAccountAliasRequest" ; break ;
		case ZaItem.DL: soapCmd = "AddDistributionListAliasRequest" ; break ;
		default: throw new Error("Can't add alias for account type: " + this.type) ;				
	}
	
	var soapDoc = AjxSoapDoc.create(soapCmd, ZaZimbraAdmin.URN, null);
	soapDoc.set("id", this.id);
	soapDoc.set("alias", newAlias);	
	
	//var command = new ZmCsfeCommand();
	var params = new Object();
	params.soapDoc = soapDoc;	
	var reqMgrParams = {
		controller : ZaApp.getInstance().getCurrentController(),
		busyMsg : ZaMsg.BUSY_ADD_ALIAS
	}
	ZaRequestMgr.invoke(params, reqMgrParams);
}

/**
* @param aliasToRemove
* addAlias adds one alias to the account. Adding each alias takes separate Soap Request
**/
ZaItem.prototype.removeAlias = 
function (aliasToRemove) {
	var soapCmd  ;
	
	switch(this.type) {
		case ZaItem.ACCOUNT: soapCmd = "RemoveAccountAliasRequest" ; break ;
		case ZaItem.DL: soapCmd = "RemoveDistributionListAliasRequest" ; break ;
		default: throw new Error("Can't add alias for account type: " + account.type) ;				
	}

	var soapDoc = AjxSoapDoc.create(soapCmd, ZaZimbraAdmin.URN, null);
	soapDoc.set("id", this.id);
	soapDoc.set("alias", aliasToRemove);	
	//var command = new ZmCsfeCommand();
	var params = new Object();
	params.soapDoc = soapDoc;	
	var reqMgrParams = {
		controller : ZaApp.getInstance().getCurrentController(),
		busyMsg : ZaMsg.BUSY_REMOVE_ALIAS
	}
	ZaRequestMgr.invoke(params, reqMgrParams);	
}

ZaItem.checkInteropSettings  =
function () {

    var controller =  ZaApp.getInstance().getCurrentController() ;

    try {
        //bug 29424 - save the settings before the check
//        var oldSettingObj = controller._currentObject  ;
//        ZaItem.checkFBSettings (oldSettingObj, currentSettingObj, controller) ;
        var currentSettingObj = this.getForm().getInstance() ;
        var defaultValues = currentSettingObj._defaultValues ; //it could be the global settings for domain

       //if(window.console && window.console.log) console.log("Checking the interop settings ...") ;
       var soapCmd  = "CheckExchangeAuthRequest";
       var soapDoc = AjxSoapDoc.create(soapCmd, ZaZimbraAdmin.URN, null);
       var authEl = soapDoc.set("auth", "") ;

        var attrNames = [ZaDomain.A_zimbraFreebusyExchangeURL, ZaDomain.A_zimbraFreebusyExchangeAuthScheme,
                             ZaDomain.A_zimbraFreebusyExchangeAuthUsername, ZaDomain.A_zimbraFreebusyExchangeAuthPassword ];

        for (var i=0; i < attrNames.length; i ++ ) {
           var n = attrNames [i] ;
           var value =  currentSettingObj.attrs[n] || defaultValues.attrs[n];
           if (value == null) {
               var errorMsg ;
               if (n == ZaDomain.A_zimbraFreebusyExchangeURL) {
                   errorMsg = ZaMsg.Error_missing_exchange_url ;
               } else if (n == ZaDomain.A_zimbraFreebusyExchangeAuthScheme) {
                   errorMsg = ZaMsg.Error_missing_scheme ;
               } else if (n == ZaDomain.A_zimbraFreebusyExchangeAuthUsername) {
                   errorMsg = ZaMsg.Error_missing_exchange_username ;
               } else if (n == ZaDomain.A_zimbraFreebusyExchangeAuthPassword) {
                   errorMsg = ZaMsg.Error_missing_exchange_password ;
               }
               controller.popupErrorDialog(errorMsg);
               return ;
           } else {
               var attrName ;
               if (n == ZaDomain.A_zimbraFreebusyExchangeURL) {
                   attrName = "url" ;
               } else if (n == ZaDomain.A_zimbraFreebusyExchangeAuthScheme) {
                    attrName = "scheme" ;
               } else if (n == ZaDomain.A_zimbraFreebusyExchangeAuthUsername) {
                   attrName = "user" ;
               } else if (n == ZaDomain.A_zimbraFreebusyExchangeAuthPassword) {
                   attrName = "pass" ;
               }
               authEl.setAttribute(attrName, value ) ;
           }
        }
  
        var params = new Object();
        params.soapDoc = soapDoc;
        var reqMgrParams = {
            controller : controller ,
            busyMsg : ZaMsg.BUSY_CHECKING_INTEROP_SETTINGS
        }
        var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.CheckExchangeAuthResponse;
        
        controller.popupMsgDialog(resp.code[0]._content + "<br />" + resp.message[0]._content) ;
    }catch (e) {
        controller._handleException(e)  ;
    }
}

ZaItem.clearInteropSettings = function () {
     var currentSettingObj = this.getForm().getInstance() ;
     var attrNames = [ZaDomain.A_zimbraFreebusyExchangeURL, ZaDomain.A_zimbraFreebusyExchangeAuthScheme,
                     ZaDomain.A_zimbraFreebusyExchangeAuthUsername, ZaDomain.A_zimbraFreebusyExchangeAuthPassword,
                     ZaDomain.A_zimbraFreebusyExchangeUserOrg ] ;

    for (var i=0; i < attrNames.length; i ++ ) {
        var n = attrNames [i] ;
        this.setInstanceValue("", n) ;
    }
    var form = this.getForm();
    form.parent.setDirty(true);
    form.refresh () ;
}

//Sometimes, the admin extensions needs to modify the object value before it is set
//We can add the modifer function in the extension and it will be called by the main program
ZaItem.ObjectModifiers = {} ;
ZaItem.prototype.modifyObject =
function () {
    if(ZaItem.ObjectModifiers[this._iKeyName]) {
		var methods = ZaItem.ObjectModifiers[this._iKeyName];
		var cnt = methods.length;
		for(var i = 0; i < cnt; i++) {
			if(typeof(methods[i]) == "function") {
				methods[i].call(this);
			}
		}
	}
}

/** It is used to get the object description property value.
 *  especially when it has multi-values
 *
 * @param desp
 */
ZaItem.initDescriptionItem = function () { 
    ZaItem.descriptionModelItem =  {id:"description", type: _LIST_, ref:"attrs/description",
            listItem:{type:_STRING_}
        } ;

    ZaItem.descriptionXFormItem = {
        ref:"description",  msgName:ZaMsg.NAD_Description,
        label:ZaMsg.NAD_Description, labelLocation:_LEFT_, //cssClass:"admin_xform_name_input" ,
        labelCssStyle:"vertical-align:top",
        type:_REPEAT_,
        align:_LEFT_,
        repeatInstance:"",
        showAddButton:false,
        showRemoveButton:false,
        showAddOnNextRow:false,
       //    enableDisableChecks:[ZaItem.hasWritePermission] ,
       //    visibilityChecks:[ZaItem.hasReadPermission],
        items: [
            {ref:".", type:_TEXTFIELD_,
                enableDisableChecks:[ZaItem.hasWritePermission] ,
                visibilityChecks:[ZaItem.hasReadPermission],
                width:"30em"}
        ]
    } ;
}

ZaItem.initDescriptionItem();

ZaItem.getDescriptionValue = function (desp) {
    if ( !desp)  desp = "";
    
    if (desp instanceof Array) {
        desp = desp.toString ();
    }

    return desp ;
}

/**
 *
 * @param entry
 * @param attrName
 * @return an new array object with the each value deep copied
 */
ZaItem.deepCloneListItem = function (sourceValue) {
   if (sourceValue == null) {
       return [];
    } else if (! (sourceValue instanceof Array)) {
       return [sourceValue] ;
    } else {
       var val = [] ;
       for (var i = 0 ; i < sourceValue.length; i ++) {
            val.push (sourceValue[i]) ;
       }
       return val ;
   }
}

/**
 * Method of XFormItem
 */
ZaItem.hasReadPermission = function (refToCheck, instance) {
	if(ZaZimbraAdmin.currentAdminAccount.attrs[ZaAccount.A_zimbraIsAdminAccount] == 'TRUE')
		return true;
	
	if(!instance)
		instance = this.getInstance();
	
	if (!instance.getAttrs)
		return false;
	
	var refPath=null;
	if(refToCheck) {
		refPath=refToCheck;
	} else {
		if(!this.refPath)
			return true;
		else
			refPath=this.refPath;
	}
		
	return ((instance.getAttrs.all === true) || (instance.getAttrs[refPath] === true));
}
XFormItem.prototype.hasReadPermission = ZaItem.hasReadPermission;
OSelect1_XFormItem.prototype.visibilityChecks = [ZaItem.hasReadPermission];
Checkbox_XFormItem.prototype.visibilityChecks = [ZaItem.hasReadPermission];
Textfield_XFormItem.prototype.visibilityChecks = [ZaItem.hasReadPermission];
Select1_XFormItem.prototype.visibilityChecks = [ZaItem.hasReadPermission];
Repeat_XFormItem.prototype.visibilityChecks = [ZaItem.hasReadPermission];

/**
 * Method of XFormItem
 */
ZaItem.hasWritePermission = function (refToCheck,instance) {
	if(ZaZimbraAdmin.currentAdminAccount.attrs[ZaAccount.A_zimbraIsAdminAccount] == 'TRUE')
		return true;

	if(!instance)
		instance = this.getInstance();
	
	if (!instance.setAttrs)
		return false;
	
	var refPath=null;
	if(refToCheck) {
		refPath=refToCheck;
	} else {
		if(!this.refPath)
			return true;
		else
			refPath=this.refPath;
	}
		
	return ((instance.setAttrs.all === true) || (instance.setAttrs[refPath] === true));
}


XFormItem.prototype.hasWritePermission = ZaItem.hasWritePermission;
Textfield_XFormItem.prototype.enableDisableChecks = [ZaItem.hasWritePermission];
OSelect1_XFormItem.prototype.enableDisableChecks = [ZaItem.hasWritePermission];
Checkbox_XFormItem.prototype.enableDisableChecks = [ZaItem.hasWritePermission];
Select1_XFormItem.prototype.enableDisableChecks = [ZaItem.hasWritePermission];
Repeat_XFormItem.prototype.enableDisableChecks = [ZaItem.hasWritePermission];

/**
 * Method of XFormItem
 */
ZaItem.hasRight = function (right, instance) {
	if(ZaZimbraAdmin.currentAdminAccount.attrs[ZaAccount.A_zimbraIsAdminAccount] == 'TRUE')
		return true;
		
	if(!instance)
		instance = this.getInstance();

	if(!right)
		return true;
	
	if(!instance.rightsLoaded && instance.id && instance.loadEffectiveRights) {
		instance.loadEffectiveRights("id", instance.id, true);
	}
	
	if (!instance.rights)
		return false;
	
		
	return (instance.rights[right] === true);
}
XFormItem.prototype.hasRight = ZaItem.hasRight;

ZaItem.hasAnyRight = function (rights, instance) {
	if(ZaZimbraAdmin.currentAdminAccount.attrs[ZaAccount.A_zimbraIsAdminAccount] == 'TRUE')
		return true;

	if(!instance)
		instance = this.getInstance();

	if (!instance.rights)
		return false;

    if (!rights)
        return true;

    if (!rights instanceof Array)
        rights = [rights];

    for (var i = 0; i < rights.length; i++) {
        if (instance.rights[rights[i]] === true) {
            return true;
        }
    }
    return false;
}
XFormItem.prototype.hasAnyRight = ZaItem.hasAnyRight;

ZaItem.adminHasAnyRight = function (rights) {
    if(ZaZimbraAdmin.currentAdminAccount.attrs[ZaAccount.A_zimbraIsAdminAccount] == 'TRUE') {
        return true;
    }

    if (!rights) {
        return true;
    }

    if (!rights instanceof Array) {
        rights = [rights];
    }

    var adminAccount = new ZaAccount();
    adminAccount.load(null, ZaZimbraAdmin.currentAdminId, false, true);

    if (!adminAccount.rights) {
        return false;
    }

    for (var i = 0; i < rights.length; i++) {
        if (adminAccount.rights[rights[i]] === true) {
            return true;
        }
    }

    return false;
}

ZaItem.formatServerTime = function(serverStr) {
	if(serverStr) {
		var ajxTKServerStr = serverStr.substring(0,8) + "T" + serverStr.substring(8) ;
		var curDate = AjxDateUtil.parseServerDateTime(ajxTKServerStr);	
        var formatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.LONG) ;
      	return formatter.format(curDate) ;
	} else {
		return "";
	}	
}

ZaItem.getZeroIsUnlimitedItem = function () {
    var item= { type: _DWT_ALERT_,
//              containerCssStyle: "padding-top:20px;width:400px;",
              style: DwtAlert.INFORMATION,
              iconVisible: true,
              content: ZaMsg.NAD_ZERO_UNLIMETED
            } ;
    return item ;
}

/**
 * Returns the copyright information for the about screen
 *
 * @return {string} copyright string with the end year information
 */
ZaItem.getAboutScreenCopyright = function() {
    var version = ZaServerVersionInfo.version || 'N/A';
    var release = ZaServerVersionInfo.release || 'N/A';
    return AjxMessageFormat.format(ZabMsg.aboutScreenCopyright, [version, release, AjxDateUtil.getYearStr()]);
}

/**
 * Returns the copyright information for the login screen and the subsequent splash screen
 *
 * @return {string} copyright string with the end year information
 */
ZaItem.getSplashScreenCopyright = function() {
	return AjxMessageFormat.format(ZabMsg.splashScreenCopyright, [AjxDateUtil.getYearStr()]);
}

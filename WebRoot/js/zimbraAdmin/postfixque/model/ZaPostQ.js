/*
 * ***** BEGIN LICENSE BLOCK *****
 * Version: ZPL 1.1
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.1 ("License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.zimbra.com/license
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 * 
 * The Original Code is: Zimbra Collaboration Suite Web Client
 * 
 * The Initial Developer of the Original Code is Zimbra, Inc.
 * Portions created by Zimbra are Copyright (C) 2005 Zimbra, Inc.
 * All Rights Reserved.
 * 
 * Contributor(s):
 * 
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaPostQ
* This class represents Postfix Queue object
* @author Greg Solovyev
* @contructor
* @param app reference to the application instance
**/
function ZaPostQ(app) {
	ZaItem.call(this, app,"ZaPostQ");
	this._init(app);
}

ZaPostQ.prototype = new ZaItem;
ZaPostQ.prototype.constructor = ZaPostQ;
ZaItem.loadMethods["ZaPostQ"] = new Array();
ZaItem.initMethods["ZaPostQ"] = new Array();
/**
* attribute names
**/
ZaPostQ.A_Servername = "servername";
ZaPostQ.A_Status = "status";
ZaPostQ.A_LastError = "lasterror";
ZaPostQ.A_MTAName = "mtaname";
/**
* names of queues
**/
ZaPostQ.A_DeferredQ = "deferred";
ZaPostQ.A_IncomingQ = "incoming";
ZaPostQ.A_ActiveQ = "active";
ZaPostQ.A_CorruptQ = "corrupt";
ZaPostQ.A_HoldQ = "hold";
/**
* names of summary fields
**/
ZaPostQ.A_destination = "destination";
ZaPostQ.A_origin = "origin";
ZaPostQ.A_error = "error";
ZaPostQ.A_messages = "messages";
/**
* names of attributes in summary fields fields
**/
ZaPostQ.A_name = "name";
ZaPostQ.A_count = "count";
ZaPostQ.A_Qid = "qid";
ZaPostQ.A_query = "query";
/**
* @param app {ZaApp}
* @return {ZaItemList} a list of ZaPostQ objects {@link ZaItemList}
**/
ZaPostQ.getAll = function (app) {
	var list = new ZaItemList(ZaPostQ, app);
	var mta1 = new ZaPostQ(app);
	mta1[ZaPostQ.A_Servername] = "greg-d610.liquidsys.com";
	mta1[ZaPostQ.A_LastError] = null;
	mta1[ZaPostQ.A_MTAName] = "MTA1";
	mta1[ZaItem.A_zimbraId] = "mta1";
	mta1.id = "mta1";	
	mta1[ZaPostQ.A_DeferredQ] = {query:("mta:(mta1) queue:("+ZaPostQ.A_DeferredQ+")")};
	mta1[ZaPostQ.A_DeferredQ][ZaPostQ.A_destination]=[
			{name:"yahoo.com", count:131, toString:function() {return this.name+this.count} },
			{name:"gmail.com", count:101, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com", count:121, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:50, toString:function() {return this.name+this.count}}									
		];
	mta1[ZaPostQ.A_DeferredQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:231, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:201, toString:function() {return this.name+this.count}},			
			{name:"121.23.45.123", count:221, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:21, toString:function() {return this.name+this.count}}		
		];
	mta1[ZaPostQ.A_DeferredQ][ZaPostQ.A_error]=[
			{name:"blah-blah", count:331, toString:function() {return this.name+this.count}},
			{name:"rant-rant", count:301, toString:function() {return this.name+this.count}},			
			{name:"wait-wait", count:321, toString:function() {return this.name+this.count}}
		];
	mta1[ZaPostQ.A_DeferredQ][ZaPostQ.A_count]=1001;

	mta1[ZaPostQ.A_IncomingQ] = {query:("mta:(mta1) queue:("+ZaPostQ.A_IncomingQ+")")};
	mta1[ZaPostQ.A_IncomingQ][ZaPostQ.A_count] = 1021;

	mta1[ZaPostQ.A_IncomingQ][ZaPostQ.A_destination] = [
			{name:"yahoo.com", count:132, toString:function() {return this.name+this.count}},
			{name:"gmail.com", count:102, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com",count:122, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:12}									
		];
	mta1[ZaPostQ.A_IncomingQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:232, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:202, toString:function() {return this.name+this.count}},			
			{name:"121.23.45.123", count:222, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:22, toString:function() {return this.name+this.count}}		
		];
	mta1[ZaPostQ.A_IncomingQ][ZaPostQ.A_error]=[
			{name:"blah-blah", count:233, toString:function() {return this.name+this.count}},
			{name:"rant-rant", count:203, toString:function() {return this.name+this.count}},			
			{name:"wait-wait", count:123, toString:function() {return this.name+this.count}}
		];		

	mta1[ZaPostQ.A_ActiveQ] = {query:("mta:(mta1) queue:("+ZaPostQ.A_ActiveQ+")")};
	mta1[ZaPostQ.A_ActiveQ][ZaPostQ.A_count]=101;
	mta1[ZaPostQ.A_ActiveQ][ZaPostQ.A_destination]=[
			{name:"yahoo.com", count:233, toString:function() {return this.name+this.count}},
			{name:"gmail.com", count:203, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com", count:123, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:50, toString:function() {return this.name+this.count}}									
		]
	mta1[ZaPostQ.A_ActiveQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:233, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:203, toString:function() {return this.name+this.count}},			
			{name:"121.23.45.123", count:123, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:50, toString:function() {return this.name+this.count}}		
		];	
	
	mta1[ZaPostQ.A_CorruptQ] = {query:("mta:(mta1) queue:("+ZaPostQ.A_CorruptQ+")")};
	mta1[ZaPostQ.A_CorruptQ][ZaPostQ.A_count]=2131;			
	mta1[ZaPostQ.A_CorruptQ][ZaPostQ.A_destination]=[
			{name:"yahoo.com", count:233, toString:function() {return this.name+this.count}},
			{name:"gmail.com", count:203, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com", count:123, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:50, toString:function() {return this.name+this.count}}									
		];
	mta1[ZaPostQ.A_CorruptQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:233, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:203},			
			{name:"121.23.45.123", count:123, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:50, toString:function() {return this.name+this.count}}		
		];	

	mta1[ZaPostQ.A_HoldQ] = {query:("mta:(mta1) queue:("+ZaPostQ.A_HoldQ+")")};
	mta1[ZaPostQ.A_HoldQ][ZaPostQ.A_count]=1603;
	mta1[ZaPostQ.A_HoldQ][ZaPostQ.A_destination]=[
			{name:"yahoo.com", count:233, toString:function() {return this.name+this.count}},
			{name:"gmail.com", count:203, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com", count:123, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:50, toString:function() {return this.name+this.count}}									
		];
	mta1[ZaPostQ.A_HoldQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:233, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:203, toString:function() {return this.name+this.count}},			
			{name:"121.23.45.123", count:123, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:50, toString:function() {return this.name+this.count}}		
		];	

	var mta2 = new ZaPostQ(app);
	mta2[ZaPostQ.A_Servername] = "gregsolo.liquidsys.com";	
	mta2[ZaPostQ.A_LastError] = null;
	mta2[ZaPostQ.A_MTAName] = "MTA2";
	mta2[ZaItem.A_zimbraId] = "mta2";
	mta2.id = "mta2";	
	
	mta2[ZaPostQ.A_DeferredQ] = {query:("mta:(mta2) queue:("+ZaPostQ.A_DeferredQ+")")};
	mta2[ZaPostQ.A_DeferredQ][ZaPostQ.A_destination]=[
			{name:"yahoo.com", count:233, toString:function() {return this.name+this.count}},
			{name:"gmail.com", count:203, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com", count:123, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:50, toString:function() {return this.name+this.count}}									
		];
	mta2[ZaPostQ.A_DeferredQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:233, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:203, toString:function() {return this.name+this.count}},			
			{name:"121.23.45.123", count:123, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:50, toString:function() {return this.name+this.count}}		
		];
	mta2[ZaPostQ.A_DeferredQ][ZaPostQ.A_error]=[
			{name:"blah-blah", count:233, toString:function() {return this.name+this.count}},
			{name:"rant-rant", count:203, toString:function() {return this.name+this.count}},			
			{name:"wait-wait", count:123, toString:function() {return this.name+this.count}}
		];
	mta2[ZaPostQ.A_DeferredQ][ZaPostQ.A_count]=1001;

	mta2[ZaPostQ.A_IncomingQ] = {query:("mta:(mta2) queue:("+ZaPostQ.A_IncomingQ+")")};
	mta2[ZaPostQ.A_IncomingQ][ZaPostQ.A_count] = 1021;

	mta2[ZaPostQ.A_IncomingQ][ZaPostQ.A_destination] = [
			{name:"yahoo.com", count:233, toString:function() {return this.name+this.count}},
			{name:"gmail.com", count:203, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com",count:123, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:50, toString:function() {return this.name+this.count}}									
		];
	mta2[ZaPostQ.A_IncomingQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:233, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:203, toString:function() {return this.name+this.count}},			
			{name:"121.23.45.123", count:123, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:50, toString:function() {return this.name+this.count}}		
		];
	mta2[ZaPostQ.A_IncomingQ][ZaPostQ.A_error]=[
			{name:"blah-blah", count:233, toString:function() {return this.name+this.count}},
			{name:"rant-rant", count:203, toString:function() {return this.name+this.count}},			
			{name:"wait-wait", count:123, toString:function() {return this.name+this.count}}
		];		

	mta2[ZaPostQ.A_ActiveQ] = {query:("mta:(mta2) queue:("+ZaPostQ.A_ActiveQ+")")};
	mta2[ZaPostQ.A_ActiveQ][ZaPostQ.A_count]=101;
	mta2[ZaPostQ.A_ActiveQ][ZaPostQ.A_destination]=[
			{name:"yahoo.com", count:233, toString:function() {return this.name+this.count}},
			{name:"gmail.com", count:203, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com", count:123, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:50}									
		]
	mta2[ZaPostQ.A_ActiveQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:233, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:203, toString:function() {return this.name+this.count}},			
			{name:"121.23.45.123", count:123, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:50, toString:function() {return this.name+this.count}}		
		];	

	mta2[ZaPostQ.A_CorruptQ] = {query:("mta:(mta2) queue:("+ZaPostQ.A_CorruptQ+")")};
	mta2[ZaPostQ.A_CorruptQ][ZaPostQ.A_count]=2131;			
	mta2[ZaPostQ.A_CorruptQ][ZaPostQ.A_destination]=[
			{name:"yahoo.com", count:233, toString:function() {return this.name+this.count}},
			{name:"gmail.com", count:203, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com", count:123, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:50, toString:function() {return this.name+this.count}}									
		];
	mta2[ZaPostQ.A_CorruptQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:233, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:203, toString:function() {return this.name+this.count}},			
			{name:"121.23.45.123", count:123, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:50, toString:function() {return this.name+this.count}}		
		];	

	mta2[ZaPostQ.A_HoldQ] = {query:("mta:(mta2) queue:("+ZaPostQ.A_HoldQ+")")};
	mta2[ZaPostQ.A_HoldQ][ZaPostQ.A_count]=1603;
	mta2[ZaPostQ.A_HoldQ][ZaPostQ.A_destination]=[
			{name:"yahoo.com", count:233, toString:function() {return this.name+this.count}},
			{name:"gmail.com", count:203, toString:function() {return this.name+this.count}},			
			{name:"hotmail.com", count:123, toString:function() {return this.name+this.count}},						
			{name:"usa.net", count:50, toString:function() {return this.name+this.count}}									
		];
	mta2[ZaPostQ.A_HoldQ][ZaPostQ.A_origin]=[
			{name:"64.23.45.222", count:233, toString:function() {return this.name+this.count}},
			{name:"221.23.45.26", count:203, toString:function() {return this.name+this.count}},			
			{name:"121.23.45.123", count:123, toString:function() {return this.name+this.count}},						
			{name:"220.63.45.201", count:50, toString:function() {return this.name+this.count}}		
		];
	list.add(mta1);
	list.add(mta2);
	return list;
}

ZaPostQ.prototype.getMessages = function(app, queue, destination, origin, error,limit, offset,sortBy,sortAscending) {
	this[queue][ZaPostQ.A_messages] = ZaSearch.searchMailQ(app, queue, destination, origin, error,limit, offset,sortBy,sortAscending);
}

PostQSummary_XModelItem = function (){}
XModelItemFactory.createItemType("_POSTQSUMMARY_", "postqsummary", PostQSummary_XModelItem);
PostQSummary_XModelItem.prototype.items = [
				{id:ZaPostQ.A_destination, type:_LIST_, listItem:
					{type:_OBJECT_, 
						items: [
							{id:ZaPostQ.A_name, type:_STRING_},
							{id:ZaPostQ.A_count, type:_NUMBER_}
						]
					}
				},
				{id:ZaPostQ.A_origin, type:_LIST_, listItem:
					{type:_OBJECT_, 
						items: [
							{id:ZaPostQ.A_name, type:_STRING_},
							{id:ZaPostQ.A_count, type:_NUMBER_}
						]
					}
				},
				{id:ZaPostQ.A_error, type:_LIST_, listItem:
					{type:_OBJECT_, 
						items: [
							{id:ZaPostQ.A_name, type:_STRING_},
							{id:ZaPostQ.A_count, type:_NUMBER_}
						]
					}
				},
				{id:ZaPostQ.A_count, type:_NUMBER_}	
			];
ZaPostQ.myXModel = {
	items: [
		{id:ZaPostQ.A_Status, type:_STRING_, ref:ZaPostQ.A_Status},
		{id:ZaPostQ.A_MTAName, type:_STRING_, ref:ZaPostQ.A_MTAName},
		{id:ZaPostQ.A_LastError, type:_STRING_, ref:ZaPostQ.A_LastError},
		{id:ZaPostQ.A_DeferredQ , type:_POSTQSUMMARY_},
		{id:ZaPostQ.A_IncomingQ , type:_POSTQSUMMARY_},
		{id:ZaPostQ.A_ActiveQ , type:_POSTQSUMMARY_},
		{id:ZaPostQ.A_CorruptQ , type:_POSTQSUMMARY_}, 
		{id:ZaPostQ.A_HoldQ , type:_POSTQSUMMARY_}		
	]
};


ZaPostQItem = function (app) {
	ZaItem.call(this, app,"ZaPostQItem");
	this._init(app);
}
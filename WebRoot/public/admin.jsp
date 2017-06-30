<%@ page session="false" %>
<%@ page session="false" language="java" import="java.util.*,javax.naming.*"%>
<%@ page import="com.zimbra.cs.taglib.bean.BeanUtils" %>
<%@ taglib prefix="zm" uri="com.zimbra.zm" %>
<%@ taglib prefix="fmt" uri="com.zimbra.i18n" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%!
	static String getParameter(HttpServletRequest request, String pname, String defValue) {
		String value = request.getParameter(pname);
		return value != null ? value : defValue;
	}
	static String getAttribute(HttpServletRequest request, String aname, String defValue) {
		Object object = request.getAttribute(aname);
		String value = object != null ? String.valueOf(object) : null;
		return value != null ? value : defValue;
	}
%>
<%
	String adminUrl = null;
	String portsCSV = null;

   	portsCSV = application.getInitParameter("admin.allowed.ports");
	try {
		Context initCtx = new InitialContext();
		Context envCtx = (Context) initCtx.lookup("java:comp/env");
		adminUrl = (String) envCtx.lookup("adminUrl");
	} catch (NamingException ne) {
		//nothing to do here
	}
	
	if (adminUrl == null) {
		adminUrl = "/zimbraAdmin";
    }


   	if (portsCSV != null) {
	    // Split on zero-or-more spaces followed by comma followed by
	    // zero-or-more spaces.
	    String[] vals = portsCSV.split("\\s*,\\s*");
	    if (vals == null || vals.length == 0) {
	      	throw new ServletException("Must specify comma-separated list of port numbers for admin.allowed.ports parameter");
	    } 	
	    int[] mAllowedPorts = new int[vals.length];
	    for (int i = 0; i < vals.length; i++) {
	    	try {
	        	mAllowedPorts[i] = Integer.parseInt(vals[i]);
	        } catch (NumberFormatException e) {
	            throw new ServletException("Invalid port number \"" + vals[i] + "\" in admin.allowed.ports parameter");
	        }
	        if (mAllowedPorts[i] < 1) {
	            throw new ServletException("Invalid port number " + mAllowedPorts[i] + " in admin.allowed.ports parameter; port number must be greater than zero");
	        }
	    }  
	    
	    if (mAllowedPorts != null && mAllowedPorts.length > 0) {
	        int incoming = request.getServerPort();
	        boolean allowed = false;
	        for (int i = 0; i < mAllowedPorts.length; i++) {
	            if (mAllowedPorts[i] == incoming) {
	                allowed = true;
	                break;
	            }
	        }
	        if (!allowed) {
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	            out.println("Request not allowed on port " + Integer.toString(incoming));
	            return;
	        }
	    }    
	}
%>

<c:if test="${param.logoff eq '1'}">
	<zm:logout isAdmin="true" />

	<c:redirect url="/">
		<c:forEach var="p" items="${paramValues}">
			<c:forEach var='value' items='${p.value}'>
				<c:if test="${p.key ne 'logoff'}">
					<c:param name="${p.key}" value='${value}'/>
				</c:if>
			</c:forEach>
		</c:forEach>
	</c:redirect>
</c:if>

<%
	Boolean isDev = getParameter(request, "dev", "0").equals("1");
	if (isDev) {
		request.setAttribute("mode", "mjsf");
		request.setAttribute("gzip", "false");
		request.setAttribute("fileExtension", "");
		if (request.getAttribute("debug") == null) {
			request.setAttribute("debug", "1");
		}
		request.setAttribute("packages", "dev");
	}

    Boolean isNewUI = !getParameter(request, "old", "0").equals("1");
    if (!isNewUI) {
		request.setAttribute("skin", "carbon");
    }
	String debug = getParameter(request, "debug", getAttribute(request, "debug", null));
	
    String mode = (String)request.getAttribute("mode");
    if (mode == null) mode = "";
    
    String prodMode = getAttribute(request, "prodMode", "");
    
    Boolean isDevMode = isDev || ((mode != null) && (mode.equalsIgnoreCase("mjsf"))) || (prodMode.equals(""));
    
    String vers = (String)request.getAttribute("version");
    if (vers == null) vers = "";

    String ext = (String)request.getAttribute("fileExtension");
    if (ext == null) ext = "";
    
    String skin = (String)request.getAttribute("skin");
	if (skin == null) {
		skin = application.getInitParameter("zimbraDefaultAdminSkin");
	}

    if (isNewUI) { //only save new skin in cookie "ZA_SKIN"
	    Cookie skinCookie = new Cookie("ZA_SKIN",skin);
	    response.addCookie(skinCookie);
    }
		
    String contextPath = request.getContextPath();
    if(contextPath == null || contextPath.equals("/")) {
		response.sendRedirect(adminUrl+"?mode="+mode+"&version="+vers+"&fileExtension="+ext+"&skin="+skin);    	
    }

	// make variables available in page context (e.g. ${foo})
	pageContext.setAttribute("contextPath", contextPath);
	pageContext.setAttribute("skin", skin);
	pageContext.setAttribute("ext", ext);
	pageContext.setAttribute("vers", vers);
	pageContext.setAttribute("isDevMode", isDevMode);
	pageContext.setAttribute("isNewUI", isNewUI);
%>
<%
	Cookie testCookie = new Cookie("ZA_TEST", "true");
	testCookie.setSecure(com.zimbra.cs.taglib.ZJspSession.secureAuthTokenCookie(request));
	response.addCookie(testCookie);

	// Prevent IE from ever going into compatibility/quirks mode.
	response.setHeader("X-UA-Compatible", "IE=edge");
%>
<!DOCTYPE html>
<html>
<head>
<!--
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
-->
	<fmt:setLocale value='${pageContext.request.locale}' scope='request' />
	<fmt:setBundle basename="/messages/ZabMsg" scope='request' />
    <title><fmt:message key="zimbraAdminTitle"/></title>
	<zm:getFavIcon request="${pageContext.request}" var="favIconUrl" />
	<c:if test="${empty favIconUrl}">
	    <fmt:message key="favIconUrl" var="favIconUrl"/>
	</c:if>
    <link rel="SHORTCUT ICON" href="<c:url value='${favIconUrl}'/>">
    
	<script>
		appContextPath = "${zm:jsEncode(contextPath)}";
		appCurrentSkin = "${zm:jsEncode(skin)}";
		appVers   = "${zm:jsEncode(vers)}";
		appDevMode     = ${isDevMode};
        appNewUI     = ${isNewUI};
	</script>
<jsp:include page="Resources.jsp">
	<jsp:param name="res" value="I18nMsg,TzMsg,AjxMsg,ZMsg,ZaMsg,ZabMsg,AjxKeys" />
	<jsp:param name="skin" value="${skin}" />
</jsp:include>
<style type="text/css">
<!--
@import url(<%= contextPath %>/css/dwt,common,zmadmin,login,msgview,spellcheck,images,skin.css?v=<%= vers %>&skin=<%= skin %>);
-->
</style>

<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<script type="text/javascript" src="${contextPath}/yui/2.7.0/yahoo-dom-event/yahoo-dom-event.js"></script> 
<script type="text/javascript" src="${contextPath}/yui/2.7.0/element/element-min.js"></script> 
<script type="text/javascript" src="${contextPath}/yui/2.7.0/datasource/datasource-min.js"></script> 
<script type="text/javascript" src="${contextPath}/yui/2.7.0/json/json-min.js"></script> 
<script type="text/javascript" src="${contextPath}/yui/2.7.0/charts/charts-min.js"></script> 
<script type="text/javascript">
    YAHOO.widget.Chart.SWFURL = "yui/2.7.0/charts/assets/charts.swf";
</script>

<jsp:include page="Boot.jsp"/>
<script>
<jsp:include page="/js/ajax/util/AjxTimezoneData.js" />
</script>
<%
    String packages = "Ajax,XForms,Zimbra,Admin";

    String extraPackages = request.getParameter("packages");
    if (extraPackages != null) packages += "," + BeanUtils.cook(extraPackages);

    String pprefix = isDevMode ? "public/jsp" : "js";
    String psuffix = isDevMode ? ".jsp" : "_all.js";

    String[] pnames = packages.split(",");
    for (String pname : pnames) {
        String pageurl = "/"+pprefix+"/"+pname+psuffix;
        if (isDevMode) { %>
            <jsp:include>
                <jsp:attribute name='page'><%=pageurl%></jsp:attribute>
            </jsp:include>
        <% } else { %>
            <script type="text/javascript" src="<%=contextPath%><%=pageurl%><%=ext%>?v=<%=vers%>"></script>
        <% } %>
    <% }
%>
<script type="text/javascript">
AjxEnv.DEFAULT_LOCALE = "${zm:javaLocaleId(pageContext.request.locale)}";
</script>
    <script type="text/javascript" language="JavaScript">
	   function launch() {
		DBG = new AjxDebug(AjxDebug.NONE, null, false);
		ACCESS_RIGHTS = new Object();
		// figure out the debug level
			if (location.search && (location.search.indexOf("debug=") != -1)) {
				var m = location.search.match(/debug=(\w+)/);
				if (m && m.length) {
					var level = m[1];
					if (level == 't') {
						DBG.showTiming(true);
					} else {
						DBG.setDebugLevel(level);
					}
				}
			}
            try {
                ZaZimbraAdmin.run(document.domain);
            }catch (ex) {
                if (window.console && window.console.error) console.error ("Exception in launch(): " + ex.msg ) ;
            }
        }

       //	START DOMContentLoaded
       // Mozilla and Opera 9 expose the event we could use
       if (document.addEventListener) {
           document.addEventListener("DOMContentLoaded", launch, null);

           //	mainly for Opera 8.5, won't be fired if DOMContentLoaded fired already.
           document.addEventListener("load", launch, null);
       }

       // 	for Internet Explorer. readyState will not be achieved on init call
       if (document.attachEvent) {
           document.attachEvent("onreadystatechange", function(e) {
               if (document.readyState == "complete") {
                   launch();
               }
           });
       }

       if (/(WebKit|khtml)/i.test(navigator.userAgent)) { // sniff
           var _timer = setInterval(function() {
               if (/loaded|complete/.test(document.readyState)) {
                   launch();
                   // call the onload handler
               }
           }, 10);
       }
       //	END DOMContentLoaded
       AjxCore.addOnloadListener(launch);
    </script>
  </head>
  <body>
    <script type="text/javascript" src="<%=contextPath%>/js/skin.js?v=<%=vers %>&skin=<%=skin%>"></script>
    <%
		// NOTE: This inserts raw HTML files from the user's skin
		//       into the JSP output. It's done *this* way so that
		//       the SkinResources servlet sees the request URI as
		//       "/html/skin.html" and not as "/public/launch...".
		out.flush();

		RequestDispatcher dispatcher = request.getRequestDispatcher("/html/");
		HttpServletRequest wrappedReq = new HttpServletRequestWrapper(request) {
      public String getServletPath() { return "/html"; }
      public String getPathInfo() { return "/skin.html"; }
      public String getRequestURI() { return getServletPath() + getPathInfo(); }
		};
		dispatcher.include(wrappedReq, response);
	%>
	<script type="text/javascript">
    	window.skin.hideSkin();
    </script>
  </body>
</html>

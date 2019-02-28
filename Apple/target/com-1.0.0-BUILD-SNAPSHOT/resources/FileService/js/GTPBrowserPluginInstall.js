var GTPBrowserPluginInstall = {};
GTPBrowserPluginInstall._obj = 0;
GTPBrowserPluginInstall._fileServerUrl = "";
GTPBrowserPluginInstall._fileServerGuid = "";
GTPBrowserPluginInstall._authorizeKey = "";
GTPBrowserPluginInstall._langID = 2052;
GTPBrowserPluginInstall._initialized = false;

GTPBrowserPluginInstall._browserIsIE = function () {
    if (window.ActiveXObject)
        return true;
    else {
        //IE11 : Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko
        var u_agent = navigator.userAgent.toLowerCase();
        return (u_agent.indexOf('trident/') > -1 && u_agent.indexOf('rv:') > -1);
    }
}

GTPBrowserPluginInstall.AjaxSyncCall = function (urlStr, paramsStr) {
    var obj;
    var value;
    if (GTPBrowserPluginInstall._browserIsIE()) {
        obj = new ActiveXObject('Microsoft.XMLHTTP');
    } else if (window.XMLHttpRequest) {
        obj = new XMLHttpRequest();
    }
    obj.open('POST', urlStr, false);
    obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    obj.send(paramsStr);
    return obj.responseText;
};

//由于相互间调用关系约束，以下方法的先后顺序不能变 **********************************************
GTPBrowserPluginInstall._getLocationRootDir = function () {
    //通过比较当前脚本的相对路径设置和当前页面的链接，得到当前的网站的根目录        
    var theCurJsFile_Short = "js/GTPBrowserPluginInstall.js".toLowerCase();
    var theCurJsFile = ("Services/FileService/" + theCurJsFile_Short).toLowerCase();

    var currentPageUrl = document.URL;

    //fireFox 不支持 document.scripts
    var js = document.getElementsByTagName("script");
    var jsPath;
    for (var i = js.length; i > 0; i--) {
        var jsPath = js[i - 1].src;
        if (jsPath.toLowerCase().indexOf(theCurJsFile) > -1) {
            return jsPath.substring(0, jsPath.toLowerCase().lastIndexOf(theCurJsFile))
        }
        else if (jsPath.toLowerCase() == theCurJsFile_Short) {
            return "../../";
        }
    }
    return "";
};

GTPBrowserPluginInstall._createPluginObject = function () {
    var objId = document.getElementById("div_GTPBrowserPluginObject");
    if (objId) {        
        return;
    }

    var html;
    if (GTPBrowserPluginInstall._browserIsIE()) {
        //IE 浏览器 ActiveX
        html = '<object classid=clsid:CDE819EE-EAAC-4076-8CC5-83BED02FEB17 ' +
            'style="display:none;height:0px;width:0px" id="GTPBrowserPluginObject" />';
    }
    else {
        //mozilla 系列浏览器支持的插件
        html = '<embed width="0px" height="0px" type="application/x-glodon-gtp-client-plugin" ' +
             'data="data:application/x-glodon-gtp-client-plugin" id="GTPBrowserPluginObject" />';
    }

    var o = document.body;

    //创建DIV
    var div = document.createElement("div");
    //不能设置 div 对象隐藏，否则 getElementById 得不到对象 
    div.setAttribute('style', 'position:absolute;left:0;top:0;width:0;height:0;');
    div.setAttribute('id', 'div_GTPBrowserPluginObject');
    div.innerHTML = html;
    o.appendChild(div);
};

String.prototype.endWith = function (oString) {
    var reg = new RegExp(oString + "$");
    return reg.test(this);
};

GTPBrowserPluginInstall._displayInstallBar = function () {
    var tbl = document.getElementById("div_tblGTPBrowserPluginInstallBar");
    if (tbl) {
        tbl.style.display = "block";
        return;
    }

    var rootUrl = this._getLocationRootDir();
    if (!rootUrl.endWith("/")) {
        rootUrl += "/";
    }
    var closeImgSrc = rootUrl + "Services/FileService/images/cross.png";
    var installPage = rootUrl + "Services/FileService/installPluginIE.htm";
    if (!GTPBrowserPluginInstall._browserIsIE())
        installPage = rootUrl + "Services/FileService/installPluginFF.htm";
    var hint;

    if (GTPBrowserPluginInstall._langID == 2052)//TODO：真正支持多语言
        hint = "需安装浏览器插件以支持此页面的功能，请点击此处安装。";
    else if (GTPBrowserPluginInstall._langID == 1028)
        hint = "需安裝瀏覽器插件以支持此页面的功能，請點擊此處安裝。";
    else
        hint = "A browser plugin is need to be installed for this page, click here to start.";

    var html =
    "<table id=\"tblGTPBrowserPluginInstallBar\" style=\"border: 1px solid #C0C0C0; padding: 10px; position: absolute; width: 100%;" +
    "left: 0px; top: 0px; height: 30px; background-color: #FFCC00; cursor: pointer\"><tr>" +
    "<td onclick=\"javascript:window.open('" + installPage + "');\">" +
    "<font size=\"2\">&nbsp;&nbsp;" + hint + "</font></td>" +
    "<td width=\"30\" align=\"center\">" +
    "<img src=\"" + closeImgSrc + "\" " +
    "onclick=\"javascript:document.getElementById('tblGTPBrowserPluginInstallBar').style.display='none';\" />" +
     "</td></tr></table>";

    var o = document.body;
    var div = document.createElement("div");
    div.setAttribute("id", "div_tblGTPBrowserPluginInstallBar");
    div.setAttribute('style', 'z-index:10000000');

    div.innerHTML = html;
    o.appendChild(div);
};

GTPBrowserPluginInstall._ajaxGetServerConfig = function () {
    var ajaxUrl = GTPBrowserPluginInstall._getLocationRootDir() + "Services/FileService/serverConfig.ashx";
    var jsonStr = GTPBrowserPluginInstall.AjaxSyncCall(ajaxUrl);
    //alert("configAjax:" + jsonStr);
    var resultObj = eval(jsonStr);
    GTPBrowserPluginInstall._fileServerUrl = resultObj.ServerUrl;
    GTPBrowserPluginInstall._fileServerGuid = resultObj.ServerGuid;
    GTPBrowserPluginInstall._authorizeKey = resultObj.AuthorizeKey;
    GTPBrowserPluginInstall._langID = resultObj.LangID;
};

GTPBrowserPluginInstall._checkPluginInstalled = function () {
    GTPBrowserPluginInstall._obj = document.getElementById("GTPBrowserPluginObject");

    if (!GTPBrowserPluginInstall._getPluginInstalled())
        GTPBrowserPluginInstall._displayInstallBar();  //在页面顶部显示安装提示 
};

GTPBrowserPluginInstall._processPageOnload = function () {
    //页面加载完成后，尝试在页面插入隐藏的ActiveX 或者 NPAPI插件 Object
    GTPBrowserPluginInstall._createPluginObject();

    if (window.removeEventListener)
        window.removeEventListener('load', GTPBrowserPluginInstall._processPageOnload, false);
    else
        window.detachEvent('onload', GTPBrowserPluginInstall._processPageOnload);

    GTPBrowserPluginInstall._ajaxGetServerConfig();

    setTimeout(GTPBrowserPluginInstall._checkPluginInstalled, 20);

    //TODO: 未安装ActiveX 或者 NPAPI 插件的情况，尝试jsonp 连接 GTPBrowserPluginInstallHost
};

//*************************************************************************

if (window.addEventListener)
    window.addEventListener('load', GTPBrowserPluginInstall._processPageOnload, false);
else
    window.attachEvent('onload', GTPBrowserPluginInstall._processPageOnload);

//*************************************************************************

//由于相互间调用关系约束，以上方法的先后顺序不能变 **********************************************

GTPBrowserPluginInstall._getPluginInstalled = function () {
    var installed = false;
    if (GTPBrowserPluginInstall._obj) {
        try {
            if (this._obj.ShellGetLocalTempDir())
                installed = true;
        }
        catch (e) { }
    }
    return installed;
};
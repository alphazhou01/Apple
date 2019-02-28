var GTPFileClient = {
    fileSize: function (size) {
        if (size < 1024) {
            return size + " 字节";
        } else if (size < 1048576) {
            return (Math.round(((size * 10) / 1024)) / 10) + " KB";
        } else {
            return (Math.round(((size * 10) / 1048576)) / 10) + " MB";
        }
    },
    _browserIsIE: function () {
        if (window.ActiveXObject)
            return true;
        else {
            //IE11 : Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko
            var u_agent = navigator.userAgent.toLowerCase();
            return (u_agent.indexOf('trident/') > -1 && u_agent.indexOf('rv:') > -1);
        }
    }
};
GTPFileClient._isIE = GTPFileClient._browserIsIE();
GTPFileClient._obj = null;
GTPFileClient._fileServerUrl = "";
GTPFileClient._fileServerGuid = "";
GTPFileClient._authorizeKey = "";
GTPFileClient._langID = 2052;
GTPFileClient._keyAlgo = 0600;
GTPFileClient._initialized = false;
GTPFileClient._ajaxUrl = "http://202.103.238.218:8685/Services/FileService/FsAjax.ashx";
GTPFileClient._needProgressInfo = false;
GTPFileClient._working = false;
GTPFileClient._action = "";
GTPFileClient._useProgressDiv = false;
GTPFileClient._ProgressInfoLastFilePos = 0;
GTPFileClient._ProgressInfoLastTotalPos = 0;
GTPFileClient._ProgressInfoLastFileIndex = 0;
GTPFileClient._supportProgressDiv = false;
GTPFileClient._progressInfoChangedEvent = null;
GTPFileClient.FsAjaxFullUrl = "";
GTPFileClient.PluginInstalled = false;
GTPFileClient.AutoShowInstallBar = true;

GTPFileClient._ajaxSyncCall = function (urlStr, paramsStr) {
    var obj;
    var value;
    var result;
    if (GTPFileClient._isIE) {
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
GTPFileClient._getLocationRootDir = function () {
    //通过比较当前脚本的相对路径设置和当前页面的链接，得到当前的网站的根目录        
    var theCurJsFile_Short = "js/GTPFileClient.js".toLowerCase();
    var theCurJsFile = ("Services/FileService/" + theCurJsFile_Short).toLowerCase();

    var currentPageUrl = location.href;

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

GTPFileClient._getLocationRootFullUrl = function () {
    //获取当前页面所处 web 根目录完整的 url 
    var dir = GTPFileClient._getLocationRootDir();
    if (dir == "/" || dir == "\\")
        dir = location.protocol + "//" + location.hostname + ":" + location.port;
    else if (dir.toLowerCase().indexOf("http://") != 0 && dir.toLowerCase().indexOf("https://") != 0) {
        var n = (dir.split("../")).length - 1; // 有几个 "../"
        var ls = location.href.split("/");
        dir = location.protocol + "//" + location.hostname;
        if (location.port != "")
            dir += ":" + location.port;
        for (var i = 3; i < ls.length - 1 - n; i++) {
            dir += "/" + ls[i];
        }
    }
    if (!dir.endWith("/"))
        dir += "/";
    return dir;
};

GTPFileClient._createPluginObject = function () {

    var objId = document.getElementById("div_GTPBrowserPluginObject");
    if (objId) {
        setTimeout(GTPFileClient._elementToObject, 100);
        return;
    }

    var html;
    if (GTPFileClient._isIE) {
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
    div.setAttribute('style', 'position:absolute;left:0;top:0;width:0;height:0;z-index:100000000');
    div.setAttribute('id', 'div_GTPBrowserPluginObject');
    div.innerHTML = html;
    o.appendChild(div);


    //注意需要创建插件对象后延迟一段时间再检查插件是否已安装，留给浏览器加载插件的时间
    setTimeout(GTPFileClient._elementToObject, 100);
};

String.prototype.endWith = function (oString) {
    var reg = new RegExp(oString + "$");
    return reg.test(this);
};

GTPFileClient._makeValidFilePathName = function (filePathName) {
    var s = filePathName;
    while (s.indexOf("/") > -1) {
        s = s.replace("/", "\\");
    }
    while (s.indexOf("\\\\") > -1) {
        s = s.replace("\\\\", "\\");
    }

    if (s.substr(s.length - 1) == "|")//以竖线 | 结尾时，去掉之
        s = s.substr(0, s.length - 1);

    var sl = s.split(":\\"); //位于盘符前面的竖线不处理： C:\123.doc|D:\456.doc
    var sTmp = "";
    for (var i = 0; i < sl.length; i++) {
        sl[i] = sl[i].replace(/[:*?\"<>]/g, "_"); //不能用于文件名的字符，都替换为下横线，竖线除外
        var sl2 = sl[i].split("|");
        var sTmp2 = "";
        for (var j = 0; j < sl2.length; j++) {
            sTmp2 += sl2[j];
            if (j < sl2.length - 1) {
                if (j == sl2.length - 2) {
                    if (sl2[j + 1].length == 1 && ((sl2[j + 1] > "a" && sl2[j + 1] < "z") || (sl2[j + 1] > "A" && sl2[j + 1] < "Z")))
                        sTmp2 += "|";
                    else
                        sTmp2 += "_";
                }
                else {
                    sTmp2 += "_";
                }
            }
        }
        sTmp += sTmp2;
        if (i < sl.length - 1)
            sTmp += ":\\";
    }

    return sTmp; //不能用于文件名的字符，都替换为下横线：_；因为下载时，以及下载后打开可能遇到问题，此处修改, 
};

GTPFileClient._displayInstallBar = function () {
    if (!GTPFileClient.AutoShowInstallBar) return;

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
    var installPage = rootUrl + "Services/FileService/installPluginIE";
    if (!GTPFileClient._isIE)
        installPage = rootUrl + "Services/FileService/installPluginFF";
    if (GTPFileClient._langID == 2052) {//简体中文的说明页面
        installPage += ".htm";
    }
    else if (GTPFileClient._langID == 1028) {//繁体中文的说明页面
        installPage += "_1028.htm";
    } else {//英文的说明页面
        installPage += "_9.htm";
    }

    var hint;

    var isWin32 = false;
    var isWin64 = false;
    try {
        isWin32 = window.navigator.platform.toLowerCase() == "win32";
        isWin64 = window.navigator.platform.toLowerCase() == "win64";
    } catch (e) { }
    if (GTPFileClient._langID == 2052) {
        if (isWin32) {
            hint = "需安装浏览器插件以支持此页面的功能，请点击此处安装。";
        }
        else if (isWin64) {
            hint = "当前浏览器为64位版本，无法使用浏览器插件，要使用插件功能，请换用32位的Windows版本浏览器，点击此处查看详细说明。";
        }
        else {
            hint = "当前使用的不是Windows操作系统，无法使用浏览器插件，要使用插件功能，请换用32位的Windows版本浏览器，点击此处查看详细说明。";
        }
    }
    else if (GTPFileClient._langID == 1028) {
        if (isWin32) {
            hint = "需安裝瀏覽器插件以支持此页面的功能，請點擊此處安裝。";
        }
        else if (isWin64) {
            hint = "當前浏覽器爲64位版本，無法使用浏覽器插件，要使用插件功能，請換用32位的Windows版本浏覽器，點擊此處查看詳細說明。";
        }
        else {
            hint = "當前使用的不是Windows操作系統，無法使用浏覽器插件，要使用插件功能，請換用32位的Windows版本浏覽器，點擊此處查看詳細說明。";
        }
    }
    else {
        if (isWin32) {
            hint = "A browser plugin is need to be installed for this page, click here to start.";
        }
        else if (isWin64) {
            hint = "Current browser is 64-bit version,and can not use the plugin,to enable the plugin,use the 32-bit windows version browser, click here to start.";
        }
        else {
            hint = "Current OS is not Windows,and can not use the plugin,to enable the plugin,use the 32-bit windows version browser, click here to start.";
        }
    }

    var html =
    "<table id=\"tblGTPBrowserPluginInstallBar\" style=\"border: 1px solid #C0C0C0; padding: 10px; position: absolute; width: 100%;" +
    "left: 0px; top: 0px; height: 30px; background-color: #FFCC00; cursor: pointer\"><tr>" +
    "<td onclick=\"javascript:window.open('" + installPage + "');\">" +
    "<font size=\"2\">&nbsp;&nbsp;" + hint + "</font></td>" +
    "<td width=\"30\" align=\"center\">" +
    "<img src=\"" + closeImgSrc + "\" " +
    "onclick=\"javascript:document.getElementById('div_tblGTPBrowserPluginInstallBar').style.display='none';\" />" +
     "</td></tr></table>";

    var o = document.body;
    var div = document.createElement("div");
    div.setAttribute("id", "div_tblGTPBrowserPluginInstallBar");
    div.setAttribute('style', 'z-index:10000000');

    div.innerHTML = html;
    o.appendChild(div);
};

GTPFileClient._ajaxGetServerConfig = function () {
    //var ajaxUrl = GTPFileClient._getLocationRootDir() + "Services/FileService/serverConfig.ashx";
    var ajaxUrl = "http://202.103.238.218:8685/Services/FileService/serverConfig.ashx";
	var jsonStr = "";
    //if (window.$G && window.$G.PageContext && window.$G.PageContext.fileServerConfig && window.$G.PageContext.fileServerConfig != "") {
    //    jsonStr = window.$G.PageContext.fileServerConfig;
    //} else {
        jsonStr = config;//GTPFileClient._ajaxSyncCall(ajaxUrl);
    //}
    var resultObj;
    //alert("configAjax:" + jsonStr);
    try {
        resultObj = eval(jsonStr);
    }
    catch (e) {
        var el = document.createElement("error");
        el.innerHTML = jsonStr;
        alert("服务器异常,文件传输相关功能无法启用：\r\n" + el.innerText);
        return;
    }
    if (resultObj.ServerUrl == "/") {
        resultObj.ServerUrl = GTPFileClient._getLocationRootFullUrl();
    } else if (resultObj.ServerUrl == undefined || resultObj.ServerUrl == null || resultObj.ServerUrl == "") {
        alert("获取文件服务配置信息失败，文件服务地址为空，请联系管理员！"); //异常
        return;
    } else {
        var sl = resultObj.ServerUrl.split("//");
        if (sl.length < 2 || sl[1] == "" || sl[1] == "/") {
            alert("文件服务地址格式错误，请联系管理员：" + resultObj.ServerUrl); //异常
            return;
        }
    }
    GTPFileClient._fileServerUrl = resultObj.ServerUrl;
    GTPFileClient._fileServerGuid = resultObj.ServerGuid;
    GTPFileClient._authorizeKey = resultObj.AuthorizeKey;
    GTPFileClient._langID = resultObj.LangID;
    GTPFileClient._keyAlgo = resultObj.KeyAlgo;
    GTPFileClient._supportFiles = resultObj.SupportFiles;
};

GTPFileClient._checkPluginInstalled = function () {
    GTPFileClient._obj = document.getElementById("GTPBrowserPluginObject");

    GTPFileClient.PluginInstalled = GTPFileClient._getPluginInstalled();
    if (!GTPFileClient.PluginInstalled) {
        //2012.3.16 陶松需求，仅在对象被调用时判断
        //GTPFileClient._displayInstallBar();  //在页面顶部显示安装提示
    }
    else if (!GTPFileClient._isIE)
        GTPFileClient._initial(true); //FireFox 在页面加载后，直接初始化，避免弹出的进度框失去响应（目前原因未知，尝试连接文件服务可避免该问题）
};

GTPFileClient._elementToObject = function () {
    GTPFileClient._obj = document.getElementById("GTPBrowserPluginObject");

    setTimeout(GTPFileClient._checkPluginInstalled, 200);
};

GTPFileClient.InitialAjaxPageUrl = function () {
    var rootUrl = GTPFileClient._getLocationRootDir();
    if (!rootUrl.endWith("/"))
        rootUrl += "/";
    GTPFileClient.FsAjaxFullUrl = rootUrl + GTPFileClient._ajaxUrl;
};

GTPFileClient._processPageOnload = function () {
    if (window.removeEventListener)
        window.removeEventListener('load', GTPFileClient._processPageOnload, false);
    else
        window.detachEvent('onload', GTPFileClient._processPageOnload);

    GTPFileClient.InitialAjaxPageUrl();

    GTPFileClient._ajaxGetServerConfig();

    //页面加载完成后，尝试在页面插入隐藏的ActiveX 或者 NPAPI插件 Object 
    //注意需要延迟一段时间，否则FireFox 可能由于div对象过多导致
    setTimeout(GTPFileClient._createPluginObject, 50);
};

//*************************************************************************

if (window.document && window.document.readyState == "complete") { //页面加载完成后再载入本js的情况
    GTPFileClient._processPageOnload();
}
else {
    if (window.addEventListener)
        window.addEventListener('load', GTPFileClient._processPageOnload, false);
    else
        window.attachEvent('onload', GTPFileClient._processPageOnload);
}

//*************************************************************************

//由于相互间调用关系约束，以上方法的先后顺序不能变 **********************************************

GTPFileClient._onWorkStartEventAttached = false;
GTPFileClient._onWorkFinishEventAttached = false;
GTPFileClient._onWorkProgresstEventAttached = false;

GTPFileClient._onWorkStartEvent = null;
GTPFileClient._onWorkFinishEvent = null;
GTPFileClient._onWorkProgresstEvent = null;

GTPFileClient._triggerWorkStartEvent = function (FileID, FileName, FileSize) {
    if (GTPFileClient._onWorkStartEventAttached && GTPFileClient._onWorkStartEvent)
        GTPFileClient._onWorkStartEvent(FileID, FileName, FileSize);
};

GTPFileClient._triggerWorkFinishEvent = function (FileID, FileName) {
    if (GTPFileClient._onWorkFinishEventAttached && GTPFileClient._onWorkFinishEvent)
        GTPFileClient._onWorkFinishEvent(FileID, FileName);
};

GTPFileClient._triggerWorkProgressEvent = function (FileID, FileName, Progress, FileSize) {
    if (GTPFileClient._onWorkProgressEventAttached && GTPFileClient._onWorkProgressEvent)
        GTPFileClient._onWorkProgressEvent(FileID, FileName, Progress, FileSize);
};

//附加文件传输开始事件处理函数
GTPFileClient.AttachWorkStartEvent = function (eventFunc) {
    if (GTPFileClient.PluginInstalled) {
        if (!GTPFileClient._onWorkStartEventAttached) {
            if (GTPFileClient._isIE)
                this._obj.attachEvent("OnFileWorkStart", GTPFileClient._triggerWorkStartEvent);
            else
                this._obj.AttachOnFileWorkStartEvent(GTPFileClient._triggerWorkStartEvent);
            GTPFileClient._onWorkStartEventAttached = true;
        }
        GTPFileClient._onWorkStartEvent = eventFunc;
    }
};
//附加文件传输进度变更事件处理函数
GTPFileClient.AttachWorkProgressEvent = function (eventFunc) {
    if (GTPFileClient.PluginInstalled) {
        if (!GTPFileClient._onWorkProgressEventAttached) {
            if (GTPFileClient._isIE)
                this._obj.attachEvent("OnFileWorkProgress", GTPFileClient._triggerWorkProgressEvent);
            else
                this._obj.AttachOnFileWorkProgressEvent(GTPFileClient._triggerWorkProgressEvent);
            GTPFileClient._onWorkProgressEventAttached = true;
        }
        GTPFileClient._onWorkProgressEvent = eventFunc;
    }
};

//附加文件传输结束事件处理函数
GTPFileClient.AttachWorkFinishEvent = function (eventFunc) {
    if (GTPFileClient.PluginInstalled) {
        if (!GTPFileClient._onWorkFinishEventAttached) {
            if (GTPFileClient._isIE)
                this._obj.attachEvent("OnFileWorkFinish", GTPFileClient._triggerWorkFinishEvent);
            else
                this._obj.AttachOnFileWorkFinishEvent(GTPFileClient._triggerWorkFinishEvent);
            GTPFileClient._onWorkFinishEventAttached = true;
        }
        GTPFileClient._onWorkFinishEvent = eventFunc;
    }
};

GTPFileClient._initial = function (tryConnect, customServerRootUrl) {
    if (!GTPFileClient.PluginInstalled) {
        //2012.3.16 陶松需求，仅在对象被调用时判断
        GTPFileClient._displayInstallBar();  //在页面顶部显示安装提示  
        return false;
    }

    if (this._fileServerUrl == "" || this._fileServerGuid == "" || this._authorizeKey == "") {
        return false;
    }

    if (!GTPFileClient._initialized) {
        if (!GTPFileClient._isIE) {
            //FireFox 浏览器需要触发事件，以避免被认为插件崩溃
            if (!GTPFileClient._onWorkFinishEventAttached) {
                this._obj.AttachOnFileWorkFinishEvent(GTPFileClient._triggerWorkFinishEvent);
                GTPFileClient._onWorkFinishEventAttached = true;
            }
            if (!GTPFileClient._onWorkProgressEventAttached) {
                this._obj.AttachOnFileWorkProgressEvent(GTPFileClient._triggerWorkProgressEvent);
                GTPFileClient._onWorkProgressEventAttached = true;
            }
            if (!GTPFileClient._onWorkStartEventAttached) {
                this._obj.AttachOnFileWorkStartEvent(GTPFileClient._triggerWorkStartEvent);
                GTPFileClient._onWorkStartEventAttached = true;
            }
        }

        this._obj.Initial(this._authorizeKey, this._langID);
        GTPFileClient._initialized = true;

        try {
            GTPFileClient._obj.FileClientGetProgressInfo(); //不出错说明是新版 ActiveX
            GTPFileClient._supportProgressDiv = false; //TP-18758 xp+ie8 文件下载-覆盖原文件下载时浏览器卡死 TP-18843 暂时改回使用模态窗口显示进度

        }
        catch (e) { }

        GTPFileClient._supportProgressDiv = GTPFileClient._supportProgressDiv && GTPFileClient._isIE; //非 IE 浏览器，仍需要弹出进度对话框，因为一旦开始，页面会失去响应，可考虑显示在控件界面上
        GTPFileClient.FileClientSetOptionUseProgressDiv(GTPFileClient._supportProgressDiv);
        GTPFileClient.FileClientSetOptionSilent(false); //默认不弹出进度框        
    }

    if (tryConnect) {
        var serverUrl = this._fileServerUrl;
        if (customServerRootUrl != undefined && customServerRootUrl != "")
            serverUrl = customServerRootUrl;
        return GTPFileClient.FileClientConnect(this._fileServerGuid, serverUrl, "");
    }
    else
        return true;
};

GTPFileClient._getPluginInstalled = function () {
    var installed = false;
    if (GTPFileClient._obj) {
        try {
            if (GTPFileClient._obj.ShellGetLocalTempDir())
                installed = true;
        }
        catch (e) {
            //alert(e);
        }
    }
    return installed;
};

GTPFileClient.GetPluginDownloadURL = function () {
    var rootUrl = this._getLocationRootDir();
    if (!rootUrl.endWith("/")) {
        rootUrl += "/";
    }

    return rootUrl + "ClientFiles/GTP_6_BrowserPlugin_Setup.exe";
};

GTPFileClient._getCookie = function (name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name)
            return arr[1];
    }
    return "";
};

GTPFileClient.FileClientConnected = function () {
    if (!this._initial()) return undefined;
    return this._obj.FileClientConnected();
};

GTPFileClient.FileClientConnect = function (ServerGUID, ServerRootUrl, OptionsXML) {
    if (!this._initial()) return undefined;

    //cookie ROUTEID 的值用于apache反向代理方式的集群部署的环境
    //设置此 cookie 值，可正确的将临时文件上传至 APP 后台服务器、永久文件上传至文件服务的后台服务器
    //使用其他反向代理时， cookie 名称可能不同，要及时添加
    var apache_route = GTPFileClient._getCookie("ROUTEID");
    if (apache_route != null && apache_route != "")
        this._obj.FileClientAddCookies("ROUTEID=" + apache_route);

    var ret = this._obj.FileClientConnect(ServerGUID, ServerRootUrl, OptionsXML);

    //if (!ret)
    //    alert("无法连接文件服务：" + ServerRootUrl + "\r\n" + GTPFileClient.FileClientLastErrorMessage());
    return ret;
};

GTPFileClient.FileClientDisConnect = function () {
    if (!this._initial()) return undefined;
    return this._obj.FileClientDisConnect();
};

GTPFileClient.FileClientDoCancel = function () {
    if (!this._initial()) return undefined;
    GTPFileClient.ProgressDiv.Close();
    GTPFileClient._working = false;
    return this._obj.FileClientDoCancel();
};

GTPFileClient.FileClientSetOptionLanguage = function (LangID) {
    if (!this._initial()) return undefined;
    this._langID = LangID;
    return this._obj.FileClientSetOptionLanguage(LangID);
};

GTPFileClient.FileClientSetOptionAppNamespace = function (AppNamespace) {
    if (!this._initial()) return undefined;
    return this._obj.FileClientSetOptionAppNamespace(AppNamespace);
};

GTPFileClient.FileClientSetOptionEncryptWhenUpload = function (Encrypt) {
    if (!this._initial()) return undefined;
    return this._obj.FileClientSetOptionEncryptWhenUpload(Encrypt);
};

GTPFileClient.FileClientSetOptionUseProgressDiv = function (use) {
    if (use) {
        GTPFileClient._useProgressDiv = GTPFileClient._supportProgressDiv;
        GTPFileClient.FileClientSetOptionNeedProgressInfo(true);
    }
    else
        GTPFileClient._useProgressDiv = false;
};

GTPFileClient.FileClientSetOptionSilent = function (Silent) {
    if (!this._initial()) return undefined;
    if (Silent) {
        GTPFileClient._useProgressDiv = false;
        return this._obj.FileClientSetOptionSilent(true);
    }
    else {
        if (GTPFileClient._supportProgressDiv) {
            GTPFileClient.FileClientSetOptionUseProgressDiv(true);
            return this._obj.FileClientSetOptionSilent(true);
        }
        else {
            return this._obj.FileClientSetOptionSilent(false);
        }
    }
};

GTPFileClient.FileClientSetOptionActivateFileAfterUpload = function (Activate) {
    if (!this._initial()) return undefined;
    return this._obj.FileClientSetOptionActivateFileAfterUpload(Activate);
};

GTPFileClient.FileClientSetOptions = function (OptionsXML) {
    if (!this._initial()) return undefined;
    return this._obj.FileClientSetOptions(OptionsXML);
};

GTPFileClient.FileClientSetOptionDownloadResumeBroken = function (resume) {
    GTPFileClient.FileClientSetOptions('<?xml version="1.0" encoding="UTF-8"?><options><DownloadResumeBroken value="' +
        (resume ? 'True' : 'False') + '" /></options>');
};

GTPFileClient.FileClientSetOptionUploadResumeBroken = function (resume) {
    GTPFileClient.FileClientSetOptions('<?xml version="1.0" encoding="UTF-8"?><options><UploadResumeBroken value="' +
        (resume ? 'True' : 'False') + '" /></options>');
};

GTPFileClient.FileClientSetOptionNeedProgressInfo = function (need) {
    GTPFileClient._needProgressInfo = need;
    GTPFileClient.FileClientSetOptions('<?xml version="1.0" encoding="UTF-8"?><options><NeedProgressInfo value="' +
        (need ? 'True' : 'False') + '" /></options>');
};

GTPFileClient.ProgressDiv = {
    _poped: false,
    _body_old_margin: null,
    _setProgressPos: function (pos) {
        var bar = document.getElementById("GTPFileClientProgressBar");
        if (bar) {
            bar.style.width = pos + "%";
            //bar.innerHTML = bar.style.width;
        }
    },
    Close: function () {
        GTPFileClient.ProgressDiv._setProgressPos(0);
        if (GTPFileClient.ProgressDiv._body_old_margin != null)
            document.body.style.margin = GTPFileClient.ProgressDiv._body_old_margin;

        var lblTop = document.getElementById("div_beforeGTPFileClientProgressBar");
        if (lblTop)
            lblTop.innerHTML = "";
        var lblBottom = document.getElementById("div_afterGTPFileClient_single_progress");
        if (lblBottom)
            lblBottom.innerHTML = "";
        var lblBottom2 = document.getElementById("div_afterGTPFileClient_all_progress");
        if (lblBottom2) {
            lblBottom2.innerHTML = "";
        }
        var speed = document.getElementById("div_afterGTPFileClient_speed");
        if (speed) {
            speed.innerHTML = "";
        }
        var time_remaining = document.getElementById("div_afterGTPFileClient_time_remaining");
        if (time_remaining) {
            time_remaining.innerHTML = "";
        }


        var md = document.getElementById("GTPFileClientProgressMainDiv");
        if (md)
            md.style.display = "none";
        var pd = document.getElementById("GTPFileClientProgressPopDiv");
        if (pd)
            pd.style.display = "none";

        GTPFileClient.ProgressDiv._poped = false;
        GTPFileClient._ProgressInfoLastFilePos = 0;
        GTPFileClient._ProgressInfoLastTotalPos = 0;
    },
    Show: function (progressInfo, eWidth, eHeight) {
        function _tryCreateElements(eWidth, eHeigtht) {
            if (document.getElementById("div_GTPFileClientProgress") != null)
                return;

            var md = '<div id="GTPFileClientProgressMainDiv" style="display: none; background: #77887E; height: 100%;left: 0%;top: 0%; right: 0%;width: 100%; position: absolute; z-index: 10000001;"></div>';

            var pd = '<div id="GTPFileClientProgressPopDiv" style="display: none; background: #fff; border:1px solid #ccc;height: ' + eHeigtht + 'px; width: ' + eWidth + 'px;position: absolute; z-index: 10000002" >' +
	    		    '<div style="height: 30px; background: #d3e7f7; text-indent: 10px; line-height: 30px; font-size:14px; font-weight: bold; border-bottom: 1px solid #ccc; font-family:Microsoft yahei">文件传输</div>' +
                    '<div id="div_beforeGTPFileClientProgressBar" style="margin:12px 13px 5px; text-align: right; overflow: hidden;white-space: nowrap;font-size:12px;height:20px"></div>' +
                        '<div style="margin:0 13px; height: 13px; background-color:#e1e5e6">' +
                                '<div id="GTPFileClientProgressBar" style="width:0%; background: #76c947; height: 100%;">' +
                                '</div>' +
                        '</div>' +
					    '<div id="div_afterGTPFileClientProgressBar" style="margin:3px 13px 3px;  font-size: 12px;height: 20px; line-height: 20px">' +
                                '<div style="float:left; text-align:left" id="div_afterGTPFileClient_speed"></div>' +
                                '<div style="float:right; text-align:right" id="div_afterGTPFileClient_single_progress"></div>' +
                        '</div>' +
                        '<div id="div_afterGTPFileClientProgressBar2" style="margin-left: 15px;margin:0 13px; font-size: 12px;height: 20px; line-height: 20px">' +
                               '<div style="float:left; text-align:left" id="div_afterGTPFileClient_time_remaining"></div>' +
                               '<div style="float:right; text-align:right" id="div_afterGTPFileClient_all_progress"></div>' +
                        '</div>' +
                        '<div style="height: 45px; background-color: #FAFAFA; margin-top:6px; text-align:right;overflow: hidden;">' +
                                  '<button onclick="GTPFileClient.FileClientDoCancel()" style=" margin:8px 10px 0 0; width:70px"> 取消</button>' +
                        '</div>' +
			        '</div>';

            var div = document.createElement("div");
            div.setAttribute("id", "div_GTPFileClientProgress");
            div.innerHTML = md + pd;

            document.body.appendChild(div);
        }

        function _popDiv(eWidth, eHeigtht) {
            if (GTPFileClient.ProgressDiv._poped) return;
            GTPFileClient.ProgressDiv._poped = true;

            if (!eWidth)
                eWidth = 360;
            if (!eHeigtht)
                eHeigtht = 178;
            var doc = document, isCSS1 = doc.compatMode == "CSS1Compat", MAX = Math.max;

            _tryCreateElements(eWidth, eHeigtht);

            var b = document.body;

            //设置边距为0，是为了全屏遮盖，否则上、右两边会留有边距，不能全屏遮盖
            var maskHeight = MAX(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, (isCSS1 ? doc.documentElement.clientHeight : doc.body.clientHeight));
            GTPFileClient.ProgressDiv._body_old_margin = b.style.margin;
            b.style.margin = 0;
            var mask = document.getElementById("GTPFileClientProgressMainDiv");
            mask.style.display = "block";
            mask.style.filter = "alpha(opacity=60)";
            mask.style.opacity = '0.6';
            mask.style.height = maskHeight + "px";

            //clientWidth取的是实际窗口文档域的大小
            var _x = b.clientWidth;
            //var _y = MAX(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, (isCSS1 ? doc.documentElement.clientHeight : doc.body.clientHeight));
            var _y = isCSS1 ? doc.documentElement.clientHeight : doc.body.clientHeight;
            var t = (! +[1, ]) ? doc.documentElement.scrollTop : window.pageYOffset; //(! +[1, ])判断是否ie浏览器
            var a_w = eWidth;
            var a_h = eHeigtht;
            //计算弹出层的位置，目的是要显示在正中间
            var dleft = _x / 2 - a_w / 2;
            var dtop = _y / 2 - a_h / 2 + t;
            var cd = document.getElementById("GTPFileClientProgressPopDiv").style;
            cd.left = dleft + "px";
            cd.top = dtop + "px";
            cd.display = "block";
        }

        function outputDollars(num) {
            var s = num.toString();
            if (s.length <= 3)
                return (s == '' ? '0' : s);
            else {
                var mod = s.length % 3;     //值为3的余数
                var output = (mod == 0 ? '' : (s.substring(0, mod)));
                for (i = 0; i < Math.floor(s.length / 3); i++) {
                    if ((mod == 0) && (i == 0))
                        output += s.substring(mod + 3 * i, mod + 3 * i + 3);
                    else
                        output += ',' + s.substring(mod + 3 * i, mod + 3 * i + 3);
                }
                return (output);
            }
        }

        function _showProgressInfo(info) {
            var per = 0;

            if (info.Action == "downloadTemp" || info.TotalCount == 1) { //没有整体进度
                if (parseInt(info.CurrentFileSize) > 0)
                    per = Math.round(parseInt(info.CurrentFilePosition) * 100 / parseInt(info.CurrentFileSize));
            }
            else {
                if (parseInt(info.TotalFileSize) > 0) //多个文件，并且可得到整体进度
                    per = Math.round(parseInt(info.TotalFilePosition) * 100 / parseInt(info.TotalFileSize));
            }

            if (per < 0)
                per = 0;
            if (per > 100)
                per = 100;
            GTPFileClient.ProgressDiv._setProgressPos(per);

            var lblTop = document.getElementById("div_beforeGTPFileClientProgressBar");
            if (info.CurrentFileName.length > 35) {
                lblTop.innerHTML = "../" + info.CurrentFileName.substr(info.CurrentFileName.length - 30); //; //TODO 如果文件名带路径过长,可只显示文件名
            } else {
                lblTop.innerHTML = info.CurrentFileName; //TODO 如果文件名带路径过长,可只显示文件名
            }

            var lblBottom = document.getElementById("div_afterGTPFileClient_single_progress");
            var lblBottom2 = document.getElementById("div_afterGTPFileClient_all_progress");
            var speed = document.getElementById("div_afterGTPFileClient_speed");
            var time_remaining = document.getElementById("div_afterGTPFileClient_time_remaining");


            if (info.Action == "downloadTemp" || info.TotalCount <= 1)  //downloadTemp 没有整体进度/ upload\uploadTemp\download\downloadTemp
            {
                var s = outputDollars(Math.round(info.CurrentFilePosition / 1024)) + "/" + outputDollars(Math.round(info.CurrentFileSize / 1024)) + " KB";
                if (info.BytesPerSec > 0)
                // s += "; " + outputDollars(Math.round(info.BytesPerSec / 1024)) + " KB/S";
                    speed.innerHTML = '速度:' + outputDollars(Math.round(info.BytesPerSec / 1024)) + " KB/S";

                if (info.TotalCount > 1) {
                    if (info.Action == "downloadTemp")
                        s = "当前(" + info.CurrentFileIndex + "/" + info.TotalCount + ")：" + s;
                    else
                        s = "当前：" + s;
                }
                else if (info.BytesPerSec > 0) {
                    var leftSec = Math.round((info.CurrentFileSize - info.CurrentFilePosition) / info.BytesPerSec);
                    var leftMin = Math.round((leftSec + 59) / 60);
                    if (leftSec >= 60)
                    // s += "; 剩余时间 " + leftMin + "分钟";
                        time_remaining.innerHTML = "剩余时间 " + leftMin + "分钟";
                    else
                    //s += "; 剩余时间 " + leftSec + "秒";
                        time_remaining.innerHTML = " 剩余时间 " + leftSec + "秒";

                }
                lblBottom.innerHTML = s;
            }
            else {
                var s = outputDollars(Math.round(info.CurrentFilePosition / 1024)) + "/" + outputDollars(Math.round(info.CurrentFileSize / 1024)) + " KB";
                if (info.BytesPerSec > 0)
                //s += "; " + outputDollars(Math.round(info.BytesPerSec / 1024)) + " KB/S";
                    speed.innerHTML = '速度:' + outputDollars(Math.round(info.BytesPerSec / 1024)) + " KB/S";
                var sLeft = "";
                if (info.BytesPerSec > 0) {
                    var leftSec = Math.round((info.TotalFileSize - info.TotalFilePosition) / info.BytesPerSec);
                    var leftMin = Math.round(leftSec / 60);
                    if (leftSec >= 60)
                    //sLeft = "; 剩余时间 " + leftMin + "分钟";
                        time_remaining.innerHTML = "剩余时间 " + leftMin + "分钟";
                    else
                    //sLeft = "; 剩余时间 " + leftSec + "秒";
                        time_remaining.innerHTML = " 剩余时间 " + leftSec + "秒";
                }

                if (info.TotalCount <= 1) {
                    lblBottom.innerHTML = s + sLeft;
                }
                else {
                    lblBottom.innerHTML = "当前(" + info.CurrentFileIndex + "/" + info.TotalCount + ")：" + s;
                    var s2 = "整体：" + outputDollars(Math.round(info.TotalFilePosition / 1024)) + "/" + outputDollars(Math.round(info.TotalFileSize / 1024)) + " KB" + sLeft;
                    lblBottom2.innerHTML = s2;
                }
            }
        }

        _popDiv(eWidth, eHeight);
        _showProgressInfo(progressInfo);
    }
};

GTPFileClient._hideProgressInfoDiv = function () {
    GTPFileClient.ProgressDiv.Close();
};

GTPFileClient._showProgressInfoDiv = function (progressInfo) {
    GTPFileClient.ProgressDiv.Close();
    if (GTPFileClient._useProgressDiv) {
        GTPFileClient.ProgressDiv.Show(progressInfo);
    }
};

GTPFileClient._getProgressInfo = function () {
    if (GTPFileClient._working && (GTPFileClient._needProgressInfo || GTPFileClient._useProgressDiv)) {

        if (!GTPFileClient._onWorkStartEvent)
            GTPFileClient.AttachWorkStartEvent(GTPFileClient._getProgressInfo); //由 ActiveX 来触发
        if (!GTPFileClient._onWorkProgressEvent)
            GTPFileClient.AttachWorkProgressEvent(GTPFileClient._getProgressInfo); //由 ActiveX 来触发
        if (!GTPFileClient._onWorkFinishEvent)
            GTPFileClient.AttachWorkFinishEvent(GTPFileClient._getProgressInfo); //由 ActiveX 来触发
        function ProgressInfoToResultObj(xmlResultString) {
            var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
            var rootNode = xmlDoc.getElementsByTagName("result")[0];

            this.Success = rootNode.getAttribute("return") == "0";
            this.Canceled = rootNode.getAttribute("canceled").toLowerCase() == "true";
            this.TotalCount = rootNode.getAttribute("totalCount");
            this.CurrentFileIndex = rootNode.getAttribute("currentFileIndex");
            this.TotalFileSize = rootNode.getAttribute("totalFileSize");
            this.CompletedFileSize = rootNode.getAttribute("completedFileSize");
            this.TotalFilePosition = rootNode.getAttribute("totalFilePosition");
            this.CurrentFileSize = rootNode.getAttribute("currentFileSize");
            this.CurrentFilePosition = rootNode.getAttribute("currentFilePosition");
            this.BytesPerSec = rootNode.getAttribute("bytesPerSec");
            this.CurrentFileName = rootNode.getAttribute("currentFileName");
            this.XML = xmlResultString;

            this.Action = GTPFileClient._action;

            if (this.CurrentFileIndex == GTPFileClient._ProgressInfoLastFileIndex) {
                if (this.CurrentFilePosition < GTPFileClient._ProgressInfoLastFilePos)
                    this.CurrentFilePosition = GTPFileClient._ProgressInfoLastFilePos;
                if (this.TotalFilePosition < GTPFileClient._ProgressInfoLastTotalPos)
                    this.TotalFilePosition = GTPFileClient._ProgressInfoLastTotalPos;
            }
            else {
                GTPFileClient._ProgressInfoLastFileIndex = this.CurrentFileIndex;
            }
            GTPFileClient._ProgressInfoLastFilePos = this.CurrentFilePosition;
            GTPFileClient._ProgressInfoLastTotalPos = this.TotalFilePosition;
        }

        try {
            if (GTPFileClient._useProgressDiv || GTPFileClient._progressInfoChangedEvent) {
                var infoXml = GTPFileClient._obj.FileClientGetProgressInfo();
                var result = new ProgressInfoToResultObj(infoXml);
                if (GTPFileClient._progressInfoChangedEvent)
                    GTPFileClient._progressInfoChangedEvent(result);
                if (GTPFileClient._useProgressDiv)
                    GTPFileClient._showProgressInfoDiv(result);
            }
        } catch (ex) {
            GTPFileClient._hideProgressInfoDiv();
            return; //兼容老版本的 ActiveX           
        }
    }
    else {
        GTPFileClient._hideProgressInfoDiv();
        return;
    }
};

GTPFileClient.FileClientCloseProgressDialog = function () {
    if (!this._initial()) return undefined;
    return this._obj.FileClientCloseProgressDialog();
};

GTPFileClient.FileClientUploadExAsync = function (callBackFun, LocalFilenameList, FileIDList, EditGuidList,
      ExtendAttributeList, DescriptionList, AppNamespace, Timeout, CompareOption, CloseTheProgressDialog) {
    function myUpload() {
        var result = GTPFileClient.FileClientUploadEx(LocalFilenameList, FileIDList, EditGuidList,
            ExtendAttributeList, DescriptionList, AppNamespace, Timeout, CompareOption, CloseTheProgressDialog);
        if (callBackFun) {
            callBackFun(result);
        }
    }
    setTimeout(myUpload, 50);
};

GTPFileClient.FileClientUploadAsync = function (callBackFun, LocalFilenameList, FileIDList, EditGuidList,
      ExtendAttributeList, DescriptionList, AppNamespace, CompareOption, CloseTheProgressDialog) {
    GTPFileClient.FileClientUploadExAsync(callBackFun, LocalFilenameList, FileIDList, EditGuidList,
      ExtendAttributeList, DescriptionList, AppNamespace, 0, CompareOption, CloseTheProgressDialog);
};

GTPFileClient.FileClientUploadEx = function (LocalFilenameList, FileIDList, EditGuidList,
      ExtendAttributeList, DescriptionList, AppNamespace, Timeout, CompareOption, CloseTheProgressDialog) {

    function GTPFileClientUploadResultFile(xmlFileNode) {
        this.FileID = xmlFileNode.getAttribute("NewFileID");
        this.ViewGuid = xmlFileNode.getAttribute("ViewGUID");
        this.EditGuid = xmlFileNode.getAttribute("EditGUID");
        this.FileName = xmlFileNode.getAttribute("FileName");
        this.Result = xmlFileNode.getAttribute("Result");

        this.OldFileID = xmlFileNode.getAttribute("OldFileID");
        this.LocalFileName = xmlFileNode.getAttribute("LocalFileName");
        this.FileSize = xmlFileNode.getAttribute("FileSize");
        this.CreateTime = xmlFileNode.getAttribute("CreateTime");
        this.ModifyTime = xmlFileNode.getAttribute("ModifyTime");
        this.UtcCreateTime = xmlFileNode.getAttribute("UtcCreateTime");
        this.UtcModifyTime = xmlFileNode.getAttribute("UtcModifyTime");
        this.FileDesc = xmlFileNode.getAttribute("FileDesc");
        this.ExtendAttribute = xmlFileNode.getAttribute("ExtendAttribute");
        this.FileHash = xmlFileNode.getAttribute("FileHash");
        this.HashAlgorithm = xmlFileNode.getAttribute("HashAlgorithm");
    }

    function GTPFileClientUploadResult(xmlResultString) {
        if (xmlResultString == null || xmlResultString == undefined || xmlResultString == "") {
            this.Result = false;
        }
        var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
        var rootNode = xmlDoc.getElementsByTagName("result")[0];
        this.Result = rootNode.getAttribute("return");
        this.Canceled = rootNode.getAttribute("canceled");
        this.CompletedCount = rootNode.getAttribute("completedCount");
        this.TotalCount = rootNode.getAttribute("totalCount");
        this.FailFileID = rootNode.getAttribute("failFileID");
        this.FailFileName = rootNode.getAttribute("failFileName");
        this.ErrorCode = rootNode.getAttribute("errorCode");
        this.ErrorMessage = rootNode.getAttribute("errorMessage");
        this.XML = xmlResultString;
        this.Files = new Array();

        var selObjects = rootNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Files.push(new GTPFileClientUploadResultFile(selObjects[i]));
        }
    }

    if (!this._initial(true)) return;
    if (FileIDList == undefined)
        FileIDList = "";
    if (EditGuidList == undefined)
        EditGuidList = "";
    if (ExtendAttributeList == undefined)
        ExtendAttributeList = "";
    if (DescriptionList == undefined)
        DescriptionList = "";
    if (Timeout == undefined)
        Timeout = 0;
    if (CompareOption == undefined)
        CompareOption = 0;
    if (CloseTheProgressDialog == undefined)
        CloseTheProgressDialog = true;

    if (AppNamespace && AppNamespace != "")
        this._obj.FileClientSetOptionAppNamespace(AppNamespace);

    GTPFileClient._working = true;
    try {
        GTPFileClient._action = "upload";
        GTPFileClient._getProgressInfo();
        var resultStr = this._obj.FileClientUploadEx(LocalFilenameList, FileIDList, EditGuidList,
          ExtendAttributeList, DescriptionList, Timeout, CompareOption, CloseTheProgressDialog);

        GTPFileClient._working = false;
        if (CloseTheProgressDialog)
            GTPFileClient._hideProgressInfoDiv();

        return new GTPFileClientUploadResult(resultStr);
    } catch (e) {
        GTPFileClient._working = false;
        throw (e);
    }
};

// active是否激活，true:激活，false:不激活，默认是激活的
GTPFileClient.FileClientUpload = function (LocalFilenameList, FileIDList, EditGuidList,
      ExtendAttributeList, DescriptionList, AppNamespace, CompareOption, CloseTheProgressDialog, active) {

    var upResult = GTPFileClient.FileClientUploadEx(LocalFilenameList, FileIDList, EditGuidList,
                        ExtendAttributeList, DescriptionList, AppNamespace, 0, CompareOption, CloseTheProgressDialog);

    if (active == undefined || active == null) {
        active = true;
    }
    if (!active) {
        // 设置 active 为false，1天后会被删除 
        if (upResult.Result && upResult.Files) {
            for (var i = 0; i < upResult.Files.length; i++) {
                GTPFileClient.SetFileActive(active, upResult.Files[i].FileID, upResult.Files[i].EditGuid);
            }
        }
    }

    return upResult;
};

GTPFileClient.FileClientUploadTemp = function (LocalFilenameList, SavePathAtServer, SaveNameAtServerList, CloseTheProgressDialog) {

    function GTPFileClientUploadTempResultFile(xmlFileNode) {
        this.FileID = "";   //xmlFileNode.getAttribute("NewFileID");
        this.ViewGuid = ""; //xmlFileNode.getAttribute("ViewGUID");
        this.EditGuid = ""; //xmlFileNode.getAttribute("EditGUID");
        this.FileName = xmlFileNode.getAttribute("FileName");
        this.LocalFileName = xmlFileNode.getAttribute("LocalFileName");
        this.Result = xmlFileNode.getAttribute("Result");
        this.PathAtServer = xmlFileNode.getAttribute("PathAtServer");
        this.FileNameAtServer = xmlFileNode.getAttribute("FileNameAtServer");
    }

    function GTPFileClientUploadTempResult(xmlResultString) {
        var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
        var rootNode = xmlDoc.getElementsByTagName("result")[0];
        this.Result = rootNode.getAttribute("return");
        this.Canceled = rootNode.getAttribute("canceled");
        this.CompletedCount = rootNode.getAttribute("completedCount");
        this.TotalCount = rootNode.getAttribute("totalCount");
        this.FailFileID = rootNode.getAttribute("failFileID");
        this.FailFileName = rootNode.getAttribute("failFileName");
        this.ErrorCode = rootNode.getAttribute("errorCode");
        this.ErrorMessage = rootNode.getAttribute("errorMessage");
        this.XML = xmlResultString;
        this.Files = new Array();

        var selObjects = rootNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Files.push(new GTPFileClientUploadTempResultFile(selObjects[i]));
        }
    }

    var webServerUrl = GTPFileClient._getLocationRootFullUrl();
    if (!this._initial(true, webServerUrl)) return undefined;

    if (SaveNameAtServerList == undefined)
        SaveNameAtServerList = "";

    if (CloseTheProgressDialog == undefined)
        CloseTheProgressDialog = true;

    GTPFileClient._working = true;
    try {
        GTPFileClient._action = "uploadTemp";
        GTPFileClient._getProgressInfo();
        var resultStr = this._obj.FileClientUploadTemp(LocalFilenameList, SavePathAtServer, SaveNameAtServerList, CloseTheProgressDialog);

        GTPFileClient._working = false;
        if (CloseTheProgressDialog)
            GTPFileClient._hideProgressInfoDiv();

        return new GTPFileClientUploadTempResult(resultStr);
    } catch (e) {
        GTPFileClient._working = false;
        throw (e);
    }
};

GTPFileClient.FileClientGetTempFileUrl = function (FileNameAtServer, PathAtServer) {
    //public const string Act_DownloadTemp_GetKey = "15";
    var rootUrl = GTPFileClient._getLocationRootDir();
    var ajaxUrl = rootUrl + "Services/FileService/downloadTemp.ashx?Act=15" +
        "&Algo=" + GTPFileClient._keyAlgo + "&PathAtServer=" + PathAtServer + "&FileNameAtServer=" + FileNameAtServer
    var key = GTPFileClient._ajaxSyncCall(ajaxUrl);
    var downloadUrl = rootUrl + "Services/FileService/downloadTemp.ashx?Key=" + key +
       "&PathAtServer=" + PathAtServer + "&FileNameAtServer=" + FileNameAtServer
    return downloadUrl;
};

GTPFileClient.FileClientBrowserDownloadTempFile = function (FileNameAtServer, PathAtServer) {
    var url = GTPFileClient.FileClientGetTempFileUrl(FileNameAtServer, PathAtServer);
    GTPFileClient.FileClientDownloadByJudgeBrowser(url);
};

GTPFileClient.FileClientDownloadTemp = function (FileNameAtServerList, PathAtServer,
    SaveToLocalFileNameList, CloseTheProgressDialog) {
    function GTPFileClientDownloadTempResultFile(xmlFileNode) {
        this.Result = xmlFileNode.getAttribute("Result");
        this.PathAtServer = xmlFileNode.getAttribute("PathAtServer");
        this.FileNameAtServer = xmlFileNode.getAttribute("FileNameAtServer");
        this.SaveToLocalFileName = xmlFileNode.getAttribute("SaveToLocalFileName");
    }
    function GTPFileClientDownloadTempResult(xmlResultString) {
        var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
        var rootNode = xmlDoc.getElementsByTagName("result")[0];
        this.Result = rootNode.getAttribute("return");
        this.Canceled = rootNode.getAttribute("canceled");
        this.CompletedCount = rootNode.getAttribute("completedCount");
        this.TotalCount = rootNode.getAttribute("totalCount");
        this.FailFileID = rootNode.getAttribute("failFileID");
        this.FailFileName = rootNode.getAttribute("failFileName");
        this.ErrorCode = rootNode.getAttribute("errorCode");
        this.ErrorMessage = rootNode.getAttribute("errorMessage");
        this.XML = xmlResultString;
        this.Files = new Array();

        var selObjects = rootNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Files.push(new GTPFileClientDownloadTempResultFile(selObjects[i]));
        }
    }

    var webServerUrl = GTPFileClient._getLocationRootFullUrl();
    if (!this._initial(true, webServerUrl)) return undefined;

    if (CloseTheProgressDialog == undefined)
        CloseTheProgressDialog = true;

    SaveToLocalFileNameList = this._makeValidFilePathName(SaveToLocalFileNameList);

    GTPFileClient._working = true;
    try {
        GTPFileClient._action = "downloadTemp";
        GTPFileClient._getProgressInfo();
        var resultStr = this._obj.FileClientDownloadTemp(FileNameAtServerList, PathAtServer,
            SaveToLocalFileNameList, CloseTheProgressDialog);
        GTPFileClient._working = false;
        if (CloseTheProgressDialog)
            GTPFileClient._hideProgressInfoDiv();

        return new GTPFileClientDownloadTempResult(resultStr);
    } catch (e) {
        GTPFileClient._working = false;
        throw (e);
    }
};

GTPFileClient.FileClientUploadAppFiles = function (LocalFilenameList, SavePathAtServer, SaveNameAtServerList, CloseTheProgressDialog) {
    var result = GTPFileClient.FileClientUploadTemp(LocalFilenameList, ":AppFiles\\" + SavePathAtServer, SaveNameAtServerList, CloseTheProgressDialog);
    for (var i = 0; i < result.Files.length; i++) {
        result.Files[i].PathAtServer = SavePathAtServer;
    }
    return result;
};

GTPFileClient.FileClientDownloadAppFiles = function (FileNameAtServerList, PathAtServer,
    SaveToLocalFileNameList, CloseTheProgressDialog) {
    var result = GTPFileClient.FileClientDownloadTemp(FileNameAtServerList, ":AppFiles\\" + PathAtServer,
    SaveToLocalFileNameList, CloseTheProgressDialog);
    for (var i = 0; i < result.Files.length; i++) {
        result.Files[i].PathAtServer = PathAtServer;
    }
    return result;
};

GTPFileClient.FileClientGetAppFileUrl = function (FileNameAtServer, PathAtServer) {
    return GTPFileClient.FileClientGetTempFileUrl(FileNameAtServer, ":AppFiles\\" + PathAtServer);
};

GTPFileClient.FileClientBrowserDownloadAppFile = function (FileNameAtServer, PathAtServer) {
    var url = GTPFileClient.FileClientGetAppFileUrl(FileNameAtServer, PathAtServer);
    GTPFileClient.FileClientDownloadByJudgeBrowser(url);
};

GTPFileClient.FileClientGetDownloadUrl = function (fileID, viewGuid, del, editGuid) {
    var rootUrl = GTPFileClient._fileServerUrl;
    if (!rootUrl.endWith("/"))
        rootUrl += "/";
    var webServerUrl = GTPFileClient._getLocationRootFullUrl();
    //public const string Act_UrlDownload_GetUrl = "18";
    var ajaxUrl = webServerUrl + "Services/FileService/urlDownload.ashx?Act=18" +
        "&FileID=" + fileID + "&viewGuid=" + viewGuid;
    var downloadUrl = GTPFileClient._ajaxSyncCall(ajaxUrl);
    if (del)
        downloadUrl += "&del=1&editGuid=" + editGuid;
    return downloadUrl;
};

GTPFileClient.FileClientBrowserDownload = function (fileID, viewGuid, del, editGuid) {
    var url = GTPFileClient.FileClientGetRedirectDownloadUrl(fileID, viewGuid, del, editGuid);
    GTPFileClient.FileClientDownloadByJudgeBrowser(url);
};

GTPFileClient.FileClientBrowserRedirectDownload = function (fileID, viewGuid, del, editGuid) {
    var url = GTPFileClient.FileClientGetRedirectDownloadUrl(fileID, viewGuid, del, editGuid);
    GTPFileClient.FileClientDownloadByJudgeBrowser(url);
};

GTPFileClient.FileClientDownloadByJudgeBrowser = function (url) {
    if (/(chrome)/i.test(window.navigator.userAgent)) {
        var a = document.createElement("a");
        a.href = url;
        a.target = "_self";
        var e = document.createEvent("MouseEvent");
        e.initEvent("click", false, false);
        a.dispatchEvent(e);
        delete a;
        delete e;
    } else {
        window.open(url);
    }
};

GTPFileClient.FileClientGetRedirectDownloadUrl = function (fileID, viewGuid, del, editGuid) {
    var rootUrl = GTPFileClient._fileServerUrl;
    if (!rootUrl.endWith("/"))
        rootUrl += "/";
    var webServerUrl = GTPFileClient._getLocationRootFullUrl();
    //public const string Act_UrlDownload_GetUrl = "21";
    var ajaxUrl = webServerUrl + "Services/FileService/urlDownload.ashx?Act=21" +
        "&FileID=" + fileID + "&viewGuid=" + viewGuid;
    var downloadUrl = GTPFileClient._ajaxSyncCall(ajaxUrl);
    if (del)
        downloadUrl += "&del=1&editGuid=" + editGuid;
    return downloadUrl;
};

GTPFileClient.FileClientDownloadAsync = function (callBackFun, FileIDList, ViewGuidList, SaveToFilenameList,
      CompareOption, CloseTheProgressDialog) {
    function myDownload() {
        var result = GTPFileClient.FileClientDownload(FileIDList, ViewGuidList, SaveToFilenameList,
            CompareOption, CloseTheProgressDialog);
        if (callBackFun) {
            callBackFun(result);
        }
    }
    setTimeout(myDownload, 50);
};

GTPFileClient.FileClientDownload = function (FileIDList, ViewGuidList, SaveToFilenameList,
      CompareOption, CloseTheProgressDialog) {
    function GTPFileClientDownloadResultFile(xmlFileNode) {
        this.FileID = xmlFileNode.getAttribute("FileID");
        this.FileName = xmlFileNode.getAttribute("FileName");
        this.Result = xmlFileNode.getAttribute("Result");
    }
    function GTPFileClientDownloadResult(xmlResultString) {
        var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
        var rootNode = xmlDoc.getElementsByTagName("result")[0];
        this.Result = rootNode.getAttribute("return");
        this.Canceled = rootNode.getAttribute("canceled");
        this.CompletedCount = rootNode.getAttribute("completedCount");
        this.TotalCount = rootNode.getAttribute("totalCount");
        this.FailFileID = rootNode.getAttribute("failFileID");
        this.FailFileName = rootNode.getAttribute("failFileName");
        this.ErrorCode = rootNode.getAttribute("errorCode");
        this.ErrorMessage = rootNode.getAttribute("errorMessage");
        this.XML = xmlResultString;
        this.Files = new Array();

        var selObjects = rootNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Files.push(new GTPFileClientDownloadResultFile(selObjects[i]));
        }
    }

    if (!this._initial(true)) return;
    if (FileIDList == undefined)
        FileIDList = "";
    if (ViewGuidList == undefined)
        ViewGuidList = "";
    if (SaveToFilenameList == undefined)
        SaveToFilenameList = "";
    if (CompareOption == undefined)
        CompareOption = 0;
    if (CloseTheProgressDialog == undefined)
        CloseTheProgressDialog = true;

    SaveToFilenameList = this._makeValidFilePathName(SaveToFilenameList);

    GTPFileClient._working = true;
    try {
        GTPFileClient._action = "download";
        GTPFileClient._getProgressInfo();
        var resultStr = this._obj.FileClientDownload(FileIDList, ViewGuidList, SaveToFilenameList,
      CompareOption, CloseTheProgressDialog);

        GTPFileClient._working = false;
        if (CloseTheProgressDialog)
            GTPFileClient._hideProgressInfoDiv();

        return new GTPFileClientDownloadResult(resultStr);
    } catch (e) {
        GTPFileClient._working = false;
        throw (e);
    }
};

GTPFileClient.FileClientDownloadAndDelete = function (FileIDList, ViewGuidList, EditGuidList,
      SaveToFilenameList, CompareOption, CloseTheProgressDialog) {
    function GTPFileClientDownloadAndDeleteResultFile(xmlFileNode) {
        this.FileID = xmlFileNode.getAttribute("FileID");
        this.FileName = xmlFileNode.getAttribute("FileName");
        this.Result = xmlFileNode.getAttribute("Result");
    }
    function GTPFileClientDownloadAndDeleteResult(xmlResultString) {
        var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
        var rootNode = xmlDoc.getElementsByTagName("result")[0];
        this.Result = rootNode.getAttribute("return");
        this.Canceled = rootNode.getAttribute("canceled");
        this.CompletedCount = rootNode.getAttribute("completedCount");
        this.TotalCount = rootNode.getAttribute("totalCount");
        this.FailFileID = rootNode.getAttribute("failFileID");
        this.FailFileName = rootNode.getAttribute("failFileName");
        this.ErrorCode = rootNode.getAttribute("errorCode");
        this.ErrorMessage = rootNode.getAttribute("errorMessage");
        this.XML = xmlResultString;
        this.Files = new Array();

        var selObjects = rootNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Files.push(new GTPFileClientDownloadAndDeleteResultFile(selObjects[i]));
        }
    }

    if (!this._initial(true)) return;
    if (FileIDList == undefined)
        FileIDList = "";
    if (ViewGuidList == undefined)
        ViewGuidList = "";
    if (EditGuidList == undefined)
        EditGuidList = "";
    if (SaveToFilenameList == undefined)
        SaveToFilenameList = "";
    if (CompareOption == undefined)
        CompareOption = 0;
    if (CloseTheProgressDialog == undefined)
        CloseTheProgressDialog = true;

    var resultStr = this._obj.FileClientDownloadAndDelete(FileIDList, ViewGuidList, EditGuidList,
      SaveToFilenameList, CompareOption, CloseTheProgressDialog);
    return new GTPFileClientDownloadAndDeleteResult(resultStr);
};

GTPFileClient.FileClientDelete = function (FileIDList, EditGuidList, FilenameList, CloseTheProgressDialog) {
    function GTPFileClientDeleteResultFile(xmlFileNode) {
        this.FileID = xmlFileNode.getAttribute("FileID");
        this.Result = xmlFileNode.getAttribute("Result");
    }
    function GTPFileClientDeleteResult(xmlResultString) {
        var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
        var rootNode = xmlDoc.getElementsByTagName("result")[0];
        this.Result = rootNode.getAttribute("return");
        this.Canceled = rootNode.getAttribute("canceled");
        this.CompletedCount = rootNode.getAttribute("completedCount");
        this.TotalCount = rootNode.getAttribute("totalCount");
        this.FailFileID = rootNode.getAttribute("failFileID");
        this.FailFileName = rootNode.getAttribute("failFileName");
        this.ErrorCode = rootNode.getAttribute("errorCode");
        this.ErrorMessage = rootNode.getAttribute("errorMessage");
        this.XML = xmlResultString;
        this.Files = new Array();

        var selObjects = rootNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Files.push(new GTPFileClientDeleteResultFile(selObjects[i]));
        }
    }

    if (!this._initial(true)) return;
    if (FileIDList == undefined)
        FileIDList = "";
    if (EditGuidList == undefined)
        EditGuidList = "";
    if (FilenameList == undefined)
        FilenameList = "";
    if (CloseTheProgressDialog == undefined)
        CloseTheProgressDialog = true;

    var resultStr = this._obj.FileClientDelete(FileIDList, EditGuidList, FilenameList, CloseTheProgressDialog);
    return new GTPFileClientDeleteResult(resultStr);
};


//通知文件服务，物理复制文件
GTPFileClient.FileClientPhysicalCopy = function (FileIDList, ViewGuidList, NewAppNamespace, NewDescList, NewExtendAttrList) {
    function GTPFileClientPhysicalCopyResultFile(xmlFileNode) {
        this.FileID = xmlFileNode.getAttribute("FileID");
        this.ViewGuid = xmlFileNode.getAttribute("ViewGUID");
        this.EditGuid = xmlFileNode.getAttribute("EditGUID");
        this.FileName = xmlFileNode.getAttribute("FileName");
        this.Result = xmlFileNode.getAttribute("Result");

        this.OldFileID = xmlFileNode.getAttribute("OldFileID");
        this.LocalFileName = xmlFileNode.getAttribute("LocalFileName");
        this.FileSize = xmlFileNode.getAttribute("FileSize");
        this.CreateTime = xmlFileNode.getAttribute("CreateTime");
        this.ModifyTime = xmlFileNode.getAttribute("ModifyTime");
        this.UtcCreateTime = xmlFileNode.getAttribute("UtcCreateTime");
        this.UtcModifyTime = xmlFileNode.getAttribute("UtcModifyTime");
        this.FileDesc = xmlFileNode.getAttribute("FileDesc");
        this.ExtendAttribute = xmlFileNode.getAttribute("ExtendAttribute");
        this.FileHash = xmlFileNode.getAttribute("FileHash");
        this.HashAlgorithm = xmlFileNode.getAttribute("HashAlgorithm");
    }
    function GTPFileClientPhysicalCopyResult(xmlResultString) {
        var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
        var rootNode = xmlDoc.getElementsByTagName("result")[0];
        this.Result = rootNode.getAttribute("return");
        this.Canceled = rootNode.getAttribute("canceled");
        this.CompletedCount = rootNode.getAttribute("completedCount");
        this.TotalCount = rootNode.getAttribute("totalCount");
        this.FailFileID = rootNode.getAttribute("failFileID");
        this.FailFileName = rootNode.getAttribute("failFileName");
        this.ErrorCode = rootNode.getAttribute("errorCode");
        this.ErrorMessage = rootNode.getAttribute("errorMessage");
        this.XML = xmlResultString;
        this.Files = new Array();

        var selObjects = rootNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Files.push(new GTPFileClientPhysicalCopyResultFile(selObjects[i]));
        }
    }

    if (!this._initial(true)) return;
    if (FileIDList == undefined)
        FileIDList = "";
    if (ViewGuidList == undefined)
        ViewGuidList = "";
    if (NewAppNamespace == undefined)
        NewAppNamespace = "";
    if (NewDescList == undefined)
        NewDescList = "";
    if (NewExtendAttrList == undefined)
        NewExtendAttrList = "";

    var resultStr = this._obj.FileClientPhysicalCopy(FileIDList, ViewGuidList, NewAppNamespace, NewDescList, NewExtendAttrList);
    return new GTPFileClientPhysicalCopyResult(resultStr);
}

//FileClient开头的函数，不能在页面的 pageload 事件中使用
GTPFileClient.FileClientGetInformation = function (FileIDList, ViewGuidList) {
    function GTPFileClientInformationResultFile(xmlFileNode) {
        this.FileID = xmlFileNode.getAttribute("FileID");
        this.ViewGuid = xmlFileNode.getAttribute("ViewGUID");
        this.EditGuid = xmlFileNode.getAttribute("EditGUID");
        this.FileName = xmlFileNode.getAttribute("FileName");
        this.Result = xmlFileNode.getAttribute("Result");

        this.OldFileID = xmlFileNode.getAttribute("OldFileID");
        this.LocalFileName = xmlFileNode.getAttribute("LocalFileName");
        this.FileSize = xmlFileNode.getAttribute("FileSize");
        this.CreateTime = xmlFileNode.getAttribute("CreateTime");
        this.ModifyTime = xmlFileNode.getAttribute("ModifyTime");
        this.UtcCreateTime = xmlFileNode.getAttribute("UtcCreateTime");
        this.UtcModifyTime = xmlFileNode.getAttribute("UtcModifyTime");
        this.FileDesc = xmlFileNode.getAttribute("FileDesc");
        this.ExtendAttribute = xmlFileNode.getAttribute("ExtendAttribute");
        this.FileHash = xmlFileNode.getAttribute("FileHash");
        this.HashAlgorithm = xmlFileNode.getAttribute("HashAlgorithm");
    }
    function GTPFileClientInformationResult(xmlResultString) {
        var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
        var rootNode = xmlDoc.getElementsByTagName("result")[0];
        this.Result = rootNode.getAttribute("return");
        this.Canceled = rootNode.getAttribute("canceled");
        this.CompletedCount = rootNode.getAttribute("completedCount");
        this.TotalCount = rootNode.getAttribute("totalCount");
        this.FailFileID = rootNode.getAttribute("failFileID");
        this.FailFileName = rootNode.getAttribute("failFileName");
        this.ErrorCode = rootNode.getAttribute("errorCode");
        this.ErrorMessage = rootNode.getAttribute("errorMessage");
        this.XML = xmlResultString;
        this.Files = new Array();

        var selObjects = rootNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Files.push(new GTPFileClientInformationResultFile(selObjects[i]));
        }
    }

    if (!this._initial(true)) return;
    if (FileIDList == undefined)
        FileIDList = "";
    if (ViewGuidList == undefined)
        ViewGuidList = "";

    var resultStr = this._obj.FileClientGetInformation(FileIDList, ViewGuidList);
    return new GTPFileClientInformationResult(resultStr);
};

GTPFileClient.FileClientLastErrorMessage = function () {
    if (!this._initial()) return undefined;
    return this._obj.FileClientLastErrorMessage();
};

GTPFileClient.FileClientLastErrorCode = function () {
    if (!this._initial()) return undefined;
    return this._obj.FileClientLastErrorCode();
};

GTPFileClient.FileClientAddCookies = function (Cookies) {
    if (!this._initial()) return undefined;
    return this._obj.FileClientAddCookies(Cookies);
};

GTPFileClient.FileClientClearCookies = function () {
    if (!this._initial()) return undefined;
    return this._obj.FileClientClearCookies();
};

GTPFileClient.ShellGetLocalTempDir = function () {
    if (!this._initial()) return undefined;
    return this._obj.ShellGetLocalTempDir();
};

GTPFileClient.ShellCreateLocalTempDirectoris = function (Dir) {
    if (!this._initial()) return undefined;
    return this._obj.ShellCreateLocalTempDirectoris(Dir);
};

GTPFileClient.ShellDeleteLocalTempFile = function (FileName) {
    if (!this._initial()) return undefined;
    return this._obj.ShellDeleteLocalTempFile(FileName);
};

GTPFileClient.ShellDeleteLocalTempDirectory = function (Dir) {
    if (!this._initial()) return undefined;
    return this._obj.ShellDeleteLocalTempDirectory(Dir);
};

GTPFileClient.ShellGetSystemDir64 = function () {
    if (!this._initial()) return undefined;
    return this._obj.ShellGetSystemDir64();
};

GTPFileClient.ShellGetSystemDir = function () {
    if (!this._initial()) return undefined;
    return this._obj.ShellGetSystemDir();
};

GTPFileClient.ShellDialogSelectSingleFile = function (Title, DefaultExt, Filters, FilterIndex,
      InitialDir, MultiSelect) {
    var result = this.ShellDialogSelectFiles(Title, DefaultExt, Filters, FilterIndex,
      InitialDir, false);
    if (!result)
        return undefined;

    if (result.Result)
        return result.Files[0];
    else {
        return "";
    }
};

GTPFileClient.ShellDialogSelectFiles = function (Title, DefaultExt, Filters, FilterIndex,
      InitialDir, MultiSelect) {
    function SelectFilesResult(resultString) {
        this.Result = (resultString != "" && resultString != undefined);
        this.Files = new Array();

        if (this.Result) {
            var selFiles = resultString.split("|");
            for (var i = 0; i < selFiles.length; i++) {
                this.Files.push(selFiles[i]);
            }
        }
    }

    if (!this._initial()) return undefined;

    if (Title == undefined)
        Title = "";
    if (DefaultExt == undefined)
        DefaultExt = "";
    if (Filters == undefined)
        Filters = "";
    if (FilterIndex == undefined)
        FilterIndex = 0;
    if (InitialDir == undefined)
        InitialDir = "";
    if (MultiSelect == undefined)
        MultiSelect = true;

    var resultStr = this._obj.ShellDialogSelectFiles(Title, DefaultExt, Filters, FilterIndex, InitialDir, MultiSelect);
    return new SelectFilesResult(resultStr);
};

GTPFileClient.ShellDialogSaveFileEx = function (FileName, Title, DefaultExt, Filters, FilterIndex,
      InitialDir) {
    if (!this._initial()) return undefined;

    if (Title == undefined)
        Title = "";
    if (DefaultExt == undefined)
        DefaultExt = "";
    if (Filters == undefined)
        Filters = "";
    if (FilterIndex == undefined)
        FilterIndex = 0;
    if (InitialDir == undefined)
        InitialDir = "";
    if (FileName == undefined || FileName == "")
        return this._obj.ShellDialogSaveFile(Title, DefaultExt, Filters, FilterIndex, InitialDir);
    else {
        try { //兼容老版本的ActiveX
            return this._obj.ShellDialogSaveFileEx(FileName, Title, DefaultExt, Filters, FilterIndex, InitialDir);
        }
        catch (e) {
            return this._obj.ShellDialogSaveFile(Title, DefaultExt, Filters, FilterIndex, InitialDir);
        }
    }
};

GTPFileClient.ShellDialogSaveFile = function (Title, DefaultExt, Filters, FilterIndex,
      InitialDir) {
    return ShellDialogSaveFileEx("", Title, DefaultExt, Filters, FilterIndex,
      InitialDir);
};

GTPFileClient.ShellDialogSelectFolder = function (Title, InitialFolder) {
    if (!this._initial()) return undefined;

    var cookie;
    try {
        cookie = Ext.util.Cookies;
    } catch (e) { }

    try {
        if (Ext.isEmpty(Title))
            Title = "";
        if (Ext.isEmpty(InitialFolder)) {
            InitialFolder = cookie.get('initpath');
            if (Ext.isEmpty(InitialFolder)) {
                InitialFolder = "";
            }
        }
    } catch (e) { }

    var folderPath = this._obj.ShellDialogSelectFolder(Title, InitialFolder);
    try {
        if (!Ext.isEmpty(folderPath)) {
            cookie.clear('initpath');
            cookie.set("initpath", folderPath, new Date().add(Date.DAY, 30));
        }
    }
    catch (e) { }
    return folderPath;
};

//返回值小于等于32 说明执行失败，否则执行成功，返回值为进程句柄
//返回值为 -2 说明程序内部异常
//返回值为 -1 说明不能直接打开，会自动打开资源管理器，选定该文件
GTPFileClient.ShellExecute = function (FileName, Parameters, Directory) {
    if (!this._initial()) return undefined;

    if (FileName == undefined)
        FileName = "";
    if (Parameters == undefined)
        Parameters = "";
    if (Directory == undefined)
        Directory = "";

    if (FileName.substr(FileName.length - 1) == "|")//以竖线 | 结尾时，去掉之
        FileName = FileName.substr(0, FileName.length - 1);
    FileName = FileName.replace(/(?!:\\)[:*?\"<>|]/g, "_"); //不能用于文件名的字符，都替换为下横线：_；因为下载时，以及下载后打开可能遇到问题，此处修改
    return this._obj.ShellExecute(FileName, Parameters, Directory);
};

GTPFileClient.ShellDirectoryExists = function (Dir) {
    if (!this._initial()) return undefined;
    return this._obj.ShellDirectoryExists(Dir);
};

GTPFileClient.ShellFileExists = function (FileName) {
    if (!this._initial()) return undefined;
    return this._obj.ShellFileExists(FileName);
};

GTPFileClient.ShellGetLocalFilesVersion = function (FileNameList) {
    if (!this._initial()) return undefined;
    return this._obj.ShellGetLocalFilesVersion(FileNameList);
};

GTPFileClient.ShellGetLocalFilesInfo = function (FileNameList, getHash) {
    function LocalFilesInfoFile(infoString) {
        var infos = infoString.split("|");
        this.FileName = infos[0];
        this.FileSize = infos[1];
        this.CreateTime = infos[2];
        this.ModifyTime = infos[3];
        this.FileVersion = infos[4];
    }
    function LocalFilesInfoResult(resultString) {
        var files = resultString.split("\r\n");
        this.Files = new Array();
        this.ResultString = resultString;

        for (var i = 0; i < files.length; i++) {
            var fileInfo = new LocalFilesInfoFile(files[i]);
            if (getHash != undefined && getHash == true) { //取文件的 hash 值，用于判断文件是否被修改
                fileInfo.GtpSamplingHash = GTPFileClient.ShellGetLocalFilesHash(fileInfo.FileName, "gtp6");
                fileInfo.Md5Hash = GTPFileClient.ShellGetLocalFilesHash(fileInfo.FileName, "md5");
            }
            this.Files.push(fileInfo);
        }
    }

    if (!this._initial()) return undefined;
    if (getHash == undefined)
        getHash = false;
    var resultStr = this._obj.ShellGetLocalFilesInfo(FileNameList);
    return new LocalFilesInfoResult(resultStr);
};

GTPFileClient.ShellCheckIsFileChanged = function (fileName, oldFileInfo, compareHash) {
    delete GTPFileClient._stillOpened_;
    if (fileName == undefined)
        throw "fileName 参数不能为空";
    if (oldFileInfo == undefined)
        throw "oldFileInfo 参数不能为空";
    if (compareHash == undefined)
        compareHash = false;

    if (fileName != oldFileInfo.FileName)
        return true;

    var filesInfo = this.ShellGetLocalFilesInfo(fileName);
    if (this.ShellFileExists(fileName) && filesInfo.Files[0].FileSize == "-1") {
        alert("文件可能被占用，请关闭文件编辑工具后重试！");
        GTPFileClient._stillOpened_ = true;
        return false;
    }
    if (filesInfo == undefined || filesInfo.Files.length == 0)
        throw "未能获取文件信息:\r\n" + fileName;
    newFileInfo = filesInfo.Files[0];

    if (oldFileInfo.FileSize == 0 && newFileInfo.FileSize == 0)
        return false;
    var changed = oldFileInfo.FileName != newFileInfo.FileName ||
        oldFileInfo.FileSize != newFileInfo.FileSize ||
        oldFileInfo.FileVersion != newFileInfo.FileVersion ||
        oldFileInfo.CreateTime != newFileInfo.CreateTime ||
        oldFileInfo.ModifyTime != newFileInfo.ModifyTime;

    if (!changed) { //大小、版本、时间没有变化的话，需要比较 hash
        if (!compareHash)
            return false;
        else {
            if (oldFileInfo.GtpSamplingHash == undefined || oldFileInfo.GtpSamplingHash == "")
                throw "compareHash 参数值为 true 时，文件的原始信息必须包含 GtpSamplingHash 值";
            if (oldFileInfo.Md5Hash == undefined || oldFileInfo.Md5Hash == "")
                throw "compareHash 参数值为 true 时，文件的原始信息必须包含 Md5Hash 值";

            var sampHash = this.ShellGetLocalFilesHash(fileName, "gtp6");
            if (sampHash != oldFileInfo.GtpSamplingHash)
                return true;

            var md5Hash = this.ShellGetLocalFilesHash(fileName, "md5");
            if (md5Hash != oldFileInfo.Md5Hash)
                return true;

            return false;
        }
    }
    else
        return true;
};

GTPFileClient.ShellGetDirectoryFiles = function (Dir) {
    function MakeFileItem(itemNode) {
        this.Name = itemNode.getAttribute("Name");
        this.FullName = itemNode.getAttribute("FullName");
        this.Size = itemNode.getAttribute("Size");
    }
    function MakeFolderItem(itemNode) {
        this.Name = itemNode.getAttribute("Name");
        this.FullName = itemNode.getAttribute("FullName");
    }
    function MakeResult(xmlResultString) {
        var xmlDoc = GTPFileClient._xmlDocumentFromString(xmlResultString);
        var rootNode = xmlDoc.getElementsByTagName("result")[0];
        this.Success = rootNode.getAttribute("success") == "1";
        this.FaileMessage = rootNode.getAttribute("failMessage");
        this.XML = xmlResultString;
        this.Files = new Array();
        this.Folders = new Array();

        var filesNode = rootNode.getElementsByTagName("files")[0];
        var selObjects = filesNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Files.push(new MakeFileItem(selObjects[i]));
        }

        var foldersNode = rootNode.getElementsByTagName("folders")[0];
        var selObjects = foldersNode.childNodes;
        for (var i = 0; i < selObjects.length; i++) {
            this.Folders.push(new MakeFolderItem(selObjects[i]));
        }
    }

    if (!this._initial()) return undefined;

    if (!this.ShellDirectoryExists(Dir)) return undefined;

    var resultStr = this._obj.ShellGetDirectoryFiles(Dir);
    return new MakeResult(resultStr);
};

GTPFileClient.ShellGetLocalFilesHash = function (FileNameList, Algorithms) {
    if (!this._initial()) return undefined;

    if (Algorithms == undefined)
        Algorithms = "";

    return this._obj.ShellGetLocalFilesHash(FileNameList, Algorithms);
};

GTPFileClient._xmlDocumentFromString = function (xmlString) {
    var xmlDom = null;
    if (GTPFileClient._isIE) {
        xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        if (xmlDom) xmlDom.loadXML(xmlString);
    }
    else {
        xmlDom = new DOMParser().parseFromString(xmlString, "application/xml");
    }
    return xmlDom;
};

//保存附件信息 于T_FS_ATTACHMENT表
GTPFileClient.FileClientUploadAndSaveAttachmentData = function (TableName, TableKey, AppNamespace, LocalFilenameList, FileIDList, EditGuidList,
      ExtendAttributeList, DescriptionList, CompareOption, CloseTheProgressDialog) {
    var result = GTPFileClient.FileClientUpload(LocalFilenameList, FileIDList, EditGuidList, ExtendAttributeList, DescriptionList,
        AppNamespace, CompareOption, CloseTheProgressDialog);
    for (var i = 0; i < result.Files.length; i++) {
        {
            GTPFileClient._addFileAttachment(result.Files[i].FileID, result.Files[i].ViewGuid, result.Files[i].EditGuid, result.Files[i].FileName,
                result.Files[i].FileSize, result.Files[i].FileDesc, TableName, TableKey, AppNamespace);
        }
    }

    return result;
};

GTPFileClient.FileClientUploadAndUpdateAttachmentData = function (TableName, TableKey, AppNamespace, LocalFilenameList, FileIDList, EditGuidList,
      ExtendAttributeList, DescriptionList, CompareOption, CloseTheProgressDialog) {
    var result = GTPFileClient.FileClientUpload(LocalFilenameList, FileIDList, EditGuidList, ExtendAttributeList, DescriptionList,
        AppNamespace, CompareOption, CloseTheProgressDialog);
    return result;
};

//保存附件信息
GTPFileClient._addFileAttachment = function (fileID, viewGuid, editGuid, fileName, fileSize, fileDesc, tableName, tableKey, appNamespace) {
    if (GTPFileClient.FsAjaxFullUrl == "")
        GTPFileClient.InitialAjaxPageUrl();
    //var params = "&fileID=" + fileID;
	var params = "fileID=" + fileID;
    params += "&viewGuid=" + viewGuid;
    params += "&editGuid=" + editGuid;
    params += "&fileName=" + escape(fileName);
    params += "&fileSize=" + fileSize;
    params += "&fileDesc=" + escape(fileDesc);
    params += "&tableName=" + escape(tableName);
    params += "&tableKey=" + tableKey;
    params += "&appNamespace=" + escape(appNamespace);
    params += "&type=1";
    var retObj = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    var obj = eval("(" + retObj + ")");
    if (obj.success)
        return true
    else
        return false;
};

GTPFileClient.AddFileAttachment = function (fileID, viewGuid, tableName, tableKey, appNamespace) {
    if (GTPFileClient.FsAjaxFullUrl == "")
        GTPFileClient.InitialAjaxPageUrl();
    var params = "fileID=" + fileID;
    params += "&viewGuid=" + viewGuid;
    params += "&tableName=" + tableName;
    params += "&tableKey=" + tableKey;
    params += "&appNamespace=" + appNamespace;
    params += "&type=8";
    var retObj = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    var obj = eval("(" + retObj + ")");
    if (obj.success)
        return true
    else
        return false;
};

GTPFileClient.DeleteFileAttachment = function (fileID, tableName, tableKey, userId) {
    if (GTPFileClient.FsAjaxFullUrl == "")
        GTPFileClient.InitialAjaxPageUrl();
    var params = "fileID=" + fileID;
    params += "&tableName=" + tableName;
    params += "&tableKey=" + tableKey;
    params += "&userId=" + userId;
    params += "&type=3";
    var retObj = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    var obj = eval("(" + retObj + ")");
    if (obj.success)
        return true
    else
        return false;
};

//更新附件备注信息
GTPFileClient.UpdateFileAttachmentNote = function (fileID, fileDesc, tableName, tableKey, userId) {
    if (GTPFileClient.FsAjaxFullUrl == "")
        GTPFileClient.InitialAjaxPageUrl();
    var params = "fileID=" + fileID;
    params += "&fileDesc=" + fileDesc;
    params += "&tableName=" + tableName;
    params += "&tableKey=" + tableKey;
    params += "&userId=" + userId;
    params += "&type=4";
    var retObj = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    var obj = eval("(" + retObj + ")");
    if (obj.success)
        return true
    else
        return false;
};

//更新TableKey (tempTableKey --->  tableKey  )
GTPFileClient.UpdateFileAttachmentKey = function (tableName, tempTableKey, tableKey) {
    if (GTPFileClient.FsAjaxFullUrl == "")
        GTPFileClient.InitialAjaxPageUrl();
    var params = "tableName=" + tableName;
    params += "&tempTableKey=" + tempTableKey;
    params += "&tableKey=" + tableKey;
    params += "&type=6";
    var retObj = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    var obj = eval("(" + retObj + ")");
    if (obj.success)
        return true
    else
        return false;
};

//根据TableName,TableKey,获取相关业务附件信息
GTPFileClient.GetFileAttachmentList = function (tableName, tableKey, fileId) {
    if (GTPFileClient.FsAjaxFullUrl == "")
        GTPFileClient.InitialAjaxPageUrl();
    var params = "tableName=" + tableName;
    params += "&tableKey=" + tableKey;
    params += "&type=2";
    if (fileId) {
        params += "&FileID=" + fileId;
    }

    var retObj = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    var obj = eval("(" + retObj + ")");
    if (obj && obj.total)
        obj.Count = obj.total;
    if (obj && obj.root)
        obj.Items = obj.root;
    return obj;
};

//是否激活附件active :true 激活，false:未激活
GTPFileClient.SetFileActiveWithUpResult = function (active, upResult) {
    if (upResult.Result && upResult.Files) {
        for (var i = 0; i < upResult.Files.length; i++) {
            return GTPFileClient.SetFileActive(active, upResult.Files[i].FileID, upResult.Files[i].EditGuid);
        }
    }
};

//是否激活附件active :true 激活，false:未激活
GTPFileClient.SetFileActive = function (active, fileID, editGuid) {
    if (GTPFileClient.FsAjaxFullUrl == "")
        GTPFileClient.InitialAjaxPageUrl();
    var params = "fileID=" + fileID;
    params += "&editGuid=" + editGuid;
    params += "&active=" + active;
    params += "&type=7";
    var retObj = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    return eval("(" + retObj + ")");
};

//创建临时TableKey
GTPFileClient.CreateFileAttachmentKey = function () {
    var params = "type=5";
    var tempTableKey = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    tempTableKey = eval("(" + tempTableKey + ")")
    if (tempTableKey.success)
        return tempTableKey.Guid;
    else
        return "";
};

//在线编辑时ajax请求
GTPFileClient.UpdetaInfor = function (OldTableName, OldTableKey, OldEditGUID, OldFileID, NewFileID, UserID) {
    var params = "OldTableName=" + OldTableName;
    params += "&OldTableKey=" + OldTableKey;
    params += "&OldEditGUID=" + OldEditGUID;
    params += "&OldFileID=" + OldFileID;
    params += "&NewFileID=" + NewFileID;
    params += "&UserID=" + UserID;
    params += "&type=9";
    var result = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    return eval('(' + result + ')').success;
};

//最大上传附件最大值
GTPFileClient.GetFileLimitMaxSize = function (sectionID, key) {
    var params = "type=50";
    params += "&sectionID=" + sectionID;
    params += "&key=" + key;
    var path = "/Services/Preference/ajax/getAttachmentPreference.ashx";
    var fileSize = GTPFileClient._ajaxSyncCall(path, params);
    fileSize = eval("(" + fileSize + ")");
    if (fileSize.UploadFileMaxSize && parseInt(fileSize.UploadFileMaxSize) != 0)
        return parseInt(fileSize.UploadFileMaxSize) * 1024 * 1024;
    else
        return 0;
};

//是否显示删除文件提示确认框
GTPFileClient.IsShowDeletePrompt = function (sectionID, key) {
    var params = "type=60";
    params += "&sectionID=" + sectionID;
    params += "&key=" + key;
    var path = "/Services/Preference/ajax/getAttachmentPreference.ashx";
    var result = GTPFileClient._ajaxSyncCall(path, params);
    try {
        result = eval("(" + result + ")");
    } catch (e) {
    }
    if (result && result.ShowDeletePrompt === "True") {
        return true;
    } else {
        return false;
    }
};

//是否在编辑Word附件时是否使用iWebOffice编辑并保留修改痕迹，默认不使用
GTPFileClient.IsEditWordAttachmentByWebOffice = function (sectionID, key) {
    var params = "type=70";
    params += "&sectionID=" + sectionID;
    params += "&key=" + key;
    var path = "/Services/Preference/ajax/getAttachmentPreference.ashx";
    var result = GTPFileClient._ajaxSyncCall(path, params);
    try {
        result = eval("(" + result + ")");
    } catch (e) {
    }
    if (result && result.EditWordAttachmentByWebOffice === "True") {
        return true;
    } else {
        return false;
    }
};

//获取iWebOffice产品名称
GTPFileClient.GetWebOfficeProductName = function (sectionID, key) {
    var params = "type=80";
    params += "&sectionID=" + sectionID;
    params += "&key=" + key;
    var path = "/Services/Preference/ajax/getAttachmentPreference.ashx";
    var result = GTPFileClient._ajaxSyncCall(path, params);
    try {
        result = eval("(" + result + ")");
    } catch (e) {
    }
    if (result) {
        return result.WebOfficeProductName || "";
    } else {
        return "";
    }
};

//获取附件Url路径；多个附件，fileID以"|"分割，viewGuid也一样用”|“分割；
GTPFileClient.GetFileUrlList = function (fileID, viewGuid) {
    var params = "type=60";
    params += "&fileID=" + fileID;
    params += "&viewGuid=" + viewGuid;
    var ret = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    ret = eval("(" + ret + ")");
    return ret.fileUrlList;
};

// 重命名附件
GTPFileClient.renameAttachment = function (fileID, fileName, tableName, tableKey, userId) {
    var params = "fileID=" + fileID;
    params += "&tableName=" + tableName;
    params += "&tableKey=" + tableKey;
    params += "&fileName=" + fileName;
    params += "&userId=" + userId;
    params += "&type=10";
    var result = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    return eval('(' + result + ')').success;
};

// 得到附件修改历史
GTPFileClient.getFileHistory = function (ID) {
    var params = "ID=" + ID;
    params += "&type=11";
    var retObj = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    return eval("(" + retObj + ")");
};
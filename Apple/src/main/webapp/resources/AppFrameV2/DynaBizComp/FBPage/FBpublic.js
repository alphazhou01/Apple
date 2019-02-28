function doAction(uiControler, actionFun, args, callback, callbackArg, showMask) {
    //当前访问模块编码
    var moduleCode = request("modulecode");

    if (showMask == null)
        showMask = true;
    var disp = new Gtp.net.GtpDispatcher({
        url: "action.ashx?modulecode=" + moduleCode,
        async: false,
        showMask: showMask,
        dispatchArgs: {
            controller: uiControler,
            action: actionFun,
            args: args
        },
        listeners: {
            scope: this,
            "success": function (result) {
                if (callback)
                    callback(result, callbackArg);
            },
            "error": function () {
                Gtp.net.GtpDispatcher.prototype.onError.apply(this, arguments);
                if (callback)
                    callback(null, callbackArg, arguments);
            },
            "failure": function () {
                Gtp.net.GtpDispatcher.prototype.onFailure.apply(this, arguments);
                if (callback)
                    callback(null, callbackArg, arguments);
            }
        }
    });

    // disp.initialConfig.async = false;

    disp.dispatch();
}

//验证权限
//param.bizCompName 业务组件名称
//param.authItemName 权限项名称
//param.id 数据项ID
//返回true 或者false
function Auth() {

    this.result = false;
    this.requestAuth = function (param) {

        //doAction('GTP.Services.Common.Permission', 'AuthItemDemandById', [param.bizCompName, param.authItemName, param.id], function (data, obj) {
        var callFunc = "GetAuth";
        var callParam = new Array();
        callParam.push(param.bizCompName);
        callParam.push(param.authItemName);
        if (param.id) {
            callFunc = "GetAuthById";
            callParam.push(param.id);
        }
        doAction('GTP.Portal.Biz.WebUI.Auth', callFunc, callParam, function (data, obj) {
            obj.result = data;
        }, this);
    };

    //验证是否有权限 返回true 或者false
    this.Validate = function (param) {
        this.requestAuth(param);
        return this.result;
    };
}

//验权快捷方法
function GetAuth(bzname, operate, Id) {
    //return true;

    if (bzname == "" || bzname == null)
        return true;
    //  判断权限
    var authparm = {};
    authparm.bizCompName = bzname;
    authparm.authItemName = operate;
    authparm.id = Id; //   由于接口问题暂时传 null Id
    return new Auth().Validate(authparm);


}

function redirect(url) {
    if (request("Modal") == "") {
        window.location.href = url;
    }
}

///客户端获取参数列表的值
function request(sName) {
    var sURL = new String(window.location);
    var sURL = document.location.href;
    var iQMark = sURL.lastIndexOf('?');
    var iLensName = sName.length;

    var iStart = sURL.indexOf('?' + sName + '=')
    if (iStart == -1) {
        iStart = sURL.indexOf('&' + sName + '=')
        if (iStart == -1) {
            return "";
        }
    }
    iStart = iStart + +iLensName + 2;
    var iTemp = sURL.indexOf('&', iStart);
    if (iTemp == -1) {
        iTemp = sURL.length;
    }
    return sURL.slice(iStart, iTemp);
    sURL = null;
}

///客户端获取参数列表的值
function Request(strParame) {

    var args = new Object();
    var query = location.search.substring(1).toLowerCase();

    // Get query string
    var pairs = query.split("&"); // Break at ampersand
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); // Look for "name=value"
        if (pos == -1) continue; // If not found, skip
        var argname = pairs[i].substring(0, pos); // Extract the name
        var value = pairs[i].substring(pos + 1); // Extract the value
        value = decodeURIComponent(value); // Decode it, if needed
        args[argname] = value; // Store as a property
    }
    return args[strParame]; // Return the object

}


//拼接Url
function dowithUrl(url, param) {

    if (Ext.isEmpty(url)) return url;
    var href = "";
    if (url.indexOf('?') != -1) {

        href = url + '&instance=' + param.instance;
    }
    else {
        href = url + '?instance=' + param.instance;
    }
    href += "&frame=" + param.frame + "&height=" + param.height + '&frametype=' + param.frametype + '&_ts=' + new Date().getTime();
    return href;
}

function NotifyMessage(title, message, error) {
    if (window.Notify != null) return;
    // Ext.Msg.notify(title, message);
    if (error == null) error = false;
    Ext.net.Notification.show({
        alignToCfg: {
            offset: [0, 0],
            position: 'br-br'
        },
        iconCls: error == true ? 'icon-error' : 'icon-information',
        pinEvent: 'click',
        html: message,
        title: title
    });
}

function ConfirmMessageBox(title, message, yesCallback, noCallback, paramObj) {
    Ext.MessageBox.confirm(title, message, function (e) {
        if (e == "yes") {
            if (yesCallback != null) {
                yesCallback.call(paramObj);
            }
        }
        else {
            if (noCallback != null) {
                noCallback.call(paramObj);
            }
        }
    });
}

function LoadWin(imgUrl, s, msg, w) {
    this.ImgUrl = imgUrl;
    this.win = null;
    this.mark = null;
    this.IsCreate = false;
    var obj = this;
    this.createWin = function () {
        this.win = document.createElement("div");
        this.win.className = "loadingPanel";
        this.mark = document.createElement("div");
        this.mark.className = "loadingMark";
        this.win.onclick = function () {
            if (obj) {
                obj.Hide();
            }
            event.cancelBubble = true;
        }
        //如果有阴影
        if (s != null) {

        }
        //自定义消息
        if (msg != null) {
            this.mark.innerHTML = msg;
        } else {
            this.mark.innerHTML = "加载中...";
        }
        //自定义宽度
        if (w != null) {
            this.mark.style.width = w + "px";
        }
        document.body.appendChild(this.win);
        document.body.appendChild(this.mark);
        this.IsCreate = true;
    }

    this.Show = function () {

        if (!this.IsCreate) {
            this.createWin();
        }
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        this.mark.style.left = (width - 100) / 2 + "px";
        this.mark.style.top = (height - 23) / 2 + "px";
        this.win.style.display = "block";
        this.mark.style.display = "block";
    };
    this.Hide = function () {
        this.win.style.display = "none";
        this.mark.style.display = "none";
    }
}


function getFocusedField(grid) {
    var model = grid.getSelectionModel();
    var rows = model.getSelections();
    if (rows == null) return null;
    if (rows.length > 0)
        return rows;
    else
        return null;
}
function getFieldFocusedValue(grid, fieldName) {

    var rows = getFocusedField(grid);
    if (rows != null) {

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            return row.get(fieldName); //这个就是你想要的
        }
        return null;
    }
}

//转化字符串为json数据
function strToJson(str) {
    var json = eval('(' + str + ')');
    return json;
}
function createCookie(name, value, days) {
    var expires = "";
    try {
        if (days == null) days = 365;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        expires = name + "=" + value + expires + "; path=/";
        document.cookie = expires;
    }
    catch (e) { }
}

function readCookie(name) {
    try {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    catch (e) { }
}

function eraseCookie(name) {
    try {
        createCookie(name, "", -1);
    }
    catch (e) { }

}

//生成Guid
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}

function ExtendClass(baseClass, args) {
    this.base = new baseClass(args);
    baseClass.call(this, args);
    return this;
}

function calcHalf(str) {
    var halfNumber = 0;
    for (var i = 0; i < str.length; i++) {
        strCode = str.charCodeAt(i);
        if (strCode < 128) {
            halfNumber++;
        }
    }
    return halfNumber;
}

//打开widows窗体
var WinOP;
function win_Open(loadpos, WWidth, WHeight, left, top) {

    var WLeft = Math.ceil((window.screen.width - WWidth) / 2);
    var WTop = Math.ceil((window.screen.height - WHeight) / 2);
    if (!Ext.isEmpty(left)) WLeft = left;
    if (!Ext.isEmpty(top)) WTop = top;
    var features = 'width= ' + WWidth + 'px, ' + 'height= ' + WHeight + 'px, ' + 'left= ' + WLeft + 'px, ' + 'top= ' + WTop + 'px, ' + 'fullscreen=0,toolbar=0,location=no,directories=0,status=0,menubar=0, scrollbars=0,resizable=0 ';
    if (WinOP != null)//确保只打开一个窗口 
    {
        WinOP.close();
        WinOP = null;
    }
    WinOP = window.open(loadpos, "_new", features);
    WinOP.focus();
}
function isScroll(el) {
    // test targets   
    var elems = el ? [el] : [document.documentElement, document.body];
    var scrollX = false, scrollY = false;
    for (var i = 0; i < elems.length; i++) {
        var o = elems[i];
        // test horizontal   
        var sl = o.scrollLeft;
        o.scrollLeft += (sl > 0) ? -1 : 1;
        o.scrollLeft !== sl && (scrollX = scrollX || true);
        o.scrollLeft = sl;
        // test vertical   
        var st = o.scrollTop;
        o.scrollTop += (st > 0) ? -1 : 1;
        o.scrollTop !== st && (scrollY = scrollY || true);
        o.scrollTop = st;
    }
    // ret   
    return {
        scrollX: scrollX,
        scrollY: scrollY
    };
};

function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos + 1);

    return (prePath);
}

function checkNum(num) {
    var re = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/;
    return re.test(num);
}


//跟随滚动条滚动
//要滚动的DIV
function scrollx(p) {
    var d = document, dd = d.documentElement, db = d.body, w = window, o = d.getElementById(p.id), ie6 = /msie 6/i.test(navigator.userAgent), style, timer;
    if (o) {
        cssPub = ";position:" + (p.f && !ie6 ? 'fixed' : 'absolute') + ";" + (p.t != undefined ? 'top:' + p.t + 'px;' : 'bottom:0;');
        if (p.r != undefined && p.l == undefined) {
            o.style.cssText += cssPub + ('right:' + p.r + 'px;');
        } else {
            o.style.cssText += cssPub + ('margin-left:' + p.l + 'px;');
        }
        if (p.f && ie6) {
            cssTop = ';top:expression(documentElement.scrollTop +' + (p.t == undefined ? dd.clientHeight - o.offsetHeight : p.t) + '+ "px" );';
            cssRight = ';right:expression(documentElement.scrollright + ' + (p.r == undefined ? dd.clientWidth - o.offsetWidth : p.r) + ' + "px")';
            if (p.r != undefined && p.l == undefined) {
                o.style.cssText += cssRight + cssTop;
            } else {
                o.style.cssText += cssTop;
            }
            //  dd.style.cssText += ';background-image: url(about:blank);background-attachment:fixed;';
        } else {
            if (!p.f) {
                w.onresize = w.onscroll = function () {
                    clearInterval(timer);
                    timer = setInterval(function () {
                        //双选择为了修复chrome 下xhtml解析时dd.scrollTop为 0
                        var st = (dd.scrollTop || db.scrollTop), c;
                        c = st - o.offsetTop + (p.t != undefined ? p.t : (w.innerHeight || dd.clientHeight) - o.offsetHeight);
                        if (c != 0) {
                            o.style.top = o.offsetTop + Math.ceil(Math.abs(c) / 10) * (c < 0 ? -1 : 1) + 'px';
                        } else {
                            clearInterval(timer);
                        }
                    }, 10)
                }
            }
        }
    }
}

//返回当前页面高度
function pageHeight() {

    if (Ext.isIE) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
    } else {
        return self.innerHeight;
    }
}


//返回当前页面宽度 
function pageWidth() {
    if (Ext.isIE) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth;
    } else {
        return self.innerWidth;
    }
}

//增加Trim 方法
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.LTrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.RTrim = function () {
    return this.replace(/(\s*$)/g, "");
}


//附加验证信息x-form-invalid
function mvalid(obj) {
    if (!obj)
        return true;
    var val = new String();
    val = obj.getValue();
    if (val.Trim() == "") {
        obj.markInvalid(Blank_Space_Valid_MSG);
        return false;
    }
    return true;
}

function delegate(obj, callback) {
    return function () {
        if (obj) {
            callback.apply(obj, arguments);
        }
    }
}

function addEventHandler(evt, el, handler) {
    handler = handler || function () { };
    if (el.addEventListener) {
        el.addEventListener(evt, handler, false);
    } else if (el.attachEvent) {
        el.attachEvent("on" + evt, function () {
            return handler.call(el, window.event);
        });
    } else {
        el["on" + evt] = handler;
    }
}
function removeEventHandler(evt, el, handler) {
    handler = handler || function () { };
    if (el.removeEventListener) {
        el.removeEventListener(evt, handler, false);
    } else if (el.detachEvent) {
        el.detachEvent("on" + evt, handler);
    } else {
        el["on" + evt] = null;
    }
}

function setGridpanelStore()
{ }


function repaceInstance(template, instanceId) {
    var regInstance = new RegExp("#instance#", "gi");
    template = template.replace(regInstance, instanceId);
    return template;
}
function loadJsFile(filename) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
    document.getElementsByTagName("head")[0].appendChild(fileref);
}
//弹出窗体方法
function DialogManager(isModal, callObj) {
    this.IsPortal = true;

    this.IsModalDialog = true;
    if (isModal != null) {
        this.IsModalDialog = isModal;
    }
    var date = new Date();
    this.iframeID = "dmIframe_" + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
    this.CallObj = callObj;
    //url：链接地址
    //title:弹出窗体标题
    //width，height：弹出窗体的高度和宽度
    //funcObj:格式为{OK：function(){},Cancel：function(){},Close:function(){}}分别点击确定和取消的时候调用弹出窗体里面的函数，窗体里面如果有返回值统一通过window.returnValue返回
    //relative:是否相对路径
    //callback:窗体关闭后回调函数函数类型为function(result){} result通过ActionType判断点击了哪个按钮 通过returnValue判断返回值
    //onlyClose:是否仅仅含有close按钮，否则含有确定、取消两个按钮
    this.ShowDialog = function (args) {
        function getRootPath() {
            var strFullPath = window.document.location.href;
            var strPath = window.document.location.pathname;
            var pos = strFullPath.indexOf(strPath);
            var prePath = strFullPath.substring(0, pos);
            return prePath;
        }
        var url, title, width, height, relative, onlyClose, reSize, closable;
        //设置默认值
        if (args == null) return;
        if (args.url) { url = args.url; }
        if (args.title) { title = args.title } else { title = ""; }
        if (args.width) { width = args.width; } else { width = 600; }
        if (args.height) { height = args.height; } else { height = 500; }
        if (args.relative) { relative = args.relative; } else { relative = false; }
        if (args.onlyClose) { onlyClose = args.onlyClose; } else { onlyClose = false; }
        if (args.reSize) { reSize = args.reSize; } else { reSize = true; }
        if (args.closable != null && args.closable != 'undefined') { closable = args.closable; } else { closable = true; }

        if (args.callback) {
            this.CallBack = args.callback;
        }
        if (args.funcObj) {
            this.funcObj = args.funcObj;
        }
        var fullPath = "";
        //如果相对路径的话直接取相对路径就可以了
        if (relative) { fullPath = url; }
        else {
            fullPath = getRootPath() + "/" + url;
        }
        if (!this.IsPortal) {
            if (this.IsModalDialog) {
                var returnObj = showDialog(fullPath, title, width, height);
                if (callback) {
                    var result = Object();
                    result.ActionType = "Modal";
                    result.returnValue = returnObj;
                    callback(result);
                }
                else {
                    return returnObj;
                }
            } else {
                alert("暂时不支持非模态对话框");
            }
        }
        else {
            fullPath = setModalUrl(fullPath);
            var cfg = {
                layout: 'fit',
                html: "<iframe id='" + this.iframeID + "' src='" + fullPath + "' width='100%' height='100%' frameborder='no' border='0'></iframe>",
                title: title,
                width: width,
                height: height,
                modal: this.IsModalDialog,
                hideBorders: false,
                closable: closable,
                resizable: reSize,
                scripts: true, id: "win_" + this.iframeID
            };
            if (!args.noToolBar) {
                cfg.footerCssClass = "g-btn-area";
                cfg.fbar = { xtype: "toolbar", items: [] };
            }
            if (args.position) {
                cfg.pageX = args.position.x;
                cfg.pageY = args.position.y;
            }
            this.win = new Ext.Window(cfg);

            var toolbar = this.win.fbar;
            if (toolbar) {
                if (onlyClose) {
                    toolbar.addButton({ id: "btnClose" + this.iframeID, text: "关闭", listeners: { click: { fn: this.CloseClick}} });
                }
                else {
                    toolbar.addButton({ id: "btnOK" + this.iframeID, text: "确定", cls: "g-btn-recommend", listeners: { click: { fn: this.OKClick}} });
                    toolbar.addButton({ id: "btnCancel" + this.iframeID, text: "取消", listeners: { click: { fn: this.CancelClick}} });
                }
            }
            this.win.show();
        }
    }
    var obj = this;
    this.DBClick = function (sender, e) {
        var result = Object();
        var frame = document.getElementById(obj.iframeID);
        if (frame) {
            var curWin = frame.contentWindow;
            if (!curWin) { obj.CloseWindow(); return; }
            result.returnValue = curWin.returnValue;
        }
        result.ActionType = "OK";
        if (obj.CallBack) {
            if (obj.CallObj) {
                obj.CallBack.call(obj.CallObj, result);
            }
            else {
                obj.CallBack(result);
            }
        }
        obj.CloseWindow();
    }
    //确定
    this.OKClick = function (sender, e) {
        var result = Object();
        if (obj.funcObj && obj.funcObj.OK) {
            var frame = document.getElementById(obj.iframeID);
            if (frame) {
                var curWin = frame.contentWindow;
                if (!curWin) { obj.CloseWindow(); return; }
                var callFunc = curWin[obj.funcObj.OK];
                if (!callFunc) { obj.CloseWindow(); return; }
                if (sender == null) sender = this.btnOK;
                var funcResult = callFunc(sender, e);
                if (funcResult === false) {
                    return;
                }
                result.returnValue = curWin.returnValue;
            }
        }
        result.ActionType = "OK";
        if (obj.CallBack) {
            if (!result.returnValue || result.returnValue.callback == null) {
                if (obj.CallObj) {
                    obj.CallBack.call(obj.CallObj, result);
                }
                else {
                    obj.CallBack(result);
                }
            }
        }
        obj.CloseWindow();
    }
    //取消

    this.CancelClick = function (sender, e) {
        var result = Object();
        if (obj.funcObj && obj.funcObj.Cancel) {
            var frame = document.getElementById(obj.iframeID);
            if (frame) {
                var curWin = frame.contentWindow;
                if (!curWin) { obj.CloseWindow(); return; }
                var callFunc = curWin[obj.funcObj.Cancel];
                if (!callFunc) { obj.CloseWindow(); return; }
                var funcResult = callFunc(sender, e);
                if (funcResult === false) {
                    return;
                }
                result.returnValue = curWin.returnValue;
            }
        }
        result.ActionType = "Cancel";
        if (obj.CallBack) {
            if (obj.CallObj) {
                obj.CallBack.call(obj.CallObj, result);
            }
            else {
                obj.CallBack(result);
            }
        }
        obj.CloseWindow();
    }
    //关闭
    this.CloseClick = function (sender, e) {
        var result = Object();
        if (obj.funcObj && obj.funcObj.Close) {
            var frame = document.getElementById(obj.iframeID);
            if (frame) {
                var curWin = frame.contentWindow;
                if (!curWin) { obj.CloseWindow(); return; }
                var callFunc = curWin[obj.funcObj.Close];
                if (!callFunc) { obj.CloseWindow(); return; }
                var funcResult = callFunc(sender, e);
                if (funcResult === false) {
                    return;
                }
                result.returnValue = curWin.returnValue;
            }
        }
        result.ActionType = "Close";
        if (obj.CallBack) {
            if (obj.CallObj) {
                obj.CallBack.call(obj.CallObj, result);
            }
            else {
                obj.CallBack(result);
            }
        }
        obj.CloseWindow();
    }

    this.CloseWindow = function () {
        //垃圾回收iframe内存
        var iframe = document.getElementById(this.iframeID);
        iframe.src = "javascript:false";
        if (iframe.removeNode) {
            iframe.removeNode(true);
        } else {
            var tmp = iframe.parentNode;
            tmp.removeChild(iframe);
            tmp = null;
        }
        if (window.CollectGarbage)
            setTimeout(window.CollectGarbage, 1000);

        if (this.win) {
            this.win.hide();
            this.win.destroy();
            this.win = null;
        }
        if (window.returnValue != null) {
            if (typeof (window.returnValue) == "object") {
                delete window.returnValue;
            } else {
                window.returnValue = null;
            }
        }
        delete obj;
    }
}


function showDialog(url, title, width, height, callback, obj) {
    url = setModalUrl(url);
    var params = "dialogWidth:" + width + "px;dialogHeight:" + height + "px;help:no;status:no;center:yes"
    var returnObj = window.showModalDialog(url, title, params);
    if (callback) {
        if (obj) {
            callback.call(obj, returnObj);
        }
        else {
            callback(returnObj);
        }
    }
    else { return returnObj; }
}
function setModalUrl(url) {
    if (!url) return "";
    if (url.indexOf('?') > 0) {
        url += "&Modal=1";
    }
    else {
        url += "?Modal=1";
    }
    return url;
}
var ExtModalDialogWindow = function (config) {
    this.constructor();
    this.ExtWindow = Ext.extend(Ext.Window, config);
}
ExtModalDialogWindow.prototype.initialize = function (obj) {
    if (typeof (obj) == 'string') {
        obj = obj.split(';');
        for (var i = 0; i < obj.length; i++) {
            var objParam = obj[i].split(':');
            switch (objParam[0]) {
                case 'dialogHeight': this.dialogHeight = (objParam[1].indexOf("%") == -1 ? parseInt(objParam[1]) : objParam[1]); break;
                case 'dialogWidth': this.dialogWidth = (objParam[1].indexOf("%") == -1 ? parseInt(objParam[1]) : objParam[1]); break;
                case 'dialogLeft': this.dialogLeft = parseInt(objParam[1]); break;
                case 'dialogTop': this.dialogTop = parseInt(objParam[1]); break;
                case 'resizable': this.resizable = objParam[1]; break;
                case 'scroll': this.scroll = objParam[1]; break;
                case 'title': this.title = objParam[1]; break;
            }
        }
    }
    else if (typeof (obj) == 'object') {
        for (var index in obj) {
            switch (index) {
                case 'dialogHeight': this.dialogHeight = (obj[index].indexOf("%") == -1 ? parseInt(obj[index]) : obj[index]); break;
                case 'dialogWidth': this.dialogWidth = (obj[index].indexOf("%") == -1 ? parseInt(obj[index]) : obj[index]); break;
                case 'dialogLeft': this.dialogLeft = parseInt(obj[index]); break;
                case 'dialogTop': this.dialogTop = parseInt(obj[index]); break;
                case 'resizable': this.resizable = obj[index]; break;
                case 'scroll': this.scroll = obj[index]; break;
                case 'title': this.title = obj[index]; break;
            }
        }
    }
};
ExtModalDialogWindow.prototype.constructor = function () {
    this.obj = this;
    this.returnValue = null;
    this.win = {};
    // showModalDialog arguments 
    this.sURL = '';
    this.dialogArguments = null;
    //sFeatures arguments 
    this.dialogHeight = 100;
    this.dialogWidth = 100;
    this.dialogLeft = 0;
    this.dialogTop = 0;
    this.resizable = false;
    this.scroll = true;
    this.title = '';
    this.html = '';
};
ExtModalDialogWindow.prototype.destroy = function () {
    this.constructor.call(this);
}
ExtModalDialogWindow.prototype.ShowExtModalDialog = function (sURL, vArguments, sFeatures, dialogId) {
    if (this.sURL != '') { this.destroy() }
    this.sURL = sURL;
    if (arguments.length < 3) { sFeatures = vArguments; vArguments = null; }
    this.dialogArguments = vArguments ? vArguments : null;
    this.initialize(sFeatures);
    if (this.dialogWidth.toString().indexOf("%") == -1 && this.dialogWidth > document.body.offsetWidth)
        this.dialogWidth = document.body.offsetWidth;
    if (this.dialogHeight.toString().indexOf("%") == -1 && this.dialogHeight > document.body.offsetHeight)
        this.dialogHeight = document.body.offsetHeight;
    window.win = this.obj;
    //也可设置成百分之百
    //this.html = '<iframe id="mdFrame' + dialogId + '" name="mdFrame' + dialogId + '" width="' + (this.dialogWidth.toString().indexOf("%") > -1 ? this.dialogWidth : (this.dialogWidth - 6)) + '" height="' + (this.dialogHeight.toString().indexOf("%") > -1 ? this.dialogHeight : (this.dialogHeight - 36)) + '" frameborder="0" src="' + this.sURL + '"></iframe>'; //15,40
    this.html = '<iframe id="mdFrame' + dialogId + '" name="mdFrame' + dialogId + '" width="100%" height="100%" frameborder="0" src="' + this.sURL + '"></iframe>'; //15,40
    this.win = new this.ExtWindow({
        id: 'mdWin' + dialogId,
        title: this.title,
        resizable: this.resizable,
        //autoHeight: this.scroll,//有config配置，不使用此配置
        width: this.dialogWidth,
        height: this.dialogHeight,
        html: this.html
    });
    this.win.DialogId = dialogId;
    if (this.dialogLeft && this.dialogTop) { this.win.setPosition(this.dialogLeft, this.dialogTop); }
    /*this.win.addListener({
    'show': function () { }
    //'close': function () { window.win = null; }
    });*/
    this.close = function () {
        this.win.close();
    };
    this.show = function () {
        this.win.show();
    };
    this.show();
    /*
    如果有滚动条时候，最大化有移动位置，或窗口关闭后原来页面的滚动条消失了。则考虑：
    listeners: { 
    close:function(w){ 
    //关键部分：关闭窗口前先还原,滚动条才不会消失 
    w.restore();     
    }, 
    maximize:function(w){    
    //关键部分：最大化后需要将窗口重新定位，否则窗口会从最顶端开始最大化                        
    w.setPosition(document.body.scrollLeft,document.body.scrollTop); 
    } }
    */
};
function GetExtShowModalDialogWin() {
    if (ExtShowModalDialog_Win == null)
        return null;
    return ExtShowModalDialog_Win[ExtShowModalDialog_Win.length - 1];
}
var ExtShowModalDialog_Win = new Array();
function ExtShowModalDialog(url, showInWin, width, height, title, callback, callbackArg, winConfig, dialogId, dialogConfig) {
    if (winConfig == null) {
        winConfig = {
            closeable: true,
            draggable: true,
            resizable: false,
            plain: true,
            modal: true,
            closeAction: 'close'
        };
    }
    else if (typeof (winConfig) == "string")
        winConfig = eval(winConfig);

    if (dialogId == null)
        dialogId = new Date().getTime();
    if (dialogConfig != null && (dialogConfig.ButtonOK || dialogConfig.ButtonCancel || dialogConfig.ButtonYes || dialogConfig.ButtonNo || dialogConfig.ButtonClose)) {
        winConfig.footerCssClass = "g-btn-area";
        var buttons = [];
        if (dialogConfig.ButtonOK)
            buttons.push({ id: "btnOK" + dialogId, text: "确定", cls: "g-btn-recommend", listeners: { click: { fn: function (sender, e) {
                var iframe = showInWin.document.getElementById("mdFrame" + _win.win.DialogId);
                var curWin = iframe.contentWindow;
                if (!curWin) { _win.close(); return; }
                var callFunc = curWin[dialogConfig.OKFunction == null ? "ButtonOKClick" : dialogConfig.OKFunction];
                if (!callFunc) { _win.close(); return; }
                if (sender == null) sender = Ext.getCmp("btnOK" + dialogId);
                var funcResult = callFunc(sender, e);
                if (funcResult === false)
                    return;
                callbackArg.ButtonType = "OK";
                callbackArg.returnValue = curWin.returnValue;
                _win.close();
            }
            }
            }
            });
        if (dialogConfig.ButtonCancel)
            buttons.push({ id: "btnCancel" + dialogId, text: "取消", listeners: { click: { fn: function (sender, e) {
                var iframe = showInWin.document.getElementById("mdFrame" + _win.win.DialogId);
                var curWin = iframe.contentWindow;
                if (!curWin) { _win.close(); return; }
                var callFunc = curWin[dialogConfig.CancelFunction == null ? "ButtonCancelClick" : dialogConfig.CancelFunction];
                if (!callFunc) { _win.close(); return; }
                if (sender == null) sender = Ext.getCmp("btnCancel" + dialogId);
                var funcResult = callFunc(sender, e);
                if (funcResult === false)
                    return;
                callbackArg.ButtonType = "Cancel";
                callbackArg.returnValue = curWin.returnValue;
                _win.close();
            }
            }
            }
            });
        if (dialogConfig.ButtonYes)
            buttons.push({ id: "btnYes" + dialogId, text: "是", cls: "g-btn-recommend", listeners: { click: { fn: function (sender, e) {
                var iframe = showInWin.document.getElementById("mdFrame" + _win.win.DialogId);
                var curWin = iframe.contentWindow;
                if (!curWin) { _win.close(); return; }
                var callFunc = curWin[dialogConfig.YesFunction == null ? "ButtonYesClick" : dialogConfig.YesFunction];
                if (!callFunc) { _win.close(); return; }
                if (sender == null) sender = Ext.getCmp("btnYes" + dialogId);
                var funcResult = callFunc(sender, e);
                if (funcResult === false)
                    return;
                callbackArg.ButtonType = "Yes";
                callbackArg.returnValue = curWin.returnValue;
                _win.close();
            }
            }
            }
            });
        if (dialogConfig.ButtonNo)
            buttons.push({ id: "btnNo" + dialogId, text: "否", listeners: { click: { fn: function (sender, e) {
                var iframe = showInWin.document.getElementById("mdFrame" + _win.win.DialogId);
                var curWin = iframe.contentWindow;
                if (!curWin) { _win.close(); return; }
                var callFunc = curWin[dialogConfig.NoFunction == null ? "ButtonNoClick" : dialogConfig.NoFunction];
                if (!callFunc) { _win.close(); return; }
                if (sender == null) sender = Ext.getCmp("btnNo" + dialogId);
                var funcResult = callFunc(sender, e);
                if (funcResult === false)
                    return;
                callbackArg.ButtonType = "No";
                callbackArg.returnValue = curWin.returnValue;
                _win.close();
            }
            }
            }
            });
        if (dialogConfig.ButtonClose)
            buttons.push({ id: "btnClose" + dialogId, text: "关闭", listeners: { click: { fn: function (sender, e) {
                var iframe = showInWin.document.getElementById("mdFrame" + _win.win.DialogId);
                var curWin = iframe.contentWindow;
                if (!curWin) { _win.close(); return; }
                var callFunc = curWin[dialogConfig.CloseFunction == null ? "ButtonCloseClick" : dialogConfig.CloseFunction];
                if (!callFunc) { _win.close(); return; }
                if (sender == null) sender = Ext.getCmp("btnClose" + dialogId);
                var funcResult = callFunc(sender, e);
                if (funcResult === false)
                    return;
                callbackArg.ButtonType = "Close";
                callbackArg.returnValue = curWin.returnValue;
                _win.close();
            }
            }
            }
            });
        winConfig.fbar = { xtype: "toolbar", items: buttons };
    }
    var _win = new ExtModalDialogWindow(winConfig);
    ExtShowModalDialog_Win.push(_win);
    _win.ShowExtModalDialog(url, showInWin, "title:" + title + ";dialogWidth:" + width + ";dialogHeight:" + height, dialogId);
    _win.OKClick = function () {
        var btn = Ext.getCmp("btnOK" + dialogId);
        if (btn)
            btn.fireEvent("click");
    };
    _win.CancelClick = function () {
        var btn = Ext.getCmp("btnCancel" + dialogId);
        if (btn)
            btn.fireEvent("click");
    };
    _win.YesClick = function () {
        var btn = Ext.getCmp("btnYes" + dialogId);
        if (btn)
            btn.fireEvent("click");
    };
    _win.NoClick = function () {
        var btn = Ext.getCmp("btnNo" + dialogId);
        if (btn)
            btn.fireEvent("click");
    };
    _win.CloseClick = function () {
        var btn = Ext.getCmp("btnClose" + dialogId);
        if (btn)
            btn.fireEvent("click");
    };
    _win.win.on('close', function () {

        if (callback != null) {
            if (callbackArg == null)
                callbackArg = {};
            if (!callbackArg.returnValue) {
                if (_win.returnValue)
                    callbackArg.returnValue = _win.returnValue;
                else {
                    var iframe = showInWin.document.getElementById("mdFrame" + _win.win.DialogId);
                    callbackArg.returnValue = iframe.contentWindow.returnValue;
                }
            }
            callback(callbackArg);
        }
        var iframe = showInWin.document.getElementById("mdFrame" + _win.win.DialogId);
        if (iframe != null) {
            iframe.src = "javascript:false";
            if (iframe.removeNode) {
                iframe.removeNode(true);
            } else {
                var tmp = iframe.parentNode;
                tmp.removeChild(iframe);
                tmp = null;
            }
            if (_win.CollectGarbage)
                setTimeout(_win.CollectGarbage, 1000);
        }

        ExtShowModalDialog_Win.pop();
        window.win = null
        _win = null;
        var lastWin = GetExtShowModalDialogWin();
        if (lastWin != null) {
            window.win = lastWin.obj;
            lastWin.show();
        }
    });
}
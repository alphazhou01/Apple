
var GTPLibrary_titleInfo = "信息";
var GTPLibrary_titleWarning = "警告";
var GTPLibrary_titleError = "错误";
var GTPLibrary_titleConfirm = "确认";
var GTPLibrary_titlePrompt = "输入";

////////////////////////////////////////////////////////////////////////////////
// 与字符串操作相关
////////////////////////////////////////////////////////////////////////////////

//获取字符串长度
String.prototype.Length = function () {
    var arr = this.match(/[^\x00-\xff]/ig);
    return this.length + (arr == null ? 0 : arr.length);
}

//把数据转换为 HTML 格式显示在页面上
function encodeHTML(val) {
    if (val === null) return "";
    else if (val === undefined) return "";
    else return val.toString().
    replace(/&/g, "&amp;").
    replace(/</g, "&lt;").
    replace(/>/g, "&gt;").
    replace(/\n\r/g, "<br>").
    replace(/\r\n/g, "<br>").
    replace(/\r/g, "<br>").
    replace(/\n/g, "<br>");
}

////////////////////////////////////////////////////////////////////////////////
// 与系统相关
////////////////////////////////////////////////////////////////////////////////

//显示浏览器对话框
function showDialog(url, args, width, height, callback, scope) {
    if (Ext.isChrome && (screen.width - parseInt(width) > 50))
        Ext.getBody().mask();

    //检测参数有效性
    //Ext.encode(args);

    if (args) {
        args.windowWidth = width;
        args.windowHeight = height;
    }
    //需要设置scope，否则不进行回调
    if (!scope) scope = window;

    var result = null;
    $G.open({
        url: url,
        target: "_modal",
        callback: function (r) {
            if (Ext.isChrome && (screen.width - parseInt(width) > 50))
                Ext.getBody().unmask();
            result = r;
            if (callback)
                callback(r, scope);
        },
        features: {
            dialogWidth: width + "px",
            dialogHeight: height + "px"
        },
        scope: scope,
        dialogArgs: args
    });
    return result;
}

////////////////////////////////////////////////////////////////////////////////
// 与 Ext 显示相关
////////////////////////////////////////////////////////////////////////////////

//ExtGrid 显示普通字符串
function renderString(value, p, record) {
    if (value === null) return "";
    else if (value === undefined) return "";
    else return encodeHTML(value.toString());
}

//ExtGrid 显示日期和时间
function renderDateTime(value, p, record) {
    if (value === null) return "";
    else if (value === undefined) return "";
    else if (value === "") return "";
    else if (value.indexOf("9999") != -1) return "";
    else {
        var reDate = /\d{4}\-\d{2}\-\d{2}/gi;
        var reTime = /\d{2}:\d{2}:\d{2}/gi;
        return value.match(reDate) + " " + value.match(reTime);
    }
}

//ExtGrid 只显示日期
function renderDate(value, p, record) {
    var sValue = renderDateTime(value, p, record);
    if (sValue === "") return "";
    else return renderDateTime(value, p, record).split(" ")[0];
}
function msgDialog(sMessage, msgType) {
    if (!window.Ext || window.GTPBrowserDialog)
        return alert(sMessage);
    else {
        var icon = Ext.Msg.INFO;
        if (msgType == "WARNING") icon = Ext.Msg.WARNING;
        if (msgType == "ERROR") icon = Ext.Msg.ERROR;
        var result = Ext.Msg.show({
            title: GTPLibrary_titleWarning,
            msg: sMessage,
            buttons: Ext.Msg.OK,
            icon: icon
        });
        return result;
    }
}
function msgWarning(sMessage) {
    if (!window.Ext || window.GTPBrowserDialog)
        alert(sMessage);
    else
        Ext.MessageBox.show({
            title: GTPLibrary_titleWarning,
            msg: sMessage,
            width: 350,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
}

function msgInfo(sMessage) {
    if (!window.Ext || window.GTPBrowserDialog)
        alert(sMessage);
    else
        Ext.MessageBox.show({
            title: GTPLibrary_titleInfo,
            msg: sMessage,
            width: 350,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
}

function msgError(sMessage) {
    if (!window.Ext || window.GTPBrowserDialog)
        alert(sMessage);
    else
        Ext.MessageBox.show({
            title: GTPLibrary_titleError,
            msg: sMessage,
            width: 350,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
}

function msgConfirm(sMessage, callback) {
    if (!window.Ext || window.GTPBrowserDialog) {
        if (confirm(sMessage))
            callback();
    }
    else
        Ext.MessageBox.confirm(GTPLibrary_titleConfirm, sMessage, function (button, text) {
            if (button == "yes")
                callback();
        });
}

//加载JS并等待回调
function WaitForLoadJsCssFileList(listFileSrc, listFileType, doc, callback, callbackArgs) {
    var args = { callback: callback, callbackArgs: callbackArgs, loadedPageCount: 0, PageCount: listFileSrc.length };
    for (var i = 0; i < listFileSrc.length; i++)
        WaitForLoadJsCssFile(listFileSrc[i], listFileType[i], doc, WaitForLoadJsCssFileListCallBack, args);
}

function WaitForLoadJsCssFileListCallBack(args) {
    if (args.loadedPageCount == -1)
        return;
    args.loadedPageCount++;
    if (args.loadedPageCount >= args.PageCount) {
        args.loadedPageCount = -1;
        args.callback(args.callbackArgs);
    }
}
function WaitForLoadJsCssFile(fileSrc, fileType, doc, callback, callbackArgs) {
    if (bHaveJsCssFile(fileSrc, fileType, doc)) {
        callback(callbackArgs);
        return;
    }
    if (doc == null)
        doc = document;
    var script;
    if (fileType == "js") {
        script = doc.createElement("script")
        script.type = "text/javascript";
    }
    else if (fileType == "css") {
        script = doc.createElement("link")
        script.type = "text/css";
        script.rel = "stylesheet";
    }
    else {
        callback(callbackArgs);
        return;
    }
    script.setAttribute("autoLoad", "true");
    if (script.readyState) {//IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback(callbackArgs);
            }
        };
    }
    else {//Others
        script.onload = function () {
            callback(callbackArgs);
        };
    }
    if (fileType == "js")
        script.src = fileSrc;
    else
        script.href = fileSrc;
    doc.getElementsByTagName("head")[0].appendChild(script);
}

//动态加载js/css文件
function loadJsCssFile(fileSrc, fileType, doc) {
    if (bHaveJsCssFile(fileSrc, fileType, doc))
        return;
    if (doc == null)
        doc = document;
    var fileRef = null;
    if (fileType == "js") {
        fileRef = doc.createElement('script');
        fileRef.setAttribute("type", "text/javascript");
        fileRef.setAttribute("src", fileSrc)
    }
    else if (fileType == "css") {
        fileRef = doc.createElement("link");
        fileRef.setAttribute("rel", "stylesheet");
        fileRef.setAttribute("type", "text/css");
        fileRef.setAttribute("href", fileSrc);
    }
    else
        return;
    fileRef.setAttribute("autoLoad", "true");
    doc.getElementsByTagName("head")[0].appendChild(fileRef);
}

function bHaveJsCssFile(fileSrc, fileType, doc) {
    if (doc == null)
        doc = document;
    var targetElement = ((fileType == "js") ? "script" : ((fileType == "css") ? "link" : ""));
    var targetAttr = ((fileType == "js") ? "src" : ((fileType == "css") ? "href" : ""));
    var all = doc.getElementsByTagName(targetElement);
    for (var i = all.length; i >= 0; i--) {
        if (all[i] != null && all[i].getAttribute(targetAttr) != null && all[i].getAttribute(targetAttr).indexOf(fileSrc) > -1)
            return true;
    }
    return false;
}

function remoceJsCssFile(fileSrc, fileType, doc) {
    if (doc == null)
        doc = document;
    var targetElement = ((fileType == "js") ? "script" : ((fileType == "css") ? "link" : ""));
    var targetAttr = ((fileType == "js") ? "src" : ((fileType == "css") ? "href" : ""));
    var all = doc.getElementsByTagName(targetElement);
    for (var i = all.length; i >= 0; i--) {
        if (all[i] != null && all[i].getAttribute(targetAttr) != null && all[i].getAttribute(targetAttr).indexOf(fileSrc) > -1) {
            all[i].parentNode.removeChild(all[i]);
        }
    }
}

function remoceAllJsCssFile(fileType, doc) {
    if (doc == null)
        doc = document;
    var targetElement = ((fileType == "js") ? "script" : ((fileType == "css") ? "link" : ""));
    var all = doc.getElementsByTagName(targetElement);
    for (var i = all.length; i >= 0; i--) {
        if (all[i] != null) {
            all[i].parentNode.removeChild(all[i]);
        }
    }
}

function remoceAllAutoLoadJsCssFile(fileType, doc) {
    if (doc == null)
        doc = document;
    var targetElement = ((fileType == "js") ? "script" : ((fileType == "css") ? "link" : ""));
    var all = doc.getElementsByTagName(targetElement);
    for (var i = all.length; i >= 0; i--) {
        if (all[i] != null && all[i].getAttribute("autoLoad") == "true") {
            all[i].parentNode.removeChild(all[i]);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// 与服务端数据相关，需要 ExtJS 支持
////////////////////////////////////////////////////////////////////////////////

//调用服务端方法
//uiControler: UIController 类名【必须】
//actionFun: 方法名称【必须】
//args: [] 形式的参数列表【必须】
//callback: 回调函数 function callback(result, callbackArgs)，其中 result 是返回的数据，callbackArgs 是本函数的 callbackArgs 参数【可选】
//callbackArgs: 回调函数调用时的第二个参数
//async: 是否要异步处理，默认为 true，如果为 false 则是同步处理【可选】
function doAction(uiControler, actionFun, args, callback, callbackArgs, async, showMask, customLoadingText) {
    var disp = new Gtp.net.GtpDispatcher({
        async: async,
        showMask: (showMask === false) ? false : true,
        customLoadingText: customLoadingText,
        dispatchArgs: {
            controller: uiControler,
            action: actionFun,
            args: args
        },
        listeners: {
            "success": function (result) {
                if (callback)
                    callback(result, callbackArgs);
            }
        }
    });
    disp.dispatch();
}

function doActionExecute(uiControler, actionFun, args, callback, callbackArgs, async, showMask, customLoadingText) {
    var returnResult;
    doAction(uiControler, actionFun, args, function (result) {
        returnResult = result;
        if (callback)
            callback(returnResult, callbackArgs);
    }, null, async, showMask, customLoadingText);
    if (!async) return returnResult;
}

//由对象中获取指出定hash值的对象，用于反序列化数据使用
function getRefObject(objectList, hashCode) {

    for (var i = 0; i < objectList.length; i++)
        if (objectList[i].__hash == hashCode)
            return objectList[i];

    return null;
}

if (window.Ext && Ext.extend && Ext.tree && Ext.tree.TreeLoader && Ext.data && Ext.data.JsonReader && Ext.data.Store && Ext.grid && Ext.grid.GridPanel && Ext.form && Ext.form.TextField) {
    //王玮封装的 XMLTreeLoader 对象，用于解析由服务端传过来的XML数据为树结构数据
    Ext.ux.GTPXMLTreeLoader = Ext.extend(Ext.tree.TreeLoader, {
        //定义数据常量
        XML_NODE_ELEMENT: 1,
        XML_NODE_TEXT: 3,

        //解析返回的数据
        processResponse: function (response, node, callback) {
            var xmlData = response.responseXML;
            if ($("ErrorCode", xmlData).text() != 0) {
                alert($("ErrorMessage", xmlData).text())
                return;
            }
            var root = $("tree", (xmlData.documentElement || xmlData))[0];

            try {
                node.beginUpdate();
                node.appendChild(this.parseXml(root, node.getOwnerTree()));
                node.endUpdate();

                if (typeof callback == "function") {
                    callback(this, node);
                }
            } catch (e) {
                alert("Error: " + e.message)
                this.handleFailure(response);
            }
        },

        //处理返回的数据并根据数据添加节点
        parseXml: function (node, tree) {
            var nodes = [];
            for (var i = 0; i < node.childNodes.length; i++) {
                var n = node.childNodes[i];
                if (n.nodeType == this.XML_NODE_ELEMENT) //在FireFox和Opera中会出现nodeType为3的元素，需要进行忽略处理
                {
                    //生成整个树中
                    var iID = (typeof (tree.maxID) == "undefined") ? $(n).attr("id") : tree.maxID;

                    var treeNode;
                    if (n.childNodes.length == 0)
                        treeNode = new Ext.tree.AsyncTreeNode({
                            id: iID,
                            text: encodeHTML($(n).attr("txt")),
                            icon: $(n).attr("img") ? this.baseAttrs["imagePath"] + $(n).attr("img") : (tree.onGetImage ? this.baseAttrs["imagePath"] + tree.onGetImage(tree, $(n).attr("type"), $(n).attr("ext"), $(n).attr("id")) : ""),
                            leaf: !($(n).attr("hc") > 0),
                            checked: $(n).attr("chk") ? ($(n).attr("chk") == 1) : undefined
                        });
                    else
                        treeNode = new Ext.tree.TreeNode({
                            id: iID,
                            text: encodeHTML($(n).attr("txt")),
                            icon: $(n).attr("img") ? this.baseAttrs["imagePath"] + $(n).attr("img") : (tree.onGetImage ? this.baseAttrs["imagePath"] + tree.onGetImage(tree, $(n).attr("type"), $(n).attr("ext"), $(n).attr("id")) : ""),
                            leaf: !($(n).attr("hc") > 0),
                            checked: $(n).attr("chk") ? ($(n).attr("chk") == 1) : undefined
                        });

                    Ext.each(n.attributes, function (a) {
                        treeNode.attributes[a.nodeName] = a.nodeValue;
                    });

                    if (typeof (tree.maxID) != "undefined") tree.maxID++;

                    //递归添加子节点
                    treeNode.appendChild(this.parseXml(n, tree));

                    nodes.push(treeNode);
                }
            }

            return nodes;
        }
    });

    //王玮封装的通用下拉展现组件
    Ext.ns("GTP.View.Form.DropDownLayer", "GTP.View.Form.PopupEdit");
    GTP.View.Form.DropDownLayer.create = function (cfg) {
        var _isWin = cfg.resizable;
        var layer;
        var _cfg;
        var _h = cfg.height || 200;
        var _w = cfg.width || 150;
        if (_isWin) {
            _cfg = Ext.apply({ resizable: true, border: false, closable: false, draggable: false, width: _w, height: _h, layout: "fit", items: [cfg.popupElement] }, cfg);
            layer = new Ext.Window(_cfg)
        }
        else {
            layer = new Ext.Layer(cfg);
            layer.swallowEvent('mousewheel');
            layer.setSize(_w, _h);
        }
        layer.popupElement = cfg.popupElement;
        Ext.getDoc().on('mousedown', function (e) {
            if (!layer.isVisible()) return;
            var el = _isWin ? layer.el : layer;
            if (!e.within(layer.baseWrap) && !e.within(el)) {
                layer.hide();
                if (layer.baseElm) layer.baseElm.el.focus();
            }
        });
        layer.popup = function (wrap, elm) {
            var pe = this.popupElement;
            if (!_isWin && !pe.rendered) {
                pe.setWidth(_w);
                pe.setHeight(_h);
                pe.render(this);
            }
            this.show();
            this.alignTo(wrap, this.alignPosition || "tl-bl?");
            this.baseWrap = wrap;
            this.baseElm = elm;

        };
        return layer;
    };

    GTP.View.Form.PopupEdit.create = function (cfg) {
        var rs = cfg.resizable;
        cfg.resizable = undefined;
        var ed = new Ext.form.TriggerField(cfg);
        var _layer = cfg.dropDownLayer || GTP.View.Form.DropDownLayer.create(Ext.apply({ resizable: rs, popupElement: cfg.popupElement }, cfg.layerConfig));
        ed.dropDownLayer = _layer;
        ed.collapse = function () {
            _layer.hide();
            this.el.focus();
        };
        ed.expand = function () { _layer.popup(this.wrap, this); };
        ed.onTriggerClick = function () {
            if (this.disabled) return;
            if (_layer.isVisible()) this.collapse();
            else this.expand();
        };
        ed.setMixedValue = function (v) {
            this.mixedValue = v;
            if (v.value) this.setValue(v.value);
        };
        ed.getMixedValue = function (v) {
            return this.mixedValue || this.getValue();
        }
        return ed;
    };

    //王玮封装的TreePanel组件
    Ext.ns("GTP.View.SimpleTree").create = function (cfg) {
        var _vm = cfg.viewModel;
        if (!_vm) return;
        //设置表格初始化参数
        var _root = new Ext.tree.TreeNode({ isRoot: true, expanded: true });
        var _cfg = Ext.apply({ viewModel: null, animate: false, autoScroll: true, rootVisible: false,
            fitToFrame: true, containerScroll: true, root: _root, autoLoad: true
        }, cfg);
        var v = new Ext.tree.TreePanel(_cfg);
        var _appendChildNode = function (d, pNode, batch) {
            try {
                if (!batch) pNode.beginUpdate();
                if (_cfg.multiSelect && d.checkable !== false) {
                    d.checked = d.checked || false;
                }
                else d.checked = undefined;
                var displayAttrText = _cfg.displayAttr ? d[_cfg.displayAttr] : ((d.text == undefined) ? d.name : d.text);
                var displayText = (d.text == undefined) ? displayAttrText : d.text;
                var n = new Ext.tree.TreeNode({
                    text: _cfg.displayDefault ? displayText : displayAttrText,
                    //text: _cfg.displayAttr ? d[_cfg.displayAttr] : ((d.text == undefined) ? d.name : d.text),
                    icon: d.icon,
                    expandable: !d.leaf,
                    checked: d.checked
                });
                Ext.apply(n.attributes, d);
                n.get = function (attr) { return this.attributes[attr] };
                if (!pNode.childNodes) pNode.childNodes = [];
                pNode.appendChild(n);
                if (!batch) pNode.endUpdate();
                v.fireEvent('appendnode', pNode, n, batch);
            }
            catch (ex) {//debugger
                return n;
            }
            return n;
        };
        var _appendNodes = function (nodes, pNode) {
            pNode = pNode || _root;
            pNode.beginUpdate();
            var firstNode;
            for (var i = 0; i < nodes.length; i++) {
                n = _appendChildNode(nodes[i], pNode, true);
                firstNode = firstNode || n;
            }
            pNode.endUpdate();
            v.fireEvent('appendnodes', pNode, firstNode);
        };
        v.on("beforeexpandnode", function (node) {
            if (node.childNodes.length) return;
            var loadNodes = function (data) {
                if (data && data.length > 0) _appendNodes(data, node);
                else {
                    node.attributes.expandable = false;
                    if (node.ui) node.ui.updateExpandIcon();
                }
            };
            if (node == _root) _vm.getRootNodes(loadNodes);
            else _vm.getChildNodes(node.attributes, loadNodes);
        });
        v.getSelectNodes = function () {
            var ms = _cfg.multiSelect;
            var nodes = ms ? this.getChecked() : this.getSelectionModel().getSelectedNode();
            var ret = new Array();
            if (ms) {
                for (var i = 0; i < nodes.length; i++) {
                    ret[i] = nodes[i];
                }
            }
            else {
                if (nodes) {
                    ret[0] = nodes;
                }
            }
            return ret;
        };
        v.getSingleSelectNode = function () {
            var arr = this.getSelectNodes();
            return (arr.length > 0) ? arr[0] : null;
        };
        v.reloadNodes = function (cfg) {
            if (cfg)
                Ext.apply(_cfg, cfg);
            _root.removeAll(true);
            _vm.changeInitConfig(cfg);
            _vm.getRootNodes(_appendNodes);
        };
        v.appendChildNode = function (data, pNode) {
            var pn = pNode || this.getSelectionModel().getSelectedNode() || _root;
            return _appendChildNode(data, pn);
        };
        v.removeSelectNode = function (node) {
            var n = node || this.getSelectionModel().getSelectedNode();
            if (!n) return;
            var p = n.parentNode;
            p.removeChild(n, true);
            p.ui.updateExpandIcon();
        };
        v.modifySelectNode = function (nodeData, node) {
            var nd = nodeData;
            var n = node || this.getSelectionModel().getSelectedNode();
            if (!n) return;
            n.setText(nd.text);
            Ext.apply(n.attributes, nd);
        };
        v.clearSelections = function () {
            var ms = _cfg.multiSelect;
            if (ms) {
                var arr = this.getChecked();
                for (var i = 0; i < arr.length; i++) {
                    var n = arr[i];
                    var attrs = n.attributes;
                    if (attrs.checked != undefined) {
                        arr[i].ui.checkbox.checked = false;
                        attrs.checked = false;
                    }
                }
            }
            else
                this.getSelectionModel().clearSelections();
        };
        v.changeInitConfig = function (cfg) {
            if (cfg)
                Ext.apply(_cfg, cfg);
        };
        v._appendNodes = _appendNodes;
        return v;
    };

    ///////////////////////////////////////////////////////////////////////////////
    // 由 Ext 扩展的 T 平台的基本类
    ///////////////////////////////////////////////////////////////////////////////

    Ext.ns("GTP.data.JsonReader");
    GTP.data.JsonReader = Ext.extend(Ext.data.JsonReader, {
        read: function (response) {
            var result = Ext.decode(response.responseText);
            if (!result)
                msgError("JsonReader.read: Json object not found.\r\n" + response.responseText);
            else if (result.IsSuccess)
                return this.readRecords(result.Data);
            else
                msgError(result.StatusCode + "---->" + (result.ResultMsg || "server method fail.") + "\r\n" + (result.ResultDetailMsg || ""));
        }
    });

    if (window.Gtp) {
        Ext.ns("GTP.data.Store");
        GTP.data.Store = Ext.extend(Ext.data.Store, {
            appDir: Gtp.net.Global.getAppName() + "/",

            remoteSort: true,

            constructor: function (config) {
                if (!config.controller) {
                    msgError("need controller on create GTP.data.Store object.");
                    return;
                }
                if (!config.queryEntity) {
                    msgError("need queryEntity on create GTP.data.Store object.");
                    return;
                }

                this.args = { queryEntity: config.queryEntity };
                if (config.pageSize) {
                    this.args.index = 0;
                    this.args.size = parseInt(config.pageSize);
                }
                else
                    this.args.size = 0;
                if (config.filters) this.args.filters = config.filters;
                if (config.orders) this.args.orders = config.orders;

                this.baseParams = this.baseParams || {};
                this.baseParams.controller = config.controller;
                this.baseParams.action = config.action ? config.action : "QueryByCriteria";
                this.baseParams.args = Ext.encode([this.args]);
                this.proxy = new Ext.data.HttpProxy({
                    url: "action.ashx" + (this.bizCompName ? "?modulecode=" + this.bizCompName : ""),
                    method: "POST",
                    timeout: 3000000
                });

                GTP.data.Store.superclass.constructor.call(this, Ext.apply(config, {
                }));
            },

            load: function (options) {
                if (this.proxy.url == "action.ashx")
                {
                    this.proxy.url = this.appDir + "action.ashx";
                }
                options = Ext.apply({}, options);
                
                this.storeOptions(options);
                if (this.sortInfo && this.remoteSort) {
                    var pn = this.paramNames;
                    options.params = Ext.apply({}, options.params);
                    options.params[pn.sort] = this.sortInfo.field;
                    options.params[pn.dir] = this.sortInfo.direction;
                    this.args.orders = [{}];
                    this.args.orders[0].propertyName = this.sortInfo.field;
                    this.args.orders[0].isDesc = this.sortInfo.direction == "DESC";
                    this.args.orders[0].cultureKey = $G.getCultureKey();
                    options.params["args"] = Ext.encode([this.args]);
                }
                try {
                    return this.execute("read", null, options);
                } catch (e) {
                    this.handleException(e);
                    return false;
                }
            }
        });

        Ext.ns("GTP.UI.Grid");
        GTP.UI.Grid = Ext.extend(Ext.grid.GridPanel, {
            //fields
            //columns
            //bizCompName
            //controller
            //queryEntity
            //action
            //pageSize
            //storeListeners
            //appDir
            stripeRows: true,
            cls: 'g-grid-norowsline',

            appDir: Gtp.net.Global.getAppName() + "/",

            initComponent: function () {
                if (!this.fields) {
                    msgError("need fields when GTP.UI.Grid initComponent");
                    GTP.UI.Grid.superclass.initComponent.call(this);
                    return;
                }

                if (!this.controller) {
                    msgError("need controller when GTP.UI.Grid initComponent");
                    GTP.UI.Grid.superclass.initComponent.call(this);
                    return;
                }

                if (!this.queryEntity) {
                    msgError("need queryEntity when GTP.UI.Grid initComponent");
                    GTP.UI.Grid.superclass.initComponent.call(this);
                    return;
                }

                if (Ext.isReady && Ext.getBody()) {
                    var waitMask = new Ext.LoadMask(Ext.getBody(), { msg: "加载中，请稍候..." });
                    this.loadMask = waitMask;
                }
                this.store = new GTP.data.Store({
                    reader: new GTP.data.JsonReader({ root: "Entities", totalProperty: "TotalCount" }, this.fields),
                    bizCompName: this.bizCompName,
                    controller: this.controller,
                    queryEntity: this.queryEntity,
                    action: this.action ? this.action : null,
                    pageSize: this.pageSize,
                    appDir: this.appDir,
                    listeners: this.storeListeners,
                    remoteSort: (this.remoteSort == undefined) ? true : this.remoteSort
                });
                this.store.grid = this;

                if (this.pageSize)
                    this.bbar = new Ext.ux.toolbar.GtpUiGridPagingToolbar({
                        pageSize: parseInt(this.pageSize),
                        store: this.store,
                        displayInfo: true,
                        doLoad: function (start) {
                            var o = {}, pn = this.getParams();
                            o[pn.start] = start;
                            o[pn.limit] = this.pageSize;
                            this.store.args.index = start / this.pageSize;
                            this.store.args.size = this.pageSize;
                            o["args"] = Ext.encode([this.store.args]);
                            if (this.fireEvent('beforechange', this, o) !== false) {
                                this.store.load({ params: o });
                            }
                        }
                    });

                GTP.UI.Grid.superclass.initComponent.call(this);
            }
        });
    /**
    * 自定义的[GTP.UI.Grid]分页工具栏控件
    * 
    * @class Ext.ux.toolbar.GtpUiGridPagingToolbar
    * @extends Ext.PagingToolbar
    * @constructor
    * 
    * @param {Object} config 配置选项
    */
    Ext.ux.toolbar.GtpUiGridPagingToolbar = Ext.extend(Ext.PagingToolbar, {
        pageSize: 25,
        displayInfo: true,
        store: null,
        initComponent: function () {
            //加载设置页面数控件
            this.plugins = [new Ext.ux.plugins.PageComboResizer()];
            Ext.ux.toolbar.GtpPagingToolbar.superclass.initComponent.call(this);
            if (this.displayItem) {
                this.displayItem.isDisplayItem = true;
            }
        },
        setPageSize: function (size) {
            /// <summary>动态设置分页大小</summary>
            if (this.pageSize != size) {
                this.pageSize = size;
                if (this.combo) {
                    this.combo.setValue(size);
                }
            }
        }
    });
}

    //防止输入太多
    Ext.form.TextField.prototype.size = 20;
    Ext.form.TextField.prototype.initValue = function () {
        if (this.value !== undefined) {
            this.setValue(this.value);
        } else if (this.el.dom.value.length > 0) {
            this.setValue(this.el.dom.value);
        }
        this.el.dom.size = this.size;
        if (!isNaN(this.maxLength) && (this.maxLength * 1) > 0 && (this.maxLength != Number.MAX_VALUE)) {
            this.el.dom.maxLength = this.maxLength * 1;
        }
    };
}

//卸载js
function _unloadJS(remainLoaded, doc) {
    var idIndex = 0;
    var scripts = doc.getElementsByTagName("script");
    for (var i = scripts.length; i >= 0; i--)
        if ((scripts[i] != null) && scripts[i].id && (scripts[i].id.indexOf("gtpLoadJS") == 0)) {
            var iIndex = parseInt(scripts[i].id.substr(9));
            if (iIndex > idIndex)
                idIndex = iIndex;
            if (!remainLoaded)
                scripts[i].parentNode.removeChild(scripts[i]);
        }
    return ++idIndex;
}

//同步动态加载js
function LoadJS(jsFileList, remainLoaded, doc, async) {
    var v = (window.Gtp && window.Gtp.net && window.Gtp.net.Global && window.Gtp.net.Global.PageContext) ? window.Gtp.net.Global.PageContext.resourceVersion : 0;

    if (doc == null)
        doc = document;
    var idIndex = _unloadJS(remainLoaded, doc); //自动删除动态加载过的JS
    if (jsFileList && (jsFileList.length > 0))
        for (var i = 0; i < jsFileList.length; i++) {
            var sURL = jsFileList[i] + ((jsFileList[i].indexOf("?") == -1) ? "?" : "&") + "v=" + v;
            Ext.Ajax.request({
                url: sURL,
                async: async ? async : false,
                disableCaching: false,
                success: function (response, options) {
                    var script = doc.createElement("script");
                    script.language = "javascript";
                    script.type = "text/javascript";
                    script.id = "gtpLoadJS" + idIndex++;
                    try {
                        script.appendChild(document.createTextNode(response.responseText));
                    }
                    catch (ex) {
                        script.text = response.responseText;
                    }
                    doc.getElementsByTagName("head")[0].appendChild(script);
                },
                failure: function (response, options) {
                    //alert("load js: " + jsFileList[i] + " error. \r errorCode: " + response.status + "\r errorMessage" + response.responseText);
                }
            });
        }
}
////////////////////////////////////////////////////////////////////////////////
// 解决IE8中，A页面嵌套Iframe包含一个页面B，从B页面弹出警告框时 报脚本错误
////////////////////////////////////////////////////////////////////////////////
Ext.Shadow.prototype.realign = function (l, t, w, h) {
    if (!this.el) {
        return;
    }
    var a = this.adjusts,
            d = this.el.dom,
            s = d.style,
            iea = 0,
            sw = Math.max(w + a.w, 0),
            sh = Math.max(h + a.h, 0),
            sws = sw + "px",
            shs = sh + "px",
            cn,
            sww;
    s.left = (l + a.l) + "px";
    s.top = (t + a.t) + "px";
    if (s.width != sws || s.height != shs) {
        s.width = sws;
        s.height = shs;
        if (!Ext.isIE) {
            cn = d.childNodes;
            sww = Math.max(0, (sw - 12)) + "px";
            cn[0].childNodes[1].style.width = sww;
            cn[1].childNodes[1].style.width = sww;
            cn[2].childNodes[1].style.width = sww;
            cn[1].style.height = Math.max(0, (sh - 12)) + "px";
        }
    }
};

////////////////////////////////////////////////////////////////////////////////
// 发送框相关 设置发送框的宽度和高度
////////////////////////////////////////////////////////////////////////////////
function getDlgWidth(url, defaultValue) {
    var param = Ext.urlDecode(url.substr(url.indexOf("?") + 1));
    var iWidth = param.width;
    if (iWidth)
        return parseInt(iWidth);
    return defaultValue ? defaultValue : 640;
}
//从 URL 中解析出对话框显示的高度
function getDlgHeight(url, defaultValue) {
    var param = Ext.urlDecode(url.substr(url.indexOf("?") + 1));
    var iHeight = param.height;
    if (iHeight)
        return parseInt(iHeight);
    return defaultValue ? defaultValue : 480;
}
////////////////////////////////////////////////////////////////////////////////
// 字符串及字符串数组相关
////////////////////////////////////////////////////////////////////////////////
//移除数组内的重复项
function removeArrRepeat(ary) {
    var str = "";
    var nary = ary.sort();
    for (var i = 0; i < ary.length; i++) {
        var isExist = false;
        for (var j = i + 1; j < nary.length; j++) {
            if (nary[i] == nary[j]) { isExist = true; break; }
        }
        if (!isExist)
            str += ary[i] + "^";
    }
    return str.split('^');
}
/**
* 根据长度截取先使用字符串，超长部分追加...
* @param str 对象字符串
* @param len 目标字节长度
* @return 处理结果字符串
*/
function cutString(str, len) {
    //length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + "...";
            }
        }
    }
    return s;
}
function formatString(strA, len) {
    var strlen = 0;
    var str = '';
    for (var i = 0; i < strA.length; i++) {
        if (strA.charCodeAt(i) > 128) {
            strlen = strlen + 2;
        } else {
            strlen = strlen + 1;
            str = str + '&nbsp;';
        }
    }
    while (strlen <= len) {
        str = str + '&nbsp;&nbsp;';
        strlen += 1;
    }
    return str;
}
////////////////////////////////////////////////////////////////////////////////
// 本地时间相关
////////////////////////////////////////////////////////////////////////////////
//获取当前时间
function curentTime() {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();
    var clock = year + "-";
    if (month < 10) clock += "0";
    clock += month + "-";
    if (day < 10) clock += "0";
    clock += day + " ";
    if (hh < 10) clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return (clock);
}
function formatCNTime(sTime) {
    var arrTime2 = sTime.split('T');
    var arrTime = arrTime2.length == 2 ? arrTime2[0].split('-') : sTime.split('-');
    var sdTime = arrTime2.length == 2 ? arrTime2[1] : "";
    var week = "";
    if (arrTime.length >= 3) {
        var ssTime = new Date(arrTime[0] + '/' + arrTime[1] + '/' + arrTime[2]);
        var year = ssTime.getFullYear();       //年
        var month = ssTime.getMonth() + 1;     //月
        var day = ssTime.getDate();
        switch (ssTime.getDay()) {
            case 0: week = "周日"; break;
            case 1: week = "周一"; break;
            case 2: week = "周二"; break;
            case 3: week = "周三"; break;
            case 4: week = "周四"; break;
            case 5: week = "周五"; break;
            case 6: week = "周六"; break;
            default: week = ""; break;
        }
        sTime = year + "-" + month + "-" + day + "(" + week + ")" + sdTime;
    }
    return sTime;
}

function setPageParam(value, reserved) {
    var result = "";

    params = { Function: "SetPageParam", value: value };
    if (reserved) params.reserved = 1;

    Ext.Ajax.request({
        url: "/Workflow/Ajax.ashx",
        params: params,
        async: false,
        success: function (response, options) { result = response.responseText; },
        failure: function (response, options) { }
    });

    return result;
}

function getPageParam(name, reserved) {
    var result = "";

    params = { Function: "GetPageParam", name: name };
    if (reserved) params.reserved = 1;

    Ext.Ajax.request({
        url: "/Workflow/Ajax.ashx",
        params: params,
        async: false,
        success: function (response, options) { result = response.responseText; },
        failure: function (response, options) { }
    });

    return result;
}﻿var loadApiFiles = [];
/*下面3个文件是原Workflow.api.js*/
loadApiFiles.push($G.getAppName() + "/Workflow/js/Workflow.api.keepCompatible.js");
loadApiFiles.push($G.getAppName() + "/Workflow/js/Workflow.api.services.js");
/*动态加载*/
LoadJS(loadApiFiles);
﻿var loadBaseFiles = [];
/*下面8个文件是原Workflow.base.js*/

//loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.convertToAction.js");
//loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.actExecuterHandler.js");
//loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.actExecuterDefine.js");
//loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.keepCompatible.js");

//loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.static.js");
//loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.taskControlValid.js");
//loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskApprove.js");


//loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.monitor.js");

loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.actExecute.js");
loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.keepCompatible.js");
loadBaseFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.taskControlValid.js");
/*动态加载*/
LoadJS(loadBaseFiles);﻿var loadActionFiles = [];
/*下面6个文件是原Workflow.action.js*/
//loadActionFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.hotkey.js");
//loadActionFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.action.js");
//loadActionFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.task.js");
//loadActionFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.annotate.js");
//loadActionFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.taskControl.js");
//loadActionFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.keepCompatible.js");

loadActionFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.taskAction.js");
loadActionFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.taskControl.js");
loadActionFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.keepCompatible.js");
/*动态加载*/
LoadJS(loadActionFiles);
﻿var loadFiles = [];
/*下面3个文件是原Workflow.ux.js*/
//loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskSend.freeTask.js");
//loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskCenter.js");
//loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskSend.main.js");
//loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskSend.divSearch.js");
//loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskSend.dialogShow.js");
//loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskSend.default.js");
/////*下面文件是客户化定制文件*/
//loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.custom.js");

loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskCenter.js");
loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskSend.js");
loadFiles.push($G.getAppName() + "/Workflow/js/Workflow.ui.taskSend.default.js");
/*动态加载*/
LoadJS(loadFiles);
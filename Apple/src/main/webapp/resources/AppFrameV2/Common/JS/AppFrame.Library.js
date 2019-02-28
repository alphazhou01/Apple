/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
Ext.namespace("Ext.AppFrame.Common");
//得到当前部门
Ext.AppFrame.Common.getDeptId = function () {
    //以当前页面配置的为优先
    if (!Ext.isEmpty(_this._DeptID)) return _this._DeptID;
    else {
        return ($G.PageContext.frameDeptID && $G.PageContext.frameDeptID > 0) ? $G.PageContext.frameDeptID : $G.PageContext.deptId;
    }
};

Ext.AppFrame.Common.getDeptName = function () {
    //以当前页面配置的为优先
    if (!Ext.isEmpty(_this._DeptName)) return _this._DeptName;
    else {
        return $G.PageContext.frameDeptName ? $G.PageContext.frameDeptName : $G.PageContext.deptName;
    }
};

Ext.AppFrame.Common.getDeptCode = function () {
    //以当前页面配置的为优先
    if (!Ext.isEmpty(_this._DeptID)) return _this._DeptCode;
    else {
        return $G.PageContext.frameDeptCode ? $G.PageContext.frameDeptCode : $G.PageContext.deptCode;
    }
};



Ext.AppFrame.Common.getDeptFullId = function () {
    //以当前页面配置的为优先
    if (!Ext.isEmpty(_this._DeptFullID)) return _this._DeptFullID;
    else {
        if ($G.PageContext.frameDeptFullId && $G.PageContext.frameDeptFullId != undefined) return $G.PageContext.frameDeptFullId;
        else return $G.PageContext.frameSelectDept;
    }
};

Ext.AppFrame.Common.getServerTime = function () {
    //得到服务器时间
    var d = new Date();
    var c = $G.PageContext.timeDifference;
    if (!Ext.isEmpty(c) && !isNaN(c))
        d.setTime(d.getTime() + c);
    return d;
};

//说明：正则表达式验证
Ext.AppFrame.Common.validate = function (str, exp) {
    var reg = new RegExp(exp);
    return reg.test(str);
};

Ext.AppFrame.Common.createGuid = function () {
    /// <summary>创建GUID</summary>
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
        guid += n;
    }
    return guid;
};

Ext.AppFrame.Common.getModuleApfExtend = function (ExtName, moduleCode) {
    /// <summary>一次性获取所有的扩展属性</summary>
    if (Ext.isEmpty(moduleCode)) moduleCode = Gtp.net.Global.getModuleCode();
    if (Ext.isEmpty(ExtName)) ExtName = "allpageExtends";
    //先从PageContext中获取吧

    if (Ext.isEmpty($G.PageExtend[ExtName])) {
        Gtp.net.Global.dispatcher({
            controller: $G.getPageController(),
            async: false,
            action: "GetAllPageAPFExtend",
            args: [moduleCode],
            success: function (result) {
                for (var i = 0; i < result.length; i++) {
                    //如果页面有此扩展属性，以页面的优先..
                    if (Ext.isEmpty($G.PageExtend[result[i].Name]))
                        $G.PageExtend[result[i].Name] = result[i].Value;
                }
            }
        });
    }
    if (Ext.isEmpty($G.PageExtend[ExtName])) $G.PageExtend[ExtName] = "(null)";
    return $G.PageExtend[ExtName];
};

//[Start]
Ext.AppFrame.Common.getPlatArguments = function (sectionId, keyList) {
    ///<summary>获取平台系统参数</summary>
    var ret = new Array;
    Gtp.net.Global.dispatcher({
        controller: $G.getPageController(),
        async: false,
        action: "GetPlatArguments",
        args: [sectionId, keyList],
        success: function (result) {
            ret = result;
        },
        failure: function () {

        }
    });
    return ret;
};
//[End]

Ext.AppFrame.Common.getModuleApfExtendByEntity = function (ExtName, entityCode) {
    /// <summary>一次性获取所有的扩展属性</summary>
    if (Ext.isEmpty(entityCode)) {
        $G.PageExtend[ExtName] = "(null)";
    }
    if (Ext.isEmpty($G.PageExtend[ExtName])) {
        Gtp.net.Global.dispatcher({
            controller: Gtp.net.Global.getPageController(),
            async: false,
            action: "GetModuleAPFExtendByEntity",
            args: [ExtName, entityCode],
            success: function (result) {
                if (result) $G.PageExtend[ExtName] = result;
            }
        });
    }
    if (Ext.isEmpty($G.PageExtend[ExtName])) $G.PageExtend[ExtName] = "(null)";
    return $G.PageExtend[ExtName];
};

//[Start]
Ext.AppFrame.Common.setLinkColumn = function (grid, fields, func) {
    ///<summary>构造超链接字段</summary>
    if (grid && fields && func) {
        var cm = grid.getColumnModel();
        for (var i = 0; i < fields.length; i++) {
            if (fields[i]) {
                var colIndex = cm.findColumnIndex(fields[i]);
                if (colIndex >= 0) {
                    var col = cm.getColumnById(cm.getColumnId(colIndex));

                    //2013-12-20 update TP-20116，钢子提供，解决：采用规则设置列表页行数据背景效果锁定列失效
                    col.addRenderer(col.id + "_renderer", function (value, metadata, record, rowIndex, colIndex, store) {
                        if (value == null || value == undefined) {
                            return "";
                        }
                        else {
                            return func(value, metadata, record, rowIndex, colIndex, store);
                        }
                    }, this);
                }
            }
        }
    }
};
//[End]

//type:类型，propertyName：属性名，op：操作名，value：操作值，
Ext.AppFrame.Common.addFilter = function (type, propertyName, op, value, cultureKey) {
    ///<summary>增加过滤条件</summary>
    return {
        cultureKey: cultureKey,
        displayValue: "",
        op: op || "eq",
        propertyName: propertyName,
        skipValue: "",
        type: type,
        value: value || "",
        valueRefrenceId: null
    }
};

//--------------业务锁操作----------------------//
Ext.AppFrame.Common.addBizLock = function (entityType, recordKey, timeout, throwOnError) {
    ///<summary>申请业务锁，锁定当前记录的RootId，</summary>
    var result = false; //是否申请锁成功。如果弹出异常，返回默认false

    $G.dispatcher({
        async: false,
        action: "AcquireBillBizLock",
        args: ["锁定单据记录", entityType, recordKey, timeout, throwOnError],
        success: function (identity) {
            if (identity) {
                result = true;
            }
            else {
                result = false;
            }
        },
        failuer: function () {
            result = false;
        }
    });

    return result;
};

Ext.AppFrame.Common.releaseBizLock = function (entityType, recordKey, throwOnError) {
    $G.dispatcher({
        async: false,
        action: "ReleaseBillBizLock",
        args: [entityType, recordKey, throwOnError],
        success: function (result) {
            if (result) {
                return true;
            }
            else {
                return false;
            }
        },
        failure: function (re, type, message) {
            return false;
        }
    });
};
//--------------业务锁操作----------------------//

Ext.namespace("Ext.AppFrame.DeptCommon");
//_deployDeptId:树依赖节点ID,_bizTypeCode业务类型，_levelTypeCode级别类型，_direction树构造类型，_deployIsRoot依赖节点是否为根节点
Ext.AppFrame.DeptCommon.getFixedNodes = function (_deployDeptId, _bizTypeCode, _levelTypeCode, _direction, _deployIsRoot) {
    ///<summary></summary>
    var fixnode = new Array();
    if (_deployDeptId) {
        if (_direction == "0") {//上级
            var disp = new Gtp.net.GtpDispatcher({
                async: false,
                dispatchArgs: {
                    controller: Gtp.net.Global.getPageController(),
                    action: "getAllParentDeptsByBizType",
                    args: [_deployDeptId, _bizTypeCode, _levelTypeCode]
                },
                listeners: {
                    scope: this,
                    'success': function (result) {
                        if (result && result.length > 0) {
                            // fixnode.push({ Id: result, ObjType: 0 });
                            for (var i = 0; i < result.length; i++) {
                                if (i == result.length - 1) fixnode.push({ Id: result[i], ObjType: 0, Root: true, IncludeChild: false });
                                else fixnode.push({ Id: result[i], ObjType: 0, IncludeChild: false });
                            }
                        }
                    },
                    'failure': function () {
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "获取部门数据错误");
                    }
                }
            });
            disp.dispatch();
        }
        else if (_direction == "1") {//本上
            fixnode.push({ Id: _deployDeptId, ObjType: 0, IncludeChild: false });
        }
        else if (_direction == "2") {//本下，默认本下级，本下包含：1、显示直属上级的本下级，只显示不可选，2、不带直属上级的本下级。使用deployDeptId控制
            if (_deployIsRoot == true || _deployIsRoot == 'true')
                fixnode.push({ Id: _deployDeptId, ObjType: 0, Root: true, IncludeChild: true });
            else
                fixnode.push({ Id: _deployDeptId, ObjType: 0, IncludeChild: true });
        }
        else if (_direction == "3") { //下级
            var disp = new Gtp.net.GtpDispatcher({
                async: false,
                dispatchArgs: {
                    controller: Gtp.net.Global.getPageController(),
                    action: "getChildDeptIdsByDeptId",
                    args: [_deployDeptId, _bizTypeCode, _levelTypeCode]
                },
                listeners: {
                    scope: this,
                    'success': function (result) {
                        if (result && result.length > 0) {
                            for (var i = 0; i < result.length; i++) {
                                fixnode.push({ Id: result[i], ObjType: 0, Root: true, IncludeChild: true });
                            }
                        }
                    },
                    'failure': function () {
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "获取部门数据错误");
                    }
                }
            });
            disp.dispatch();
        }
    }
    return fixnode;
};

Ext.AppFrame.DeptCommon.createDeptTreeByDeployDeptId = function (config) {
    ///<summary>插入部门树</summary>
    $webAppPath = "/org/"; //增加一下配置
    if (!config.fixedNodeIds || config.fixedNodeIds.length == 0) {
        var fixedNodeIds = Ext.AppFrame.DeptCommon.getFixedNodes(config.deployDeptId, config.bizTypeCode, config.levelTypeCode, config.direction, config.deployIsRoot, config.deployDeptId);
        if (fixedNodeIds && fixedNodeIds.length > 0)
            config.fixedNodeIds = fixedNodeIds;
    }
    if (Ext.isArray(config.fixedNodeIds)) {
        var isRoot = false;
        for (var i = 0; i < config.fixedNodeIds.length; i++) {
            if (!!config.fixedNodeIds[i].Root) {
                config.partTree = true;
                isRoot = true;
                break;
            }
        }
        if (!isRoot) config.partTree = false;
    }
    var treeView = (config.vt == 0) ? Org.View.OrgTreeSelector.create(config) : Org.View.OrgTwoSideSelector.create(config)
    return treeView;
};

Ext.AppFrame.DeptCommon.createDeptTree = function (nodeClickFunc, renderToPanel, config) {
    //构造组织机构树
    var eventList = new Array();
    if (!Ext.isEmpty(nodeClickFunc)) eventList.push(["nodeClick", nodeClickFunc]);
    var default_config = {
        vt: 0,
        border: false,
        dummyVisible: true,                                   //虚部门是否可见
        dummySelectAble: true,                                //是否选择虚部门
        postVisible: false,                                    //岗位是否可见
        postSelectAble: false,                                 //是否选择岗位
        authCode: null,                                        //部门权限Code
        userAuthCode: null,                                    //人员权限Code
        selectMode: "Dept",                                    //树显示视图 Dept(组织)、User(用户)、Role(角色)、DeptUser(部门用户)、DeptRole(部门角色)、DeptUserRole(部门用户角色)
        levelTypeCode: config.levelTypeCode,        //"DL_GROUP,DL_CORP,DL_PROJECT",只显示公司，项目部和集团
        autoScroll: true,
        bizTypeCode: config.bizTypeCode,            //类别编码
        direction: 2,                                          //构造方向
        partTree: true,
        deployIsRoot: true,
        eventRewrite: false,
        eventList: eventList
    };
    if (config && !config.eventRewrite) {
        if (!config.eventList) config.eventList = new Array();
        config.eventList.push(eventList[0]);
    }

    config = Ext.applyIf(config || {}, default_config);

    var treeView = Ext.AppFrame.DeptCommon.createDeptTreeByDeployDeptId(config);

    if (config.eventList) {
        //给选择节点挂接事件
        for (var k = 0; k < config.eventList.length; k++) {
            if (config.eventList[k][0] == "nodeClick")
                treeView.on(config.eventList[k][0], config.eventList[k][1], this);
        }
    }
    if (renderToPanel) {
        if (Ext.isString(renderToPanel)) { renderToPanel = $G.getCmp(renderToPanel); }
        if (Ext.isObject(renderToPanel)) {
            renderToPanel.add(treeView);
            renderToPanel.setWidth(config.panelWidth ? config.panelWidth : 250);
            renderToPanel.doLayout();
            while (renderToPanel.ownerCt) {
                renderToPanel.ownerCt.doLayout();
                renderToPanel = renderToPanel.ownerCt;
            }
            //            var viewport = $G.getCmp("viewport");
            //            if (viewport) viewport.doLayout();
        }
    }

    return treeView;
};
//[End]


////////////////////////////////////////////////////////////////  
// 功能名称：公用工具集
// 功能说明：
////////////////////////////////////////////////////////////////
Ext.namespace("Ext.AppFrame.Util");
Ext.AppFrame.Util.mergeQueryPlanParam = function (planParam1, planParam2) {
    ///<summary>合并查询方案参数</summary>
    if (planParam1) {
        if (planParam2) {
            planParam1.filters = $G.mergeFilters(planParam1.filters, planParam2.filters);
            if (planParam2.orders && planParam2.orders.length > 0) planParam1.orders = planParam2.orders;
        }
        return planParam1;
    }
    else if (planParam2) return planParam2;
    else
        return undefined;

};
Ext.AppFrame.Util.createQueryBox = function (grid, config) {
    //构建查询方案Box
    if (grid.apf_queryBox) return grid.apf_queryBox; //说明已经创建过了.
    if (!grid.apf_ds) {
        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "dataSource"));
        return;
    }
    if (!Ext.ux.query.createQueryBox || !Ext.isFunction(Ext.ux.query.createQueryBox)) {
        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "js"));
        return;
    }

    var default_config = {
        entityType: grid.apf_ds.type, //绑定实体全名称
        controlType: "grid",          //查询方案的分类
        id: grid.id + "_queryBox1",   //查询方案框的id, 2013-05-27 ghy add "_"
        hasSchemeManagement: true,    //右侧是否有查询方案管理
        queryViewPageName: "",        //返回查询方案框实例
        grid: grid,                   //数据控件名称
        toolbar: null,                //工具条名称
        queryViewControlName: "", //基本查询中queryView控件名称
        config: { FuzzyNew: true }
    };
    config = Ext.applyIf(config || {}, default_config);

    grid.apf_queryBox = Ext.ux.query.createQueryBox(
                config.entityType,
                config.controlType,
                config.id,
                config.hasSchemeManagement,
                config.queryViewPageName,
                config.grid,
                config.toolbar,
                config.queryViewControlName,
                config.config
            );
    if (!grid.apf_queryBox) {
        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "js"));
        return;
    }

    if (!config.getCriteira) { //如果没有指定才创建
        grid.apf_queryBox.on("getCriteira", function (queryBoxParam) {
            var qp = grid.apf_queryPlan;
            if (qp) {
                qp.currentPage = 1;
                if (queryBoxParam.size > 0) qp.pageSize = queryBoxParam.size;
            }
            if (grid.AP_loadData && Ext.isFunction(grid.AP_loadData)) grid.AP_loadData({
                resetpage: true,
                pageSize: qp.pageSize,
                noCacheParam: true
            });
        });
    }
    else {
        grid.apf_queryBox.on("getCriteira", config.getCriteira);
    }
    return grid.apf_queryBox;

};

Ext.AppFrame.Util.getBizPluginJSFiles = function (configFile, range) {
    ///<summary>加载业务插件JS</summary>
    var loadjsFiles = [];
    if (Ext.isEmpty(configFile)) configFile = $G.getAppName() + "/GCB/AppFrame/Common/BizPlugin.xml?v=" + $G.PageContext.resourceVersion;
    if (Ext.isEmpty(range)) range = "EDITPAGE";

    Ext.Ajax.request({
        url: configFile,
        async: false,
        disableCaching: false,
        success: function (response, options) {
            var dom = response.responseXML;
            if (dom) {
                var nodes = dom.getElementsByTagName("plugin");
                for (var j = 0; j < nodes.length; j++) {
                    var node = nodes[j];
                    var bizCode = node.getAttribute("bizCode").toUpperCase();
                    var r = node.getAttribute("range").toUpperCase();
                    var moduleCode = $G.getModuleCode().toUpperCase();
                    var bMatch = false;
                    if (moduleCode.indexOf(bizCode) == 0 && (r == "*" || r == range)) bMatch = true;
                    if (bMatch) {
                        var jsFileName = node.getAttribute("jsFileName");
                        var arrayjsFileName = [];
                        if (jsFileName) {
                            arrayjsFileName = jsFileName.split(";");
                            for (var i = 0; i < arrayjsFileName.length; i++) {
                                arrayjsFileName[i] = arrayjsFileName[i].replace("~", $G.getAppName());
                                loadjsFiles.push(arrayjsFileName[i]);
                            }
                        }
                    }
                }
            }
        },
        failure: function (response, options) {
        }
    });
    return loadjsFiles;
};

//卸载js
Ext.AppFrame.Util._unloadJS = function (remainLoaded, doc) {
    var idIndex = 0;
    var scripts = doc.getElementsByTagName("script");
    for (var i = scripts.length; i >= 0; i--) {
        if ((scripts[i] != null) && scripts[i].id && (scripts[i].id.indexOf("gtpLoadJS") == 0)) {
            if (!remainLoaded)
                scripts[i].parentNode.removeChild(scripts[i]);
            else {
                var iIndex = parseInt(scripts[i].id.substr(9));
                if (iIndex > idIndex)
                    idIndex = iIndex;
            }
        }
    }
    return ++idIndex;
};

//同步动态加载js
Ext.AppFrame.Util.LoadJS = function (jsFileList, remainLoaded, doc, async) {
    if (doc == null)
        doc = document;
    var idIndex = Ext.AppFrame.Util._unloadJS(remainLoaded, doc); //自动删除动态加载过的JS
    if (jsFileList && (jsFileList.length > 0)) {
        for (var i = 0; i < jsFileList.length; i++) {
            Ext.Ajax.request({
                url: jsFileList[i],
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
};

Ext.AppFrame.Util.CheckJS = function (jsFileList) {
    var cloneFileList = new Array();
    if (jsFileList) {
        if (Ext.isArray(jsFileList)) {
            cloneFileList = jsFileList.clone(true);
        }
        else if (Ext.isString(jsFileList)) {
            cloneFileList.push(jsFileList);
            jsFileList = cloneFileList.clone();
        }
    }

    var scripts = document.getElementsByTagName("script");
    for (var j = 0; j < jsFileList.length; j++) {
        if (scripts && scripts.length > 0) {
            for (i = 0; i < scripts.length; i++) {
                var currentScript = scripts[i];
                if (currentScript.src.indexOf(jsFileList[j]) > 0) {
                    if (currentScript.readyState == 'loaded' || currentScript.readyState == 'complete') {
                        cloneFileList.remove(jsFileList[j]);
                    }
                }
            }
        }
    }
    return cloneFileList;
};


Ext.AppFrame.Util.GetPY = function (name) {
    // 获取拼音数组
    var ret = [];
    Gtp.net.Global.dispatcher({
        controller: "GTP.AppFrameV2.UtilPage",
        async: false,
        action: "GetPYArray",
        args: [name],
        success: function (result) {
            ret = result;
        }
    });
    return ret;
};

Ext.AppFrame.Util.InitPYControl = function (config) {
    ///<summary>设置拼音控件</summary>
    config = config || {};
    var s = $G.getCmp(config.sourceControlName);
    var d = $G.getCmp(config.descControlName);
    if (s && d) {
        s.on("focus", function (item, e) {
            item.keyPressed = true;
        }, s);
        s.on("valid", function (item) {
            if (!item.keyPressed || !item.rendered || d.readOnly) return;
            if (config.canValidFunc) {
                var ret = config.canValidFunc();
                if (!ret) return;
            }
            var val = item.getValue();
            if (item.oldValue != val) {
                item.oldValue = val;
                if (!Ext.isEmpty(val)) {
                    var ret = Ext.AppFrame.Util.GetPY(val);
                    var ds = $G.DataContext.getDataSource(d.ownerCt.dataSource);
                    if (ds && d.dataIndex) {
                        var rec = ds.getDataRecord();
                        if (rec) rec.set(d.dataIndex, ret[0]);
                    }
                    else {
                        d.setValue(ret[0]);
                    }
                    item.keyPressed = false;
                }
            }
        }, s);
    }
}

Ext.namespace("Ext.AppFrame.Extend");
//***DataSource扩展***
Ext.AppFrame.Extend.Ap_DataSource_Init = function (dataSourceName) {

    var dataSource = $G.DataContext.getDataSource(dataSourceName);

    //增加保存成功,删除成功，添加记录之后等事件
    dataSource.addEvents("beforeloaddata", "beforesave", "aftersave", "beforedelete", "afterdelete", "afteradd", "onnodata");

    // 私有
    __dispatcherCallBack = function (func, result, cacheKey, opts) {
        if (func) {
            if (Ext.isFunction(func)) {
                func.call(this, result, cacheKey, opts);
            }
            else if (Ext.isArray(func) && func.length > 0) {
                for (var i = 0; i < func.length; i++) {
                    if (Ext.isFunction(func[i])) func[i].call(this, result, cacheKey, opts);
                }
            }
        }
    };

    __dispatcherFailure = function (func, result) {
        if (func) {
            if (Ext.isFunction(func)) {
                func.apply(this, result);
            }
            else if (Ext.isArray(func) && func.length > 0) {
                for (var i = 0; i < func.length; i++) {
                    if (Ext.isFunction(func[i])) func[i].apply(this, result);
                }
            }
        }
    };

    dataSource.addRecord = function (id) {
        /// <summary>重写了基类的方法，主要是为了触发afteradd事件</summary>
        var me = this;
        var result = this.insertRecord(-1, id);

        var deptId = Ext.AppFrame.Common.getDeptId(); //统一入口
        var deptName = Ext.AppFrame.Common.getDeptName();
        var deptCode = Ext.AppFrame.Common.getDeptCode();
        var fulldeptId = Ext.AppFrame.Common.getDeptFullId();
        me.AP_setFieldValue("Dept.FullDeptId", fulldeptId);
        me.AP_setFieldValue("Dept.DeptId", deptId);
        me.AP_setFieldValue("D_DeptId", deptId);
        me.AP_setFieldValue("D_FullDeptId", fulldeptId);
        me.AP_setFieldValue("Dept.Name", deptName);
        me.AP_setFieldValue("DeptName", deptName);
        me.AP_setFieldValue("Dept.Code", deptCode);

        this.fireEvent("afteradd", result);
        return result;
    },

    dataSource.AP_getDefaultConfig = function (isCache, action, args) {
        var config = {
            async: true,
            controller: Gtp.net.Global.getPageController(),
            action: action,
            args: args, //不能写成args||[]
            success: [],
            failure: function () {
                return true;
            }
        };
        if (isCache) config.cacheResult = this.needCache();
        return config;
    };

    dataSource.AP_getDefaultQueryPlanParam = function () {
        var me = this;
        var queryPlanParam = {
            filters: [],
            index: 0,
            maxResultCount: 0,
            orders: [],
            queryEntity: me.type,
            queryProjectionViewName: "",
            size: 25
        }
        return [queryPlanParam];
    };

    dataSource.AP_setPageSize = function (size) {
        var me = this;
        if (me.dataLinks)
            me.dataLinks.each(function (dataLink) {
                if (dataLink.ctrl instanceof Ext.PagingToolbar) {
                    dataLink.ctrl.setPageSize(size);
                }
            });
    }

    //加载数据 
    dataSource.AP_loadData = function (config) {
        /*** 
        参数 focusId：加载数据后定位到当前记录的Id==focusId的记录，如果参数noFocus==true，则不定位.
        参数 resetpage：重置工具栏，如果pageSize>0，同时设置工具栏的大小
        参数 pageIndex,设置外面的GridView读取第pageIndex页数据
        ***/
        var me = this;
        var defaultConfig = me.AP_getDefaultConfig(true, "QueryByCriteria");

        config = Ext.applyIf(config || {}, defaultConfig);

        var _success = config.success;

        var innerSuccessFun = function (result, cacheKey, opts) {
            if (!config.notLoadToDataSource) {
                var crossData = result.CrossData;
                if (!Ext.isEmpty(crossData)) {
                    delete result.CrossData;
                }
                var append = false;
                if (config.append) append = config.append;
                if (me.preProcessResultFunc && Ext.isFunction(me.preProcessResultFunc)) { //预处理一把
                    result = me.preProcessResultFunc(result);
                }
                me.loadData(result, append, opts);
            }
            //处理分页工具栏
            if (config.resetpage || !me._initPagingToolbarEvent) {
                if (me.dataLinks) {
                    me.dataLinks.each(function (item) {
                        if (item.ctrl instanceof Ext.PagingToolbar) {
                            if (!me._initPagingToolbarEvent) {
                                item.ctrl.on("loaddata", function (item, index, size) {
                                    if (config.controlId) {

                                        var control = $G.getCmp(config.controlId);
                                        delete config.controlId;
                                        if (config.resetpage) delete config.resetpage;
                                        if (config.parentId) delete config.parentId;
                                        if (config.AP_getGroupByParams) delete config.AP_getGroupByParams;
                                        if (config.append) delete config.append;

                                        config.pageIndex = index;
                                        config.pageSize = size;
                                        config.needCount = false; //分页的时候就不需要Count了.
                                        if (_success) config.success = _success;
                                        if (control.AP_loadData && Ext.isFunction(control.AP_loadData))
                                            control.AP_loadData(config);
                                    }

                                }, this);
                            }
                            if (config.resetpage) {
                                if (config.pageSize && parseInt(config.pageSize) > 0) item.ctrl.setPageSize(config.pageSize);
                                item.ctrl.reset(0);
                            }
                        }
                    });
                    me._initPagingToolbarEvent = true;
                }
            }

        }

        var innerSuccessFun1 = function (result, cacheKey, opts) {
            if (Ext.isEmpty(result) || result.TotalCount == 0) {
                me.fireEvent("onnodata", me);
            }
        }

        config.success = function (result, cacheKey, opts) {
            __dispatcherCallBack.call(me, innerSuccessFun1, result, cacheKey, opts);
            __dispatcherCallBack.call(me, innerSuccessFun, result, cacheKey, opts);
            __dispatcherCallBack.call(me, _success, result, cacheKey, opts);
        }
        var _failure = config.failure;
        config.failure = function () {
            __dispatcherFailure.call(me, _failure, arguments);
        }
        //如果没有arg，就自动创建一个默认的？
        if (config.action == "QueryByCriteria" && Ext.isEmpty(config.args))
            config.args = me.AP_getDefaultQueryPlanParam();

        me.fireEvent("beforeloaddata", me); //加载数据前事件

        $G.dispatcher(config);
    };


    //根据Id加载数据
    dataSource.AP_loadDataById = function (id, config) {
        var me = this;
        var defaultConfig = me.AP_getDefaultConfig(true, "FindByKey", [id, me.type]);
        config = Ext.applyIf(config || {}, defaultConfig);

        if (config.entityPvName) { //按数据视图进行读取
            config.action = "FindByKeyAndView";
            config.args = [{
                QueryEntity: me.type,
                QueryKey: id,
                QueryProjectionViewName: config.entityPvName,
                QueryLobFields: config.queryLobFields
            }];
        } else if (config.queryLobFields) //说明有Bolb字段
        {
            config.action = "FindFullEntityByKey";
            config.args = [id, me.type, config.queryLobFields];
        }


        var innerSuccessFun = function (result) {
            if (me.preProcessResultFunc && Ext.isFunction(me.preProcessResultFunc)) { //预处理一把
                result = me.preProcessResultFunc(result);
            }
            if (Ext.isEmpty(result)) {
                me.fireEvent("onnodata", me); //没有数据怎么办..
            } else {
                if (!config.notLoadToDataSource) me.loadData(result); //如果不需要加载数据就别加载了..比如复制数据
            }
        }

        var _success = config.success;
        config.success = function (result) {
            __dispatcherCallBack.call(me, innerSuccessFun, result);
            __dispatcherCallBack.call(me, _success, result);
        }
        var _failure = config.failure;
        config.failure = function () {
            __dispatcherFailure.call(me, _failure, arguments);
        }
        me.fireEvent("beforeloaddata", me); //加载数据前事件
        $G.dispatcher(config);
    };

    dataSource.AP_SortDataOnHeaderClick = function (item, columnIndex, e) {
        var qp = item.apf_queryPlan;
        if (Ext.isEmpty(qp)) return false;
        var colName = item.colModel.columns[columnIndex].dataIndex;
        if (Ext.isEmpty(colName)) return false;
        //处理自定义字段，自定义字段不全局排序
        var ds = dataSource;
        if (ds) {
            var f = ds.getField(colName);
            if (f && f.isCustomField) {
                return false;
            }
        }
        var isDesc = true;
        if (qp.orders)
            qp.orders.clear();
        if (item.xtype == "gtpgridpanel") {
            if (item.sortInfo.field == colName) {
                if (item.sortInfo.direction == "ASC") {
                    isDesc = false;
                }
            }
        } else if (item.xtype == "gtptreegridpanel") {
            var sort = item.getView().sortState;
            if (sort.field == colName) {
                if (sort.direction == "ASC") {
                    isDesc = false;
                }
            }
        }
        qp.addOrder({
            name: "order_" + colName,
            field: colName,
            isDesc: isDesc
        });
        return true;
    };

    dataSource.AP_refreshNodeData = function (gridOrTree, succFunc) {
        //刷新当前节点..部分更新
        var me = this;
        if (!gridOrTree) return;
        var rec = me.getDataRecord();
        if (rec) {
            me.AP_loadDataById(rec.id,
                {
                    notLoadToDataSource: true,
                    action: "GetEntitiesByPid", //平台提供..
                    args: [me.type, "ID", rec.id],
                    success: function (result) {
                        if (Ext.isArray(result) && result.length > 0) {
                            var node = gridOrTree.store.getById(rec.id);
                            if (node) {
                                Ext.apply(node.data, result[0]);
                                gridOrTree.getView().refreshRow(node);
                            }
                            __dispatcherCallBack.call(me, succFunc, result);
                        }
                    }
                });
        }
    };

    dataSource.AP_saveChanges = function (config) {
        var me = this;
        if (me.fireEvent("beforesave", me)) {
            var changeSummary;
            if (config && config.changeSummary)  //&& config.changeSummary instanceof 
            {
                changeSummary = config.changeSummary;
                delete config.changeSummary;
            } else
                changeSummary = me.getChangeSummary();

            var defaultaction = "SaveChanges";

            if (changeSummary && changeSummary.length > 0) {
                //有时ds可能是Query，需要转为该Query对应的主实体类型
                if (config && config.dataSourceType) {
                    for (var i = 0; i < changeSummary.length; i++) {
                        if (Ext.isArray(changeSummary[i])) {
                            for (var j = 0; j < changeSummary[i].length; j++) {
                                if (changeSummary[i][j] && changeSummary[i][j].__type) changeSummary[i][j].__type = config.dataSourceType;
                            }
                        }
                        else {
                            if (changeSummary[i] && changeSummary[i].__type) changeSummary[i].__type = config.dataSourceType;
                        }
                    }
                }
                if (Ext.isArray(changeSummary[0])) defaultaction = "SaveChangeList";
            }
            //SaveChangeList是AppFrame提供的方法,SaveChangesList是平台提供的方法
            var default_config = me.AP_getDefaultConfig(false, defaultaction, changeSummary);
            default_config.async = false; //默认为非异步
            config = Ext.applyIf(config || {}, default_config);

            var _success = config.success;
            config.success = function (result) {
                me.commitChanges(true);
                __dispatcherCallBack.call(me, _success, result);
                me.fireEvent("aftersave", me, result);
            }
            var _failure = config.failure;
            config.failure = function () {
                __dispatcherFailure.call(me, _failure, arguments);
                me.fireEvent("savefailure", me, -1);
            }
            if (changeSummary && changeSummary[0]) {
                $G.dispatcher(config);
            } else {
                __dispatcherCallBack.call(me, config.success, 0);
            }
        }
    };

    dataSource.AP_saveChangeList = function (dataSourceType, config) {
        //由于SaveChangeList一般是对Query数据源进行操作，因此需要该Query对应的主实体全名称
        var me = this;
        if (!dataSourceType) {
            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "dataSourceType"));
            return;
        }
        return me.AP_saveChanges(Ext.applyIf(config || {}, { changeSummary: [me.getChangeSummary()], dataSourceType: dataSourceType }));
    };


    dataSource.AP_saveChangeReturnEntity = function (pvName, config) {
        //保存数据并返回实体，需要根据视图返回
        var me = this;
        if (!pvName) pvName = ""; //为空就Findbykey
        var default_config = me.AP_getDefaultConfig(true, "SaveChangeReturnEntity");
        config = Ext.applyIf(config || {}, default_config);
        if (Ext.isEmpty(config.args)) {
            var cs;
            if (config.changeSummary) cs = config.changeSummary;
            else cs = me.getChangeSummary();
            config.changeSummary = [cs, pvName];
            config.args = config.changeSummary;
        }
        if (config.action == "SaveChangeReturnEntity" && !Ext.isEmpty(config.queryLobFields)) {
            config.action = "SaveChangeReturnEntityWithBlob";
            config.args.push(config.queryLobFields);

        }
        return me.AP_saveChanges(config);

    }

    //删除数据
    dataSource.AP_delete = function (records, config) {
        var me = this;
        if (!records) {
            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
        }
        if (records.length > 0) {
            if (me.fireEvent("beforedelete", records)) {
                var msg = String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AppFrame_Delete);
                if (config.msg) { msg = config.msg }
                Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, msg, function (e) {
                    if (e == "yes") {
                        var idlist = new Array();
                        for (var i = 0; i < records.length; i++) {
                            idlist.push(records[i].id);
                        }
                        config = config || {};
                        if (Ext.isEmpty(config.action) && config.isTreeBill) {
                            config.action = "DeleteTreeBillByKeys";
                        }
                        var default_config = me.AP_getDefaultConfig(false, "DeleteEntityByKeys", [idlist, me.type]);
                        config = Ext.applyIf(config, default_config);

                        var _success = config.success;
                        config.success = function (result) {
                            __dispatcherCallBack.call(me, _success, result);
                            me.fireEvent("afterdelete", me, result);
                        }
                        var _failure = config.failure;
                        config.failure = function (cause, statusCode, msg, detailMsg, data) {
                            __dispatcherFailure.call(me, _failure, arguments);
                            if (arguments[4][0].Type == "GTPBatchException") {
                                Gtp.net.MessageBox.exception(GTP.AppFrameV2.Res.Hint, data || [{ Msg: msg, DetailMsg: detailMsg}], "ext-mb-info");
                                return false;
                            }
                        }
                        $G.dispatcher(config);
                    }
                });
            }
        } else {
            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
        }

    };

    dataSource.AP_setFieldValue = function (field, value) {
        Gtp.util.DataSource.setFieldValue(this, field, value);
    };

    return dataSource;
};
//***EntityView扩展***
Ext.AppFrame.Extend.Ap_EntityView_Init = function (entityViewId) {
    // entityView扩展
    var entityView = $G.getCmp(entityViewId);
    if (entityView) {
        entityView.addEvents("valid");              //触发是否有效事件
        entityView.AP_isValid = function () {
            //判断是否有效
            var me = this;
            var form = me.getForm();
            if (!form.isValid()) {
                var errMsg = "", focuedfield;
                form.items.each(function (f) {
                    if (f.hidden != true) {
                        if (Ext.isEmpty(errMsg)) {
                            errMsg = f.activeError;
                            focuedfield = f;
                            //暂时不替换提示信息
                            //    var err = f.getErrors();
                            //    if (Ext.isArray(err) && err.length > 0) {
                            //        errMsg = "[" + f.fieldLabel + "] " + err[0];
                            //        errMsg = errMsg.replace("<font color=red>*</font>&nbsp;", "");
                            //        errMsg = errMsg.replace("该输入项为必输项", GTP.AppFrameV2.Res.NoValid);
                            //    }
                        }
                    }
                });
                if (!Ext.isEmpty(errMsg)) {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, errMsg, function () { if (!!focuedfield) { focuedfield.focus(); } });
                    return false
                }
                else return true;
            } else return this.fireEvent("valid", this);
        }

        //设置所有控件为只读或解除
        entityView.AP_setAllControlReadOnly = function (isSetReadOnly) {
            var me = this;
            var form = me.getForm();
            if (isSetReadOnly) {
                form.items.each(function (f) {
                    if (f.readOnly == false) {
                        f.setReadOnly(true);
                    }
                });
            } else {
                form.items.each(function (f) {
                    if (f.readOnly == true) {
                        f.setReadOnly(false);
                    }
                });
            }
        }

    }
};
//***GridView扩展***
Ext.AppFrame.Extend.AP_GridView_Init = function (gridViewId) {

    var gridView = $G.getCmp(gridViewId);
    gridView.addEvents("beforecu"); //crud
    if (!gridView || !gridView.dataSource) return;
    var ds = $G.DataContext.getDataSource(gridView.dataSource);
    if (!ds) return;

    // gridView绑定的dataSource，作为gridView的扩展变量
    gridView.apf_ds = ds;

    gridView.AP_getPagingToolbar = function () {
        var me = this;
        var toolbar = undefined;
        if (me.apf_ds.dataLinks) {
            me.apf_ds.dataLinks.each(function (item) {
                if (item.ctrl instanceof Ext.PagingToolbar) {
                    toolbar = item.ctrl;
                }
            });
        }
        return toolbar;
    };

    gridView.AP_setQueryPlan = function (queryPlan) {
        //设置gridView的queryPlan
        var me = this;
        if (queryPlan) {
            // gridView绑定的dataSource对应的queryPlan，作为gridView的扩展变量
            me.apf_queryPlan = queryPlan;
            var toolbar = me.AP_getPagingToolbar();
            if (toolbar) toolbar.setPageSize(queryPlan.pageSize);
        }
    };

    gridView.AP_setQueryPlanName = function (queryPlanName) {
        var me = this;
        var qp = $G.QueryPlans.getQueryPlan(queryPlanName);
        me.AP_setQueryPlan(qp);
    };

    // 遍历$G.QueryPlans，找到对应queryPlan，并调用AP_setQueryPlanName设置
    if ($G.QueryPlans && $G.QueryPlans.items) {
        for (var i = 0; i < $G.QueryPlans.items.items.length; i++) {
            if ($G.QueryPlans.items.items[i].dataSource == gridView.dataSource) {
                gridView.AP_setQueryPlanName($G.QueryPlans.items.items[i].name);
                break;
            }
        }
    }


    gridView.AP_selectRows = function () {
        return gridView.getSelectionModel().getSelections()
    };

    gridView.AP_loadData = function (config) {
        if (this.fireEvent("beforeap_loaddata", this) == false) return;
        var me = this;
        var default_config = me.apf_ds.AP_getDefaultConfig(true);
        default_config.action = "QueryByCriteria";
        if (me.getXType() == "multigroupingpanel") default_config.action = "CrossQueryByCriteria";
        config = Ext.applyIf(config || {}, default_config);

        var queryBoxParam;
        //预留扩展函数 AP_getQueryArgs 设置 config.args
        if (me.AP_getQueryArgs && Ext.isFunction(me.AP_getQueryArgs))
            config.args = me.AP_getQueryArgs(config);
        else {
            var queryPlanParam = {};
            if (me.apf_queryPlan) {
                if (config.pageIndex) {
                    me.apf_queryPlan.currentPage = config.pageIndex;
                }
                if (config.pageSize) {
                    me.apf_queryPlan.pageSize = config.pageSize;
                }
                queryPlanParam = me.apf_queryPlan.getQueryParam();

                //如果有查询方案..
                if (me.apf_queryBox) {
                    if (config.firstLoad) {
                        queryBoxParam = Ext.ux.query.getDefaultScheme(me.apf_ds.type, 'grid');
                        if (!Ext.isEmpty(queryBoxParam)) {
                            if (queryBoxParam.size > 0 && (me.apf_queryPlan.pageSize != queryBoxParam.size)) {
                                me.apf_queryPlan.pageSize = queryBoxParam.size;
                                queryPlanParam.size = queryBoxParam.size;
                                config.pageSize = queryBoxParam.size;
                            }
                        }
                        //缓存查询方案参数
                        $G.Page.__sessionQueryBoxParam = queryBoxParam;
                        delete config.firstLoad;
                    } else {
                        if (config.noCacheParam) {
                            queryBoxParam = me.apf_queryBox.getQueryParam();
                            $G.Page.__sessionQueryBoxParam = queryBoxParam;
                        }
                        else {
                            queryBoxParam = $G.Page.__sessionQueryBoxParam;
                        }
                    }
                    //开始合并查询方案..
                    queryPlanParam = Ext.AppFrame.Util.mergeQueryPlanParam(queryPlanParam, queryBoxParam);
                }
                (config.needCount && config.needCount == false) ? queryPlanParam.needCount = false : queryPlanParam.needCount = true;
                //合计面板
                queryPlanParam.allowAggregate = true;

                //分组..
                if (me.getXType() == "multigroupingpanel") queryPlanParam = me.AP_processParamForAction(queryPlanParam);
                if (config.AP_getGroupByParams) queryPlanParam = config.AP_getGroupByParams(queryPlanParam);
            }
            if (config.queryPlanParamProperties) queryPlanParam.Properties = config.queryPlanParamProperties;
            config.args = [queryPlanParam];
        }

        var selectedRow = me.getSelectionModel().getSelected();
        if (selectedRow && selectedRow.data && selectedRow.data.ID > 0) {
            me.selectedIndex = me.getStore().indexOf(selectedRow);
            me.selectedId = selectedRow.data.ID;
        }

        if (!me.apf_ds.__isFirstLoad) {
            me.apf_ds.__isFirstLoad = true;
            me.apf_ds.on("load", function (data, result, append) {
                //焦点定位到原焦点行
                var bNeedFocued = true;
                if (me.getXType() == "multigroupingpanel") {
                    bNeedFocued = !me.getView().getGroupField();
                }

                if (bNeedFocued && me.rendered) {
                    var model = me.getSelectionModel();
                    model.clearSelections(); //先清空选中
                    if (me.selectedId && me.selectedId > 0) {
                        var entities;
                        if (Ext.isArray(result)) entities = result;
                        else entities = result.Entities;
                        if (entities) {
                            if (entities.length > 0) {
                                var iselectId = me.getStore().indexOfId(me.selectedId); //有可能过滤之后找不到当前记录了
                                if (iselectId != -1) {
                                    model.selectRow(iselectId);
                                } else {
                                    model.selectFirstRow(); //默认选中第一条记录
                                }
                            }
                        }
                        delete me.selectedId;
                    }
                    else {
                        if (config.notSelectFirstRow != true) {
                            model.selectFirstRow(); //默认选中第一条记录
                        }
                    }

                    var selectedRow = me.getSelectionModel().getSelected();
                    if (selectedRow) {
                        me.fireEvent("rowclick", me, me.getStore().indexOf(selectedRow));
                    }
                }

                //焦点定位到原焦点行

                if (me.apf_queryBox && $G.Page.__sessionQueryBoxParam && $G.Page.__sessionQueryBoxParam.GridStyleText)
                    Ext.ux.query.configGrid($G.Page.__sessionQueryBoxParam);
            });
        }

        //加载数据
        config.controlId = me.id;
        if (!!config && !!config.args && Ext.isArray(config.args)) {
            for (var i = 0; i < config.args.length; i++) {
                var obj = config.args[i];
                if (!!obj.queryEntity && !!obj.orders && !!obj.filters && obj.size != undefined && Ext.isNumber(obj.size) && obj.index != undefined && Ext.isNumber(obj.index)) {
                    me.__currentQueryPlan = config.args[i];
                    break;
                }
            }
            if (i == config.args.length) {
                delete me.__currentQueryPlan;
            }
        }
        me.apf_ds.AP_loadData(config);
    };



    gridView.AP_deleteRecords = function (records, config) {
        var me = this;
        var default_config = me.apf_ds.AP_getDefaultConfig(false);
        default_config.success = function (result) {
            //var config = {};
            //if (records.length == me.apf_ds.getDataStore().data.length) config.resetpage = true;
            //me.AP_loadData(config); //如果全选就定位到第一页

            //2013-12-16 删除时，页面呈现规则不起作用，钢子提供方法
            //            for (var i = 0; i < records.length; i++) {
            //                me.apf_ds.getDataStore().remove(records[i]);
            //            }
            me.apf_ds.removeRecord(records);

            me.apf_ds.commitChanges();
            me.getSelectionModel().selectFirstRow();
            me.fireEvent("rowclick", me);
        }

        default_config.failure = function () {
            if (arguments[4][0].Type == "GTPBatchException") {
                var errMessage = arguments[2];
                var exp = /成功\d{1}/;
                var successMessage = errMessage.match(exp);
                if (successMessage && successMessage.length > 0) {
                    var successCount = successMessage[0].match(/\d+$/);
                    if (successCount && successCount.length > 0) {
                        if (records.length > Number(successCount[0])) {
                            me.AP_loadData();
                        }
                    }
                }
            }
            else {
                if (records.length > 1) me.AP_loadData();
            }
        }

        if (config && config.success) {
            var _succ = config.success;
            config.success = new Array();
            config.success.push(default_config.success);
            if (Ext.isArray(_succ)) {
                for (var i = 0; i < _succ.length; i++) config.success.push(_succ[i]);
            }
            else config.success.push(_succ);
        }
        config = Ext.applyIf(config || {}, default_config);
        me.apf_ds.AP_delete(records, config);
    };
    //***处理附件列表，带上图标***
    if (gridView.ape_AttachGrid == "true") {
        var cm = gridView.getColumnModel();
        var col = cm.getColumnById("col_DisplayName");
        if (col) {
            //2013-12-20 update TP-20116，钢子提供，解决：采用规则设置列表页行数据背景效果锁定列失效
            //            col.renderer = function (value, metadata, record, rowIndex, colIndex, store) {
            //                if (value) {
            //                    var img = Ext.AppFrame.Attachment.GetIcoFileByFileExt(value);
            //                    var imgUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/Common/Images/file/" + img;
            //                    return "<a href='#' onclick='_this.Ap_Attach_OpenFile(\"" + gridView.dataSource + "\")'><img src='" + imgUrl + "'></img> " + value + "</a>";
            //                }
            //            };
            col.addRenderer(col.id + "_renderer", function (value, metadata, record, rowIndex, colIndex, store) {
                if (value) {
                    var img = Ext.AppFrame.Attachment.GetIcoFileByFileExt(value);
                    var imgUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/Common/Images/file/" + img;
                    return "<a href='#' onclick='_this.Ap_Attach_OpenFile(\"" + gridView.dataSource + "\")'><img src='" + imgUrl + "'></img> " + value + "</a>";
                }
            }, this);
        }
    };

    //***处理分页单据细表***
    if (gridView.ape_PagerDetailGrid == "true") {
        Ext.AppFrame.Extend.Ap_DataSource_Init(gridView.dataSource);
        var toolbar = gridView.AP_getPagingToolbar();
        if (toolbar) {
            gridView.AP_getQueryArgs = function (config) {
                var ret = gridView.apf_ds.AP_getDefaultQueryPlanParam();
                ret[0].queryEntity = gridView.apf_ds.type;
                if (config.pageIndex)
                    ret[0].index = parseInt(config.pageIndex) - 1;
                if (config.pageSize)
                    ret[0].size = parseInt(config.pageSize);
                else
                    ret[0].size = 10;

                gridView.apf_pageIndex = ret[0].index;
                gridView.apf_pageSize = ret[0].size;

                var filters = [];
                var ds = $G.DataContext.getDataSource("Bill");
                var rec = ds.getDataRecord();
                var id = -1;
                if (rec) id = rec.id;
                var list = ds.type.split('.');
                var fn = Ext.AppFrame.Common.addFilter;

                filters.push(fn("BraceStart", null, "eq", "And", null));
                filters.push(fn("Filter", list[list.length - 1], "eq", id));
                if (gridView.AP_setPagerDetailFilter && Ext.isFunction(gridView.AP_setPagerDetailFilter)) {
                    var filterlist = gridView.AP_setPagerDetailFilter(); //扩展..
                    for (var i = 0; i < filterlist.length; i++) filters.push(filterlist[i]);
                }
                filters.push(fn("BraceEnd", null, "eq", "", null));

                ret[0].filters = filters;
                return ret;
            };

            //加载细表..
            gridView.AP_loadPagerDetailData = function (index, size) {
                var me = this;
                var config = {
                    notLoadToDataSource: true,
                    success: function (result) {
                        me.store.loadData(result.Entities);
                        var toolbar = me.AP_getPagingToolbar();
                        toolbar.store.totalLength = result.TotalCount;
                        toolbar.updateInfo();
                        toolbar.reset(me.apf_pageIndex, me.apf_pageSize, result.TotalCount);
                    }
                };
                if (Ext.isEmpty(index)) resetpage = true;
                else {
                    config.pageIndex = index;
                    config.pageSize = size;
                }
                me.AP_loadData(config);
                me.apf_isDetailPaging = false;
            }
            //处理点击分页事件
            var doLoad = toolbar.doLoad;
            toolbar.doLoad = function (start) {
                var execLoad = function () {
                    gridView.apf_isDetailPaging = true;
                    doLoad.call(toolbar, start);
                }
                var cs = gridView.apf_ds.getChangeSummary();
                if (cs) {
                    Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.DataChanged, function (e) {
                        if (e == "yes") {
                            if (_this.actSave_Handler({ keepStateAfterSave: true, isDetailPaging: true })) execLoad();
                        } else execLoad();
                    });
                } else execLoad();
            };

        } else gridView.ape_PagerDetailGrid = "false";
    }

};
Ext.AppFrame.Extend.AP_GroupingGridView_Init = function (gridViewId) {
    //执行当前Init之前，需要先执行AP_GridView_Init
    var grid = $G.getCmp(gridViewId);

    grid.AP_processParamForAction = function (param) {
        param.groupBy = param.groupBy || {};
        param.groupBy.values = [];
        param.groupBy.level = param.groupBy.level || 1;
        param.groupBy.pagingmode = 'root';

        var dataSource = grid.apf_ds, groupField = grid.getView().getGroupField(), orders, fields;
        if (!dataSource.apf_initgroup) { // 第一次执行action，以queryPlan参数为准
            dataSource.apf_initgroup = true;
            orders = param.orders = param.orders || [],
                fields = param.groupBy.fields = param.groupBy.fields || [];

            grid.clearUndo();
            grid._groupField = groupField ? groupField.slice(0) : groupField; // 用于请求数据失败后的回滚
            grid._groupDirMap = Ext.apply({}, dataSource.groupDirMap);
            dataSource._sortInfo = dataSource.sortInfo;
            dataSource._multiSortInfo = dataSource.multiSortInfo;
            dataSource._hasMultiSort = dataSource.hasMultiSort;
            dataSource._filters = dataSource.filters;

            //绑定GroupingDataSource的groupField,groupDirMap
            dataSource.groupField = false;
            dataSource.groupDirMap = {};
            if (fields.length > 0) {
                dataSource.groupField = fields.slice(0);
                for (var i = 0; i < fields.length; i++) {
                    for (var j = 0; j < orders.length; j++) {
                        if (orders[j].propertyName == fields[i]) {
                            dataSource.groupDirMap[fields[i]] = orders[j].isDesc ? "DESC" : "ASC";
                            break;
                        }
                    }
                }
            }

            //绑定GroupingDataSource的multiSortInfo
            dataSource.hasMultiSort = true;
            dataSource.multiSortInfo = { sorters: [] };
            dataSource.sortInfo = null;
            if (orders.length > 0) {
                for (var i = 0; i < orders.length; i++) {
                    for (var j = 0; j < fields.length; j++) {
                        if (orders[i].propertyName == fields[j]) break;
                    }
                    if (j == fields.length) {
                        dataSource.multiSortInfo.sorters.push({
                            field: orders[i].propertyName,
                            direction: orders[i].isDesc ? "DESC" : "ASC"
                        });
                    }
                }
            }

            // 只发送需要的orders到后台，其余的orders用于本地排序
            if (!dataSource.enableMultiPaging && fields.length > 0) {
                orders.length = 0;
                if (dataSource.groupDirMap[fields[0]]) {
                    param.orders.push({ "propertyName": fields[0], "isDesc": dataSource.groupDirMap[fields[0]] == "DESC" });
                }
            }

            // 为日期类型的分组字段附加上分组精度信息如"DateTime1|Year"
            var dataBaseFun;
            for (var i = 0, len = fields.length; i < len; i++) {
                if (grid.store.fields.get(fields[i]).type.type == "date") {
                    dataBaseFun = grid.colModel.config[grid.colModel.findColumnIndex(fields[i])].dataBaseFun;
                    if (dataBaseFun) {
                        fields[i] += "|" + dataBaseFun;
                    }
                }
            }
        } else { // 从grid获取最新的orders
            orders = param.orders = [];
            fields = param.groupBy.fields = grid.view.getGroupField() ? grid.view.getGroupField().slice(0) : [];
            if (!fields.length) { // 无分组
                if (dataSource.hasMultiSort) {
                    for (var i = 0, len = dataSource.multiSortInfo.sorters.length; i < len; i++) {
                        var sorter = dataSource.multiSortInfo.sorters[i];
                        orders.push({ "propertyName": sorter.field, "isDesc": sorter.direction == "DESC" });
                    }
                } else {
                    if (dataSource.sortInfo) {
                        orders.push({ "propertyName": dataSource.sortInfo.field, "isDesc": dataSource.sortInfo.direction == "DESC" });
                    }
                }
            } else {
                if (!dataSource.enableMultiPaging) { // 有分组且仅支持根级数据分页
                    if (dataSource.groupDirMap[fields[0]]) {
                        orders.push({ "propertyName": fields[0], "isDesc": dataSource.groupDirMap[fields[0]] == "DESC" });
                    }
                } else { // 支持多级分组分页(orders中分组字段比排序字段优先级高)
                    var ordersMap = {};
                    if (dataSource.hasMultiSort) {
                        for (var i = 0, len = dataSource.multiSortInfo.sorters.length; i < len; i++) {
                            ordersMap[dataSource.multiSortInfo.sorters[i].field] = dataSource.multiSortInfo.sorters[i].direction;
                        }
                    } else {
                        if (dataSource.sortInfo) {
                            ordersMap[dataSource.sortInfo.field] = dataSource.sortInfo.direction;
                        }
                    }
                    for (var propertyName in dataSource.groupDirMap) {
                        ordersMap[propertyName] = dataSource.groupDirMap[propertyName];
                    }

                    for (var propertyName in ordersMap) {
                        orders.push({ "propertyName": propertyName, "isDesc": ordersMap[propertyName] == "DESC" });
                    }
                }

                // 为日期类型的分组字段附加上分组精度信息如"DateTime1|Year"
                var dataBaseFun;
                for (var i = 0, len = fields.length; i < len; i++) {
                    if (grid.store.fields.get(fields[i]).type.type == "date") {
                        dataBaseFun = grid.colModel.config[grid.colModel.findColumnIndex(fields[i])].dataBaseFun;
                        if (dataBaseFun) {
                            fields[i] += "|" + dataBaseFun;
                        }
                    }
                }
            }
        }
        if (dataSource.groupAggregateInfo) { // 请求分组聚合
            var groupAggInfo = [], groupAggregateItem;
            for (var i = 0, len = dataSource.groupAggregateInfo.length; i < len; i++) {
                groupAggregateItem = dataSource.groupAggregateInfo[i];
                groupAggInfo.push({
                    propertyName: groupAggregateItem.propertyName,
                    aggregator: groupAggregateItem.aggregator,
                    name: groupAggregateItem.name
                });
            }
            param.groupBy.groupAggInfo = groupAggInfo;
        }
        //绑定GroupingDataSource的filter
        dataSource.filters = param.filters;
        return param;
    };

    grid.on("loaddata", function (grid, append, values, pagingmode, id, level, index, size) {
        var config = {};
        if (grid.AP_getLoadConfig) config = grid.AP_getLoadConfig;
        config.AP_getGroupByParams = function (queryParam) {
            queryParam.groupBy.values = values || queryParam.groupBy.values;
            queryParam.groupBy.level = level || queryParam.groupBy.level;
            queryParam.groupBy.pagingmode = pagingmode || queryParam.groupBy.pagingmode;
            return queryParam;
        }
        config.parentId = id || -1;
        config.append = append;
        grid.AP_loadData(config);
    }, this);

};


//***TreeGirdView扩展--树展开事件暂时解决方案***
if (Ext.ux.grid.LockingGridSummary && Ext.ux.grid.LockingGridSummary.prototype.disableRefreshSummary !== false) {
    var _old_refreshSummary = Ext.ux.grid.LockingGridSummary.prototype.refreshSummary;
    Ext.ux.grid.LockingGridSummary.override({
        disableRefreshSummary: false,
        refreshSummary: function () {
            if (!this.disableRefreshSummary) {
                _old_refreshSummary.call(this);
            }
        }
    });
};


//***TreeGirdView扩展***
Ext.AppFrame.Extend.Ap_TreeGrid_Init = function (treeGrid) {
    var tree = treeGrid;
    if (Ext.isString(treeGrid)) tree = $G.getCmp(treeGrid);
    if (tree && tree.dataSource) {
        //禁止菜单，禁止排序
        var model = tree.getColumnModel();
        for (var i = 0; i < model.columns.length; i++) {
            model.columns[i].menuDisabled = true;
            //   model.columns[i].sortable = false;
        }

        //属性扩展
        if (Ext.isEmpty(tree.queryLevel)) {
            tree.queryLevel = 2; //默认为懒加载方式..
        }
        tree.store.on("load", function () {
            tree.expandLevel(1);
        });

        var ds = $G.DataContext.getDataSource(tree.dataSource);

        if (!ds) return;
        tree.apf_ds = ds;
        tree.AP_selectRows = function () {
            if (this.selectMode == "row") {
                return this.getSelectionModel().getSelections();
            }
            else if (this.selectMode == "checkbox") {
                return tree.getSelectionModel().getCheckedRecords();
            }
        }
        tree.havePagetoolbar = false;
        tree.AP_setQueryPlanName = function (queryPlanName) {
            var me = this;
            var qp = $G.QueryPlans.getQueryPlan(queryPlanName);
            if (qp) {
                me.apf_queryPlan = qp;
                //处理分页工具栏..
                if (me.apf_ds.dataLinks)
                    me.apf_ds.dataLinks.each(function (dataLink) {
                        if (dataLink.ctrl instanceof Ext.PagingToolbar) {
                            me.havePagetoolbar = true;
                            dataLink.ctrl.setPageSize(qp.pageSize);
                        }
                    });
            }
        }

        if ($G.QueryPlans && $G.QueryPlans.items) {
            for (var i = 0; i < $G.QueryPlans.items.items.length; i++) {
                if ($G.QueryPlans.items.items[i].dataSource == tree.dataSource) {
                    tree.AP_setQueryPlanName($G.QueryPlans.items.items[i].name);
                    break;
                }
            }
        }

        //方法扩展
        //所有子节点 
        tree.AP_getChildList = function (id, isAllChild, callback) {
            var me = this;
            var pIdPropertyName = me.parentKeyField;
            if (Ext.isEmpty(pIdPropertyName)) pIdPropertyName = "PID";
            var args = [id, pIdPropertyName, isAllChild, this._innerGetQueryParam({})];
            var config = {
                controller: $G.getPageController(),
                async: false,
                action: "QueryChildNodesByPid",
                args: args,
                success: function (result) {
                    if (Ext.isFunction(callback)) {
                        callback.call(this, result);
                    }
                },
                failure: function () {
                    return true;
                }
            };

            $G.dispatcher(config);
        };
        //树的Filter,可重写..
        tree.AP_getTreeFilter = function (data) {
            //有些过滤需要当前记录构造filter，参数data为当前记录
            var Filters = new Array();
            return Filters;
        };
        tree.on("rowclick", function (item, rowindex, e) {
            //执行这个主要是为了触发规则..
            var me = this;
            var records = item.getSelectionModel().getSelections();
            if (records.length > 0) {
                var rec = records[0];
                if (me.keyField.toUpperCase() != "ID") {
                    //如果不是ID作为主键的话，就传入ID数值.
                    item.apf_ds.setCurrentIndex(me.apf_ds.getDataStore().indexOfId(records[0].data.ID));
                } else
                    item.apf_ds.setCurrentIndex(rec);
                if (_this._activeAllRule) _this._activeAllRule(item.apf_ds);
            }
        });
        tree.on("beforerender", function (item) { this.deferRowRender = false; });
        //展开
        tree.on("beforeexpand", function (treegrid, record) {
            if (treegrid.queryLevel != 0) {
                treegrid.AP_getChildList(record.id, false, function (result) { //没有必要子节点
                    var childrens = result.Entities;
                    var pNode = treegrid.store.getById(record.id);
                    var index = treegrid.store.indexOf(pNode);
                    treegrid.view.syncHeights = false; //!!!
                    if (treegrid.summaryRow)
                        treegrid.summaryRow.disableRefreshSummary = true; //!!!

                    //04-01 ghy update 子节点排序
                    var store = treegrid.store;
                    var sortState = store.getSortState();
                    var sortField = sortState ? sortState.field : store.order_field_name;
                    for (var i = 0, len = childrens.length; i < len; i++) {
                        for (var j = 0, len = childrens.length; j < len; j++) {
                            if (store.sortToggle[sortField] == "DESC") {
                                if (childrens[i][sortField] > childrens[j][sortField]) {
                                    var temp = childrens[i];
                                    childrens[i] = childrens[j];
                                    childrens[j] = temp;
                                }
                            }
                            else {
                                if (childrens[i][sortField] < childrens[j][sortField]) {
                                    var temp = childrens[i];
                                    childrens[i] = childrens[j];
                                    childrens[j] = temp;
                                }
                            }
                        }
                    }
                    //End 处理子节点排序 

                    for (var i = 0; i < childrens.length; i++) {
                        if (childrens[i].ID != pNode.id) {
                            if (treegrid.store.indexOfId(childrens[i].ID) < 0) {
                                treegrid.appendRowChild(pNode, childrens[i]);
                            }
                        }
                    }

                    if (treegrid.summaryRow) {
                        treegrid.summaryRow.disableRefreshSummary = false; //!!!
                        treegrid.summaryRow.refreshSummary(); //!!!
                    }
                    treegrid.view.syncHeights = true; //!!!

                    //定位到原来的节点上
                    var model = treegrid.getSelectionModel();
                    model.clearSelections();
                    model.selectRow(index);
                    treegrid.fireEvent("rowclick", treegrid, index);
                }
               );
            }
        }, this);

        if (tree.ape_BillDetailTree == "true") { //如果是树形细表就客户端自行处理
            tree.queryLevel = 0; //全部加载，否则展开会有问题
            //在CheckBox的情况下会有问题
            //            tree.on("validateedit", function (e) {
            //                var ds = tree.apf_ds, fieldName = e.field;
            //                var id = e.record.data.ID;
            //                if (id > 0) { //更新数据源
            //                    ds.setCurrentIndex(ds.indexOf(id));
            //                    var rec = ds.getDataRecord();
            //                    rec.set(fieldName, e.value);
            //                    tree.view.refresh()
            //                }
            //            });
            tree.on("afterrender", function (e) {
                if (tree.ape_renderedLoadData) {
                    tree.ape_renderedLoadData = false;
                    tree.AP_loadBillDetailData();
                }
            }, tree);

        }
        else if (tree.ape_NotAutoFireMoveRow != "true" && tree.initialConfig["autoProcessDetail"] != "true")//不需要自动触发
        {
            tree.moverowcallback = function (treegrid, row) {
                if (treegrid && row) {
                    var store = treegrid.getStore();
                    var selectNode = store.getById(row[treegrid.keyField])
                    if (treegrid.toPosition == "downgrade") {
                        //得到节点的prevSibling
                        var prevNode = store.getNodePrevSibling(selectNode);
                        if (!store.isExpandedNode(prevNode)) {
                            if (!store.isLoadedNode(prevNode)) {
                                treegrid.fireEvent("beforeexpand", treegrid, prevNode);
                            }
                            store.expandNode(prevNode);
                        }
                    }
                }
            };

            tree.on("beforemoverow", function (treegrid, row) {
                var moveps = treegrid.toPosition;
                var dataSource = $G.DataContext.getDataSource(treegrid.dataSource);
                var ret = true;
                var args = [dataSource.type, treegrid.config.id, treegrid.config.pid, treegrid.config.dropId, treegrid.AP_getTreeFilter(row)];

                $G.dispatcher({
                    async: false,
                    controller: Gtp.net.Global.getPageController(),
                    action: "MoveNodeByFilter",
                    args: args,
                    success: function (result) {
                        if (moveps != "moveup" && moveps != "movedown") {
                            treegrid.AP_getChildList(treegrid.config.id, true, function (result) {
                                var childrens = result.Entities;
                                var pNode = treegrid.store.getById(treegrid.config.pid);
                                for (var i = 0; i < childrens.length; i++) {
                                    if (pNode) {
                                        if (childrens[i].ID != pNode.id) {
                                            if (treegrid.store.indexOfId(childrens[i].ID) < 0) {
                                                treegrid.appendRowChild(pNode, childrens[i]);
                                            }
                                        }
                                    }

                                    var child = treegrid.store.getById(childrens[i][treegrid.keyField]);
                                    //2013-11-29 移动后，更新除系统字典外所有字段
                                    //if (child) child.data[treegrid.fullCodeField] = childrens[i][treegrid.fullCodeField];
                                    if (child) {
                                        child.fields.eachKey(function (key) {
                                            var array = ['ID', 'PID', 'Level', 'IsLeaf', 'OrderNo'];
                                            if (!array.include(key)) {
                                                child.data[key] = childrens[i][key];
                                            }
                                        })
                                    }
                                }
                                //treegrid.fireEvent("rowclick", treegrid, index);
                            });
                        }
                        if (treegrid.moverowcallback && Ext.isFunction(treegrid.moverowcallback)) {
                            treegrid.moverowcallback.call(this, treegrid, row);
                        }
                    },
                    failure: function (cause, statusCode, msg) {
                        ret = false;
                        Gtp.net.GtpDispatcher.prototype.onFailure.apply(this, arguments);
                        if (treegrid.config.failure && Ext.isFunction(treegrid.config.failure)) {
                            treegrid.config.failure.call(this, arguments);
                        }
                        return true;
                    }
                });
                return ret;
            }, this);
        }


        tree._innerGetQueryParam = function (config) {
            var me = this;
            var queryPlanParam = {};
            if (me.apf_queryPlan) {
                if (this.havePagetoolbar != true) me.apf_queryPlan.pageSize = 10000; //没有分页工具栏就加载10000条数据
                if (config.pageIndex) me.apf_queryPlan.currentPage = config.pageIndex;
                if (config.pageSize) me.apf_queryPlan.pageSize = config.pageSize;
                queryPlanParam = me.apf_queryPlan.getQueryParam();

                if (me.apf_queryBox) { //如果有查询方案框
                    var queryBoxParam;
                    if (config.firstLoad) {
                        queryBoxParam = Ext.ux.query.getDefaultScheme(me.apf_ds.type, 'grid');
                        if (!Ext.isEmpty(queryBoxParam)) {
                            if (queryBoxParam.size > 0 && (me.apf_queryPlan.pageSize != queryBoxParam.size)) {
                                me.apf_queryPlan.pageSize = queryBoxParam.size;
                                queryPlanParam.size = queryBoxParam.size;
                                config.pageSize = queryBoxParam.size;
                            }
                        }
                        //缓存查询方案参数
                        $G.Page.__sessionQueryBoxParam = queryBoxParam;
                        delete config.firstLoad; //
                    } else {
                        if (config.noCacheParam) {
                            queryBoxParam = me.apf_queryBox.getQueryParam();
                            $G.Page.__sessionQueryBoxParam = queryBoxParam;
                        }
                        else {
                            queryBoxParam = $G.Page.__sessionQueryBoxParam;
                        }
                    }
                    //开始合并查询方案..
                    queryPlanParam = Ext.AppFrame.Util.mergeQueryPlanParam(queryPlanParam, queryBoxParam);
                }

                queryPlanParam.needCount = true;
                if (config.needCount && config.needCount == false) queryPlanParam.needCount = false;
                queryPlanParam.allowAggregate = true; //合计面板
            }
            if (config.queryPlanParamProperties) queryPlanParam.Properties = config.queryPlanParamProperties;

            return queryPlanParam;
        }

        //加载数据
        tree.AP_loadData = function (config) {
            if (this.fireEvent("beforeap_loaddata", this) == false) return;
            var me = this;
            var default_config = me.apf_ds.AP_getDefaultConfig(true);
            if (!config || config.lazyLoad == undefined) {
                default_config.lazyLoad = (me.queryLevel != 0);
            }

            default_config.action = "QueryNodeByCriteria";
            if (Ext.isEmpty(me.levelField)) default_config.action = "QueryByCriteria";
            config = Ext.applyIf(config || {}, default_config);

            //预留扩展函数
            if (me.AP_getQueryArgs && Ext.isFunction(me.AP_getQueryArgs))
                config.args = me.AP_getQueryArgs(config);

            if (!me.selectedId) {
                var selectedRow = me.getSelectionRow();
                if (selectedRow && selectedRow.data && selectedRow.data.ID > 0) {
                    me.selectedId = selectedRow.data.ID;
                }
            }

            if (!config.args) {
                var queryPlanParam = me._innerGetQueryParam(config);
                if (config.action == "QueryNodeByCriteria") {
                    if (me.selectedId && me.selectedId > 0) {
                        config.args = [this.queryLevel, queryPlanParam, me.selectedId];
                    }
                    else {
                        config.args = [this.queryLevel, queryPlanParam, 0];
                    }
                } else {
                    config.args = [queryPlanParam];
                }
            }

            //处理分页
            if (config.pageIndex || config.pageSize) {
                for (var i = 0; i < config.args.length; i++) {
                    if (!Ext.isEmpty(config.args[i].index)) {
                        config.args[i].index = config.pageIndex - 1;
                        config.args[i].size = config.pageSize;
                    }
                }
                if (me.apf_queryPlan) {
                    if (config.pageIndex) me.apf_queryPlan.currentPage = config.pageIndex;
                    if (config.pageSize) me.apf_queryPlan.pageSize = config.pageSize;
                }
            }

            if (!me.apf_ds.__isFirstLoad) {
                me.apf_ds.__isFirstLoad = true;
                me.apf_ds.on("load", function (data, result, append) {
                    me.rootId = (config.rootId || 0);
                    me.loadData(result);

                    if (config.isExpandAll) me.expandAll();

                    if (me.currentStore && me.currentStore.removed) me.currentStore.removed.clear();

                    //焦点定位到原焦点行
                    if (me.selectedId && me.selectedId > 0) {
                        var model = me.getSelectionModel();
                        model.clearSelections();
                        if (result.length > 0 || result.Entities.length > 0) {
                            var selectedRow = null;        //选中节点
                            var parentNodes = new Array(); //记录所有父节点，用于展开
                            var parentNode = null;         //临时变量，记录选中节点或父节点，用于循环获取父节点，构造父节点数组parentNodes
                            var records = me.getDataStore().data.items;
                            do {
                                var j = 0;
                                for (j = 0; j < records.length; j++) {
                                    if (selectedRow == null && parseInt(records[j].data.ID) == parseInt(me.selectedId)) {
                                        selectedRow = records[j];
                                        parentNode = records[j].data;
                                        break;
                                    }
                                    if (parentNode && parentNode.PID == records[j].data.ID) {
                                        parentNodes.push(records[j]);
                                        parentNode = records[j].data;
                                        break;
                                    }
                                }
                                if (j == records.length) {
                                    break;
                                }
                            } while (parentNode && parentNode.PID > 0);

                            //展开所有父节点
                            while (parentNodes.length > 0) {
                                var parent = parentNodes.pop();
                                me.currentStore.expandNode(parent);
                            }
                            if (me.rendered) {  //如果没有渲染就退出吧.
                                if (selectedRow) {
                                    model.selectRecords([selectedRow]);
                                    me.fireEvent("rowclick", me, data.indexOf(selectedRow)); //需要判断grid有rowclick事件吗？
                                }
                                else {
                                    me.getSelectionModel().selectFirstRow(); //默认选中第一条记录
                                    me.fireEvent("rowclick", me, -1);
                                }
                            }
                        }
                        delete me.selectedId;
                    }
                    else {
                        if (config.notSelectFirstRow != true) {
                            if (result.length > 0 || result.Entities.length > 0) {
                                if (me.rendered) {
                                    me.getSelectionModel().selectFirstRow(); //默认选中第一条记录
                                    me.fireEvent("rowclick", me, -1);
                                }
                            }
                        }
                    }
                    //焦点定位到原焦点行

                    if (me.apf_queryBox && $G.Page.__sessionQueryBoxParam && $G.Page.__sessionQueryBoxParam.GridStyleText)
                        Ext.ux.query.configGrid($G.Page.__sessionQueryBoxParam);
                });
            }
            //加载数据

            config.controlId = me.id;
            //加载数据
            config.controlId = me.id;
            if (!!config && !!config.args && Ext.isArray(config.args)) {
                for (var i = 0; i < config.args.length; i++) {
                    var obj = config.args[i];
                    if (!!obj.queryEntity && !!obj.orders && !!obj.filters && obj.size != undefined && Ext.isNumber(obj.size) && obj.index != undefined && Ext.isNumber(obj.index)) {
                        me.__currentQueryPlan = config.args[i];
                        break;
                    }
                }
                if (i == config.args.length) {
                    delete me.__currentQueryPlan;
                }
            }
            me.apf_ds.AP_loadData(config);
        };

        //删除记录
        tree.AP_deleteRecords = function (records, config) {
            if (records && records.length > 0) {
                var me = this;
                var default_config;
                if (records.length == 1) {
                    default_config = me.apf_ds.AP_getDefaultConfig(false, "DeleteNodeByFilter", [me.apf_ds.type, records[0].data.ID, records[0].data.FullCode, me.AP_getTreeFilter(records[0].data)]);
                }
                else {
                    var _treeKeys = new Array(), _treeFullCode = new Array();
                    for (var i = 0; i < records.length; i++) {
                        if (records[i] && records[i].data && records[i].data.ID && records[i].data.FullCode) {
                            _treeKeys.push(records[i].data.ID);
                            _treeFullCode.push(records[i].data.FullCode);
                        }
                    }

                    default_config = me.apf_ds.AP_getDefaultConfig(false, "DeleteNodesByFilter", [me.apf_ds.type, _treeKeys, _treeFullCode, me.AP_getTreeFilter(records[0].data)]);
                }
                if (config && config.isBill) default_config = {}; //单据的话特殊处理一下
                default_config.failure = function () {
                    if (arguments[4][0].Type == "GTPBatchException") {
                        var errMessage = arguments[2];
                        var exp = /成功\d{1}/;
                        var successMessage = errMessage.match(exp);
                        if (successMessage && successMessage.length > 0) {
                            var successCount = successMessage[0].match(/\d+$/);
                            if (successCount && successCount.length > 0) {
                                if (records.length > Number(successCount[0])) {
                                    me.AP_loadData();
                                }
                            }
                        }
                    }
                    else {
                        if (records.length > 1) me.AP_loadData();
                    }
                }
                config = Ext.applyIf(config || {}, default_config);

                var _succ = config.success;
                config.success = function (result) {
                    var selectRows = me.AP_selectRows();
                    if (Ext.isArray(selectRows) && selectRows.length > 0) {
                        for (var i = 0; i < selectRows.length; i++) {
                            if (selectRows[i].store) {
                                me.removeRow(selectRows[i]);
                            }
                        }
                    }
                    else if (Ext.isObject(selectRows)) {
                        me.removeRow(selectRows);
                    }

                    me.getSelectionModel().selectFirstRow();
                    me.fireEvent("rowclick", me);
                    if (_succ && Ext.isFunction(_succ)) _succ.call(this, result);
                }

                me.apf_ds.AP_delete(records, config);
            }
        };

        //***以下是单据树形细表的相关操作
        tree.AP_loadBillDetailData = function (config) {
            //获取单据细表数据
            config = config || {};
            var me = this;
            var rowItems = me.apf_ds.currentStore.data.items;
            var entityList = new Array();
            for (var i = 0; i < rowItems.length; i++) {
                entityList.push(rowItems[i].data);
            }
            var data = { Entities: entityList, TotalCount: rowItems.length };
            me.rootId = config.rootId ? config.rootId : ""; //设置一下，否则汇总有问题
            me.loadData(data);
            if (me.currentStore && me.currentStore.removed) me.currentStore.removed.clear();
        };

        tree.AP_getBillDetailChangeSummary = function () {
            //只适合于单据树形细表，其他如需调用，请自行验证..
            var me = this;
            return me.getChangeSummary(); //
        };

        tree.AP_getMergeChangeSummary = function (billChangeSummary) {
            //得到合并后的ChangeSummary
            var me = this;
            var detailDsNameArray = me.dataSource.split('.');
            var detailDsName = "";
            if (detailDsNameArray.length > 1) detailDsName = detailDsNameArray[1];

            if (detailDsName != "") {
                me.initialConfig.keyField = "ID"; //否则麻烦了..
                var changes = me.AP_getBillDetailChangeSummary();
                me.apf_movedIds = [];
                me.initialConfig.keyField = "GUID";
                if (changes && changes.length > 0) {
                    if (Ext.isEmpty(billChangeSummary)) {
                        var billds = $G.DataContext.getDataSource("Bill");
                        billds.setFieldValue("LastUpdateUserName", "#@"); //这样会产生
                        billChangeSummary = billds.getChangeSummary();
                    }
                    if (billChangeSummary) {
                        var cs = billChangeSummary[0];
                        if (Ext.isEmpty(cs[detailDsName])) cs[detailDsName] = [];
                        for (var i = 0; i < changes.length; i++) {
                            var item = changes[i];
                            if (item.ID > 0) cs[detailDsName].push(item);
                        }
                        var vState = cs["__modified"];
                        if (Ext.isEmpty(vState)) vState = new Array();
                        if (vState.indexOf(detailDsName) == -1) vState.push(detailDsName);
                        cs["__modified"] = vState;
                    }
                }
            }
            return billChangeSummary;
        };
        //增加得到ChangeSummary的方法
        tree.AP_getTreeDetailChangeSummay = function (isDeleteInServer) {
            ///<summary>适合于主表Query保存</summary>
            var me = this;
            var ds = me.apf_ds;
            if (Ext.isEmpty(isDeleteInServer)) isDeleteInServer = false;
            var gridChange;
            if (isDeleteInServer) gridChange = me.AP_getBillDetailChangeSummary();
            else gridChange = me.getChangeSummary();    //得到修改记录

            var dataChange = ds.getChangeSummary();     //得到添加和删除记录
            gridChange = gridChange ? gridChange : new Array();
            dataChange = dataChange ? dataChange : new Array();

            var deleteKeys = new Array();
            var changeSummary = new Array();
            for (var i = 0; i < gridChange.length; i++) {
                if (gridChange[i].__state == "deleted") {
                    if (gridChange[i][ds.primaryKey[0]] > 0) {
                        deleteKeys.push(gridChange[i][ds.primaryKey[0]]);
                        changeSummary.push(gridChange[i]);
                    }
                }
                else if (gridChange[i].__state == "created") {
                    if (gridChange[i].__type == undefined) {
                        gridChange[i].__type = ds.type;
                    }
                    changeSummary.push(gridChange[i]);
                }
                else if (gridChange[i].__state == "modified") {
                    if (gridChange[i].ID < 0) {
                        for (var j = 0; j < dataChange.length; j++) {
                            if (dataChange[j].__state == "created" && gridChange[i].ID == dataChange[j].ID) {
                                changeSummary.push(dataChange[j]);
                                break;
                            }
                        }
                    }
                    else {
                        changeSummary.push(gridChange[i]);
                    }
                }
                else {
                    changeSummary.push(gridChange[i]);
                }
            }
            return { cs: changeSummary, deleteKeys: deleteKeys };
        }
        // end
        return tree;
    }
};

Ext.namespace("Ext.AppFrame.Bill");
Ext.AppFrame.Bill.Submit = function (bizCode, fullDeptId, record, callback, callbackArgs, config, autoShowProcessDialog, showCheckerDialog) {
    var stateName = "";
    if (!Ext.isEmpty(record.data.State)) stateName = record.data.State.name;

    if (stateName == "Submitted") {
        //反提交
        Ext.AppFrame.Bill.SubmitBill(true, config, callback, callbackArgs);
    }
    else if (stateName == "NotSubmitted" || stateName == "ApproveNotPass") {
        //获取可用流程
        var process = Ext.AppFrameV2.SelectProcess.GetProcess(bizCode, fullDeptId);
        //有流程，执行审批
        if (Ext.isArray(process) && process.length > 0) {

            if (autoShowProcessDialog == true || autoShowProcessDialog == "true") autoShowProcessDialog = true;
            else autoShowProcessDialog = false;

            if (showCheckerDialog == true || showCheckerDialog == "true") showCheckerDialog = true;
            else showCheckerDialog = false;

            //(processCode, bizCode, recordId,entityType, callback, callbackArg, autoShowProcessDialog, showCheckerDialog)
            Ext.AppFrameV2.SelectProcess.ShowSelectProcess(process, bizCode, record.id, record.data.__type, callback, callbackArgs, autoShowProcessDialog, showCheckerDialog);
        }
        else { //没有可用流程,执行提交、或反提交
            Ext.AppFrame.Bill.SubmitBill(false, config, callback, callbackArgs);
        }
    }
};

Ext.AppFrame.Bill.getBillStateName = function (rec) {
    if (Ext.isEmpty(rec) || Ext.isEmpty(rec.data) || Ext.isEmpty(rec.data.State)) return "";
    return rec.data.State.name
};

Ext.AppFrame.Bill.SubmitBill = function (isReverseSubmit, config, callback, callbackArgs) {
    var ds = undefined;
    if (config.ds) {
        ds = config.ds;
        delete config.ds;
    }
    if (!isReverseSubmit) {
        //提交
        Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedBill, GTP.AppFrameV2.Res.AppFrame_Submit), function (e) {
            if (e == "yes") {
                var dispConfig = {
                    controller: config.controller,
                    action: config.submitAction,
                    args: config.submitActionArgs,
                    success: function (result) {
                        callback(result, callbackArgs);
                        if (ds) {
                            ds.fireEvent("aftersubmit", result);
                        }
                    }
                };

                $G.dispatcher(dispConfig);
            }
        });
    }
    else {
        //反提交
        Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedBill, "取消提交"), function (e) {
            if (e == "yes") {
                var dispConfig = {
                    controller: config.controller,
                    action: config.reverseSubmitAction,
                    args: config.reverseSubmitArgs,
                    success: function (result) {
                        callback(result, callbackArgs);
                        if (ds) {
                            ds.fireEvent("aftersubmit", result);
                        }
                    }
                };
                $G.dispatcher(dispConfig);
            }
        });
    }
};
//[Start]
Ext.AppFrame.Bill.UpdateTabTitleSelf = function () {
    var IsEndWith = function (s1, s2) {
        if (s1.length < s2.length)
            return false;
        if (s1 == s2)
            return true;
        if (s1.substring(s1.length - s2.length) == s2)
            return true;
        return false;
    }

    var name = document.title;
    var s = "维护";
    if (IsEndWith(name, s)) name = name.substr(0, name.length - s.length);
    var ds = $G.DataContext.getDataSource("Bill");
    var rec = ds.getDataRecord();
    if (rec.id < 0) name += "_" + GTP.AppFrameV2.Res.AppFrame_New;
    else name += "_" + rec.data.Code;
    Portal.Tab.UpdateTitleSelf(name);
};
//[End]
//[Start]
Ext.AppFrame.Bill.CallFlow_beforeAdvance = function (isCall, callback, action) {
    //在流程中调用的..
    if (parent) {
        var func = function (taskIDList, button) {
            if (callback && Ext.isFunction(callback)) {
                if (!action) action = $G.Actions.getAction("actSave");
                action.taskIDList = taskIDList;
                try {
                    if (callback.call(action, action) == false) {
                        return false;
                    }
                }
                catch (e) {
                    if (e.message == "Field_Value_Error") {
                        return false;
                    }
                    else if (e.message == "Save_Failure") {
                        return false;
                    }
                    else {
                        throw e;
                    }
                }
                return taskIDList;
            }
        };
        if (!isCall) func = null;
        parent.GTPWorkflowEvent_beforeAdvance = func; //发送
        parent.GTPWorkflowEvent_beforeSmartAdvance = func;
        parent.GTPWorkflowEvent_beforeTrans = func;
        parent.GTPWorkflowEvent_beforeBack = func; //回退
        parent.GTPWorkflowEvent_beforeFinish = func; //完成
        parent.GTPWorkflowEvent_beforeAbort = func; //终止
        parent.GTPWorkflowEvent_beforeReAbort = func;
        parent.GTPWorkflowEvent_beforeRePlay = func;
    }
};
//[End]

Ext.AppFrame.Bill.GetBillLevel = function (ds, rc) {
    //单据级别
    if (!ds || !rc) return -1;
    var store = rc.store;
    if (rc.data.PID == 0) return 1;
    else {
        var level = 1;
        rc = store.getNodeParent(rc);
        while (rc != null) {
            level++;
            if (rc.data.PID == 0) return level;
            rc = store.getNodeParent(rc);
        }
        return level;
    }
};

Ext.AppFrame.Bill.InitButtonByPageExtend = function () {

    //根据页面扩展数据初始化控件
    var cmp = $G.getCmp("btnViewFlow");
    if (cmp) cmp.setVisible(Ext.AppFrame.Common.getModuleApfExtend("APE_ShowFlowButton") == "true");

    var cmp = $G.getCmp("btnPrint");
    if (cmp) cmp.setVisible(Ext.AppFrame.Common.getModuleApfExtend("APE_ShowPrintButton") == "true");

    var cmp = $G.getCmp("btnExportExcel");
    if (cmp) cmp.setVisible(Ext.AppFrame.Common.getModuleApfExtend("APE_ShowExcelButton") == "true");

    var cmp = $G.getCmp("btnShareBill");
    if (cmp) {
        cmp.setVisible(Ext.AppFrame.Common.getModuleApfExtend("S_AuthEntityShare") == "true");
    }



};

//[Start]
Ext.AppFrame.Bill.PrejudgeModifyAuth = function (id, fullDeptId) {
    if (Ext.isEmpty(_this._checkComponentHasAuthItem)) {
        Gtp.net.Global.dispatcher({
            controller: $G.getPageController(),
            async: false, //非异步
            action: "ComponentHasAuthItem",
            args: ["Modify"],
            success: function (result) {
                if (result) _this._checkComponentHasAuthItem = "1";
                else _this._checkComponentHasAuthItem = "0";
            },
            failure: function () {
            }
        });
    }
    //如果是只读共享的话
    if ($G.PageExtend.APE_ShareReadOnly == "true") {
        fullDeptId = "0"; //如果为""，基类又加上了
    } else {
        fullDeptId = Ext.AppFrame.Common.getDeptFullId(); //先按这个走吧
    }
    if (_this._checkComponentHasAuthItem == "1") {
        return _this._AuthItemDemandById("Modify", id, fullDeptId);
    }
    else return true;
},
//[End]

//[Start]
Ext.AppFrame.Bill.AutoProcessDetail = function (actionName, treeGrid) {
    //    var result = false;
    var resultList = new Array();
    //    var hasDetail = false;
    Ext.ComponentMgr.all.each(function (cmp) {
        if (!treeGrid || (Ext.isString(treeGrid) && cmp.id && cmp.id == treeGrid)) {
            if (cmp.getXType() == "gtptreegridpanel") {
                //********************************暂用方式********************************//
                //新细表模板处理方式：树形细表、分页细表数据源是Query，读取数据源扩展数据AutoProcessDetail==true，然后根据autoSaveDetailActionName、autoLoadDetailActionName处理细表
                //暂时读取不了数据源扩展数据，所以使用细表控件类型是树形来判定
                if (cmp.initialConfig["autoProcessDetail"] == "true") {
                    if (actionName == "clearTreeDetailData") {
                        //清空树
                        var store = $G.getCmp(cmp.id).getStore();
                        if (store) {
                            store.clearData();
                            store.commitChanges(true);
                        }
                    }
                    else if (cmp.initialConfig[actionName]) {
                        var action = $G.Actions.getAction(cmp.initialConfig[actionName]);
                        if (action) {
                            if (action.id == "treeDetail_actRefresh") {
                                cmp.config = { firstLoad: true };
                                cmp.forceFresh = true;
                            }
                            var ret = action.getActionHandler.call(this, action, cmp);
                            //                        if (ret) {
                            //                            result = true;
                            //                        }
                            resultList.push([cmp.id, !!ret]);
                        }
                    }
                }
                //********************************暂用方式********************************//

            } else if (cmp.getXType() == "gtpgridpanel") {
                //********************************暂用方式********************************//
                //新细表模板处理方式：树形细表、分页细表数据源是Query，读取数据源扩展数据AutoProcessDetail==true，然后根据autoSaveDetailActionName、autoLoadDetailActionName处理细表
                //暂时读取不了数据源扩展数据，所以使用细表控件类型是树形来判定
                if (cmp.initialConfig["autoProcessDetail"] == "true") {
                    //hasDetail = true;
                    if (cmp.initialConfig[actionName]) {
                        var action = $G.Actions.getAction(cmp.initialConfig[actionName]);
                        if (action) {
                            if (action.id == "pagingDetail_actRefresh") {
                                cmp.config = { firstLoad: true };
                                cmp.forceFresh = true;
                            }
                            var ret = action.getActionHandler.call(this, action, cmp);
                            //                        if (ret) {
                            //                            result = true;
                            //                        }
                            resultList.push([cmp.id, !!ret]);
                        }
                    }
                }
                //********************************暂用方式********************************//
            }
        }
    });
    //如果没有细表，那么相当于处理成功，返回true
    //    if (hasDetail == false)
    //        result = true;
    //    return result;
    return resultList;
},
//[End]

//[Start]
Ext.AppFrame.Bill.InitAttachDetail = function (moduleCode, folderClickCallBack) {

    var __docTempFolderPanelName = "docTempFolderPanel_";
    var __docTempFolderMenuPanelName = "docTempFolderMenuPanel_";
    var __docAttachListPanelName = "docAttachListPanel_";
    var __docTempFolderTreeName = "docTempFolderTree_";

    //附件项模板定义
    Ext.AppFrame.docTempFolderPanel = Ext.extend(Ext.Panel, {
        layout: 'border',
        title: '文档模板目录',
        header: false,
        bodyBorder: false,
        border: false,
        id: 'docTempFolder_' + Ext.id(),
        tbarCssClass: 'x-attachment-panel-tbar',
        store: {},
        readOnly: false,
        initComponent: function () {

            this.bodyStyle = "background-color:transparent;background:none;";

            Ext.AppFrame.AttachItemPanel.superclass.initComponent.call(this);

            this.store = new Ext.data.ArrayStore({
                proxy: new Ext.data.MemoryProxy(),
                fields: ['ID', 'Code', 'FullCode', 'Name', 'OrderNo', 'IsLeaf', 'Level', 'CanViewDFile', 'ApplyDept_DeptId', 'D_DeptId', 'D_FullDeptId'],
                render: function () {
                    Ext.data.ArrayStore.superclass.initComponent.call(this);
                }
            });

            //this.add(this.fileView);
        }
    });

    var getDocTempFolderData = function (moduleCode) {
        var data;
        var disp = new Gtp.net.GtpDispatcher({
            async: false,
            dispatchArgs: {
                controller: "GTP.AppFrameV2.DocTemplate.DocTemplatePage",
                action: "getDocTemplateFolder",
                args: [moduleCode, Ext.AppFrame.Common.getDeptFullId()]
            },
            listeners: {
                scope: this,
                'success': function (result) {
                    data = result
                },
                'failure': function () {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "获取文档目录出错！");
                }
            }
        });
        disp.dispatch();

        return data;
    };


    //构造附件细表新panel
    var createAttachDetailPanel = function (grid) {

        var panelConfig = {
            id: __docTempFolderPanelName + grid.id,
            items: [
            {
                id: __docTempFolderMenuPanelName + grid.id,
                title: 'West Panel',
                header: false,
                border: true,
                layout: 'fit',
                split: true,         // enable resizing
                minSize: 100,         // defaults to 250
                maxSize: 350,
                region: 'west', //指定子面板所在区域为west  
                width: 250
            }, {
                id: __docAttachListPanelName + grid.id,
                title: 'Main Content',
                header: false,
                border: false,
                layout: 'fit',
                region: 'center'//指定子面板所在区域为center  
            }]
        };

        var docTempFolderPanel = new Ext.AppFrame.docTempFolderPanel(panelConfig);

        return docTempFolderPanel;
    };

    var createFolderTree = function (grid, folderData, folderClickCallBack) {
        var getChildTemplateIds = function (node) {
            var templateIds = new Array();

            var readNode = function (curNode) {
                templateIds.push(curNode.attributes.id);
                if (!curNode.isLeaf()) {
                    for (var i = 0; i < curNode.childNodes.length; i++) {
                        readNode(curNode.childNodes[i]);
                    }
                }
            };
            readNode(node);

            return templateIds;
        }

        var treePanel = new Ext.tree.TreePanel({
            id: __docTempFolderTreeName + grid.id,
            useArrows: true,
            title: "文档模板目录",
            autoScroll: true,
            animate: true,
            enableDD: true,
            containerScroll: true,
            border: false,
            autoLoadData: false,
            rootVisible: false,
            region: "center",
            bodyBorder: false,
            hideBorders: true
        });

        treePanel.on('click', function (node, event) {
            var gridName = this.id.replace(__docTempFolderTreeName, "");
            var grid = $G.getCmp(gridName);
            var ds = $G.DataContext.getDataSource(grid.dataSource);
            ds.folderId = node.attributes.id;
            ds.folderCanViewDFile = node.attributes.extendData.CanViewDFile;

            var templateIds = getChildTemplateIds(node);
            var filterFn = function (record) {
                if (templateIds.indexOf(record.get("FolderId")) >= 0) {
                    return true;
                }
            }

            var store = ds.getDataStore();
            store.filterBy(filterFn);

            if (folderClickCallBack)
                folderClickCallBack.call(this, node, event);
        });

        var root = new Ext.tree.TreeNode({
            id: '0',
            text: 'root',
            expanded: true  //设置菜单展开 
        });  //声明根节点

        treePanel.setRootNode(root);   //设置TreePanel的根节点为root

        if (folderData && folderData.Entities.length > 0) {
            for (var level = 1; level < 8; level++) {//只遍历7层，业务中不可能存在那么多层级
                for (var i = 0; i < folderData.Entities.length; i++) {
                    if (folderData.Entities[i].Level == level) {
                        if (folderData.Entities[i].PID == 0 && !folderData.Entities[i].PID) {
                            var node;
                            if (folderData.Entities[i].CanViewDFile) {
                                node = new Ext.tree.TreeNode({ id: folderData.Entities[i].ID, text: folderData.Entities[i].Name, extendData: folderData.Entities[i], expanded: true, iconCls: "x-docTempFolder-node" });
                            }
                            else {
                                node = new Ext.tree.TreeNode({ id: folderData.Entities[i].ID, text: folderData.Entities[i].Name, extendData: folderData.Entities[i], expanded: true, iconCls: "x-docTempFolder-virtual-node" });
                            }
                            treePanel.root.appendChild(node);
                        }
                        else {
                            var node;
                            if (folderData.Entities[i].CanViewDFile) {
                                node = new Ext.tree.TreeNode({ id: folderData.Entities[i].ID, text: folderData.Entities[i].Name, extendData: folderData.Entities[i], expanded: true, iconCls: "x-docTempFolder-node" });
                            }
                            else {
                                node = new Ext.tree.TreeNode({ id: folderData.Entities[i].ID, text: folderData.Entities[i].Name, extendData: folderData.Entities[i], expanded: true, iconCls: "x-docTempFolder-virtual-node" });
                            }
                            var parent = treePanel.getNodeById(folderData.Entities[i].PID);
                            parent.appendChild(node);
                        }
                    }
                }
            }
        }
        return treePanel;
    };

    //初始化AttachGrid
    Ext.ComponentMgr.all.each(function (cmp) {
        if (cmp.getXType() == "gtptreegridpanel") {
            if (cmp.initialConfig["ape_AttachGrid"] == "true") {
                if (cmp.initialConfig["aPE_DocTemplate"] != "false") {
                    var folderData = getDocTempFolderData(moduleCode);
                    if (folderData && folderData.Entities && folderData.Entities.length > 0) {

                        //设置grid数据源的新增事件，增加记录，FolderId，TemplateID要复制
                        var ds = $G.DataContext.getDataSource(cmp.dataSource);
                        ds.on("add", function (ds, store, records, index) {
                            if (this.folderId && this.folderId > 0) {
                                for (var k = 0; k < records.length; k++) {
                                    records[k].set("FolderId", this.folderId);
                                }
                            }
                        });
                        //如果只有一个节点，不构造文档目录树
                        if (folderData.Entities.length == 1) {
                            ds.folderId = folderData.Entities[0].ID;
                            ds.folderCanViewDFile = folderData.Entities[0].CanViewDFile;
                        }
                        else {
                            var docTempFolderPanel = createAttachDetailPanel(cmp);
                            var docTempFolderTree = createFolderTree(cmp, folderData, folderClickCallBack)
                            if (docTempFolderPanel && docTempFolderTree) {
                                //附件列表移动到右侧，左侧放文档目录
                                var tabItem = cmp.ownerCt;
                                tabItem.remove(cmp, false);
                                var leftPanel = docTempFolderPanel.findById(__docTempFolderMenuPanelName + cmp.id);
                                var rigthPanel = docTempFolderPanel.findById(__docAttachListPanelName + cmp.id);
                                leftPanel.add(docTempFolderTree);
                                rigthPanel.add(cmp);
                                tabItem.add(docTempFolderPanel);
                                tabItem.doLayout();

                                //默认选中文档目录的第一个节点
                                docTempFolderTree.on("afterrender", function (m, t) {
                                    this.root.select();
                                    docTempFolderTree.fireEvent('click', docTempFolderTree.root.childNodes[0]);
                                });
                                var sourceName = cmp.dataSource;
                                $G.DataContext.getDataSource(sourceName).on("datachanged", function () {
                                    for (var i = 0; i < $G.Page.__docTempFolderTreeArray.length; i++) {
                                        var treeDocT = $G.Page.__docTempFolderTreeArray[i];
                                        if (treeDocT.id) {
                                            gridid = treeDocT.id.replace(__docTempFolderTreeName, "");
                                            var gridattach = $G.getCmp(gridid);
                                            var strgridattach = gridattach.dataSource + "#";
                                            if (strgridattach.indexOf("." + this.name + "#") >= 0) {
                                                try {
                                                    treeDocT.root.select();
                                                }
                                                catch (e) { }
                                                treeDocT.fireEvent('click', treeDocT.root.childNodes[0]);

                                                break;
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        } else if (cmp.getXType() == "gtpgridpanel") {
            if (cmp.initialConfig["ape_AttachGrid"] == "true") {
                if (cmp.initialConfig["aPE_DocTemplate"] != "false") {
                    var folderData = getDocTempFolderData(moduleCode);
                    if (folderData && folderData.Entities && folderData.Entities.length > 0) {
                        //设置grid数据源的新增事件，增加记录，FolderId，TemplateID要复制
                        var ds = $G.DataContext.getDataSource(cmp.dataSource);
                        ds.on("add", function (ds, store, records, index) {
                            if (this.folderId && this.folderId > 0) {
                                for (var k = 0; k < records.length; k++) {
                                    records[k].set("FolderId", this.folderId);
                                }
                            }
                        });
                        //如果只有一个节点，不构造文档目录树
                        if (folderData.Entities.length == 1) {
                            ds.folderId = folderData.Entities[0].ID;
                            ds.folderCanViewDFile = folderData.Entities[0].CanViewDFile;
                        }
                        else {
                            var docTempFolderPanel = createAttachDetailPanel(cmp);
                            var docTempFolderTree = createFolderTree(cmp, folderData, folderClickCallBack);

                            if (!$G.Page.__docTempFolderTreeArray) $G.Page.__docTempFolderTreeArray = new Array();
                            $G.Page.__docTempFolderTreeArray.push(docTempFolderTree);

                            if (docTempFolderPanel && docTempFolderTree) {
                                //附件列表移动到右侧，左侧放文档目录
                                var tabItem = cmp.ownerCt;
                                tabItem.remove(cmp, false);
                                var leftPanel = docTempFolderPanel.findById(__docTempFolderMenuPanelName + cmp.id);
                                var rigthPanel = docTempFolderPanel.findById(__docAttachListPanelName + cmp.id);
                                leftPanel.add(docTempFolderTree);
                                rigthPanel.add(cmp);
                                tabItem.add(docTempFolderPanel);
                                tabItem.doLayout();

                                //默认选中文档目录的第一个节点
                                docTempFolderTree.on("afterrender", function () {
                                    this.root.select();
                                    this.fireEvent('click', docTempFolderTree.root.childNodes[0]);
                                });

                                var sourceName = cmp.dataSource;
                                $G.DataContext.getDataSource(sourceName).on("datachanged", function () {
                                    for (var i = 0; i < $G.Page.__docTempFolderTreeArray.length; i++) {
                                        var treeDocT = $G.Page.__docTempFolderTreeArray[i];
                                        if (treeDocT.id) {
                                            gridid = treeDocT.id.replace(__docTempFolderTreeName, "");
                                            var gridattach = $G.getCmp(gridid);
                                            var strgridattach = gridattach.dataSource + "#";
                                            if (strgridattach.indexOf("." + this.name + "#") >= 0) {
                                                try {
                                                    treeDocT.root.select();
                                                }
                                                catch (e) { }
                                                treeDocT.fireEvent('click', treeDocT.root.childNodes[0]);

                                                break;
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });
},
//[End]


////////////////////////////////////////////////////////////////  
// 功能名称：附件的的相关操作
// 功能说明：
// 备注：使用附件功能必须引用附件管理中GTPFileClient.js文件
////////////////////////////////////////////////////////////////
Ext.namespace("Ext.AppFrame.Attachment");
//给选中数据赋值，针对文件实体必须的属性

Ext.AppFrame.Attachment.GetIcoFileByFileExt = function (FileName, size) {
    var srcMap = [
                ["default", "GTP_elseflie.png"],
                [".doc", "GTP_word.png"],
                [".docx", "GTP_word.png"],

                [".xls", "GTP_excel.png"],
                [".xlsx", "GTP_excel.png"],

                [".ppt", "GTP_ppt.png"],
                [".pptx", "GTP_ppt.png"],

                [".bmp", "GTP_pic.png"],
                [".jpg", "GTP_pic.png"],
                [".jpeg", "GTP_pic.png"],
                [".png", "GTP_pic.png"],
                [".gif", "GTP_pic.png"],
                [".tif", "GTP_pic.png"],
                [".jepg", "GTP_pic.png"],

                [".zip", "GTP_rar.png"],
                [".rar", "GTP_rar.png"],

                [".txt", "GTP_txt.png"],
                [".ini", "GTP_txt.png"],

                [".rmvb", "GTP_video.png"],
                [".rm", "GTP_word.png"],
                [".avi", "GTP_video.png"],
                [".mkv", "GTP_video.png"],
                [".mp4", "GTP_video.png"],

                [".mp3", "GTP_voice.png"],
                [".wav", "GTP_voice.png"],

                [".html", "GTP_html.png"],
                [".htm", "GTP_html.png"],
                [".mht", "GTP_html.png"],
                [".aspx", "GTP_html.png"],

                [".pdf", "GTP_pdf.png"],

                [".dps", "GTP_dps.png"],

                [".et", "GTP_et.png"]
            ];
    var sExt = "";
    var pos = FileName.lastIndexOf(".");
    if (pos > -1) sExt = FileName.substring(pos).toLowerCase();
    var img = "GTP_elseflie.png";
    for (var i = 0; i < srcMap.length; i++) {
        if (sExt == srcMap[i][0]) {
            img = srcMap[i][1];
            break;
        }
    }
    if (!Ext.isEmpty(size)) img = img.replace(".png", size + ".png");
    return img;
};
Ext.AppFrame.Attachment.SetFileValues = function (UploadInfo, DataSource, IsShare, isMultiSelect, func) {
    var len = UploadInfo.Files.length;
    var file;
    for (var i = 0; i < len; i++) {
        if (isMultiSelect) {
            DataSource.addRecord();
        }
        file = UploadInfo.Files[i];
        Gtp.util.DataSource.setFieldValue(DataSource, "Name", file.FileName);
        Gtp.util.DataSource.setFieldValue(DataSource, "FileID", file.FileID);
        Gtp.util.DataSource.setFieldValue(DataSource, "ViewGuid", file.ViewGuid);
        Gtp.util.DataSource.setFieldValue(DataSource, "EditGuid", file.EditGuid);
        Gtp.util.DataSource.setFieldValue(DataSource, "CreateTime", Ext.AppFrame.Common.getServerTime().format("Y-m-d H:i:s"));
        Gtp.util.DataSource.setFieldValue(DataSource, "FileSize", Ext.AppFrame.Attachment.GetFileSize(file.FileSize));
        Gtp.util.DataSource.setFieldValue(DataSource, "DisplayName", file.FileName);
        if (file.TemplateID != undefined)
            Gtp.util.DataSource.setFieldValue(DataSource, "TemplateID", file.TemplateID);
        if (file.TemplateID != undefined)
            Gtp.util.DataSource.setFieldValue(DataSource, "FolderId", file.FolderId);
        if (file.TemplateID != undefined)
            Gtp.util.DataSource.setFieldValue(DataSource, "TemplateInfo", file.TemplateInfo);
        if (IsShare) {
            Gtp.util.DataSource.setFieldValue(DataSource, "ShareCount", 1);
        }
        else {
            Gtp.util.DataSource.setFieldValue(DataSource, "ShareCount", 0);
        }
        if (UploadInfo.Result == "0") {
            Gtp.util.DataSource.setFieldValue(DataSource, "FileExist", true);
        }
        else {
            Gtp.util.DataSource.setFieldValue(DataSource, "FileExist", false);
        }
        if (func && Ext.isFunction(func)) func(DataSource, file);
        DataSource.fireEvent("afteraddfile", file);
    }

};

//size > = 0;
Ext.AppFrame.Attachment.GetFileSize = function (size) {
    size = size / 1024;
    if (size == 0) {
        //0KB
        size = "0 KB";
    } else if (size > 0 && size < 1) {
        //1KB
        size = "1 KB";
    } else if (size >= 1) {
        //K
        size = Ext.util.Format.number(Math.round(size), "0,000") + " KB";
    }
    return size;
}


//删除文件
Ext.AppFrame.Attachment.DeleteFile = function (FileID, EditGuid, FileName) {
    GTPFileClient.FileClientSetOptionSilent(false);
    var result = GTPFileClient.FileClientDelete(FileID, EditGuid, FileName, true);
    return result;
};

//打开文件查看
Ext.AppFrame.Attachment.ViewFile = function (FileID, FileName, ViewGUID) {
    var LocalTempDir = GTPFileClient.ShellGetLocalTempDir();
    LocalTempDir = LocalTempDir + "\\" + FileName;
    GTPFileClient.FileClientSetOptionSilent(false);
    var result = GTPFileClient.FileClientDownload(FileID, ViewGUID, LocalTempDir, 0, true);
    if (!result) {
        return null;
    }
    if (result.Result == "0") {
        GTPFileClient.ShellExecute(LocalTempDir);
        return LocalTempDir;
    }
    else if (result.Result == "-2") {
        if (result.ErrorMessage.indexOf("另一个程序正在使用此文件") > 0) {
            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "文件已经被打开，请先关闭文件!");
            return true;
        }
    }
    Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, "服务器文件错误！");
};

//下载文件
Ext.AppFrame.Attachment.DownloadFile = function (FileID, FileName, ViewGUID) {

    var folderPath = GTPFileClient.ShellDialogSelectFolder("选择保存路径", folder);
    if (!folderPath || folderPath.length < 1) return;
    var folder = folderPath + "\\";
    var filePath = folder + FileName;

    var doDownload = function () {
        GTPFileClient.FileClientSetOptionSilent(false);
        var result = GTPFileClient.FileClientDownload(FileID, ViewGUID, filePath, 0, true);
        if (!result) {
            return;
        }
        if (result.Result == "-1") {
            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "部分处理完成！");
        }
        else if (result.Result == "-2") {
            if (result.ErrorMessage == "HTTP错误#404") {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "文件服务器错误，文件无法读取！");
            }
            else {
                var index = result.ErrorMessage.search("进程无法访问");
                var msg = index == -1 ? "未知错误!" : "文件已经被打开，请先关闭文件!";
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, msg);
            }
        }
    }



    if (GTPFileClient.ShellFileExists(filePath)) {
        Gtp.net.MessageBox.show({
            title: GTP.AppFrameV2.Res.Hint,
            msg: "当前文件夹下存在同名文件，是否覆盖原有同名文件?",
            buttons: Ext.Msg.YESNO,
            fn: function callback(btn) {
                if (btn == "yes") {
                    doDownload();
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    } else doDownload();

};

//下载多份文件
Ext.AppFrame.Attachment.DownloadFiles = function (fileList) {

    var doDownload = function (FileID, ViewGUID) {
        GTPFileClient.FileClientSetOptionSilent(false);
        var result = GTPFileClient.FileClientDownload(FileID, ViewGUID, filePath, 0, true);
        if (!result) {
            return;
        }
        if (result.Result == "-1") {
            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "部分处理完成！");
        }
        else if (result.Result == "-2") {
            if (result.ErrorMessage == "HTTP错误#404") {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "文件服务器错误，文件无法读取！");
            }
            else {
                var index = result.ErrorMessage.search("进程无法访问");
                var msg = index == -1 ? "未知错误!" : "文件已经被打开，请先关闭文件!";
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, msg);
            }
        }
    }
    var folderPath = GTPFileClient.ShellDialogSelectFolder("选择保存路径", folder);
    if (!folderPath || folderPath.length < 1) return;
    var folder = folderPath + "\\";

    if (Ext.isArray(fileList) && fileList.length > 0) {
        for (var i = 0; i < fileList.length; i++) {
            var FileID = fileList[i].get("FileID"), FileName = fileList[i].get("Name"), ViewGUID = fileList[i].get("ViewGuid");
            var filePath = folder + FileName;
            if (GTPFileClient.ShellFileExists(filePath)) {
                Gtp.net.MessageBox.show({
                    title: GTP.AppFrameV2.Res.Hint,
                    msg: "当前文件夹下存在同名文件【" + FileName + "】，是否覆盖原有文件?",
                    buttons: Ext.Msg.YESNO,
                    fn: function callback(btn) {
                        if (btn == "yes") {
                            doDownload(FileID, ViewGUID);
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            } else doDownload(FileID, ViewGUID);
        }
    }
};

//上传文件
Ext.AppFrame.Attachment.FileClientUpload = function (LocalFilePath) {
    GTPFileClient.FileClientSetOptionSilent(false);
    var uploadInfo = GTPFileClient.FileClientUpload(LocalFilePath, "", "", "", "", "", 0, true);
    if (!uploadInfo) {
        Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, "服务器连接错误！");
        return null;
    }
    if (uploadInfo.Result == "-1") {
        Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, uploadInfo.ErrorMessage);
        return null;
    }
    if (uploadInfo.Result == "-2") {
        Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, uploadInfo.ErrorMessage);
        return null;
    }
    return uploadInfo;
};


//选择文件
Ext.AppFrame.Attachment.SelectFiles = function (isMultiSelect) {
    var bMultiSelect = !Ext.isEmpty(isMultiSelect) ? isMultiSelect : true;
    var fileInfo = GTPFileClient.ShellDialogSelectFiles("", "", "(*.*)|*.*", 0, "", bMultiSelect);
    if (fileInfo == null)
        return null;
    if (fileInfo.Result == false)
        return null;
    return fileInfo;
};

//通过文件ID，文件查询码，操作码判断文件是否存在
Ext.AppFrame.Attachment.CheckFileExsit = function (FileID, ViewGUID, EditGuid) {
    var exist = true;
    if (!FileID || FileID.length < 1)
        return false;
    if (!ViewGUID || ViewGUID.length < 1)
        return false;
    if (!EditGuid || EditGuid.length < 1)
        return false;
    return exist;
};

//*查询附件列表*
Ext.AppFrame.Attachment.ViewAttach = function (recordID, entityName, state) {
    if (recordID == undefined || recordID == 0) return;
    var absoluteUrl = $G.getPageURLByFullName("GTP.AppFrame.AttachPage");
    var parameters = { "EntityName": entityName, "state": state, "ID": recordID };
    var data = Gtp.net.Global.open({
        url: absoluteUrl,
        target: "_modal",
        parameters: parameters,
        features: { dialogWidth: "700px", dialogHeight: "410px" }
    });
};

//下载到临时文件夹并返回全路径
Ext.AppFrame.Attachment.GetTempPath = function (FileID, FileName, ViewGUID) {
    var LocalTempDir = GTPFileClient.ShellGetLocalTempDir();
    LocalTempDir = LocalTempDir + "\\" + FileName;
    GTPFileClient.FileClientSetOptionSilent(false);
    var result = GTPFileClient.FileClientDownload(FileID, ViewGUID, LocalTempDir, 0, true);
    if (!result) {
        return null;
    }
    if (result.Result == "0") {
        return LocalTempDir;
    }
    else {
        Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, "服务器文件错误！");
    }
};

//附件记录字段格式
Ext.AppFrame.Attachment.FileRecord = Ext.data.Record.create([
{
    name: "ID",           //附件记录ID
    type: "int"
}, {
    name: "FileID"        //附件记录ID
}, {
    name: "Name"          //附件名称
}, {
    name: "DisplayName"   //显示名
}, {
    name: "ShareCount"    //分享次数
}, {
    name: "FileSize"      //附件大小
}, {
    name: "CreateTime"    //创建时间
}, {
    name: "FileExist"     //附件是否存在
}, {
    name: "ViewGUID"      //查看权限码
}, {
    name: "EditGUID"      //编辑权限码
}, {
    name: "Remark"        //附件备注
}, {
    name: "FileFlag"  //附件标示
}]);


////////////////////////////////////////////////////////////////  
// 功能名称：附件项类型的布局
// 功能说明：
// 备注：使用附件功能必须引用附件管理中GTPFileClient.js文件
////////////////////////////////////////////////////////////////

//附件项初始化
Ext.AppFrame.AttachItemPanel = function (config) {
    Ext.AppFrame.AttachItemPanel.superclass.constructor.call(this, config);
}

//附件项模板定义
Ext.extend(Ext.AppFrame.AttachItemPanel, Ext.Panel, {
    //layout: 'fit',
    title: '附件',
    bodyBorder: false,
    border: false,
    id: 'AttachmentPanel' + Ext.id(),
    attachEntityName: "T6", //附件实体名称,IS NOT NULL
    appNamespace: "GTP",
    immediate: true,
    isModify: false,
    fileStatus: true, //上传true/下载false
    isView: true,
    fileTitle: "",
    defaultExt: "",
    viewAutoHeight: false,
    filters: "", //设置附件选择类型；如：压缩(*.rar)|*.rar|图片(*.jpg:*.bmp:*.jpeg:*.png)|*.jpg;*.bmp;*.jpeg;*.png|所有文件(*.*)|*.*
    filterIndex: 0, //"文件类型"组合框中当前选中的文件过滤器的索引, 第一个文件过滤器索引值是1.比如 FileDialog.Filter = "Text files(*.txt)|*.txt|One filter(*.hhh)|*.hhh|All Files(*.*)|*.*",那么如果你的FilterIndex=2,那么你的文件对话框"文件类型"组合框就是"One filter(*.hhh)" 
    initialDir: "", //打开附件的磁盘目录； 如：C:\
    multiSelect: false, //打开选择文件对话框时是否可以选择多个附件，true:多选；false:单选；默认true
    maxUploadSize: 2097152000,
    maxDownloadSize: 524288000,
    tbarCssClass: 'x-attachment-panel-tbar',
    userID: '',
    userName: '',
    oneSelf: '1', //  oneSelf:1  显示自己的附件； oneSelf：2 显示他人的附件； 3 显示所有的附件；
    permission: false, //用户是否可以删除附件的权限， true：可以删除所以人的附件；false:只能删除自己的附件；可控制FileView中的事件
    store: {},
    readOnly: false,
    addCallback: null,
    deleCallback: null,
    setStateCallback: null,
    modifyCallback: null,

    initComponent: function () {

        this.bodyStyle = "background-color:transparent;background:none;";

        var attControl = this.id;
        Ext.AppFrame.AttachItemPanel.superclass.initComponent.call(this);

        this.store = new Ext.data.ArrayStore({
            proxy: new Ext.data.MemoryProxy(),
            fields: ['ID', 'FileID', 'Name', 'DisplayName', 'FileSize', 'ViewGuid', 'EditGuid', 'ShareCount', 'FileExist', 'CreateTime', 'Remark'],
            render: function () {
                Ext.data.ArrayStore.superclass.initComponent.call(this);
            }
        });

        this.loadData(null);
        this.fullFilesView(this.store);
        this.add(this.fileView);
        this.setAttachmentTitle();
    },

    //设置附件预览的标题
    setAttachmentTitle: function () {

        //this.setTitle('<span style="font-size:14px;font-weight:bold;">' + this.title + '</span><span style="font-size:12px;font-weight:normal;"></span>');
        this.setTitle(this.title, "x-filebox-list-title");
    },

    //添加附件预览或上传文件预览
    fullFilesView: function (store) {
        if (true) { //上传
            this.fileView = new Ext.AppFrame.FileView({
                store: store,
                attachmentId: this.id,
                curuserId: this.userID,
                autoHeight: this.viewAutoHeight
            });
        }
    },

    //下载附件
    downloadAttach: function (fileId) {
        try {
            for (var i = 0; i < this.fileView.store.data.items.length; i++) {
                var record = this.fileView.store.getAt(i);
                if (record.get("FileID") == fileId) {
                    var ViewGuid = record.get("ViewGuid");
                    var Name = record.get("Name");
                    var exist = Ext.AppFrame.Attachment.CheckFileExsit(fileId, ViewGuid, record.get("EditGuid"));
                    if (!exist) {
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "附件不存在");
                        return;
                    }
                    var result = Ext.AppFrame.Attachment.DownloadFile(fileId, Name, ViewGuid);
                    if (!result) {
                        return;
                    }
                    if (result.Result != "0") {
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "附件下载失败");
                    }
                    return;
                }
            }
            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "附件不存在");

        } catch (e) {
            this.getClientConnect();
        }
    },

    //打开附件
    viewFile: function (fileId) {
        try {
            for (var i = 0; i < this.fileView.store.data.items.length; i++) {
                var record = this.fileView.store.getAt(i);
                if (record.get("FileID") == fileId) {
                    var ViewGuid = record.get("ViewGuid");
                    var Name = record.get("Name");
                    var exist = Ext.AppFrame.Attachment.CheckFileExsit(fileId, ViewGuid, record.get("EditGuid"));
                    if (!exist) {
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "附件不存在");
                        return;
                    }
                    var result = Ext.AppFrame.Attachment.ViewFile(fileId, Name, ViewGuid);
                    if (result) {
                        return;
                    }
                }
            }

            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "附件不存在");

        } catch (e) {
            this.getClientConnect();
        }
    },

    //清空数据源
    removeAll: function () {
        if (this.fileView.store && this.fileView.store.getCount() > 0) {
            this.fileView.store.removeAll();
        }
        if (this.deleCallback) {
            //this.deleCallback();
        }
    },

    //加载附件数据(构建store)
    loadData: function (dataStore) {
        if (dataStore) {

            this.store.removeAll();

            for (var i = 0; i < dataStore.length; i++) {
                record = dataStore[i];
                this.store.add(new Ext.AppFrame.Attachment.FileRecord({
                    ID: record.ID,
                    Name: record.Name,
                    FileID: record.FileID,
                    ViewGuid: record.ViewGuid,
                    EditGuid: record.EditGuid,
                    CreateTime: record.CreateTime,
                    FileSize: record.FileSize,
                    DisplayName: record.DisplayName,
                    EditGUID: record.EditGUID,
                    FileFlag: this.readOnly == true ? 'none' : 'block'
                }));
            }
        }
    },

    getClientConnect: function () {
        var ret = GTPFileClient.FileClientConnect(GTPFileClient._fileServerGuid, GTPFileClient._fileServerUrl, "");
        if (!ret) alert("网络连接中断。");
        return ret;
    },

    //提示操作
    showConfirmDialog: function (file) {
        var attachmentPanel = this;
        var fileId = file.name;
        var tempStroe = this.fileView.store.query("FileID", fileId);
        var record = tempStroe.items[0];
        //var msg = res_winDownloadDialog;
        var msg = res_textDownLoadAttachment;
        var buttons = {
            yes: " 打开",
            no: "保存",
            cancel: "取消"
        };
        // if (!this.permission) {
        //     delete buttons.ok;

        // } else {
        //     delete buttons.yes;
        //     msg = res_winEditDialog;
        // }
        var ms = Gtp.net.MessageBox.show({
            title: "文件管理",
            msg: msg,
            buttons: buttons,
            icon: Ext.MessageBox.QUESTION,
            fn: function processResult2(e) {
                if (e == 'yes') {
                    attachmentPanel.viewFile();

                } else if (e == "no") {
                    attachmentPanel.downloadAttach();
                } else if (e == 'ok') {
                    attachmentPanel.editFile(record);

                }
            },
            minWidth: 300
        }, this);
    }

});

//下载附件预览
Ext.AppFrame.FileView = Ext.extend(Ext.DataView, {
    itemSelector: 'li.x-fileview-list-item',
    cls: 'x-fileview-list',
    fileIdField: 'FileID',
    fileNameField: 'Name',
    fileSizeField: 'FileSize',
    userIdField: 'UserID',
    userNameField: 'UserName',
    fileFlagField: 'FileFlag',
    createTimeField: 'CreateTime',
    displayNameField: 'DisplayName',

    autoHeight: true,
    singleSelect: true,
    initComponent: function () {
        if (!this.autoHeight) this.style = 'max-height: 250px;';

        var downloadFile = "Ext.getCmp('" + this.attachmentId + "').downloadAttach({" + this.fileIdField + "});return&nbsp;false;";
        var viewFile = "Ext.getCmp('" + this.attachmentId + "').viewFile({" + this.fileIdField + "});return&nbsp;false;";

        var downloadHtml = '<a href="javascript:void(0)" name="{' + this.fileIdField + '}" onclick ="' + downloadFile + '">下载</a>&nbsp;&nbsp;&nbsp;&nbsp;';
        var openHtml = '<a href="javascript:void(0)" name="{' + this.fileIdField + '}" onclick ="' + viewFile + '">打开</a>&nbsp;&nbsp;&nbsp;&nbsp;';


        var tipHtml = '<p><span class=\'tip-filename\'>文件名:{' + this.fileNameField + '}</span>上传时间:{' + this.createTimeField + '}<p>';
        //TODO: 上传时间是创建时间，应该是更新时间，增加上传人   上传人:{' + this.userNameField + '}<br/>
        if (!this.tpl) {
            this.tpl = new Ext.XTemplate(
                '<div>',
                    '<tpl for="." >',
                        '<div class="x-fileview" ext:qtip="' + tipHtml + '">',
                            '<div id="att{' + this.fileIdField + '}-img" class="x-fileview-img" title=\'{' + this.fileNameField + '}\'></div>',
                            '<div class="x-fileview-text" >',
                                '<div><span id="att{' + this.fileIdField + '}-title" class="x-fileview-title">{' + this.displayNameField + '}<span class="x-fileview-size">({' + this.fileSizeField + '})</span></span></div>',
                                '<div style="line-height:19px;">',
                                    downloadHtml + openHtml,
                                '</div>',
                            '</div>',
                        '</div>',
                    '</tpl>',
                '</div>'
                );
        };
        Ext.AppFrame.FileView.superclass.initComponent.call(this);
    }
});

Ext.namespace("Ext.ux.AppFrameV2.ReportService");
///sender：启动打印的触发控件
///queryPlan：查询方案
///preview：是否打印预览，true为预览，false为直接打印
///reportType：报表类型，List是列表打印，Single为单条记录打印
///extendArr：扩展数据
///reportArgs：报表参数数据组
Ext.ux.AppFrameV2.ReportService.Print = function (sender, entityKeyValue, queryPlan, preview, reportType, extendArr, reportArgs, extendqueryPlans) {
    /// <param name="entityKeyValue" type="String">持久化实体的主键</param>
    /// <param name="queryPlan" type="Array">查询方案数组</param>
    /// <param name="preview" type="Boolean">1、是否是预览 true:预览 false:打印；2、String:显示报表的iframe的名称；3、报表导出文件：1：导出excel，2：导出pdf，3：导出word</param>
    /// <param name="reportArgs" type="Array">报表参数数据组[{key:'aaa',value:'bbb'},{Key:'ccc',Value:'ddd'}]</param>

    //准备打印请求
    var group = !!queryPlan ? queryPlan.queryEntity : "";
    //三个参数。fullcode，类型，扩展数据集合
    var listArgs = new Array();
    listArgs.push($G.getBizComp()); //模块树的fullcode，Ext.net.ResourceMgr.pageNamespace

    if (reportType == "Single") {
        //类型
        listArgs.push("Single"); //报表类型List或者Single
        extendArr = extendArr || [];
        extendArr.push("dept_id=" + Ext.AppFrame.Common.getDeptId());
        if (extendArr) {
            listArgs.push(extendArr); //扩展数据的集合
        }

        var queryPlans = [].concat(queryPlan, extendqueryPlans);
        Gtp.net.Global.showPrintSetting(sender, group, listArgs, entityKeyValue, queryPlans, preview, reportArgs);
    }
    else {
        listArgs.push("List"); //报表类型List或者Single
        extendArr = extendArr || [];
        extendArr.push("dept_id=" + Ext.AppFrame.Common.getDeptId());

        if (extendArr) {
            listArgs.push(extendArr); //扩展数据的集合
        }

        var queryPlans = [].concat(queryPlan, extendqueryPlans);
        Gtp.net.Global.showPrintSetting(sender, group, listArgs, entityKeyValue, queryPlans, preview, reportArgs);
    }
};

Ext.ux.AppFrameV2.ReportService.PrintModelView = function (sender, entityKeyValue, queryPlan, preview, reportType, extendArr, reportArgs, extendqueryPlans, width, height) {
    /// <param name="entityKeyValue" type="String">持久化实体的主键</param>
    /// <param name="queryPlan" type="Array">查询方案数组</param>
    /// <param name="preview" type="Boolean">1、是否是预览 true:预览 false:打印；2、String:显示报表的iframe的名称；3、报表导出文件：1：导出excel，2：导出pdf，3：导出word</param>
    /// <param name="reportArgs" type="Array">报表参数数据组[{key:'aaa',value:'bbb'},{Key:'ccc',Value:'ddd'}]</param>

    //准备打印请求
    var group = !!queryPlan ? queryPlan.queryEntity : "";
    //三个参数。fullcode，类型，扩展数据集合
    var listArgs = new Array();
    listArgs.push($G.getBizComp()); //模块树的fullcode，Ext.net.ResourceMgr.pageNamespace

    var selectReportCallback = function (group, entityKeyValue, queryPlans, preview, reportArgs, width, height) {

        var url = $G.getPageURLByFullName("GTP.AppFrameV2.Report.ReportViewPage");
        var parameters = {
            reportArgs: Gtp.net.Global.ReportMain_ListArgs,
            entityKeyValue: entityKeyValue,
            queryPlans: Gtp.net.Global.ReportMain_QueryPlans,
            reportInnerParam: Gtp.net.Global.ReportMain_ReportArgs
        };
        var features = { resizable: 1, status: 1 };

        if (width) features.dialogWidth = width + "px";
        if (height) dialogHeight = height + "px";

        var data = Gtp.net.Global.open({
            title: "查看报表",
            url: url,
            target: "_modal",
            parameters: parameters,
            features: features
        });

    };

    if (reportType == "Single") {
        //类型
        listArgs.push("Single"); //报表类型List或者Single

        if (extendArr) {
            listArgs.push(extendArr); //扩展数据的集合
        }

        var queryPlans = [].concat(queryPlan, extendqueryPlans);

        var callbackArgs = {
            group: group, entityKeyValue: entityKeyValue, queryPlans: queryPlans, preview: preview, reportArgs: reportArgs, width: width, height: height
        };
        Ext.ux.AppFrameV2.ReportService.ShowPrintSetting(sender, group, listArgs, selectReportCallback, callbackArgs);
    }
    else {
        listArgs.push("List"); //报表类型List或者Single

        if (extendArr) {
            listArgs.push(extendArr); //扩展数据的集合
        }

        var queryPlans = [].concat(queryPlan, extendqueryPlans);

        var callbackArgs = {
            group: group, entityKeyValue: entityKeyValue, queryPlans: queryPlans, preview: preview, reportArgs: reportArgs, width: width, height: height
        };
        Ext.ux.AppFrameV2.ReportService.ShowPrintSetting(sender, group, listArgs, selectReportCallback, callbackArgs);
    }
};

Ext.ux.AppFrameV2.ReportService.PrintWinowView = function (sender, entityKeyValue, queryPlan, preview, reportType, extendArr, reportArgs, extendqueryPlans, width, height) {
    /// <param name="entityKeyValue" type="String">持久化实体的主键</param>
    /// <param name="queryPlan" type="Array">查询方案数组</param>
    /// <param name="preview" type="Boolean">1、是否是预览 true:预览 false:打印；2、String:显示报表的iframe的名称；3、报表导出文件：1：导出excel，2：导出pdf，3：导出word</param>
    /// <param name="reportArgs" type="Array">报表参数数据组[{key:'aaa',value:'bbb'},{Key:'ccc',Value:'ddd'}]</param>

    //准备打印请求
    var group = !!queryPlan ? queryPlan.queryEntity : "";
    //三个参数。fullcode，类型，扩展数据集合
    var listArgs = new Array();
    listArgs.push($G.getBizComp()); //模块树的fullcode，Ext.net.ResourceMgr.pageNamespace

    preview = "__reportView_printIFrame";

    var selectReportCallback = function (group, entityKeyValue, queryPlans, preview, reportArgs, width, height) {

        var reportArgs = Gtp.net.Global.ReportMain_ListArgs;
        var queryPlans = Gtp.net.Global.ReportMain_QueryPlans;
        var reportArgs = Gtp.net.Global.ReportMain_ReportArgs;

        var _reportView = Ext.ux.AppFrameV2.ReportService.GetReportView(group, entityKeyValue, queryPlans, preview, reportArgs, width, height);
        _reportView.show();

    };

    if (reportType == "Single") {
        //类型
        listArgs.push("Single"); //报表类型List或者Single

        if (extendArr) {
            listArgs.push(extendArr); //扩展数据的集合
        }

        var queryPlans = [].concat(queryPlan, extendqueryPlans);

        var callbackArgs = {
            group: group, entityKeyValue: entityKeyValue, queryPlans: queryPlans, preview: preview, reportArgs: reportArgs, width: width, height: height
        };
        Ext.ux.AppFrameV2.ReportService.ShowPrintSetting(sender, group, listArgs, selectReportCallback, callbackArgs);
    }
    else {
        listArgs.push("List"); //报表类型List或者Single

        if (extendArr) {
            listArgs.push(extendArr); //扩展数据的集合
        }

        var queryPlans = [].concat(queryPlan, extendqueryPlans);
        var callbackArgs = {
            group: group, entityKeyValue: entityKeyValue, queryPlans: queryPlans, preview: preview, reportArgs: reportArgs, width: width, height: height
        };
        Ext.ux.AppFrameV2.ReportService.ShowPrintSetting(sender, group, listArgs, selectReportCallback, callbackArgs);
    }
};


Ext.ux.AppFrameV2.ReportService.GetReportView = function (group, entityKeyValue, queryPlans, preview, reportArgs, width, height) {

    var _fn = function (id) {
        var config = {
            reportId: id,
            entityKeyValue: entityKeyValue,
            queryPlans: Gtp.net.Global.ReportMain_QueryPlans,
            preview: preview,
            args: Gtp.net.Global.ReportMain_ReportArgs //,
            //  height: height,
            //  width: width
        };
        Gtp.net.Global.print(config);
    };

    if (preview == null || preview == undefined || Ext.isString(preview)) {
        if (preview == "")
            preview = "__reportView_printIFrame";

        var windowViewName = "_reportView_windowView";

        var windowView = $G.getCmp(windowViewName);
        if (!windowView) {
            windowView = new Ext.Window({
                id: windowViewName,
                maximizable: true,
                hidden: true,
                height: height || 400,
                width: width || 500,
                items: [
                {
                    id: "SelectReportItem",
                    //collapseMode: "mini",
                    height: 32,
                    region: "north",
                    padding: 4,
                    layout: "fit",
                    items: {
                        id: "SelectReportPanel",
                        xtype: "panel",
                        layout: "form",
                        border: false,
                        items: {
                            columnWidth: .3,
                            fieldLabel: '选择报表',
                            labelWidth: 70,
                            xtype: 'combo',
                            mode: 'local',
                            width: 410,
                            autoWidth: true,
                            triggerAction: 'all',
                            valueField: 'reportId',
                            displayField: 'reportName',
                            emptyText: '请选择报表',
                            editable: false,
                            border: false,
                            selectOnFocus: true,
                            //allowBlank: false,
                            name: 'selectReport',
                            id: 'selectReportCombo',
                            listeners: {
                                select: function (a, b, c) {
                                    var reportId = b.data.reportId;
                                    if (!!reportId) {
                                        _fn(reportId);
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: "ReportPanel",
                    xtype: "panel",
                    layout: "fit",
                    region: "center",
                    border: false,
                    autoScroll: true,
                    html: '<div id="frame_Content" class="x-panel-content" style="margin-top: 0px;height:100%; width:100%;"><iframe id="'
                        + preview + '" marginheight="0px" marginwidth="0px" height="100%" name="' + preview + '" frameborder="false" width="100%" ></iframe></div>'//scrolling="no"
                }],
                layout: "border",
                bodyStyle: "background-color: #fff;",
                iconCls: "icon-application",
                padding: 2,
                title: "报表预览",
                modal: true,
                listeners: {
                    show: {
                        fn: function (item) {
                            var r = $G.Page[group];
                            if (!!r && Ext.isArray(r) && r.length > 0) {
                                var reportdata = new Array();
                                for (var i = 0; i < r.length; i++) {
                                    reportdata.push([r[i].ID, r[i].Name]);
                                }

                                var store = new Ext.data.SimpleStore({
                                    fields: ['reportId', 'reportName'],
                                    data: reportdata
                                });

                                var selectReport = $G.getCmp("selectReportCombo");
                                selectReport.store = store;

                                selectReport.selectByIndex(0, true);
                            } else {
                                $G.showInfo("提示", "相应的报表模板停用或者不存在!"); //Ext.Msg.alert("错误", "相应的报表模板停用或者不存在!");
                            }
                        }
                    }
                }
            });
        }
    }
    return windowView;
}

Ext.ux.AppFrameV2.ReportService.ShowPrintSetting = function (sender, group, listArgs, selectReportCallback, callbackArgs) {
    /// <summary>报表打印</summary>
    /// <param name="sender" type="Object"></param>
    /// <param name="group" type="String"></param>
    /// <param name="listArgs" type="Array">查询打印列表需要的参数(可能包含扩展信息)</param>
    /// <param name="queryPlans" type="Array">查询方案数组</param>
    /// <param name="preview" type="Boolean">是否是预览 true:预览 false:打印 String:显示报表的iframe的名称</param>
    /// <param name="reportArgs" type="Array">报表参数（直接通过URL传送给报表）</param>
    /// <returns type=""></returns>
    var _queryReport = function (listArgs, callback) {
        $G.dispatcher({
            controller: "GTP.Report.Facade.Controller",
            action: "GetReportList",
            args: listArgs,
            success: function (result) {
                callback.call(this, result);
            },
            failure: function (cause, statusCode, msg, detailMsg) {
                $G.showInfo("错误", msg, detailMsg);
            }
        });
    };
    group = "_queryReport_" + group;
    callbackArgs.group = group;

    var _exec = function (config) {
        var r = $G.Page[config.group];
        if (!!r && Ext.isArray(r) && r.length > 0) {

            Gtp.net.Global.ReportMain_ListArgs = listArgs;
            Gtp.net.Global.ReportMain_ReportArgs = callbackArgs.reportArgs;
            Gtp.net.Global.ReportMain_QueryPlans = config.queryPlans;

            selectReportCallback(config.group, config.entityKeyValue, config.queryPlans, config.preview, config.reportArgs, config.width, config.height);

        } else {
            $G.showInfo("提示", "相应的报表模板停用或者不存在!"); //Ext.Msg.alert("错误", "相应的报表模板停用或者不存在!");
        }
    };

    if ($G.Page[group] === undefined) {
        _queryReport(listArgs, function (r) {
            $G.Page[group] = r;
            _exec(callbackArgs);
        });
    } else {
        _exec(callbackArgs);
    }
}


Ext.namespace("Ext.ux.AppFrame.NavigateBar");
Ext.ux.AppFrame.initMessageFlag = function () {
    Ext.flag = function () {
        var msgCt;
        function createBox(t, s) {
            t = t || 'green';
            return ['<div class="g-tips-plain g-tips-plain-' + t + '">', s, '</div>'].join('');
        }
        return {
            msg: function (format, type) {
                if (!msgCt) {
                    msgCt = Ext.DomHelper.insertFirst(document.body, { "id": 'msg-box', "class": "msg-box-cls" }, true);
                }
                msgCt.alignTo(document, 't-t');
                var s = String.format.apply(String, Array.prototype.slice.call(arguments, 0));
                var m = Ext.DomHelper.append(msgCt, { html: createBox(type, s) }, true);
                m.slideIn('t').pause(1).ghost("t", { remove: true });
            },
            init: function () {
                var lb = Ext.get('lib-bar');
                if (lb) {
                    lb.show();
                }
            }
        };
    } ();
    Ext.onReady(Ext.flag.init, Ext.flag);
}



Ext.ux.AppFrame.LookupBar = function (config) {
    var default_config = {
        layoutPanel: null,
        entityViewName: "billEntityView"
    };
    config = Ext.applyIf(config || {}, default_config);

    var createBar = function (barconfig) {
        if (barconfig.lookupId && barconfig.refPage) {
            var dconfig = {
                id: "LookupBar_" + barconfig.lookupId,
                header: false,
                collapsible: true,
                floating: true,
                hidden: true,
                //alignTo: 'br-br',
                renderTo: Ext.getBody(),
                width: 50,
                //height: 20,
                border: false,
                refPage: "",
                //ctCls: "back-to",
                html: '<div class="g-tips-plain g-tips-plain-green" style="cursor:pointer;">' + barconfig.title + '</div>'
            }
            barconfig = Ext.applyIf(barconfig || {}, dconfig);
            var bar_panel = new Ext.Panel(barconfig);
            bar_panel.el.dom.onmouseover = showBar;
            bar_panel.el.dom.onmouseout = hideBar;

            bar_panel.el.dom.onclick = Ext.ux.AppFrame.ViewLookup;

            return bar_panel;
        }
    }

    var showBar = function (lookupId) {
        if (!Ext.isString(lookupId)) {
            lookupId = this.id;
        }
        if (lookupId.indexOf("LookupBar_") != 0) {
            lookupId = "LookupBar_" + lookupId
        }
        var lookup = $G.getCmp(lookupId.replace("LookupBar_", ""));
        if (lookup.value) {
            var bar_panel = $G.getCmp(lookupId);
            bar_panel.setPosition(bar_panel.getEl().getAlignToXY(lookupId.replace("LookupBar_", ""), 'br-br', [-1, 0]));
            bar_panel.show();
        }

    };
    var hideBar = function (lookupId) {
        if (!Ext.isString(lookupId)) {
            lookupId = this.id;
        }
        if (lookupId.indexOf("LookupBar_") != 0) {
            lookupId = "LookupBar_" + lookupId
        }
        $G.getCmp(lookupId).hide();
    };

    if (config.entityViewName) {
        var entityView = $G.getCmp(config.entityViewName);
        var form = entityView.getForm();
        form.items.each(function (f) {
            if (f.xtype == "lookupfield") {
                createBar({ lookupId: f.id, title: "查看详细", refPage: f.refPage });
                document.getElementById(f.id).onmouseover = showBar;
                document.getElementById(f.id).onmouseout = hideBar;
                document.getElementById(f.id).onfocus = showBar;
            }
        });
    }

}

Ext.ux.AppFrame.ViewLookup = function () {
    if (this.id.indexOf("LookupBar_") == 0) {
        lookupId = this.id.replace("LookupBar_", "");
        var bar_panel = $G.getCmp(lookupId);
        var parameters;
        for (var i = 0; i < bar_panel.inputMappings.length; i++) {
            if ((bar_panel.inputMappings[i].source.indexOf("OutEntity.ID") == 0) && bar_panel.inputMappings[i].target) {
                var source = bar_panel.getDataSource();
                var targetid = source.getFieldValue(bar_panel.inputMappings[i].target);
                parameters = { targettype: "view", targetid: targetid };
                break;
            }
        }
        if (parameters) {
            var data = Gtp.net.Global.open({
                title: "查看" + bar_panel.fieldLabel,
                url: bar_panel.refPage,
                target: "_extwin",
                parameters: parameters,
                features: { dialogWidth: "400px", dialogHeight: "310px" }
            });
        }
    }
}



Ext.ux.AppFrame.NavigateBar = function (config) {

    var default_config = {
        layoutPanel: null,
        entityViewName: "billEntityView"
    };

    config = Ext.applyIf(config || {}, default_config);
    //构造锚点信息
    getAnchorArray = function () {
        var anchor = new Array();

        var genChildMenu = function (gtppanel, anchor) {
            if ($G.getCmp(gtppanel.id).hidden == false) {
                //push 第一层菜单
                anchor.push([1, gtppanel.title, "#" + gtppanel.id]);
                for (var j = 0; j < gtppanel.items.length; j++) {
                    if (gtppanel.items[j].xtype == "fieldset") {
                        if (gtppanel.items[j].title && gtppanel.items[j].id)
                            anchor.push([2, gtppanel.items[j].title, "#" + gtppanel.items[j].id]);
                    }
                }
            }
        };
        var getPanel = function (panel, anchor) {
            if (panel.xtype == "gtpformpanel" || panel.xtype == "tabpanel") {
                //push 第一层菜单
                genChildMenu(panel, anchor);
            }
            else if (panel.xtype == "gtptreegridpanel" || panel.xtype == "gtpgridpanel" || panel.xtype == "multigroupingpanel") {
                genChildMenu(panel, anchor);
            }
            else if (panel.xtype == "fieldset") {
                genChildMenu(panel, anchor);
            }
            else if (panel.xtype == undefined && $G.getCmp(panel.id).getXType() == "panel" && (panel.id.indexOf("layoutPanel") == 0 || panel.id == "detialTabView")) {
                if (panel.id == "detialTabView") {
                    genChildMenu(panel, anchor);
                }
                else {
                    for (var i = 0; i < panel.items.length; i++) {
                        getPanel(panel.items[i], anchor);
                    }
                }
            }
        };
        if ($G.getCmp("viewport") && $G.getCmp("viewport").getXType() == "viewport") {
            var viewport = $G.getCmp("viewport");
            var viewcenter = $G.getCmp("viewport").layout.center;
            //遍历布局中心区域的控件
            for (var i = 0; i < viewcenter.items.length; i++) {
                var gtppanel = viewcenter.items[i];
                if (gtppanel.xtype == "gtpformpanel" || gtppanel.xtype == "tabpanel") {
                    //push 第一层菜单
                    genChildMenu(gtppanel, anchor);
                }
                else if (gtppanel.xtype == "gtptreegridpanel" || gtppanel.xtype == "gtpgridpanel" || gtppanel.xtype == "multigroupingpanel") {
                    genChildMenu(gtppanel, anchor);
                }
                else if (gtppanel.xtype == undefined && $G.getCmp(gtppanel.id).getXType() == "panel") {
                    getPanel(gtppanel, anchor);
                }
            }
        }

        return anchor;
    };
    //构造导航条Html
    createNavTreeHTML = function () {
        ///<summary>构造导航</summary>
        var firt = "◎";
        var secord = "■";
        var third = "·";
        var anchor = getAnchorArray();
        var html = "";
        if (Ext.isArray(anchor) && anchor.length > 0) {
            html += '<table>';
            for (var i = 0; i < anchor.length; i++) {
                if (Ext.isArray(anchor[i]) && anchor[i].length == 3) {
                    html += '<tr><td>';
                    html += '<p style="text-align: left; line-height: 28px;">'
                        + '<span style="color: #999999; font-family: 宋体; font-size: 12px; font-style: normal; font-weight: normal; text-decoration: none;">';
                    j = anchor[i][0];
                    while (j > 1) {
                        html += "&nbsp;&nbsp;";
                        j--;
                    }
                    html += (anchor[i][0] == 1 ? firt : (anchor[i][0] == 2 ? secord : third));
                    html += '</span>'
                        + '<a href="' + anchor[i][2] + '">'
                        + '<span style="color: #0066cc; font-family: 宋体; font-size: 12px; font-style: normal; font-weight: normal; text-decoration: none;">' + anchor[i][1] + '</span>'
                        + '</a></p>'
                        + '</td></tr>';
                }
            }
            html += '</table>';
        }
        return html;
    };

    showNavBar = function (nav, button, tree) {
        var bnav = $G.getCmp(nav);

        var bbutton = $G.getCmp(button);
        bbutton.setVisible(false);
        var btree = $G.getCmp(tree);
        btree.setVisible(true);

        bnav.setSize(160, 300);
        var pos = bnav.getPosition();
        pos[0] = pos[0] - 130;
        pos[1] = pos[1] - 200;
        bnav.setPosition(pos);
    };
    closeNavBar = function (nav, button, tree) {
        var bnav = $G.getCmp(nav);

        var bbutton = $G.getCmp(button);
        bbutton.setVisible(true);
        var btree = $G.getCmp(tree);
        btree.setVisible(false);

        bnav.setSize(30, 100);
        var pos = bnav.getPosition();
        pos[0] = pos[0] + 130;
        pos[1] = pos[1] + 200;
        bnav.setPosition(pos);
    };
    scrollNavBar = function (panel, lastOrNext) {
        var panel = $G.getCmp(panel);
        if (lastOrNext == "last") {
            var d = panel.body.dom;
            d.scrollTop = 0;
        }
        else if (lastOrNext == "next") {
            var d = panel.body.dom;
            d.scrollTop = d.scrollHeight - d.offsetHeight;

        }
    };


    //创建定位到顶端的Panel
    var top_panel = new Ext.Panel({
        id: "toolBackTop",
        header: false,
        collapsible: true,
        floating: true,
        hidden: true,
        alignTo: 'br-br',
        renderTo: Ext.getBody(),
        width: 50,
        height: 50,
        border: false,
        ctCls: "back-to",
        html: '<a title="返回顶部" href="#billEntityView" class="back-top"></a>'
    });
    //创建导航条Panel
    var nav_panel = new Ext.Panel({
        id: "toolBarNav",
        header: false,
        collapsible: true,
        floating: true,
        hidden: true,
        alignTo: 'br-br',
        renderTo: Ext.getBody(),
        width: 30,
        height: 100,
        border: false,
        layout: 'fit',
        items: [{
            id: "panel1",
            xtype: "panel",
            layout: "fit",
            border: true,
            autoScroll: true,
            ctCls: "bar-nav",
            html: '<div onclick="showNavBar(\'toolBarNav\',\'panel1\',\'panel2\'); return false;"><p style="text-align:center;"><span style="font-family:宋体;font-size:16px;font-size:; font-weight:normal;font-style:normal;text-decoration:none;color:#333333;">快速搜索</span></p>'
                + '<p style="text-align:center;"><span style="font-family:宋体;font-size:16px;font-weight:bold;font-style:normal;text-decoration:none;color:#0066CC;">&lt;&lt;</span></p></div>'
        }, {
            id: "panel2",
            xtype: "panel",
            hidden: true,
            width: 160,
            height: 300,
            layout: "border",
            autoScroll: true,
            items: [{
                id: "panel2_West",
                width: 10,
                height: 300,
                layout: "fit",
                region: "west",
                border: false,
                html: '<div onclick="closeNavBar(\'toolBarNav\',\'panel1\',\'panel2\')" class="bar-close">'
                            + '<div style="top:32px;position:absolute;"><span style="color: #0066cc; font-family: 宋体; font-size: 16px; font-style: normal; font-weight: normal; text-decoration: none;">&nbsp;&gt;'
                            + '</span></div></div>'
            }, {
                id: "panel2_North",
                width: 140,
                height: 10,
                layout: "fit",
                region: "north",
                border: false,
                html: '<div onclick="scrollNavBar(\'panel2_Center\',\'last\')" class="bar-top">'
                            + '<div style="left:80px;top:3px;position:absolute;"><span style="color: #0066cc; font-family: 宋体; font-size: 10px; font-style: normal; font-weight: bold; text-decoration: none;">▲'
                            + '</span></div></div>'
            }, {
                id: "panel2_Center",
                width: 150,
                height: 280,
                layout: "fit",
                region: "center",
                border: false,
                autoScroll: true,
                html: '<div>' + createNavTreeHTML() + '</div>'
            }, {
                id: "panel2_South",
                width: 140,
                height: 11,
                layout: "fit",
                region: "south",
                border: false,
                html: '<div onclick="scrollNavBar(\'panel2_Center\',\'next\')" class="bar-bottom">'
                            + '<div style="left:80px;top:4px;position:absolute;"><span style="color: #0066cc; font-family: 宋体; font-size: 11px; font-style: normal; font-weight: bold; text-decoration: none;">▼'
                            + '</span></div></div>'
            }]
        }]
    });

    top_panel.getEl().anchorTo(Ext.getBody(), 'br-br', [-25, 0], true);

    nav_panel.getEl().anchorTo(Ext.getBody(), 'br-br', [-25, -60], true);

    var layoutPanel = config.layoutPanel ? $G.getCmp(config.layoutPanel) : $G.getCmp(config.entityViewName).ownerCt;

    if (layoutPanel.body.dom.scrollHeight != layoutPanel.body.dom.offsetHeight) {
        //top_panel.show(); //初始BackTopPanel不显示
        nav_panel.show();
    }
    else {
        top_panel.hide();
        nav_panel.hide();
    }

    var dv = Ext.get(layoutPanel.body.dom.id);
    dv.on('scroll', function (e, div, arg) {
        var top_panel = $G.getCmp("toolBackTop");
        if (div.scrollHeight != div.offsetHeight && div.scrollTop > 0) {
            top_panel.el.alignTo(Ext.getBody(), 'br-br', [-25, 0]);
            top_panel.show();
        }
        else {
            top_panel.hide();
        }
    });

    dv.on('resize', function () {
        var top_panel = $G.getCmp("toolBackTop");
        var nav_panel = $G.getCmp("toolBarNav");
        if (this.body.dom.scrollHeight != this.body.dom.offsetHeight) {
            nav_panel.show();
            if (this.body.dom.scrollTop > 0) {
                top_panel.show();
            }
            else {
                top_panel.hide();
            }
        }
        else {
            nav_panel.hide();
            top_panel.hide();
        }
    });

    layoutPanel.on("resize", function () {
        var top_panel = $G.getCmp("toolBackTop");
        var nav_panel = $G.getCmp("toolBarNav");
        if (this.body.dom.scrollHeight != this.body.dom.offsetHeight) {
            nav_panel.show();
            if (this.body.dom.scrollTop > 0) {
                top_panel.show();
            }
            else {
                top_panel.hide();
            }
        }
        else {
            nav_panel.hide();
            top_panel.hide();
        }
    });

    /////////////////////////////////////请注意，11月7日修改如下，页面修改流式布局后，原方式不行，下面是按照流式布局做的修改，依然不行/////////////////////
    //    var layoutPanel;
    //    var bodyDom;

    //    if (config.layoutPanel && $G.getCmp(config.layoutPanel)) {
    //        layoutPanel = $G.getCmp(config.layoutPanel);
    //        bodyDom = layoutPanel.body.dom;
    //    }
    //    else if (config.entityViewName && $G.getCmp(config.entityViewName)) {
    //        if ($G.getCmp(config.entityViewName).ownerCt) {
    //            layoutPanel = $G.getCmp(config.entityViewName).ownerCt; //非流式布局
    //            bodyDom = layoutPanel.body.dom;
    //        }
    //        else {
    //            var func = function (panelDom) {
    //                if (panelDom && panelDom.nodeName == "DIV" && panelDom.localName == "div") {
    //                    return func(panelDom.parentNode);
    //                }
    //                else if (panelDom && panelDom.nodeName == "BODY" && panelDom.localName == "body") {
    //                    return func(panelDom.parentNode);
    //                }
    //                else if (panelDom && panelDom.nodeName == "HTML" && panelDom.localName == "html") {
    //                    return panelDom;
    //                }
    //            };

    //            var panelDom = $G.getCmp(config.entityViewName).el.dom;
    //            layoutPanel = func(panelDom);
    //            bodyDom = Ext.get(layoutPanel.id);
    //        }
    //    }

    //    if (bodyDom && bodyDom.dom.scrollHeight != bodyDom.dom.offsetHeight) {
    //        //top_panel.show(); //初始BackTopPanel不显示
    //        nav_panel.show();
    //    }
    //    else {
    //        top_panel.hide();
    //        nav_panel.hide();
    //    }

    //    var dv = Ext.get(bodyDom.dom.id);
    //    dv.on('scroll', function (e, div, arg) {
    //        var top_panel = $G.getCmp("toolBackTop");
    //        if (div.scrollHeight != div.offsetHeight && div.scrollTop > 0) {
    //            top_panel.el.alignTo(Ext.getBody(), 'br-br', [-25, 0]);
    //            top_panel.show();
    //        }
    //        else {
    //            top_panel.hide();
    //        }
    //    });

    //    dv.on("resize", function () {
    //        var top_panel = $G.getCmp("toolBackTop");
    //        var nav_panel = $G.getCmp("toolBarNav");
    //        if (bodyDom.scrollHeight != bodyDom.offsetHeight) {
    //            nav_panel.show();
    //            if (bodyDom.scrollTop > 0) {
    //                top_panel.show();
    //            }
    //            else {
    //                top_panel.hide();
    //            }
    //        }
    //        else {
    //            nav_panel.hide();
    //            top_panel.hide();
    //        }
    //    });



}

//快速参照
Ext.override(Ext.ux.form.LookupField, {

    quickLookupInputEntity: null,
    tpl_8more: null,
    tpl_8less: null,

    listViewColumn: null,

    initComponent: function () {
        Ext.ux.form.LookupField.superclass.initComponent.call(this);

        //添加改变文本事件，可监听该事件自行校验输入值
        this.addEvents('textchange', 'beforelookup', 'afterlookup', 'beforedelete', 'afterdelete');


        this.on('specialkey', this.onSpecialKey, this);

        if (this.inputMappings) {
            for (var i = 0; i < this.inputMappings.length; i++) {
                var item = this.inputMappings[i];
                if (item.isCollection === true) {
                    this.multiSelect = true;
                    break;
                }
            }
        }

        this.listViewColumn = [{ field: "Code", alias: "编码", percentage: 50 }, { field: "Name", alias: "名称", percentage: 50}];
    },
    //构造8条以下数据的模板
    genTemplate_8less: function () {
        if (!this.tpl_8less) {
            var columnHTML = '';
            var columnHeaderHTML = '';
            var col_length = this.listViewColumn.length;
            var col_width = 100 / col_length;
            for (var i = 0; i < col_length; i++) {
                var item = this.listViewColumn[i];
                columnHeaderHTML += '<td style="width:' + (item.percentage ? item.percentage : col_width) + '%">' + item.alias + '</td>';
                columnHTML += '<td style="width:' + (item.percentage ? item.percentage : col_width) + '%">{' + item.field + '}</td>';
            }

            tpl_8less = new Ext.XTemplate('<table style="font-size:10pt;width:100%;font-weight: bolder;"><tr>' + columnHeaderHTML + '</tr></table>',
                            '<tpl for="."><div class="x-combo-list-item"><table class="x-list-item-constainer">',
                            '<tr>' + columnHTML + '</tr>',
                            '</table></div></tpl>');

        }
        return tpl_8less;
    },
    //构造8条以上数据的模板
    genTemplate_8more: function () {
        if (!this.tpl_8more) {
            var columnHTML = '';
            var columnHeaderHTML = '';
            var col_length = this.listViewColumn.length;
            var col_width = 100 / col_length;
            for (var i = 0; i < col_length; i++) {
                var item = this.listViewColumn[i];
                columnHeaderHTML += '<td style="width:' + col_width + '%">' + item.alias + '</td>';
                columnHTML += '<td style="width:' + col_width + '%">{' + item.field + '}</td>';
            }

            tpl_8more = new Ext.XTemplate('<table style="font-size:10pt;width:100%;font-weight: bolder;"><tr>' + columnHeaderHTML + '</tr></table>',
                            '<tpl for="."><div class="x-combo-list-item"><table class="x-list-item-constainer">',
                            '<tr>' + columnHTML + '</tr>',
                            '</table></div></tpl>',
                            '<div class="x-combo-list-item" style="color:blue;font-size:10pt;">更多...</div>');
        }
        return tpl_8more;
    },

    initEvents: function () {
        Ext.ux.form.LookupField.superclass.initEvents.call(this);

        this.keyNav = new Ext.KeyNav(this.el, {
            "up": function (e) {
                if (this.isExpanded()) {
                    this.inKeyMode = true;
                    this.selectPrev();
                } else {
                    this.expand();
                }
                if (Ext.EventObject.browserEvent.stopImmediatePropagation) {
                    Ext.EventObject.browserEvent.stopImmediatePropagation();
                }
                Ext.EventObject.stopEvent();
            },

            "down": function (e) {
                if (this.isExpanded()) {
                    this.inKeyMode = true;
                    this.selectNext();
                } else {
                    this.expand();
                }
                if (Ext.EventObject.browserEvent.stopImmediatePropagation) {
                    Ext.EventObject.browserEvent.stopImmediatePropagation();
                }
                Ext.EventObject.stopEvent();
            },
            "esc": function (e) {
                this.collapse();

            },

            scope: this,

            doRelay: function (foo, bar, hname) {

                if (hname == 'down' || this.scope.isExpanded()) {

                    return Ext.KeyNav.prototype.doRelay.apply(this, arguments);

                }

                return true;

            },

            forceKeyDown: true
        });

        //add 添加参照框的输入事件，IE9以上是oninput，IE9以下时onpropertychange
        if (this.itemCt && this.itemCt.dom) {
            this.itemCt.dom.oninput = function (e, a) {
                var me = $G.getCmp(e.srcElement.id);
                if (e.target.value) {
                    me.execMatch(e.target.value, true);
                }
                else if (me.isExpanded()) {
                    me.collapse();
                }
            };
        }
        else if (this.el && this.el.dom) {
            this.el.dom.oninput = function (e, a) {
                var me = $G.getCmp(e.srcElement.id);
                if (e.target.value) {
                    me.execMatch(e.target.value, true);
                }
                else if (me.isExpanded()) {
                    me.collapse();
                }
            };
        }
        //        this.itemCt.dom.onpropertychange = function (e, a) {
        //            var me = $G.getCmp(e.srcElement.id);
        //            if (e.target.value) {
        //                me.execMatch(e.target.value, true);
        //            }
        //            else if (me.isExpanded()) {
        //                me.collapse();
        //            }
        //        }
    },
    //add 快速选择，回车或者点击记录
    quickSelectRecord: function () {
        if (this.matchInput) {
            var index = this.view.getSelectedIndexes()[0];
            var selectedRecord = this.view.getSelectedRecords();

            if (selectedRecord && selectedRecord.length == 1) {
                if (selectedRecord[0] && selectedRecord[0].data) {
                    var data = {
                        OutEntity: selectedRecord[0].data,
                        retViaGPTUIParam: 1,
                        state: true
                    };
                    this.trigger2ClickCallBack(data);
                    //隐藏下拉视图
                    this.collapse();
                }
                else {
                    //隐藏下拉视图
                    this.collapse();
                    this.onTrigger2Click();
                }
            }
        }
    },

    onSpecialKey: function (f, e) {
        if (e.getKey() == e.ENTER && this.multiSelect == false && e.browserEvent._stop !== true) {
            e.browserEvent._stop = true;
            if (!this.isExpanded()) {//切换显示状态
                if (e.target.value) {
                    f.execMatch(e.target.value);
                } else {
                    f.afterExecMatch(null);
                }
            }
            else {
                this.quickSelectRecord.call(this);
            }
            if (Ext.EventObject.browserEvent.stopImmediatePropagation) {
                Ext.EventObject.browserEvent.stopImmediatePropagation();
            }
            Ext.EventObject.stopEvent();
        } else if (e.getKey() == e.DELETE || e.getKey() == e.BACKSPACE) {
            if (e.target.value.length <= 1) {
                f.onTrigger1Click();
            }
        }
        return false;
    },

    afterExecMatch2: function (matchResult, notAutoMatching, NotOpenLookupPage) {

        //当匹配参数为空或没有匹配成员直接弹出参照
        //update gaohy 
        //1、如果没有匹配成员，并且不自动匹配（参照框输入字符时），收缩下拉视图；
        //2、没有匹配成员，并且自动匹配（输入内容按回车），弹出参照框。
        if (!matchResult) {
            if (!NotOpenLookupPage) {
                if (!notAutoMatching)
                    this.onTrigger2Click();
                else {
                    //隐藏下拉视图
                    if (this.isExpanded())
                        this.collapse();
                }
            }
            return;
        }

        if (matchResult.Entities.length == 1 && !notAutoMatching) {

            var entityName;

            if (this.inputMappings.length > 0) {

                entityName = this.inputMappings[0].source.split('.')[0];

            } else {
                entityName = "data";
            }

            var data = {};
            data[entityName] = matchResult.Entities[0];
            this.setInputData(data);

            if (this.el.dom.value !== this.getValue()) {
                this.el.dom.value = this.getValue();
            }
            //update 隐藏下拉视图
            if (this.isExpanded())
                this.collapse();
        } else {

            var fields = new Array();
            //遍历属性
            for (var item in matchResult.Entities[0]) {
                if (typeof matchResult.Entities[0][item] != 'function') {
                    fields.push(item);
                }
            }

            var storeValue = new Array();
            for (var i = 0; i < matchResult.Entities.length; i++) {
                var items = new Array();
                for (var j = 0; j < fields.length; j++) {
                    items.push(matchResult.Entities[i][fields[j]]);
                }
                storeValue.push(items);
            }

            this.store = new Ext.data.SimpleStore({ fields: fields, data: storeValue });


            this.initQuickList();
            this.syncListWidth();
        }
    },

    execMatch: function (val, notAutoMatching) {
        //触发文本改变事件 
        var r = this.fireEvent('textchange', this);

        //当返回非false值继续执行默认校验
        if (r !== false && this.matchInput == true) {
            var controller = this.refPage.replace(/\/\w*(.aspx)$/gi, '').replace(/\//g, '.').replace(/^(\.){1}/, ''), outputData = this.getOutputData()
                    , outputs = [['matchValue', val]], me = this;
            for (var i in outputData) {
                outputs.push([i, outputData[i]]);
            }

            $G.dispatcher({
                controller: controller,
                action: 'MatchLookupField',
                args: [outputs],
                async: false,
                success: function (data) {
                    me.afterExecMatch2(data, notAutoMatching);
                },
                failure: function () {
                    me.afterExecMatch2(null, notAutoMatching);
                }
            });
            controller = '';
        }
    },

    expand: function () {
        if (this.matchInput) {
            //update 下拉视图已经展开，也要执行下面操作，因为数据源已经更改，click事件需要重新加载，视图高度有可能变化
            if (this.list) {
                this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
                this.restrictHeight();
                // zindex can change, re-check it and set it if necessary
                this.list.setZIndex(this.getZIndex());
                this.list.show();
                if (Ext.isGecko2) {
                    this.innerList.setOverflow('auto'); // necessary for FF 2.0/Mac
                }

                Ext.getDoc().on('mousewheel', this.collapseIf, this);

                Ext.getDoc().on('mousedown', this.collapseIf, this);

                this.list.select('div.x-combo-list-item').each(function (item) {
                    item.removeAllListeners();
                    item.on('click', function () {//点击删除按钮，删除已选择项
                        this.quickSelectRecord.call(this);
                    }, this);
                }, this);

                if (this.isExpanded()) {
                    return;
                }

                this.fireEvent('expand', this);
            }
        } else {
            if (this.isExpanded() || !this.displayValues) {
                return;
            }

            this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
            this.restrictHeight();
            // zindex can change, re-check it and set it if necessary
            this.list.setZIndex(this.getZIndex());
            this.list.show();
            if (Ext.isGecko2) {
                this.innerList.setOverflow('auto'); // necessary for FF 2.0/Mac
            }

            Ext.getDoc().on('mousewheel', this.collapseIf, this);

            Ext.getDoc().on('mousedown', this.collapseIf, this);

            this.list.select('div.x-lookup-remove').each(function (item) {
                item.removeAllListeners();
                item.on('click', function () {//点击删除按钮，删除已选择项
                    var index = this.view.getSelectedIndexes()[0];

                    if (this.fireEvent('beforedelete', index) !== false) {
                        //                    var dsName = this.getDataSource(), keyValues, displayValues;
                        //                    ds = Gtp.net.Global.DataContext.getDataSource(dsName);
                        var arr, s = this.view.store;
                        var item, vals, targetField;
                        if (this.ownerType != 'gtpquerypanel') {
                            if (this.dataSource) {//获取键值
                                // keyValues = this.dataSource.getFieldValue(this.keyField);
                                // displayValues = this.dataSource.getFieldValue(this.displayField);

                                for (var i = 0; i < this.inputMappings.length; i++) {
                                    item = this.inputMappings[i];

                                    if (item.isCollection) {
                                        targetField = this.dataSource.getField(item.target);

                                        if (!targetField) {
                                            Gtp.net.MessageBox.exception(String.format(Gtp.net.Global._notFoundField, '', ''), String.format(Gtp.net.Global._notFoundField, '【' + this.dataSource.name + '】', '【' + item.target + '】'));
                                            continue;
                                        }

                                        vals = targetField.getValue();

                                        if (vals) {
                                            arr = vals.toString().split(',');
                                            arr.splice(index, 1);
                                            vals = arr.join(',');
                                            this.dataSource.setFieldValue(item.target, vals);
                                        }
                                    }
                                }
                            }
                        } else {
                            var queryPanel = this.getViewObject();
                            var queryPlan = queryPanel ? queryPanel.queryPlan : null;
                            var valName = '[DisplayValue]', filter;

                            if (queryPlan) {
                                for (var i = 0; i < this.inputMappings.length; i++) {
                                    item = this.inputMappings[i];

                                    if (item.target != valName) {
                                        if (item.isCollection) {
                                            filter = queryPlan.getFilterAll(item.target);
                                            if (!filter) {
                                                Gtp.net.MessageBox.exception(String.format(Gtp.net.Global._notFoundFilter, '', ''), String.format(Gtp.net.Global._notFoundFilter, '【' + queryPlan.name + '】', '【' + item.target + '】'));
                                                continue;
                                            }

                                            vals = $G.clone(queryPlan.getFilterValue(item.target));

                                            if (vals) {
                                                if (Ext.isObject(vals)) {
                                                    if (vals.Id) {
                                                        arr = vals.Id.split(',');
                                                        arr.splice(index, 1);
                                                        vals.Id = arr.join(',');
                                                    }

                                                    if (vals.Name) {
                                                        arr = vals.Name.split(',');
                                                        arr.splice(index, 1);
                                                        vals.Name = arr.join(',');
                                                    }
                                                } else {
                                                    arr = vals.split(',');
                                                    arr.splice(index, 1);
                                                    vals = arr.join(',');
                                                }

                                                queryPlan.setFilterValue(item.target, vals);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        s.removeAt(index);
                        this.list.beginUpdate();
                        var len = s.getCount();
                        if (len > 1) {
                            var height = this.list.getHeight();
                            var itemHeight = height / (len + 1);
                            this.list.setHeight(height - itemHeight);

                        }
                        else if (len == 1) {
                            this.list.setHeight(25);
                        } else {
                            this.collapse();
                        }
                        this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
                        this.list.endUpdate();

                        this.fireEvent('afterdelete', index);
                    }

                }, this);
            }, this);

            //            var btnClose = this.list.child('div.x-tool-close').dom;
            //            //btnClose.on('click', this.collapseIf, this);
            //            if (btnClose.attachEvent) {
            //                btnClose.attachEvent('onclick', this.collapse.createDelegate(this));
            //            }
            //            else {
            //                btnClose.addEventListener('click', this.collapse.createDelegate(this), false);
            //            }

            //Ext.get(this.list.child('div.x-tool-close')).on('click', this.collapseIf, this);
            this.fireEvent('expand', this);
        }
    },



    //add --add quick Choose List
    initQuickList: function () {
        if (!this.list) {
            var cls = 'x-combo-list',
                        listParent = Ext.getDom(this.getListParent() || Ext.getBody());

            this.list = new Ext.Layer({
                parentEl: listParent,
                shadow: this.shadow,
                cls: [cls, this.listClass].join(' '),
                constrain: false,
                zindex: this.getZIndex(listParent)
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setSize(lw, 0);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;
            if (this.syncFont !== false) {
                this.list.setStyle('font-size', this.el.getStyle('font-size'));
            }
            if (this.title) {
                this.header = this.list.createChild({ cls: cls + '-hd', html: this.title });
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({ cls: cls + '-inner' });
            this.mon(this.innerList, 'mouseover', this.onViewOver, this);
            this.mon(this.innerList, 'mousemove', this.onViewMove, this);

            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            if (this.pageSize) {
                this.footer = this.list.createChild({ cls: cls + '-ft' });
                this.pageTb = new Ext.PagingToolbar({
                    store: this.store,
                    pageSize: this.pageSize,
                    renderTo: this.footer
                });
                this.assetHeight += this.footer.getHeight();
            }

            if (this.store) {
                if (this.store.data.length > 8) {
                    while (this.store.data.length > 8)
                        this.store.data.removeAt(8);
                    this.tpl = this.genTemplate_8more();
                }
                else {
                    this.tpl = this.genTemplate_8less();
                }
            }

            /**
            * 构造下拉列表视图
            * @type Ext.DataView
            */
            this.view = new Ext.DataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item',
                emptyText: this.listEmptyText,
                deferEmptyText: false
            });

            if (this.resizable) {
                this.resizer = new Ext.Resizable(this.list, {
                    pinned: true, handles: 'se'
                });
                this.mon(this.resizer, 'resize', function (r, w, h) {
                    this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);

                this[this.pageSize ? 'footer' : 'innerList'].setStyle('margin-bottom', this.handleHeight + 'px');
            }
        }
        else {
            if (this.store) {
                if (this.store.data.length > 8) {
                    while (this.store.data.length > 8)
                        this.store.data.removeAt(8);
                    this.tpl = this.genTemplate_8more();
                }
                else {
                    this.tpl = this.genTemplate_8less();
                }
            }
            this.view.tpl = this.tpl;
        }

        this.view.bindStore(this.store);
        this.select(0);

        //if (!this.isExpanded()) {//切换显示状态
        this.expand();
        //}
    }
});


//实例代码：添加代码审批中，点击发送，弹出confirm提示框，判断是继续执行发送。
//Page_documentReady=function(){ 
//  Ext.ux.AppFrame.WorkFlowEx.initBeforeAdvance(_this.beforeAdvance);  
//  base.Page_documentReady()
//);
//beforeAdvance: function (taskIDList, button) {
//  if(num>0){ 
//      Gtp.net.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, "超部位提醒,确定继续么?", function (e) {
//		    if (e == "yes") {
//			    Ext.ux.AppFrame.WorkFlowEx.goProcessing(button)
//		    }
//	    });
//  }
//  else{
//     return taskIDList;
//  }
//},
Ext.namespace("Ext.ux.AppFrame.WorkFlowEx");
Ext.ux.AppFrame.WorkFlowEx.initBeforeAdvance = function (customBeforeAdvanceFunc, afterSave) {
    if (Ext.ux.AppFrame.WorkFlowEx.isInFlowProcessing()) {
        /*动态加载*/
        var loadjsFiles = [];
        loadjsFiles.push($G.getAppName() + "/Workflow/js/GTPLibrary.js");
        loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.api.keepCompatible.js");
        loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.api.services.js");
        loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.actExecute.js");
        loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.keepCompatible.js");
        loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.taskControlValid.js");
        loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.taskAction.js");
        loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.taskControl.js");
        var jsFileList = Ext.AppFrame.Util.CheckJS(loadjsFiles);
        Ext.AppFrame.Util.LoadJS(jsFileList);

        $G.Page.__workflow_before_advance = 1; //值>1表示已注册流程发送前事件，奇数表示执行发送前事件，偶数表示不执行发送前事件

        Ext.ux.AppFrame.WorkFlowEx.agentBeforeAdvance(customBeforeAdvanceFunc, afterSave);
    }
};

//添加BeforeAdvance代理函数
Ext.ux.AppFrame.WorkFlowEx.agentBeforeAdvance = function (customBeforeAdvanceFunc, afterSave) {
    //在流程中调用的..
    if (Ext.ux.AppFrame.WorkFlowEx.isInFlowProcessing()) {
        if ($G.Page.__workflow_before_advance == 1) {
            if (parent && customBeforeAdvanceFunc) {
                $G.Page.__workflow_oldfunc_before_advance = parent.GTPWorkflowEvent_beforeAdvance;

                var agentFunc = function (taskIDList, button) {
                    if ($G.Page.__workflow_before_advance % 2 == 1) {
                        var idlist;
                        if (!!$G.Page.__workflow_oldfunc_before_advance) {
                            idlist = $G.Page.__workflow_oldfunc_before_advance.apply(this, arguments); //如果验证通过需要然会这个
                        }
                        if (!!idlist)
                            return customBeforeAdvanceFunc.apply(this, arguments);
                    }
                    return taskIDList;
                };

                parent.GTPWorkflowEvent_beforeAdvance = agentFunc; //发送
            }
        }
    }
};

//流程模板的函数actAdvanceExecute不能使用，所以定义此函数。弹出提示框后，点击【确定】想要继续执行流程，使用此函数
Ext.ux.AppFrame.WorkFlowEx.goProcessing = function (button, e, bDirect) {
    //变量__workflow_before_advance递增，否则会再次执行beforeAdvance事件
    $G.Page.__workflow_before_advance++;

    button.oldAction = button.action;
    button.action = "advance";
    if (button.scope)
        button.scope.action = "advance";
    if (Ext.ux.AppFrame.WorkFlowEx.convertToTaskAction(button)) return;
    if (!!parent && !!parent.$WorkFlow && !!parent.$WorkFlow.Action)
        parent.$WorkFlow.Action.doAdvance(bDirect ? false : button.dialog, button.scope.taskIDs[0], button.scope.remark, button.scope.result, button.scope.taskControl, button.scope.afterExecutes, button.scope.aeArgs, button.scope.beforeQuerys, button.scope.bqArgs, button.scope.beforeExecutes, button.scope.beArgs, button.scope.afterQuerys, button.scope.aqArgs);
    button.action = button.oldAction;
};

//流程模板的函数convertToTaskAction不能使用，所以定义此函数。
Ext.ux.AppFrame.WorkFlowEx.convertToTaskAction = function (button) {
    var annotateResult = {};
    if (button.result)
        annotateResult.result = button.result;

    if (parent.window.UIGetAnnotate) {
        annotate = parent.window.UIGetAnnotate();
        Ext.ux.AppFrame.WorkFlowEx.annotateSaved();
        if ((annotate.result !== null) && !annotateResult.result) annotateResult.result = annotate.result;   //以按钮的结果设置优先
        if (annotate.remark !== null) annotateResult.remark = annotate.remark;
    }

    //转发、中止、抄送是不需要检测意见的
    if ((button.action != "reAbort") && (button.action != "abort") && (button.action != "cc")) {
        if (parent.window.UICheckAnnotate) {
            var validMsg = parent.window.UICheckAnnotate(annotateResult);
            if (validMsg) {
                msgWarning(validMsg);
                return true;
            }
        }
    }

    if (!button.scope) button.scope = {};
    if (!button.freeTask) button.freeTask = button.scope.freeTask; //兼容
    button.scope.result = annotateResult.result;
    button.scope.remark = annotateResult.remark;
    button.scope.dialog = button.scope.dialog ? button.scope.dialog : button.dialog;
    if (!button.scope.initDefaultEventHandler) {
        var actionObj = button.scope;
        var taskID = (actionObj && actionObj.taskID) ? actionObj.taskID : (button.taskID ? button.taskID : '-1');
        var task = button.task ? button.task : (actionObj.task ? actionObj.task : {});
        if (taskID && !task.ID)
            task.ID = taskID;
        var taskAction = new GTP.Workflow.TaskAction({
            action: button.action,
            taskIDs: [task.ID],
            taskID: task.ID,
            task: task
        });
        Ext.apply(taskAction, actionObj);

        button.scope = taskAction;
    }
    button.scope.action = button.action;
    if (!button.afterExecutes && button.scope.afterExecutes) {
        button.afterExecutes = button.scope.afterExecutes;
        button.aeArgs = button.scope.aeArgs;
    }
    button.scope.initDefaultEventHandler(button.scope, button);
    parent.$WorkFlow.Action.initFinally([button.scope.refreshTaskList, function () {
        var taskCenter = Ext.ux.AppFrame.WorkFlowEx.getTaskCenter();
        if (taskCenter && taskCenter.refreshTaskCenterUI)
            taskCenter.refreshTaskCenterUI();
    } ], [button, {}]);
};
//流程模板的函数annotateSaved不能使用，所以定义此函数。
Ext.ux.AppFrame.WorkFlowEx.annotateSaved = function () {
    if (parent.window.annotateAlreadySaved !== undefined)
        parent.window.annotateAlreadySaved = true;
};
//流程模板的函数getTaskCenter不能使用，所以定义此函数。
Ext.ux.AppFrame.WorkFlowEx.getTaskCenter = function () {
    if (parent.window.taskCenter) {
        return parent.window.taskCenter;
    }
    else if (Ext.getCmp('ID_GTP_Workflow_TaskCenter'))
        return Ext.getCmp('ID_GTP_Workflow_TaskCenter')
    return null;
};
//判断当前页面是否在流程模板中，是否在代办中打开流程审批页面。
Ext.ux.AppFrame.WorkFlowEx.isInFlowProcessing = function () {
    //是否在流程处理中.
    if (!Ext.isEmpty($G.Params.taskid) && parseInt($G.Params.taskid) > 0) return true;
    else return false;
};
//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.Common");
    var _class = Ext.extend(Gtp.net.BasePage,
	{
	    //</Top>

	    //[Start]
	    _init: function () {
	        ///<summary>页面初始化，虚方法</summary>
	        $G.EnableIEDialogMaximize = true; //是否允许最大化
	        $G.EnableIEDialogResizable = true; //是否运行改变大小
	    },
	    //[End]

	    //[Start]
	    _setActionsEnableStuas: function (list, isEnabled) {
	        if (list.length == 0) return;
	        for (var i = 0; i < list.length; i++) {
	            var action = $G.Actions.getAction(list[i]);
	            if (action) {
	                if (!isEnabled) action.setDisabled(true);
	                else action.setDisabled(!_this._isAuthAction(action.id));
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _eachComponentWhenInit: function (cmp) {
	        //提供虚方法，供子类重写，避免多次循环遍历控件          
	    },
	    //[End]
	    //[Start]
	    _getDisabledActions: function () {
	        //不可用的按钮,虚方法
	        return [];
	    },
	    //[End]

	    //[Start]
	    _getEnabledActions: function () {
	        //可用的按钮,虚方法
	        return [];
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        if (typeof String.prototype.endsWith != 'function') {
	            String.prototype.endsWith = function (suffix) {
	                return this.indexOf(suffix, this.length - suffix.length) !== -1;
	            };
	        }

	        if (!Ext.isEmpty($G.Params.title)) document.title = $G.Params.title;
	        var result = _super.Page_DocumentReady_Plugin ? _super.Page_DocumentReady_Plugin.apply(this, arguments) : undefined; //加上这句话可以保证plugin中的文件可以执行

	        Ext.ComponentMgr.all.each(function (cmp) {
	            var xtype = cmp.getXType(), cmpId = cmp.getId();
	            if (xtype == "gtptreegridpanel") {
	                Ext.AppFrame.Extend.Ap_TreeGrid_Init(cmpId);
	            }
	            else if (xtype == "gtpgridpanel" || xtype == "multigroupingpanel") {
	                Ext.AppFrame.Extend.AP_GridView_Init(cmpId);
	                if (xtype == "multigroupingpanel") Ext.AppFrame.Extend.AP_GroupingGridView_Init(cmpId);
	            }
	            else if (xtype == "gtpformpanel") {
	                Ext.AppFrame.Extend.Ap_EntityView_Init(cmpId);
	            }
	            else if (xtype == "gtpflexcontainer") {//弹性域
	                Ext.AppFrame.Extend.Ap_EntityView_Init(cmpId);
	            } else if (xtype == "lookupfield") {
	                var control = $G.getCmp(cmpId);
	                if (Ext.isEmpty(control.features.dialogHeight)) {
	                    var f = $G.clone(control.features);
	                    f.dialogHeight = "508px";
	                    control.features = f;
	                }
	                if (Ext.isEmpty(control.features.dialogWidth)) {
	                    var f = $G.clone(control.features);
	                    if (control.refPage && control.refPage.endsWith("DeptLookupPage/DeptLookupPage.aspx")) {
	                        f.dialogWidth = "398px";
	                    }
	                    else {
	                        f.dialogWidth = "796px";
	                    }
	                    control.features = f;
	                }
	            }
	            _this._eachComponentWhenInit(cmp);
	        });

	        if ($G.DataContext && $G.DataContext.items) {
	            $G.DataContext.items.each(function (dataSource, i, l) {
	                Ext.AppFrame.Extend.Ap_DataSource_Init(dataSource.name);
	            });
	        }

	        //规则执行后，需要根据Action权限设置按钮使能状态
	        if ($G.Rules && $G.Rules.items) {
	            $G.Rules.items.each(function (rule, i, l) {
	                rule.on("enable", function (a) {
	                    _this._setAllActionByAuth();
	                });
	            });
	        }
	        _this._init();
	        return result;
	    },
	    //[End]

	    //[Start]
	    _isAuthAction: function (actionName) {
	        ///<summary>authItemName:权限项名称，id：记录主键</summary>
	        if (window.authInfo && window.authInfo.NoAuthActions) {
	            return window.authInfo.NoAuthActions.indexOf(actionName) == -1;
	        } else return true;
	    },
	    //[End]

	    //[Start]
	    _activeAllRule: function (ds) {
	        //所有规则执行一下..
	        if ($G.Rules && $G.Rules.items) {
	            $G.Rules.items.each(function (item) {
	                if (!item.disabled) {
	                    var dds = $G.DataContext.getDataSource(item.dataSource);
	                    if (item.items && ((Ext.isObject(ds) && ds.name == dds.name) || (Ext.isString(ds) && ds == dds.name))) {
	                        for (var i = 0; i < item.items.length; i++)
	                            item.items.get(i).doScroll(ds, ds.currentIndex);
	                    }
	                }
	            });
	        }
	    },
	    //[End]

	    //[Start]
	    _activeARule: function (ds, aruleName) {
	        //执行某一个规则
	        if ($G.Rules && $G.Rules.items) {
	            for (var i = 0; i < $G.Rules.items.items.length; i++) {
	                var rule = $G.Rules.items.items[i];
	                var dds = $G.DataContext.getDataSource(rule.dataSource);
	                if (rule.id == aruleName && ((Ext.isObject(ds) && ds.name == dds.name) || (Ext.isString(ds) && ds == dds.name))) {
	                    if (!rule.disabled) {
	                        for (var j = 0; j < rule.items.length; j++)
	                            rule.items.get(j).doScroll(ds, ds.currentIndex);
	                    }
	                    break;
	                }
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _disabledAllRule: function () {
	        //禁止所有规则..,并把已经禁止的放在数组中
	        var ruleList = [];
	        if ($G.Rules && $G.Rules.items) {
	            $G.Rules.items.each(function (item) {
	                if (!item.disabled) {
	                    ruleList.push(item);
	                    item.disable();
	                }
	            });
	        }
	        return ruleList;
	    },
	    //[End]

	    //[Start]
	    _enableAllRule: function (ruleList) {
	        if (ruleList) {
	            for (var i = 0; i < ruleList.length; i++) ruleList[i].enable();
	        }
	    },
	    //[End]

	    //[Start]
	    _firstDisabledThenEnableAllRule: function (func) {
	        //先禁止再启用
	        var ruleList = _this._disabledAllRule();
	        if (Ext.isFunction(func)) func.call(this);
	        _this._enableAllRule(ruleList);
	    },
	    //[End]

	    //[Start]
	    _setAllActionByAuth: function () {
	        ///<summary>如果没有权限就置灰</summary>
	        $G.Actions.items.each(function (item) {
	            if (!_this._isAuthAction(item.id)) item.disable();
	        });
	    },
	    //[End]

	    //[Start]
	    _AuthItemDemand: function (moduleCode, authItemName, obj, deptFullId) {
	        ///<summary>authItemName:权限项名称，id：记录主键</summary>
	        var isAuthed = false;
	        var action = "AuthItemDemandByEntity";

	        if (Ext.isNumber(obj)) action = "AuthItemDemandById";
	        if (Ext.isEmpty(deptFullId)) deptFullId = Ext.AppFrame.Common.getDeptFullId();
	        if (moduleCode) {
	            if (moduleCode != "all") {
	                //没有权限项，表明没有权限
	                if (!authItemName) isAuthed = false;

	                Gtp.net.Global.dispatcher({
	                    controller: Gtp.net.Global.getPageController(),
	                    async: false,
	                    action: action,
	                    args: [moduleCode, authItemName, obj, deptFullId],
	                    success: function (result) {
	                        isAuthed = result;
	                    },
	                    failure: function () {
	                        //Gtp.net.MessageBox.exception("提示", arguments[4]);
	                        isAuthed = -100;
	                        $G.alert("提示", arguments[2]);
	                    }
	                });
	            }
	            else {
	                isAuthed = true; //模块树=all，表明不控权
	            }
	        }
	        return isAuthed;
	    },
	    //[End]

	    //[Start]
	    _AuthItemDemandById: function (authItemName, id, deptFullId) {
	        ///<summary>authItemName:权限项名称，id：记录主键</summary>
	        var ret = false;
	        if (Ext.isEmpty(deptFullId)) deptFullId = Ext.AppFrame.Common.getDeptFullId();

	        var disp = new Gtp.net.GtpDispatcher({
	            async: false,
	            dispatchArgs: {
	                controller: $G.getPageController(),
	                action: "AuthItemDemandById",
	                args: ["", authItemName, id, deptFullId]
	            },
	            listeners: {
	                scope: this,
	                'success': function (result) {
	                    ret = result;
	                },
	                'failure': function (result) {
	                    //Gtp.net.MessageBox.exception("提示", arguments[4]);
	                    ret = -100;
	                    $G.alert("提示", arguments[2]);
	                }
	            }
	        });
	        disp.dispatch();
	        return ret;
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.Common.BasePage = _class;
})();
//</Bottom>
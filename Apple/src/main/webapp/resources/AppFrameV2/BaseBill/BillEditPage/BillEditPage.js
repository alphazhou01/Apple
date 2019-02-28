//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseBill");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	    //[Start]
	    _bizLockTimeout: function () {
	        ///<summary>默认锁有效期10分钟，派生类扩展</summary>
	        return 10;
	    },
	    //[End]

	    //[Start]
	    __saveHistory: function (id) {
	        ///<summary>保存上一步历史记录</summary>
	        if (Ext.isNumber(id) && id > 0) {
	            $G.Page.oldId = id;
	        }
	        else {
	            var ds = $G.DataContext.getDataSource("Bill");
	            var rec = ds.getDataRecord();
	            if (rec) $G.Page.oldId = rec.id;
	        }
	    },
	    //[End]

	    //[Start]
	    STATE_VIEW_Handler: function () {
	        _this.__saveHistory();
	    },
	    //[End]

	    //[Start]
	    actGiveup_Handler: function (sender) {
	        ///<summary>放弃:actGiveup</summary>
	        Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AbortSave), function (e) {
	            if (e == "yes") {
	                var ds = $G.DataContext.getDataSource("Bill");
	                ds.fireEvent("aftergiveup", ds); //触发事件
	                //释放业务锁
	                if ($G.Page.__bizLockName) {
	                    var rec = ds.getDataRecord();
	                    if (Ext.AppFrame.Common.releaseBizLock(ds.type, rec.id, true)) {
	                        delete $G.Page.__bizLockName;
	                    }
	                }

	                //处理附件
	                var array = new Array();
	                var changeSummary = ds.getChangeSummary();
	                if (changeSummary && changeSummary.length > 0) {
	                    if (changeSummary[0].__modified && Ext.isArray(changeSummary[0][changeSummary[0].__modified[0]]) && Ext.isObject(changeSummary[0][changeSummary[0].__modified[0]][0])) {
	                        for (var i = 0; i < changeSummary[0][changeSummary[0].__modified[0]].length; i++) {
	                            if (Ext.isObject(changeSummary[0][changeSummary[0].__modified[0]][i])) {
	                                if (changeSummary[0][changeSummary[0].__modified[0]][i].__state == "created") {
	                                    array.push(changeSummary[0][changeSummary[0].__modified[0]][i].FileID + "&" + changeSummary[0][changeSummary[0].__modified[0]][i].EditGuid);
	                                }
	                            }
	                        }

	                        if (array.length > 0) {
	                            var disp = new Gtp.net.GtpDispatcher({
	                                dispatchArgs: {
	                                    controller: Gtp.net.Global.getPageController(),
	                                    action: "DeleteBillAttach",
	                                    args: [array]
	                                },
	                                listeners: {
	                                    scope: this
	                                }
	                            });
	                            disp.dispatch();
	                        }
	                    }
	                }
	                //处理附件

	                if ($G.Page.oldId && parseInt($G.Page.oldId) > 0) {
	                    _this._saving = true; //使放弃后，如果是编辑，变成查看状态
	                    _this._keepGridFocusedRow(false);
	                    ds.AP_loadDataById($G.Page.oldId, _this._getLoadConfig(false));
	                }
	                else {
	                    if ($G.Params.target == "_self")
	                        _this.actBack_Handler(sender);
	                    else {
	                        ds.closeTab = true;
	                        $G.close(false);
	                    }
	                }

	            }
	        });
	    },
	    //[End]

	    //[Start]
	    __setActBackVisible: function () {
	        if ($G.Params.target == "_self") {
	            var action = $G.Actions.getAction("actBack");
	            if (action) action.setHidden(false);
	            var cmp = $G.getCmp("SeparatorBack");
	            if (cmp) cmp.setVisible(true);
	        }
	    },
	    //[End]

	    //[Start]
	    _getDisabledActions: function () {
	        //不可用的按钮,虚方法
	        if (_this.apf_billStateName == "Approving" || _this.apf_billStateName == "ApprovePass")
	            return ["actSubmit"];
	        else
	            return [];
	    },
	    //[End]

	    //[Start]
	    _getEnabledActions: function () {
	        //永远可用的按钮,虚方法
	        var ret = [], s = $G.CurrentState;
	        if ($G.PageExtend.APE_EffectiveCanEdit == "true" && s == "STATE_VIEW") {
	            if (_this.apf_billStateName == "Submitted" || _this.apf_billStateName == "ApprovePass") {
	                ret.push("actModify");
	            }
	        }
	        return ret;

	    },
	    //[End]

	    //[Start]
	    _onPageStateChange: function (s) {
	        //当前页面状态改变触发，子类可重写，不仅仅限于状态，也可以是输入参数等.
	        if (Ext.isEmpty(s)) s = $G.CurrentState;
	        var action = $G.Actions.getAction("actPrior");
	        var bCanNav = (s != null && ((s == "STATE_VIEW") || (s.name == "STATE_VIEW"))) && (!Ext.isEmpty($G.Params.ticks)) && Ext.isEmpty($G.Params.taskid);
	        if (action) action.setDisabled(!bCanNav);
	        action = $G.Actions.getAction("actNext");
	        if (action) action.setDisabled(!bCanNav);
	        _this.__setActBackVisible();


	        Ext.AppFrame.Bill.InitButtonByPageExtend();

	        //处理细表TabView，如果标签内容中没有数据控件，则隐藏。处理与Form整合细表
	        var detialTabView = $G.getCmp("detialTabView");
	        if (!!detialTabView) {
	            var tabItems = detialTabView.items;
	            if (tabItems.length == 0) {
	                detialTabView.setVisible(false);
	                var billEntityView = $G.getCmp("billEntityView");
	                if (billEntityView.ownerCt && detialTabView.ownerCt && billEntityView.ownerCt.id == detialTabView.ownerCt.id) {
	                    if (billEntityView.ownerCt.doLayout) billEntityView.ownerCt.doLayout();
	                }
	            }
	            else if (tabItems.items.length > 0) {
	                var isVisibleTabView = false;
	                var hideTabName = [];
	                for (var tabindex = 0; tabindex < tabItems.items.length; tabindex++) {
	                    if (tabItems.items[tabindex].items) {
	                        var bOnlyOneControl = tabItems.items[tabindex].items.items.length == 1;
	                        var controlTypes = ["gtpgridpanel", "multigroupingpanel", "gtptreegridpanel"];
	                        for (var i = 0; i < controlTypes.length; i++) {
	                            var curgrids = tabItems.items[tabindex].findByType(controlTypes[i]);
	                            for (var gridindex = 0; gridindex < curgrids.length; gridindex++) {
	                                if (curgrids[gridindex].hidden == false) {
	                                    isVisibleTabView = true
	                                } else if (bOnlyOneControl) {
	                                    hideTabName.push(tabItems.items[tabindex].id);
	                                }
	                            }
	                        }
	                    }

	                    var curentitys = tabItems.items[tabindex].findByType("gtpformpanel");
	                    for (var entityindex = 0; entityindex < curentitys.length; entityindex++) {
	                        if (curentitys[entityindex].hidden == false) {
	                            isVisibleTabView = true
	                        }
	                    }
	                }
	                //隐藏标签 TP-30771
	                for (var i = 0; i < hideTabName.length; i++) {
	                    detialTabView.hideTabStripItem(hideTabName[i])
	                }

	                if (!isVisibleTabView) {
	                    detialTabView.setVisible(false);
	                    var billEntityView = $G.getCmp("billEntityView");
	                    if (billEntityView.ownerCt && detialTabView.ownerCt && billEntityView.ownerCt.id == detialTabView.ownerCt.id) {
	                        if (billEntityView.ownerCt.doLayout) billEntityView.ownerCt.doLayout();
	                    }
	                }
	            }
	        }
	    },
	    //[End]

	    //[Start] 
	    __isInFlowProcessing: function () {
	        //是否在流程处理中.
	        if (!Ext.isEmpty($G.Params.taskid) && parseInt($G.Params.taskid) > 0) return true;
	        else return false;
	    },
	    //[End]

	    //[Start]
	    __callParentFlowSend: function () {
	        ///<summary>调用父类发送按钮</summary>
	        parent.actAdvanceExecute({
	            scope: parent.buttonAction, dialog: false, hotkey: true
	        });
	    },
	    //[End]

	    //[Start]
	    _initPageConfig: function () {
	        ///<summary>初始化页面配置，默认从表单扩展参数中读取，子类页面为了效率也可重写.</summary>
	        Ext.AppFrame.Common.getModuleApfExtend("APE_ShowDeptTree");

	        if (!Ext.isEmpty($G.Params.LeftDeptselectedFullId)) {
	            _this._DeptFullID = $G.Params.LeftDeptselectedFullId;
	            var idList = _this._DeptFullID.split("/");
	            if (idList.length > 0) _this._DeptID = idList[idList.length - 1];
	        }

	        if (!Ext.isEmpty($G.Params.LeftDeptselectedName)) _this._DeptName = $G.Params.LeftDeptselectedName;
	        if (!Ext.isEmpty($G.Params.LeftDeptselectedCode)) _this._DeptCode = $G.Params.LeftDeptselectedCode;
	    },
	    //[End]

	    //[Start]
	    _initNavigateBar: function () {
	        ///<summary>初始化导航条</summary>
	        if ($G.PageExtend.APE_ShowNavigateBar && $G.PageExtend.APE_ShowNavigateBar == "true") {
	            Ext.ux.AppFrame.NavigateBar();
	        }
	    },
	    //[End]

	    //[Start]
	    _initDocTempFolder: function (actionArray, clickCallback) {
	        ///<summary>初始化文档模板目录</summary>
	        actionArray = actionArray || ["actAddAttach", "actAddFile", "actAddAfterUploadFile", "actImportFromDocCenter", "actAddAttachFromDocTemplate"];

	        var docTemplateExtendData = Ext.AppFrame.Common.getModuleApfExtend("APE_DocTemplate");
	        if (docTemplateExtendData == "true") {
	            Ext.AppFrame.Bill.InitAttachDetail($G.getBizComp(), function (node, event) {
	                if (clickCallback && Ext.isFunction(clickCallback)) {
	                    clickCallback.call(this, node, event);
	                }
	            });
	            var oldEventHandler = Gtp.net.Global.eventHandler;
	            Gtp.net.Global.eventHandler = function (scop, handler, params) {
	                for (var i = 0; i < actionArray.length; i++) {
	                    var action = $G.Actions.getAction(actionArray[i]);
	                    if (action) {
	                        if (handler == action.handlerName) {
	                            var grid = $G.getViewObject(params[0]);
	                            if (grid && grid.dataSource) {
	                                var ds = $G.DataContext.getDataSource(grid.dataSource);
	                                if (ds && ((ds.folderId != undefined && ds.folderId > 0 && ds.folderCanViewDFile) || grid.initialConfig["aPE_DocTemplate"] == "false"))
	                                    return oldEventHandler.apply(this, arguments);
	                                else {
	                                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "没有权限添加附件！");
	                                    return;
	                                }
	                            }
	                        }
	                    }
	                }
	                return oldEventHandler.apply(this, arguments);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    __loadDetailResult: function (detailResult) {
	        ///<summary></summary>
	        var result = true;
	        if (detailResult && Ext.isArray(detailResult)) {
	            for (var i = 0; i < detailResult.length; i++) {
	                if (detailResult[i] && Ext.isArray(detailResult[i]) && detailResult[i].length == 2) {
	                    if (detailResult[i][0] && detailResult[i][1] == true) {
	                        Ext.AppFrame.Bill.AutoProcessDetail("autoLoadDetailActionName", detailResult[i][0]);
	                    }
	                    else {
	                        result = false;
	                    }
	                }
	            }
	        }
	        else {
	            Ext.AppFrame.Bill.AutoProcessDetail("autoLoadDetailActionName"); //细表保存结果为空，说明是刷新数据，直接加载细表
	        }
	        return result;
	    },
	    //[End]

	    //[Start]
	    _initCustomBillTitleAdditional: function (result) {
	        return "";
	    },
	    //[End]

	    //[Start]
	    _initCustomBillTitle: function (result) {
	        ///<summary>初始化单据头,HTML风格</summary>
	        var billTitleView2 = $G.getCmp("billTitleView2");
	        if (billTitleView2) {
	            if (result && !Ext.isArray(result)) {
	                result = [result];
	            }
	            if (result && result.length == 1 && result[0]) {
	                var billStateAlias = (result[0]["State"] && result[0]["State"].alias) ? result[0]["State"].alias.zh_CN : "";
	                var billStateName = (result[0]["State"] && result[0]["State"].name) ? result[0]["State"].name : "";
	                var createTime = result[0]["CreateTime"] ? Ext.util.Format.date(result[0]["CreateTime"], 'Y-m-d') : "";
	                var deptName = result[0]["DeptName"] ? result[0]["DeptName"] : "";
	                var creatorName = result[0]["CreatorName"] ? result[0]["CreatorName"] : "";

	                var strHTML = '<div class="div-bill-title">'
	                	            + '<span id="span_billStateName" class="div-bill-title-label">状态:'
	                                + '<strong class="div-bill-title-value1 bill-state-' + billStateName + '">' + billStateAlias + '</strong></span>'
	                                + '&nbsp;\r\n'
	                	            + '<span class="div-bill-title-label">部门名称:'
	                	            + '<strong class="div-bill-title-value2">' + deptName + '</strong></span>'
	                                + '&nbsp;\r\n'
	                	            + '<span class="div-bill-title-label">编制人:'
	                	            + '<strong class="div-bill-title-value2">' + creatorName + '</strong></span>'
	                                + '&nbsp;\r\n'
	                                + '<span class="div-bill-title-label">编制日期:'
	                	            + '<strong class="div-bill-title-value2">' + createTime + '</strong></span>';

	                strHTML = strHTML + _this._initCustomBillTitleAdditional(result) + '</div>';

	                var divBillTitle = document.getElementById("divBillTitle");
	                if (divBillTitle) {
	                    divBillTitle.setAttribute("class", "divBillTitle");
	                    divBillTitle.innerHTML = strHTML;
	                    billTitleView2.doLayout();
	                }

	                var d = Ext.getDom("span_billStateName");
	                if (d) {
	                    //  d.billStateAlias = billStateAlias;
	                    _this.billObject.billStateAlias = billStateAlias;
	                    _this._onAfterRenderTitle(result);
	                }
	            }
	        }
	    },
	    //[End]


	    //[Start]	   
	    _onAfterRenderTitle: function (result) {
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary>页面初始化，发生在加载数据之前</summary>
	        _super._init();
	        _this.billObject = {};

	        if (Portal.Tab.CanGetTop() && Portal.Tab.GetTopArgs() && Portal.Tab.GetTopArgs().currentQueryPlan) {
	            $G.Page.__ParentQueryPlan = Portal.Tab.GetTopArgs().currentQueryPlan;
	        }

	        //Ext.ux.AppFrame.LookupBar();

	        _this.__setActBackVisible();
	        var toolbar = $G.getCmp("billToolbar");
	        if (toolbar) toolbar.dataSource = "Bill"; //这样可以保证有些Action可用

	        Ext.AppFrame.Bill.CallFlow_beforeAdvance(true, _this.actSave_Handler, $G.Actions.getAction("actSave"));
	        //隐藏ToolBar，一般是在审批流程节点中
	        if ($G.Params.HideToolBar && $G.Params.HideToolBar == "1") {
	            $G.getCmp("billToolbar").setVisible(false);
	        }

	        _this._saving = false;          //是否保存后加载数据
	        _this._canSetActionStatus = true;
	        if (!$G.Params.state) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoState);
	            return;
	        }

	        var ds = $G.DataContext.getDataSource("Bill");
	        //初始化数据..
	        ds.on("beforesave", function () {
	            _this._keepGridFocusedRow(false);
	        }, this);

	        ds.on("afteradd", function (record) {
	            _this.apf_billStateName = "NotSubmitted";
	            record.set("State", { name: "NotSubmitted", value: "0", alias: { en: "NotSubmitted", zh_CN: "未提交", zh_TW: "未提交"} });
	            $G.States.setCurrentState("STATE_EDIT");

	            Ext.AppFrame.Bill.AutoProcessDetail("clearTreeDetailData"); //不需要重新加载，只需要清空就可以了

	            _this.UpdateTabTitleSelf();
	            if (record && record.data)
	                _this._initCustomBillTitle([record.data]);
	        });
	        ds.on("beforeload", function () { _this.isLoading = true; }, this);


	        //数据加载后触发
	        ds.on("load", function (datasource, result, append) {
	            _this._initCustomBillTitle(result);
	            if (result && result.length > 0 && result[0].State) _this.apf_billStateName = result[0].State.name;

	            var isSuccess = true; //处理细表是否成功，如果都成功，更改页面状态，否则保留页面状态
	            //加载细表，根据保存细表结果数据，加载细表，如果细表保存结果detailResult为空，说明是刷新页面，全部加载细表
	            isSuccess = _this.__loadDetailResult(_this.detailResult);
	            delete _this.detailResult; //加载完细表后，删除细表保存结果集合


	            if (_this._canSetActionStatus) {
	                _this._setActionsEnableStuas(_this._getDisabledActions(), false);
	                _this._setActionsEnableStuas(_this._getEnabledActions(), true);
	            }
	            //早期版本的细表处理方式
	            Ext.ComponentMgr.all.each(function (cmp) {
	                if (cmp.getXType() == "gtptreegridpanel") {
	                    //加载树形细表数据
	                    if (cmp.ape_BillDetailTree == "true") {
	                        if (cmp.rendered) {
	                            cmp.AP_loadBillDetailData();
	                        } else {
	                            cmp.ape_renderedLoadData = true; //rendered之后再加载数据
	                        }
	                    }
	                } else if (cmp.getXType() == "gtpgridpanel") {
	                    //加载分页数据
	                    if (cmp.ape_PagerDetailGrid == "true" && !cmp.apf_isDetailPaging) cmp.AP_loadPagerDetailData();
	                }
	            });

	            //如果不是在流程里，更新标题
	            if (!_this.__isInFlowProcessing()) _this.UpdateTabTitleSelf(); //更新标题
	            _this._navMode = "";

	            Ext.defer(function () {
	                _this.isLoading = true;
	                datasource.commitChanges(true); //避免计算字段getChangeSummay不为空
	                _this._keepGridFocusedRow(true);
	                _this.isLoading = false;

	                if (isSuccess) {
	                    if (_this._saving) {
	                        if (_this._keepStateAfterSave) {
	                            _this._keepStateAfterSave = false;
	                            if (!Ext.isEmpty(ds._beforeSaveState)) {
	                                $G.States.setCurrentState(ds._beforeSaveState);
	                                ds._beforeSaveState = undefined;
	                            }
	                        }
	                        else $G.States.setCurrentState("STATE_VIEW");
	                    }
	                    else { //说明是打开页面时加载
	                        if ($G.Params.state) {
	                            var s = $G.Params.state.toUpperCase();
	                            if (s == "READONLY") s = "STATE_READONLY";

	                            $G.States.setCurrentState(s);
	                        }
	                    }
	                }

	            }, 500)
	            //_this._saving = false;
	        });
	        //加载了，但没有数据...
	        ds.on("onnodata", function (data) {
	            if (_this._navMode == "next") {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.AppFrame_IsLastBill);
	            } else if (_this._navMode == "prior") {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.AppFrame_IsFirstBill);
	            }
	            else {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.RecMayDeleted);
	                $G.States.setCurrentState("STATE_READONLY");
	            }
	            _this._navMode = "";

	            _this._initCustomBillTitle([]);
	        });

	        //数据保存后触发
	        ds.on("aftersave", function (ds, result) {
	            //释放业务锁
	            if (ds.closeTab) {
	                Portal.Tab.CloseSelf();
	                return;
	            }
	            if ($G.Page.__bizLockName) {
	                if (Ext.AppFrame.Common.releaseBizLock(ds.type, ds.getDataRecord().id, true)) {
	                    delete $G.Page.__bizLockName;
	                }
	            }
	            //如果是添加，主键复制
	            if (Ext.isNumber(result) && result > 0) {
	                var billId = result;
	                ds.setFieldValue(ds.primaryKey[0], billId);
	            } else if (Ext.isObject(result)) {
	                var billId = result.ID;
	                ds.setFieldValue(ds.primaryKey[0], billId);
	            }

	            //保存细表
	            var detailResult = Ext.AppFrame.Bill.AutoProcessDetail("autoSaveDetailActionName");
	            _this.detailResult = detailResult;
	            _this._saving = true;
	            if (_this.__isInFlowProcessing()) {
	                return; //如果是流程中就不读取了？
	            }

	            ds._beforeSaveState = $G.CurrentState;
	            $G.States.setCurrentState("STATE_READONLY");

	            if (detailResult.length > 0) {
	                if (Ext.isNumber(result) && result > 0) {//主表新增，保存成功，在主表的ds.on("load")里会根据_this.detailResult处理细表加载，和页面状态
	                    ds.AP_loadDataById(result, _this._getLoadConfig(false));
	                }
	                else if (Ext.isNumber(result) && result <= 0) {//主表没有数据更新，并且细表有更新，在主表的ds.on("load")里会根据_this.detailResult处理细表加载，和页面状态
	                    ds.AP_loadDataById(ds.getDataRecord().id, _this._getLoadConfig(false));
	                }
	                else if (Ext.isObject(result)) {//主表返回的是数据集合，在主表的ds.on("load")里会根据_this.detailResult处理细表加载，和页面状态
	                    ds.loadData(result);
	                }
	                //如果细表有失败的，那么不继续执行aftersave事件，返回false
	                var saveSuccess = true;
	                for (var i = 0; i < detailResult.length; i++) {
	                    if (detailResult[i][1] == false) {
	                        saveSuccess = false;
	                        break;
	                    }
	                }
	                return saveSuccess;
	            }
	            else {
	                if (Ext.isNumber(result) && result > 0) {//主表新增，保存成功，在主表的ds.on("load")里会根据_this.detailResult处理细表加载，和页面状态
	                    ds.AP_loadDataById(result, _this._getLoadConfig(false));
	                }
	                else if (Ext.isNumber(result) && result <= 0) {
	                    if (!_this._keepStateAfterSave) {
	                        $G.States.setCurrentState("STATE_VIEW"); //主细表，都没有更改，页面状态更改【查看状态】
	                    }
	                }
	                else if (Ext.isObject(result)) {//主表返回的是数据集合，在主表的ds.on("load")里会根据_this.detailResult处理细表加载，和页面状态
	                    ds.loadData(result);
	                }
	            }



	        });
	        //状态改变时触发.
	        $G.States.on("statechange", function (s) {
	            _this._onPageStateChange(s);
	        });

	        window.beforeRemovePage = _this.__beforeRemovePage; //注册页面关闭刷新事件
	        Portal.Tab.InitDialog();

	        _this._initPageConfig();
	        _this._onPageStateChange();

	        _this._initNavigateBar();

	        _this._initDocTempFolder();

	        Ext.AppFrame.Bill.AutoProcessDetail("autoInitDetailActionName");

	        //操作工具条无边框
	        var billToolbar = $G.getCmp("billToolbar");
	        if (billToolbar)
	            billToolbar.addClass("x-grid-toolbar-noborder");

	        //改单据头背景色
	        var billTitleView = $G.getCmp("billTitleView");
	        if (billTitleView) {
	            //billTitleView.addClass("x-panel-body-billtitle-bg");
	            billTitleView.form.el.setStyle("padding", "5px 0 5px 10px");

	            var keys = billTitleView.getForm().items.keys;
	            for (var i = 0; i < keys.length; i++) {
	                var item = document.getElementById(billTitleView.getForm().items.keys[i] + "_static");
	                if (item) {
	                    item.style.position = "absolute";
	                    item.style.visibility = "visible";
	                }
	                var item = document.getElementById(billTitleView.getForm().items.keys[i] + "_staticcontent");
	                if (item) {
	                    item.style.width = billTitleView.getForm().items.items[i].width + "px";
	                    item.style.height = "15px";
	                }
	            }
	        }

	        //设置单据编辑页的外边框
	        var layoutPanel4 = $G.getCmp("layoutPanel4");
	        if (layoutPanel4)
	            layoutPanel4.addClass("x-panel-body-left-bottom-right-border");

	        //修改细表tab的双边框，去掉一个边框
	        var detialTabView = $G.getCmp("detialTabView");
	        if (detialTabView)
	            detialTabView.addClass("g-tabsty-disspacer");
	    },
	    //[End]

	    //[Start]
	    __beforeRemovePage: function () {
	        var ds = $G.DataContext.getDataSource("Bill");
	        if (ds.closeTab == true) {
	            return true;
	        }
	        if (_this._getDataChangedFlag(ds)) {
	            //        Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, "当前数据已经更改，是否保存?", function (e) {
	            //            if (e == "yes") {
	            //                _this.actSave_Handler({ closeTab: true });
	            //            } else {
	            //                ds.closeTab = true;
	            //                Portal.Tab.CloseSelf();
	            //            }
	            //        });
	            return false;
	        }
	        return true;
	    },
	    //[End]

	    //[Start]
	    _isValid: function () {
	        //判断当前页面是否有效；可以重写.

	        var func_ValidDetailTab = function () {
	            if (!!$G.getCmp("detialTabView")) {
	                var tabItems = $G.getCmp("detialTabView").items;
	                if (!!tabItems && tabItems.items.length > 0) {
	                    for (var tabindex = 0; tabindex < tabItems.items.length; tabindex++) {
	                        var curgrids = tabItems.items[tabindex].findByType("gtpgridpanel");
	                        for (var gridindex = 0; gridindex < curgrids.length; gridindex++) {
	                            if (curgrids[gridindex].validate() == false) {
	                                $G.getCmp("detialTabView").setActiveTab(tabItems.items[tabindex]);
	                                return false;
	                            }
	                        }
	                        var curentitys = tabItems.items[tabindex].findByType("gtpformpanel");
	                        for (var entityindex = 0; entityindex < curentitys.length; entityindex++) {
	                            if (curentitys[entityindex].AP_isValid && !curentitys[entityindex].AP_isValid()) {
	                                $G.getCmp("detialTabView").setActiveTab(tabItems.items[tabindex]);
	                                return false;
	                            }
	                        }
	                        //验证动态域字段
	                        var curflexcontainer = tabItems.items[tabindex].findByType("gtpflexcontainer");
	                        for (var entityindex = 0; entityindex < curflexcontainer.length; entityindex++) {
	                            if (curflexcontainer[entityindex].isValid && !curflexcontainer[entityindex].AP_isValid()) {
	                                $G.getCmp("detialTabView").setActiveTab(tabItems.items[tabindex]);
	                                return false;
	                            }
	                        }
	                        var curtrees = tabItems.items[tabindex].findByType("gtptreegridpanel");
	                        for (var treeindex = 0; treeindex < curtrees.length; treeindex++) {
	                            if (!curtrees[treeindex].validate()) {
	                                $G.getCmp("detialTabView").setActiveTab(tabItems.items[tabindex]);
	                                return false;
	                            }
	                        }
	                    }
	                }
	            }
	            return true;
	        }

	        var billView = $G.getCmp("billEntityView");
	        var flexView = $G.getCmp("mainFlexView");
	        var detailTabView = billView.findParentByType("tabpanel");
	        var ret = billView.AP_isValid();
	        if (ret && !!flexView) ret = flexView.AP_isValid();
	        if (ret) {
	            ret = func_ValidDetailTab();
	        }
	        else if (detailTabView && detailTabView.id == "detialTabView") {
	            ret = func_ValidDetailTab();
	        }
	        if (!ret) {
	            throw new Error("Field_Value_Error");
	        }
	        return ret;
	    },
	    //[End]

	    //[Start]
	    _getLoadConfig: function (isLoadParent) {
	        ///<summary>加载数据的配置</summary>
	        var config = {};
	        if (isLoadParent) {
	            if (!Ext.isEmpty($G.PageExtend.AP_ParentPVName)) config.entityPvName = $G.PageExtend.AP_ParentPVName;
	            config.notLoadToDataSource = true; //不需要加载到数据源中..
	        }
	        else {
	            if (!Ext.isEmpty($G.PageExtend.AP_PVName)) config.entityPvName = $G.PageExtend.AP_PVName;
	            if (!Ext.isEmpty($G.PageExtend.AP_BlobFields))
	                config.queryLobFields = $G.PageExtend.AP_BlobFields.split(';');
	        }
	        return config;
	    },
	    //[End]

	    //[Start]
	    _getNotCopyFieldArray: function () {
	        ///<summary>不需要复制的字段,可重写.</summary>
	        return ["Code", "CreateTime", "HasAttach", "State", "BizDate", "Creator.Name", "Creator.UserId", "CreatorId", "CreatorName", "IsLeaf", "Dept.DeptId", "DeptName", "Effective"]
	    },
	    //[End]

	    //[Start]
	    UpdateTabTitleSelf: function () {
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
	    },
	    //[End]

	    //[Start]	 
	    _getDataChangedFlag: function (ds) {
	        //return false; //为了兼容性，不实现此功能，在G7实现.
	        return ($G.CurrentState == "STATE_EDIT") && !Ext.isEmpty(ds.getChangeSummary());
	    },
	    //[End]

	    //[Start]
	    _eachComponentWhenInit: function (cmp) {
	        _super._eachComponentWhenInit.apply(this, arguments);
	        var xtype = cmp.getXType(), cmpId = cmp.getId();
	        if (xtype == "gtpgridpanel" || xtype == "gtptreegridpanel") {
	            _this._gridIndexCache[cmpId] = -1;
	        }
	    },
	    //[End]

	    //[Start]  
	    _afterRestoreGridFocusedRow: function (grid, index) {
	        grid.fireEvent("rowclick", grid, index);
	    },
	    //[End]

	    //[Start]   
	    _keepGridFocusedRow: function (isRestore) {
	        ///<summary>保存后定位到原来的记录上</summary>
	        if (Ext.isEmpty(_this._gridIndexCache)) return;
	        for (var p in _this._gridIndexCache) {
	            var grid = $G.getCmp(p);
	            if (!grid || !grid.rendered) {
	                continue;
	            }
	            if (isRestore) {
	                if (_this._gridIndexCache[p] > -1) {
	                    var model = grid.getSelectionModel();
	                    model.clearSelections();
	                    model.selectRow(_this._gridIndexCache[p]);
	                    _this._afterRestoreGridFocusedRow(grid, _this._gridIndexCache[p]);
	                } else {
	                    _this._afterRestoreGridFocusedRow(grid, 0);
	                }
	                _this._gridIndexCache[p] = -1;
	            }
	            else {
	                var selectedRow = grid.getSelectionModel().getSelected();
	                if (selectedRow && selectedRow.data) {
	                    _this._gridIndexCache[p] = grid.getStore().indexOf(selectedRow);
	                } else {
	                    _this._gridIndexCache[p] = -1;
	                }

	            }
	        }
	    },
	    //[End]


	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>

	        if (!Ext.isEmpty($G.Params.readonly) && !Ext.isEmpty($G.Params.workflow)) {
	            if (parseInt($G.Params.readonly) == 1) $G.Params.state = "STATE_READONLY";
	        }
	        _this._gridIndexCache = {}; //保存后定位
	        _super.Page_DocumentReady();

	        var saveHandler = $G.getCmp("btnSave").handler;
	        var agentHandler = function (sender) {
	            try {
	                saveHandler.call(sender, sender);
	            }
	            catch (e) {
	                if (e.message != "Field_Value_Error") {
	                    throw e;
	                }
	            }
	        };
	        $G.getCmp("btnSave").handler = agentHandler;

	        var ds = $G.DataContext.getDataSource("Bill");
	        if ($G.Params.state) {
	            if ($G.Params.state == "STATE_EDIT" && !$G.Params.id) {
	                if ($G.Params.pid && parseInt($G.Params.pid) > 0) { //加载父节点
	                    _this._addChildNode(ds);
	                }
	                else {
	                    _this.actNew_Handler({ isFirstLoad: true }); //ds.addRecord();
	                }

	            }
	            else {
	                if (parseInt($G.Params.copy) == 1) {
	                    _this._copyAddRecord($G.Params.id); //复制新增
	                }
	                else {
	                    var isBizLock = Ext.AppFrame.Common.getModuleApfExtend("APE_BizLock");
	                    if (isBizLock == true || isBizLock == "true") {
	                        $G.Page.__bizLockName = true;
	                    }

	                    ds.AP_loadDataById($G.Params.id, _this._getLoadConfig(false));
	                    _this.__saveHistory($G.Params.id);
	                }
	            }
	        }
	        else {
	            $G.States.setCurrentState("STATE_READONLY");
	        }

	    },
	    //[End]

	    //[Start]  
	    _addChildNode: function () {
	        var ds = $G.DataContext.getDataSource("Bill");
	        var config = _this._getLoadConfig(true);
	        if (config.entityPvName) {
	            config.success = function (result) {
	                //序列化请求返回数据，请求返回的数据Json规则：如果多个实体引用一个对象，那么只序列化一个，其他引用使用关键字_reference：[number]。
	                result = $G.decodeJSONData(result);
	                //$G.Actions.getAction("actNew").execute(); //会提示没有权限，待查
	                _this.actNew_Handler({});
	                var excludeFieldListArry = _this._getNotCopyFieldArray();
	                ds.fields.each(function (f) {
	                    if (!f.primaryKey && (excludeFieldListArry.indexOf(f.name) == -1)) {
	                        var list = f.name.split('.');
	                        if (list.length == 1)
	                            ds.setFieldValue(f.name, result[f.name]);
	                        else if (list.length == 2) {
	                            if (!Ext.isEmpty(result[list[0]]))
	                                ds.setFieldValue(f.name, result[list[0]][list[1]]);
	                        }
	                    }
	                }, this);
	                ds.setFieldValue("PID", parseInt($G.Params.pid));
	                ds.setFieldValue("RID", parseInt($G.Params.rid));
	                ds.fireEvent("afteraddchild", result); //触发事件以便派生类调用
	            }
	            ds.AP_loadDataById($G.Params.pid, config); //..

	        } else {
	            //$G.Actions.getAction("actNew").execute();
	            _this.actNew_Handler({});
	            ds.setFieldValue("PID", parseInt($G.Params.pid));
	            ds.setFieldValue("RID", parseInt($G.Params.rid));
	        }
	    },
	    //[End]

	    //[Start]
	    _copyAddRecord: function (id) {
	        ///<summary>复制新增一条记录</summary>
	        //TODO:复制的时候需要禁止规则？
	        var ds = $G.DataContext.getDataSource("Bill");
	        var config = _this._getLoadConfig(false);
	        config.notLoadToDataSource = true;
	        config.success = function (result) {
	            //序列化请求返回数据，请求返回的数据Json规则：如果多个实体引用一个对象，那么只序列化一个，其他引用使用关键字_reference：[number]。
	            result = $G.decodeJSONData(result);
	            //2014-07-29 俊哥提供，解决复制新增弹性域字段不能复制的bug
	            var oldChange = window.regFieldChange_doChange; //!!! 新增代码
	            window.regFieldChange_doChange = Ext.emptyFn; //!!! 新增代码
	            // $G.Actions.getAction("actNew").execute();   //新增一条记录
	            _this.actNew_Handler({});
	            window.regFieldChange_doChange = oldChange; //!!! 新增代码
	            window.regFieldChange_doChange(ds, "update"); //!!! 新增代码

	            var excludeFieldListArry = _this._getNotCopyFieldArray();
	            ds.fields.each(function (f) {
	                if (!f.primaryKey && (excludeFieldListArry.indexOf(f.name) == -1)) {
	                    var list = f.name.split('.');
	                    if (list.length == 1) {
	                        if (result[f.name] === undefined) {
	                            ds.setFieldValue(f.name, null);
	                        } else {
	                            ds.setFieldValue(f.name, result[f.name]);
	                        }
	                    } else if (list.length == 2) {
	                        if (!Ext.isEmpty(result[list[0]]))
	                            ds.setFieldValue(f.name, result[list[0]][list[1]]);
	                    }
	                }
	            }, this);
	            ds.fireEvent("aftercopy", result); //触发事件以便派生类调用
	        }
	        ds.AP_loadDataById(id, config);
	    },
	    //[End]

	    //[Start]
	    _getSaveConfig: function () {
	        ///<summary>保存Config,可重写</summary>
	        var billChangeSummary;

	        //需要合并树形细表数据的ChangeSummar
	        Ext.ComponentMgr.all.each(function (cmp) {
	            if (cmp.getXType() == "gtptreegridpanel") {
	                if (cmp.ape_BillDetailTree == "true") {
	                    billChangeSummary = cmp.AP_getMergeChangeSummary(billChangeSummary);
	                }
	            }
	        });

	        if (billChangeSummary) return { changeSummary: billChangeSummary };
	        else return {}
	    },
	    //[End]

	    //[Start]
	    actSave_Handler: function (sender) {
	        ///<summary>保存,暂存的调用方法_this.actSave_Handler({isTempSave:true})</summary>
	        sender = sender || {};
	        var ds = $G.DataContext.getDataSource("Bill");
	        var rec = ds.getDataRecord();
	        if (rec) {
	            var view = $G.getCmp("billEntityView");
	            view.stopEditing();
	            var bValid = true;
	            if (sender) {
	                if (!sender.isTempSave) bValid = _this._isValid();
	                _this._keepStateAfterSave = sender.keepStateAfterSave; //是否保存后保留当前页面状态
	            }
	            if (bValid) {  //判断有效性..
	                var pvName = "";
	                var failureError;

	                var bFlowing = sender && sender.taskIDList;
	                if (!Ext.isEmpty($G.PageExtend.AP_PVName)) pvName = $G.PageExtend.AP_PVName;

	                //保存在线编辑附件
	                if (!Ext.isEmpty($G.Page.actDocumentEditOnlineSave)) {
	                    $G.Page.actDocumentEditOnlineSave();
	                }

	                var config = _this._getSaveConfig();
	                if (bFlowing) {
	                    config.async = false;
	                    var funcFailure = function (arguments) {
	                        failureError = new Error("Save_Failure");
	                    }
	                    if (Ext.isEmpty(config.failure)) config.failure = funcFailure;
	                    else {
	                        if (Ext.isArray(config.failure)) config.failure.push(funcFailure);
	                        else if (Ext.isFunction(config.failure)) {
	                            var _preFailure = config.failure;
	                            config.failure = new Array();
	                            config.failure.push(_preFailure);
	                            config.failure.push(funcFailure);
	                        }
	                    }
	                }
	                if (sender.closeTab) ds.closeTab = sender.closeTab;

	                if (!Ext.isEmpty($G.PageExtend.AP_BlobFields)) config.queryLobFields = $G.PageExtend.AP_BlobFields;

	                ds.AP_saveChangeReturnEntity(pvName, config);
	                if (failureError instanceof Error) {
	                    throw failureError;
	                }
	            }
	        }

	    },
	    //[End]

	    //[Start]
	    actNew_Handler: function (sender) {
	        ///<summary>如果 sender.isFirstLoad 为 true说明是页面加载时触发的,派生类重写时可能会用到此参数</summary>

	        _this.__saveHistory(); //保存历史记录..
	        var ds = $G.DataContext.getDataSource("Bill");
	        while (ds.getDataRecord()) {
	            ds.removeRecord(0);
	            ds.commitChanges(true);
	        }
	        Ext.ComponentMgr.all.each(function (cmp) {
	            if (cmp.getXType() == "gtptreegridpanel") {
	                $G.getCmp(cmp.getId()).getTreeGridStore(); //这样就会清空数据的
	            }
	        });
	        ds.addRecord();
	    },
	    //[End]

	    //[Start]
	    actCopy_Handler: function (sender) {
	        ///<summary>复制:actCopy</summary>
	        var ds = $G.DataContext.getDataSource("Bill");
	        var rec = ds.getDataRecord();
	        if (rec) {
	            _this._copyAddRecord(rec.id); //复制新增
	        }
	    },
	    //[End]

	    //[Start]
	    actModify_Handler: function (sender) {
	        ///<summary>编辑:actModify</summary>
	        var ds = $G.DataContext.getDataSource("Bill");
	        var rec = ds.getDataRecord();
	        if (rec) {
	            var ret = Ext.AppFrame.Bill.PrejudgeModifyAuth(rec.id, rec.data.Dept.FullDeptId);
	            if (ret < -1) {
	                return; //说明此时由服务端抛出异常
	            }
	            if (ret == false)
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.AppFrame_NoAuth);
	            else {
	                //判断是否需要业务锁，申请业务锁，锁定10分钟
	                var isBizLock = Ext.AppFrame.Common.getModuleApfExtend("APE_BizLock");
	                if (isBizLock == true || isBizLock == "true") {
	                    var resultApplyBizLock = Ext.AppFrame.Common.addBizLock(rec.data.__type, rec.data.ID, _this._bizLockTimeout(), false);
	                    if (!resultApplyBizLock) {
	                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoModifyAtSameTime);
	                        return;
	                    }
	                    else {
	                        $G.Page.__bizLockName = true;
	                    }
	                }
	                if (rec.data.Effective)
	                    $G.States.setCurrentState("STATE_EFFECTIVE");
	                else
	                    $G.States.setCurrentState("STATE_EDIT");
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actDelete_Handler: function (sender) {
	        ///<summary>删除:actDelete</summary>
	        var ds = $G.DataContext.getDataSource("Bill");
	        var rec = ds.getDataRecord();
	        var currentId = ds.getDataRecord().id;
	        var config =
	        {
	            success: function (result) {
	                if (currentId != $G.Page.oldId && $G.Page.oldId && parseInt($G.Page.oldId) > 0) ds.AP_loadDataById($G.Page.oldId, _this._getLoadConfig(false));
	                else {
	                    setTimeout("$G.close(false)", 500);
	                }
	            }
	        };
	        sender = sender || {};
	        if (sender.msg) config.msg = sender.msg;
	        if ($G.Params.isTreeBill) config.isTreeBill = true;
	        ds.AP_delete([rec], config);
	    },
	    //[End]

	    //[Start]
	    actRefresh_Handler: function (sender) {
	        ///<summary>刷新:actRefresh</summary>
	        var ds = $G.DataContext.getDataSource("Bill");
	        var rec = ds.getDataRecord();
	        if (rec) {
	            _this._keepGridFocusedRow(false);
	            ds.AP_loadDataById(rec.id, _this._getLoadConfig(false));
	        }

	    },
	    //[End]

	    //[Start]
	    _getBackParams: function (params) {
	        ///<summary>设置返回的页面参数</summary>
	        return params; //子类重写
	    },
	    //[End]

	    //[Start]
	    actBack_Handler: function (sender) {
	        ///<summary>返回:actBack</summary>
	        var pu = Gtp.net.Global.parseURL(document.referrer);
	        var params = pu.params;
	        if ($G.Params.id) {
	            params.FocusId = $G.Params.id;
	        }
	        params = _this._getBackParams(params);
	        _this.__beforeRemovePage();

	        $G.open({
	            url: pu.page,
	            target: "_self",
	            parameters: params
	        });
	    },
	    //[End]

	    //[Start]
	    __navRecord: function (isNext) {
	        //导航到上一条或下一条
	        if ($G.Page.__ParentQueryPlan) {
	            var ds = $G.DataContext.getDataSource("Bill");
	            var rec = ds.getDataRecord();
	            if (rec) {
	                _this.__saveHistory(); //记住
	                if (isNext) _this._navMode = "next"; else _this._navMode = "prior";
	                var actionName;
	                if (isNext) {
	                    actionName = "GetNextEntity";
	                }
	                else {
	                    actionName = "GetPreviousEntity";
	                }
	                ds.AP_loadDataById(rec.id,
                    {
                        action: actionName,
                        args: [rec.id, ds.type, $G.Page.__ParentQueryPlan]
                    }
                    );
	            }

	        }
	    },
	    //[End]

	    //[Start]
	    actPrior_Handler: function (sender) {
	        ///<summary>上一条:actPrior</summary>
	        _this.__navRecord(false);
	    },
	    //[End]

	    //[Start]
	    actNext_Handler: function (sender) {
	        ///<summary>下一条:actNext</summary>
	        _this.__navRecord(true);
	    },
	    //[End]

	    //[Start]
	    actSubmit_Handler: function (sender) {
	        ///<summary>提交，默认只支持提交一条记录:actSubmit</summary>
	        var ds = $G.DataContext.getDataSource("Bill");
	        var record = ds.getDataRecord();
	        if (record) {

	            //执行成功后事件
	            var submitSuccess = function () {
	                var ds = $G.DataContext.getDataSource("Bill");
	                var config = _this._getLoadConfig(false);
	                _this._canSetActionStatus = false;

	                config.success = function (result) {
	                    if (sender.callback && Ext.isFunction(sender.callback)) {
	                        sender.callback(result);
	                    }
	                    _this._canSetActionStatus = true;
	                    _this._setActionsEnableStuas(_this._getDisabledActions(), false);
	                    _this._setActionsEnableStuas(_this._getEnabledActions(), true);
	                };
	                ds.AP_loadDataById(record.id, config);
	            };
	            //提交记录的所属部门
	            var fullDeptId = record.data.Dept && record.data.Dept.FullDeptId ? record.data.Dept.FullDeptId : 0;

	            //提交、反提交参数
	            var config = {
	                ds: ds,
	                controller: Gtp.net.Global.getPageController(),
	                reverseSubmitAction: "ReverseSubmit",
	                reverseSubmitArgs: [record.id, ds.type],
	                reverseSubmitSuccess: submitSuccess,
	                submitAction: "SubmitBills",
	                submitActionArgs: [[record.id], ds.type, "", null],
	                submitSuccess: submitSuccess
	            };
	            //执行提交
	            //(autoShowDialog, showCheckerDialog, bizCode, fullDeptId, record, callback, args, config)
	            _this._keepGridFocusedRow(false);
	            Ext.AppFrame.Bill.Submit($G.getBizComp(), fullDeptId, record, submitSuccess, null, config, sender.autoShowProcessDialog, sender.showCheckerDialog);
	        }
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseBill.BillEditPage = _class;
})();
//</Bottom>
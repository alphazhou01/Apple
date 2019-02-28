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
	    _initTaskColumn: function (grid) {
	        ///<summary>初始化流程信息列</summary>
	        var ds = grid.dataLink.dataSource;
	        ds.fields.items.push({
	            name: "TaskName",
	            alias: "节点名称",
	            type: "string",
	            dataType: "String",
	            isNullable: true,
	            trimBlank: true
	        });
	        var column = new Ext.ux.grid.TextColumn({
	            dataIndex: "TaskName",
	            header: "节点名称",
	            id: "col_TaskName",
	            width: 100,
	            editable: false,
	            xtype: "textcolumn"
	        });

	        grid.colModel.columns.push(column);
	    },
	    //[End]

	    //[Start]  
	    _setQueryPlanOnQueryBox: function (queryPlan) {
	        ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>
	        if ($G.PageExtend.APE_QueryDataByPortalDept == "true") { //是否按门户组织过滤数据
	            var cmp = Ext.getDom("Qfd_FullDeptId"); // $G.getCmp("Qfd_FullDeptId");
	            if (cmp) {
	                if (!Ext.isEmpty(cmp.value)) {
						return;
					}
				}
	                    var qboxPlan = Ext.ux.query.CurrentSelection.queryPlan;
	                    var filter = queryPlan.getFilterAll("filter_FullDeptId_Eq");
	                    var deptFullIdText = Ext.AppFrame.Common.getDeptFullId();
	                    if (filter) {
	                        filter.setValue({ Id: deptFullIdText, Name: Ext.AppFrame.Common.getDeptName() });
	                    }

	                    if (!Ext.isEmpty(qboxPlan)) {
	                        for (var j = 0; j < qboxPlan.filters.length; j++) {
	                            if (qboxPlan.filters[j].propertyName == "FullDeptId" && qboxPlan.filters[j].op == "eq") {
	                                qboxPlan.filters[j].value = deptFullIdText;
	                            }
	                        }
	                    }

	                    if ($G.PageExtend.APE_IncludeChildDeptData != true) {
	                        deptFullIdText = "";
	                    }
	                    var filter = queryPlan.getFilterAll("filter_FullDeptId_Like");
	                    if (filter) {
	                        filter.setValue({ Id: deptFullIdText, Name: Ext.AppFrame.Common.getDeptName() });
	                    }
	                    if (!Ext.isEmpty(qboxPlan)) {
	                        for (var j = 0; j < qboxPlan.filters.length; j++) {
	                            if (qboxPlan.filters[j].propertyName == "FullDeptId" && qboxPlan.filters[j].op == "llk") {
	                                qboxPlan.filters[j].value = deptFullIdText;
	                            }
	                        }
	                    }
	                //}
	            //}
	        }

	    },
	    //[End]

	    //[Start]
	    _initFilterDeptNameControl: function () {

	        var qfdfilter = $G.getCmp("Qfd_FullDeptId");
	        if (qfdfilter) {
	            var billView = $G.getCmp("billView");
	            if (billView) {
	                billView.apf_queryPlan.filters.items[0].add({ field: "DeptName", op: "lk", value: "", skipValue: "", name: "Dyn_filter_DeptName" });
	            }

	            qfdfilter.dataIndex = "";
	            qfdfilter.setEditable(true);
	            qfdfilter.isClearAll = false;
	            qfdfilter.on("beforedelete", function () {
	                var filter = billView.apf_queryPlan.getFilterAll("Dyn_filter_DeptName");
	                if (filter) {
	                    filter.setValue("");
	                }
	                return false;
	            }, this);
	            qfdfilter.on("afterlookup", function (data) {
	                if (data && data.OutEntity) {
	                    var cmp = Ext.getDom("Qfd_FullDeptId");
	                    if (cmp) cmp.value = data.OutEntity.Name;
	                    var filter = billView.apf_queryPlan.getFilterAll("Dyn_filter_DeptName");
	                    if (filter) {
	                        filter.setValue("");
	                    }
	                }
	            }, this);
	            qfdfilter.on("textchange", function () {
	                var filter = billView.apf_queryPlan.getFilterAll("Dyn_filter_DeptName");
	                if (filter) {
	                    var cmp = Ext.getDom("Qfd_FullDeptId");
	                    if (cmp) filter.setValue(cmp.value);
	                }
	                if ($G.PageExtend.APE_QueryDataByPortalDept == "true") {
	                    _this._setQueryPlanOnQueryBox(billView.apf_queryPlan);
	                }
	                else {
	                    var dataIndexs = ["filter_FullDeptId_Eq", "filter_FullDeptId_Like"];
	                    for (var i = 0; i < dataIndexs.length; i++) {
	                        filter = billView.apf_queryPlan.getFilterAll(dataIndexs[i]);
	                        if (filter) {
	                            filter.setValue("");
	                        }
	                    }

	                }

	            }, this);

	        }
	    },
	    //[End]

	    //[Start]
	    _initQueryBox: function (grid, config, injectToolBarName, injectIndex) {
	        ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>
	        if (!config) {
	            config = {
	                queryViewControlName: "queryView"
	            }
	        }
	        else if (config.queryViewControlName) {
	            config.queryViewControlName = "queryView";
	        }
	        if (!config.getCriteira) {
	            //自己构建函数.
	            config.getCriteira = function (queryBoxParam) {
	                var qp = grid.apf_queryPlan;
	                _this._setQueryPlanOnQueryBox(qp);
	                if (qp) {
	                    qp.currentPage = 1;
	                    if (queryBoxParam.size > 0) qp.pageSize = queryBoxParam.size;
	                }
	                _this._loadData({
	                    resetpage: true,
	                    isExpandAll: true,
	                    pageSize: qp.pageSize,
	                    queryPlanParamProperties: _this._getQueryPlanParamProperties(),
	                    noCacheParam: true
	                });

	            }
	        }

	        Ext.AppFrame.Util.createQueryBox(grid, config);

	        Ext.ux.query.showQueryBox(injectToolBarName, injectIndex);
	        if (grid.apf_queryBox) {
	            grid.apf_queryBox.on("queryBoxMenuClick", function (sm, index) {
	                if (index == 0) {
	                    if (Ext.getDom("Qfd_FullDeptId")) Ext.getDom("Qfd_FullDeptId").value = "";
	                }
	            }, this);
	        }
	    },
	    //[End]

	    //[Start]    
	    _showQueryBox: function (grid) {
	        if ($G.PageExtend.APE_ShowQueryBoxBottom == "true") {
	            var toolbar = $G.getCmp("billView_QueryBoxToolbar");
	            if (toolbar) toolbar.setVisible(false);
	            var toolbar = $G.getCmp("billView_toolbar");
	            if (toolbar) {
	                if (!$G.getCmp("TbarFill_QueryBox")) toolbar.add(new Ext.Toolbar.Fill());
	                $G.Page._initQueryBox(grid, null, "billView_toolbar");
	            }
	        }
	        else {
	            $G.Page._initQueryBox(grid, null, "billView_QueryBoxToolbar", 1);
	        }
	    },
	    //[End]

	    //[Start]
	    _setLinkColumn: function (grid, fields) {
	        ///<summary>构造超链接字段</summary>
	        return Ext.AppFrame.Common.setLinkColumn(grid, fields, function (value, metadata, record, rowIndex, colIndex, store) {
	            return '<a onclick="$G.Page.actView_Handler();" href="#">' + value + '</a>';
	        });
	    },
	    //[End]

	    //[Start]
	    _initAttachColumn: function (grid) {
	        ///<summary>绑定附件列</summary>
	        //设置为包含附件的列为图标形状
	        var cm = grid.getColumnModel();
	        var col = cm.getColumnById("col_HasAttach");
	        if (col) {
	            col.sortable = false;
	            var imgUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/GTP/AppFrameV2/Common/Images/Attach.gif";
	            col.header = '<img src="' + imgUrl + '">';
	            col.addRenderer(col.id + "_renderer", function (value, metadata, record, rowIndex, colIndex, store) {
	                if (record.get("HasAttach")) {
	                    return '<a onclick="$G.Page._showAttach(' + record.id.toString() + ');" href="#"><img src="' + imgUrl + '" title="附件查看"></img></a>';
	                }
	            }, this);
	        }

	        var entityType = grid.dataLink.dataSource.type;

	        var entityName = entityType.substr(entityType.lastIndexOf(".") + 1, entityType.length - entityType.lastIndexOf(".") - 1);

	        $G.Page.attachPanel = new Ext.AppFrame.AttachItemPanel(
                {
                    title: "",
                    //title: GTP.AppFrameV2.Res.Attachment + GTP.AppFrameV2.Res.View,
                    attachEntityName: entityName, //相关业务实体名称(非全名称)
                    appNamespace: $G.getBizComp(),  //相关业务的命名空间
                    fileStatus: false,     //fileStatus true编辑附件（添加，删除，下载，浏览）功能，false：查看状态（下载，浏览）功能
                    id: "Bill_Attach_Panel",
                    multiSelect: false,
                    oneSelf: '3',        //  oneSelf:1  显示自己的附件； oneSelf：2 显示他人的附件； 3 显示所有的附件；
                    permission: true,    //用户是否可以删除附件的权限， true：可以删除所以人的附件；false:只能删除自己的附件；
                    //renderTo: $G.getCmp("AttachPanel"),   //附件到当前页面的容器内
                    readOnly: true
                });

	        new Ext.Window({
	            id: "AttachView",
	            hidden: true,
	            height: 300,
	            width: 400,
	            billId: 0,
	            items: {
	                id: "AttachPanel",
	                xtype: "panel",
	                layout: "fit",
	                border: false,
	                autoScroll: true,
	                items: [$G.Page.attachPanel]
	            },
	            layout: "fit",
	            bodyStyle: "background-color: #fff;",
	            iconCls: "icon-application",
	            padding: 2,
	            title: "附件列表",
	            modal: true,
	            listeners: {
	                show: {
	                    fn: function (item) {
	                        return window.__EventHandler && Ext.isFunction(window.__EventHandler) ? __EventHandler(this, "AttachView_Show", Ext.toArray(arguments)) : null;
	                    }
	                }
	            }
	        });

	    },
	    //[End]

	    //[Start]
	    _initPageState: function () {
	        if ($G.Params.state) {
	            var state = $G.Params.state;
	            if (state == "readonly") state = "STATE_READONLY";
	            $G.Page._state = $G.States.setCurrentState(state);
	        }
	        Ext.AppFrame.Bill.InitButtonByPageExtend();
	    },
	    //[End]

	    //[Start]
	    _ResetPageStateBySelectCount: function () {
	        //没啥用，先保留吧

	    },
	    //[End]

	    //[Start]
	    _initPageConfig: function () {
	        ///<summary>初始化页面配置，默认从表单扩展参数中读取，子类页面为了效率也可重写.</summary>
	        Ext.AppFrame.Common.getModuleApfExtend(); //初始化业务表单的扩展数据
	    },
	    //[End]

	    //[Start]
	    __hideDeptTreeSplit: function (renderToPanel) {
	        //该方法用于隐藏组织机构树上控制展开折叠的split小箭头
	        if (renderToPanel) {
	            if (Ext.isString(renderToPanel)) { renderToPanel = $G.getCmp(renderToPanel); }
	            if (Ext.isObject(renderToPanel)) {
	                //renderToPanel.setWidth(0);
	                renderToPanel.setVisible(false);
	                renderToPanel.doLayout();
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    __showDeptTreeSplit: function (renderToPanel) {
	        //该方法用于隐藏组织机构树上控制展开折叠的split小箭头
	        if (renderToPanel) {
	            if (Ext.isString(renderToPanel)) { renderToPanel = $G.getCmp(renderToPanel); }
	            if (Ext.isObject(renderToPanel)) {
	                //renderToPanel.setWidth(panelWidth);
	                renderToPanel.setVisible(true);
	                renderToPanel.doLayout();
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    __createDeptTree: function (config, renderToPanel) {
	        //构造组织机构树
	        if (!config) config = {};
	        ($G.PageExtend.LeftDeptBizType ? $G.PageExtend.LeftDeptBizType : null);
	        if (!config.bizTypeCode) config.bizTypeCode = ($G.PageExtend.LeftDeptBizType ? $G.PageExtend.LeftDeptBizType.replace(/;/ig, ",") : null);
	        if (!config.levelTypeCode) config.levelTypeCode = ($G.PageExtend.LeftDeptLevelType ? $G.PageExtend.LeftDeptLevelType.replace(/;/ig, ",") : null);

	        var loadDataWhenNodeClick = function () {
	            if (Ext.isEmpty(_this._selectedFullDeptId)) _this._selectedFullDeptId = Ext.AppFrame.Common.getDeptFullId();
	            _this.__setDeptFilter(_this._selectedFullDeptId);
	            var defaultConfig = {
	                resetpage: true,
	                isExpandAll: true,
	                queryPlanParamProperties: _this._getQueryPlanParamProperties()
	            };

	            var billView = $G.getCmp("billView");
	            billView.AP_loadData(defaultConfig);
	        };

	        var nodeClick = function (node) {
	            var DName = node.attributes ? node.attributes.Name : node.data.Name;
	            var DCode = node.attributes ? node.attributes.Code : node.data.Code;
	            var DFullId = node.attributes ? node.attributes.FullId : node.data.FullId;
	            var DSubType = node.attributes ? node.attributes.SubType : node.data.SubType;

	            if (DFullId) {

	                //if (DSubType == "0") {
	                _this._selectedFullDeptId = DFullId;
	                _this._selectedDeptName = DName;
	                _this._selectedDeptCode = DCode;
	                //}
	                loadDataWhenNodeClick();
	            }
	        };
	        if (!renderToPanel) {
	            renderToPanel = "layoutPanel1";

	        }
	        //如果没有依赖部门，将当前门户组织作为依赖部门
	        var defaultConfig = {
	            id: "tvOrgDeptTree", //传入Id吧
	            panelWidth: 210,
	            deployDeptId: Ext.AppFrame.Common.getDeptId()
	        }
	        config = Ext.applyIf(config || {}, defaultConfig);

	        if (Ext.isString(renderToPanel)) { renderToPanel = $G.getCmp(renderToPanel); }
	        if (renderToPanel) {
	            //renderToPanel.setWidth(250);

	            var t = [
                    {
                        boxLabel: '含下级',
                        checked: true,
                        xtype: "checkbox",
                        tooltip: '设置是否包括下级机构数据',
                        listeners: {
                            check: function (el, checked) {
                                $G.PageExtend.APE_IncludeChildDeptData = checked;
                                loadDataWhenNodeClick();
                            }
                        }
                    }
                    ];

	            var tree = Ext.AppFrame.DeptCommon.createDeptTree(nodeClick, renderToPanel, config);
	            tree.getTopToolbar().add(t);
	            var cmp = $G.getCmp("tvOrgDeptTree_edQuery");
	            if (cmp) {
	                cmp.setWidth(120);
	            }
	            tree.events["resize"] = true; //取消resize事件
	            return tree;
	        }

	        return null;
	    },
	    //[End]

	    //[Start]
	    _initDeptTree: function (config, renderToPanel) {
	        ///<summary></summary>
	        if (!renderToPanel) {
	            renderToPanel = "layoutPanel1";
	        }

	        var isShowDeptTree = false;
	        var showDeptTree = $G.Params.showDeptTree;
	        if (showDeptTree == true) //是否显示组织机构树判断依据：输入参数>业务表单扩展数据
	        {
	            isShowDeptTree = true;
	        }
	        else if (showDeptTree == false) {
	            isShowDeptTree = false;
	        }
	        else {
	            var ape_showDeptTree = Ext.AppFrame.Common.getModuleApfExtend("APE_ShowDeptTree");
	            var d = $G.PageExtend["APE_ShowDeptTree"];
	            if (ape_showDeptTree == "true") {
	                isShowDeptTree = true;
	            }
	        }
	        //如果
	        if (isShowDeptTree == false) {
	            _this.__hideDeptTreeSplit(renderToPanel);
	        }
	        else {
	            //-----------------注释下面，树配置都来自元数据扩展数据，代码不支持
	            //	            //---------------门户组织下，只有一个组织有权限，隐藏组织树。但是可能左侧的组织树数据时用户自定义获取，所以还是需要加载组织树，例如交建项目的左侧组织树就是获取全部组织
	            //	            _this._showDeptTreeWith1Node = null; //true有一个节点也要显示部门树,false有一个节点不显示树
	            //	            _this._deptTreeHided = false;        //true:部门树已被隐藏,false:部门树没有隐藏
	            //	            //只有一个组织节点，是否显示左侧组织机构树
	            //	            if ($G.PageExtend["APE_ShowDeptTreeWith1Node"] != "true") {
	            //	                _this._showDeptTreeWith1Node = false;
	            //	                var authDeptTreeCount = ($G.PageContext.AuthDeptTreeCount && $G.PageContext.AuthDeptTreeCount > 0) ? $G.PageContext.AuthDeptTreeCount : 0;
	            //	                if (authDeptTreeCount <= 1) {
	            //	                    _this.__hideDeptTreeSplit(renderToPanel);
	            //	                    _this._deptTreeHided = true;
	            //	                }
	            //	            }
	            //	            else _this._showDeptTreeWith1Node = true;
	            //上面注释，使用此处替换
	            var authDeptTreeCount = ($G.PageContext.AuthDeptTreeCount && $G.PageContext.AuthDeptTreeCount > 0) ? $G.PageContext.AuthDeptTreeCount : 0;
	            if (authDeptTreeCount < 1) {
	                _this.__hideDeptTreeSplit(renderToPanel);
	            }
	            else if (authDeptTreeCount == 1) {
	                if ($G.PageExtend["APE_ShowDeptTreeWith1Node"] != "true") {
	                    _this.__hideDeptTreeSplit(renderToPanel);
	                }
	            }

	            $G.Page._leftDeptTreeView = _this.__createDeptTree(config, renderToPanel);

	        }
	    },
	    //[End]

	    //[Start]  
	    __setDeptFilter: function (fullId) {
	        var grid = $G.getCmp("billView");
	        var qp = grid.apf_queryPlan;
	        qp.setFilterValue("filter_FullDeptId_Eq", fullId);
	        if ($G.PageExtend.APE_IncludeChildDeptData == false)
	            qp.setFilterValue("filter_FullDeptId_Like", "");
	        else
	            qp.setFilterValue("filter_FullDeptId_Like", fullId + "/");

	    },
	    //[End]

	    //[Start]
	    _initDeptFilter: function () {
	        //初始化部门过滤条件，子类可重写
	        _this._selectedFullDeptId = Ext.AppFrame.Common.getDeptFullId();
	        _this.__setDeptFilter(_this._selectedFullDeptId);
	    },
	    //[End]

	    //[Start]
	    _getGridChangeState_NoSelectActions: function () {
	        return ["actView", "actCopy", "actModify", "actDelete", "actSubmit"];
	    },
	    //[End]

	    //[Start]
	    _gridChangeState_NoSelect: function (state) {
	        //没有选中记录时
	        var actions = _this._getGridChangeState_NoSelectActions();
	        for (var i = 0; i < actions.length; i++) {
	            var action = $G.Actions.getAction(actions[i]);
	            if (!!action) {
	                if (!state && _this._isAuthAction(actions[i])) action.setDisabled(false);
	                else action.setDisabled(true);
	            }
	        }

	    },
	    //[End]

	    //[Start]
	    _getGridChangeState_MultiSelectActions: function () {
	        return ["actView", "actCopy", "actModify", "actSubmit"];
	    },
	    //[End]

	    //[Start]
	    _gridChangeState_MultiSelect: function () {
	        ///<summary></summary>
	        var actions = _this._getGridChangeState_MultiSelectActions();
	        for (var i = 0; i < actions.length; i++) {
	            var action = $G.Actions.getAction(actions[i]);
	            if (!!action) action.setDisabled(true);
	        }
	        var actDelete = $G.Actions.getAction("actDelete");
	        if (!!actDelete && _this._isAuthAction("actDelete")) actDelete.setDisabled(false);
	    },
	    //[End]

	    //[Start]
	    _initToolbarStyle: function () {
	        //去掉查询方案工具栏边框与背景色
	        var billView_QueryBoxToolbar = $G.getCmp("billView_QueryBoxToolbar");
	        if (billView_QueryBoxToolbar) {
	            billView_QueryBoxToolbar.addClass("x-grid-toolbar-blank-bg");
	            billView_QueryBoxToolbar.addClass("x-grid-toolbar-noborder");
	        }
	        //去掉操作工具栏边框
	        var billView_toolbar = $G.getCmp("billView_toolbar");
	        if (billView_toolbar) {
	            billView_toolbar.addClass("x-grid-toolbar-noborder");
	            if (billView_toolbar.ownerCt) {
	                billView_toolbar.ownerCt.addClass("x-grid-toolbar-noborder");
	            }
	            //有两组工具栏，会产生2px的内间距，去掉内间距
	            billView_toolbar.ownerCt.addClass("x-panel-padding0");
	            billView_toolbar.ownerCt.setWidth(billView_toolbar.ownerCt.getWidth() + 7);
	            billView_toolbar.ownerCt.doLayout();
	            billView_toolbar.ownerCt.setWidth(billView_toolbar.ownerCt.getWidth() - 1);
	            billView_toolbar.ownerCt.doLayout();
	        }
	        //去掉分组工具栏边框
	        var billView_pagingbar = $G.getCmp("billView_pagingbar");
	        if (billView_pagingbar)
	            billView_pagingbar.addClass("x-grid-toolbar-noborder");
	    },
	    //[End]

	    //[Start]   
	    __initDateTimeFilterFunc: function () {
	        //设置Filter日期的数值获取
	        if (Gtp.net.Filter) {
	            var _old_getKeyValue = Gtp.net.Filter.prototype.getKeyValue;
	            Gtp.net.Filter.override({
	                getKeyValue: function (exprContext) {
	                    if (this.field == "CreateTime" || this.field == "BizDate") {
	                        if (this.op == "le" || this.op == "lt") {
	                            //日期+1;
	                            var r, v = this.getValue(exprContext);
	                            if (!Ext.isEmpty(v)) {
	                                return v.add(Date.DAY, 1); //+1
	                            }
	                        }
	                    }
	                    return _old_getKeyValue.call(this);
	                }
	            });
	        }

	    },
	    //[End]

	    //[Start]
	    _getEnabledActions: function () {
	        //可用的按钮
	        var ret = _super._getEnabledActions();
	        var s = $G.CurrentState;
	        var selectedRows = $G.getCmp("billView").AP_selectRows();
	        if (selectedRows.length > 0) {
	            var record = selectedRows[0];
	            if (s != "STATE_READONLY" && $G.PageExtend.APE_EffectiveCanEdit == "true") {
	                //_this._setActionsEnableStuas(["actModify"], true);
	                var stateName = Ext.AppFrame.Bill.getBillStateName(record);
	                if (stateName != "Approving") ret.push("actModify");
	            }
	        }
	        return ret;

	    },
	    //[End]



	    //[Start]
	    _init: function () {
	        ///<summary>初始化设置</summary>
	        _super._init.call();

	        _this.__initDateTimeFilterFunc();
	        //指定某个TAB聚焦的时候执行的事件。cb为事件方法，id为TAB的ID（有则通过此ID找TAB）,如果为空，则查找当前TAB
	        Portal.Tab.SetFocusTabEvent(function (tab, iframe) {
	            _this.actRefresh_Handler();
	        }, Portal.Tab.CurrentTabID());

	        _this._initPageConfig();        //设置页面扩展参数

	        Ext.AppFrame.Bill.CallFlow_beforeAdvance(false); //清空流程的相关功能,否则如果设置单据列表为流程界面，可能会有问题
	        var grid = $G.getCmp("billView");

	        if (grid) {
	            grid.on("rowdblclick", function (e) {
	                $G.Actions.getAction("actView").execute();
	            }, this);
	        }

	        //流程审批节点信息
	        if ($G.PageExtend.APE_ShowCurrentTask && $G.PageExtend.APE_ShowCurrentTask == "true") {
	            _this._initTaskColumn(grid);
	        }
	        var cmp = $G.getCmp("Qfd_FullDeptId");
	        if (cmp) {
	            cmp.on("beforelookup", function (dialogOpt) {
	                ///<summary>BeforeLookup</summary>
	                dialogOpt.dialogArgs.deployFrame = true;
	                dialogOpt.dialogArgs.deployIsRoot = true;
	            }, this);
	        }

	        //查询方案
	        _this._initFilterDeptNameControl(); //TP-31324
	        $G.Page._showQueryBox(grid);

	        if ($G.PageExtend.LinkField) {
	            var fields = $G.PageExtend.LinkField.split(";");
	            _this._setLinkColumn(grid, fields);
	        }

	        grid.apf_ds.on("load", function (data, result, apend) {
	            if (!Ext.isEmpty(result.List)) {
	                for (var i = 0; i < result.List.length; i++) {
	                    if (result.List[i].Name == "Ticks") {
	                        $G.Page._Ticks = result.List[i].Value;
	                        break;
	                    }
	                }
	            }
	        });

	        if (grid.getXType() != "multigroupingpanel") {
	            grid.on("headerclick", function (item, columnIndex, e) {
	                if (grid.apf_ds.AP_SortDataOnHeaderClick(item, columnIndex, e)) {
	                    _this._loadData({});
	                }
	            }, grid);
	        }

	        //2014-08-08 update 支持行多选操作
	        if (grid.selectMode == "row") {
	            grid.on("rowclick", function (sm, rowIndex, e) {
	                if (sm instanceof Ext.grid.RowSelectionModel) {
	                    _this._setAllActionByAuth();
	                }
	                _this._setActionsEnableStuas(_this._getEnabledActions(), true);
	                _this._setActionsEnableStuas(_this._getDisabledActions(), false);
	            }, this);
	        }
	        else if (grid.selectMode == "checkbox") {


	            grid.on('selectionchange', function (sm) {
	                if (sm instanceof Ext.grid.CheckboxSelectionModel) {
	                    if (sm.selections.length == 0) {
	                        _this._gridChangeState_NoSelect(true);
	                    }
	                    else if (sm.selections.length == 1) {
	                        if (!sm.lastActive) {
	                            var ds = $G.DataContext.getDataSource('BillQuery');
	                            ds.setCurrentIndex(sm.selections.items[0], null, true);
	                        }
	                        else {
	                            var ds = $G.DataContext.getDataSource('BillQuery');
	                            ds.fireEvent("scroll", ds, ds.currentIndex);
	                        }

	                    }
	                    else {
	                        _this._gridChangeState_MultiSelect();
	                    }
	                }
	            });
	        }
	        _this._initPageState();
	        _this._initDeptTree();          //初始化左侧组织机构树分类
	        $G.PageExtend.APE_IncludeChildDeptData = true;
	        if ($G.PageExtend.APE_QueryDataByPortalDept == "true") {
	            _this._initDeptFilter();
	        }
	        $G.Page._initAttachColumn(grid);
	        _this._initToolbarStyle();      //增加样式定义

	        var viewport = $G.getCmp("viewport");
	        viewport.doLayout();
	    },
	    //[End]

	    //[Start]
	    _redirectEditPage: function (id, state, params, target) {
	        ///<summary>重定向编辑页面，默认打开新Tab方式</summary>


	        if (Ext.isEmpty(_this.EditPage)) _this.EditPage = Ext.AppFrame.Common.getModuleApfExtend("APE_EditPage");
	        if (_this.EditPage == "(null)") {
	            _this.EditPage = $G.getPageFullName().replace("ListPage", "EditPage");
	        }
	        var url = $G.getPageURLByFullName(_this.EditPage);
	        if (!url) {
	            Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.Hint, "编辑页没有配置！");
	            return;
	        }

	        //将当前页面的输入参数传入到编辑页
	        var params_config = $G.Params;
	        if (params_config.menuitemid) delete params_config.menuitemid;

	        if (params_config.frame) delete params_config.frame;
	        if (params_config.tabID) delete params_config.tabID;
	        if (params_config.layout) delete params_config.layout;

	        params = Ext.applyIf(params || {}, params_config);

	        if (id) params.id = id;
	        else if (params.id) delete params.id; //此处需要删除params.id,否则新增单据会读取该id，这样就会当成是编辑单据。

	        if ($G.Page._Ticks) params.ticks = $G.Page._Ticks;

	        var billView = $G.getCmp("billView");
	        if (billView && billView.getXType() == "gtptreegridpanel") params.isTreeBill = true;

	        //默认只读状态
	        if (!state) state = "STATE_READONLY";
	        params.state = state;
	        if (!target) target = "_tab";
	        if (!Ext.isEmpty(params.target)) target = params.target;

	        //按照当前左侧选择的部门初始化所属部门
	        if ($G.PageExtend.AP_UseLeftDeptTreeSelectDept == "true") {
	            if (!Ext.isEmpty(_this._selectedFullDeptId)) params.LeftDeptselectedFullId = _this._selectedFullDeptId;
	            if (!Ext.isEmpty(_this._selectedDeptName)) params.LeftDeptselectedName = _this._selectedDeptName;
	            if (!Ext.isEmpty(_this._selectedDeptCode)) params.LeftDeptselectedCode = _this._selectedDeptCode;
	        }

	        params.target = target;

	        var getTabTitle = function () {
	            var haveTop = Portal.Tab.CanGetTop();
	            var id = Portal.Tab.GetTabIDByParam();
	            if (haveTop && !Ext.isEmpty(id)) {
	                var tab = top.tabs.FindTab(id);
	                if (tab) {
	                    return tab.innerText;
	                }
	            }
	            return document.title;
	        }
	        params.title = getTabTitle();
	        _this.createSubTab(document.title, url, params, id);
	    },
	    //[End]

	    //[Start]
	    createSubTab: function (title, url, params, id) {
	        var _moduleCode = $G.getModuleCode();
	        var suffix = params.suffix ? params.suffix : _moduleCode.replace(/[.]/g, "_") + "_" + id;
	        //该函数为实际业务中js函数，名称不固定
	        if (params.target != "_self" && Portal.Tab.CanMakeTab()) {
	            for (var k in params) {
	                if (k) {
	                    if (!Ext.isEmpty(params[k])) {
	                        if (url.indexOf("?") > 0) {
	                            //encodeURIComponent将 #之类的转换为 %23
	                            url = url + "&" + k + "=" + encodeURIComponent(params[k].toString());
	                        }
	                        else {
	                            url = url + "?" + k + "=" + encodeURIComponent(params[k].toString());
	                        }
	                    }
	                }
	            }
	            var grid = $G.getCmp("billView");
	            if (grid.__currentQueryPlan)
	                params.currentQueryPlan = grid.__currentQueryPlan;
	            Portal.Tab.Show({ id: "AppFrameV2Tab_" + suffix, title: title, url: url, pid: Portal.Tab.CurrentTabID(), arguments: params });
	        }
	        else {
	            if (params.target != "_self") params.target = "_modal";
	            $G.open({
	                url: url,
	                title: title,
	                target: params.target,
	                parameters: params
	            });
	        }
	    },
	    //[End]

	    //[Start]
	    _getQueryPlanParamProperties: function () {
	        ///<summary>查询方案的其他属性,可扩展</summary>
	        var list = new Array();
	        list.push({ Name: "ctrlType", RelationPath: $G.getCmp("billView").getXType() }); //控件类型
	        if ($G.Page._Ticks)
	            list.push({ Name: "Ticks", RelationPath: $G.Page._Ticks });
	        return list;
	    },
	    //[End]

	    //[Start]
	    _loadData: function (config) {
	        ///<summary>加载页面数据，11.25新加函数</summary>
	        var billView = $G.getCmp("billView");
	        var defaultConfig = {
	            resetpage: true,
	            isExpandAll: true,
	            queryPlanParamProperties: _this._getQueryPlanParamProperties()
	        };

	        config = Ext.applyIf(config || {}, defaultConfig);
	        //	        //****************页面打开时，显示查询方案，如果有默认查询方案，不显示********************//
	        //	        var queryBoxParam = Ext.ux.query.getDefaultScheme(billView.apf_ds.type, 'grid'); //获取设置的默认查询方案

	        //	        if (!queryBoxParam) {
	        //	            Ext.ux.query.showSchemeManager($G.Page._queryBox, true, true, function (queryBoxParam) {
	        //	                if (queryBoxParam) {
	        //	                    config.args = queryBoxParam;
	        //	                    billView.AP_loadData(config);
	        //	                }
	        //	            })
	        //	        } else {
	        //	            config.args = queryBoxParam;
	        if (config.firstLoad && $G.Params.queryPlan && Ext.ux.query.queryBox && Ext.ux.query.querySchemes) {
	            //var queryBoxParam = Ext.ux.query.getDefaultScheme(billView.apf_ds.type, 'grid'); //获取设置的默认查询方案
	            if (Ext.isArray(Ext.ux.query.querySchemes)) {
	                for (var i = 0; i < Ext.ux.query.querySchemes.length; i++) {
	                    if ($G.Params.queryPlan == Ext.ux.query.querySchemes[i].text) {
	                        var UserId = $G.PageContext.userId;
	                        Ext.ux.query.CurrentSelection.queryBySchemeCode($G.Params.queryPlan);
	                        return;
	                    }
	                }
	            }
	        }

	        billView.AP_loadData(config);
	        //	        }
	        //	        //****************页面打开时，显示查询方案，如果有默认查询方案，不显示********************//
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        _super.Page_DocumentReady();
	        $G.Page._loadData({ firstLoad: true });
	    },
	    //[End]

	    //[Start]
	    actNew_Handler: function (sender) {
	        ///<summary>新增:sender中可以包括初始化参数</summary>
	        var param = sender.params || {};

	        $G.Page._redirectEditPage(null, "STATE_EDIT", param);
	    },
	    //[End]

	    //[Start]
	    actView_Handler: function (sender) {
	        ///<summary>查看:actView</summary>
	        var selectedRows = $G.getCmp("billView").AP_selectRows();
	        if (selectedRows.length > 0) {
	            var record = selectedRows[0];
	            if (record) {
	                if ($G.Page._state == "STATE_READONLY")
	                    $G.Page._redirectEditPage(record.id, "STATE_READONLY");
	                else
	                    $G.Page._redirectEditPage(record.id, "STATE_VIEW");
	            }
	        }
	        else {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	        }
	    },
	    //[End]

	    //[Start]
	    actModify_Handler: function (sender) {
	        ///<summary>编辑:actModify</summary>
	        var selectedRows = $G.getCmp("billView").AP_selectRows();
	        if (selectedRows.length > 0) {
	            var rec = selectedRows[0];
	            var authRet = Ext.AppFrame.Bill.PrejudgeModifyAuth(rec.id, rec.data.FullDeptId);
	            if (authRet < -1) {
	                return; //说明此时由服务端抛出异常
	            }
	            if (authRet == false)
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
	                }
	                var stateName = "STATE_EDIT";
	                if (rec.data.Effective == true) stateName = "STATE_EFFECTIVE";
	                $G.Page._redirectEditPage(rec.id, stateName, sender.params);
	            }
	        }
	        else {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	        }
	    },
	    //[End]

	    //[Start]
	    actCopy_Handler: function (sender) {
	        ///<summary>复制:actCopy</summary>
	        var selectedRows = $G.getCmp("billView").AP_selectRows();
	        if (selectedRows.length == 1) {
	            var record = selectedRows[0];
	            if (record) $G.Page._redirectEditPage(record.id, "STATE_EDIT", { copy: 1 });
	        }
	        else {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	        }
	    },
	    //[End]

	    //[Start]
	    actDelete_Handler: function (sender) {
	        ///<summary>删除:actDelete</summary>
	        var billView = $G.getCmp("billView");
	        var selectedRows = billView.AP_selectRows();
	        var config = {
	            isBill: true,
	            success: function (result) {
	                if (billView.getXType() == "gtptreegridpanel") {
	                    _this.actRefresh_Handler();
	                }
	                else if (billView.showSummaryPanel == true) {
	                    if (!!billView.apf_ds.aggregateInfo && billView.apf_ds.aggregateInfo.length > 0) {
	                        _this.actRefresh_Handler();
	                    }
	                }
	            }
	        };
	        sender = sender || {};
	        if (sender.msg) config.msg = sender.msg;
	        billView.AP_deleteRecords(selectedRows, config);

	    },
	    //[End]

	    //[Start]
	    actRefresh_Handler: function (sender) {
	        ///<summary>刷新:actRefresh</summary>
	        if ($G.Page._attachHash && Ext.isArray($G.Page._attachHash)) {
	            $G.Page._attachHash.clear();
	            $G.Page._attachHash = null;
	        }
	        var config = {};
	        config.queryPlanParamProperties = _this._getQueryPlanParamProperties();
	        config.isExpandAll = true;
	        var grid = $G.getCmp("billView");
	        grid.AP_loadData(config);
	    },
	    //[End]

	    //[Start]
	    actSubmit_Handler: function (sender) {
	        ///<summary>提交，默认只支持提交一条记录:actSubmit</summary>
	        var grid = $G.getCmp("billView");
	        var records = grid.AP_selectRows();
	        if (records.length == 0) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);

	            return;
	        }
	        else if (records.length > 1) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord + "," + GTP.AppFrameV2.Res.NoAllowMutiRecord);

	            return;
	        }
	        //执行成功后事件
	        var submitSuccess = function (result, args) {
	            //不刷新数据了，只部分更新..
	            grid.apf_ds.AP_refreshNodeData(grid, function (result) {
	                _this._activeAllRule(grid.apf_ds);
	                if (sender.callback && Ext.isFunction(sender.callback)) {
	                    sender.callback(result, args);
	                }
	                grid.fireEvent("rowclick", grid, grid.selectMode);
	            });
	        };
	        //提交记录的所属部门
	        var fullDeptId = records[0].data.FullDeptId ? records[0].data.FullDeptId : 0;

	        //提交、反提交参数
	        var config = {
	            ds: grid.apf_ds,
	            controller: Gtp.net.Global.getPageController(),
	            reverseSubmitAction: "ReverseSubmit",
	            reverseSubmitArgs: [records[0].id, records[0].data.__type],
	            submitAction: "SubmitBills",
	            submitActionArgs: [[records[0].id], records[0].data.__type, "", null]
	        };
	        //执行提交
	        //(autoShowDialog, showCheckerDialog, bizCode, fullDeptId, record, callback, args, config)
	        Ext.AppFrame.Bill.Submit($G.getBizComp(), fullDeptId, records[0], submitSuccess, null, config, sender.autoShowProcessDialog, sender.showCheckerDialog);
	    },
	    //[End]

	    //[Start]
	    _getAttachData: function (entityName, id) {
	        ///<summary>获取附件信息</summary>
	        if (id) {
	            //$G.Page._attachHash缓存附件信息{key: BillKey, value : { 附件信息 }}
	            if (!$G.Page._attachHash) {
	                $G.Page._attachHash = new Array();
	            }
	            for (var i = 0; i < $G.Page._attachHash.length; i++) {
	                var item = $G.Page._attachHash[i];
	                if (item && item.key) {
	                    if (item.key == id) {
	                        return item.value;
	                    }
	                }
	            }
	            var attachList = new Array(); ;
	            var disp = new Gtp.net.GtpDispatcher({
	                async: false,
	                dispatchArgs: {
	                    async: false,
	                    controller: Gtp.net.Global.getPageController(),
	                    action: "GetBillAttach",
	                    args: [id, entityName]
	                },
	                listeners: {
	                    scope: this,
	                    'success': function (result) {
	                        attachList = result.Entities;

	                        $G.Page._attachHash.push({ key: id, value: attachList });
	                    },
	                    'failure': function () {
	                        return;
	                    }
	                }
	            });
	            disp.dispatch();
	            return attachList;
	        }
	    },
	    //[End]

	    //[Start]
	    AttachView_Show: function (item) {
	        ///<summary>Show</summary>
	        if ($G.Page.attachPanel) {
	            var grid = $G.getCmp("billView");
	            if (item) {
	                var attach = _this._getAttachData(grid.dataLink.dataSource.type, item.billId);
	                $G.Page.attachPanel.loadData(attach);
	            }
	        }


	        (function () {
	            //文件映射图片
	            var divFileViewImg = Ext.DomQuery.select('*[class=x-fileview-img]', $G.Page.attachPanel.getEl().dom); //查找图片 div
	            Ext.each(divFileViewImg, function (div) {
	                if (div) {
	                    value = div.title;
	                    var img = Ext.AppFrame.Attachment.GetIcoFileByFileExt(value, 32);
	                    if (img != "") {
	                        var imgUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/Common/images/file/" + img;
	                        div.style.backgroundImage = "url('" + imgUrl + "')";
	                    }
	                }
	            });
	        })();

	    },
	    //[End]

	    //[Start]
	    _setTemplateParamsFun: function () {
	        var entityFullName = $G.DataContext.getDataSource("BillQuery").type;
	        var menuText = "导出Excel";
	        return menuText + ":1," + entityFullName + ";";
	    },
	    //[End]

	    //[Start]
	    _showAttach: function (id) {
	        ///<summary>actShowAttach</summary>
	        var AttachView = $G.getCmp("AttachView");
	        AttachView.billId = id;
	        AttachView.show();

	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseBill.BillListPage = _class;
})();
//</Bottom>
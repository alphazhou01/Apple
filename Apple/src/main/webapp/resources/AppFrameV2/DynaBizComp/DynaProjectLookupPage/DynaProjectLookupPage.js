//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
	Ext.ns("GTP.AppFrameV2.DynaBizComp");
	var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	//[Start]
	    _init: function () {
	        _this._initDataContext();

	        _this._initSetting();

	        _this._moduleTreeLoad();

	        _this._loadListData();
	    },
	//[End]

	//[Start]
	    _queryModuleTree: function (config) {
	        var treeQueryPlan = $G.QueryPlans.getQueryPlan("treeQueryPlan");
	        if (treeQueryPlan) {
	            if (!config) config = {};
	            if (_this._setCategoryLoadConfig && Ext.isFunction(_this._setCategoryLoadConfig)) {
	                config = _this._setCategoryLoadConfig.call(this, config); //判断用户自定义配置，用户可重写此方法
	            }
	            var queryPlanParam = treeQueryPlan.getQueryParam();

	            if ($G.PageExtend.QueryLevel && $G.PageExtend.QueryLevel != "0") {
	                config.action = "QueryFromRoot";
	                config.args = [$G.PageExtend.QueryLevel, queryPlanParam];
	            }
	            else {
	                config.action = "QueryFromRoot"
	                config.args = [-1, queryPlanParam];
	            }

	            var dataSource = $G.DataContext.getDataSource(treeQueryPlan.dataSource);
	            Ext.ux.AppFrame.DataSource.loadData(dataSource, queryPlanParam, config);
	        }
	    },
	//[End]

	//[Start]
	    _moduleTreeLoad: function () {
	        var dispatcher = new Gtp.net.GtpDispatcher({
	            dispatchArgs: { controller: Gtp.net.Global.getPageController(),
	                controller: 'GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage',
	                action: 'GetLeafTreeData',
	                args: ['GTP.Services.Common.ModuleTree']
	            }
	        });
	        var loader = new Ext.ux.tree.GtpTreeLoader({
	            dispatcher: dispatcher,
	            listeners: {
	                initload: function (scope, node, response) {
	                    //调用GTP内部的TreeLoader根据JSON数据绑定树
	                    this.processResponse(response, node, scope);
	                },
	                load: function (scope, node, response) {
	                    //注意，必须加，否则会造成浏览器持续请求数据
	                    if (node.childNodes.length) {
	                        delete this.dispatcher;
	                    }
	                }
	            }
	        });

	        var tree = new Ext.ux.AppFrame.Controls.FilterTreePanel({
	            id: 'ModuleTree',
	            //指定的绑定字段
	            autoScroll: true,
	            keyField: "ID",
	            parentKeyField: "PID",
	            displayField: "Name",
	            codeField: "Code",
	            fullCodeField: "FullCode",
	            leafField: "IsLeaf",
	            orderField: "OrderNo",
	            levelField: "Level",
	            //	            title: "方案分类",
	            //	            collapsible: true,
	            border: true,
	            //图标样式
	            //	            leafIconCls: "gtptree-node-leaf",
	            //	            branchIconCls: "gtptree-node-branch",

	            loader: loader,
	            listeners: {
	                initloader: function () {

	                },
	                beforeload: function (node) {
	                    if (!node.isRoot && !node.attributes.children)
	                        return false;
	                }
	            }
	        });
	        //Click事件
	        tree.on('click', function (node, e) {
	            $G.Page._module.code = node.attributes.code;
	            $G.Page._module.isBizComponent = node.attributes.rawData.IsBizComponent;

	            var queryPlan = _this._getQueryPlan();
	            queryPlan.setFilterValue("filter_BizComponentName", node.attributes.code + '.');

	            _this._loadListData();
	        });
	        //指定树呈现的位置
	        var panel1 = $G.getCmp("layoutPanel2");
	        panel1.add(tree);
	        panel1.doLayout();
	        //	        panel1.mainBody.update('<div class="x-grid-empty">' + "" + '</div>');
	        $G.Page._module = { code: tree.root.text, nodeType: false, text: "功能模块" };
	    },
	//[End]

	//[Start]
	    _getQueryPlan: function () {
	        var queryPlan = $G.QueryPlans.getQueryPlan("queryPlan");
	        return queryPlan;
	    },
	//[End]

	//[Start]
	    _getGridControl: function () {
	        return $G.getCmp('gridView');
	    },
	//[End]

	//[Start]
	    _initSetting: function () {
	        var grid = _this._getGridControl();
	        //设置单选
	        grid.getSelectionModel().singleSelect = true;

	        if (Ext.isEmpty($G.Params.moduleName))
	            $G.Page._module = { code: $G.Params.EntityFullName };
	    },
	//[End]

	//[Start]
	    _initDataContext: function () {
	        if (!$G.Page._dataListSource)
	            $G.Page._dataListSource = $G.DataContext.getDataSource('DynaExtensionQuery');
	    },

	    //[Start]
	    Page_DocumentReady: function () {
	        _this._init();

	    },
	//[End]

	//[Start]
	    _loadListData: function () {
	        var dataSource = $G.Page._dataListSource;
	        var queryPlan = _this._getQueryPlan().getQueryParam();

	        var isBizComp = false;
	        var bizCompName = "";
	        if (!Ext.isEmpty($G.Page._module.isBizComponent)) {
	            isBizComp = $G.Page._module.isBizComponent;
	            bizCompName = $G.Page._module.code;
	        }
	        $G.dispatcher({
	            action: "GetProjectList",
	            controller: 'GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage',
	            args: [queryPlan, isBizComp, bizCompName],
	            success: function (data) {
	                dataSource.loadData(data);
	            }
	        });
	    },
	//[End]

	//[Start]
	    col_Conditions_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        if (Ext.isEmpty(record.data.Conditions))
	            return null;
	        var conditions = record.data.Conditions.split("&");
	        var condition = record.data.Conditions.replace(/&/g, "<br>");
	        //metadata.attr = 'ext:qtip="' + record.data.PhoneNumbers + '"';
	        metadata.attr = 'ext:qtip="' + condition + '"';
	        return conditions[0] + "(条件" + conditions.length + ")";
	    },
	//[End]

	//[Start]
	    col_IsPublished_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        var sImage;
	        var value;
	        if (record.data.IsPublished) {
	            value = "启用";
	            sImage = "/Common/images/toolbar/GTP_start.png";
	        }
	        else {
	            sImage = "/Common/images/toolbar/GTP_Pause.png";
	            value = "停用";
	        }
	        return String.format("<img style='margin-right:2px;vertical-align:middle' src='{0}'>{1}", sImage, value);
	    },
	//[End]

	//[Start]
	    _getSelectRecord: function (grid, needTip) {
	        if (!grid)
	            return null;
	        var grid = $G.getCmp(grid);
	        var records = grid.getSelectionModel().getSelections();
	        if (records && records.length) {
	            return records[0];
	        }
	        else if (needTip) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前没有选中记录");
	        }

	    },
	//[End]

	//[Start]
	    _selectRecord: function () {
	        var record = _this._getSelectRecord("gridView");
	        if (record) {
	            $G.setReturnValue("OutEntity", record.data);
	            $G.close(true);
	        }
	        else {
	            $G.close(false);
	        }
	    },
	//[End]

	//[Start]
	    actAccept_Handler: function (sender) {
	        ///<summary>确定:actAccept</summary>
	        _this._selectRecord();
	    },
	//[End]

	//[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        $G.close(false);
	    },
	//[End]

	//[Start]
	    gridView_DblClick: function (e) {
	        ///<summary>DblClick</summary>
	        _this._selectRecord();
	    }
	//[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.DynaBizComp.DynaProjectLookupPage = _class;
})();
//</Bottom>
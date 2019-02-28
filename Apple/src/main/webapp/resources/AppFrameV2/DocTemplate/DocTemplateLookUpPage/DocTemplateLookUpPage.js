//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
	Ext.ns("GTP.AppFrameV2.DocTemplate");
	var _class = Ext.extend(GTP.AppFrameV2.BaseLookup.LookupPage,
	{
	    //</Top>

        //[Start]
	    __bindQueryBox: function () {
	        ///////////////////////////////////////////////////////////////////////////////
	        if (!$G.Page._queryBox) {
	            var dataSource = $G.Page._dataListSource;
	            $G.Page._queryBox = Ext.ux.query.createQueryBox(
                                dataSource.type,
                                "gridView",
                                "queryBox1",
                                false
                                );
	            $G.Page._queryBox.on("getCriteira", function (qb_queryPlanParam) {
	                qb_queryPlanParam = Ext.AppFrame.Util.mergeQueryPlanParam($G._queryPlan.getQueryParam(), qb_queryPlanParam);
	                $G.dispatcher({
	                    action: "QueryByCriteria",
	                    args: [qb_queryPlanParam],
	                    success: function (data) {
	                        $G.Page._qb_QueryPlanParam = qb_queryPlanParam;
	                        dataSource.loadData(data);
	                    }
	                });
	                //	                var pagingToolbar = $G.getCmp('gridView_pagetoolbar');
	                //	                pagingToolbar.doLoad(0);
	            });
	        }

	        Ext.ux.query.showQueryBox("Selected_toolbar", 1);


	        /////////////////////////////////////////////////////////////////////////////
	    },
        //[End]

        //[Start]
	    _getSelectedRecord: function () {
	        ///<summary>源数据控件名：Source；已选数据源名称：Selected</summary>
	        if ($G.Params.MultiSelect == false) {
	            var Source = $G.getCmp("Selected");
	            var records = Source.getSelectionModel().getSelections();

	            if (records.length == 0) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoSelectedRecord);
	                return;
	            }
	            else if (records.length > 1) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	                Source.getSelectionModel().clearSelections();
	                return;
	            }
	            else {
	                return records[0].data;
	            }
	        }
	        else {
	            var records = $G.DataContext.getDataSource("Selected").getDataStore().getRange();
	            if (!Ext.isArray(records)) records = [records];
	            var recordArray = [];
	            for (var i = 0; i < records.length; i++) {
	                recordArray.push(records[i].data);
	            }
	            if (recordArray.length > 0) {
	                return recordArray;
	            }
	            else {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoSelectedRecord);
	            }
	        }
	    },
        //[End]

        //[Start]
	    __initGrid: function () {
	        var gridView = _this._getGridControl();
	        if (gridView) {
	            //加载QueryBox
	            _this.__bindQueryBox();

	        }
	    },
        //[End]

        //[Start]
	    _init: function () {
	        ///<summary>初始化函数</summary>
	        //输出参数OutEntity设置默认值
	        for (var i = 0; i < $G.PageParam.outputParams.length; i++) {
	            if ($G.PageParam.outputParams[i].name == "OutEntity" && $G.PageParam.outputParams[i].type == "entity") {
	                if ($G.Params.MultiSelect == true) {
	                    $G.PageParam.outputParams[i].value = "Selected";
	                }
	                else {
	                    $G.PageParam.outputParams[i].value = "Source";
	                }
	                break;
	            }
	        }
	        //设置布局，单选隐藏已选布局
	        _this._initLayout();


	        var grid = $G.getCmp("Source");
	        if (grid) {
	            $G.Page._initQueryBox(grid);
	            grid.on("rowdblclick", function (e) {
	                if ($G.Params.MultiSelect != true) _this.actSubmit_Handler(null);
	                else _this.actSelect_Handler(null);
	            }, this);
	        }
	    },
        //[End]

        //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        //TODO:钢子已更改,$G.getBizComp()先得到bizComp，再得到ModuleCode值
	        //Ext.net.ResourceMgr['bizComp'] = "";
	        _super.Page_DocumentReady();
	        _this.__initDataContext();
	        _this.__initGrid();

	        if ($G.Params.CanViewFile) {
	            _this._loadData();
	        } else {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '请联系管理员授予查看该目录的权限!');
	        }
	    },
        //[End]

        //[Start]
	    __initDataContext: function () {
	        ///<summary>初始化参数</summary>	     
	        if (!$G.Page._dataListSource) {
	            $G.Page._dataListSource = $G.DataContext.getDataSource("Selected");
	            if (!$G.Page._dataListSource)
	                Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, GTP.AppFrameV2.Res.NoDataSource);
	        }
	        _this._getQueryPlan();
	    },
        //[End]

        //[Start]
	    actSubmit_Handler: function (sender) {
	        ///<summary>确定:actSubmit</summary>
	        var selectedRow = $G.Page._getSelectedRecord();
	        if (selectedRow) {
	            $G.setReturnValue("OutEntity", selectedRow);
	            $G.close(true);
	        }
	    },
        //[End]

        //[Start]
	    _getGridControl: function () {
	        ///<summary>获取树控件</summary>
	        var gridView = Ext.getCmp("Selected");
	        if (gridView != undefined)
	            return gridView;
	        else
	            Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, GTP.AppFrameV2.Res.NoTreeView);
	    },
        //[End]

        //[Start]
	    _getQueryPlan: function () {
	        ///<summary>初始化查询条件</summary>
	        if (!$G.Page._queryPlan)
	            $G.Page._queryPlan = $G.QueryPlans.getQueryPlan("DTqueryPlan" || 0);
	        return $G.Page._queryPlan;
	    },
        //[End]

        //[Start]
	    _loadData: function () {
	        ///<summary>初始化显示数据</summary>
	        $G._queryPlan = _this._getQueryPlan();

	        $G._queryPlan.setFilterValue("filter_DTFolder_ID", $G.Params.DTFolderId == null ? -100 : $G.Params.DTFolderId);
	        $G._queryPlan.setFilterValue("filter_IsValid", true);
	        var upDeptIds;
	        if ($G.PageContext.frameDeptFullId) {
	            upDeptIds = $G.PageContext.frameDeptFullId;
	            while (upDeptIds.indexOf("/") > 0) {
	                upDeptIds = upDeptIds.replace("/", ",");
	            }
	        }
	        else {
	            upDeptIds = Ext.AppFrame.Common.getDeptId();
	        }
	        $G._queryPlan.setFilterValue("filter_CREATE_DeptId", upDeptIds);


	        //Ext.ux.AppFrame.DataSource.loadData($G.Page._dataListSource, queryPlan.getQueryParam(), null)

	        var gridView = $G.getCmp("Selected");
	        gridView.AP_loadData({ args: $G._queryPlan.getQueryParam() }); //, controller: 'GTP.AppFrameV2.DocTemplate.DocTemplatePage' //2014-07-21 gaohy update TP-28532
	        gridView.selModel.selectById(0);
	    },
        //[End]

        //[Start]
	    _initLayout: function () {
	        ///<summary>初始化布局</summary>
	        if ($G.Params.MultiSelect != true) {
	            var viewPort = $G.getCmp("viewport");

	            //var sourcePanel = $G.getCmp("Source").ownerCt;
	            var selectedPanel = $G.getCmp("Selected").ownerCt;
	            if (viewPort && selectedPanel) {
	                var height = selectedPanel.getHeight();
	                selectedPanel.setHeight(height);
	                selectedPanel.setVisible(true);
	                selectedPanel.hidden = false;
	                selectedPanel.doLayout();

	                // sourcePanel.setHeight(height);
	                // sourcePanel.region = "center";
	                // sourcePanel.doLayout();
	                //sourcePanel.autoHeight = true;

	                viewPort.doLayout();
	            }
	        }
	    }
        //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.DocTemplate.DocTemplateLookUpPage = _class;
})();
//</Bottom>
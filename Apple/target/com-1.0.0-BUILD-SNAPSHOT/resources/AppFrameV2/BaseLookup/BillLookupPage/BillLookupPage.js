//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseLookup");
    var _class = Ext.extend(GTP.AppFrameV2.BaseLookup.LookupPage,
	{
	    //</Top>

	    //[Start]
	    _getModuleCode: function () {
	        ///<summary></summary>
	        return $G.PageExtend.BizComponent;
	    },
	    //[End]

	    //[Start]
	    __hideDeptTreeSplit: function (renderToPanel) {
	        //该方法用于隐藏组织机构树上控制展开折叠的split小箭头
	        if (renderToPanel) {
	            if (Ext.isString(renderToPanel)) { renderToPanel = $G.getCmp(renderToPanel); }
	            if (Ext.isObject(renderToPanel)) {
	                renderToPanel.setWidth(0);
	                renderToPanel.setVisible(false);
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
	        if (!config.bizTypeCode) config.bizTypeCode = ($G.PageExtend.LeftDeptBizType ? $G.PageExtend.LeftDeptBizType.replace(";", ",") : null);
	        if (!config.levelTypeCode) config.levelTypeCode = ($G.PageExtend.LeftDeptLevelType ? $G.PageExtend.LeftDeptLevelType.replace(";", ",") : null);

	        var nodeClick = function (node) {
	            var DName = node.attributes ? node.attributes.Name : node.data.Name;
	            var DCode = node.attributes ? node.attributes.Code : node.data.Code;
	            var DFullId = node.attributes ? node.attributes.FullId : node.data.FullId;
	            var DSubType = node.attributes ? node.attributes.SubType : node.data.SubType;

	            if (DFullId) {
	                _this.__setDeptFilter(DFullId);
	                if (DSubType == "0") {
	                    _this._selectedFullDeptId = DFullId;
	                    _this._selectedDeptName = DName;
	                    _this._selectedDeptCode = DCode;
	                }
	                var defaultConfig = {
	                    resetpage: true,
	                    isExpandAll: true
	                };

	                var billView = _this._getSourceGrid();
	                billView.AP_loadData(defaultConfig);
	            }
	        };
	        if (!renderToPanel) renderToPanel = "layoutPanel2";
	        var renderToPanel = $G.getCmp(renderToPanel);
	        if (renderToPanel) {
	            renderToPanel.addClass("x-panel-body-treeborder1");
	            return Ext.AppFrame.DeptCommon.createDeptTree(nodeClick, renderToPanel, config);
	        }
	        else {
	            return undefined;
	        }
	    },
	    //[End]

	    //[Start]
	    _initDeptTree: function (config, renderToPanel) {
	        ///<summary></summary>
	        if (!renderToPanel) {
	            renderToPanel = "layoutPanel2";
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
	            var ape_showDeptTree = Ext.AppFrame.Common.getModuleApfExtend("APE_ShowDeptTree", _this._getModuleCode());
	            var d = $G.PageExtend["APE_ShowDeptTree"];
	            if (ape_showDeptTree == "true") {
	                isShowDeptTree = true;
	            }
	        }
	        if (isShowDeptTree == false) {
	            _this.__hideDeptTreeSplit(renderToPanel);
	        }
	        else {
	            _this.__createDeptTree(config, renderToPanel);
	        }
	    },
	    //[End]

	    //[Start]  
	    __setDeptFilter: function (fullId) {
	        var grid = _this._getSourceGrid();
	        var qp = grid.apf_queryPlan;
	        qp.setFilterValue("filter_FullDeptId_Like", fullId + "/");
	        qp.setFilterValue("filter_FullDeptId_Eq", fullId);
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary></summary>
	        _super._init();

	        _this._initDeptTree();          //初始化左侧组织机构树分类

	        //设置右侧工具条
	        //设置右表主工具栏为白色底色
	        var Source_toolbar = $G.getCmp("Source_toolbar");
	        if (Source_toolbar && Source_toolbar.ownerCt) {
	            Source_toolbar.addClass("x-grid-toolbar-blank-bg");
	            Source_toolbar.addClass("x-grid-toolbar-noborder");
	            Source_toolbar.ownerCt.addClass("x-grid-toolbar-noborder");
	            Source_toolbar.addClass("x-panel-padding3");
	        }
	        var Source_paging = $G.getCmp("Source_paging");
	        if (Source_paging) Source_paging.addClass("x-grid-toolbar-noborder");

	        //设置右侧工具条
	        //设置右表主工具栏为白色底色
	        var Selected_toolbar = $G.getCmp("Selected_toolbar");
	        if (Selected_toolbar) {
	            Selected_toolbar.addClass("x-grid-toolbar-blank-bg");
	            Selected_toolbar.addClass("x-grid-toolbar-noborder");
	            Selected_toolbar.addClass("x-panel-padding3");
	        }

	        var layoutPanel1 = $G.getCmp("layoutPanel1");
	        if (layoutPanel1) {
	            layoutPanel1.addClass("x-panel-padding10");
	            layoutPanel1.setWidth(layoutPanel1.getWidth() - 20);
	            layoutPanel1.setHeight(layoutPanel1.getHeight() - 20);
	            layoutPanel1.doLayout();
	        }
	        var viewPort = $G.getCmp("viewport");
	        viewPort.doLayout();
	    },
	    //[End]

	    //[Start]
	    _loadData: function (config) {
	        ///<summary>增加虚方法以便派生类能重写</summary>
	        _this._getSourceGrid().AP_loadData(config);

	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        _super.Page_DocumentReady();
	        _this._loadData({ pageReady: true, firstLoad: true });
	    },
	    //[End]

	    //[Start]
	    Source_BeforeRender: function (item) {
	        ///<summary>BeforeRender</summary>
	        if ($G.Params.MultiSelect == true) {
	            //视图模式，0单树，1左右树多选视图
	            var grid_sm = null;
	            this.selModel = 'checkbox';
	            grid_sm = new Ext.grid.CheckboxSelectionModel({
	                singleSelect: this.singleSelect,
	                locked: false
	            });
	            grid_sm.locked = true;
	            this.colModel.columns.unshift(grid_sm);   // 插入选择框列
	            grid_sm.addListener('beforerowselect', this.onBeforeSelect, this);
	            grid_sm.addListener('selectionchange', this.onSelectionChange, this);
	            this.selModel = grid_sm;
	            //11-24危斌提供，解决多表头时表头复选框问题
	            if (this.isHeaderGroup == true) {
	                var rows = this.plugins[0].rows;
	                rows[0].unshift({ rowspan: rows.length, header: '&#160;' })
	            }
	        }
	    }
	    //[End]


	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseLookup.BillLookupPage = _class;
})();
//</Bottom>
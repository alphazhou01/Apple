//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	    //[Start]
	    _initQueryBox: function (grid, config) {
	        ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>

	        if (!config) {
	            config = {};
	        }
	        config.hasSchemeManagement = false;
	        //自己构建函数.
	        config.getCriteira = function (queryBoxParam) {
	            $G.Page.actQuery({ lazyLoad: false, noCacheParam: true });
	        }
	        Ext.AppFrame.Util.createQueryBox(grid, config);

	        var index = $G.getCmp("dictView_toolbar").items.indexOf($G.getCmp("ToolbarFill_search"))

	        Ext.ux.query.showQueryBox("dictView_toolbar", index + 1);
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init.apply(this, arguments);

	        var tree = $G.getCmp("dictView");

	        var ds = $G.DataContext.getDataSource("TreeDictQuery");
	        ds.on("onnodata", function (data) {
	            $G.States.setCurrentState("STATE_NOSELECT");
	        });

	        tree.getSelectionModel().on('selectionchange', function (sm) {
	            //_this._resetPageStateBySelectCount();
	        }, this);

	        $G.Page._initQueryBox(tree);
	        //增加Filter，js构造，是否考虑转到Queryplan里
	        tree.AP_getTreeFilter = function () {
	            if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", tree.apf_ds.type) == "true") {

	                //	                var frameDeptFullId = Ext.AppFrame.Common.getDeptFullId();
	                //	                var parentDeptIds = frameDeptFullId.replace(new RegExp('/', 'g'), ',');
	                var deptId = Ext.AppFrame.Common.getDeptId();

	                var Filters = new Array();
	                var fn = Ext.AppFrame.Common.addFilter;
	                Filters.push(fn("BraceStart", null, "eq", "And", null));
	                Filters.push(fn("Filter", "Dept", "eq", deptId, "zh_CN")); //本级、上级不能重复
	                Filters.push(fn("BraceEnd", null, "eq", "", null));
	                return Filters;
	            } else {
	                return new Array();
	            }
	        };

	        var w = $G.getCmp("editView");
	        if (w) {
	            w.on("show", function (item) {
	                _this._isShowing = true;
	            }, this);
	            w.on("hide", function (item) {
	                _this._isShowing = false;
	                //_this._resetPageStateBySelectCount();
	            }, this);
	        }

	        _this._initDeptFilter();
	    },
	    //[End]

	    //[Start]
	    _resetPageStateBySelectCount: function () {
	        if (_this._isShowing) return;
	        if ($G.CurrentState != "STATE_READONLY" && $G.CurrentState != "STATE_UPDATE") {
	            var gridView = $G.getCmp("dictView");
	            if (gridView) {
	                var count = gridView.getSelectionModel().getSelections().length;
	                if (count != 0) {
	                    $G.States.setCurrentState("STATE_SELECT");
	                    _this._setAllActionByAuth();
	                } else
	                    $G.States.setCurrentState("STATE_NOSELECT");
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _initDeptFilter: function () {
	        ///<summary>初始化部门过滤条件</summary>
	        var ds = $G.DataContext.getDataSource("TreeDictQuery");
	        if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", ds.type) == "true") {

	            var deptId = Ext.AppFrame.Common.getDeptId();
	            //var frameDeptFullId = Ext.AppFrame.Common.getDeptFullId();
	            if (deptId) {
	                var qb = $G.QueryPlans.getQueryPlan("queryPlan");
	                //本上级
	                //var parentDeptIds = frameDeptFullId.replace(new RegExp('/', 'g'), ',');
	                qb.setFilterValue("filter_D_DeptId", deptId);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        _super.Page_DocumentReady();
	        $G.Page.actQuery();
	    },
	    //[End]

	    //[Start]
	    _setTemplateParamsFun: function () {
	        var entityFullName = $G.DataContext.getDataSource("TreeDictQuery").type;
	        var menuText = "导出Excel";
	        return menuText + ":1," + entityFullName + ";";
	    },
	    //[End]

	    //[Start]
	    actQuery: function (config) {
	        ///<summary>查询</summary>
	        $G.getCmp("dictView").AP_loadData(config);
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.TreeDictListPage = _class;
})();
//</Bottom>
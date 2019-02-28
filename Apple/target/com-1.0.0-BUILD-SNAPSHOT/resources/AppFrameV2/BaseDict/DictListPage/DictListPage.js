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
	            var qp = grid.apf_queryPlan;
	            if (qp) {
	                qp.currentPage = 1;
	                if (queryBoxParam.size > 0) qp.pageSize = queryBoxParam.size;
	            }
	            $G.Page.actQuery({ resetpage: true, pageSize: qp.pageSize, noCacheParam: true });
	        }

	        Ext.AppFrame.Util.createQueryBox(grid, config);

	        var index = $G.getCmp("dictView_toolbar").items.indexOf($G.getCmp("ToolbarFill_search"))

	        Ext.ux.query.showQueryBox("dictView_toolbar", index + 1);
	    },

	    //[End]

	    //[Start]
	    _setFilterValue: function (grid, filterName, newValue) {
	        var filter = grid.apf_queryPlan.getFilterAll(filterName);
	        if (filter) filter.setValue(newValue);
	    },
	    //[End]



	    //[Start]
	    _initDeptFilterByManageLevel: function (grid, level) {
	        if (!grid) return;
	        if (Ext.isEmpty(level)) level = Ext.AppFrame.Common.getModuleApfExtend("APE_ManageLevel");
	        if (Ext.isEmpty(level)) level = "all";
	        level = level.toLowerCase().trim();
	        if (level == "all" || level == "0") {
	            level = "";
	        }
	        else if (level == "1") {
	            level = "b";
	        }
	        else if (level == "2") {
	            level = "bs";
	        }

	        if (level != "") {
	            var fullDeptId = Ext.AppFrame.Common.getDeptFullId();
	            var isSJ = level.indexOf("s") != -1, isBJ = level.indexOf("b") != -1, isXJ = level.indexOf("x") != -1;

	            if (isBJ) {
	                _this._setFilterValue(grid, "filter_D_FullDeptId_Eq", fullDeptId);
	            } else {
	                _this._setFilterValue(grid, "filter_D_FullDeptId_Eq", null);
	            }
	            if (isSJ) {
	                var arr = fullDeptId.split('/');
	                _this._setFilterValue(grid, "filter_D_DeptId_in", arr.join(','));
	            }
	            else {
	                _this._setFilterValue(grid, "filter_D_DeptId_in", null);
	            }


	            if (isXJ) {
	                _this._setFilterValue(grid, "filter_D_FullDeptId_like", fullDeptId + "/");
	            }
	            else {
	                _this._setFilterValue(grid, "filter_D_FullDeptId_like", null);
	            }

	        }
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init();
	        var ds = $G.DataContext.getDataSource("DictQuery");
	        //数据加载后触发
	        ds.on("onnodata", function (data) {
	            $G.States.setCurrentState("STATE_NOSELECT");
	        });

	        var grid = $G.getCmp("dictView");
	        if (grid) {
	            $G.Page._initQueryBox(grid);
	            _this._initDeptFilterByManageLevel(grid);

	            //增加全局排序
	            grid.on("headerclick", function (item, columnIndex, e) {
	                var bcanQuery = true, btnSave = $G.getCmp("btnSave");
	                if (!Ext.isEmpty(btnSave)) {
	                    bcanQuery = btnSave.disabled;
	                }
	                if (bcanQuery) {
	                    if (grid.apf_ds.AP_SortDataOnHeaderClick(item, columnIndex, e)) {
	                        _this.actQuery({});
	                    }
	                }
	            }, grid);
	        }

	        var w = $G.getCmp("editView");
	        if (w) {
	            w.on("show", function (item) { _this._isShowing = true; }, this);
	            w.on("hide", function (item) {
	                _this._isShowing = false;
	            }, this);
	        }

	    },
	    //[End]

	    //[Start]
	    //此方法已过时,
	    _resetPageStateBySelectCount: function () {
	        if (_this._isShowing) return;
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        _super.Page_DocumentReady();
	        $G.Page.actQuery({});
	    },
	    //[End]

	    //[Start]
	    actRefresh_Handler: function (sender) {
	        ///<summary>刷新:actRefresh</summary>
	        $G.Page.actQuery({});
	    },
	    //[End]

	    //[Start]
	    _setTemplateParamsFun: function () {
	        var entityFullName = $G.DataContext.getDataSource("DictQuery").type;
	        var menuText = "导出Excel";
	        return menuText + ":1," + entityFullName + ";";
	    },
	    //[End]

	    //[Start]
	    actQuery: function (config) {
	        $G.getCmp("dictView").AP_loadData(config);
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.DictListPage = _class;
})();
//</Bottom>
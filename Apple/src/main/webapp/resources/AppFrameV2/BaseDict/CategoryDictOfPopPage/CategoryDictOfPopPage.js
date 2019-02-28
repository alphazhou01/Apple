//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
	Ext.ns("GTP.AppFrameV2.BaseDict");
	var _class = Ext.extend(GTP.AppFrameV2.BaseDict.CategoryDictListPage,
	{
	    //</Top>

	//[Start]
	    _categoryControlNames: function () {
	        ///<summary>左侧分类树过滤字段</summary>
	        var list = _super._categoryControlNames();
	        return list + "btnAddNode_addChild;ToolbarSeparator;btnAp_TreeGrid_actMoveUp;btnAp_TreeGrid_actMoveDown;btnAp_TreeGrid_actUpGrade;btnAp_TreeGrid_actDeGrade;";
	    },
	//[End]

	//[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init.apply(this, arguments);
	        _this._dictView = $G.getCmp("dictView");
	        _this._dictView.windowViewName = "dictWindowView";
	        _this._dictView.entityViewName = "dictEntityView";

	        var treeView = $G.getCmp("treeView");
	        treeView.windowViewName = "treeWindowView";
	        treeView.entityViewName = "treeEntityView";

	        var madifyLeftTree = Ext.AppFrame.Common.getModuleApfExtend("APE_LeftTreeModify");
	        if (madifyLeftTree != "true") { //不修改左侧树
	            var toolBar = $G.getCmp("treeView_toolbar_Edit");
	            toolBar.setVisible(false);
	        }
	        else {//修改左侧树
	            var treeView_search = $G.getCmp("treeView_search");
	            treeView_search.setVisible(false);
	            var btnShowSearch = $G.getCmp("btnShowSearch");
	            btnShowSearch.setVisible(true);
	            //设置字典维护工具栏无边框
	            var treeView_toolbar_Edit = $G.getCmp("treeView_toolbar_Edit");
	            treeView_toolbar_Edit.addClass("x-grid-toolbar-border2");

	            //标识是否显示左树查询框
	            _this.__isShowSearch = false;
	        }

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

	        var ds = $G.DataContext.getDataSource("Dict");
	        ds.on("afteradd", function (result) {
	            var treeView = $G.getCmp("treeView");
	            var records = treeView.getSelectionModel().getSelections();
	            if (records.length == 0) {
	                return;
	            }
	            result.set("Category.ID", records[0].data[treeView.keyField]);
	        });

	        var leftTreeSource = $G.DataContext.getDataSource("TreeQuery");
	        leftTreeSource.on("afterdelete", function () {
	            this.fireEvent("scroll", this, this.currentIndex);
	        });

	        _this._setLinkColumn(_this._dictView, ["Code"]);
	    },
	//[End]

	//[Start]
	    _setLinkColumn: function (grid, fields) {
	        ///<summary>构造超链接字段</summary>
	        return Ext.AppFrame.Common.setLinkColumn(
            grid,
            fields,
            function (value, metadata, record, rowIndex, colIndex, store) {
                if (!_this._isAuthAction("Ap_GridView_actNew"))
                    return '<a onclick="$G.Page.Ap_GridView_actOnlyView_Handler(_this._dictView);" href="#">' + value + '</a>';
                else
                    return '<a onclick="$G.Page.Ap_GridView_actView_Handler(_this._dictView);" href="#">' + value + '</a>';
            }
            );
	    },
	//[End]

	//[Start]
	    actShowSearch_Handler: function (sender) {
	        ///<summary>actShowSearch</summary>
	        var treeView_search = $G.getCmp("treeView_search");
	        treeView_search.setVisible(!_this.__isShowSearch);
	        _this.__isShowSearch = !_this.__isShowSearch;
	        $G.getCmp("treeView").doLayout();
	    }
	//[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.CategoryDictOfPopPage = _class;
})();
//</Bottom>
//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.CategoryTreeListPage,
	{
	    //</Top>

	    //[Start]
	    _categoryControlNames: function () {
	        ///<summary>左侧分类树过滤字段</summary>
	        var list = _super._categoryControlNames();
	        return list + "btn_LeftTree_Add_menu1;ToolbarSeparator;btnAp_LeftTree_actMoveUp;btnAp_LeftTree_ctMoveDown;btnAp_LeftTree_actUpGrade;btnAp_LeftTree_actDeGrade;";
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init.apply(this, arguments);

	        var leftTreeGrid = $G.getCmp("leftTreeGrid");
	        leftTreeGrid.windowViewName = "leftWindowView";
	        leftTreeGrid.entityViewName = "leftEntityView";

	        _this.rightTreeGrid = $G.getCmp("rightTreeGrid");
	        _this.rightTreeGrid.windowViewName = "rightWindowView";
	        _this.rightTreeGrid.entityViewName = "rightEntityView";

	        var madifyLeftTree = Ext.AppFrame.Common.getModuleApfExtend("APE_LeftTreeModify");
	        if (madifyLeftTree != "true") {
	            var toolBar = $G.getCmp("leftTreeGrid_toolbar_Edit");
	            toolBar.setVisible(false);

	            leftTreeGrid.addClass("blank-row-line");
	        }
	        else {//修改左侧树
	            var leftTreeGrid_search = $G.getCmp("leftTreeGrid_search");
	            leftTreeGrid_search.setVisible(false);
	            var btnShowSearch = $G.getCmp("btnShowSearch");
	            btnShowSearch.setVisible(true);

	            var leftTreeGrid_toolbar_Edit = $G.getCmp("leftTreeGrid_toolbar_Edit");
	            leftTreeGrid_toolbar_Edit.addClass("x-grid-toolbar-border2");

	            //标识是否显示左树查询框
	            _this.__isShowSearch = false;
	        }

	        var w = $G.getCmp("leftWindowView");
	        if (w) {
	            w.on("show", function (item) {
	                _this._isShowing = true;
	            }, this);
	            w.on("hide", function (item) {
	                _this._isShowing = false;
	            }, this);
	        }

	        var ds = $G.DataContext.getDataSource("CategoryTree");
	        ds.on("afteradd", function (record) {
	            var pid = this.apf_nodepid;
	            if (pid && record.id < 0) {
	                var rightTreeGrid = $G.getCmp("rightTreeGrid");
	                var dataStore = rightTreeGrid.getDataStore();
	                var index = dataStore.indexOfId(pid);
	                var parent = dataStore.getAt(index);
	                if (parent && parent.data["C_ID"] > 0) {
	                    record.set("Category.ID", parent.data["C_ID"].toString());
	                }
	            }
	            else {
	                var treeView = leftTreeGrid;
	                var records = treeView.getSelectionModel().getSelections();
	                if (records.length == 0) {
	                    return;
	                }
	                else if (records.length > 1) {
	                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectCat);
	                    treeView.getSelectionModel().clearSelections();
	                    return;
	                }
	                else {
	                    var categoryRow = records[0];
	                    record.set("Category.ID", categoryRow.id.toString());

	                }
	            }
	        });
	        var leftTreeSource = $G.DataContext.getDataSource("LeftTreeQuery");
	        leftTreeSource.on("afterdelete", function () {
	            this.fireEvent("scroll", this, this.currentIndex);
	        });
	    },
	    //[End]

	    //[Start]
	    actShowSearch_Handler: function (sender) {
	        ///<summary>actShowSearch</summary>
	        var treeView_search = $G.getCmp("leftTreeGrid_search");
	        treeView_search.setVisible(!_this.__isShowSearch);
	        _this.__isShowSearch = !_this.__isShowSearch;
	        $G.getCmp("leftTreeGrid").doLayout();
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.CategoryTreeOfPopPage = _class;
})();
//</Bottom>
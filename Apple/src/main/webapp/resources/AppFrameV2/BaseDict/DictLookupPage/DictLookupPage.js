//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseLookup.LookupPage,
	{
	    //</Top>

	    //[Start]
	    _init: function () {
	        ///<summary></summary>

	        //判断是否有新增功能，字典有次功能，单据没有
	        var hasNewRecordAuth = false;
	        //TP-30894 addButtonDisplayMode为0则一直隐藏，2则一直显示,
	        var editPageModuleCode = _this._getEditPageModuleCode(); //在调用基类之前

	        _super._init();

	        var authItemName = $G.PageExtend["AddAuthItemName"];
	        var addButtonDisplayMode = $G.PageExtend["AddButtonDisplayMode"];

	        if (editPageModuleCode && authItemName) {
	            if (addButtonDisplayMode == "0") {
	                hasNewRecordAuth = false;
	            } else if (addButtonDisplayMode == "2") {
	                hasNewRecordAuth = true;
	            }
	            else {
	                hasNewRecordAuth = _this._AuthItemDemand(editPageModuleCode, authItemName, 0);
	            }
	        }
	        if (hasNewRecordAuth) {
	            var action = $G.Actions.getAction("actNew");
	            if (action) action.setHidden(false);
	        }
	        else {
	            var action = $G.Actions.getAction("actNew");
	            if (action) action.setHidden(true);
	        }

	        //设置右侧工具条
	        //设置右表主工具栏为白色底色
	        var Source_toolbar = $G.getCmp("Source_toolbar");
	        if (Source_toolbar) {
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
	        $G.getCmp("Source").AP_loadData(config);
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
	        // grid多选模式
	        if ($G.Params.MultiSelect == true) {
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
	    },
	    //[End]

	    //[Start] 
	    _getEditPageModuleCode: function () {
	        var ret = $G.PageExtend["EditPageModuleCode"];
	        if (ret == "$BizCmpFullName$") {
	            ret = $G.PageExtend["ModuleCode"];
	        }
	        if (Ext.isEmpty($G.PageExtend.BizComponent)) {
	            $G.PageExtend.BizComponent = $G.PageExtend["EditPageModuleCode"]; //查询方案要用到
	        }
	        return ret;
	    },
	    //[End]

	    //[Start]
	    actNew_Handler: function (sender) {
	        ///<summary>新建:actNew</summary>
	        var editPageModuleCode = _this._getEditPageModuleCode();
	        var authItemName = $G.PageExtend["AddAuthItemName"];
	        var addButtonDisplayMode = $G.PageExtend["AddButtonDisplayMode"];
	        //一直显示的话，需要先验证权限
	        if (addButtonDisplayMode == "2") {
	            if (_this._AuthItemDemand(editPageModuleCode, authItemName, 0) != true) {
	                $G.alert(GTP.AppFrameV2.Res.Hint, "当前用户没有新建权限");
	                return;
	            }
	        }
	        var addWindowHight = this.initialConfig.dialogHeight;
	        var addWindowWidth = this.initialConfig.dialogWidth;

	        var dictLookupAddMode = $G.PageExtend["DictLookupAddMode"];
	        if (dictLookupAddMode == "true") {
	            var editPage = $G.PageExtend["EditPage"];
	            if (editPage) {
	                var editUrl = $G.getPageURLByFullName(editPage);
	                if (editUrl) {
	                    $G.open({
	                        url: editUrl,
	                        target: "_modal",
	                        callback: function (r) {
	                            _this._loadData();
	                        },
	                        scope: _this,
	                        features: { dialogWidth: addWindowWidth || "700px", dialogHeight: addWindowHight || "450px" }
	                    });
	                }
	                else {
	                    $G.alert(GTP.AppFrameV2.Res.Hint, "维护页面配置错误");
	                }
	            }
	            else {
	                $G.alert(GTP.AppFrameV2.Res.Hint, "没有配置维护页");
	            }
	        }
	        else {
	            var gridView = $G.getCmp("Source");
	            //给GridView赋上WindowView的名称,此处的windowViewName需要和
	            if (gridView) {
	                gridView.windowViewName = "windowView";
	            }
	            if (this.initialConfig) {
	                this.initialConfig.windowViewName = "windowView";
	            }
	            _this.__Ap_GridView_showWindowViewEditor("add", this.initialConfig, gridView);
	        }
	    }
	    //[End]




	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.DictLookupPage = _class;
})();
//</Bottom>
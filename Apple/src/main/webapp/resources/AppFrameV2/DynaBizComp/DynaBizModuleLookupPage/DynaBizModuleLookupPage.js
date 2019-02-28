//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
	Ext.ns("GTP.AppFrameV2.DynaBizComp");
	var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	//[Start]
	    _init: function () {
	        //初始化数据上下文
	        _this._initDataContext();

	    },
	//[End]

	//[Start]
	    _initDataContext: function () {
	        if (!$G.Page._dataSource)
	            $G.Page._dataSource = $G.DataContext.getDataSource("DynaBizModulePoco");
	        if (!$G.Page._querySource) {
	            $G.Page._querySource = $G.DataContext.getDataSource("SearchEntity");
	            $G.Page._querySource.addRecord();
	        }
	    },
	//[End]

	//[Start]
	    _loadData: function () {
	        var actionName = $G.Params.SelectDynaBizModule ? "QueryDynaBizModule" : "QueryModuleByFilters";
	        var record = $G.Page._querySource.getDataRecord();
	        $G.dispatcher({
	            action: actionName,
	            args: [record.data.ModuleCode, record.data.ModuleAlias],
	            success: function (data) {
	                $G.Page._dataSource.loadData(data);
	            }
	        });
	    },
	//[End]

	//[Start]
	    Page_DocumentReady: function () {
	        _this._init();
	        _this._loadData();
	    },
	//[End]

	//[Start]
	    actSearch_Handler: function (sender) {
	        ///<summary>查询:actSearch</summary>
	        _this._loadData();
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
	    _selectRecord: function () {
	        var gridView = $G.getCmp("gridView");
	        var selectedRows = gridView.getSelectionModel().getSelections();
	        if (selectedRows.length && selectedRows.length > 0) {
	            $G.setReturnValue("OutEntity", selectedRows[0].data);
	            $G.close(true);
	        }
	        else
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
    GTP.AppFrameV2.DynaBizComp.DynaBizModuleLookupPage = _class;
})();
//</Bottom>
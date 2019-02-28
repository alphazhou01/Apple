//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.DynaBizComp");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

        //[Start]
	    _init: function () {
	        if (!$G.Page._dataSource)
	            $G.Page._dataSource = $G.DataContext.getDataSource("CommonLookupPoco");
	    },
        //[End]

        //[Start]
	    Page_DocumentReady: function () {
	        _this._init();
	        _this._loadData();
	    },
        //[End]

        //[Start]
	    _loadData: function (filter) {
	        $G.dispatcher({
	            action: "GetDataList",
	            args: [filter || ""],
	            success: function (data) {
	                var dataSource = $G.Page._dataSource;
	                dataSource.loadData(data);
	            }
	        });
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
	    searchField_TriggerClick: function (index) {
	        ///<summary>:TriggerClick</summary>
	        if (index == 2) {
	            var filter = $G.getCmp("searchField").getValue();
	            _this._loadData(filter);
	        }
	        else {
	            _this._loadData();
	        }
	    },
        //[End]

        //[Start]
	    searchField_KeyPress: function (item, e) {
	        ///<summary>:KeyPress</summary>
	        var key = e.getKey();
	        if (key == 13) {
	            //                this.setValue(this.el.dom.value);
	            _this.searchField_TriggerClick(2);
	        }
	        else if (key == 27) {
	            $G.getCmp("searchField").setValue("");
	            _this.searchField_TriggerClick(1);
	        }
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
    GTP.AppFrameV2.DynaBizComp.DynaRefLookupPage = _class;
})();
//</Bottom>
//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

        //[Start]
	    _loadEditData: function (id) {
	        ///<summary>加载维护数据</summary>
	        var dataSource = $G.DataContext.getDataSource("Dict");
	        if (id) {
	            dataSource.AP_loadDataById(id);
	        }
	        else {
	            dataSource.addRecord();
	        }
	    },
        //[End]

        //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        Ext.net.ResourceMgr['bizComp'] = "";

	        _super.Page_DocumentReady();

	        if ($G.Params.state) {
	            $G.States.setCurrentState($G.Params.state);
	        }
	        else {
	            $G.States.setCurrentState("STATE_READONLY");
	        }

	        if ($G.Params.id && $G.Params.id > 0) {
	            _this._loadEditData($G.Params.id)
	        }
	        else {
	            _this._loadEditData(0)
	        }
	    },
        //[End]

        //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>关闭:actCancel</summary>
	        $G.close(false);
	    }
        //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.DictViewPage = _class;
})();
//</Bottom>
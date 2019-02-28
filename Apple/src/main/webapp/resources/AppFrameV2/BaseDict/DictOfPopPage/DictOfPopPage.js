//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.DictListPage,
	{
	    //</Top>

	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init.apply(this, arguments);

	        _this._dictView = $G.getCmp("dictView");
	        if (_this._dictView) {
	            _this._dictView.windowViewName = "editView";

	            if ($G.PageExtend.LinkField) {
	                var fields = $G.PageExtend.LinkField.split(";");
	                _this._setLinkColumn(_this._dictView, fields);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _setLinkColumn: function (grid, fields) {
	        ///<summary>构造超链接字段</summary>
	        return Ext.AppFrame.Common.setLinkColumn(grid, fields,
                    function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!_this._isAuthAction("Ap_GridView_actNew"))
                            return '<a onclick="$G.Page.Ap_GridView_actOnlyView_Handler(_this._dictView);" href="#">' + value + '</a>';
                        else
                            return '<a onclick="$G.Page.Ap_GridView_actView_Handler(_this._dictView);" href="#">' + value + '</a>';
                    });
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.DictOfPopPage = _class;
})();
//</Bottom>
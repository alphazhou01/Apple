//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.TreeDictListPage,
	{
	    //</Top>

	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init.apply(this, arguments);
	        _this._tree = $G.getCmp("dictView");
	        if (_this._tree) {
	            _this._tree.windowViewName = "editView";
	            if ($G.PageExtend.LinkField) {
	                var fields = $G.PageExtend.LinkField.split(";");
	                _this._setLinkColumn(_this._tree, fields);
	            }
	            _this._tree.on("rowclick", function (item, rowindex, e) {
	                //执行这个主要是为了触发规则..
	                if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", _this._tree.apf_ds.type) == "true") {
	                    var records = item.getSelectionModel().getSelections();
	                    if (records.length > 0) {
	                        if (records[0].data.D_DeptId != Ext.AppFrame.Common.getDeptId()) {
	                            var Ap_TreeGrid_actNodeRemove = Gtp.net.Global.Actions.getAction("Ap_TreeGrid_actNodeRemove");
	                            var Ap_TreeGrid_actNodeEdit = Gtp.net.Global.Actions.getAction("Ap_TreeGrid_actNodeEdit");
	                            Ap_TreeGrid_actNodeRemove.setDisabled(true);
	                            Ap_TreeGrid_actNodeEdit.setDisabled(true);
	                        }
	                        else {
	                            var Ap_TreeGrid_actNodeRemove = Gtp.net.Global.Actions.getAction("Ap_TreeGrid_actNodeRemove");
	                            var Ap_TreeGrid_actNodeEdit = Gtp.net.Global.Actions.getAction("Ap_TreeGrid_actNodeEdit");
	                            Ap_TreeGrid_actNodeRemove.setDisabled(false);
	                            Ap_TreeGrid_actNodeEdit.setDisabled(false);
	                        }
	                    }
	                }
	            });
	        }
	    },
	    //[End]

	    //[Start]
	    _setLinkColumn: function (grid, fields) {
	        ///<summary>构造超链接字段</summary>
	        return Ext.AppFrame.Common.setLinkColumn(grid, fields,
                    function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!_this._isAuthAction("Ap_GridEditor_actSaveAndAdd"))
                            return '<a onclick="$G.Page.Ap_TreeGrid_actNodeOnlyView_Handler(_this._tree);" href="#">' + value + '</a>';
                        else
                            return '<a onclick="$G.Page.Ap_TreeGrid_actNodeView_Handler(_this._tree);" href="#">' + value + '</a>';

                    });
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.TreeDictOfPopPage = _class;
})();
//</Bottom>
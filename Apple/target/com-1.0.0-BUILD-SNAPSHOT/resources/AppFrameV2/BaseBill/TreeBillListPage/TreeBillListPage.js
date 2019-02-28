//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseBill");
    var _class = Ext.extend(GTP.AppFrameV2.BaseBill.BillListPage,
	{
	    //</Top>

	    //[Start]
	    _init: function () {

	        _super._init();
	        //不执行懒加载
	        var tree = $G.getCmp("billView");
	        tree.queryLevel = 0;
	    },
	    //[End]

	    //[Start]
	    actNewChild_Handler: function (sender) {
	        ///<summary>下级新增:actNewChild</summary>
	        var selectedRows = $G.getCmp("billView").AP_selectRows();
	        if (selectedRows.length > 0) {
	            var record = selectedRows[0];
	            var params = sender.params;
	            if (Ext.isEmpty(params)) params = {};
	            params.pid = record.id;
	            params.rid = record.data.RID;
	            $G.Page._redirectEditPage(null, "STATE_EDIT", params);
	        }
	        else {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	        }
	    },
	    //[End]

	    //[Start]
	    billView_RowClick: function (item, rowIndex, e) {
	        ///<summary>RowClick</summary>
	        var billView = $G.getCmp("billView");
	        var selectedRows = billView.AP_selectRows();
	        if (selectedRows.length > 0) {
	            var record = selectedRows[0];
	            var act = $G.getCmp("actNewChild");
	            if (act) {
	                var limitlevel = 2;
	                if (!Ext.isEmpty($G.PageExtend.LimitLevel)) limitlevel = parseInt($G.PageExtend.LimitLevel);
	                if (limitlevel < 2) limitlevel = 2;
	                var level = Ext.AppFrame.Bill.GetBillLevel(billView.apf_ds, record);
	                if (level < limitlevel) {
	                    act.setDisabled(!_this._isAuthAction("actNewChild"));
	                }
	                else act.setDisabled(true);
	            }
	        }

	    },
	    //[End]

	    //[Start]
	    billView_BeforeRender: function (item) {
	        ///<summary>BeforeRender</summary>
	        item.columnLines = true;
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseBill.TreeBillListPage = _class;
})();
//</Bottom>
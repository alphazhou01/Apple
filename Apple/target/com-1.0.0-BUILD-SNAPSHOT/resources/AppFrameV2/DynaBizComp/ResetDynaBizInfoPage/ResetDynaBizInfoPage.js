//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
	Ext.ns("GTP.AppFrameV2.DynaBizComp");
	var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	//[Start]
	    _initQueryBox: function (config, index) {
	        ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>
	        var grid = $G.getCmp("gridView");

	        config.getCriteira = function (queryBoxParam) {
	            var qp = grid.apf_queryPlan;
	            if (qp) {
	                qp.currentPage = 1;
	                if (queryBoxParam.size > 0) qp.pageSize = queryBoxParam.size;
	            }
	            _this._loadData({ resetpage: true, pageSize: qp.pageSize, noCacheParam: true });
	        }
	        Ext.AppFrame.Util.createQueryBox(grid, config);
	        var toolbarName = "gridView_toolbar";
	        if (Ext.isEmpty(index) || (Ext.isNumber(index) && index < 0)) {
	            var toolbar = $G.getCmp(toolbarName);
	            if (toolbar && toolbar.items) {
	                index = $G.getCmp(toolbarName).items.length;
	            }
	        }
	        if (Ext.isEmpty(index) || index < 0) index = 0;
	        if (toolbarName) {
	            Ext.ux.query.showQueryBox(toolbarName, index);
	            $G.getCmp("gridView").doLayout();
	        }
	    },
	//[End]

	//[Start]
	    _loadData: function (config) {
	        var grid = $G.getCmp("gvInfo");
	        if (Ext.isEmpty(config)) config = {};
	        config.action = "GetDynaBizInfos";
	        grid.AP_loadData(config);
	    },
	//[End]

	//[Start]
	    _init: function () {
	        ///<summary>初始化页面</summary>
	        var result = _super._init ? _super._init.apply(this, arguments) : undefined;
	        // _this._initQueryBox({});
	        _this._loadData({});
	        _this.alreadyList = [];
	        return result;
	    },
	//[End]

	//[Start]
	    actRePublish_Handler: function (sender) {
	        ///<summary>重新发布:actRePublish</summary>
	        var rows = $G.getCmp("gvInfo").AP_selectRows();
	        if (rows.length > 0) {
	            Gtp.net.Global.dispatcher({
	                controller: Gtp.net.Global.getPageController(),
	                async: true,
	                action: "RePublishByName",
	                args: [rows[0].data.Name],
	                success: function (result) {
	                    $G.alert("提示", "更新成功");
	                },
	                failure: function () {

	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    gvInfo_RowClick: function (item, rowIndex, e) {
	        ///<summary>RowClick</summary>
	        var rows = $G.getCmp("gvInfo").AP_selectRows();
	        if (rows.length > 0) {
	            var grid = $G.getCmp("gridView");
	            grid.apf_queryPlan.setFilterValue("filter_OriginalBizName", rows[0].data.Name);
	            grid.AP_loadData({});
	        }
	    }
	//[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.DynaBizComp.ResetDynaBizInfoPage = _class;
})();
//</Bottom>
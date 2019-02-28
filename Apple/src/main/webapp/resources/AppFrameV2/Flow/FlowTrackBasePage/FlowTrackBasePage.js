//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.Flow");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	    //[Start]
	    _loadData: function () {
	        ///<summary></summary>
	        var dataSource = $G.DataContext.getDataSource("FlowTraceQuery"); //queryPlan.dataSource

	        var taskID = $G.Params.taskID ? parseInt($G.Params.taskID) : 0;
	        var dataId = $G.Params.dataID ? parseInt($G.Params.dataID) : 0;
	        var metaName = $G.Params.entityCode ? $G.Params.entityCode : "";

	        var config = {
	            async: true,
	            controller: Gtp.net.Global.getPageController(),
	            action: "QueryFlowList",
	            args: [taskID, dataId, metaName, 0],
	            cacheResult: dataSource.needCache(),
	            success: function (result) {
	                dataSource.loadData(result);
	                if (!$G.Params.taskID) {
	                    var record = dataSource.getDataRecord();
	                    $G.Params.taskID = record.get("TaskID") ? parseInt(record.get("TaskID")) : 0;
	                }
	            },
	            failure: function (arguments) {
	                return true;
	                // Gtp.net.GtpDispatcher.prototype.onFailure.apply(this, arguments);
	            }
	        }
	        Gtp.net.Global.dispatcher(config);
	    },
	    //[End]

	    //[Start]
	    _loadfsData: function (needCount) {
	        ///<summary></summary>
	        var dataSource = $G.DataContext.getDataSource("MessageTraceQuery"); //queryPlan.dataSource
	        var qb = $G.QueryPlans.getQueryPlan("queryPlan" || 0);
	        var qparam = qb.getQueryParam();
	        qparam.needCount = needCount;
	        dataSource.AP_loadData({ args: [qb.getQueryParam()] });
	        //  Ext.ux.AppFrame.DataSource.loadData(dataSource, qparam, { action: "QueryMessageList" });
	    },
	    //[End]

	    //[Start]
	    tabView_BeforeTabChange: function (item, newTab, currentTab, index, activeIndex) {
	        ///<summary>BeforeTabChange</summary>
	        if (newTab.id == "tabView_tab") {
	            if (!this._isDataLoaded) {
	                this._isDataLoaded = true;
	                _this._loadData();
	            }
	        } else if (newTab.id == "tabView_fs") {  //分送记录
	            if (!this._isfsDataLoaded) {
	                this._isfsDataLoaded = true;
	                _this._loadfsData(true);
	            }
	        }
	        else {
	            if (!this._isDesignerViewLoaded) {
	                this._isDesignerViewLoaded = true;
	                var appName = Gtp.net.Global.getAppName();
	                var url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + appName + "/WorkflowDesigner/DesignerViewJs.aspx";
	                if ($G.Params.taskID) {
	                    url += '?taskID=' + $G.Params.taskID;
	                }
	                else {
	                    url += '?entityCode=' + $G.Params.entityCode.replace('Query', '') + '&dataID=' + $G.Params.dataID;
	                }
	                document.getElementById('fly').src = url;
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>DocumentReady</summary>
	        _super.Page_DocumentReady ? _super.Page_DocumentReady.apply(this, arguments) : undefined;
	        var dataId = $G.Params.dataID ? parseInt($G.Params.dataID) : 0;
	        var metaName = $G.Params.entityCode ? $G.Params.entityCode.replace('Query', '') : "";
	        var qb = $G.QueryPlans.getQueryPlan("queryPlan" || 0);
	        qb.setFilterValue("filter_Data1", dataId);
	        qb.setFilterValue("filter_Key1", metaName);

	        var pagingToolbar = $G.getCmp("gridView_toolbar");
	        pagingToolbar.on("loaddata", function (item, index, size) {
	            qb.currentPage = index;
	            qb.pageSize = size;
	            _this._loadfsData(false);
	        });

	        Gtp.net.Global.dispatcher({
	            controller: Gtp.net.Global.getPageController(),
	            async: true,
	            action: "QueryMessageListCount",
	            args: [qb.getQueryParam()],
	            success: function (result) {
	                if (result == 0) {
	                    $G.getCmp('tabView_fs').ownerCt.hideTabStripItem("tabView_fs"); //隐藏分送记录..
	                }
	            },
	            failure: function () {

	            }
	        });
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.Flow.FlowTrackBasePage = _class;
})();
//</Bottom>
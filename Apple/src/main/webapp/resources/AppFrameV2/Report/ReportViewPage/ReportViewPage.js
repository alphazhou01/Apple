//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.Report");
    var _class = Ext.extend(Gtp.net.BasePage,
	{
	    //</Top>

	    //[Start]
	    ReportViewPage_DocumentReady: function () {
	        ///<summary>DocumentReady</summary>

	        $G.Page.__iframeName = "__reportView_printIFrame";

	        if (window.opener) {
	            if (window.opener.$G.ReportMain_ListArgs) {
	                $G.Page.__reportArgs = window.opener.$G.ReportMain_ListArgs;
	            }
	            if (window.opener.$G.ReportMain_ReportArgs) {
	                $G.Page.__reportInnerParam = window.opener.$G.ReportMain_ReportArgs;
	            }
	            if (window.opener.$G.ReportMain_QueryPlans) {
	                $G.Page.__queryPlans = window.opener.$G.ReportMain_QueryPlans;
	            }
	        }
	        else if ($G.Params.win && $G.Params.win.$G) {
	            if ($G.Params.win.$G.ReportMain_ListArgs) {
	                $G.Page.__reportArgs = $G.Params.win.$G.ReportMain_ListArgs;
	            }
	            if ($G.Params.win.$G.ReportMain_ReportArgs) {
	                $G.Page.__reportInnerParam = $G.Params.win.$G.ReportMain_ReportArgs;
	            }
	            if ($G.Params.win.$G.ReportMain_QueryPlans) {
	                $G.Page.__queryPlans = $G.Params.win.$G.ReportMain_QueryPlans;
	            }
	        }

	        $G.Page.__entityKeyValue = parseInt($G.Params["entityKeyValue"]) ? parseInt($G.Params["entityKeyValue"]) : null;

	        $G.getCmp("cboxSelectReport").on("select", function (a, b, c) {
	            var reportId = b.data.value;
	            if (!!reportId) {
	                _this._selectReport(reportId);
	            }
	        });
	        if ($G.Page.__reportArgs) {
	            _this._initReportView($G.Page.__reportArgs, $G.Page.__entityKeyValue, $G.Page.__queryPlans, $G.Page.__iframeName, $G.Page.__reportInnerParam);
	        }
	    },
	    //[End]

	    //[Start]
	    _selectReport: function (reportId) {
	        ///<summary>:Select</summary>
	        if (!!reportId) {
	            _this._showRreport(reportId, $G.Page.__entityKeyValue, $G.Page.__queryPlans, $G.Page.__iframeName, $G.Page.__reportInnerParam);
	        }

	    },
	    //[End]

	    //[Start]
	    _showRreport: function (reportId, entityKeyValue, queryPlans, iframeName, reportInnerParam) {
	        ///<summary></summary>
	        var config = {
	            reportId: reportId,
	            entityKeyValue: entityKeyValue,
	            queryPlans: queryPlans,
	            preview: iframeName,
	            args: reportInnerParam
	        };
	        Gtp.net.Global.print(config);
	    },
	    //[End]

	    //[Start]
	    _initReportView: function (reportArgs) {
	        /// <param name="entityKeyValue" type="String">持久化实体的主键</param>
	        /// <param name="queryPlan" type="Array">查询方案数组</param>
	        /// <param name="preview" type="Boolean">1、是否是预览 true:预览 false:打印；2、String:显示报表的iframe的名称；3、报表导出文件：1：导出excel，2：导出pdf，3：导出word</param>
	        /// <param name="reportInnerParam" type="Array">报表参数数据组[{key:'aaa',value:'bbb'},{Key:'ccc',Value:'ddd'}]</param>


	        var selectReportCallback = function (r) {
	            if (!!r && Ext.isArray(r) && r.length > 0) {
	                var selectReport = $G.getCmp("cboxSelectReport");
	                for (var i = 0; i < r.length; i++) {
	                    selectReport.addItem(r[i].Name, r[i].ID);
	                }

	                selectReport.selectByIndex(0, true);
	            } else {
	                $G.showInfo("提示", "相应的报表模板停用或者不存在!"); //Ext.Msg.alert("错误", "相应的报表模板停用或者不存在!");
	            }
	        };

	        (function (listArgs, callback) {
	            $G.dispatcher({
	                controller: "GTP.Report.Facade.Controller",
	                action: "GetReportList",
	                args: listArgs,
	                success: function (result) {
	                    callback.call(this, result);
	                },
	                failure: function (cause, statusCode, msg, detailMsg) {
	                    $G.showInfo("错误", msg, detailMsg);
	                }
	            });
	        })(reportArgs, selectReportCallback);

	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.Report.ReportViewPage = _class;
})();
//</Bottom>
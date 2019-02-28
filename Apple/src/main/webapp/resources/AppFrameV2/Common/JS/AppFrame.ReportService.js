Ext.namespace("Ext.ux.AppFrame.ReportService");

///sender：启动打印的触发控件
///queryPlanParam：查询方案
///isPreview：是否打印预览，true为预览，false为直接打印
///reportType：报表类型，List是列表打印，Single为单条记录打印
///extendArr：扩展数据
///reportArgs：报表参数数据组
Ext.ux.AppFrameV2.ReportService.Print = function (sender, queryPlanParam, isPreview, reportType, extendArr, reportArgs) {

    //准备打印请求
    var Print_Ready = function (sender, queryPlanParam, isPreview, reportType, extendArr, reportArgs) {

        var entityKeyValue;                                     //主键值，用于单条记录打印
        var group = queryPlanParam.queryEntity;

        //三个参数:fullcode，类型，扩展数据集合
        var listArgs = new Array();

        listArgs.push($G.getBizComp());                         //模块树的fullcode，Ext.net.ResourceMgr.pageNamespace

        if (reportType == "Single") {
            entityKeyValue = queryPlanParam.filters[0].value;   //主键值
            listArgs.push("Single");                            //报表类型List或者Single 
        }
        else {
            listArgs.push("List");                              //报表类型List或者Single
        }

        if (extendArr) {
            listArgs.push(extendArr);                           //扩展数据的集合
        }

        _showPrintSetting(sender, group, listArgs, entityKeyValue, [queryPlanParam], isPreview, reportArgs);
    };

    //显示打印设置    
    var _showPrintSetting = function (sender, group, listArgs, entityKeyValue, queryPlans, isPreview, reportArgs) {
        /// <summary>报表打印</summary>
        /// <param name="sender" type="Object"></param>
        /// <param name="group" type="String"></param>
        /// <param name="listArgs" type="Array">查询打印列表需要的参数(可能包含扩展信息)</param>
        /// <param name="queryPlans" type="Array">查询方案数组</param>
        /// <param name="isPreview" type="Boolean">是否是预览 true:预览 false:打印 String:显示报表的iframe的名称</param>
        /// <param name="reportArgs" type="Array">报表参数（直接通过URL传送给报表）</param>
        /// <returns type=""></returns>
        var _queryReport = function (listArgs, callback) {
            $G.dispatcher({
                controller: "GTP.Report.Facade.Controller",
                action: "GetReportList",
                args: listArgs,
                success: function (result) {
                    callback.call(this, result);
                },
                failure: function (cause, statusCode, msg, detailMsg) {
                    Gtp.net.MessageBox.exception(GTP.AppFrameV2.Res.Hint, arguments[4]);
                }
            });
        };

        group = "_queryReport_" + group;

        var _fn = function (id) {
            var config = {
                reportId: id,
                entityKeyValue: entityKeyValue,
                queryPlans: queryPlans,
                isPreview: isPreview,
                args: reportArgs
            };
            _print(config);
        };

        var _exec = function () {
            var r = $G.Page[group];
            if (!!r && Ext.isArray(r) && r.length > 0) {
                if (r.length == 1) {
                    _fn(r[0].ID);
                } else if (!sender.menu) {
                    var itemsArr = new Array();
                    for (var i = 0; i < r.length; i++) {
                        itemsArr[i] = {
                            _id: r[i].ID + "",
                            text: r[i].Name,
                            iconCls: 'icon-page',
                            handler: function (t) {
                                _fn(t._id);
                            }
                        }
                    }
                    sender.menu = new Ext.menu.Menu({
                        items: itemsArr
                    });
                    sender.showMenu();
                }
            } else {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "相应的报表模板停用或者不存在!");
            }
        };


        if ($G.Page[group] === undefined) {
            _queryReport(listArgs, function (r) {
                $G.Page[group] = r;
                _exec();
            });
        } else {
            _exec();
        }
    };

    //打印事件
    var _print = function (reportId, entityKeyValue, queryPlans, isPreview, reportArgs) {
        /// <summary>报表打印</summary>
        /// <param name="reportId" type="String">报表ID</param>
        /// <param name="entityKeyValue" type="String">持久化实体的主键</param>
        /// <param name="queryPlans" type="Array">查询方案数组</param>
        /// <param name="isPreview" type="Boolean">是否是预览 true:预览 false:打印 String:显示报表的iframe的名称</param>
        /// <param name="reportArgs" type="Array">报表参数数据组[{key:'aaa',value:'bbb'},{Key:'ccc',Value:'ddd'}]</param>
        /// <returns type=""></returns>

        var config = Ext.isObject(reportId) ? reportId : {
            reportId: reportId,
            entityKeyValue: entityKeyValue,
            isPreview: isPreview,
            queryPlans: queryPlans,
            args: reportArgs
        };

        $G.dispatcher({
            controller: config.controller || "GTP.Report.Facade.Controller",
            action: config.action || "showReportByEntity",
            args: [config.reportId, config.entityKeyValue || null, config.queryPlans || [], config.args || []],
            success: function (result) {
                /**判断当前模版是否禁用**/
                if (result.length == 1) {
                    if (result[0].Value == "report_server_not_start") {
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "报表服务未启动！");
                    } else if (result[0].Value == "report_is_not_enable") {
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "相应报表模版未启用");
                    }
                    return;
                }

                var ps = {};
                var name = "__report_printIFrame";

                if (Ext.isString(config.isPreview)) {
                    name = config.isPreview;
                    ps.width = -1;
                    ps.height = -1;
                } else {
                    ps.width = 200;
                    ps.height = 200;
                    ps.autoPrint = !config.isPreview;
                    if (!document.getElementById(name) || document.getElementsByName(name).length <= 0) {
                        var iframe = document.createElement("IFRAME");
                        iframe.id = name;
                        iframe.name = name;
                        iframe.width = 500;
                        iframe.height = 500;
                        iframe.frameborder = 0;
                        //iframe.style = "display:none;";
                        iframe.src = "javascript:false";
                        document.body.appendChild(iframe);
                        window.frames[name].name = name;
                    }
                }

                for (var i = 0; i < result.length; i++)
                    ps[result[i].Key] = result[i].Value;


                var q = document.location.search || document.location.hash || "";
                if (q.length > 1) {
                    var height = Ext.urlDecode(q.substring(1)).height;
                    if (height) {
                        ps["height"] = height;
                    }
                }

                document.charset = 'GBK';
                try {
                    $G.open({
                        url: ps.url + "/reportJsp/showReport.jsp",
                        target: name,
                        parameters: ps,
                        method: "post",
                        acceptCharset: 'GBK'
                    });
                } finally {
                    document.charset = 'UTF-8';
                }
            },
            failure: function (cause, statusCode, msg, detailMsg) {
                Gtp.net.MessageBox.exception(GTP.AppFrameV2.Res.Hint, arguments[4]);
            }
        });
    };



    //执行打印
    Print_Ready(sender, queryPlanParam, isPreview, reportType, extendArr, reportArgs);
};


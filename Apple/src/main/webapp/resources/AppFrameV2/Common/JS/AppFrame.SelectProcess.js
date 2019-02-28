/*调用方法：ShowSelectProcess(null,"GTP.MM.MatPurchaseContractComp",function(processCode,args){alert(processCode);},{});
访问轨迹图：DesignerViewJs.aspx?entityCode=GTP.MM.Contract.MatPurchaseContract&dataID=5,就这两个参数
外部调用函数：autoShowDialog是否自动判断显示对话框（否则一直显示对话框）, bizCode业务组件编码, 
callback回调函数（参数：返回选择的流程CODE，原始arg对象）, callbackArg原始arg对象*/

/*返回值为数组[流程名,流程ID]*/
/*返回值为null没有选择，点取消按钮*/
/*返回值为["0",""]，没有启用的流程*/
Ext.namespace("Ext.AppFrameV2.SelectProcess");
Ext.AppFrameV2.SelectProcess.GetProcess = function (bizCode, fulldeptID) {
    ///<summary>选择流程主函数</summary>

    //增加部门过滤...
    if (fulldeptID)
        fulldeptID = fulldeptID.replace(/\//g, ".D/") + ".D";

    var params = {
        ModuleFullCode: bizCode,
        FindToFloder: true,
        CheckOrg: fulldeptID
    };
    var processResult = null;
    Ext.AppFrameV2.SelectProcess.doAction("GTP.Workflow.Processes.Process", "QueryEnabledProcess", [params], function (result) {

        processResult = result;

    }, {}, false);

    return processResult;
};

Ext.AppFrameV2.SelectProcess.ShowSelectProcess = function (processes, bizCode, recordId, entityType, callback, callbackArg, autoShowDialog, showCheckerDialog) {
    ///<summary>选择流程主函数</summary>
    var loadjsFiles = [];
    /*下面7个文件动态加载*/
    loadjsFiles.push($G.getAppName() + "/Workflow/js/GTPLibrary.js");
    loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.api.js");
    loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.base.js");
    loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.action.js");
    loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.task.js");
    loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.ux.js");
    //loadjsFiles.push($G.getAppName() + "/Workflow/js/Workflow.custom.AppFrame.js");
    loadjsFiles.push($G.getAppName() + "/Workflow/js/InputQueryManager.js");
    loadjsFiles.push($G.getAppName() + "/Workflow/js/gjs.view.infobox.js");

    /*动态加载*/
    var jsFileList = Ext.AppFrame.Util.CheckJS(loadjsFiles);

    Ext.AppFrame.Util.LoadJS(jsFileList);

    if (processes.length == 1) {
        if (autoShowDialog) {
            //只有一个流程显示流程选择窗口
            Ext.AppFrameV2.SelectProcess.ShowSelectProcessDialog(processes, bizCode, Ext.AppFrameV2.SelectProcess.StartProcess, [recordId, entityType, callback, callbackArg, showCheckerDialog], autoShowDialog);
        }
        else {
            //只有一个流程不显示流程选择窗口
            //Ext.AppFrameV2.SelectProcess.StartProcess(processes, [recordId, entityType, callback, callbackArg, showCheckerDialog]);
            Ext.AppFrameV2.SelectProcess.ShowSelectProcessDialog(processes, bizCode, Ext.AppFrameV2.SelectProcess.StartProcess, [recordId, entityType, callback, callbackArg, showCheckerDialog], autoShowDialog);
        }
    } else {
        //多个流程，选择流程选择窗口
        Ext.AppFrameV2.SelectProcess.ShowSelectProcessDialog(processes, bizCode, Ext.AppFrameV2.SelectProcess.StartProcess, [recordId, entityType, callback, callbackArg, showCheckerDialog], true);
    }
};

Ext.AppFrameV2.SelectProcess.StartProcess = function (processes, args) {
    //启动流程....
    if (processes == null) return;

    var recordId = args[0], entityType = args[1], callback = args[2], callbackArg = args[3], showCheckerDialog = args[4];

    //点击取消按钮，没有选择流程           
    if (!processes || !processes[0] || !processes[0].ProcessCode) {
        return false;
    }
    else if (processes[0].ProcessCode && processes[0].ProcessName && !showCheckerDialog) {
        Ext.AppFrameV2.SelectProcess.StartBillProcess(processes[0].ProcessCode, recordId, entityType, null, callback, callbackArg);
    }
    else if (processes[0].ProcessCode && processes[0].ProcessName && showCheckerDialog) {
        var taskControl = args.taskControl;
        if (taskControl) {
            //新增加逻辑...合并弹出来选人窗口
            actStartProcessExecute({
                taskControl: taskControl,
                processID: processes[0].ProcessCode,
                data: recordId,
                beforeQuerys: [function (taskResult, args, param) {
                    param.unQuery = true;
                    param.dialog = false;
                    taskResult.taskControl = param.taskControl;
                } ],
                bqArgs: [{ taskControl: taskControl}],
                beforeExecutes: [function (result, args2, param) {
                    Ext.AppFrameV2.SelectProcess.StartBillProcess(processes[0].ProcessCode, recordId, entityType, result.taskControl, callback, callbackArg);
                    return true;
                } ],
                beArgs: [{}]
            });

        }
        //        else {
        //            //以前的。。。弹出选择审批人窗口
        //            actStartProcessExecute({
        //                processID: processes[0].ProcessCode,
        //                data: recordId,
        //                beforeExecutes: [function (result, args2, param) {
        //                    Ext.AppFrameV2.SelectProcess.StartBillProcess(processes[0].ProcessCode, recordId, entityType, result.taskControl, callback, callbackArg);
        //                    return true;
        //                } ],
        //                beArgs: [{}]
        //            });
        //        }
    }
};



//[Start]
Ext.AppFrameV2.SelectProcess.StartBillProcess = function (FlowCode, recordId, entityType, taskControl, callback, callbackArg) {

    var config = {
        controller: Gtp.net.Global.getPageController(),
        action: "SubmitBills",
        args: [[recordId], entityType, FlowCode, taskControl],
        success: function (result) {
            if (callback) {
                callback(callbackArg);
            }
        }
    };
    $G.dispatcher(config);
};
//[End] 

var initConfig;
Ext.AppFrameV2.SelectProcess.ShowSelectProcessDialog = function (processes, bizCode, callback, callbackArg, autoShowDialog) {
    ///<summaparamry>显示对话框</summary>

    var getProcessData = function (args) {
        var param = {};
        param.processID = ComboProcess.getValue();
        param.processName = ComboProcess.getText();
        param.processVersion = 0;
        param.data = args[0];
        param.entityType = args[1];
        param.callback = args[2];
        param.callbackArg = args[3];
        param.showCheckerDialog = args[4];
        return param;
    };

    var getTaskControl = function (args) {
        var taskControl = null;
        var param = getProcessData(args);
        if (param) {
            $WorkFlow.startQuery(param.processID, $WorkFlow.param(param.processVersion, 0), $WorkFlow.param(param.data), function (result) {
                if (result) {
                    taskControl = result;
                }
            }, null, false);
        }
        return taskControl;
    };

    var getDialogPanel = function (taskControl, config) {
        initConfig = {
			id: "ID_GTP_Workflow_AppFrame_SendTask_Panel",
            border: false,
            region: 'center',
            hidenBottomBtn: true,
            //dialogType: 'sjoa',
            taskID: config.taskID ? config.taskID : -1,
            oper: config.action ? config.action : 'advance',
            annotate: config.annotate ? config.annotate : { remark: '', result: '', mustRemark: false },
            height: 400,
            width: 680,
            cardType: 'sendTask'
        };
        if (taskControl)
            config.taskControl = taskControl;
        if (!config.callback) {
            config.callback = function () { };
        }
        Ext.apply(initConfig, config);

        var dialogPanel = $WorkFlow.TaskSend.dialogPanel(initConfig, initConfig.callback, initConfig.callbackArgs);
        return dialogPanel;

    };

    var ComboProcess = new Ext.form.ComboBox({
        id: "ComboProcess",
        displayField: "name",
        valueField: "value",
        fieldLabel: "选择流程",
        readOnly: false,
        editable: false,
        typeAhead: true,
        mode: "local",
        triggerAction: "all",
        emptyText: "",
        selectOnFocus: false,
        allowBlank: false
    });
    var itemPanel = new Ext.form.FormPanel({
        layout: "border",
        width: 690,
        height: 370,
        border: false,
        items: [{
            border: false,
            region: "north",
            height: 25,
            items: [ComboProcess]
        }, {
            border: true,
            region: "center",
            html: "<iframe id=\"iframePng\" width=\"100%\" height=\"100%\" frameborder=\"0\" src=\"about:blank\"></iframe>"
        }]
    });
    var showCheckerDialog = callbackArg[4];
    var beforeClick = false;
    var taskControl = null;
    var config = { region: 'center', action: 'start', oper: 'advance', callback: callback, callbackArg: callbackArg };
    //$WorkFlow.Custom.updateCustomConfig(config);
    var dialogPanel;
    var comboxIsChange = false;
    var firstLoad = true;
    var nextFunc = function () {
        if (ComboProcess.getValue() == null) {
            Ext.Msg.alert("提示", "请选择流程");
            return;
        }
        if (autoShowDialog)
            beforeBtn.setVisible(true);
        else
            beforeBtn.setVisible(false);
        nextBtn.setVisible(false);
        okBtn.setVisible(true);
        var fn = function () {
            comboxIsChange = false;
            taskControl = getTaskControl(callbackArg);
            dialogPanel = getDialogPanel(taskControl, config);
            dialogWindow.add(dialogPanel);
            dialogWindow.doLayout();
            dialogWindow.setTitle(config.oper == "createFreeTask" ? GTPWorkflow_dialogTitleCreateFreeTask : (config.oper == "back" ? GTPWorkflow_dialogTitleBackTask : (config.oper == "trans" ? GTPWorkflow_dialogTitleTransTask : (config.oper == "jump" ? "更改处理节点" : (config.oper == "change" ? "更改处理人" : (config.oper == "hurry" ? "催办" : GTPWorkflow_dialogTitleSendTask))))))
            dialogWindow.dialogPanel = dialogPanel;
            dialogPanel.dialogWindow = dialogWindow;
            if (dialogPanel.afterLoadData) {
                dialogPanel.afterLoadData();
            } else {
                dialogPanel.loadData();

                dialogPanel.setFocus(null);
                if ((initConfig.cardType == "all") && document.getElementById("ext-gen120"))
                    document.getElementById("ext-gen120").style.width = "180px";
            }
            itemPanel.hide();
            dialogPanel.show();
        }

        if (firstLoad) {
            firstLoad = false;
            fn();
			Ext.getCmp("ID_GTP_Workflow_AppFrame_SendTask_Panel").hide();
			setTimeout('Ext.getCmp("ID_GTP_Workflow_AppFrame_SendTask_Panel").show()', 100);
			setTimeout('Ext.getCmp("ID_GTP_Workflow_AppFrame_SendTask_Panel").doLayout()', 200);
        } else if (comboxIsChange) {
            comboxIsChange = false;
            dialogWindow.remove(dialogPanel, true);
            fn();
			Ext.getCmp("ID_GTP_Workflow_AppFrame_SendTask_Panel").hide();
			setTimeout('Ext.getCmp("ID_GTP_Workflow_AppFrame_SendTask_Panel").show()', 100);
			setTimeout('Ext.getCmp("ID_GTP_Workflow_AppFrame_SendTask_Panel").doLayout()', 200);
        } else {
            itemPanel.hide();
            dialogPanel.show();
            okBtn.setDisabled(false);
        }
    };
    var okBtn = new Ext.Button({
        text: GTPWorkflow_textOK,
        cls: "g-btn-recommend",
        hidden: showCheckerDialog,
        handler: function () {
            if (!showCheckerDialog) {
                Ext.AppFrameV2.SelectProcess.StartProcess([{ ProcessCode: ComboProcess.getValue(), ProcessName: ComboProcess.getText()}], callbackArg);
                dialogWindow.close();
            } else if (dialogPanel) {

                if (dialogPanel.currentTaskCol.End || !Ext.isEmpty(dialogPanel.getTask_Executors())) { //先判断是否结束节点
                    taskControl = dialogPanel.currentTaskControl(false);
                    if (dialogPanel.currentTaskCol.End || !Ext.isEmpty(taskControl)) {
                        callbackArg.taskControl = taskControl;
                        Ext.AppFrameV2.SelectProcess.StartProcess([{ ProcessCode: ComboProcess.getValue(), ProcessName: ComboProcess.getText()}], callbackArg);
                        dialogWindow.close();
                    }
                }
            }
        }
    });
    var beforeBtn = new Ext.Button({ text: "上一步", hidden: true, handler: function () {
        nextBtn.setVisible(true);
        beforeBtn.setVisible(false);
        okBtn.setVisible(false);
        dialogWindow.setTitle('请选择流程启动');
        itemPanel.show();
        dialogPanel.hide();
    }
    });
    var nextBtn = new Ext.Button({ text: "下一步", hidden: !showCheckerDialog, handler: nextFunc });
    var cancleBtn = new Ext.Button({ text: GTPWorkflow_textCancel, handler: function () { dialogWindow.close(); } });
    var dialogWindow = new Ext.Window({
        title: "请选择流程启动",
        width: 700,
        height: 448,
        resizable: false,
        plain: true,
        modal: true,
        closeAction: 'close',
        footerCssClass: "g-btn-area",
        items: [itemPanel],
        fbar: { xtype: "toolbar", items: [beforeBtn, nextBtn, okBtn, cancleBtn] },
        listeners: {
            "close": function () {
                Ext.AppFrameV2.SelectProcess.BeforeUnLoadForProcessPng();
            },
            "afterrender": function () {
                ComboProcess.setWidth(400);
                ComboProcess.on("select", function () {
                    comboxIsChange = true;
                    Ext.AppFrameV2.SelectProcess.ShowProcessPng();
                });
                ComboProcess.on("change", function (t, n, o) {
                    comboxIsChange = true;
                });
                if (processes == null) {
                    Ext.AppFrameV2.SelectProcess.doAction("GTP.Workflow.Processes.Process", "QueryEnabledProcess", [{ ModuleFullCode: bizCode}], function (result) {
                        if (result == null)
                            result = [];
                        Ext.AppFrameV2.SelectProcess.BindProcess(result);
                    }, {});
                }
                else
                    Ext.AppFrameV2.SelectProcess.BindProcess(processes);

                if (!autoShowDialog) {
                    nextFunc();
                }
            }
        }
    });

    dialogWindow.show();
};


Ext.AppFrameV2.SelectProcess.BindProcess = function (result) {
    ///<summary>流程绑定下来对象</summary>
    var doReplaceText = function (oldStr) {
        var newStr = "";
        if (!Ext.isEmpty(oldStr)) newStr = oldStr.replace(/\'/gi, '');
        return newStr;
    }

    var strData = "";
    var ComboProcess = Ext.getCmp("ComboProcess");
    for (var i = 0; i < result.length; i++)
        strData += ",['" + result[i].ProcessCode + "','" + doReplaceText(result[i].ProcessName) + "']";

    if (strData != "") {
        strData = "[" + strData.substr(1) + "]";
        if (ComboProcess != null) {
            ComboProcess.store = new Ext.data.ArrayStore({
                fields: ['value', 'name'],
                data: eval(strData)
            });
        }
        ComboProcess.setValue(result[0].ProcessCode);
        Ext.AppFrameV2.SelectProcess.ShowProcessPng();
    }
    else
        ComboProcess.store = new Ext.data.ArrayStore({ fields: ['value', 'name'], data: [] });
};

Ext.AppFrameV2.SelectProcess.ShowProcessPng = function () {
    ///<summary>加载流程图</summary>
    var iframe = document.getElementById("iframePng");
    if (iframe.contentWindow.ReloadProcessPng)
        iframe.contentWindow.ReloadProcessPng(null, ComboProcess.getValue(), null);
    else {
        var appName = Gtp.net.Global.getAppName();
        var url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + appName + "/WorkflowDesigner/DesignerViewPng.aspx?processCode=" + ComboProcess.getValue();
        iframe.src = url;
    }

};

Ext.AppFrameV2.SelectProcess.doAction = function (uiControler, actionFun, args, callback, callbackArg, async, showMask) {
    ///<summary>访问服务</summary>    
    if (async == null)
        async = true;
    if (showMask == null)
        showMask = true;
    var disp = new Gtp.net.GtpDispatcher({
        url: $G.getAppName() + "/action.ashx",
        async: async,
        showMask: showMask,
        dispatchArgs: {
            controller: uiControler,
            action: actionFun,
            args: args
        },
        listeners: {
            scope: this,
            "success": function (result) {
                if (callback)
                    callback(result, callbackArg);
            },
            "error": function () {
                Gtp.net.GtpDispatcher.prototype.onError.apply(this, arguments);
                if (callback)
                    callback(null, callbackArg, arguments);
            },
            "failure": function () {
                Gtp.net.GtpDispatcher.prototype.onFailure.apply(this, arguments);
                if (callback)
                    callback(null, callbackArg, arguments);
            }
        }
    });
    disp.dispatch();
};

Ext.AppFrameV2.SelectProcess.BeforeUnLoadForProcessPng = function () {
    ///<summary>卸载IFRAME</summary>    
    var iframeList = window.document.getElementsByTagName("iframe");
    if (iframeList.length > 0) {
        for (i = iframeList.length - 1; i >= 0; i--) {
            iframe = iframeList[i];
            if (iframe.src.indexOf("WorkflowDesigner/DesignerViewPng.aspx") > 0) {
                iframe.src = "javascript:false";
                if (iframe.removeNode) {
                    iframe.removeNode(true);
                } else {
                    var tmp = iframe.parentNode;
                    tmp.removeChild(iframe);
                    tmp = null;
                }
                iframe = null;
            }
        }
        //iframeList = null;
        if (window.CollectGarbage)
            setTimeout(window.CollectGarbage, 1000);
    }
};

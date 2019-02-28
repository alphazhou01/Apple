////////////////////////////////////////////////////////////////  
/* 
[功能名称]：单据流程的相关操作
[功能说明]：查看审批历史，发送.
**/
////////////////////////////////////////////////////////////////

(function () {
    var _p = Gtp.net.BasePage;

    Ext.apply(_p.prototype, {

        Ap_WorkFlow_actViewFlow_Handler: function (sender) {
            ///<summary>审批历史</summary>

            var initcfg = this.initialConfig;
            var cmp = _this.getViewObject(sender);
            var cmpType = cmp.getXType();
            var ctrlType = 0;
            if (cmpType == "gtpformpanel" || cmpType == "gtptoolbar") ctrlType = 1;
            else if (cmpType == "gtpgridpanel" || cmpType == "gtptreegridpanel" || cmpType == "multigroupingpanel") ctrlType = 2;

            if (ctrlType == 1) {
                var ds = $G.DataContext.getDataSource(cmp.dataSource);
                if (ds != null) {
                    if (!initcfg.entityType)
                        initcfg.entityType = ds.type;

                    var selectRecord = ds.getDataRecord();
                    initcfg.dataID = selectRecord.id;
                }
            } else if (ctrlType == 2) {
                var ds = $G.DataContext.getDataSource(cmp.dataSource);
                if (ds != null) {
                    if (!initcfg.entityType) initcfg.entityType = ds.type;
                    var rows = cmp.getSelectionModel().getSelections();
                    if (rows.length > 0 && rows[0].data.ID) initcfg.dataID = rows[0].data.ID;
                }
            }

            initcfg.dataID = initcfg.dataID ? initcfg.dataID : $G.Params.id; //记录ID


            var browserDialog = (initcfg.browserDialog == "true") ? true : false;
            try {
                initcfg.dialogWidth = Number(initcfg.dialogWidth);
            }
            catch (e) {
                initcfg.dialogWidth = 900;
            }
            try {
                initcfg.dialogHeight = Number(initcfg.dialogHeight);
            }
            catch (e) {
                initcfg.dialogHeight = 600;
            }

            //initcfg.dialogWidth = Number(initcfg.dialogWidth) ? initcfg.dialogWidth : 500;
            //initcfg.dialogHeight = initcfg.dialogHeight ? initcfg.dialogHeight : 400;

            var inputFunc = eval("$G.Page." + initcfg.initParamFunc);
            if (inputFunc && Ext.isFunction(inputFunc)) {
                var paramList = inputFunc.call();
                if (paramList) {
                    if (paramList.entityType)
                        initcfg.entityType = paramList.entityType;
                    if (paramList.dataID)
                        initcfg.dataID = paramList.dataID;
                    if (paramList.browserDialog)
                        browserDialog = paramList.browserDialog;
                    if (paramList.dialogWidth)
                        initcfg.dialogWidth = paramList.dialogWidth;
                    if (paramList.dialogHeight)
                        initcfg.dialogHeight = paramList.dialogHeight;

                }
            }
            if (initcfg.dialogWidth <= 0) initcfg.dialogWidth = 900;
            if (initcfg.dialogHeight <= 0) initcfg.dialogHeight = 600;

            if (!initcfg.entityType || !initcfg.dataID) {
                Gtp.net.MessageBox.info("提示", "当前没有选择单据");
                return;
            }

            //先判断是否有流程记录
            Gtp.net.Global.dispatcher({
                controller: "GTP.AppFrameV2.Flow.FlowTrackBasePage",
                async: false,
                action: "QueryFlowListCount",
                args: [initcfg.dataID, initcfg.entityType],
                success: function (result) {
                    if (result == 0) {
                        Gtp.net.MessageBox.info("提示", "当前单据没有流程流转记录");
                        return;
                    }
                    var _url; ;
                    if (initcfg.pageFullName) {
                        try {
                            _url = $G.getPageURLByFullName(initcfg.pageFullName);
                        }
                        catch (e) {
                            _url = "";
                        }
                    }
                    if (!_url) {
                        _url = $G.getPageURLByFullName("GTP.AppFrameV2.Flow.FlowTrackPage");
                    }
                    $G.open(
                     {
                         url: _url,
                         title: "流转历史",
                         target: browserDialog ? "_modal" : "_tab",
                         parameters: { entityCode: initcfg.entityType, dataID: initcfg.dataID },
                         features: browserDialog ? { dialogWidth: initcfg.dialogWidth, dialogHeight: initcfg.dialogHeight} : {}
                     }
                     );
                },
                failure: function () {

                }
            });


        },

        actRunWF_Handler: function (sender) {
            ///<summary>添加一条记录</summary>
            var initcfg = sender;

            initcfg.bizComp = initcfg.bizComp ? initcfg.bizComp : $G.getBizComp(); //业务组件名称
            initcfg.dataID = initcfg.dataID ? initcfg.dataID : 0; //记录ID
            initcfg.result = initcfg.result ? initcfg.result : ""; //处理结果
            initcfg.remark = initcfg.remark ? initcfg.remark : ""; //处理意见
            initcfg.taskControl = initcfg.taskControl ? initcfg.taskControl : null; //null
            initcfg.callback = initcfg.callback ? initcfg.callback : undefined; //回调函数，第一个参数是调用结果，可忽略
            initcfg.callbackArgs = initcfg.callbackArgs ? initcfg.callbackArgs : null; //回调函数的第二个参数，可忽略
            initcfg.async = initcfg.async ? initcfg.async : true; //异步操作，false：同步操作，可忽略，默认为异步操作

            var cmp = _this.getViewObject(sender);
            if (cmp.xtype == "gtpgridpanel" || cmp.xtype == "gtptreegridpanel" || cmp.xtype == "gtpformpanel") {
                var dataSource = $G.DataContext.getDataSource(cmp.dataSource);
                var selectRecord = dataSource.getDataRecord();
                initcfg.dataID = selectRecord.id;
            }

            var inputFunc = eval("$G.Page." + initcfg.initParamFunc);
            if (inputFunc && Ext.isFunction(inputFunc)) {
                var paramArray = inputFunc.call();
                if (paramArray) {
                    if (paramArray.bizComp)
                        initcfg.bizComp = paramArray.bizComp;
                    if (paramArray.dataID)
                        initcfg.dataID = paramArray.dataID;
                    if (paramArray.result)
                        initcfg.result = paramArray.result;
                    if (paramArray.remark)
                        initcfg.remark = paramArray.remark;
                    if (paramArray.taskControl)
                        initcfg.taskControl = paramArray.taskControl;
                    if (paramArray.callback)
                        initcfg.callback = paramArray.callback;
                    if (paramArray.callbackArgs)
                        initcfg.callbackArgs = paramArray.callbackArgs;
                    if (paramArray.async)
                        initcfg.async = paramArray.async;
                }
            }
            advanceByDataID(initcfg.bizComp, initcfg.dataID, initcfg.result, initcfg.remark, initcfg.taskControl, initcfg.callback, initcfg.callbackArgs, initcfg.async)

        },

        getViewObject: function (cmp) {
            /// <summary>根据组件查找所属的视图组件</summary>             
            /// <param name="cmp" type="Object">传入一个组件对象，查找该组件所在视图对象</param>             
            /// <returns type="String">视图对象，找不到返回null</returns>
            return cmp && cmp.findParentByType ? cmp.findParentByType('gtpformpanel') || cmp.findParentByType('gtptreegridpanel')
                || cmp.findParentByType('gtpgridpanel') || cmp.findParentByType('gtpquerypanel') || cmp.findParentByType('toolbar') : null;

        },

        Ap_WorkFlow_actSelectProcess_Handler: function (sender) {
            ///<summary>选择流程:actSelectProcess</summary>
            var initcfg = this.initialConfig;
            initcfg.autoShowDialog = initcfg.autoShowDialog ? initcfg.autoShowDialog : false; //是否弹出选择流程的框，用来控制只有一个流程启用时是否显示
            initcfg.bizComp = initcfg.bizComp ? initcfg.bizComp : $G.getBizComp(); //业务组件名称
            initcfg.callback = initcfg.callback ? initcfg.callback : _this.startProcess; //回调函数
            initcfg.callbackArg = initcfg.callbackArg ? initcfg.callbackArg : {}; //其他参数（目前未使用）

            Ext.ux.AppFrame.SelectProcess.ShowSelectProcess(initcfg.autoShowDialog, initcfg.bizComp, initcfg.callback, initcfg.callbackArg);
        },

        startProcess: function (processCode, args) {
            //点击取消按钮，没有选择流程
            if (processCode == null) {
                alert("NoSelect"); //内容用户自定义
            }
            //没有启用的流程或者没有流程
            else if (processCode[0] == "0") {
                alert("NoOneProcessWork"); //内容用户自定义
            }
            //返回已经选择的流程信息
            else {
                alert(processCode[1]); //内容用户自定义
            }

        }


    });
})();
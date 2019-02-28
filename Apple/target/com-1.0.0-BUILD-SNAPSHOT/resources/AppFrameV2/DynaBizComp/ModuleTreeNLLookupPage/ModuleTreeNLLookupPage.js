//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.DynaBizComp");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	    //[Start]
	    _init: function () {
	        ///<summary>初始化页面</summary>
	        var result = _super._init ? _super._init.apply(this, arguments) : undefined;

	        var nodeClickFunc = function (node, e) {
	            if (!node.attributes.leaf) {
	                _this.mid = node.attributes.id;
	                _this.mfullCode = node.attributes.code;
	                _this.mname = node.attributes.text;
	                _this.mFullName = node.attributes.rawData.FullName;
	            }
	            else {
	                _this.mid = null;
	            }
	        }
	        var tree = GTP.AppFrameV2.DynaBizComp.createModuleTree(nodeClickFunc, "layoutPanel1", { controller: Gtp.net.Global.getPageController(), action: "GetNoLeafTreeData" });

	        var _req = function (act, data, actName, cb) {
	            Gjs.Ajax.request({
	                url: "/ORG/WebHttpHandle.ashx",
	                ctrl: "GTP.Org.Action.ModuleTreeManage",
	                cmd: act,
	                loadMask: true,
	                data: data,
	                title: actName,
	                dataNode: "Data",
	                callback: cb
	            });
	        };
	        var _getId = function (id) {
	            return cfg.id + '.' + id;
	        };
	        var iTempCount = 0; //提供设置可见模块高度的依据
	        var dlgMTI;
	        var _request = {
	            createNode: function (dataInfo, lastSelectNode, cb) {
	                _req("InsertNode", [dataInfo], "", function (data) {
	                    cb(data);
	                });
	            },
	            ModifyNode: function (dataInfo, cb) {
	                _req("SaveChange", [dataInfo], "", function (data) {
	                    cb(data);
	                });
	            },
	            DeleteNode: function (mtCode, mtFullCode, cb) {
	                _req("DeleteNode", [mtCode, mtFullCode], "", function (data) {
	                    cb(data);
	                });
	            },
	            AddModule: function (moduleInfo, cb) {
	                _req("AddModule", [moduleInfo], "", function (d) {
	                    cb(d)
	                });
	            },
	            checkCodeRepeat: function (code, cb) {
	                _req("CheckNodeCodeRepeat", [code], "", function (d) {
	                    cb(d);
	                });
	            },
	            checkNameRepeat: function (fullName, cb) {
	                _req("CheckNodeFNameRepeat", [fullName], "", function (d) {
	                    cb(d);
	                });
	            },
	            updatePNodeInfo: function (pid, value, cb) {
	                _req("UpdatePNodeInfo", [pid, value], "", function () {
	                    cb(true);
	                });
	            },
	            getMTreeVisible: function (cb) {
	                _req("GetModuleByPlatParam", [], "", function (d) {
	                    cb(d);
	                });
	            }
	        };

	        var _systemFun = {
	            getNodeInfo: function (lastSelectNode, data) {
	                var nodeData = lastSelectNode == null ? null : lastSelectNode.attributes.rawData;
	                var code = nodeData == null ? data.code : nodeData.Code + "." + data.code;
	                var dataInf = {
	                    ModuleTreeId: "-1",
	                    PID: nodeData == null ? 0 : nodeData.ID,
	                    Name: data.name,
	                    Code: code,
	                    FullCode: nodeData == null ? code : nodeData.FullCode + "/" + code,
	                    IsLeaf: false,
	                    Order: -1,
	                    Level: nodeData == null ? 1 : nodeData.Level + 1,
	                    FullName: nodeData == null ? data.name : nodeData.FullName + "." + data.name,
	                    IsSystem: data.isSystem,
	                    IsBizComponent: data.isBizComponent,
	                    Tag: data.disVisibleModole,
	                    ExtendData: data.extend
	                }
	                return dataInf;
	            },

	            showMessage: function (info, isBiz, isSucess) {
	                var strInfo = info + (isBiz ? "业务组件" : "业务模块") + (isSucess ? "成功。" : "失败。");
	                Gjs.Msg.info(strInfo);
	            }
	        };
	        var iTempCount = 0; //提供设置可见模块高度的依据
	        var dlgMTI;

	        _request.getMTreeVisible(function (d) {
	            var iCount = 0;
	            if (d != null && d.length > 0)
	                iCount = d.length;
	            iTempCount = iCount;
	            dlgMTI = GTP.Org.ModuleTreeItemDlg.create({ id: "MTIDlg", icount: iCount });
	        });

	        var addsb = new Ext.Button({
	            id: id + "_add_button",
	            tooltip: "新增目录",
	            text: "新增目录",
	            icon: "/Common/images/toolbar/GTP_add.png",
	            scope: this,
	            handler: function () {
	                var lastSelectNode = tree.selectedNode;
	                if (dlgMTI == null)
	                    dlgMTI = GTP.Org.ModuleTreeItemDlg.create({ id: "MTIDlg", icount: iTempCount });
	                dlgMTI.showDialog(lastSelectNode == null ? null : lastSelectNode.attributes.rawData, true, false, function (data) {
	                    var nodeInfo = _systemFun.getNodeInfo(lastSelectNode, data);
	                    nodeInfo.HasChildNode = false;
	                    _request.createNode(nodeInfo, lastSelectNode, function (d) {
	                        tree.reloadData(d);
	                        //var node = tree.getNodeById(d);
	                        //tree.expandPath(node.getPath());
	                        //tree.getSelectionModel().select(node);
	                        //	                        var childNode = new Ext.tree.AsyncTreeNode();
	                        //	                        childNode.id = d;
	                        //	                        childNode.text = nodeInfo.Name;
	                        //	                        childNode.attributes.code = nodeInfo.Code;
	                        //	                        childNode.attributes.rawData = {
	                        //	                            Code: nodeInfo.Code,
	                        //	                            FullCode: nodeInfo.FullCode,
	                        //	                            FullName: nodeInfo.Name,
	                        //	                            ID: d,
	                        //	                            IsBizComponent: false,
	                        //	                            IsLeaf: true,
	                        //	                            IsSystem: false,
	                        //	                            Name: nodeInfo.Name,
	                        //	                            PID: nodeInfo.PID
	                        //	                        };
	                        //	                        childNode.attributes.id = d;
	                        //	                        if (lastSelectNode) {
	                        //	                            lastSelectNode.appendChild(childNode);
	                        //	                        } else {
	                        //	                            tree.getRootNode().appendChild(childNode);
	                        //	                        }
	                    });
	                });
	            }
	        });

	        var canDeleteNode = function (fullCode) {
	            var ret = false;
	            Gtp.net.Global.dispatcher({
	                controller: Gtp.net.Global.getPageController(),
	                async: false,
	                action: "CanDeleteNode",
	                args: [fullCode],
	                success: function (result) {
	                    ret = result;
	                },
	                failure: function () {

	                }
	            });

	            return ret;

	        }


	        var deleteSb = new Ext.Button({
	            id: id + "_delete_button",
	            tooltip: "删除目录",
	            text: "删除目录",
	            icon: "/Common/images/toolbar/GTP_delete.png",
	            scope: this,
	            handler: function () {
	                var lastSelectNode = tree.selectedNode;
	                if (lastSelectNode == null) {
	                    $G.alert("提示", "请选择一个节点进行操作。");
	                    return;
	                }
	                if (lastSelectNode.attributes.rawData.IsSystem) {
	                    $G.alert("提示", "系统目录以及业务组件不允许删除。");
	                    return;
	                }

	                var bcanDeleteNode = canDeleteNode(lastSelectNode.attributes.rawData.FullCode);
	                if (bcanDeleteNode == false) {
	                    $G.alert("提示", "当前目录下已包含业务模块，不允许删除。");
	                    return;
	                }
	                var confirmtipMsg = '确定要删除模块树节点吗？';
	                Ext.MessageBox.confirm('确认', confirmtipMsg, function (btn) {
	                    if (btn == "yes") {
	                        _request.DeleteNode(lastSelectNode.attributes.rawData.Code, lastSelectNode.attributes.rawData.FullCode, function (d) {
	                            if (d == 1) {
	                                _systemFun.showMessage("删除", lastSelectNode.attributes.rawData.IsBizComponent, true);
	                                tree.removeNode(lastSelectNode);
	                                tree.selectedNode = null;
	                            }
	                            else {
	                                _systemFun.showMessage("删除", lastSelectNode.attributes.rawData.IsBizComponent, false);
	                            }
	                        });
	                    }
	                    else {
	                        return;
	                    }
	                });

	            }
	        });

	        tree.getTopToolbar().add('-');
	        tree.getTopToolbar().add(addsb);
	        tree.getTopToolbar().add(deleteSb);


	        var oldFunc = Gjs.Ajax.request;
	        Gjs.Ajax.request = function (config) {
	            config = config || {};
	            config.url = "/ORG/WebHttpHandle.ashx";
	            return oldFunc.apply(this, arguments);
	        }


	        return result;
	    },
	    //[End]

	    //[Start]
	    actOK_Handler: function (sender) {
	        ///<summary>确定:actOK</summary>
	        if (!Ext.isEmpty(_this.mid)) {
	            $G.setReturnValue("returnEntity",
                { ModuleTreeID: _this.mid,
                    ModuleTreeName: _this.mfullCode,
                    ModuleName: _this.mname,
                    ModuleTreeFullName: _this.mFullName
                });
	            $G.close(true);
	        }
	        else {
	            Ext.Msg.alert('选择模块', '请选中模块节点进行操作');
	        }
	    },
	    //[End]

	    //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        $G.close(false);
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.DynaBizComp.ModuleTreeNLLookupPage = _class;
})();
//</Bottom>
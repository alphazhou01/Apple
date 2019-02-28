var UrlParam, itemCenter, itemMenu, itemNotInGrid, winExp;
var frameList = new Array();

Ext.ns("Portal.MenuSet")


Portal.MenuSet.init = function () {
    UrlParam = Ext.urlDecode(document.location.href.substr(document.location.href.indexOf("?") + 1));
    pagePublishWindow = new Portal.MenuSet.PagePublishWindow();
    addMenuFolderWindow = new Portal.MenuSet.AddMenuFolderWindow();

    itemCenter = new Portal.MenuSet.CenterPanel.create();
    itemMenu = new Portal.MenuSet.MenuTree.create({ id: "MenuTree", enableDD: false, animate: true, pagePublishWindow: pagePublishWindow, addMenuFolderWindow: addMenuFolderWindow });
    itemNotInGrid = new Portal.MenuSet.NotInMenuModuleList();

    itemCenter2 = new MenuTable.MenuSet.CenterPanel.create();
    itemMenu2 = new MenuTable.MenuSet.MenuTree.create({ id: "MenuTree2", enableDD: false, animate: true, pagePublishWindow: pagePublishWindow });

    itemNotInGrid2 = new Portal.MenuSet.NotInMenuModuleList();

    itemNotInGrid3 = new Portal.MenuSet.NotInMenuModuleList();

    dynamicModuleGrid1 = new Portal.MenuSet.DynamicModuleList({ dataGrid: "bizInfoListView", pageGrid: itemNotInGrid });

    dynamicModuleGrid2 = new Portal.MenuSet.DynamicModuleList({ dataGrid: "bizInfoListView", pageGrid: itemNotInGrid2 });

};
Ext.ns("Portal.MenuSet.CenterPanel");
Portal.MenuSet.CenterPanel.create = function () {
    var panel = new Ext.form.FormPanel({
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        border: false,
        defaults: { margins: '0 0 5 0' },
        items: [{
            width: 50,
            //id: "btnLeft",
            xtype: 'button',
            text: "&lt;&lt;",
            disabled: true,
            tooltip: "添加菜单节点",
            handler: function () {

                var rightGrid = panel.ownerCt.ownerCt.get(2).get(1).get(0);
                var leftTree = panel.ownerCt.ownerCt.get(0).get(0);

                var nodes_Grid = rightGrid.GetSelectNodes(); //Name,ModuleId,IsPortalModule,ContainChild,ModulePID,ModuleFullCode
                if (nodes_Grid == null || nodes_Grid.length == 0)
                    return;
                var lastSelectNode = leftTree.getSingleSelectNode();
                if (lastSelectNode == null) {
                    leftTree.addMenuNodeByData(null, { type: 0, items: nodes_Grid }, null, 0, function () {
                        rightGrid.query();
                    }, null);
                }
                else {
                    if (!lastSelectNode.attributes.IsCategory) {
                        Ext.Msg.alert("提示", "菜单不能加到菜单项下");
                        return;
                    }
                    if (!lastSelectNode.isExpanded()) {
                        lastSelectNode.expand(false, false, function () {
                            leftTree.addMenuNodeByData(null, { type: 1, items: nodes_Grid }, null, 0, function () {
                                rightGrid.query();
                            }, null);
                        });
                    }
                    else {
                        leftTree.addMenuNodeByData(null, { type: 1, items: nodes_Grid }, null, 0, function () {
                            rightGrid.query();
                        }, null);
                    }
                }
            }
        }, {
            width: 50,
            //id: "btnRight",
            xtype: 'button',
            text: '&gt;&gt;',
            disabled: true,
            tooltip: "删除菜单节点",
            handler: function () {
                var rightGrid = panel.ownerCt.ownerCt.get(2).get(1).get(0);
                var leftTree = panel.ownerCt.ownerCt.get(0).get(0);
                leftTree.DeleteSelectNode(function () {
                    rightGrid.query();
                });
            }
        }]
    });
    panel.RightSelectedChange = function () {
        // var moduleChecked = itemModule.getChecked();
        var view = panel.ownerCt.ownerCt;
        var rightGrid = view.get(2).get(1).get(0);
        var leftTree = view.get(0).get(0);
        var gridChecked = rightGrid.getSelectionModel().getSelections();
        var lastSelectNode = leftTree.getSingleSelectNode();
        var btnLeft = panel.get(0);
        if (lastSelectNode == null) {
            if ((gridChecked != null && gridChecked.length > 0))
                btnLeft.setDisabled(false);
            else
                btnLeft.setDisabled(true);
            return;
        }
        if (!lastSelectNode.attributes.IsCategory) {
            btnLeft.setDisabled(true);
            return;
        }
        if (gridChecked != null && gridChecked.length > 0) {
            btnLeft.setDisabled(false);
            return;
        }

        btnLeft.setDisabled(true);
    };
    return panel;
};
Ext.ns("Portal.MenuSet.MenuTree")//拖拽操作，菜单可以拖拽，不能往其他树拖拽，可以从其他树拖拽进入。//页面可以拖拽到菜单树，不可以自身拖拽//列表可以拖拽打到树
Portal.MenuSet.MenuTree.create = function (cfg) {
    var tv;
    var _cfg = Ext.apply({ displayAttr: "Name" }, cfg);

    var loadChildNodesCallback = function (d, cb) {
        for (var i = 0; i < d.length; i++) {
            var n = d[i];
            n.checked = _cfg.multiSelect ? (n.checked ? true : false) : undefined;
            n.leaf = n.IsLeaf;

            if (n.IsCategory)//ModuleId非空则有设置页面
                n.icon = $G.getAppName() + "/Common/images/tree/GTP_folder.png";
            else if (n.ItemID != null)

                n.icon = $G.getAppName() + "/Common/images/toolbar/GTP_menu.png";
            else {
                n.icon = $G.getAppName() + "/Common/images/toolbar/GTP_menunull.png";
            }
        }
        cb(d);
    };


    var _loadChildNodes = function (pNode, cb) {
        var combo = tv.getTreeCombo().getValue();
        combo = frameList[combo];
        if (pNode == null || pNode.FullCode == null)
        {
          doAction("GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage", "GetMenuList", [combo], loadChildNodesCallback, cb, false);
        } 
        else 
        {
          doAction("GTP.Portal.Biz.WebUI.Manage.MenuItemManage", "QueryNodeByFilter", [ pNode.FullCode, 1, combo], loadChildNodesCallback, cb, false);
        }
    };

    var vm = {
        getRootNodes: function (cb) {
            _loadChildNodes({ fullCode: null }, cb);
        },
        getChildNodes: function (pNode, cb) {
            _loadChildNodes(pNode, cb);
        }
    };
    var hasSameChildCode = function (pNode, code, selfNode) {
        if (pNode == null)
            pNode = tv._root;
        for (var i = 0; i < pNode.childNodes.length; i++) {
            if (selfNode == pNode.childNodes[i])
                continue;
            if (pNode.childNodes[i].attributes.Code == code)
                return true;
        }
        return false;
    };
    var addMenuNodeByData = function (lastSelectNode, listData, afterNode, afterId, callBack, args) {//可以是个数组或者单个对象，对象格式：{type,items:[{Name,ModuleId,IsPortalModule,ContainChild,ModulePID,ModuleFullCode,AfterID}]}
        if (lastSelectNode == null)
            lastSelectNode = tv.getSingleSelectNode();
        var pID = 0;
        var pCode = "";
        if (listData.type != 0 && lastSelectNode != null) {
            if (lastSelectNode.attributes.ItemID != null)
                pID = lastSelectNode.attributes.ItemID;
            if (lastSelectNode.attributes.FullCode != null)
                pCode = lastSelectNode.attributes.FullCode;
        }
        var addCurrentNodes = function () {
            var listNodeData = new Array();
            for (var i = 0; i < listData.items.length; i++) {
                var dataTemp = listData.items[i];
                var num = "";
                var nameTemp = dataTemp.PublishName; //(dataTemp.Name == null || dataTemp.Name == "") ? "新建节点" : dataTemp.Name;
                //            if (hasSameChildCode((listData.type == 0 ? null : lastSelectNode), nameTemp + "$" + tv.getTreeCombo().value)) {
                //                num = 1;
                //                while (hasSameChildCode((listData.type == 0 ? null : lastSelectNode), nameTemp + "" + num + "$" + tv.getTreeCombo().value))
                //                    num++;
                //            }
                var code = nameTemp; // +"" + num + "$" + tv.getTreeCombo().value;
                var fullCode = code;
                if (pCode != "")
                    fullCode = pCode + '.' + fullCode;

                var moduleCode = dataTemp.ModuleFullCode + '$' + dataTemp.FullCode; //'GTP.BI.CustomAnalysis.REPORTMODULEModule$GTP.BI.CustomAnalysis.REPORTMODULEModule.Report' + dataTemp.ID;
                var menuId = frameList[tv.getTreeCombo().value];
                var moduleLinkUrl = dataTemp.Url; // +((dataTemp.Url.indexOf('?') == -1) ? '?' : '&') + 'modulecode=' + dataTemp.ModuleFullCode; // '/bi/CustomAnalysis/Report.aspx?solutionid=' + dataTemp.ID;
                listNodeData.push({
                    AfterID: afterId,
                    PID: pID,
                    Code: code,
                    FullCode: fullCode,
                    Name: nameTemp, //+ "" + num,
                    ModuleName: nameTemp,
                    IsCategory: false,
                    IsLeaf: true,
                    ModuleCode: moduleCode,
                    ModuleLinkUrl: moduleLinkUrl,
                    ContainChild: false,
                    MenuId: menuId,
                    BizFullCode: "GTP.AppFrameV2.DynaBizComp.DynaBizModule",
                    IsFastMenu: false,
                    IsNewWindow: false,
                    IsDyncCompont: "false",
                    ID: dataTemp.ModuleFullCode + i
                });
                tv.AllNodeInsert.push({ AfterID: afterId,
                    PID: pID,
                    Code: code,
                    FullCode: fullCode,
                    Name: nameTemp, //+ "" + num,
                    ModuleName: nameTemp,
                    IsCategory: false,
                    IsLeaf: true,
                    ModuleCode: moduleCode,
                    ModuleLinkUrl: moduleLinkUrl,
                    ContainChild: false,
                    MenuId: menuId,
                    BizFullCode: "GTP.AppFrameV2.DynaBizComp.DynaBizModule",
                    IsFastMenu: false,
                    IsNewWindow: false,
                    IsDyncCompont: "false",
                    ID: dataTemp.ModuleFullCode + i
                });
            }
            var listNode = new Array();
            loadChildNodesCallback(listNodeData, function (list) {
                var beforeNodeTemp = null;
                if (afterId > 0)
                    beforeNodeTemp = afterNode.nextSibling;
                else if (afterId < 0)
                    beforeNodeTemp = (lastSelectNode != null ? lastSelectNode.firstChild : tv._root.firstChild);
                for (var i = 0; i < list.length; i++) {
                    if (listData.type == 0)
                        listNode.push(tv.appendRootNode(list[i]));
                    else
                        listNode.push(tv.appendChildNode(list[i], lastSelectNode));

                    if (beforeNodeTemp != null) {//0最后，大于0找ID，-1第一个
                        listNode[i].parentNode.insertBefore(listNode[i], beforeNodeTemp);
                    }
                }
            });


            tv.getSelectionModel().select(listNode[listNode.length - 1].parentNode);
            //增加操作
            for (var i = 0; i < listNodeData.length; i++)
                listNodeData[i].AfterID = afterId;
        };
        this.pagePublishWindow.resetAndShow((listData.type == 0 ? null : lastSelectNode), listData.items, addCurrentNodes);
    };

    var cstore = new Gtp.net.GtpJsonStore({ fields: [{ name: "ID", type: "int" }, { name: "Name", type: "string"}] })

    var loadCombo = function () {
        doAction("GTP.Portal.Biz.WebUI.Manage.FrameManage", "LoadList", [-1], function (result, args) {
            result.forEach(function (menuData) {
                frameList[menuData.ID] = menuData.MenuID;
            });
            cstore.loadData(result);
        }, null, false);
    }

    _cfg.viewModel = vm;
    _cfg.tbar = { enableOverflow: true,
        items: [{
            //id: "btnChosePortal",
            xtype: "combo",
            mode: 'local',
            forceSelection: true,
            editable: false,
            fieldLabel: '请选择门户',
            displayField: 'Name',
            valueField: 'ID',
            triggerAction: 'all',
            emptyText: '请选择..',
            labelWidth: 70,
            editable: false,
            allowBlank: false,
            store: cstore,
            width: 180,
            listeners: {
                'afterrender': function () {//默认选中第一项
                    loadCombo();
                    var firstValue = cstore.getAt(0).get('ID');
                    //var combo = Ext.getCmp("btnChosePortal");
                    var combo = tv.getTreeCombo();
                    combo.setValue(firstValue); //选中
                },
                'select': function (combo, record, index) {
                    tv.reloadNodes();
                    //tv.expandAll();
                }

            }
        },
                {
                    //id: "btnMenuRefresh",
                    xtype: "button",
                    //text: "刷新",
                    icon: $G.getAppName() + "/Common/images/toolbar/GTP_refresh.png",
                    handler: function () {
                        tv.reloadNodes();
                        //                        tv.expandAll(); 
                    }
                },
                {
                    //id: "btnExpandAll",
                    xtype: "splitbutton",
                    disabled: false,
                    tooltip: "展开到...",
                    icon: $G.getAppName() + "/Common/images/toolbar/GTP_allunfold.png",
                    handler: function () {
                        tv.collapseAll();
                        tv._expandNode(tv.root);
                    },
                    menu: {
                      xtype: "menu",
                      items: [
                        {
                          text: "展开到2级",
                          handler: function () {
                            tv.collapseAll();
                            tv._expandNode(tv.root);
                          }
                        },
                        {
                          text: "展开到3级",
                          handler: function () {
                            tv.collapseAll();
                            var cs = tv.root.childNodes, i,len = cs.length;
                            for (i = 0; i < len; i++) {
                              tv._expandNode(cs[i]);
                            }

                          }
                        },
                        {
                          text: "展开全部",
                          handler: function () {
                            tv.expandAll();
       
                          }
                        }
                       ]
                     }
                 },
                 {
                     //id: "btnCollapseAll",
                     xtype: "button",
                     disabled: false,
                     tooltip: "折叠全部",
                     icon: $G.getAppName() + "/Common/images/toolbar/GTP_allfold.png",
                     handler: function () {
                         tv.collapseAll();
                     }
                 },
                 {
                     xtype: "button",
                     disabled: false,
                     tooltip: "添加目录",
                     icon: $G.getAppName() + "/Common/images/toolbar/GTP_new.png",
                     handler: function () {
                         tv.addMenuFolderWindow.menuId = frameList[tv.getTreeCombo().value];
                         var node = tv.getSingleSelectNode();
                         if (node==null)
                         {
                           tv.addMenuFolderWindow.pId=0;
                         }
                         else
                         {
                            if (!node.attributes.IsCategory)
                            {
                               Ext.Msg.alert("提示","只能在目录下添加子目录");
                               return;
                            }
                            tv.addMenuFolderWindow.pId=node.attributes.ItemID;
                         }
                            tv.addMenuFolderWindow.menuTree=tv;
                            tv.addMenuFolderWindow.show();
                     }

                 }
        ]
    };

    tv = GTP.View.SimpleTree.create(_cfg);
    tv.getTreeCombo = function () {
        return tv.getTopToolbar().findByType('combo')[0];
    };
    tv.AllNodeInsert = [];
    tv.AllNodeRemove = [];
    tv._expandNode=function(node) {
       if (Ext.isEmpty(node)) return ;
       node.expand(false, true);
       var cs = node.childNodes, i,len = cs.length;
       for (i = 0; i < len; i++) {
        cs[i].expand(false, true);
       }
    };
    tv.loadChildNodesCallback = loadChildNodesCallback;
    tv.addMenuNodeByData = addMenuNodeByData;
    tv.on("nodedragover", function (e) {
        if (!e.target.attributes.IsCategory && e.point == "append") {
            e.cancel = true;
            return;
        }
    });

    tv.on("beforenodedrop", function (e) {
        var leftTree = tv.ownerCt.get(0);
        var rightGrid = panel.ownerCt.get(2).get(1).get(0);
        if (!e.target.attributes.IsCategory && e.point == "append") {
            e.cancel = true;
            return;
        }
        var node = e.dropNode;
        if (node == null || node.ownerTree == moduleTree) {//grid//新增
            var afterId = 0;
            var afterNode = null;
            if (e.point == "above") {
                if (e.target.previousSibling != null) {
                    afterNode = e.target.previousSibling;
                    afterId = e.target.previousSibling.attributes.ItemID;
                }
                else
                    afterId = -1;
            }
            else if (e.point == "below" && e.target.nextSibling != null) {
                afterNode = e.target;
                afterId = e.target.attributes.ItemID;
            }
            var listData = new Array();
            if (node == null) {
                var rects = e.source.grid.getSelectionModel().getSelections();
                for (var i = 0; i < rects.length; i++) {
                    listData.push({ AfterID: afterId, Name: rects[i].get("ModuleName"), ModuleId: rects[i].get("ModuleId"), IsPortalModule: true, ContainChild: false });
                }
            }
            else {
                var contain = Ext.getCmp("ckContainChild").getValue();
                var node = e.dropNode;
                listData.push({ Name: node.attributes.Name, ModuleId: (node.attributes.IsPortalModule ? node.attributes.ModuleId : 0), IsPortalModule: node.attributes.IsPortalModule, ContainChild: (node.attributes.IsPortalModule ? false : contain), ModulePID: node.attributes.ModuleId, ModuleFullCode: node.attributes.FullCode });
            }
            if (listData == null || listData.length == 0) {
                e.cancel = true;
                return;
            }
            var lastSelectNode = (e.point == "append" ? e.target : e.target.parentNode);
            if (!lastSelectNode.attributes.IsCategory && e.point == "append") {
                e.cancel = true;
                Ext.Msg.alert("提示", "菜单不能加到菜单项下");
                return;
            }
            e.cancel = true;
            if (!lastSelectNode.isExpanded()) {
                lastSelectNode.expand(false, false, function () {
                    leftTree.addMenuNodeByData(lastSelectNode, { type: 1, items: listData }, afterNode, afterId, function (args) {
                        rightGrid.query();
                    }, { e: e, node: node });
                });
            }
            else {
                leftTree.addMenuNodeByData(lastSelectNode, { type: 1, items: listData }, afterNode, afterId, function (args) {
                    rightGrid.query();
                }, { e: e, node: node });
            }
        }
        else if (node.ownerTree == leftTree) {//排序
            var pId = -1;
            var targetId = -1;
            var needRemove = false;
            var isSameParent = false;
            if (e.point == "append") {
                if (!e.target.isExpanded() && !e.target.hasChildNodes())
                    needRemove = true;
                pId = e.target.attributes.ItemID;
                isSameParent = (pId == e.dropNode.parentNode.attributes.ItemID);
            }
            else {
                pId = e.target.attributes.PID;
                if (e.point == "above")
                    targetId = e.target.attributes.ItemID;
                else
                    targetId = (e.target.nextSibling == null ? -1 : e.target.nextSibling.attributes.ItemID);
            }
            var lastSelectNode = tv.getSingleSelectNode();
            var oldParentNode = node.parentNode;
            doAction("GTP.Portal.Biz.WebUI.Manage.MenuItemManage", "MoveNode", [node.attributes.ItemID, pId, targetId], function (result, args) {
                if (result) {
                    Ext.Msg.alert("提示", result);
                    args.e.cancel = true;
                }
                else {
                    if (args.needRemove) {
                        var oldParentNode = args.oldParentNode;
                        var oldLeaf = args.e.target.attributes.IsLeaf;
                        args.e.target.attributes.IsLeaf = true;
                        args.e.target.leaf = true;
                        args.e.target.expanded = false;
                        args.e.target.expand(false, false, function () {
                            args.e.target.attributes.IsLeaf = oldLeaf;
                            args.e.target.leaf = oldLeaf;
                            for (var i = 0; i < args.e.target.childNodes.length; i++) {
                                var nodeChild = args.e.target.childNodes[i];
                                if (nodeChild.attributes.ItemID == args.e.dropNode.attributes.ItemID) {
                                    nodeChild.remove();
                                    break;
                                }
                            }
                            setTimeout(function () {
                                var node = args.e.dropNode;
                                node.attributes.FullCode = node.parentNode.isRoot ? node.attributes.Code : (node.parentNode.attributes.FullCode + "." + node.attributes.Code);
                                node.attributes.PID = node.parentNode.isRoot ? 0 : node.parentNode.attributes.ItemID;
                                tv.UpdateAllChildFullCode(node);

                                if (args.e.dropNode != null)
                                    args.e.dropNode.select();
                                tv.getSelectionModel().fireEvent("selectionchange");
                            }, 10);
                        });
                        setTimeout(function () {//之前的父节点变成可能的叶子节点
                            if (!oldParentNode.isRoot && oldParentNode.childNodes.length < 1) {
                                oldParentNode.attributes.IsLeaf = true;
                                oldParentNode.leaf = true;
                                oldParentNode.expanded = false;
                                oldParentNode.expand();
                                oldParentNode.attributes.IsLeaf = false;
                                oldParentNode.leaf = false;
                            }
                        }, 10);
                    }
                    else if (args.update) {
                        var node = args.e.dropNode;
                        var oldParentNode = args.oldParentNode;
                        setTimeout(function () {
                            node.attributes.FullCode = node.parentNode.isRoot ? node.attributes.Code : (node.parentNode.attributes.FullCode + "." + node.attributes.Code);
                            node.attributes.PID = node.parentNode.isRoot ? 0 : node.parentNode.attributes.ItemID;
                            tv.UpdateAllChildFullCode(node);
                            var needNoChild = (!oldParentNode.isRoot && oldParentNode.childNodes.length <= 1);
                            if (needNoChild) {
                                oldParentNode.attributes.IsLeaf = true;
                                oldParentNode.leaf = true;
                                oldParentNode.expanded = false;
                                oldParentNode.expand();
                                oldParentNode.attributes.IsLeaf = false;
                                oldParentNode.leaf = false;
                            }
                            if (lastSelectNode != null)
                                lastSelectNode.select();
                            tv.getSelectionModel().fireEvent("selectionchange");
                        }, 10);
                    }
                    else {
                        if (args.isSameParent)
                            args.e.cancel = true;
                        setTimeout(function () {
                            if (lastSelectNode != null)
                                lastSelectNode.select();
                            tv.getSelectionModel().fireEvent("selectionchange");
                        }, 10);
                    }
                }
            }, { e: e, needRemove: needRemove, update: (pId != node.attributes.PID), oldParentNode: oldParentNode, isSameParent: isSameParent }, false);
        }
        else
            e.cancel = true;
    });
    tv.getSelectionModel().on("selectionchange", function (e) {
        var lastSelectNode = tv.getSingleSelectNode();
        var centerTool = tv.ownerCt.ownerCt.get(1).get(0);
        if (lastSelectNode == null)
            changeButtonState(true);
        else
            changeButtonState(false, lastSelectNode, (lastSelectNode.attributes.IsCategory ? 1 : 2));

        centerTool.RightSelectedChange();
    });
    tv.on("click", function (e) {

    });
    tv.DeleteSelectNode = function (callBack) {
        var isItem = !tv.getSingleSelectNode().attributes.IsCategory;
        var ti = isItem ? "确认删除选择的菜单吗？" : "确认删除选择的目录及其子菜单吗？";
        var lastSelectNode = tv.getSingleSelectNode();
        var pre = lastSelectNode.previousSibling;
        var next = lastSelectNode.nextSibling;
        var parent = lastSelectNode.parentNode;
        tv.removeSelectNode(lastSelectNode);

        if (next)
            tv.getSelectionModel().select(next);
        else if (pre)
            tv.getSelectionModel().select(pre);
        else if (parent && !parent.isRoot) {
            tv.getSelectionModel().select(parent);
        }
        var isTemp = false;
        for (var i = 0; i < tv.AllNodeInsert.length; i++) {
            if (lastSelectNode.attributes.FullCode == tv.AllNodeInsert[i].FullCode) {

                tv.AllNodeInsert.splice(i, 1);
                isTemp = true;
                break;
            }
        }
        if (!isTemp)
            tv.AllNodeRemove.push(lastSelectNode);
    };
    var changeButtonState = function (disable, lastSelectNode, selType) {//selType:0根,1目录,2节点  
        if (lastSelectNode == null)
            return;
        var btnRight = tv.ownerCt.ownerCt.get(1).get(0).get(1);
        if (lastSelectNode.attributes.BizFullCode == 'GTP.AppFrameV2.DynaBizComp.DynaBizModule') {
            //Ext.getCmp("btnRight").setDisabled(disable);
            btnRight.setDisabled(disable);

        }
        else {
            //Ext.getCmp("btnRight").setDisabled(true);
            btnRight.setDisabled(true);
        }
    };
    tv.UpdateAllChildFullCode = function (node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            child.attributes.FullCode = node.isRoot ? child.attributes.Code : (node.attributes.FullCode + "." + child.attributes.Code);
            tv.UpdateAllChildFullCode(child);
        }
    };
    return tv;
};


Ext.ns("Portal.MenuSet.ModuleTree")
//王玮封装的TreePanel组件
Ext.ns("GTP.View.SimpleTree").create = function (cfg) {
    var _vm = cfg.viewModel;
    if (!_vm) return;
    //设置表格初始化参数
    var _root = new Ext.tree.TreeNode({ isRoot: true, expanded: true });
    var _cfg = Ext.apply({ viewModel: null, animate: false, autoScroll: true, rootVisible: false,
        fitToFrame: true, containerScroll: true, root: _root
    }, cfg);
    var v = new Ext.tree.TreePanel(_cfg);
    var _appendChildNode = function (d, pNode, batch) {
        if (!batch) pNode.beginUpdate();
        if (_cfg.multiSelect && d.checkable !== false) {
            d.checked = d.checked || false;
        }
        else d.checked = undefined;
        var n = new Ext.tree.TreeNode({
            text: _cfg.displayAttr ? d[_cfg.displayAttr] : ((d.text == undefined) ? d.name : d.text),
            icon: d.icon,
            expandable: !d.leaf,
            checked: d.checked,
            id: 'g-node-' + (d.ItemID ? d.ItemID : d.ID)
        });
        Ext.apply(n.attributes, d);
        n.get = function (attr) { return this.attributes[attr] };
        pNode.appendChild(n);

        if (!batch) pNode.endUpdate();
        v.fireEvent('appendnode', pNode, n, batch);
        return n;
    };
    var _appendNodes = function (nodes, pNode) {
        pNode = pNode || _root;
        pNode.beginUpdate();
        var firstNode;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].PID != 0 && v.getNodeById('g-node-' + nodes[i].PID)) {
                pNode = v.getNodeById('g-node-' + nodes[i].PID);
            }
            n = _appendChildNode(nodes[i], pNode, true);
            firstNode = firstNode || n;
        }
        pNode.endUpdate();
        v.fireEvent('appendnodes', pNode, firstNode);
    };
    v.on("beforeexpandnode", function (node) {
        if (node.childNodes.length) {
            return;
        }
        var loadNodes = function (data) {
            if (data && data.length > 0) {
                _appendNodes(data, node);
            }
            else {
                node.attributes.expandable = false;
                node.ui.updateExpandIcon();
            }
        };
        if (node == _root) _vm.getRootNodes(loadNodes);
        else _vm.getChildNodes(node.attributes, loadNodes);
    });
    v.on("render", function (tree) {
        if (tree.getTopToolbar() != null)
            tree.getTopToolbar().addClass("g-toolbar");
    });
    v.getSelectNodes = function () {
        var ms = _cfg.multiSelect;
        var nodes = ms ? this.getChecked() : this.getSelectionModel().getSelectedNode();
        var ret = new Array();
        if (nodes == null)
            return ret;
        if (ms) {
            for (var i = 0; i < nodes.length; i++) {
                ret[i] = nodes[i];
            }
        }
        else {
            if (nodes) {
                ret[0] = nodes;
            }
        }
        return ret;
    };
    v.getSelectNodes_NoChild = function (pNode) {
        var arrNodes = new Array();
        if (pNode == null)
            pNode = _root;
        for (var i = 0; i < pNode.childNodes.length; i++) {
            if (pNode.childNodes[i].attributes.checked == true)
                arrNodes.push(pNode.childNodes[i]);
            else {
                var childNodes = v.getSelectNodes_NoChild(pNode.childNodes[i]);
                for (var j = 0; j < childNodes.length; j++)
                    arrNodes.push(childNodes[j]);
            }
        }
        return arrNodes;
    };
    v.getSingleSelectNode = function () {
        var arr = this.getSelectNodes();
        return (arr.length > 0) ? arr[0] : null;
    };
    v.reloadNodes = function () {
        _root.removeAll(true);
        _vm.getRootNodes(_appendNodes);
    };
    v.appendChildNode = function (data, pNode) {
        var pn = pNode || this.getSelectionModel().getSelectedNode() || _root;
        return _appendChildNode(data, pn);
    };
    v.appendRootNode = function (data) {
        return _appendChildNode(data, _root);
    };
    v.removeSelectNode = function (node) {
        var n = node || this.getSelectionModel().getSelectedNode();
        if (!n) return;
        var p = n.parentNode;
        p.removeChild(n, true);
        p.ui.updateExpandIcon();
    };
    v.modifySelectNode = function (nodeData, node) {
        var nd = nodeData;
        var n = node || this.getSelectionModel().getSelectedNode();
        if (!n) return;
        n.setText(nd.text);
        Ext.apply(n.attributes, nd);
    };
    v.clearSelections = function () {
        var ms = _cfg.multiSelect;
        if (ms) {
            var arr = this.getChecked();
            for (var i = 0; i < arr.length; i++) {
                var n = arr[i];
                var attrs = n.attributes;
                if (attrs.checked != undefined) {
                    arr[i].ui.checkbox.checked = false;
                    attrs.checked = false;
                }
            }
        }
    };
    v.moveUp = function (node, preNode) {
        var n = node || this.getSelectionModel().getSelectedNode();
        var preN = preNode || n.previousSibling;
        if (!n.isFirst()) {
            n.parentNode.insertBefore(n, preN);
            this.getSelectionModel().select(n);
        }
    };
    v.moveDown = function (node, nextNode) {
        var n = node || this.getSelectionModel().getSelectedNode();
        var nexN = nextNode || n.nextSibling;
        if (!n.isLast()) {
            n.parentNode.insertBefore(nexN, n);
            this.getSelectionModel().select(n);
        }
    };
    v._appendNodes = _appendNodes;
    v._root = _root;
    return v;
};

Ext.ns("GTP.data.JsonReader");
GTP.data.JsonReader = Ext.extend(Ext.data.JsonReader, {
    read: function (response) {
        var result = Ext.decode(response.responseText);
        if (!result)
            msgError("JsonReader.read: Json object not found.\r\n" + response.responseText);
        else if (result.IsSuccess)
            return this.readRecords(result.Data);
        else
            msgError(result.StatusCode + "---->" + (result.ResultMsg || "server method fail.") + "\r\n" + (result.ResultDetailMsg || ""));
    }
});

//业务组件列表
Ext.ns("Portal.MenuSet.DynamicModuleList");
Portal.MenuSet.DynamicModuleList = Ext.extend(Ext.grid.GridPanel, {
    dataGrid: null,
    pageGrid: null,
    initComponent: function () {
        var moduleList = this;
        this.cls = 'g-grid-norowsline';
        this.store = new Ext.data.JsonStore({
            storeId: 'dynaModuleStore',
            fields: [{ name: 'ID', type: 'int', mapping: "Id" },
                             { name: 'Code', mapping: 'BizName' },
                             { name: 'Name', mapping: 'BizAlias' },
                             { name: 'Path', mapping: 'Path' },
                             { name: 'NameSpace', mapping: 'NameSpace' },
                              { name: 'CreateDate', type: 'date', dateFormat: 'Y-n-j G:i:s', mapping: 'CreatedTime' },
                              'Description'
                            ]
        });
        this.columns = [
            new Ext.grid.RowNumberer(),
        	{ header: "ID", dataIndex: "ID", hidden: true, hideable: false },
            { header: "模块名称", dataIndex: "Name", align: 'center', width: 120 },
			{ header: "模块编码", dataIndex: "Code", align: 'center', width: 120 },
            { header: "模块路径", dataIndex: "Path", align: 'center', width: 120,
               renderer: function (v, m, r) {
                //m.attr = 'style="white-space:normal;word-wrap:break-word;word-break:break-all;"';
                // m.attr = 'ext:qtitle="' + v + '"' + ' ext:qtip="' + v + '"';    
                m.attr = ' ext:qtip="' + v + '"';    
               return v;
              }
             }

		];
        this.title = '业务模块';
        this.region = "center";
        this.split = true;
        this.loadMask = true;


        var selectIds = "";
        this.on("rowclick", function (grid, row, e) {
            var record = grid.store.getAt(row);
            moduleList.loadBizPage(record);

            //            doAction("GTP.AppFrameV2.DynaBizComp.DynaBizInfoManagePage", "GetPagesByBizModuleName", [moduleFullCode], function (data) {
            //                moduleList.pageGrid.store.loadData(data);
            //            });
        });

        Portal.MenuSet.DynamicModuleList.superclass.initComponent.call(this);

        //        this.getSelectionModel().singleSelect = true;
    },
    loadBizPage: function (record) {
        var moduleList = this;
        var moduleFullCode = record.data.NameSpace + '.' + record.data.Code;
        $G.dispatcher({
            controller: "GTP.AppFrameV2.DynaBizComp.DynaBizInfoManagePage",
            action: "GetPagesByBizModuleName",
            async: false,
            args: [moduleFullCode],
            success: function (data) {
                moduleList.pageGrid.bizModuleFullName = moduleFullCode;
                moduleList.pageGrid.store.loadData(data);
            }
        });
    },
    afterRender: function () {
        Portal.MenuSet.DynamicModuleList.superclass.afterRender.call(this);
        var view = this.ownerCt.ownerCt.ownerCt;
        winExp.on('beforeshow', this.loadData, this);
        view.on('activate', this.loadData, this);
    },
    loadData: function () {
        var data = [];
        var grid = Ext.getCmp(this.dataGrid);
        var list= grid.AP_selectRows();
        for (var i = 0; i < list.length; i++) {
            data.push(list[i].data);
        }
        this.store.loadData(data);
        this.SelectFirst();
    },
    SelectFirst: function () {
        if (this.store.getCount() > 0) {
            this.getSelectionModel().selectFirstRow();
            this.getView().focusRow(0);
            var record = this.store.getAt(0);
            this.loadBizPage(record);
        }
    }
});

//未选择菜单列表
Ext.ns("Portal.MenuSet.NotInMenuModuleList");
Portal.MenuSet.NotInMenuModuleList = Ext.extend(Ext.grid.GridPanel, {
    selectCodes: "",
    bizModuleFullName: "",
    initComponent: function () {
        var pageList = this;
        var checkColumn = new Ext.grid.CheckboxSelectionModel();
        //        this.stripeRows = true;
        this.cls = 'g-grid-norowsline';
        this.enableDragDrop = false;
        this.title = '业务界面';
        //        this.height = 160;
        //                this.store = new Ext.data.JsonStore({
        //                    autoDestroy: true,
        //                    url: defaultUrl,
        //                    autoLoad: true,
        //                    baseParams: { cmd: 'LoadSolutionList' },
        //                    storeId: 'myStore',
        //                    sortInfo: {
        //                        field: 'CreateDate',
        //                        direction: 'DESC'
        //                    },
        //                    fields: [{ name: 'ID', type: 'int', mapping: "Id" },
        //                             { name: 'Code', type: 'int', mapping: 'Id' },
        //                             { name: 'Name', mapping: 'SolutionName' },
        //                             { name: 'CreateDate', type: 'date', dateFormat: 'Y-n-j G:i:s' },
        //                             'Description'
        //                            ]
        //                });

        this.store = new Ext.data.JsonStore({
            storeId: 'myStore',
            fields: [//{ name: 'ID', type: 'int', mapping: "Id" },
                             {name: 'Code', mapping: 'PageName' },
                             { name: 'Name', mapping: 'PageAlias' },
            //                             { name: 'CreateDate', type: 'date', dateFormat: 'Y-n-j G:i:s', mapping: 'CreatedTime' },
            {name: 'FullCode', mapping: 'FullName' },
                             'Url',
                             'Description'
                            ]
        });
        this.columns = [
        			checkColumn,
			{ header: "ID", dataIndex: "ID", hidden: true, hideable: false },
            { header: "页面名称", dataIndex: "Name", align: 'center', width: 160 },
			{ header: "页面编码", dataIndex: "Code", align: 'center', width: 115 }

		];
        //this.viewConfig = { forceFit: true };
        this.ddGroup = 'menuGroup';
        this.enableDragDrop = true;
        //this.pageSize = 5;
        this.region = "south";
        this.split = true;
        this.loadMask = true;
        this.fields = [];
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].dataIndex)
                this.fields.push({ name: this.columns[i].dataIndex });
        }
        //        this.tbar = { height: 27, items: ['', { xtype: "displayfield", value: "需要发布的" }] };
        //        this.tbar = { height: 27, items: ['', { xtype: "displayfield", value: "需要发布的菜单项" }, '->', { text: '发布链接设置', handler: this.showReleaseLinkSettingwin.createDelegate(this)}] };

        this.dataLoaded = false;

        this.sm = checkColumn;
        //        this.query = function () {
        //            this.store.args.index = 0;
        //            var properties = [];
        //            for (var i = 0; i < this.fields.length; i++) {
        //                properties.push(this.fields[i]);
        //            }
        //            this.store.args.filters = [];
        //            this.store.args.size = 25;
        //            this.store.args.order = [];
        //            this.store.args.properties = properties;
        //            this.store.setBaseParam("args", Ext.encode([this.store.args]));
        //            this.dataLoaded = false;
        //            this.store.load({});
        //        };

        //        var selectCodes = "";
        this.on("rowclick", function (grid, row, e) {
            //            var centerGridIndex = (this.ownerCt.ownerCt.id === 'deployToWebsite' || this.ownerCt.ownerCt.id === 'deployToDynamicMenu') ? 2 : 0;
            //            var rightGrid = this.ownerCt.ownerCt.get(centerGridIndex).get(0);
            var rightGrid = pageList;
            var code = grid.store.getAt(row).get("Code");
            var selected = grid.getSelectionModel().isSelected(row);
            if (this.selectCodes.indexOf("," + code + ",") > -1 && selected)
                grid.getSelectionModel().deselectRow(row);
            this.selectCodes = rightGrid.GetSelectModuleCodes();
        });
        this.on("headerclick", function (grid, col, e) {
            //            var centerGridIndex = (this.ownerCt.ownerCt.id === 'deployToWebsite' || this.ownerCt.ownerCt.id === 'deployToDynamicMenu') ? 2 : 0;

            //            var rightGrid = this.ownerCt.ownerCt.get(centerGridIndex).get(0);
            var rightGrid = pageList;
            if (col == 0) {
                selectCodes = rightGrid.GetSelectModuleCodes();
            }
        });
        this.sm.on("selectionchange", function () {
            var view = this.ownerCt.ownerCt.ownerCt;
            if (view.id === 'deployToWebsite' || view.id === 'deployToDynamicMenu') {
                var centerTool = view.get(1).get(0);
                centerTool.RightSelectedChange();
            }
        }, this);
        Portal.MenuSet.NotInMenuModuleList.superclass.initComponent.call(this);
    },
    afterRender: function () {
        Portal.MenuSet.NotInMenuModuleList.superclass.afterRender.call(this);
        //        var view = this.ownerCt.ownerCt;
        //        winExp.on('beforeshow', this.loadData, this);
        //        view.on('activate', this.loadData, this);
    },
    //    loadData: function (records) {
    //        var pageData = [];
    //        records.each(function (item) {
    //            pageData.push(item.data);
    //        })
    //        this.store.loadData(pageData);
    //    },
    SelectFirstRow: function () {
        if (this.store.getCount() > 0) {
            this.getSelectionModel().selectFirstRow();
            this.getView().focusRow(0);
        }
    },
    GetSelectModuleCodes: function () {//两边有,的
        var selectCodes = ",";
        var rows = this.getSelectionModel().getSelections();
        if (rows != null && rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                selectCodes += rows[i].get("Code") + ",";
            }
        }
        return selectCodes;
    },
    GetSelectNodes: function () {//Name,ModuleId,IsPortalModule,ContainChild,ModulePID,ModuleFullCode
        var nodes = new Array();
        var rows = this.getSelectionModel().getSelections();
        if (rows != null) {
            for (var i = 0; i < rows.length; i++) {
                nodes.push({
                    Name: rows[i].get("Name"),
                    Code: rows[i].get("Code"),
                    Url: rows[i].get("Url"),
                    PublishName: null,
                    FullCode: rows[i].get("FullCode"),
                    ModuleId: rows[i].get("Code"),
                    ModuleFullCode: this.bizModuleFullName,
                    IsPortalModule: true,
                    ContainChild: false,
                    TType: 'GTP.AppFrameV2.DynaBizComp'
                });
            }
        }
        return nodes;
    },
    showReleaseLinkSettingwin: function () {
        if (!this.linkwin) {
            this.linkwin = new MenuTable.MenuSet.ReleaseLinkSetting();
        }
        this.linkwin.show();
    }
});

Ext.ns("Portal.MenuSet.PagePublishWindow");
Portal.MenuSet.PagePublishWindow = Ext.extend(Ext.Window, {
    //布局属性
    title: '菜单设置',
    width: 415,
    height: 320,
    modal: true,
    padding: 10,
    border: false,
    layout: "fit",
    msgGrid: null,
    //    closeAction: 'close',

    pNode: null,
    data: null,
    addNodeFun: null,

    constructor: function (config) {
        config = config ? config : {};
        var pagePublishWindow = this;
        //        this.initMsgLabel();
        this.initMsgGrid();
        config.items = [{
            xtype: "fieldset",
            title: "请设置菜单名称,默认使用页面名称",
            layout: "fit",
            //            width: 320,
            items: [this.msgGrid]
        }];
        config.buttons = [{
            xtype: 'button',
            text: '确定',
            handler: function () {
                pagePublishWindow.addNodes();

            },
            scope: this
        }, {
            xtype: 'button',
            text: '取消',
            handler: this.closeWindow,
            scope: this
        }];
        //        Ext.apply(this, config);
        Portal.MenuSet.PagePublishWindow.superclass.constructor.call(this, config);
    },
    closeWindow: function () {
        this.hide();
    },
    addNodes: function () {
        var records = this.msgGrid.store.getRange();
        for (var i = 0; i < records.length; i++) {
            var menuAlias = records[i].data.PublishAlias ? records[i].data.PublishAlias : records[i].data.PageAlias
            if (this.hasSameChildCode(this.pNode, menuAlias)) {
                Gtp.net.MessageBox.info("提示", '当前菜单下已存在"' + menuAlias + '"页面');
                return;
            }
            this.data[i].PublishName = menuAlias;
        }
        this.hide();
        this.addNodeFun();
    },
    initMsgGrid: function () {
        this.msgGrid = new Ext.grid.EditorGridPanel({
            region: 'center',
            height: 285,
            clicksToEdit: 1,
            singleSelect: true,
            store: new Ext.data.JsonStore({
                fields: [
                    { name: 'PageAlias', mapping: 'Name' },
                    { name: 'PublishAlias', mapping: 'PublishName', emptyText: '(双击添加)' }
                ]
            }),
            colModel: new Ext.grid.ColumnModel([
                    {
                        header: "业务页面",
                        width: 160,
                        dataIndex: 'PageAlias'
                    }, {
                        header: '菜单名称',
                        width: 160,
                        dataIndex: 'PublishAlias',
                        editor: new Ext.grid.GridEditor(new Ext.form.TextField(

                                                            ))
                    }]),
            sm: new Ext.grid.RowSelectionModel({ singleSelect: true })

        });
    },
    hasSameChildCode: function (pNode, code, selfNode) {
        if (pNode == null)
            pNode = tv._root;
        for (var i = 0; i < pNode.childNodes.length; i++) {
            if (selfNode == pNode.childNodes[i])
                continue;
            if (pNode.childNodes[i].attributes.text == code)
                return true;
        }
        return false;
    },
    resetAndShow: function (pNode, data, addCurrentNodes) {
        this.pNode = pNode;
        this.data = data;
        this.msgGrid.store.loadData($G.clone(data));
        this.addNodeFun = addCurrentNodes;
        this.show();
    }
});


Portal.MenuSet.AddMenuFolderWindow = Ext.extend(Ext.Window, {
    title: '添加菜单目录',
    width: 360,
    height: 150,
    modal: true,
    padding: 10,
    border: false,
    layout: "fit",
    addForm: null,
    menuId:0,
    pId:0,
    menuTree: null,
    constructor: function (config) {
        var me = this;
        config = config ? config : {};
        me.addForm = new Ext.form.FormPanel({
            labelWidth: 75,
            region: 'center',
            bodyStyle: 'padding:5px 5px 0',
            defaults: { width: 230 },
            defaultType: 'textfield',
            items: [{
                fieldLabel: '菜单名称',
                name: 'name',
                allowBlank: false
            }, {
                fieldLabel: '菜单全名称',
                name: 'fullName'
            }
        ],
            buttons: [{
                text: '确定',
                handler: function () {
                    var form = me.addForm.getForm();
                    if (form.isValid()) {
                        var name = form.findField('name').getValue();
                        var fullName = form.findField('fullName').getValue();
                        Gtp.net.Global.dispatcher({
	                          controller: "GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage",
	                          async: false,
	                          action: "SaveMenuItems",
	                          args: [me.menuId,name,fullName,me.pId],
                              //args: [1, {Cns: [{Cns: [{Cns: [{Tx: "s", Ctx: "ed", Op: 1}], id: "100183"}], id: "100182"}]}]
	                          success: function (result) {
	                               me.menuTree.reloadNodes();
	                          },
	                          failure: function () {
	     
	                          }
                        });
                        form.reset();
                        me.hide();
                    } else {
                        $G.alert("提示", "菜单名称不能为空");
                    }
                },
                scope: this
            }, {
                text: '取消',
                handler: me.closeWindow,
                scope: this
            }]
        })

        config.items = [me.addForm];

        Portal.MenuSet.AddMenuFolderWindow.superclass.constructor.call(this, config);
    },
    closeWindow: function () {
        this.hide();
    },
    addNodes: function () {
    }
});


//<![CDATA[
Ext.onReady(function () {

    //生成发布的实体页面
    var deploySolution = function (itemNotInGrid) {
        var recordList = itemNotInGrid.getSelectionModel().getSelections();
        if (recordList.length > 0) {
            var grid = Ext.getCmp('reportList'),
                selectModel = grid.getSelectionModel(),
                selectRow = selectModel.getSelected(),
                num = grid.store.indexOf(selectRow);
            for (var i = 0; i < recordList.length; i++) {
                var solutionId = recordList[i].get('ID'),
                solutionName = recordList[i].get('Name'),
                description = recordList[i].get('Description');
                Ext.Ajax.request({
                    url: defaultUrl,
                    asyn: false,
                    success: function (form) {
                        grid.getStore().reload({
                            callback: function (r, options, flag) {
                                if (flag && num > 0) {
                                    selectModel.selectRow(num);
                                }
                            }
                        });
                    },
                    failure: function (form) {
                    },
                    params: {
                        cmd: 'DeploySolution',
                        solutionId: solutionId,
                        ReportName: solutionName,
                        Description: description
                    }
                });

            }

            Ext.example.msg('所有报表已更新！')
        }

    }
    var showResult = function (btn) {
        if (btn == 'yes') {
            updateNode();
            itemMenu.AllNodeInsert = new Array();
            itemMenu.AllNodeRemove = new Array();
            winExp.hide();
        }
        else if (btn == 'no') {
            itemMenu.AllNodeInsert = new Array();
            itemMenu.AllNodeRemove = new Array();
            winExp.hide();
        }
        else if (btn = 'cancel')
        { }

    }

    var updateNode = function () {
        var AllNodeInsert = itemMenu.AllNodeInsert, ilen = AllNodeInsert.length,
        AllNodeRemove = itemMenu.AllNodeRemove, rlen = AllNodeRemove.length;
        for (var i = 0; i < rlen; i++) {
            doAction("GTP.Portal.Biz.WebUI.Manage.MenuItemManage", "DeleteNode", [AllNodeRemove[i].attributes.FullCode], function (result) {
                if (result == true) { }
            }, null, false);
        }
        if (ilen > 0) {
            doAction("GTP.Portal.Biz.WebUI.Manage.MenuItemManage", "InsertNodeList", [AllNodeInsert], function (result) {
            }, null, false);
        }
    }


    var updateMenuNode = function () {
        var AllNodeInsert = itemMenu2.AllNodeInsert, ilen = AllNodeInsert.length,
        deleteArray = [],
        AllNodeRemove = itemMenu2.AllNodeRemove, rlen = AllNodeRemove.length;
        for (var i = 0; i < rlen; i++) {
            //debugger;
            deleteArray.push(AllNodeRemove[i].attributes.ItemID);
        }
        if (deleteArray.length > 0) {
            doAction("GTP.FormFrame.MenuListPage|GTP.AppFrame.DictTemplate.TreeDictListEXPage|GTP.AppFrame.TreeDictListBasePage|GTP.AppFrame.BasePage", "DeleteEntityByKeys", [deleteArray, 'GTP.FormFrame.FormMenuQuery'], function (result) {
                if (result == true) { }
            }, null, false);
        }
        if (ilen > 0) {
            for (var i = 0; i < ilen; i++) {

                var linkInfor = {
                    FormPageURL: AllNodeInsert[i].Url,
                    IsCustom: true,
                    // PermissionControl: true,
                    PageAlias: AllNodeInsert[i].Name,

                    PageType: { alias: { 'zh_CN': "站内链接" }, name: "Item1" },
                    __changeSummary: true,
                    __state: "created",
                    __type: "GTP.FormFrame.FormPage"
                }
                var a = AllNodeInsert[i].Url.split("=");
                if (a.length == 2) {
                    linkInfor.DynamicModuleName = a[1];
                }

                doAction("GTP.FormFrame.FormPageManage", "Insert", [linkInfor], function (result) {
                    AllNodeInsert[i].FormPage_ID = { Id: result }

                })
                doAction("GTP.FormFrame.MenuEditPage|GTP.AppFrame.DictTemplate.TreeDictEditPage|GTP.AppFrame.TreeDictEditBasePage|GTP.AppFrame.BasePage", "Insert", [AllNodeInsert[i]], function (result) {
                }, null, false);
            }
        }

    }

    var portComponentURL = "../../Portal/manage/WidgetHandler.ashx";

    var deployToWebComponent = function (itemNotInGrid3) {

        var reportURLSuffix = "";
        if (itemNotInGrid3.linkwin && itemNotInGrid3.linkwin.urlSuffix) {
            reportURLSuffix = "&" + itemNotInGrid3.linkwin.urlSuffix;
        }
        var successSolution = "";
        var failureSolution = "";
        var existSolution = "";
        var recordList = itemNotInGrid3.getSelectionModel().getSelections();
        if (recordList.length > 0) {
            var grid = Ext.getCmp('reportList'),
                selectModel = grid.getSelectionModel(),
                selectRow = selectModel.getSelected(),
                num = grid.store.indexOf(selectRow);
            for (var i = 0; i < recordList.length; i++) {
                var solutionId = recordList[i].get('ID'),
                solutionName = recordList[i].get('Name'),
                description = recordList[i].get('Description');

                var reportURL = '/bi/CustomAnalysis/Report.aspx?solutionid=' + solutionId + reportURLSuffix;

                Ext.Ajax.request({
                    url: portComponentURL,
                    async: false,
                    method: "GET",
                    success: function (form) {
                        if (form.responseText === '-1') {
                            //                            Ext.example.msg('发布到门户组件失败!组件名或URL不能为空！报表：' + solutionName);
                            failureSolution += solutionName + "、";
                        } else if (form.responseText === '-2') {
                            //                            Ext.example.msg('发布到门户组件失败!该组件已经存在！报表：' + solutionName);
                            existSolution += solutionName + "、";
                        }
                        else {
                            successSolution += solutionName + "、";
                            grid.getStore().reload({
                                callback: function (r, options, flag) {
                                    if (flag && num > 0) {
                                        selectModel.selectRow(num);
                                    }
                                }
                            });
                        }
                    },
                    failure: function (form) {
                        failureSolution += solutionName + "、";
                        //                        Ext.example.msg('发布到门户组件失败!报表：' + solutionName)
                    },
                    params: {
                        url: reportURL,
                        name: solutionName,
                        mrurl: reportURL
                    }
                });

            }

        }
        function trimEnd(str) {
            if (str.length > 0) {
                return str.substring(0, str.length - 1);
            } else {
                return str;
            }
        }

        return { success: trimEnd(successSolution), failure: trimEnd(failureSolution), exist: trimEnd(existSolution) };
    }

    Ext.QuickTips.init();
    Portal.MenuSet.init();
    winExp = new Ext.Window({
        layout: "fit",
        title: '页面发布',
        resizable: false,
        width: 700,
        height: 500,
        autoDestroy: true,
        modal: true,
        closeAction: 'hide',
        items: [{
            xtype: 'tabpanel',
            activeTab: 0,
            listeners: { "beforetabchange": function (_this, newTab, currentTab) {
                if (newTab.rendered) {
                    if (newTab.id === 'deployToWebsite' || newTab.id === 'deployToDynamicMenu')
                    {
                     if (Ext.isEmpty(newTab.dataLoaded))
                     {
                        newTab.dataLoaded=true;
                        newTab.get(0).get(0).reloadNodes();
                     }
                   }
                }
            }
            },
            items: [{
                id: 'deployToWebsite',
                title: '发布到门户',
                layout: "border",
                defaults: { border: false, layout: 'fit' },
                items: [{
                    region: 'west',
                    width: 312,
                    items: [itemMenu]
                }, {
                    region: 'center',
                    layout: 'fit',
                    items: [itemCenter]
                }, {
                    width: 312,
                    region: 'east',
                    layout: 'border',
                    items: [{
                        layout: 'fit',
                        region: 'center',
                        items: [dynamicModuleGrid1]
                    }, {
                        layout: 'fit',
                        region: 'south',
                        //                        collapsible: true,
                        //                        titleCollapse: false,
                        split: true,
                        collapseMode: 'mini',
                        splite: true,
                        height: 160,
                        items: [itemNotInGrid]
                    }]
                }],
                buttons: [{
                    text: "确认发布",
                    cls: "g-btn-recommend",
                    handler: function () {
                        var AllNodeInsert = itemMenu.AllNodeInsert,
                                        ilen = AllNodeInsert.length,
                                        AllNodeRemove = itemMenu.AllNodeRemove,
                                        rlen = AllNodeRemove.length;
                        if (ilen > 0 || rlen > 0) {
                            Ext.Msg.confirm("提示", '是否发布菜单项！', function (result) {
                                if (result != "yes") {
                                    return;
                                }
                                //                                deploySolution(itemNotInGrid);
                                updateNode();
                                itemMenu.AllNodeInsert = new Array();
                                itemMenu.AllNodeRemove = new Array();
                                Ext.Msg.confirm("提示", '菜单项发布成功，是否关闭？', function (result) {
                                    if (result != "yes") {
                                        itemMenu.reloadNodes();
                                        //                                        itemMenu.expandAll();
                                        itemMenu.getSelectionModel().select(itemMenu.getRootNode().firstChild)
                                        return;
                                    } else {
                                        winExp.hide();
                                    }
                                })
                            })
                        } else {
                            Ext.MessageBox.alert('提示', '当前尚未添加需要发布的业务模板，请先在右侧选择相关页面添加到左侧选中菜单下');
                        }
                    }
                }, { text: "关闭",
                    //id: 'close',
                    handler: function () {
                        var AllNodeInsert = itemMenu.AllNodeInsert,
                                        ilen = AllNodeInsert.length,
                                        AllNodeRemove = itemMenu.AllNodeRemove,
                                        rlen = AllNodeRemove.length;

                        if (ilen > 0 || rlen > 0) {
                            var msg = '页面';
                            msg += ilen > 0 ? '有' + ilen + '个菜单项未发布,' : '';
                            msg += rlen > 0 ? '有' + rlen + '个菜单项未删除' : '';

                            Ext.MessageBox.show({
                                title: '保存更改',
                                msg: msg + ' <br />您希望继续完成这些操作吗?',
                                buttons: Ext.MessageBox.YESNOCANCEL,
                                animEl: 'close',
                                fn: showResult,
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                        else {
                            winExp.hide();
                            itemMenu.AllNodeInsert = new Array();
                            itemMenu.AllNodeRemove = new Array();
                        }

                    }
                }]

            },
            {
                id: 'deployToDynamicMenu',
                title: '发布到动态菜单',
                layout: "border",
                defaults: { border: false, layout: 'fit' },
                items: [{
                    region: 'west',
                    width: 312,
                    items: [itemMenu2]
                }, {
                    region: 'center',
                    layout: 'fit',
                    items: [itemCenter2]
                }, {
                    width: 312,
                    region: 'east',
                    layout: 'border',
                    items: [{
                        layout: 'fit',
                        region: 'center',
                        items: [dynamicModuleGrid2]
                    }, {
                        layout: 'fit',
                        region: 'south',
                        //                        collapsible: true,
                        //                        titleCollapse: false,
                        split: true,
                        collapseMode: 'mini',
                        splite: true,
                        height: 160,
                        items: [itemNotInGrid2]
                    }]
                }],
                buttons: [{
                    text: "确认发布",
                    cls: "g-btn-recommend",
                    handler: function () {
                        var AllNodeInsert = itemMenu2.AllNodeInsert,
                                        ilen = AllNodeInsert.length,
                                        AllNodeRemove = itemMenu2.AllNodeRemove,
                                        rlen = AllNodeRemove.length;
                        if (ilen > 0 || rlen > 0) {
                            Ext.Msg.confirm("提示", '是否发布菜单项！', function (result) {
                                if (result != "yes") {
                                    return;
                                }
                                //                                deploySolution(itemNotInGrid2);
                                updateMenuNode();
                                itemMenu2.AllNodeInsert = new Array();
                                itemMenu2.AllNodeRemove = new Array();
                                Ext.Msg.confirm("提示", '菜单项发布成功，是否关闭？', function (result) {
                                    if (result != "yes") {
                                        itemMenu2.reloadNodes();
                                        //                                        itemMenu2.expandAll();
                                        itemMenu2.getSelectionModel().select(itemMenu2.getRootNode().firstChild)
                                        return;
                                    } else {
                                        winExp.hide();
                                    }
                                })
                            })
                        } else {

                            Ext.MessageBox.alert('提示', '请先选择要发布的菜单项！');
                        }
                    }
                }, { text: "关闭",
                    //id: 'close',
                    handler: function () {
                        var AllNodeInsert = itemMenu2.AllNodeInsert,
                                        ilen = AllNodeInsert.length,
                                        AllNodeRemove = itemMenu2.AllNodeRemove,
                                        rlen = AllNodeRemove.length;

                        if (ilen > 0 || rlen > 0) {
                            var msg = '页面';
                            msg += ilen > 0 ? '有' + ilen + '个菜单项未发布,' : '';
                            msg += rlen > 0 ? '有' + rlen + '个菜单项未删除' : '';

                            Ext.MessageBox.show({
                                title: '保存更改',
                                msg: msg + ' <br />您希望继续完成这些操作吗?',
                                buttons: Ext.MessageBox.YESNOCANCEL,
                                animEl: 'close',
                                fn: showResult,
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                        else {
                            winExp.hide();
                            itemMenu2.AllNodeInsert = new Array();
                            itemMenu2.AllNodeRemove = new Array();
                        }

                    }
                }]


            }]
        }],
        listeners: { 'hide': function () {
            if (itemMenu.rendered) {
                itemMenu.reloadNodes();
                itemCenter.get(0).setDisabled(true);
                itemCenter.get(1).setDisabled(true);
                itemNotInGrid.getSelectionModel().clearSelections();
            }
            if (itemMenu2.rendered) {
                itemMenu2.reloadNodes();
                itemCenter2.get(0).setDisabled(true);
                itemCenter2.get(1).setDisabled(true);
                itemNotInGrid2.getSelectionModel().clearSelections();
                //                itemNotInGrid3.getSelectionModel().clearSelections();

            }
        }
        }

    });
});
//]]>


-->
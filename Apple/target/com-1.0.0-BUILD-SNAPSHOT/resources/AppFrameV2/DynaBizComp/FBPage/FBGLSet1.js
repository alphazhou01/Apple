var itemCenter2, itemMenu2, itemNotInGrid2;
Ext.ns("MenuTable.MenuSet")
Ext.ns("MenuTable.MenuSet.CenterPanel");
MenuTable.MenuSet.CenterPanel.create = function () {
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
                var leftSelectNode = leftTree.getSingleSelectNode();
                if (leftSelectNode != null && leftSelectNode.attributes.isCategory == true) {
                    leftSelectNode.expand(false, false, function () {
                        leftTree.addMenuNodeByData(nodes_Grid);
                    });
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
        panel.changeButtonState();
    };
    panel.changeButtonState = function () {
        var btnRight = panel.get(1),
        btnLeft = panel.get(0),
        view = panel.ownerCt.ownerCt,
        rightGrid = view.get(2).get(1).get(0),
        gridChecked = rightGrid.getSelectionModel().getSelections(),
        leftTree = view.get(0).get(0),
        leftSelectNode = leftTree.getSingleSelectNode();
        btnLeft.setDisabled(true);
        btnRight.setDisabled(true);
        if (leftSelectNode && leftSelectNode.attributes.isLeaf == true && leftSelectNode.attributes.isCategory != true) {
            btnRight.setDisabled(false);
        } else {
            if (gridChecked.length > 0 && leftSelectNode && leftSelectNode.attributes.isCategory == true) {
                btnLeft.setDisabled(false);
            }
        }
    };
    return panel;
};


Ext.ns("MenuTable.MenuSet.MenuTree")
MenuTable.MenuSet.MenuTree.create = function (cfg) {
    var _cfg = Ext.apply({ rootVisible: false, AllNodeInsert: [], AllNodeRemove: [] }, cfg);

    _cfg.loadChildNodes = function () {
        doAction("GTP.FormFrame.MenuListPage", "QueryByCriteria", [{
            queryEntity: "GTP.FormFrame.FormMenuQuery",
            orders: [
                 { propertyName: "Level", isDesc: false, cultureKey: null },
                 { propertyName: "OrderNo", isDesc: false, cultureKey: null }
                ]

        }], this.loadChildNodesCallback.createDelegate(this), null, false);
    };
    _cfg.reloadNodes = function () {
        var c = this;
        //var root = c.getRootNode()
        this.selectedNode = null;
        c.root.removeAll();
        c.loadChildNodes();
        var view = c.ownerCt.ownerCt;
        var centerTool = view.get(1).get(0);
        var btnLeft = centerTool.get(0);
        var btnRight = centerTool.get(1);
        btnLeft.setDisabled(true);
        btnRight.setDisabled(true);

    },

    _cfg.getSingleSelectNode = function () {
        return this.selectedNode;
        // return this.getSelectionModel().getSelectedNode()
    },
    _cfg.hasSameChildCode = function (pNode, code) {
        if (pNode == null)
            pNode = this.root;
        for (var i = 0; i < pNode.childNodes.length; i++) {

            if (pNode.childNodes[i].attributes.Code == code)
                return true;
        }
        return false;
    };
    _cfg.addMenuNodeByData = function (listData) {
        var tv = this;
        var leftSelectNode = tv.getSingleSelectNode();
        var pID = 0;
        var pCode = "";
        if (leftSelectNode != null) {
            if (leftSelectNode.attributes.ItemID != null)
                pID = leftSelectNode.attributes.ItemID;
            if (leftSelectNode.attributes.FullCode != null)
                pCode = leftSelectNode.attributes.FullCode;
        }
        var menuID = leftSelectNode.attributes.MenuId;
        var addCurrentNodes = function () {
            var listNodeData = new Array();
            //  tv.AllNodeInsert = [];
            for (var i = 0; i < listData.length; i++) {
                var dataTemp = listData[i];
                //                var num = "";
                var nameTemp = dataTemp.PublishName;
                var code = '$' + dataTemp.ModuleFullCode.replace(/\./g, '_') + '$' + nameTemp + "" + "$" + pID || 0;
                var fullCode = code;
                if (pCode != "") fullCode = pCode + "." + fullCode;
                var moduleLinkUrl = dataTemp.Url + ((dataTemp.Url.indexOf('?') == -1) ? '?' : '&') + 'modulecode=' + dataTemp.ModuleFullCode;
                var inforObj = {
                    PID: pID,
                    Code: code,
                    FullCode: fullCode,
                    Name: nameTemp,
                    FBCD_ID: menuID,
                    Url: moduleLinkUrl,
                    ID: dataTemp.ID,
                    FBCDGL: {
                        ID: menuID
                    },
                    NodeType: {
                        alias: { zh_CN: "页面节点" },
                        name: "Leaf"
                    },
                    IsLeaf: true,
                    __changeSummary: true,
                    __state: "created",
                    __type: "GTP.FormFrame.FormMenu"
                };
                listNodeData.push(inforObj);
                tv.AllNodeInsert.push(inforObj);
            }
            for (var i = 0; i < listNodeData.length; i++) {
                //leftSelectNode.
                leftSelectNode.appendChild(
                new Ext.tree.TreeNode({
                    nodeType: 'node',
                    expandable: !listNodeData[i].IsLeaf,
                    text: listNodeData[i].Name,
                    // id: 'g-node-' + listNodeData[i].MenuId,
                    ItemID: listNodeData[i].ID,
                    Code: listNodeData[i].Code,
                    icon: $G.getAppName() + "/Common/images/toolbar/GTP_menunull.png"
                })
            )
            }
        };
        this.pagePublishWindow.resetAndShow((listData.type == 0 ? null : leftSelectNode), listData, addCurrentNodes);
    };
    _cfg.DeleteSelectNode = function (callBack) {
        var tv = this;
        var leftSelectNode = tv.getSingleSelectNode();
        var parent = leftSelectNode.parentNode;
        parent.removeChild(leftSelectNode);
        tv.AllNodeRemove.push(leftSelectNode);
    };
    _cfg.loadChildNodesCallback = function (result) {
        var nodes = result.Entities;
        var rootNode = this.getRootNode();
        var pNode = rootNode;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].PID != 0 && v.getNodeById('g-node-' + nodes[i].PID)) {
                pNode = v.getNodeById('g-node-' + nodes[i].PID);
            }
            var node = new Ext.tree.TreeNode({
                nodeType: 'node',
                expandable: !nodes[i].IsLeaf,
                isLeaf: nodes[i].IsLeaf,
                text: nodes[i].Name,
                id: 'g-node-' + nodes[i].ID,
                ItemID: nodes[i].ID,
                MenuId: nodes[i].FBCD_ID,
                Code: nodes[i].Name + "" + "$" + pNode.attributes.ItemID || 0,
                isCategory: nodes[i].NodeType.name == 'Category'//是不是类别节点
            });
            node.code = nodes[i].Code.replace("USER", "");
            pNode.appendChild(node);
        }
        rootNode.expand(false, true)
    };


    var v = new Ext.ux.AppFrame.Controls.FilterTreePanel(_cfg);
    v.showButtons();
    v.on('afterrender', v.loadChildNodes);
    v.on("click", function (node, e) {
        if (v.selectedNode) {
            v.selectedNode.setCls("");
        }
        node.setCls("x-tree-selected");
        v.selectedNode = node;

        //var lastSelectNode = this.getSingleSelectNode();
        var centerTool = this.ownerCt.ownerCt.get(1).get(0);
        if (node == null)
            centerTool.changeButtonState(true);
        else
            centerTool.changeButtonState(false, node);

        //        centerTool.RightSelectedChange();
    }, v);
    v.setRootNode(new Ext.tree.TreeNode({ nodeType: 'node', expandable: true, text: '节点' }));
    return v;
};


MenuTable.MenuSet.ReleaseLinkSetting = Ext.extend(Ext.Window, {
    width: 400,
    title: '链接设置',
    height: 150,
    padding: 8,
    modal: true,
    initComponent: function () {
        this.items = [{
            xtype: 'checkboxgroup', columns: 3,
            hideLabel: true,
            items: [{
                boxLabel: '隐藏顶部工具栏',
                inputValue: 'hidetool'
            }, {
                boxLabel: '隐藏图表',
                inputValue: 'hidechart'
            }, {
                boxLabel: '隐藏图标工具栏',
                inputValue: 'hidecharttool'
            }, {
                boxLabel: '隐藏数据表',
                inputValue: 'hidedata'
            }, {
                boxLabel: '隐藏数据工具栏',
                inputValue: 'hidedatatool'
            }, {
                boxLabel: '隐藏钻取导航',
                inputValue: 'hidenav'
            }, {
                boxLabel: '不允许钻取',
                inputValue: 'undrill'
            }]
        }]
        this.buttons = [{
            text: '确定', handler: this.btnOk, scope: this
        }, {
            text: '取消', handler: this.btnCancel, scope: this
        }]
        MenuTable.MenuSet.ReleaseLinkSetting.superclass.initComponent.call(this);

    },
    getValue: function () {
        var o = {};
        Ext.each(this.get(0).getValue(), function (item) {
            o[item.inputValue] = 1;
        })
        return o;
    },
    setValue: function (value) {
    },
    btnOk: function () {
        this.urlSuffix = Ext.urlEncode(this.getValue());
        this.hide();
    },
    btnCancel: function () {
        this.hide();
    }

})












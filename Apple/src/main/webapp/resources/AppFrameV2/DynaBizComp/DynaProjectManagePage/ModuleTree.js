Ext.ns("GTP.AppFrameV2.DynaBizComp");

GTP.AppFrameV2.DynaBizComp.createModuleTree = function (nodeClickFunc, renderToPanel, config) {
    config = config || {};
    var dispatcher = new Gtp.net.GtpDispatcher({
        dispatchArgs: {
            controller: config.controller || 'GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage',
            action: config.action || 'GetLeafTreeData',
            args: config.args || ['GTP.Services.Common.ModuleTree']
        }
    });
    var loader = new Ext.ux.tree.GtpTreeLoader({
        dispatcher: dispatcher,
        listeners: {
            initload: function (scope, node, response) {
                //调用GTP内部的TreeLoader根据JSON数据绑定树

                this.processResponse(response, node, scope);
            },
            load: function (scope, node, response) {
                //注意，必须加，否则会造成浏览器持续请求数据
                node.expandChildNodes(false, false);
                if (node.childNodes.length) {
                    delete this.dispatcher;
                }
            }
        }
    });

    var tree = new Ext.ux.AppFrame.Controls.FilterTreePanel({
        id: 'ModuleTree',
        //指定的绑定字段
        autoScroll: true,
        keyField: "ID",
        parentKeyField: "PID",
        displayField: "Name",
        codeField: "Code",
        fullCodeField: "FullCode",
        leafField: "IsLeaf",
        orderField: "OrderNo",
        levelField: "Level",
        //	            title: "方案分类",
        //	            collapsible: true,
        border: true,
        //图标样式
        //	            leafIconCls: "gtptree-node-leaf",
        //	            branchIconCls: "gtptree-node-branch",
        loader: loader,
        selectedNode: null,
        listeners: {
            initloader: function () {

            },
            beforeload: function (node) {
                if (!node.isRoot && !node.attributes.children)
                    return false;
            }
        },
        reloadData: function (id) {
            this.selectedNode = null;
            this.loader.dispatcher = dispatcher;
            this.root.reload();
        }
    });
    //Click事件
    tree.on('click',
    function (node, e) {
        if (tree.selectedNode) {
            tree.selectedNode.setCls("");
        }
        node.setCls("x-tree-selected");
        tree.selectedNode = node;
        if (!Ext.isEmpty(nodeClickFunc)) {
            nodeClickFunc.apply(tree, arguments);
        }
    }, tree);
    //指定树呈现的位置
    var refresb = new Ext.Button({
        id: id + "_search_button",
        tooltip: "刷新",
        iconCls: "ci-toolbar-GTP_refresh-png",
        scope: this,
        handler: function () {
            // tree.loader.dispatcher = dispatcher;
            // tree.root.reload();
            tree.reloadData();
        }
    });

    tree.getTopToolbar().add(refresb);

    var panel1 = $G.getCmp(renderToPanel);
    panel1.add(tree);
    panel1.doLayout();
    return tree;
};
//***处理分页细表...***
    if (gridView.ape_PagerDetailGrid == "true") {
        // 需要构建一个空的查询方案.

        //        if (gridView.dataSource) {

        //            var dsName = gridView.id + "_ds";
        //            var ds = new Gtp.net.DataSource();
        //            ds.name = dsName;
        //            ds.entityType = gridView.apf_ds.entityType;
        //            ds.type = gridView.apf_ds.type;
        //            for (var i = 0; i < gridView.apf_ds.fields.length; i++) {
        //                var newf = ds.addField();
        //                var oldf = gridView.apf_ds.fields.items[i];
        //                newf.alias = oldf.alias;
        //                newf.name = oldf.name;
        //                newf.dataType = oldf.dataType;
        //                newf.initialConfig = oldf.initialConfig;
        //                newf.primaryKey = oldf.primaryKey;
        //                newf.type = oldf.type;
        //            }

        //            gridView.dataSource = dsName;
        //            $G.DataContext.items.add(ds);
        //            gridView.apf_ds = $G.DataContext.getDataSource(dsName);
        //            Ext.AppFrame.Extend.Ap_DataSource_Init(dsName);

        //            var f = new Gtp.net.Filter;
        //            f.name = gridView.id + "_fliter_BillId";
        //            f.field = "Bill";
        //            var qb = new Gtp.net.QueryPlan();
        //            qb.dataSource = gridView.dataSource;
        //            qb.addFilter(f);
        //            qb.pageSize = 10;
        //            qb.currentPage = 1;
        //            gridView.apf_queryPlan = qb;
        //            gridView.AP_setQueryPlan(gridView.apf_queryPlan);
        //        }
    }
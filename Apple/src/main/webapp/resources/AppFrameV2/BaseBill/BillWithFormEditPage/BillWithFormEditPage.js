//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseBill");
    var _class = Ext.extend(GTP.AppFrameV2.BaseBill.BillEditPage,
	{
	    //</Top>

	    //[Start]
	    _onPageStateChange: function (s) {
	        //当前页面状态改变触发，子类可重写，不仅仅限于状态，也可以是输入参数等.
	        _super._onPageStateChange(s);

	        var tabView_MergeFormBill = $G.getCmp("mainTabView");
	        if (!!tabView_MergeFormBill) {
	            var tabItems = tabView_MergeFormBill.items;
	            for (var tabindex = 0; tabindex < tabItems.items.length; tabindex++) {
	                var curentitys = tabItems.items[tabindex].findByType("gtpformpanel");
	                for (var entityindex = 0; entityindex < curentitys.length; entityindex++) {
	                    if (curentitys[entityindex].getId() == "entityFormView") {
	                        if ($G.Params.taskid) {
	                            tabItems.items[tabindex].setVisible(true);
	                            curentitys[entityindex].setVisible(true);
	                        } else {
	                            if (tabindex + 1 == tabItems.items.length) {
	                                tabView_MergeFormBill.setActiveTab(tabItems.items[tabindex - 1])
	                            }
	                            else {
	                                tabView_MergeFormBill.setActiveTab(tabItems.items[tabindex + 1])
	                            }
	                            tabView_MergeFormBill.remove(tabItems.items[tabindex], true);
	                        }
	                        break;
	                    }
	                    if (curentitys[entityindex].hidden == false) {
	                        isVisibleTabView = true
	                    }
	                }
	            }
	            if (tabItems.items.length == 1) {
	                var panel = tabView_MergeFormBill.ownerCt;
	                panel.add(tabItems.items[0]);
	                panel.doLayout();
	                panel.remove(tabView_MergeFormBill);
	                panel.doLayout();
	            }
	        }

	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseBill.BillWithFormEditPage = _class;
})();
//</Bottom>
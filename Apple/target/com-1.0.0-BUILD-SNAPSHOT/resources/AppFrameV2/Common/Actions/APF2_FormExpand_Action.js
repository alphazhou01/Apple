//展开折叠相关操作
(function () {
    var _p = Gtp.net.BasePage;
    Ext.apply(_p.prototype, {

        actAllFormExpand_Handler: function (sender) {
            ///<summary>全部展开</summary>
            var initcfg = this.initialConfig;

            var arrFeildset = Ext.query("fieldset");
            for (var i = 0; i < arrFeildset.length; i++) {
                $G.getCmp(arrFeildset[i].id).expand();
            }

        },
        actAllFormCollapse_Handler: function (sender) {
            ///<summary>全部折叠</summary>
            var initcfg = this.initialConfig;

            var arrFeildset = Ext.query("fieldset");
            for (var i = 0; i < arrFeildset.length; i++) {
                $G.getCmp(arrFeildset[i].id).collapse();
            }
        }

    });
})();
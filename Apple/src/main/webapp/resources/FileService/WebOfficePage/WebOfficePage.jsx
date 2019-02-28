<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"
    UICulture="auto" ContentType="text/javascript" meta:resourcekey="res_1_GWZWPage" %>

<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls"
    TagPrefix="gtp" %>
<gtp:ResourceManager UseNull="false" ID="resourceManager" runat="server" PageNamespace="GB.LK.ODM.GWYY"
    CustomIcons="['toolbar/GTP_save.png','toolbar/GTP_signature.png','toolbar/GTP_topdf.png','toolbar/GTP_printview.png','toolbar/GTP_preview.png','toolbar/GTP_cancel.png','toolbar/GTP_signnameadd.png','toolbar/GTP_referee.png','toolbar/GTP_template.png','toolbar/GTP_print.png','toolbar/GTP_marksshow.png','toolbar/GTP_markshide.png','toolbar/GTP_tnotation.png','toolbar/GTP_hwannotation.png','toolbar/GTP_logs.png','toolbar/GTP_preview.png']"
    InitScriptMode="Jsx" PageName="GWZWPage">
    <Listeners>
        <DocumentReady Handler="GWZWPage_DocumentReady" />
    </Listeners>
    <ExtendData>
        <gtp:ExtendDataItem Key="QMQueryPlan" Value="QMQueryPlan" />
    </ExtendData>
</gtp:ResourceManager>
<gtp:ResourcePlaceHolder ID="ResourcePlaceHolder1" runat="server" Mode="ScriptFiles">
</gtp:ResourcePlaceHolder>
<gtp:DataContext ID="dataContext1" runat="server">
    <Items>
    </Items>
</gtp:DataContext>
<gtp:Actions ID="actList" runat="server">
    <Items>
        <gtp:Action ID="actSave" runat="server" Disabled="false" Hidden="false" Handler="actSave_Handler"
            Icon="PageSave" IconCls="ci-toolbar-GTP_add-png" Text="保存" Tooltip="保存" meta:resourcekey="res_1_actSave">
        </gtp:Action>
        <gtp:Action ID="actSaveClose" runat="server" Disabled="false" Hidden="false" Handler="actSaveClose_Handler"
            Icon="PageSave" IconCls="ci-toolbar-GTP_add-png" Text="保存并关闭" Tooltip="保存并关闭"
            meta:resourcekey="res_1_actSave">
        </gtp:Action>
        <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler"
            Icon="PageCancel" Text="取消" Tooltip="取消" meta:resourcekey="res_2_actCancel">
        </gtp:Action>
        <gtp:Action ID="actXSHJ" runat="server" Disabled="false" Hidden="false" Handler="actXSHJ_Handler"
            Icon="PageCancel" Text="显示痕迹" Tooltip="显示痕迹" meta:resourcekey="res_2_actXSHJ">
        </gtp:Action>
        <gtp:Action ID="actYCHJ" runat="server" Disabled="false" Hidden="false" Handler="actYCHJ_Handler"
            Icon="PageCancel" Text="隐藏痕迹" Tooltip="隐藏痕迹" meta:resourcekey="res_2_actYCHJ">
        </gtp:Action>
        <gtp:Action ID="actDYYL" runat="server" Disabled="false" Hidden="false" Handler="actDYYL_Handler"
            Icon="PageCancel" Text="打印预览" Tooltip="打印预览" meta:resourcekey="res_2_actDYYL">
        </gtp:Action>
        <gtp:Action ID="actDY" runat="server" Disabled="false" Hidden="false" Handler="actDY_Handler"
            Icon="PageCancel" Text="打印" Tooltip="打印" meta:resourcekey="res_2_actDY">
        </gtp:Action>
        <gtp:Action ID="actWJLC" runat="server" Disabled="false" Hidden="false" Handler="actWJLC_Handler"
            Icon="PageSave" Text="文件另存" Tooltip="文件另存" meta:resourcekey="res_2_actQG">
        </gtp:Action>
    </Items>
</gtp:Actions>
<gtp:States ID="States1" runat="server">
    <Items>
        <gtp:State Name="State" Default="true">
            <Items>
            </Items>
        </gtp:State>
    </Items>
</gtp:States>
<gtp:Viewport ID="Viewport1" runat="server" Layout="border">
    <Items>
        <gtp:Panel ID="pl_1" runat="server" CollapseMode="Mini" Header="false" Title="" Collapsed="false"
            Region="North" Layout="fit" Split="false" Collapsible="false" Border="false"
            Padding="0" Height="27" Width="2" meta:resourcekey="res_3_1">
            <Items>
                <gtp:ToolbarPanel ID="SetToolbar" runat="server">
                    <Items>
                        <gtp:Toolbar runat="server" ID="SetToolbar_Default" Cls="g-toolbar" EnableOverflow="true">
                            <Items>
                                <gtp:Button ID="btn_actSave" runat="server" Action="actSave" ToolTip="保存" Text="保存"
                                    meta:resourcekey="res_4_btn_actSave" IconCls="ci-toolbar-GTP_save-png">
                                </gtp:Button>
                                <gtp:Button ID="btn_actSaveClose" runat="server" Action="actSaveClose" ToolTip="保存并关闭"
                                    Text="保存并关闭" IconCls="ci-toolbar-GTP_save-png">
                                </gtp:Button>
                                <gtp:Button ID="btn_actWJLC" runat="server" Action="actWJLC" ToolTip="文件另存" Text="文件另存"
                                    meta:resourcekey="res_4_btn_actTH" IconCls="ci-toolbar-GTP_save-png">
                                </gtp:Button>
                                <gtp:Button ID="btn_actXSHJ" runat="server" Action="actXSHJ" ToolTip="显示痕迹" Text="显示痕迹"
                                    meta:resourcekey="res_4_btn_actXSHJ" IconCls="ci-toolbar-GTP_marksshow-png">
                                </gtp:Button>
                                <gtp:Button ID="btn_actYCHJ" runat="server" Action="actYCHJ" ToolTip="隐藏痕迹" Text="隐藏痕迹"
                                    meta:resourcekey="res_4_btn_actYCHJ" IconCls="ci-toolbar-GTP_markshide-png">
                                </gtp:Button>
                                <gtp:Button ID="btn_actDY" runat="server" Action="actDY" ToolTip="打印" Text="打印" meta:resourcekey="res_4_btn_actYCHJ"
                                    IconCls="ci-toolbar-GTP_print-png" Hidden="true">
                                </gtp:Button>
                                <gtp:Button ID="btn_actDYYL" runat="server" Action="actDYYL" ToolTip="打印预览" Text="打印预览"
                                    meta:resourcekey="res_4_btn_actYCHJ" IconCls="ci-toolbar-GTP_printview-png" Hidden="true">
                                </gtp:Button>
                            </Items>
                        </gtp:Toolbar>
                    </Items>
                </gtp:ToolbarPanel>
            </Items>
        </gtp:Panel>
        <gtp:Panel ID="pl_2" runat="server" CollapseMode="Mini" Header="false" Title="" Collapsed="false"
            Region="Center" Layout="fit" Split="false" Collapsible="false" Border="false"
            Padding="0" Height="11" Width="22" meta:resourcekey="res_6_2">
            <Items>
                <gtp:Panel runat="server" ID="SetCustomView" ContentEl="SetCustomView_Content" AutoScroll="true">
                </gtp:Panel>
            </Items>
        </gtp:Panel>
    </Items>
</gtp:Viewport>

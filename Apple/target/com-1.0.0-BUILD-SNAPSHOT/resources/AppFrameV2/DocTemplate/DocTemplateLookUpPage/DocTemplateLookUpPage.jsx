<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DocTemplateLookUpPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DocTemplate" InitScriptMode="Jsx" PageName="DocTemplateLookUpPage" CustomIcons="['toolbar/GTP_sedown.png','toolbar/GTP_seup.png','toolbar/GTP_sedownbot.png','toolbar/GTP_seuptop.png','toolbar/GTP_fileopen.png']" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
    <ExtendData>
      <gtp:ExtendDataItem Key="ModuleCode" Value="all" />
      <gtp:ExtendDataItem Key="S_GenerateController" Value="true" />
    </ExtendData>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <InputParams>
      <gtp:InputParam Name="SelectedIdList" IsCollection="True" Type="Number" Value="" />
      <gtp:InputParam Name="MultiSelect" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="CanSelectSameRec" IsCollection="False" Type="String" Value="false" />
      <gtp:InputParam Name="DTFolderId" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="CanViewFile" IsCollection="False" Type="Boolean" Value="" />
    </InputParams>
    <OutputParams>
      <gtp:OutputParam Name="OutEntity" IsCollection="False" Type="Entity" Value="Source" />
    </OutputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="Source" Alias="源数据" Type="GTP.AppFrameV2.DocTemplate.DTQuery">
        <Fields>
          <gtp:DataField Name="ID" Alias="主键" Type="Int" PrimaryKey="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="Selected" Alias="已选数据(多选时可用)" Type="GTP.AppFrameV2.DocTemplate.DTQuery">
        <Fields>
          <gtp:DataField Name="ID" Alias="主键" Type="Int" PrimaryKey="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Code" Alias="编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Name" Alias="文件名" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="CanDisplay" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Summary" Alias="摘要" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Version" Alias="模板版本" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ViewGuid" Alias="查询标识" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="CanDisplay" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="EditGuid" Alias="编辑标识" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="CanDisplay" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="FileID" Alias="文件号" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="CanDisplay" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="DTFolder_ID" Alias="文档目录ID" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="CanDisplay" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="IsValid" Alias="是否启用" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="DTFolderFullCode" Alias="关联目录全编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="CREATE_DeptId" Alias="部门" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="FileSize" Alias="文件大小" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="CanModify" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:QueryPlans ID="queryPlans1" runat="server" >
    <items>
      <gtp:QueryPlan Name="DTqueryPlan" DataSource="Selected" ExprContext="" PageSize="1000" CurrentPage="1">
        <Filters>
          <gtp:FilterGroup Name="group_and" Value="And">
            <Items>
              <gtp:FilterGroup Name="group_DTF" Value="And">
                <Items>
                  <gtp:Filter Name="filter_DTFolder_ID" Field="DTFolder_ID" OP="Eq" />
                  <gtp:Filter Name="filter_IsValid" Field="IsValid" OP="Eq" />
                  <gtp:Filter Name="filter_CREATE_DeptId" Field="CREATE_DeptId" OP="In" />
                </Items>
              </gtp:FilterGroup>
            </Items>
          </gtp:FilterGroup>
        </Filters>
      </gtp:QueryPlan>
    </items>
  </gtp:QueryPlans>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actSelect" runat="server" Disabled="false" Hidden="false" Handler="actSelect_Handler" IconCls="ci-toolbar-GTP_sedown-png" Tooltip="选择当前记录" meta:resourcekey="res_2_actSelect" >
      </gtp:Action>
      <gtp:Action ID="actRemove" runat="server" Disabled="false" Hidden="false" Handler="actRemove_Handler" IconCls="ci-toolbar-GTP_seup-png" Tooltip="移除当前记录" meta:resourcekey="res_3_actRemove" >
      </gtp:Action>
      <gtp:Action ID="actSelectAll" runat="server" Disabled="false" Hidden="false" Handler="actSelectAll_Handler" IconCls="ci-toolbar-GTP_sedownbot-png" Tooltip="选择全部记录" meta:resourcekey="res_4_actSelectAll" >
      </gtp:Action>
      <gtp:Action ID="actRemoveAll" runat="server" Disabled="false" Hidden="false" Handler="actRemoveAll_Handler" IconCls="ci-toolbar-GTP_seuptop-png" Tooltip="移除全部记录" meta:resourcekey="res_5_actRemoveAll" >
      </gtp:Action>
      <gtp:Action ID="actSubmit" runat="server" Disabled="false" Hidden="false" Handler="actSubmit_Handler" Text="确定" meta:resourcekey="res_6_actSubmit" >
      </gtp:Action>
      <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler" Text="取消" meta:resourcekey="res_7_actCancel" >
      </gtp:Action>
      <gtp:Action ID="actOpenFile" runat="server" Disabled="false" Hidden="false" Handler="actOpenFile_Handler" IconCls="ci-toolbar-GTP_fileopen-png" Text="打开" Tooltip="打开附件" meta:resourcekey="res_8_actOpenFile" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="TbarFill_Left" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actSubmit" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="TbarSpacer_Right" Hidden="false" />
          <gtp:StateItem ReferenceName="Selected" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actSelect" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btn_actRemove" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="ToolbarSpacer" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actSelectAll" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btn_actRemoveAll" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btn_actOpenFile" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Selected.col_" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="Selected.col_Name" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="Selected.col_Summary" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="Selected.col_Version" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="Selected.col_ViewGuid" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="Selected.col_EditGuid" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="Selected.col_Remark" Hidden="false" ReadOnly="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="TbarFill_Left" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actSubmit" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="true" />
          <gtp:StateItem ReferenceName="TbarSpacer_Right" Disabled="true" />
          <gtp:StateItem ReferenceName="Selected.col_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Selected.col_Name" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Selected.col_Summary" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Selected.col_Version" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Selected.col_ViewGuid" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Selected.col_EditGuid" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Selected.col_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btn_actSelect" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actRemove" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarSpacer" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actSelectAll" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actRemoveAll" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actOpenFile" Disabled="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="North" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_9_1" >
        <Items>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_10_2" >
        <Items>
          <gtp:GridPanel ID="Selected" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="Selected" Title="已选数据(多选时可用)" Height="0" AutoCellSizeMode="None" Header="false" HideGroupedColumn="true" meta:resourcekey="res_11_Selected">
            <TopBar>
              <gtp:Toolbar runat="server" ButtonAlign="Center" ID="Selected_toolbar" EnableOverflow="true" Cls="g-toolbar">
                <Items>
                  <gtp:Button ID="btn_actSelect" runat="server" Width="40" Action="actSelect" Tooltip="选择当前记录" Hidden="true" meta:resourcekey="res_12_btn_actSelect" IconCls="ci-toolbar-GTP_sedown-png">
                  </gtp:Button>
                  <gtp:Button ID="btn_actRemove" runat="server" Width="40" Action="actRemove" Tooltip="移除当前记录" Hidden="true" meta:resourcekey="res_13_btn_actRemove" IconCls="ci-toolbar-GTP_seup-png">
                  </gtp:Button>
                  <gtp:ToolbarSpacer LabelSeparator="" ID="ToolbarSpacer" runat="server" Width="20">
                  </gtp:ToolbarSpacer>
                  <gtp:Button ID="btn_actSelectAll" runat="server" Width="40" Action="actSelectAll" Tooltip="选择全部记录" Hidden="true" meta:resourcekey="res_14_btn_actSelectAll" IconCls="ci-toolbar-GTP_sedownbot-png">
                  </gtp:Button>
                  <gtp:Button ID="btn_actRemoveAll" runat="server" Width="40" Action="actRemoveAll" Tooltip="移除全部记录" Hidden="true" meta:resourcekey="res_15_btn_actRemoveAll" IconCls="ci-toolbar-GTP_seuptop-png">
                  </gtp:Button>
                  <gtp:Button ID="btn_actOpenFile" runat="server" Action="actOpenFile" Tooltip="打开附件" Text="打开" Cls="g-btn-recommend" meta:resourcekey="res_16_btn_actOpenFile" IconCls="ci-toolbar-GTP_fileopen-png">
                  </gtp:Button>
                </Items>
              </gtp:Toolbar>
            </TopBar>
            <ColumnModel runat="server">
              <Columns>
                <gtp:TextColumn ColumnID="col_" Align="Left" DataIndex="Code" Header="编码" Editable="false" meta:resourcekey="res_17_col_">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_Name" Align="Left" DataIndex="Name" Header="文件名" Width="200" Editable="false" meta:resourcekey="res_18_col_Name">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_Summary" Align="Left" DataIndex="Summary" Header="摘要" Width="200" Editable="false" meta:resourcekey="res_19_col_Summary">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_Version" Align="Left" DataIndex="Version" Header="模板版本" Editable="false" meta:resourcekey="res_20_col_Version">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_ViewGuid" Align="Left" DataIndex="ViewGuid" Header="查询标识" Hidden="true" Editable="false" meta:resourcekey="res_21_col_ViewGuid">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_EditGuid" Align="Left" DataIndex="EditGuid" Header="编辑标识" Hidden="true" Editable="false" meta:resourcekey="res_22_col_EditGuid">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_Remark" Align="Left" DataIndex="Remark" Header="备注" Width="200" Editable="false" meta:resourcekey="res_23_col_Remark">
                </gtp:TextColumn>
              </Columns>
            </ColumnModel>
            <View>
              <gtp:GridView runat="server">
              </gtp:GridView>
            </View>
          </gtp:GridPanel>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel3" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="35" meta:resourcekey="res_24_3" >
        <Items>
          <gtp:ToolbarPanel ID="toolbarView" runat="server" Height="40" Header="false">
            <Items>
              <gtp:CommandToolbar runat="server" ID="toolbarView_toolbar" ButtonAlign="Left">
                <Items>
                  <gtp:ToolbarFill LabelSeparator="" ID="TbarFill_Left" runat="server">
                  </gtp:ToolbarFill>
                  <gtp:Button ID="btn_actSubmit" runat="server" Width="70" Action="actSubmit" Text="确定" Cls="g-btn-recommend" meta:resourcekey="res_25_btn_actSubmit">
                  </gtp:Button>
                  <gtp:Button ID="btn_actCancel" runat="server" Width="70" Action="actCancel" Text="取消" meta:resourcekey="res_26_btn_actCancel">
                  </gtp:Button>
                  <gtp:ToolbarSpacer LabelSeparator="" ID="TbarSpacer_Right" runat="server" Width="10">
                  </gtp:ToolbarSpacer>
                </Items>
              </gtp:CommandToolbar>
            </Items>
          </gtp:ToolbarPanel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Viewport>

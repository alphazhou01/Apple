<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DeptUserLookupPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.Org" InitScriptMode="Jsx" PageName="DeptUserLookupPage" CustomIcons="['toolbar/GTP_accept.png','toolbar/GTP_cancel.png']" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <InputParams>
      <gtp:InputParam Name="SelectedIdList" IsCollection="True" Type="Number" Value="" />
      <gtp:InputParam Name="multiSelect" IsCollection="False" Type="Boolean" Value="true" />
      <gtp:InputParam Name="viewType" IsCollection="False" Type="Number" Value="0" />
      <gtp:InputParam Name="dummyVisible" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="dummySelect" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="postVisible" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="postSelect" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="authCode" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="fixedNodeIds" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="typeCode" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="levelTypeCode" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="autoSelectFirstNode" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="commonlyObjectVisible" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="includeMapOrg" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="showIncChild" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="onlyDeptUser" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="autoSelectUserDept" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="direction" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="deployDeptId" IsCollection="False" Type="Number" Value="" />
      <gtp:InputParam Name="deployFrame" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="deployIsRoot" IsCollection="False" Type="Boolean" Value="false" />
      <gtp:InputParam Name="onlySelectInCondition" IsCollection="False" Type="Boolean" Value="true" />
      <gtp:InputParam Name="userAuthCode" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="selectMode" IsCollection="False" Type="String" Value="Dept" />
      <gtp:InputParam Name="selectoredNode" IsCollection="False" Type="String" Value="" />
    </InputParams>
    <OutputParams>
      <gtp:OutputParam Name="OutEntity" IsCollection="False" Type="Entity" Value="OrgObject" />
    </OutputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="OrgObject" Alias="组织" Type="">
        <Fields>
          <gtp:DataField Name="Id" Alias="Id" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="RID" Alias="RID" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Code" Alias="编码" Type="String">
          </gtp:DataField>
          <gtp:DataField Name="Name" Alias="名称" Type="String">
          </gtp:DataField>
          <gtp:DataField Name="Type" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="SubType" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="FullID" Alias="全ID" Type="String">
          </gtp:DataField>
          <gtp:DataField Name="FullName" Alias="全名称" Type="String">
          </gtp:DataField>
          <gtp:DataField Name="Propertys" Alias="属性" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="EmployeeCode" Alias="工号" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actOK" runat="server" Disabled="false" Hidden="false" Handler="actOK_Handler" IconCls="ci-toolbar-GTP_accept-png" Text="确定" meta:resourcekey="res_2_actOK" >
      </gtp:Action>
      <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler" IconCls="ci-toolbar-GTP_cancel-png" Text="取消" meta:resourcekey="res_3_actCancel" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarFill" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actOK" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarSpacer" Hidden="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="ToolbarFill" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actOK" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarSpacer" Disabled="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_4_1" >
        <Items>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="40" meta:resourcekey="res_5_2" >
        <Items>
          <gtp:ToolbarPanel ID="toolbarView" runat="server">
            <Items>
              <gtp:Toolbar runat="server" ButtonAlign="Left" ID="toolbarView_toolbar" EnableOverflow="true" Cls="g-toolbar">
                <Items>
                  <gtp:ToolbarFill LabelSeparator="" ID="ToolbarFill" runat="server">
                  </gtp:ToolbarFill>
                  <gtp:Button ID="btn_actOK" runat="server" Action="actOK" Text="确定" meta:resourcekey="res_6_btn_actOK" IconCls="ci-toolbar-GTP_accept-png">
                  </gtp:Button>
                  <gtp:Button ID="btn_actCancel" runat="server" Action="actCancel" Text="取消" meta:resourcekey="res_7_btn_actCancel" IconCls="ci-toolbar-GTP_cancel-png">
                  </gtp:Button>
                  <gtp:ToolbarSpacer LabelSeparator="" ID="ToolbarSpacer" runat="server" Width="20">
                  </gtp:ToolbarSpacer>
                </Items>
              </gtp:Toolbar>
            </Items>
          </gtp:ToolbarPanel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Viewport>

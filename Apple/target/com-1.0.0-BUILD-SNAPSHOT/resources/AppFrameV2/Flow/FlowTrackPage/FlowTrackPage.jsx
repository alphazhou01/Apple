<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_FlowTrackPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.Flow" InitScriptMode="Jsx" PageName="FlowTrackPage" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <InputParams>
      <gtp:InputParam Name="entityCode" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="dataID" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="taskID" IsCollection="False" Type="Number" Value="" />
    </InputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="FlowTraceQuery" Type="GTP.AppFrameV2.Flow.FlowTraceQuery">
        <Fields>
          <gtp:DataField Name="ID" Alias="ID" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="FlowID" Alias="FlowID" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="UnitName" Alias="环节名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Kind" Alias="类型" Type="Auto">
          </gtp:DataField>
          <gtp:DataField Name="Key1" Alias="Key1" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Data1" Alias="单号" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="EndTime" Alias="结束时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="ExecutorName" Alias="执行者名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ExecutorDeptName" Alias="创建者所属部门名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Result" Alias="处理结果" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="意见" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="MessageKind" Alias="消息类型" Type="Auto">
          </gtp:DataField>
          <gtp:DataField Name="EndTimeStr" Alias="扩展字段1" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Status" Alias="状态" Type="Auto">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="MessageTraceQuery" Type="GTP.AppFrameV2.Flow.MessageTraceQuery">
        <Fields>
          <gtp:DataField Name="ID" Alias="ID" Type="Int" PrimaryKey="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Data1" Alias="单号" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="CExecutorName" Alias="当前执行者名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="EndTime" Alias="结束时间" Type="Date">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ExecutorID" Alias="执行者名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="FlowID" Alias="FlowID" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Key1" Alias="Key1" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Kind" Alias="类型" Type="Auto">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="EnumProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="MessageKind" Alias="消息类型" Type="Auto">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="EnumProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Name" Alias="名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="意见" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Result" Alias="处理结果" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="SponsorID" Alias="发起人名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="SponsorName" Alias="发起人名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Status" Alias="状态" Type="Auto">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="EnumProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="CreatorName" Alias="提交人名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ExecutorName" Alias="执行者名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertySrc" Value="ManualInputProperty" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:QueryPlans ID="queryPlans1" runat="server" >
    <items>
      <gtp:QueryPlan Name="queryPlan" DataSource="MessageTraceQuery" ExprContext="" PageSize="25" CurrentPage="1">
        <Filters>
          <gtp:FilterGroup Name="group" Value="And">
            <Items>
              <gtp:Filter Name="filter_Data1" Field="Data1" OP="Eq" />
              <gtp:Filter Name="filter_Key1" Field="Key1" OP="Eq" />
            </Items>
          </gtp:FilterGroup>
        </Filters>
        <Orders>
          <gtp:Order Field="Status" IsDesc="False" />
          <gtp:Order Field="EndTime" IsDesc="False" />
        </Orders>
      </gtp:QueryPlan>
    </items>
  </gtp:QueryPlans>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="tabView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tabView_tab" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="tabView_fs" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="tabView_tab1" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="dataView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="customView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView.col_ExecutorName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_EndTime" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Result" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Remark" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_CreatorName" Hidden="false" ReadOnly="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="gridView.col_ExecutorName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_EndTime" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Result" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_CreatorName" ReadOnly="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" CollapseMode="Mini" Header="false" Title="" Collapsed="false" Region="Center" Layout="fit" Split="false" Collapsible="false" Border="false" Padding="0" meta:resourcekey="res_2_1" >
        <Items>
          <gtp:TabPanel runat="server" ID="tabView" DeferredRender="true" Plain="true" EnableTabScroll="true" Title="" TabPosition="Bottom" meta:resourcekey="res_3_tabView">
            <Plugins>
              <gtp:TabScrollerMenu runat="server" PageSize="50">
              </gtp:TabScrollerMenu>
            </Plugins>
            <Items>
              <gtp:Panel runat="server" ID="tabView_tab" Title="处理记录" Layout="fit" Border="false" meta:resourcekey="res_4_tabView_tab">
                <Items>
                  <gtp:DataView runat="server" ID="dataView" MultiSelect="true" DeferEmptyText="false" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" DataSource="FlowTraceQuery" AutoScroll="true" EmptyText="&lt;div style='padding:10px;'&gt;&lt;/div&gt;">
                    <Template>
                      <Html>
			
        <tpl for=".">
        <table style="font-size:12px;border:1px #ccc solid;width:100%;margin-top:6px;border-collapse:collapse;" >
        <tr>
        <td height="25px" style="background:#efefef;font-weight:700;font-size:14px;padding:0 6px;border-bottom:1px #ccc solid;">{#}. {UnitName}</td>
        </tr>
        <tr >
        <td style="min-height:30px;padding:0 6px 6px 6px;vertical-align:top;">
        <div style="height:100%;line-height:22px;margin:8px 0;">
        <span style="font-weight:700;">{ExecutorName}</span>
        <span style="color:#999">({ExecutorDeptName})</span>：
        <span style="color:#f60">{Result}  </span>
        <span  style="line-height:1.5em;color:#333">{Remark}</span>
        <span style="float:right;color:#999">{EndTimeStr}</span>
        </div>
        </td>
        </tr>

        </table>
        </tpl>
      
			
		</Html>
                    </Template>
                  </gtp:DataView>
                </Items>
              </gtp:Panel>
              <gtp:Panel runat="server" ID="tabView_fs" Title="抄送处理记录" Layout="fit" Border="false" meta:resourcekey="res_5_tabView_fs">
                <Items>
                  <gtp:GridPanel ID="gridView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="MessageTraceQuery" AutoCellSizeMode="None" meta:resourcekey="res_6_gridView">
                    <BottomBar>
                      <gtp:PagingToolbar ID="gridView_toolbar" runat="server" EnableOverflow="true">
                      </gtp:PagingToolbar>
                    </BottomBar>
                    <ColumnModel runat="server">
                      <Columns>
                        <gtp:TextColumn ColumnID="col_ExecutorName" Align="Left" DataIndex="ExecutorName" Header="执行者名称" Editable="false" meta:resourcekey="res_7_col_ExecutorName">
                        </gtp:TextColumn>
                        <gtp:DateColumn ColumnID="col_EndTime" Align="Right" DataIndex="EndTime" Header="结束时间" Editable="false" meta:resourcekey="res_8_col_EndTime">
                        </gtp:DateColumn>
                        <gtp:TextColumn ColumnID="col_Result" Align="Left" DataIndex="Result" Header="处理结果" Width="200" Editable="false" meta:resourcekey="res_9_col_Result">
                        </gtp:TextColumn>
                        <gtp:TextColumn ColumnID="col_Remark" Align="Left" DataIndex="Remark" Header="意见" Width="200" Editable="false" meta:resourcekey="res_10_col_Remark">
                        </gtp:TextColumn>
                        <gtp:TextColumn ColumnID="col_CreatorName" Align="Left" DataIndex="CreatorName" Header="提交人名称" Editable="false" meta:resourcekey="res_11_col_CreatorName">
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
              <gtp:Panel runat="server" ID="tabView_tab1" Title="处理轨迹" Layout="fit" Border="false" meta:resourcekey="res_12_tabView_tab1">
                <Items>
                  <gtp:Panel runat="server" ID="customView" ContentEl="customView_Content">
                  </gtp:Panel>
                </Items>
              </gtp:Panel>
            </Items>
            <Listeners>
              <BeforeTabChange Handler="tabView_BeforeTabChange" />
            </Listeners>
          </gtp:TabPanel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Viewport>

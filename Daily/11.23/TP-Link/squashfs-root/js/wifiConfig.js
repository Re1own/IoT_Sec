!function(a){var b,c,d,e,f=!1;define(function(require,a,g){b=require("jsCore/pageBase"),c=require("jsCore/rpc"),d=require("jsCore/ability"),e=require("common/common").Check,g.exports=require("jsCore/pageTab"),g.exports.prototype.wifi_wifi=d.get("AroudWifiSearch").then(function(a){return!a||!a.Support}),g.exports.prototype.wifi_search=d.get("AroudWifiSearch").then(function(a){return a&&(AWSCaps=a),!(!a||!a.Support)}),g.exports.prototype.wifi_devinfo=g.exports.prototype.wifi_localinfo=g.exports.prototype.wifi_facinfo=d.get("AroudWifiSearch").then(function(a){return a&&(AWSCaps=a),!(!a||!a.Support||-1!==webApp.DeviceType.indexOf("SD"))}),g.exports.prototype.wifi_wps=d.get("SupportedWPS"),g.exports.prototype.wifi_ap=d.get("Industry").then(function(a){return f="AIO"==a}),g.exports.prototype.wifi_passwordcracking=d.get("AroudWifiSearch").then(function(a){return!(!a||!a.SupportWifiPsdDecrypt)})}),define("wifi_wifi",function(require,d,e){function g(a,b,c){switch("add"+a+b){case"add00":return c?tl("com.None"):"Off";case"add01":return"WEP-OPEN";case"add11":return c?tl("WEP-SHARE"):"WEP-SHARED";case"add32":return"WPA-PSK-TKIP";case"add33":return c?tl("WPA-PSK-AES"):"WPA-PSK-CCMP";case"add34":return c?tl("WPA-PSK-TKIP+AES"):"WPA-PSK-TKIP";case"add52":return"WPA2-PSK-TKIP";case"add53":return"WPA2-PSK-AES";case"add54":return c?tl("WPA2-PSK-TKIP+AES"):"WPA2-PSK-TKIP";case"add42":return"WPA2-TKIP";case"add73":return c?tl("WPA/WPA2-PSK-AES"):"WPA2-PSK-AES";case"add74":return c?tl("WPA/WPA2-PSK-TKIP+AES"):"WPA2-PSK-TKIP";case"add72":return c?tl("WPA/WPA2-PSK-TKIP"):"WPA2-PSK-TKIP";default:return c?tl("UNKNOWN"):"Off"}}function h(a){m.data(a),m.dialog("title",tl("net.Connecto")+" "+a.SSID),m.find("#conctTo_sigQua").text(a.LinkQuality+"%"),m.find("#conctTo_authMode").text(g(a.AuthMode,a.EncrAlgr,!0)),m.find("#conctTo_pswInput").val(""),m.dialog("show"),0===a.AuthMode&&0===a.EncrAlgr?(m.find("#conctTo_pswIndex").parent().hide(),m.find("#conctTo_pswInput").parent().hide()):1===a.EncrAlgr?(m.find("#conctTo_pswIndex").parent().show(),m.find("#conctTo_pswInput").focus().next("span").hide().parent().show()):(m.find("#conctTo_pswIndex").parent().hide(),m.find("#conctTo_pswInput").focus().next("span").hide().parent().show())}var i,j,k,l,m,n,o,p,q,r,s,t=null,u=null,v=!1,w=null,x=require("common/common"),y=require("common/rpcBase");e.exports=b.extend({init:function(){var b=this;i=b.$("#wifi_enable").click(function(c){var d=a(c.target).prop("checked");f&&d&&w.eth2.ssid.Enable&&b.$("#confilctTip").tip("warning",tl("com.WIFIConfilctAPTip")),b._onEnable(d)}),o=b.$("#wifi_curPoint"),p=b.$("#wifi_status"),q=b.$("#wifi_ip"),r=b.$("#wifi_submask"),s=b.$("#wifi_defGway"),j=b.$("#wifi_table").table({height:180,reSelectRow:!0,columns:[{width:"10%",render:function(a){return'<input name="indexColumn" type="radio" disabled '+(2===a.ApConnected?"checked":"")+"/>"}},{title:tl("net.SSID"),width:"15%",render:function(a){return a.SSID.replace(/</g,"&#60;").replace(/>/g,"&#62;").replace(/ /g,"&nbsp;")}},{fields:"LinkMode",title:tl("net.Connectmode"),width:"15%",valueMap:{0:tl("com.Auto"),1:tl("Adhoc"),2:tl("com.Infrastructure")}},{title:tl("AuthMode"),width:"40%",render:function(a){return g(a.AuthMode,a.EncrAlgr,!0)}},{title:tl("itc.SignalQality"),width:"10%",render:function(a){var b=0;return 0<a.LinkQuality&&a.LinkQuality<20?b=1:20<=a.LinkQuality&&a.LinkQuality<40?b=2:40<=a.LinkQuality&&a.LinkQuality<60?b=3:60<=a.LinkQuality&&a.LinkQuality<80?b=4:80<=a.LinkQuality&&a.LinkQuality<=100&&(b=5),'<i class="wifi-sign-icon'+b+'"></i>'}}],onRowSelect:function(a,b){v||h(b.data)}}),k=b.$("#dlg_addWifi").dialog({confirm:function(){b._onAddWifi()}}).detach().appendTo(document.body),l=k.find("#addWifi_SSID").keydown(function(a){13===a.which&&b._onAddWifi()}).textfield({length:35,showLengthError:!0}),m=b.$("#dlg_conctTo").dialog({confirm:function(){b._onConctTo()}}).detach().appendTo(document.body),n=m.find("#conctTo_pswInput").keydown(function(a){13===a.which&&b._onConctTo()}).textfield(),b.render()},destory:function(){k.remove(),m.remove()},render:function(){var a=this;c.ConfigManager.getConfig("AccessPoint").done(function(b){w=b,c.ConfigManager.getConfig("WLan").done(function(b){t=b,i.prop("checked",t.eth2.Enable),t.eth2.Enable?a._scanWLanDevices():(a.disabled("[btn-for=onRefresh],[btn-for=onAddWifi]",!0),j.table("dataSource",[]),a._renderWlanInfo())})})},leave:function(){clearTimeout(u),u=null},onRefresh:function(){var a=this;return a._scanWLanDevices(),!1},_onEnable:function(a){var b=this;t.eth2.Enable=a,i.prop("disabled",!0);var d=["WLan"],e=[t],g=[y.data("configManager.setConfig",{name:"WLan",table:t})];if(a&&f&&w){w.eth2.ssid.Enable=!1;var h=y.data("configManager.setConfig",{name:"AccessPoint",table:w});d.push("AccessPoint"),e.push(w),g.push(h)}webApp.EncryptInfo&&webApp.EncryptInfo.asymmetric?c.System.multiSec(g).done(function(){b._showWlanList(a),i.prop("disabled",!1)}).fail(function(){c.ConfigManager.setConfig(d,e).done(function(c){x.chkMutilCallRet(c)?b._showWlanList(a):b.tip("error","com.SaveConfigFailTip"),i.prop("disabled",!1)})}):c.ConfigManager.setConfig(d,e).done(function(c){x.chkMutilCallRet(c)?b._showWlanList(a):b.tip("error","com.SaveConfigFailTip"),i.prop("disabled",!1)})},_showWlanList:function(a){var b=this;a?b._scanWLanDevices():(b.disabled("[btn-for=onRefresh],[btn-for=onAddWifi]",!0),j.table("dataSource",[]),b._renderWlanInfo(),b.tip("success","com.SaveSuccessTip"))},onAddWifi:function(){k.dialog("show"),k.find("#addWifi_SSID").val("").focus()},_onAddWifi:function(){var a=this,b=k.find("#addWifi_SSID").val();k.dialog("close"),""===b||"*"===b?a._scanWLanDevices():(a.disabled("[btn-for=onRefresh],[btn-for=onAddWifi]",!0),v=!0,a.tip("warning","com.SearchingTip",-1),c.NetApp.scanWLanDevices("eth2",b).done(function(b){b&&b.length>=1&&h(b[0]),a.tip("warning","com.SearchingTip",0)}).fail(function(){a.tip("error","com.SSIDNotExistTip")}).always(function(){a.disabled("[btn-for=onRefresh],[btn-for=onAddWifi]",!1),v=!1}))},_onConctTo:function(){var b=this,d=m.data(),e=t.eth2,f=m.find("#conctTo_pswInput"),h=f.val(),i=h.length;if(0===d.AuthMode&&0===d.EncrAlgr)e.Keys=["","","",""];else if(1===d.EncrAlgr){if(5!==i&&10!==i&&13!==i&&26!==i&&32!==i)return void f.next("span").show();e.Keys=["","","",""],e.KeyID=m.find("#conctTo_pswIndex").val()-0,e.Keys[e.KeyID]=h}else{if(7>=i||i>=65)return void f.next("span").show();e.Keys=["","","",""],e.Keys[0]=h}e.SSID=d.SSID,0===d.LinkMode?e.LinkMode="Auto":1===d.LinkMode?e.LinkMode="Ad-hoc":2===d.LinkMode&&(e.LinkMode="Infrastructure"),e.Encryption=g(d.AuthMode,d.EncrAlgr),e.ConnectEnable=!0,e.KeyFlag=!0,m.dialog("close"),c.ConfigManager.setConfig("WLan",t).done(function(){b.tip("success","com.SaveSuccessTip"),b._scanWLanDevices()}).fail(function(c){c.params&&a.isArray(c.params.options)&&-1!==a.inArray("ValidateFailed",c.params.options)?b.tip("error","com.ConnectFailTip"):b.tip("error","com.SaveConfigFailTip")})},_scanWLanDevices:function(){var b=this;b.disabled("[btn-for=onRefresh],[btn-for=onAddWifi]",!0),v=!0,b.tip("warning","com.SearchingTip",-1),c.NetApp.scanWLanDevices("eth2").done(function(c){j.table("dataSource",c),b._getWlanInfo(function(b){a.each(c,function(a,c){c.SSID===b&&(c.ApConnected=2)}),j.table("dataSource",c)})}).always(function(){b.disabled("[btn-for=onRefresh],[btn-for=onAddWifi]",!1),v=!1,b.tip("warning","com.SearchingTip",0)})},_getWlanInfo:function(b){var d=this,e=arguments.callee;c.NetApp.getNetInterfaces().done(function(c){a.each(c,function(a,c){return"eth2"===c.Name?(d._renderWlanInfo(c),"Connecting"===c.ConnStatus?(clearTimeout(u),u=setTimeout(function(){e.call(d,b)},5e3)):"Connected"===c.ConnStatus&&b(c.ApSSID),!1):void 0})})},_renderWlanInfo:function(a){function b(){q.text(""),r.text(""),s.text("")}return a?(o.text(a.ApSSID),""===a.ApSSID?(p.text(tl("net.Unconet")).removeClass("ui-tip-green").addClass("ui-tip-red"),b()):"Disconn"===a.ConnStatus?(p.text(tl("com.DisconetTip")).removeClass("ui-tip-green").addClass("ui-tip-red"),b()):"Connecting"===a.ConnStatus?(p.text(tl("com.ConnectingTip")).removeClass("ui-tip-red").addClass("ui-tip-green"),b()):void("Connected"===a.ConnStatus&&(p.text(tl("net.Connected")).removeClass("ui-tip-red").addClass("ui-tip-green"),c.ConfigManager.getConfig("Network").done(function(a){q.text(a.eth2.IPAddress),r.text(a.eth2.SubnetMask),s.text(a.eth2.DefaultGateway)}).fail(b)))):(o.text(""),p.text(""),b())}})}),define("wifi_wps",function(require,d,f){var g,h,i;f.exports=b.extend({init:function(){var b=this;g=b.$("#wps_ping").textfield(),h=b.$("#wps_ssid").textfield(),i=a.validator([{element:g,check:function(a){return e.number(a)&&8===a.length},errorMsg:"com.NullLimitePinTip",events:"keyup blur"},{element:h,check:e.require,errorMsg:"com.NullLimiteTip",events:"keyup blur"}],function(a){a.parent().translation()}),b.render()},render:function(){this._getStatus()},_getStatus:function(){var b=this,d=b.$("#wps_state");c.NetApp.getNetInterfaces().done(function(b){d.text(tl("net.Unconet")).removeClass("ui-tip-green").addClass("ui-tip-red"),a.each(b,function(a,b){return"eth2"===b.Name?(""===b.ApSSID?d.text(tl("net.Unconet")).removeClass("ui-tip-green").addClass("ui-tip-red"):"Disconn"===b.ConnStatus?d.text(tl("com.DisconetTip")).removeClass("ui-tip-green").addClass("ui-tip-red"):"Connecting"===b.ConnStatus?d.text(tl("com.ConnectingTip")).removeClass("ui-tip-red").addClass("ui-tip-green"):"Connected"===b.ConnStatus&&d.text(tl("net.Connected")).removeClass("ui-tip-red").addClass("ui-tip-green"),!1):void 0})}).fail(function(){d.text(tl("net.Unconet")).removeClass("ui-tip-green").addClass("ui-tip-red")})},onConnect:function(){var a=this,b=a.$("[wpstype]:checked").attr("wpstype")-0,d="",e="";if(2===b){if(i.isInvalid())return a.tip("warning",i.errorInfo[0].errorMsg);d=g.textfield("value"),e=h.textfield("value")}return c.NetApp.connectByWps(b,d,e).done(function(){a.tip("success","com.SaveSuccessTip")}).fail(function(){a.tip("error","com.SaveConfigFailTip")}),!1},onRefresh:function(){return this._getStatus(),!1}})}),define("wifi_ap",function(require,d,e){{var f,g,h;require("common/common")}e.exports=b.extend({init:function(){h=this,h.render(),h.$("#ap_ssid").textfield({charset:"utf-8",length:32}),h.$("#ap_pwd").textfield({charset:"utf-8",length:32})},render:function(b){a.when(c.ConfigManager.getConfig("AccessPoint"),c.ConfigManager.getConfig("WLan")).done(function(a,c){f=a,g=c,h._renderElement(),b&&h.tip("success","com.OperateSuccessTip")}).fail(function(){b&&h.tip("error","com.OperateFailTip")})},_renderElement:function(){var a=f.eth2.ssid;h.$("#ap_enable").prop("checked",a.Enable),h.$("#ap_ssid").textfield("value",a.SSID),h.$("#ap_pwd").textfield("value",a["WPA PSK"].Password)},onDefault:function(){c.ConfigManager.getDefault("AccessPoint").done(function(a){f=a,h._renderElement(),h.tip("success",tl("com.DefaultSuccessTip"))}).fail(function(){h.tip("error",tl("com.DefaultfailureTip"))})},onRefresh:function(){h.render(!0)},onConfirm:function(){var a=f.eth2.ssid;a.Enable=h.$("#ap_enable").prop("checked"),a.SSID=h.$("#ap_ssid").textfield("value"),a["WPA PSK"].Password=h.$("#ap_pwd").textfield("value"),a.Enable&&(g.eth2.Enable=!1),c.ConfigManager.setConfig("WLan",g).done(function(){c.ConfigManager.setConfig("AccessPoint",f).done(function(){h.tip("success","com.SaveSuccessTip")}).fail(function(){h.tip("error","com.SaveConfigFailTip")})}).fail(function(){h.tip("error","com.SaveConfigFailTip")})},onCheck:function(b){var c=a(b.target).prop("checked");c&&g.eth2.Enable&&h.tip("warning","com.APConfilctWIFITip")}})}),define("wifi_search",function(require,b,d){var e,f=require("jsCore/pageBase"),g=(require("common/common"),{}),h=null,i=null,j=[],k=20,l=1,m=null,n=null,o=0;d.exports=f.extend({init:function(){if(e=this,m=e.$("#searchWifi_period").numberfield(),AWSCaps&&AWSCaps.Support){AWSCaps.ChannelChoose?(e.$('[name="wifi_radio"]').parent().show(),e.$('[name="wifi_radio"]').on("click",function(){var b=[];"2.4G+5.8G"===a(this).val()?b=a(this).val().split("+"):b.push(a(this).val()),g.InfoChannels=b})):e.$('[name="wifi_radio"]').parent().remove();var b=AWSCaps.NotifyPeriod;b&&(m.numberfield({min:b[0],max:b[1],allowDecimal:!1,allowNegative:!1}),e.$(".span").removeClass("fn-hide"),e.$("#period_0").text(b[0]),e.$("#period_1").text(b[1])),AWSCaps.OptimizationPeriod&&e.$("#optimization_wrap").removeClass("fn-hide")}else e.$('[name="wifi_radio"]').parent().remove();-1!==webApp.DeviceType.indexOf("SD")&&(e.$("#mac_wrap").removeClass("fn-hide"),a("li[data-for=wifi_history]").show()),h=e.$("#optimization_enable_on"),i=e.$("#optimization_enable_off"),e.$("input[id^=optimization_enable_]").click(e.onRadio),$table=e.$("#mac_wrap").table({height:480,pageSize:k,pageable:!0,columns:[{title:tl("com.Numbers"),width:"8%",render:function(a){return 20*o+a._index+1}},{title:tl("Mac"),width:"14%",render:function(a){return a.Mac}},{title:tl("pfm.WirelessSSID"),width:"20%",render:function(a){return a.SSID}},{title:tl("ivs.EnterTime"),width:"14%",render:function(a){return a.EnterTime}},{title:tl("ivs.LeaveTime"),width:"14%",render:function(a){return a.LeaveTime}},{title:tl("sys.Authmethod"),width:"10%",render:function(a){return a.Auth}},{title:tl("AuthMode"),width:"10%",render:function(a){return a.Encrypt}},{title:tl("itc.SignalQality"),width:"8%",render:function(a){var b=0;return 0<a.nLinkQuality&&a.nLinkQuality<20?b=1:20<=a.nLinkQuality&&a.nLinkQuality<40?b=2:40<=a.nLinkQuality&&a.nLinkQuality<60?b=3:60<=a.nLinkQuality&&a.nLinkQuality<80?b=4:80<=a.nLinkQuality&&a.nLinkQuality<=100&&(b=5),'<i class="wifi-sign-icon'+b+'"></i>'}}]});var c=e.$("#mac_wrap .u-table-foot");c&&c.addClass("fn-textcenter"),e.render();var d=e.$("#mac_wrap .u-table-foot .u-pagination").children().hide(),f=d.eq(1).show(),j=(d.eq(2).replaceWith('<input type="text" class="u-page-info fn-width40 fn-textcenter" id="wifi_currentPage" disabled="disabled">').show(),d.eq(3).show());n=e.$("#wifi_currentPage").numberfield(),f.on("click",e._prePage),j.on("click",e._nextPage)},render:function(){plugin.addEvent("OutPutWifiInfo",function(a,b){$table.table("dataSource",[]),o=0,b=JSON.parse(b),b&&(j=b.WifiData),$table.table("dataSource",j||[]),e.$("#wifi_currentPage").numberfield("value",1)}),e._getConfig(!1)},_getConfig:function(a){c.ConfigManager.getConfig("AroudWifiSearch").done(function(b){g=b[0]||{},e._renderElement(),a&&e.tip("success","com.OperateSuccessTip")}).fail(function(){a&&e.tip("error","com.OperateFailTip")})},_renderElement:function(){e.$("#searchWifi_enable").prop("checked",g.Enable),m.numberfield("value",g.Period||10),g.OptimizNotification?h.prop("checked",!0):i.prop("checked",!0),g.InfoChannels&&g.InfoChannels.length>0&&(2===g.InfoChannels.length?e.$('[value="2.4G+5.8G"]').prop("checked",!0):e.$('[value="2.4G"]').prop("checked",!0)),g.Enable?a("#ocx")[0]&&a("#ocx")[0].startWifiScan(1):a("#ocx")[0]&&a("#ocx")[0].StopWifiScan(1)},_prePage:function(){if(l=n.numberfield("value")-1,!(l>0))return o=0,void e.$("#wifi_currentPage").numberfield("value",1);o=l-1,$table.table("dataSource",[]);var b=a("#ocx")[0]&&a("#ocx")[0].GetWifiInfoByPage(l);b=JSON.parse(b)&&JSON.parse(b).WifiData,$table.table("dataSource",b),e.$("#wifi_currentPage").numberfield("value",l)},_nextPage:function(){if(!(b&&b.length<20)){l=n.numberfield("value")+1,o=l-1;var b=a("#ocx")[0]&&a("#ocx")[0].GetWifiInfoByPage(l);b=JSON.parse(b)&&JSON.parse(b).WifiData,b&&b.length>0&&($table.table("dataSource",[]),$table.table("dataSource",b),e.$("#wifi_currentPage").numberfield("value",l))}},onRadio:function(){var a=h.is(":checked"),b=i.is(":checked");a&&(g.OptimizNotification=!0),b&&(g.OptimizNotification=!1)},leave:function(){plugin.addEvent("OutPutWifiInfo",null)},onMacWifiDefault:function(){c.ConfigManager.getDefault("AroudWifiSearch").done(function(a){g=a[0]||{},e._renderElement(),e.tip("success",tl("com.DefaultSuccessTip"))}).fail(function(){e.tip("error",tl("com.DefaultfailureTip"))})},onMacWifiRefresh:function(){e._getConfig(!0)},onMacWifiConfirm:function(){e.disabled("[btn-for = onMacWifiConfirm]",!0),e.tip("warning","com.LoadingTip",-1),g.Enable=e.$("#searchWifi_enable").prop("checked"),g.Period=m.numberfield("value")||10,c.ConfigManager.setConfig("AroudWifiSearch",[g]).done(function(){e.tip("success","com.SaveSuccessTip")}).fail(function(){e.tip("error","com.SaveConfigFailTip")}).always(function(){e.disabled("[btn-for = onMacWifiConfirm]",!1)}),e.$("#searchWifi_enable").prop("checked")?a("#ocx")[0]&&a("#ocx")[0].startWifiScan(1):a("#ocx")[0]&&a("#ocx")[0].StopWifiScan(1)}})}),define("wifi_history",function(require,b,c){function d(){for(var a=e.$(".wifi-path-input"),b=null,c=0,d=a.length;d>c;c++){if(b=a[c],""===b.value)return e.tip("error","com.PathErrorsTip"),!1;if(b.value=b.value.replace(/\s+[\\\\]/g,"\\").replace(/[\\\\]\s+/g,"\\"),b.value.lengthB()>200)return void e.tip("error","com.PathLongTip")}return!0}{var e,f=require("jsCore/pageBase");require("common/common")}c.exports=f.extend({init:function(){e=this,e.render()},render:function(){plugin.GetConfigPath("AroudWifiSearch").done(function(a){e.$("#path_AroudWifiSearch").val(a)})},onChoosePath:function(b){var c=a(b.target).attr("data-target");plugin.ShowFileBrowse().done(function(a){c&&e.$("#path_"+c).val(a)})},onHistoryWifiDefault:function(){plugin.GetDefaultConfigPath("AroudWifiSearch").done(function(a){e.$("#path_AroudWifiSearch").val(a)}),e.tip("success","com.DefaultSuccessTip")},onHistoryWifiConfirm:function(){d()&&(plugin.SetConfigPath("AroudWifiSearch",e.$("#path_AroudWifiSearch").val()),e.tip("success","com.SaveSuccessTip"))}})}),define("wifi_devinfo",function(require,b,d){var e,f=require("jsCore/pageBase"),g=(require("common/common"),{});d.exports=f.extend({init:function(){e=this,e.$("#wifi_DevIP").ipfield(),e.$("#wifi_SiteNum,#wifi_DevNum,#wifi_DevName,#wifi_DevAddr,#wifi_devSecCompanyCode,#wifi_CarNum,#wifi_MetroLineInfo,#wifi_MetroVehicleInfo,#wifi_MetroCarNum").textfield({validReg:/^[^\'\"]*$/,validRegRet:!0,errorHandle:"prevent"}),e.$("#wifi_UploadInterval,#wifi_CapRadius").numberfield(),e.$("#wifi_DevLongitude,#wifi_DevLatitude").numberfield({decimalPrecision:5}),e.render()},render:function(){e._getConfig(!1)},_getConfig:function(a){c.ConfigManager.getConfig("AroudWifiDevInfo").done(function(b){g=b[0]||{},e._renderElement(),a&&e.tip("success","com.OperateSuccessTip")}).fail(function(){a&&e.tip("error","com.OperateFailTip")})},_renderElement:function(){e.$("#wifi_SiteNum").textfield("value",g.SiteNum),e.$("#wifi_DevNum").textfield("value",g.DevNum),e.$("#wifi_DevName").textfield("value",g.DevName),e.$("#wifi_DevAddr").textfield("value",g.DevAddr),e.$("#wifi_DevType").val(g.DevType),e.$("#wifi_devSecCompanyCode").textfield("value",g.SecCompanyCode),e.$("#wifi_DevLongitude").numberfield("value",g.DevLongitude),e.$("#wifi_DevLatitude").numberfield("value",g.DevLatitude),e.$("#wifi_UploadInterval").numberfield("value",g.UploadInterval),e.$("#wifi_CapRadius").numberfield("value",g.CapRadius),e.$("#wifi_CarNum").textfield("value",g.CarNum),e.$("#wifi_MetroLineInfo").textfield("value",g.MetroLineInfo),e.$("#wifi_MetroVehicleInfo").textfield("value",g.MetroVehicleInfo),e.$("#wifi_MetroCarNum").textfield("value",g.MetroCarNum);var b="",c=[];0===g.DevIP||g.DevIP<16777217?b="1.0.0.1":(b=g.DevIP.toString(16).toUpperCase(),c.unshift(b.substr(-2,2)),c.unshift(b.substr(-4,2)),c.unshift(b.substr(-6,2)),c.unshift(b.length<8?b.substr(-8,1):b.substr(-8,2)),a.each(c,function(a){c[a]=("0x"+c[a]-0).toString(10)}),b=c[0]+"."+c[1]+"."+c[2]+"."+c[3]),e.$("#wifi_DevIP").ipfield("value",b)},onWifiDefault:function(){c.ConfigManager.getDefault("AroudWifiDevInfo").done(function(a){g=a[0]||{},e._renderElement(),e.tip("success",tl("com.DefaultSuccessTip"))}).fail(function(){e.tip("error",tl("com.DefaultfailureTip"))})},onWifiRefresh:function(){e._getConfig(!0)},onWifiConfirm:function(){g.SiteNum=e.$("#wifi_SiteNum").textfield("value"),g.DevNum=e.$("#wifi_DevNum").textfield("value"),g.DevName=e.$("#wifi_DevName").textfield("value"),g.DevAddr=e.$("#wifi_DevAddr").textfield("value"),g.DevType=e.$("#wifi_DevType").val()-0,g.SecCompanyCode=e.$("#wifi_devSecCompanyCode").textfield("value"),g.DevLongitude=""+Number(e.$("#wifi_DevLongitude").val()).toFixed(5),g.DevLatitude=""+Number(e.$("#wifi_DevLatitude").val()).toFixed(5),g.UploadInterval=e.$("#wifi_UploadInterval").numberfield("value"),g.CapRadius=e.$("#wifi_CapRadius").numberfield("value"),g.CarNum=e.$("#wifi_CarNum").textfield("value"),g.MetroLineInfo=e.$("#wifi_MetroLineInfo").textfield("value"),g.MetroVehicleInfo=e.$("#wifi_MetroVehicleInfo").textfield("value"),g.MetroCarNum=e.$("#wifi_MetroCarNum").textfield("value");var b,d=e.$("#wifi_DevIP").ipfield("value"),f=d.split(".");a.each(f,function(a){b=(f[a]-0).toString(16).toUpperCase(),f[a]=1===b.length?0+b:b}),d=f[0]+f[1]+f[2]+f[3],g.DevIP=("0x"+d-0).toString(10)-0,c.ConfigManager.setConfig("AroudWifiDevInfo",[g]).done(function(){e.tip("success","com.SaveSuccessTip")}).fail(function(){e.tip("error",tl("com.SaveConfigFailTip"))})}})}),define("wifi_localinfo",function(require,a,b){var d,e=require("jsCore/pageBase"),f=(require("common/common"),{});b.exports=e.extend({init:function(){d=this,d.$("#wifi_NetSiteNum,#wifi_NetSiteName,#wifi_NetSiteAddr,#wifi_NetDocNum,#wifi_NetLegalPerson,#wifi_NetDocType,#wifi_NetConnection,#wifi_NetCompanyCode,#wifi_NetBusinessBeg,#wifi_NetBusinessEnd").textfield({validReg:/^[^\'\"]*$/,validRegRet:!0,errorHandle:"prevent"}),d.$("#wifi_NetSiteLongitude,#wifi_NetSiteLatitude").numberfield(),d.$("#wifi_NetDocNum").textfield({type:"alphaNum",validRegRet:!0,errorHandle:"prevent"}),d.render()},render:function(){d._getConfig(!1)},_getConfig:function(a){c.ConfigManager.getConfig("AroudWifiLocationInfo").done(function(b){f=b[0]||{},d._renderElement(),a&&d.tip("success","com.OperateSuccessTip")}).fail(function(){a&&d.tip("error","com.OperateFailTip")})},_renderElement:function(){d.$("#wifi_NetSiteNum").textfield("value",f.NetSiteNum),d.$("#wifi_NetSiteName").textfield("value",f.NetSiteName),d.$("#wifi_NetSiteAddr").textfield("value",f.NetSiteAddr),d.$("#wifi_NetSiteLongitude").numberfield("value",f.NetSiteLongitude),d.$("#wifi_NetSiteLatitude").numberfield("value",f.NetSiteLatitude),d.$("#wifi_NetDocNum").textfield("value",f.NetDocNum),d.$("#wifi_NetSiteType").val(f.NetSiteType),d.$("#wifi_NetSiteProp").val(f.NetSiteProp),d.$("#wifi_NetLegalPerson").textfield("value",f.NetLegalPerson),d.$("#wifi_NetDocType").textfield("value",f.NetDocType),d.$("#wifi_NetConnection").textfield("value",f.NetConnection),d.$("#wifi_NetCompanyCode").textfield("value",f.NetCompanyCode),d.$("#wifi_NetBusinessBeg").textfield("value",f.NetBusinessBeg),d.$("#wifi_NetBusinessEnd").textfield("value",f.NetBusinessEnd)},onWifiDefault:function(){c.ConfigManager.getDefault("AroudWifiLocationInfo").done(function(a){f=a[0]||{},d._renderElement(),d.tip("success",tl("com.DefaultSuccessTip"))}).fail(function(){d.tip("error",tl("com.DefaultfailureTip"))})},onWifiRefresh:function(){d._getConfig(!0)},onWifiConfirm:function(){f.NetSiteNum=d.$("#wifi_NetSiteNum").textfield("value"),f.NetSiteName=d.$("#wifi_NetSiteName").textfield("value"),f.NetSiteAddr=d.$("#wifi_NetSiteAddr").textfield("value"),f.NetSiteLongitude=d.$("#wifi_NetSiteLongitude").val(),f.NetSiteLatitude=d.$("#wifi_NetSiteLatitude").val(),f.NetDocNum=d.$("#wifi_NetDocNum").textfield("value"),f.NetSiteType=d.$("#wifi_NetSiteType").val(),f.NetSiteProp=d.$("#wifi_NetSiteProp").val(),f.NetLegalPerson=d.$("#wifi_NetLegalPerson").textfield("value"),f.NetDocType=d.$("#wifi_NetDocType").textfield("value"),f.NetConnection=d.$("#wifi_NetConnection").textfield("value"),f.NetCompanyCode=d.$("#wifi_NetCompanyCode").textfield("value"),f.NetBusinessBeg=d.$("#wifi_NetBusinessBeg").textfield("value"),f.NetBusinessEnd=d.$("#wifi_NetBusinessEnd").textfield("value"),c.ConfigManager.setConfig("AroudWifiLocationInfo",[f]).done(function(){d.tip("success","com.SaveSuccessTip")}).fail(function(){d.tip("error",tl("com.SaveConfigFailTip"))})}})}),define("wifi_facinfo",function(require,b,d){var f,g=require("jsCore/pageBase"),h=(require("common/common"),{});d.exports=g.extend({init:function(){f=this,f.$("#wifi_SecCompanyName,#wifi_facSecCompanyCode,#wifi_SecCompanyAddr,#wifi_SecCompanyContacts").textfield({validReg:/^[^\'\"]*$/,validRegRet:!0,errorHandle:"prevent"}),f.$("#wifi_Phone").numberfield(),f.$("#wifi_Email").textfield({type:"email",validRegRet:!0,error:function(b){a(b.target).nextAll(".u-input-error").eq(0).show()}}),f.render()},render:function(){f._getConfig(!1)},_getConfig:function(a){c.ConfigManager.getConfig("AroudWifiFactoryInfo").done(function(b){h=b[0]||{},f._renderElement(),a&&f.tip("success","com.OperateSuccessTip")}).fail(function(){a&&f.tip("error","com.OperateFailTip")})},_renderElement:function(){f.$("#wifi_SecCompanyName").textfield("value",h.SecCompanyName),f.$("#wifi_facSecCompanyCode").textfield("value",h.SecCompanyCode),f.$("#wifi_SecCompanyAddr").textfield("value",h.SecCompanyAddr),f.$("#wifi_SecCompanyContacts").textfield("value",h.SecCompanyContacts),f.$("#wifi_Phone").numberfield("value",h.Phone),f.$("#wifi_Email").textfield("value",h.Email)},onWifiDefault:function(){c.ConfigManager.getDefault("AroudWifiFactoryInfo").done(function(a){h=a[0]||{},f._renderElement(),f.tip("success",tl("com.DefaultSuccessTip"))}).fail(function(){f.tip("error",tl("com.DefaultfailureTip"))})},onWifiRefresh:function(){f._getConfig(!0)},onWifiConfirm:function(){return h.SecCompanyName=f.$("#wifi_SecCompanyName").textfield("value"),h.SecCompanyCode=f.$("#wifi_facSecCompanyCode").textfield("value"),h.SecCompanyAddr=f.$("#wifi_SecCompanyAddr").textfield("value"),h.SecCompanyContacts=f.$("#wifi_SecCompanyContacts").textfield("value"),h.Phone=f.$("#wifi_Phone").numberfield("value"),h.Email=f.$("#wifi_Email").textfield("value"),""===h.Email||e.email(h.Email)?void c.ConfigManager.setConfig("AroudWifiFactoryInfo",[h]).done(function(){f.tip("success","com.SaveSuccessTip")}).fail(function(){f.tip("error",tl("com.SaveConfigFailTip"))}):(f.tip("warning","com.WrongEmailFormatTip"),!1)}})}),define("wifi_passwordcracking",function(require,b,c){function d(a){var b=r[a];l.EventManager.attach(b.events).done(function(a){b.sid=a})}function e(a){var b=r[a];l.EventManager.detach(b.sid,b.events)}function f(a){if(a.SID===r.WifiCheck.sid){for(var b=[],c=0;c<a.eventList.length;c++)for(var d=a.eventList[c].Data.DecryptInfo,e=0;e<d.length;e++)b.push(d[e]);for(var f=0;f<n.length;f++)for(var g=0;g<b.length;g++)n[f].APSSID===b[g].APSSID&&(n[f].CheckResult=b[g].CheckResult,b.splice(g,1));i.table("refresh")}}function g(){m.devNotify.reconnect(),d("WifiCheck")}var h,i,j,k=require("jsCore/pageBase"),l=require("jsCore/rpc"),m=require("common/common"),n=[],o="add",p=null,q=0,r={WifiCheck:{events:["WifiCheck"],sid:-1}};c.exports=k.extend({init:function(){h=this,i=h.$("[name=routerList]").table({height:130,columns:[{t:"com.Numbers",width:"10%",render:function(a){return a._index+1}},{t:"com.Name+(SSID)",width:"40%",fields:"APSSID",limit:63,render:function(b){return a("<div></div>").text(b.APSSID).html()}},{t:"State",width:"30%",fields:"CheckResult",render:function(a){switch(a.CheckResult){case 0:return tl("com.Unknow");case 1:return tl("adv.NotNormal");case 2:return tl("Normal");default:return tl("com.Unknow")}}},{t:"com.Modify",width:"10%",action:"edit",icon:"i-edit",preventEvt:!0,handle:function(a){q=a._index,o="edit",j.dialog("title",tl("com.EditRouter")),j.find("[name=APSSID]").val(a.APSSID),j.find("[name=Password]").val(a.Password),p.reset(),p.validate(),j.dialog("show")}},{t:"com.Delete",width:"10%",action:"delete",icon:"i-del",preventEvt:!0,handle:function(b){var c=a.grep(this.options.dataSource,function(a){return a._index!==b._index});h.saveRouters(c).done(function(){i.table("del",b)}),n.length<20&&h.disabled('[btn-for="onAddRouter"]',!1)}}]}),j=h.$("[name=addRouterDlg]").dialog({confirm:function(){if(p.validate(),!p.isInvalid()){var b=j.find("[name=APSSID]").val(),c=j.find("[name=Password]").val(),d=[];switch(o){case"add":d=a.map(n,function(b){var c=a.extend(!0,{},b);return c}),d.push({APSSID:b,Password:c}),h.saveRouters(d).done(function(){i.table("add",{APSSID:b,Password:c},-1),n.length>=20&&h.disabled('[btn-for="onAddRouter"]')});break;case"edit":d=a.map(n,function(d){var e=a.extend(!0,{},d);return q===e._index&&(e.APSSID=b,e.Password=c),e}),h.saveRouters(d).done(function(){i.table("modify",{APSSID:b,Password:c},q)})}j.dialog("close")}}}).detach().appendTo(document.body),p=a.validator([{element:j.find("[name=APSSID]"),check:[function(b){return!!a.trim(b)},function(a){return a.length<32},function(a){return n.every(function(b){return"edit"===o&&b._index===q?!0:b.APSSID!==a})}],errorMsg:["com.Necessary","com.InputLenError","com.NameDuplication"],events:["blur","blur","blur","blur"],errorElem:".u-input-error"},{element:j.find("[name=Password]"),check:[function(b){return!!a.trim(b)},function(a){return 5===a.length||a.length>=8&&a.length<=63}],errorMsg:["com.Necessary","sys.AfreshPwdTip"],events:["blur","blur"],errorElem:".u-input-error"}],function(a){a.parent().translation()}),h.render()},render:function(){a.when(l.ConfigManager.getConfig("WifiPsdDecrypt"),l.AroudWifi.getApsInfoState()).done(function(a,b){for(var c=0;c<a.length;c++)for(var d=0;d<b.DecryptInfo.length;d++)if(a[c].APSSID===b.DecryptInfo[d].APSSID){a[c].CheckResult=b.DecryptInfo[d].CheckResult,b.DecryptInfo.splice(d,1);break}n=a||[],h.renderElements()}).fail(function(){n=[],h.tip("error","adv.acquireFailed")}),m.devNotify.subscribe("client.notifyEventStream",f),d("WifiCheck"),a.subscribe("RECONNECTION",g)},renderElements:function(){i.table("dataSource",n),h.disabled('[btn-for="onAddRouter"]',n.length>=20?!0:!1)},onAddRouter:function(){return n.length>=20?void h.tip("error","com.TempeAddMax"):(o="add",j.dialog("title",tl("com.AddRouter")),j.find("[name=APSSID]").val(""),j.find("[name=Password]").val(""),p.reset(),void j.dialog("show"))},saveRouters:function(b){return b=a.map(b,function(a){var b={};return b.APSSID=a.APSSID,b.Password=a.Password,void 0!==a.Encr&&(b.Encr=a.Encr),void 0!==a.BSSID&&(b.BSSID=a.BSSID),b}),l.ConfigManager.setConfig("WifiPsdDecrypt",b).done(function(){h.tip("success","com.OperateSuccessTip")}).fail(function(){h.tip("error","com.OperateFailTip")})},leave:function(){e("WifiCheck"),m.devNotify.detach("client.notifyEventStream",f),a.unsubscribe("RECONNECTION",g)}})})}(jQuery);
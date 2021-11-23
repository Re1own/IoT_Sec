!function(a){define(function(require,b,c){c.exports=require("jsCore/pageTab"),c.exports.prototype.gen_trigger=a.when(ability.get("VideoInputCaps"),ability.get("MultVideoSensor")).then(function(a,b){return b?b.Support:!(!a||!a.SubChannel)}),c.exports.prototype.gen_gps=ability.get("FireWarning").then(function(a){return a&&a.Support}),c.exports.prototype.gen_sleep=ability.get("SleepingControl").then(function(a){return a&&a.Support})}),define("gen_local",function(require,b,c){var d,e,f,g,h,i,j,k=require("jsCore/rpc"),l=require("jsCore/pageBase"),m=(require("jsCore/rpcLogin"),require("jsCore/ability")),n=require("common/common"),o=null,p=0,q=null,r=null,s=null,t=!1,u=null,v=!1,w=null,x=null,y=null,z=null,A=null,B=null,C=null,D="",E=!1,F=!1,G=!1,H=!1,I=!1,J={},K={Upright:"med.Upright",Inverted:"med.Inverted"};c.exports=l.extend({init:function(){o=this,q=k.DevVideoOutput.getCollect(),w=k.DevVideoOutput.enumModes(),a.when(q,m.is("TVOutConflict")).done(function(a,b){!b&&a&&(o.$("#gen_TVShow").show(),G=!0,m.get("CaptureSetResolution").done(function(a){A=a,A&&(o.$("#gen_simulate_resolution_wrap").removeClass("fn-hide"),o.$("#gen_TVShow").hide())})),v=b}),m.get("VideoOutControlMode").done(function(a){a&&a.Support&&o.$("#gen_tab_mode_wrap").removeClass("fn-hide")}),y=o.$("#gen_tab_mode"),x=o.$("#gen_tab_resolution_mode"),s=m.get("FaceBoardCaps").done(function(a){a&&a.StatusLightGlobal&&a.StatusLightGlobal.Support&&(o.$("#gen_LightShow").show(),t=!0)}),r=a.when(m.get("Languages"),m.get("VideoStandards")).done(function(b,c){var d=o.$("#gen_language").empty(),e=o.$("#gen_standard").empty();a.each(b,function(a,b){d.append("<option value="+b+" t="+b+"></option>")}),d.translation(),a.each(c,function(a,b){e.append("<option value="+b+" t=med."+b+"></option>")}),e.translation()}),j=a.validator([{element:o.$("#gen_devName"),check:[n.Check.alphaNumLine,n.Check.require],errorMsg:["com.WrongDeviceNameTip","com.WrongDeviceNameTip"],events:["keyup","keyup"],errorElem:".u-input-error"}],function(a){a.parent().translation()}),o.$("#gen_devNo").numberfield({max:998,min:0,allowDecimal:!1,allowNegative:!1}),o.$("#gen_LockTimes").numberfield({max:10,min:3,allowDecimal:!1,allowNegative:!1});var b=o.$("#gen_TVEnable").empty();w.done(function(c){a.each(c,function(a,c){var d="on";"Auto"!==c.Mode.Format&&(d=c.Mode.Format),b.append("<option value="+c.Mode.Format+" t="+d+"></option>")}),b.append('<option value="Off" t="com.Off"></option>').translation()}).fail(function(){b.append('<option value="Auto" t="on"></option><option value="Off" t="com.Off"></option>').translation()}).always(function(){b.get(0).selectedIndex=0}),x.empty(),w.done(function(b){B=b,A&&(x.append('<option value="Off" t="com.Off"></option>').translation(),a.each(b,function(a,b){var c="["+b.Mode.Format+"]["+b.Mode.Height+b.Mode.ScanFormat.slice(0,1)+"-"+b.Mode.RefreshRate+"FPS]";x.append("<option value="+c+">"+c+"</option>")}))}).fail(function(){x.append('<option value="Auto" t="on"></option><option value="Off" t="com.Off"></option>').translation()}),z=o.$("#gen_PlaceModeSel").empty(),m.get("VideoInputCapsEx").done(function(b){if(b&&b.VideoInConflict&&b.VideoInConflict.IsConflict&&a.each(b.VideoInConflict.ConflictTable,function(b,c){-1!==a.inArray("Extra2",c)&&-1!==a.inArray("TVOut",c)&&(E=!0),-1!==a.inArray("Stabilize",c)&&-1!==a.inArray("TVOut",c)&&(F=!0),3===c.length&&-1!==a.inArray("TVOut",c)&&-1!==a.inArray("WDR",c)&&-1!==a.inArray("Rotate_90",c)&&(H=!0)}),b&&b.DevPlaceMode&&b.DevPlaceMode.Support){o.$("#gen_DevPlaceMode").show();var c=b.DevPlaceMode.Mode;I=b.DevPlaceMode.Support,a.each(c,function(a,b){z.append("<option value="+b+" t="+K[b]+"></option>").translation()})}else o.$("#gen_DevPlaceMode").remove()}),o._bind();var c=a.Deferred(),d=a.Deferred(),e=a.Deferred(),f=a.Deferred();q.always(function(){c.resolve()}),s.always(function(){d.resolve()}),r.always(function(){e.resolve()}),w.always(function(){f.resolve()}),a.when(c,d,e,f).always(function(){o.render()})},_bind:function(){o.$("#gen_LockEnable").on("click",function(a){o.$(a.target).prop("checked")&&isEnable("is_show_WtchNtCustom")?o.$("#gen_LocktimesShow").show():o.$("#gen_LocktimesShow").hide()}),o.$("#gen_TVEnable").on("change",function(a){if("Off"!==o.$(a.target).val()){if(u.then(function(){o.tip("warning","com.TvOutConfilctIntellTip",4e3)}),E&&J.Extra2)return o.$(a.target).val("Off"),o.tip("warning","com.TVoutOpenFailWhenExtra2On"),!1;if(F&&J.Stable)return o.$(a.target).val("Off"),o.tip("warning","com.TVoutStableConflictTip"),!1;if(H&&J.WDRRotate)return o.$(a.target).val("Off"),o.tip("warning","com.TVOutRotateWDRSSA"),!1}}),o.$("#gen_PlaceModeSel").on("change",function(b){o.$(b.target).val()!==i[0].Mode&&a.confirm(tl("com.Ok"),tl("per.PtzRestartTip"),function(){},function(){o.$("#gen_PlaceModeSel").val(i[0].Mode)})})},render:function(){o._getConfig(),u=g_videoInConflict.TVOut.hasConflict();var b=[];if(G){if(E&&b.push("Encode"),(F||H)&&b.push("VideoImageControl"),H&&b.push("VideoInBacklight"),!b.length)return!1;k.ConfigManager.getConfig(b).done(function(c){a.each(c,function(c,d){var e=d.params.table;switch(b[c]){case"Encode":J.Extra2=e[p].ExtraFormat[1].VideoEnable;break;case"VideoImageControl":J.Stable=F&&e[p].Stable,J.WDRRotate=H&&e[p].Rotate90;break;case"VideoInBacklight":var f=!1;a.each(e[p],function(a,b){return"WideDynamic"===b.Mode||"SSA"===b.Mode?(f=!0,!1):void 0}),J.WDRRotate=J.WDRRotate&&f}})})}},_getConfig:function(a){var b=["General","Language","VideoStandard","VideoOut"];t&&b.push("LightGlobal"),k.ConfigManager.getConfig(b).done(function(b){b[0].result&&(d=b[0].params.table),b[1].result&&(e=b[1].params.table),b[2].result&&(f=b[2].params.table),b[3].result&&(g=b[3].params.table),b[4]&&b[4].result&&(h=b[4].params.table),o._renderElements(),a&&o.tip("success","com.OperateSuccessTip")}).fail(function(){a&&o.tip("error","com.OperateFailTip")}),I&&k.ConfigManager.getConfig("DevPlaceMode").done(function(a){i=a,o.$("#gen_PlaceModeSel").val(i[0].Mode)})},_renderElements:function(){o.$(".u-button").removeClass("ui-button-disabled"),o.disabled(o.$(".u-button"),!1),o.$("#gen_devName").val(d.MachineName),o.$("#gen_devNo").numberfield("value",d.LocalNo),o.$("#gen_language").val(e),-1!==webApp.DeviceType.indexOf("3110")?o.$("#gen_standard").empty().append("<option value="+f+" t="+f+"></option>").translation():o.$("#gen_standard").val(f),void 0!==d.LockLoginEnable&&isEnable("is_show_WtchNtCustom")&&(o.$("#gen_LockEnableShow").show(),o.$("#gen_LockEnable").prop("checked",d.LockLoginEnable)),d.LockLoginEnable&&isEnable("is_show_WtchNtCustom")?(o.$("#gen_LocktimesShow").show(),o.$("#gen_LockTimes").numberfield("value",d.LockLoginTimes)):o.$("#gen_LocktimesShow").hide(),q.done(function(a){a&&g&&!v&&(o.$("#gen_TVEnable").val(g[0].Enable?g[0].Mode&&g[0].Mode.Format?g[0].Mode.Format:"Auto":"Off"),A&&g[0].CurrentControlMode&&(y.val(g[0].CurrentControlMode).change(),C=y.val(),o.disabled(x,"software"!==g[0].CurrentControlMode),g[0].Enable?g[0].Mode&&g[0].Mode.Format&&x.val("["+g[0].Mode.Format+"]["+g[0].Mode.Height+g[0].Mode.ScanFormat.slice(0,1)+"-"+g[0].Mode.RefreshRate+"FPS]"):x.val("Off"),D=x.val()))}),h&&(h[0].Enable===!0?o.$("#gen_LightEnable").prop("checked",!0):o.$("#gen_LightdisEnable").prop("checked",!0)),j.validate()},onSelGenMode:function(){"software"===y.val()?(o.disabled(x,!1),o.disabled(o.$("#gen_standard"),!1)):"hardware"===y.val()&&(o.disabled(x,!0),o.disabled(o.$("#gen_standard"),!0)),g[0].CurrentControlMode=y.val()},onSelResMode:function(){var a=x.get(0).selectedIndex-1;a>-1&&A&&(g[0].Mode.Format=B[a].Mode.Format,g[0].Mode.Height=B[a].Mode.Height,g[0].Mode.Width=B[a].Mode.Width,g[0].Mode.RefreshRate=B[a].Mode.RefreshRate,g[0].Mode.ScanFormat=B[a].Mode.ScanFormat,g[0].Mode.BPP=B[a].Mode.BPP)},onRefresh:function(){o._getConfig(!0)},onDefault:function(){var b=["General","Language","VideoStandard","VideoOut"];t&&b.push("LightGlobal"),k.ConfigManager.getDefault(b).done(function(a){a[0].result&&(d=a[0].params.table),a[1].result&&(e=a[1].params.table),a[2].result&&(f=a[2].params.table),a[3].result&&!v&&(g=a[3].params.table,g[0].Enable&&u.then(function(){setTimeout(function(){o.tip("warning","com.TvOutConfilctIntellTip",4e3)},2e3)})),a[4]&&a[4].result&&(h=a[4].params.table),o._renderElements(),o.tip("success","com.DefaultSuccessTip"),E&&G&&J.Extra2&&setTimeout(function(){o.tip("warning","com.TVoutOpenFailWhenExtra2On",2e3),o.$("#gen_TVEnable").val("Off")},3e3),F&&G&&J.Stable&&setTimeout(function(){o.tip("warning","com.TVoutStableConflictTip",2e3),o.$("#gen_TVEnable").val("Off")},3e3),H&&G&&J.WDRRotate&&setTimeout(function(){o.tip("warning","com.TVOutRotateWDRSSA",2e3),o.$("#gen_TVEnable").val("Off")},3e3)}).fail(function(){o.tip("error","com.DefaultfailureTip")}),I&&k.ConfigManager.getDefault("DevPlaceMode").done(function(b){var c=o.$("#gen_PlaceModeSel").val();o.$("#gen_PlaceModeSel").val(b[0].Mode),c!==b[0].Mode&&a.confirm(tl("com.Ok"),tl("per.PtzRestartTip"),function(){},function(){o.$("#gen_PlaceModeSel").val(c)})})},onSave:function(){if(j.isInvalid())return o.tip("warning",j.errors()[0].errorMsg);d.MachineName=o.$("#gen_devName").val(),d.LocalNo=o.$("#gen_devNo").numberfield("value"),e=o.$("#gen_language").val(),f=o.$("#gen_standard").val(),void 0!==d.LockLoginEnable&&isEnable("is_show_WtchNtCustom")&&(d.LockLoginEnable=o.$("#gen_LockEnable").prop("checked")),void 0!==d.LockLoginTimes&&isEnable("is_show_WtchNtCustom")&&(d.LockLoginTimes=o.$("#gen_LockTimes").numberfield("value"));var b=["General","Language","VideoStandard"],c=[d,e,f];t&&(h[0].Enable=o.$("#gen_LightEnable").prop("checked"),b.push("LightGlobal"),c.push(h)),I&&(i[0].Mode=o.$("#gen_PlaceModeSel").val(),b.push("DevPlaceMode"),c.push(i)),q.done(function(a){if(a&&g&&!v){if(A){var d=o.$("#gen_tab_resolution_mode").val();g[0].Enable="Off"!==d}else{var e=o.$("#gen_TVEnable").val();g[0].Enable="Off"!==e,g[0].Mode&&"Off"!==e&&(g[0].Mode.Format=e)}b.push("VideoOut"),c.push(g)}}).always(function(){o.$(".u-button").addClass("ui-button-disabled"),o.disabled(o.$(".u-button"),!0),k.ConfigManager.setConfig(b,c).done(function(c){o.$(".u-button").removeClass("ui-button-disabled"),o.disabled(o.$(".u-button"),!1),webApp.VideoStandard=f,n.chkMutilCallRet(c)?(o.tip("success","com.SaveSuccessTip"),webApp.isNeedReboot(c)&&webApp.reboot("com.ConfEffectRestartTip"),global.getlang(e),setTimeout(function(){document.title=a(".u-tab.main [data-for].current span").text()},1e3)):o.tip("error","com.SaveConfigFailTip"),!n.chkMutilCallRet(c)&&c[b.indexOf("DevPlaceMode")].error&&285475073===c[b.indexOf("DevPlaceMode")].error.code&&a.alert(tl("per.PtzStartingTip"))}).always(function(){!A||C===g[0].CurrentControlMode&&D==="["+g[0].Mode.Format+"]["+g[0].Mode.Height+g[0].Mode.ScanFormat.slice(0,1)+"-"+g[0].Mode.RefreshRate+"FPS]"||(D!==x.val()||C!==g[0].CurrentControlMode)&&a.alert(tl("com.RebootDeviceThenTakeEffectTip")),A&&C==g[0].CurrentControlMode&&D=="["+g[0].Mode.Format+"]["+g[0].Mode.Height+g[0].Mode.ScanFormat.slice(0,1)+"-"+g[0].Mode.RefreshRate+"FPS]"&&"Off"==x.val()&&a.alert(tl("com.RebootDeviceThenTakeEffectTip"))})})}})}),define("gen_time",function(require,b,c){function d(a,b,c,d){for(var e=Math.floor((a-1)/4)-2*(a-1)+b+Math.floor(b/4)+Math.floor(13*(c+1)/5)+d-1;0>e;)e+=7;return e%7}var e,f,g,h,i,j,k,l,m=require("jsCore/rpc"),n=(require("jsCore/rpcLogin"),require("jsCore/pageBase")),o=require("common/common"),p=null,q=null,r=null;c.exports=n.extend({init:function(){p=this,l=a.validator([{element:p.$("#gen_NTPServer"),check:[o.Check.alphaNumLineDot,o.Check.alphaNumLineDot,function(a){return""!==a}],errorMsg:["com.WrongNTPNameTip","com.WrongNTPNameTip","com.WrongNTPNameTip"],events:["keyup","blur","blur"],errorElem:".u-input-error"}],function(a){a.parent().translation()}),e=p.$("#gen_sysDate").datepicker({change:p._changeDate}),f=p.$("#gen_sysTime").timefield({onAddDay:function(){p._getCurTime()},onAddMinute:function(){p._getCurTime()}}),g=p.$("#gen_DSTStartT").timefield({disableS:!0}),h=p.$("#gen_DSTEndT").timefield({disableS:!0}),p.$("#gen_NTPPort").numberfield({max:65535,min:0,allowDecimal:!1,allowNegative:!1}),p.$("#gen_NTPUPeriod").numberfield({max:30,min:0,allowDecimal:!1,allowNegative:!1}),p.$("#gen_GPSUPeriod").numberfield({max:1440,min:1,allowDecimal:!1,allowNegative:!1}),p.$("#gen_DSTWeek").on("click",function(){p._showDST(0)}),p.$("#gen_DSTDate").on("click",function(){p._showDST(1)}),ability.get("GPS").done(function(a){r=a}),p.render()},_renderDate:function(){var a=p.$("#gen_dateFormat");a.empty(),q=[{value:"yyyy-MM-dd",text:tl("com.YearToDay"),DateSeparator:""},{value:"MM-dd-yyyy",text:tl("com.MonthDayYear"),DateSeparator:""},{value:"dd-MM-yyyy",text:tl("com.DayMonthYear"),DateSeparator:""}];for(var b="",c=0,d=q.length;d>c;c++)b+='<option value="'+q[c].value+'" segment="'+q[c].DateSeparator+'">'+q[c].text+"</option>";a.append(b),"SimpChinese"==window.global.currentLanguage&&ability.get("SupportOsdRestructure").done(function(b){if(1==b){a.empty(),q=[{value:"yyyy-MM-dd",text:"XXXX-XX-XX(年月日)",DateSeparator:""},{value:"MM-dd-yyyy",text:"XX-XX-XXXX(月日年)",DateSeparator:""},{value:"dd-MM-yyyy",text:"XX-XX-XXXX(日月年)",DateSeparator:""},{value:"yyyy/MM/dd",text:"XXXX/XX/XX(年月日)",DateSeparator:""},{value:"MM/dd/yyyy",text:"XX/XX/XXXX(月日年)",DateSeparator:""},{value:"dd/MM/yyyy",text:"XX/XX/XXXX(日月年)",DateSeparator:""},{value:"yyyy-MM-dd",text:"XXXX年XX月XX日",DateSeparator:"yMd"},{value:"MM-dd-yyyy",text:"XX月XX日XXXX年",DateSeparator:"Mdy"},{value:"dd-MM-yyyy",text:"XX日XX月XXXX年",DateSeparator:"dMy"}];for(var c="",d=0,e=q.length;e>d;d++)c+='<option value="'+q[d].value+'" segment="'+q[d].DateSeparator+'">'+q[d].text+"</option>";a.append(c)}})},_changeDate:function(){p.$("#gen_DSTWeek").prop("checked")?p._putDSTWeek():p._putDSTDate()},render:function(){p._renderDate(),p._getConfig()},_showDST:function(a){1==a?(p.$("#gen_DSTshowSW").hide(),p.$("#gen_DSTshowEW").hide(),p.$("#gen_DSTshowSD").show(),p.$("#gen_DSTshowED").show(),p._putDSTDate()):(p.$("#gen_DSTshowSD").hide(),p.$("#gen_DSTshowED").hide(),p.$("#gen_DSTshowSW").show(),p.$("#gen_DSTshowEW").show(),p._putDSTWeek())},_getConfig:function(a){m.Global.getCurrentTime().done(function(b){m.ConfigManager.getConfig(["Locales","NTP"]).done(function(c){o.chkMutilCallRet(c)?(i=c[0].params.table,j=c[1].params.table,p._putCurTime(b),p._renderElements(),p.changeDateFormat(),p.changeTimeFormat(),a&&p.tip("success","com.OperateSuccessTip")):a&&p.tip("error","com.OperateFailTip")}),null==r?(p.$("#gen_GPSEnableD").css("display","none"),p.$("#gen_GPSUPeriodD").css("display","none")):r.SyncTime?m.ConfigManager.getConfig(["GPS"]).done(function(a){a[0].params.table[0].Enable?(p.$("#gen_GPSUPeriod").val(a[0].params.table[0].SyncPeriod),p.$("#gen_GPSEnable").prop("checked",a[0].params.table[0].SyncTime),k=a[0].params.table):(p.$("#gen_GPSEnableD").css("display","none"),p.$("#gen_GPSUPeriodD").css("display","none"))}):r.SyncTime||(p.$("#gen_GPSEnableD").css("display","none"),p.$("#gen_GPSUPeriodD").css("display","none"))})},_renderElements:function(){var b=i.TimeFormat.split(" ");if(i.DateSeparator){for(var c=0,d=q.length;d>c;c++)if(q[c].DateSeparator==i.DateSeparator){p.$("#gen_dateFormat option").eq(c).prop("selected",!0);break}}else p.$("#gen_dateFormat").val(b[0]);webCaps.is_show_InitPages_adjust?p._renderAdjustTimeZone():p.$("#gen_timeZone").val(j.TimeZone),p.$("#gen_timeFormat").val(b[1]),p.$("#gen_DSTEnable").prop("checked",i.DSTEnable),0!==i.DSTStart.Week?(p.$("#gen_DSTWeek").prop("checked",!0),p._showDST(0),p._putDSTWeek()):(p.$("#gen_DSTDate").prop("checked",!0),p._showDST(1),p._putDSTDate()),g.timefield("format","24"),g.timefield("value",a.pad(i.DSTStart.Hour,2)+":"+a.pad(i.DSTStart.Minute,2)+":00"),h.timefield("format","24"),h.timefield("value",a.pad(i.DSTEnd.Hour,2)+":"+a.pad(i.DSTEnd.Minute,2)+":00"),p.$("#gen_NTPEnable").prop("checked",j.Enable?!0:!1),p.$("#gen_NTPServer").val(j.Address),p.$("#gen_NTPPort").numberfield("value",j.Port),p.$("#gen_NTPUPeriod").numberfield("value",j.UpdatePeriod),l.validate()},_renderAdjustTimeZone:function(){function a(a){var b={};for(var c in a)b[a[c]]=c;return b}var b=window.timeZoneKey,c=a(b),d=p.$("#gen_timeZone"),e="",f={};d.css({width:284}),d.empty();for(var g=0,h=TimeZoneExcel.length;h>g;g++){var i=TimeZoneExcel[g].replace(/\s+/g,""),k=tl("sys."+i);e+='<option value="'+i+'">'+k+"</option>",f[i]=k}d.append(e);var l=("("+b[j.TimeZone]+")"+j.TimeZoneDesc).replace(/\s+/g,"");f[l]||(l="(UTC) Coordinated Universal Time".replace(/\s+/g,"")),d.val(l),p.changeTimeZone=!0,d.off("change").on("change",function(){var a=p.$(this).val(),b=/\((.*?)\)/,d=a.match(b)[1];"UTC"==d&&(d="UTC+00:00"),j.TimeZone=c[d]-0,j.TimeZoneDesc=a.replace(b,"")})},_putDSTWeek:function(){p.$("#gen_DSTStartWM").val(i.DSTStart.Month),p._changeWeek("#gen_DSTStartWM","#gen_DSTStartWS");var a=i.DSTStart.Week;p.$("#gen_DSTStartWS").val(0===a||p.$("#gen_DSTStartWS option").size()==a?1:a),p.$("#gen_DSTStartWW").val(i.DSTStart.Day>6?1:i.DSTStart.Day),p.$("#gen_DSTEndWM").val(i.DSTEnd.Month),p._changeWeek("#gen_DSTEndWM","#gen_DSTEndWS"),a=i.DSTEnd.Week,p.$("#gen_DSTEndWS").val(0===a||p.$("#gen_DSTEndWS option").size()==a?1:a),p.$("#gen_DSTEndWW").val(i.DSTEnd.Day>6?1:i.DSTEnd.Day)},changeWeekMonthBegin:function(){p._changeWeek("#gen_DSTStartWM","#gen_DSTStartWS"),p.$("#gen_DSTStartWS").val(1)},changeWeekMonthEnd:function(){p._changeWeek("#gen_DSTEndWM","#gen_DSTEndWS"),p.$("#gen_DSTEndWS").val(1)},_putDSTDate:function(){p.$("#gen_DSTStartDM").val(i.DSTStart.Month),p._onChangeDay(i.DSTStart.Month,"#gen_DSTStartDD"),p.$("#gen_DSTStartDD").val(i.DSTStart.Day>0?i.DSTStart.Day:1),p.$("#gen_DSTEndDM").val(i.DSTEnd.Month),p._onChangeDay(i.DSTEnd.Month,"#gen_DSTEndDD"),p.$("#gen_DSTEndDD").val(i.DSTEnd.Day>0?i.DSTEnd.Day:1)},changeDateMonthBegin:function(){p._onChangeDay(p.$("#gen_DSTStartDM").val(),"#gen_DSTStartDD")},changeDateMonthEnd:function(){p._onChangeDay(p.$("#gen_DSTEndDM").val(),"#gen_DSTEndDD")},_getCurTime:function(){m.Global.getCurrentTime().done(function(a){p._putCurTime(a),p.changeDateFormat(),p.changeTimeFormat()})},_putCurTime:function(a){var b=a.split(" "),c=b[0],d=b[1];e.datepicker("format","yyyy-mm-dd"),e.datepicker("value",new Date(c.replace(/-/g,"/"))),f.timefield("format","24"),f.timefield("value",d),f.timefield("stop"),f.timefield("run")},changeDateFormat:function(){if("SimpChinese"==window.global.currentLanguage){var a=p.$("#gen_dateFormat")[0].selectedIndex,b=p.$("#gen_sysDate").val(),c=b.split(/\D/);if(c.length>3&&(c.pop(),b=c.join("-"),p.$("#gen_sysDate").val(b)),q[a].DateSeparator)switch(q[a].value){case"MM-dd-yyyy":e.datepicker("format","mm月dd日yyyy"),p.$("#gen_sysDate").val(p.$("#gen_sysDate").val()+"年");break;case"dd-MM-yyyy":e.datepicker("format","dd日mm月yyyy"),p.$("#gen_sysDate").val(p.$("#gen_sysDate").val()+"年");break;default:e.datepicker("format","yyyy年mm月dd"),p.$("#gen_sysDate").val(p.$("#gen_sysDate").val()+"日")}else e.datepicker("format",q[a].value.replace("MM","mm"))}else switch(p.$("#gen_dateFormat").val()){case"MM-dd-yyyy":e.datepicker("format","mm-dd-yyyy");break;case"dd-MM-yyyy":e.datepicker("format","dd-mm-yyyy");break;default:e.datepicker("format","yyyy-mm-dd")}},changeTimeFormat:function(){"HH:mm:ss"==p.$("#gen_timeFormat").val()?(f.timefield("format","24"),g.timefield("format","24"),h.timefield("format","24")):(f.timefield("format","12"),g.timefield("format","12"),h.timefield("format","12"))},onSynPCTime:function(){var b=new Date,c=b.getFullYear(),d=a.pad(b.getMonth()+1,2),e=a.pad(b.getDate(),2),f=a.pad(b.getHours(),2),g=a.pad(b.getMinutes(),2),h=a.pad(b.getSeconds(),2),i=c+"-"+d+"-"+e,j=f+":"+g+":"+h,k=i+" "+j;m.Global.setCurrentTime(k,5).done(function(){p._getCurTime(),p.tip("success","com.SaveSuccessTip")}).fail(function(){p.tip("error","com.SaveConfigFailTip")})},_changeWeek:function(b,c){var f=p.$(c).empty(),g=["com.FirstWeek","com.SecondWeek","com.ThirdWeek","com.FourthWeek","com.LastWeek"],h=[1,2,3,4,-1];if(2==p.$(b).val()){var i=e.datepicker("getDate"),j=new Date(i.year,2,0).getDate(),k=d(21,i.year-0-2e3-1,14,1);28===j&&0===k&&(g=["com.FirstWeek","com.SecondWeek","com.ThirdWeek","com.LastWeek"],h=[1,2,3,-1])}a.each(g,function(b,c){a('<option value="'+h[b]+'" t="'+c+'"></option>').appendTo(f)}),f.translation()},_onChangeDay:function(b,c){$content=p.$(c).empty();for(var d=e.datepicker("getDate"),f=new Date(d.year,b,0).getDate(),g=0;f>g;g++)a('<option value="'+(g+1)+'">'+(g+1)+"</option>").appendTo($content)},onClickNTPGPS:function(b){if(!r||!r.SyncTime)return!1;var c=a(b.target),d=c[0].id,e=c.prop("checked");e&&("gen_GPSEnable"===d?p.$("#gen_NTPEnable").prop("checked",!1):p.$("#gen_GPSEnable").prop("checked",!1))},onRefresh:function(){p._getConfig(!0)},onDefault:function(){m.ConfigManager.getDefault(["Locales","NTP"]).done(function(a){o.chkMutilCallRet(a)?(i=a[0].params.table,j=a[1].params.table,p._renderElements(),p.changeDateFormat(),p.changeTimeFormat(),p.tip("success","com.DefaultSuccessTip")):p.tip("error","com.DefaultfailureTip")}),r&&r.SyncTime?r.SyncTime&&m.ConfigManager.getDefault(["GPS"]).done(function(a){a[0].params.table[0].Enable?(p.$("#gen_GPSUPeriod").val(a[0].params.table[0].SyncPeriod),p.$("#gen_GPSEnable").prop("checked",a[0].params.table[0].SyncTime),k=a[0].params.table):(p.$("#gen_GPSEnableD").css("display","none"),p.$("#gen_GPSUPeriodD").css("display","none"))}):(p.$("#gen_GPSEnableD").css("display","none"),p.$("#gen_GPSUPeriodD").css("display","none"))},leave:function(){f.timefield("stop")},destory:function(){f.timefield("stop")},onSave:function(){function a(){return null==k?m.ConfigManager.setConfig(["Locales","NTP"],[i,j]).done(function(a){o.chkMutilCallRet(a)?p.tip("success","com.SaveSuccessTip"):p.tip("error","com.SaveConfigFailTip")}):m.ConfigManager.setConfig(["Locales","NTP","GPS"],[i,j,k]).done(function(a){o.chkMutilCallRet(a)?p.tip("success","com.SaveSuccessTip"):p.tip("error","com.SaveConfigFailTip")})}if(l.isInvalid())return p.tip("warning",l.errors()[0].errorMsg);if(j.Enable=p.$("#gen_NTPEnable").prop("checked"),""!==p.$("#gen_NTPServer").val()){if(j.Address=p.$("#gen_NTPServer").val(),j.Port=p.$("#gen_NTPPort").numberfield("value"),j.UpdatePeriod=p.$("#gen_NTPUPeriod").numberfield("value"),p.changeTimeZone||(j.TimeZone=p.$("#gen_timeZone").val()-0),i.DSTEnable=p.$("#gen_DSTEnable").prop("checked"),i.TimeFormat=p.$("#gen_dateFormat").val()+" "+p.$("#gen_timeFormat").val(),"SimpChinese"==window.global.currentLanguage){var b=p.$("#gen_dateFormat")[0].selectedIndex;i.DateSeparator=q[b].DateSeparator}else delete i.DateSeparator;var c=p.$("#gen_sysDate").val().replace(/\D/g,"-"),d=p.$("#gen_dateFormat")[0].selectedIndex;"-"==c.charAt(c.length-1)&&(c=c.substr(0,c.length-1));for(var e=q[d].value.split(/[-|/]/),n=c.split("-"),r={},s=0;s<e.length;s++)r[e[s].toLowerCase()]=n[s];c=[r.yyyy,r.mm,r.dd].join("-");var t={year:r.yyyy-0,month:r.mm-1,day:r.dd-0},u=g.timefield("value").split(":");i.DSTStart.Year=t.year,i.DSTEnd.Year=t.year,i.DSTStart.Hour=u[0]-0,i.DSTStart.Minute=u[1]-0;var v=h.timefield("value").split(":");i.DSTEnd.Hour=v[0]-0,i.DSTEnd.Minute=v[1]-0;var w=p.$("#gen_DSTStartDM").val()-0,x=p.$("#gen_DSTStartDD").val()-0,y=p.$("#gen_DSTEndDM").val()-0,z=p.$("#gen_DSTEndDD").val()-0;p.$("#gen_DSTDate").prop("checked")?(i.DSTStart.Month=w,i.DSTStart.Day=x,i.DSTStart.Week=0,i.DSTEnd.Month=y,i.DSTEnd.Day=z,i.DSTEnd.Week=0):(i.DSTStart.Month=p.$("#gen_DSTStartWM").val()-0,i.DSTStart.Day=p.$("#gen_DSTStartWW").val()-0,i.DSTStart.Week=p.$("#gen_DSTStartWS").val()-0,i.DSTEnd.Month=p.$("#gen_DSTEndWM").val()-0,i.DSTEnd.Day=p.$("#gen_DSTEndWW").val()-0,i.DSTEnd.Week=p.$("#gen_DSTEndWS").val()-0),null!=k&&(k[0].SyncPeriod=p.$("#gen_GPSUPeriod").val()-0,k[0].SyncTime=p.$("#gen_GPSEnable").prop("checked")),m.Global.getCurrentTime().done(function(b){if(f.timefield("isRun")&&c===b.split(" ")[0])a();else{var b=c+" "+f.timefield("value");m.Global.setCurrentTime(b,5).done(function(){a().done(p._getCurTime)})}})}}})}),define("gen_trigger",function(require,b,c){var d=require("jsCore/rpc"),e=require("jsCore/pageBase"),f=(require("jsCore/rpcLogin"),require("jsCore/ability")),g=(require("common/common").Cookie,null),h=null,i=0,j=3,k=0,l=[],m=[],n=0,o=[30,70,100],p=null,q=null,r=0,s=0,t=null,u=0;c.exports=e.extend({init:function(){g=this,p=g.$("#gen_probar"),q=g.$("#gen_process"),a.when(f.get("VideoInputCaps"),d.LensManager.getLensInfo(),f.get("VideoInputCapsEx")).done(function(a,b,c){j=a.SubChannel,t={lensInfo:b,targetWidth:a.OrgResWidth,targetHeight:a.OrgResHeight,imageNums:j},plugin.SetLensInfo(JSON.stringify(t)),c.MultiVideoSensor&&(u=1e3*c.MultiVideoSensor.ChangeDelay),g.render()}),"general"!=plugin.type&&a.subscribe("pluginLogin",function(){plugin.SetLensInfo(JSON.stringify(t))})},render:function(){plugin.SetModuleMode(1),plugin.open(),plugin.addEvent("MultiVideoJoinInfo",function(a){if(l.length=0,m.length=0,a){n=0;for(var b=0;j>b;b++){var c=arguments[1].split(".");c[c.length-2]+=b;var d=c.join("."),e=d.split("\\"),f=e[e.length-1];l.push(f),m.push(d)}var e=arguments[2].split("\\"),f=e[e.length-1];l.push(f),m.push(arguments[2]),g._showProcess(),r++,g.uploadFile()}else p.hide(),g.$("#gen_triggerTip").tip("error",tl("com.OperateFailTip"))})},leave:function(){window.clearTimeout(s),p.hide(),g.$("#gen_triggerTip").empty(),plugin.addEvent("MultiVideoJoinInfo",null),plugin.close(),plugin.hide(),h&&(3==j?h[i].EnableSensorMask=7:4==j&&(h[i].EnableSensorMask=15),d.ConfigManager.setConfig("MultiVideoSensor",h))},onStartMontage:function(){return""===plugin.type?void g.$("#gen_triggerTip").tip("warning",tl("com.NeedVideoOcx")):(r=0,p.show(),q.css("width","16px"),void d.ConfigManager.getConfig("MultiVideoSensor").done(function(a){g.$("#gen_triggerTip").tip("warning",tl("com.TransmitWaitingTip"),-1),h=a,k=0,g.changeSensor()}))},changeSensor:function(){h[i].EnableSensorMask=Math.pow(2,k),d.ConfigManager.setConfig("MultiVideoSensor",h).done(function(){s=window.setTimeout(function(){plugin.CatchSingleJoinPic(k).done(function(){k++,j>k?g.changeSensor():(g._showProcess(),r++,plugin.StartMultiVideoJoin(),3==j?h[i].EnableSensorMask=7:4==j&&(h[i].EnableSensorMask=15),d.ConfigManager.setConfig("MultiVideoSensor",h))})},u)})},uploadFile:function(){plugin.ReadFile(m[n]).done(function(a){g.$("#trigger_con").val(a);var b=l[n];g.$("#trigger_form").attr("action","/RPC2_UploadFileWithName/mnt/mtd/MultiSensor/"+b),g.$("#trigger_submit").trigger("click")})},_showProcess:function(){q.css("width",251*o[r]/100+"px")}}),window.audioUploadStatue=function(a){a?(n++,j>=n?setTimeout(function(){g.uploadFile()},2e3):(g._showProcess(),plugin.hide(),setTimeout(function(){webApp.reboot("com.RebootingTip")},5e3))):g.$("#gen_triggerTip").tip("error",tl("com.OperateFailTip"))}}),define("gen_gps",function(require,a,b){var c=require("jsCore/rpc"),d=(require("jsCore/rpcLogin"),require("jsCore/pageBase")),e=null,f=null;b.exports=d.extend({init:function(){e=this,e.$("#gen_Longitude").numberfield({max:180,min:0,allowDecimal:!0,decimalPrecision:6,allowNegative:!1}),e.$("#gen_Latitude").numberfield({max:90,min:0,allowDecimal:!0,decimalPrecision:6,allowNegative:!1}),e.$("#gen_Altitude").numberfield({max:9999,min:0,allowDecimal:!0,decimalPrecision:1,allowNegative:!1}),e.render()},render:function(a){c.ConfigManager.getConfig("DevLocation").done(function(b){f=b,e._renderElements(),a&&e.tip("success","com.OperateSuccessTip")}).fail(function(){e.tip("error","com.OperateFailTip")})},_renderElements:function(){f.Longitude<18e7?(e.$("#gen_LoDirect").val("W"),e.$("#gen_Longitude").val((f.Longitude/1e6).toFixed(6))):(e.$("#gen_LoDirect").val("E"),e.$("#gen_Longitude").val(((f.Longitude-18e7)/1e6).toFixed(6))),f.Latitude<9e7?(e.$("#gen_LaDirect").val("S"),e.$("#gen_Latitude").val((f.Latitude/1e6).toFixed(6))):(e.$("#gen_LaDirect").val("N"),e.$("#gen_Latitude").val(((f.Latitude-9e7)/1e6).toFixed(6))),e.$("#gen_Altitude").val(f.Altitude.toFixed(1))},onRefresh:function(){e.render(!0)},onSave:function(){f.Longitude="W"===e.$("#gen_LoDirect").val()?1e6*(e.$("#gen_Longitude").val()-0):1e6*(e.$("#gen_Longitude").val()-0)+18e7,f.Latitude="S"===e.$("#gen_LaDirect").val()?1e6*(e.$("#gen_Latitude").val()-0):1e6*(e.$("#gen_Latitude").val()-0)+9e7,f.Altitude=e.$("#gen_Altitude").val()-0,c.ConfigManager.setConfig("DevLocation",f).done(function(){e.tip("success","com.SaveSuccessTip")}).fail(function(){e.tip("error","com.SaveConfigFailTip")})},onDefault:function(){c.ConfigManager.getDefault("DevLocation").done(function(a){f=a,e._renderElements(),e.tip("success","com.DefaultSuccessTip")}).fail(function(){e.tip("error","com.DefaultfailureTip")})}})}),define("gen_sleep",function(require,b,c){var d=require("jsCore/rpc"),e=require("jsCore/pageBase"),f=require("common/common"),g=require("jsCore/modules/timeSection"),h=(f.Check,null),i=null,j=0,k={},l=[],m=-1;c.exports=e.extend({init:function(){h=this,h.$("#gen_sendnode_number").focus(function(){m=-1}),h.$("#gen_accepter").keyup(function(a){h._onLimitNum(h.$(a.target).prop("id"),h.$(a.target).prop("id")+"_add")}).blur(function(a){h._onLimitNum(h.$(a.target).prop("id"),h.$(a.target).prop("id")+"_add")}),ability.get("SleepingControl").done(function(b){if(b&&b.ModeList){var c=h.$("#gen_sleepMode").empty();a.each(b.ModeList,function(a,b){c.append('<option value="'+b+'" t="sys.'+b+'"></option>')}),c.translation()}h.$("#gen_SleepTiming").numberfield({max:b&&b.Timing[1]||60,min:b&&b.Timing[0]||0,allowDecimal:!1,allowNegative:!1}),h.$("#SleepTiming_limit").text(tl("com.Minutes")+"("+(b&&b.Timing[0]||0)+"~"+(b&&b.Timing[1]||60)+")")}),i=a.validator([{element:h.$("#gen_sleepSMS"),check:[function(a){return/^[0-9a-zA-Z]*$/.test(a)}],errorMsg:["ivs.TpCodeTip"],events:["keyup"]},{element:h.$("#gen_OpenSMS"),check:[function(a){return/^[0-9a-zA-Z]*$/.test(a)}],errorMsg:["ivs.TpCodeTip"],events:["keyup"]}],function(a){a.parent().translation()}),h.$("#gen_sleepMode").on("change",function(){var a=h.$("#gen_sleepMode").val();h.$("[show-for]").hide(),h.$("[show-for = "+a+"]").show()}),h.$("#gen_sleepEnable").change(function(){a(this).prop("checked")&&h.tip("warning","sys.sleepEnableTip")}),h.render()},_onLimitNum:function(b,c){h.$("#"+b).val().replace(/[\"|\'|\s]+/,"").replace(/[\u4E00-\u9FA5]+/,""),h.disabled("#"+c,""===a.trim(h.$("#"+b).val()))},render:function(){d.ConfigManager.getConfig("SleepingControl").done(function(a){k=a,h._renderElement()})},_renderElement:function(){h.$("#gen_sleepEnable").prop("checked",k[j].Enable),h.$("#gen_sleepMode").val(k[j].Mode),h.$("#gen_SleepTiming").val(k[j].Timing.Minutes),h.$("#gen_sleepSMS").val(k[j].ShortMessage.SleepMs),h.$("#gen_OpenSMS").val(k[j].ShortMessage.WakeMs),h.$("[show-for]").hide(),h.$("[show-for = "+k[j].Mode+"]").show(),h._onShowAccepter(),i.validate()},onSetPeriod:function(){var a=k[j].TimePeriod.TimeSection;g.open(a).done(function(a){k[j].TimePeriod.TimeSection=a})},_onShowAccepter:function(){if(l=k[j].ShortMessage.Senders,h.$("#SMS_content").html(""),h.$("#gen_accepter").val(""),l){var b="",c="sendNote_",d="gen_sendnode_del";a.each(l,function(a,c){b+='<a id="sendNote_'+a+'" class="ui-receiver-address">'+tl(c)+"</a>"}),h.$("#SMS_content").html(b),h.disabled("#gen_accepter_add"),h.disabled("#gen_sendnode_del",""===b)}$$("#gen_sendnode_number .ui-receiver-address").addEvent("click",function(){var a=this.id.replace(/[^\d]/g,"");h._onSelectSendNote(c,d,a)})},_onSelectSendNote:function(a,b,c){var d=a;h._onShowAccepter(),h.disabled("#gen_sendnode_del"),h.disabled("#"+b,!1),d=a,m=c,d+=c,h.$("#"+d).addClass("ui-receiver-address-current")},onSendNode:function(){if(f.Check.noQuotationCNSpace(h.$("#gen_accepter").val())){if(0===a.trim(h.$("#gen_accepter").val()).length)return h.tip("warning","com.NotNoneTip");if(k[j].ShortMessage.Senders=k[j].ShortMessage.Senders||[],k[j].ShortMessage.Senders.length>31)return h.tip("warning","com.MaxNumTip");if(a.inArray(h.$("#gen_accepter").val(),k[j].ShortMessage.Senders)>-1)return h.tip("warning","com.SameNumTip");k[j].ShortMessage.Senders.push(h.$("#gen_accepter").val()),l=k[j].ShortMessage.Senders,h._onShowAccepter(),h.disabled("#gen_sendnode_del")
}else h.$("#gen_accepter").val(""),h.disabled("#gen_accepter_add"),h.tip("warning","com.NoInputChMarksSpaceTip")},onSendNodeDel:function(){m>=0&&m<k[j].ShortMessage.Senders.length&&(k[j].ShortMessage.Senders.splice(m,1),l=k[j].ShortMessage.Senders,h._onShowAccepter(),m=-1,h.disabled("#gen_sendnode_del"))},onDefault:function(){d.ConfigManager.getDefault("SleepingControl").done(function(a){k=a,h._renderElement(),h.tip("success","com.DefaultSuccessTip")}).fail(function(){h.tip("error","com.DefaultfailureTip")})},onRefresh:function(){d.ConfigManager.getConfig("SleepingControl").done(function(a){k=a,h._renderElement(),h.tip("success","com.OperateSuccessTip")}).fail(function(){h.tip("error","com.OperateFailTip")})},onConfirm:function(){return i.isInvalid()?h.tip("warning",i.errors()[0].errorMsg):(k[j].Enable=h.$("#gen_sleepEnable").is(":checked"),k[j].Mode=h.$("#gen_sleepMode").val(),k[j].Timing.Minutes=h.$("#gen_SleepTiming").val()-0,k[j].ShortMessage.Senders=l,k[j].ShortMessage.SleepMs=h.$("#gen_sleepSMS").val(),k[j].ShortMessage.WakeMs=h.$("#gen_OpenSMS").val(),void d.ConfigManager.setConfig("SleepingControl",k).done(function(a){h.tip("success","com.SaveSuccessTip"),webApp.isNeedReboot(a)&&webApp.reboot("com.ConfEffectRestartTip")}).fail(function(){h.tip("error","com.SaveConfigFailTip")}))}})})}(jQuery);
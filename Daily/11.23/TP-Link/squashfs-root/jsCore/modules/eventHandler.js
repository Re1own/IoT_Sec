!function(a){var b;define(function(require,c,d){function e(c,d){var e=this;if(-1!==webApp.DeviceType.indexOf("SD")&&-1===webApp.DeviceType.indexOf("TPC")&&(d.SupportLightControl=!1),e.caps=a.extend({},j,d),e.e=a(c),e.hasInit=a.Deferred(),e.$=function(a){return e.e.find(a)},e.e.html(h).translation(),e.$(".ui-label").css("width",e.e.attr("ui-label")),e.$(".ui-label-sub").css("width",e.e.attr("ui-label-sub")),e.$("#e_ptz_quickfzoom").parent().css("padding-left",e.e.attr("ui-label")),e.$("#e_ptz_hotcoldspot").parent().css("padding-left",e.e.attr("ui-label")),a.when(ability.get("LightingControl"),ability.get("VideoInputCaps"),ability.get("ExternalSensorCaps")).always(function(c,d,f){var g=f&&f.Support&&"RS-485"==f.NetworkingMode,h=e.caps.SupportLightControl&&c&&c.LinkingDetail;(d&&d.ElectricFocus||g)&&(e.caps.PtzLinkEnable=!1),h&&h.FilckerLighting&&h.FilckerLighting.Support&&-1===webApp.DeviceType.indexOf("SD")&&(e.caps.SupportFilckerLighting=!0,e.caps.SupportLightControl=!1),e.$("[cfg]").each(function(a,b){var c=e.$(b),d=c.attr("cap");switch(d){case"VoiceEnable":webCaps.is_show_voiceLink===!1?c.closest(".ui-form-item").remove():e.caps[d]||c.closest(".ui-form-item").remove();break;case"PtzLinkEnable":for(var f=["IPC-HDBW8331E","IPC-HDB8331E"],g=0,h=f.length;h>g;g++)if(webApp.DeviceType.indexOf(f[g])>-1){c.closest(".ui-form-item").remove();break}default:e.caps[d]||c.closest(".ui-form-item").remove()}}),e.caps.SupportFilckerLighting&&(e.$("input[cfg=LightDuration]").numberfield({min:5,max:30,allowDecimal:!1,allowNegative:!1}),e.$("#wl_mode").change(function(){var b=a(this).val();"KeepLighting"===b?e.$("#ala_WlFilcker").parent().hide():e.$("#ala_WlFilcker").parent().show()}),e.$("#ala_pir_time").on("click",function(){plugin.hide(),b.open(e.handler.LightingLink.WhiteLightTimeSection,{title:"com.Period"}).done(function(a){e.handler.LightingLink.WhiteLightTimeSection=a}).always(function(){"hls"!=webApp.playMode&&"flash"!=webApp.playMode&&"h5"!=webApp.playMode&&plugin.cover(-1!==webApp.DeviceType.indexOf("TPC")&&"fireAlarmConfig"===jQuery(".set-item-current")[0].get("filename")?"#f_w_video":"#ipcintellentNewVideo")})})),e.hasInit.resolve()}),e.caps.PtzLinkEnable&&(e.caps.ShowQuickFocus&&rpc.ThermographyManager.getCaps(webApp.CHANNEL_NUMBER>1?1:0,"All").done(function(a){e.EZoom=a.EZoom}),e.$("[cfg=PtzLinkEnable]").change(function(a){var b=e.$(a.target),c=b.prop("checked");e.refreshPtzCaps.done(function(a){e.ptzcaps=a,e.handler.PtzLink&&0!==e.handler.PtzLink.length||(e.handler.PtzLink=[["None",1]]);var b=e.$("#e_ptz_link").empty().append('<option value="None" t="com.None"></option>');a&&(a.Preset!==!1&&b.append('<option value="Preset" t="ivs.Preset">Preset</option>'),a.Tour!==!1&&b.append('<option value="Tour" t="ivs.AutoTour">Tour</option>'),a.Pattern!==!1&&b.append('<option value="Pattern" t="ivs.Pattern">Pattern</option>'),e.caps.ShowQuickFocus!==!1&&b.append('<option value="QuickFocus" t="com.QuickFocus">Pattern</option>')),b.translation(),c?(b.parent().show(),b.val(b.is(":has(option[value="+e.handler.PtzLink[0][0]+"])")?e.handler.PtzLink[0][0]:"None")):(b.parent().hide(),b.val("None"),b.change()),b.change()})}),e.$("#e_ptz_link").change(function(a){var b,c,d=e.$(a.target),f=d.val(),g=e.handler.PtzLink[0],h=e.$("#e_ptz_num"),i=e.$("#e_ptz_quickfzoom"),j=e.$("#e_ptz_hotcoldspot");return i.parent().hide(),j.parent().hide(),a.isTrigger||(g[0]=f),"None"===f?(h.parent().hide(),h.numberfield("value",1)):"QuickFocus"===f?(b=e.ptzcaps.ZoomMin,c=e.ptzcaps.ZoomMax,g[1]<b&&(g[1]=b),g[1]>c&&(g[1]=c),g[2]&&g[2]<1&&(g[2]=1),g[2]&&g[2]>300&&(g[2]=300),i.numberfield({min:b,max:c,value:g[1]}),i.next().text("("+b+"~"+c+")"),h.parent().hide(),h.numberfield("value",1),i.parent().show(),e.caps.ShowHotcoldSpot&&j.parent().show()):(b=e.ptzcaps[f+"Min"],c=e.ptzcaps[f+"Max"],h.next().text("("+b+"~"+c+")"),h.numberfield("min",b),h.numberfield("max",c),g[1]<b&&(g[1]=b),g[1]>c&&(g[1]=c),h.numberfield("value",g[1]),h.parent().show()),!1}),e.$("#e_ptz_num").numberfield({allowDecimal:!1,allowNegative:!1}).blur(function(){return e.handler.PtzLink[0][1]=e.$("#e_ptz_num").numberfield("value"),!1}),e.$("#e_ptz_quickfzoom").numberfield({allowDecimal:!1,allowNegative:!1}).blur(function(){return e.handler.PtzLink[0][1]=e.$("#e_ptz_quickfzoom").numberfield("value"),!1})),webApp.ALARM_OUT_NUMBER>1&&e.caps.AlarmOutEnable){for(var f=e.$("#e_alarmchn"),g=0;g<webApp.ALARM_OUT_NUMBER;g++)f.append('<a href="javascript:;" class="ui-channel-item" channle='+g+">"+(g+1)+"</a>");f.click(function(a){return e.$(a.target).toggleClass(i),!1})}if(webApp.CHANNEL_NUMBER>1){for(var k=e.$("#e_recordchn"),l=0;l<webApp.CHANNEL_NUMBER;l++)k.append('<a href="javascript:;" class="ui-channel-item" channle='+l+">"+(l+1)+"</a>");k.click(function(a){return e.$(a.target).toggleClass(i),!1})}if(e.caps.FaceSnapshot&&webApp.CHANNEL_NUMBER>1){for(var m=e.$("#e_snapchn"),n=0;n<webApp.CHANNEL_NUMBER;n++)m.append('<a href="javascript:;" class="ui-channel-item" channle='+n+">"+(n+1)+"</a>");m.click(function(a){return e.$(a.target).toggleClass(i),!1})}e.$("[cfg=FlashLatch],[cfg=RecordLatch],[cfg=AlarmOutLatch]").numberfield({min:10,max:300,allowDecimal:!1,allowNegative:!1}),e.caps.AlarmOutLatch.length>1&&e.caps.AlarmOutLatch[1]>0&&(e.$("[cfg=AlarmOutLatch]").numberfield({min:e.caps.AlarmOutLatch[0],max:e.caps.AlarmOutLatch[1],allowDecimal:!1,allowNegative:!1}),e.$("[cfg=AlarmOutLatch]").next("span").next("span").text("("+e.caps.AlarmOutLatch[0]+"~"+e.caps.AlarmOutLatch[1]+")")),e.caps.RecordLatch.length>1&&e.caps.RecordLatch[1]>0&&(e.$("[cfg=RecordLatch]").numberfield({min:e.caps.RecordLatch[0],max:e.caps.RecordLatch[1],allowDecimal:!1,allowNegative:!1}),e.$("[cfg=RecordLatch]").next("span").next("span").text("("+e.caps.RecordLatch[0]+"~"+e.caps.RecordLatch[1]+")"))}function f(){var b=this;b.refreshPtzCaps=ability.get("PTZCaps",!0),b.$("[cfg]:checkbox").each(function(a,c){var d=b.$(c),e=d.attr("cfg");"Enable"!==e&&d.prop("checked",!!b.handler[e]),"PtzLinkEnable"===e&&d.change()}),b.$("[cfg=FlashLatch],[cfg=RecordLatch],[cfg=AlarmOutLatch]").each(function(a,c){var d=b.$(c);0===b.handler[d.attr("cfg")]?d.numberfield("value",0):d.numberfield("value",b.handler[d.attr("cfg")]||10)}),webApp.ALARM_OUT_NUMBER>1&&b.caps.AlarmOutEnable&&a.isArray(b.handler.AlarmOutChannels)&&(b.$("#e_alarmchn").children().removeClass(i),a.each(b.handler.AlarmOutChannels,function(a,c){b.$("#e_alarmchn a[channle="+c+"]").addClass(i)})),webApp.CHANNEL_NUMBER>1&&a.isArray(b.handler.RecordChannels)&&(b.$("#e_recordchn").children().removeClass(i),a.each(b.handler.RecordChannels,function(a,c){b.$("#e_recordchn a[channle="+c+"]").addClass(i)})),webApp.CHANNEL_NUMBER>1&&a.isArray(b.handler.SnapshotChannels)&&(b.$("#e_snapchn").children().removeClass(i),a.each(b.handler.SnapshotChannels,function(a,c){b.$("#e_snapchn a[channle="+c+"]").addClass(i)})),b.caps.SupportAlarmBell&&b.$("#selectSecond").val(b.handler.AlarmBellLatch),b.caps.SupportFilckerLighting&&b.handler.LightingLink&&(b.$("#ala_WlEnable").prop("checked",b.handler.LightingLink.Enable),b.$("#wl_mode").val(b.handler.LightingLink.LightLinkType).change(),b.$("#ala_WlFilcker").val(b.handler.LightingLink.FilckerIntevalTime),b.$("#ala_duration").val(b.handler.LightingLink.LightDuration)),b.caps.Wakeup&&b.handler.Wakeup&&b.$("#device_WakeupEnable").prop("checked",b.handler.Wakeup.Enable)}function g(){var a=this;if(a.$("[cfg]:checkbox").each(function(b,c){var d=a.$(c),e=d.attr("cfg");"Enable"!==e&&(a.handler[e]=d.prop("checked"))}),a.$("[cfg=FlashLatch],[cfg=RecordLatch],[cfg=AlarmOutLatch]").each(function(b,c){var d=a.$(c);a.handler[d.attr("cfg")]=d.numberfield("value")}),webApp.ALARM_OUT_NUMBER>1&&a.caps.AlarmOutEnable){var b=[];a.$("#e_alarmchn").children(".ui-channel-item-current").each(function(c,d){b.push(a.$(d).attr("channle")-0)}),a.handler.AlarmOutChannels=b}if(webApp.CHANNEL_NUMBER>1){var c=[];a.$("#e_recordchn").children(".ui-channel-item-current").each(function(b,d){c.push(a.$(d).attr("channle")-0)}),a.handler.RecordChannels=c}if(a.caps.FaceSnapshot&&webApp.CHANNEL_NUMBER>1){var d=[];a.$("#e_snapchn").children(".ui-channel-item-current").each(function(b,c){d.push(a.$(c).attr("channle")-0)}),a.handler.SnapshotChannels=d}a.caps.SupportAlarmBell&&(a.handler.AlarmBellLatch=a.$("#selectSecond").val()-0),a.caps.SupportFilckerLighting&&(a.handler.LightingLink.Enable=a.$("#ala_WlEnable").prop("checked"),a.handler.LightingLink.LightLinkType=a.$("#wl_mode").val(),a.handler.LightingLink.FilckerIntevalTime=a.$("#ala_WlFilcker").val()-0,a.handler.LightingLink.LightDuration=a.$("#ala_duration").val()-0),a.caps.Wakeup&&(a.handler.Wakeup.Enable=a.$("#device_WakeupEnable").prop("checked"))}b=require("./timeSection");var h=require("./eventHandler.html"),i="ui-channel-item-current",j={FlashEnable:webApp.ALARM_FLASH,FlashLatch:webApp.ALARM_FLASH,RecordEnable:!0,RecordLatch:!0,MailEnable:!0,SnapshotEnable:!0,PtzLinkEnable:webApp.HasPtz,AlarmOutEnable:!!webApp.ALARM_OUT_NUMBER,AlarmOutLatch:!!webApp.ALARM_OUT_NUMBER,VoiceEnable:webApp.IsAudioFileManager&&webApp.AUDIO_OUT_NUMBER,MMSEnable:webApp.Is3G||webApp.Is4G,ShowQuickFocus:!1,FaceSnapshot:!0,ShowHotcoldSpot:!1,SupportLightControl:!1,SupportFilckerLighting:!1,SupportAlarmBell:!1,Wakeup:!1};a.fn.eventHandler=function(){var b=arguments[0],c=2<=arguments.length?Array.prototype.slice.call(arguments,1):[],d=this;return this.each(function(){var f=a(this),g=f.data("eventHandler");if(g||f.data("eventHandler",g=new e(f,b)),"string"===a.type(b)&&a.isFunction(g[b])){var h=g[b].apply(g,c);if(void 0!==h)return d=h,!1}}),d},e.prototype.set=function(a){var b=this;return b.handler=a,b.hasInit.done(function(){f.call(b)}),b.e},e.prototype.get=function(){var a=this;return g.call(a),a.handler},d.exports=e})}(jQuery);
!function(a){define(function(require,b,c){function d(b,c){var d=this;d.options=a.extend({},g,c),d.e=a(b).empty().append(f).translation(),d.init()}var e=require("../plugin"),f=require("./traffic.html");require("widget/js/dui.scroll");var g=null,h={CarPlate:tl("ivs_osd.TitleBit2"),VehicleColor:tl("com.Color"),VehicleType:tl("ivs_osd.TitleBit19"),VehicleSign:tl("ivs_osd.TitleBit32"),Sex:tl("Gender"),BagStatus:tl("ivs.Bag"),UpClothes:tl("ivs.UpClothes"),DownClothes:tl("ivs.DownClothes"),"com.Cyan":tl("com.Cyan"),"com.RedColor":tl("com.RedColor"),"com.BlueColor":tl("com.BlueColor"),"com.black":tl("com.black"),"com.GreenColor":tl("com.GreenColor"),"com.Yellow":tl("com.Yellow"),"com.white":tl("com.white"),"com.gray":tl("com.gray"),"com.Pink":tl("com.Pink"),"com.Purple":tl("com.Purple"),DarkViolet:tl("com.DarkViolet"),"com.Maroon":tl("com.Maroon"),"com.Silver":tl("com.Silver"),"com.DimGray":tl("com.DimGray"),"com.WhiteSmoke":tl("com.WhiteSmoke"),"com.DeepSkyBlue":tl("com.DeepSkyBlue"),"com.DarkOrange":tl("com.DarkOrange"),"com.MistyRose":tl("com.MistyRose"),"com.Tomato":tl("com.Tomato"),"com.Olive":tl("com.Olive"),"com.Gold":tl("com.Gold"),"com.DarkOliveGreen":tl("com.DarkOliveGreen"),"com.ChartReuse":tl("com.ChartReuse"),"com.GreenYellow":tl("com.GreenYellow"),"com.ForestGreen":tl("com.ForestGreen"),"com.SeaGreen":tl("com.SeaGreen"),"com.Brown":tl("com.Brown"),"com.ShadowGreen":tl("com.ShadowGreen"),Bus:tl("ivs.Bus"),Bicycle:tl("ivs.Bicycle"),Motorcycle:tl("itc.Motorcycle"),TwoWheeledVehicle:tl("ivs.TwoWheeledVehicle"),UnlicensedMotor:tl("ivs.NoPlate"),LargeCar:tl("ivs.LargeCar"),MicroCar:tl("ivs.MicroCar"),LargeTruck:tl("itc.LargeTruck"),MidTruck:tl("itc.MediumTruck"),MicroTruck:tl("itc.SmallTruck"),Microbus:tl("itc.Microbus"),Tricycle:tl("itc.Tricycle"),Passerby:tl("itc.Pederstrian"),SaloonCar:tl("SaloonCar"),Carriage:tl("ivs.Carriage"),MiniCarriage:tl("ivs.MiniCarriage"),"SUV-MPV":tl("SuvMpv"),SuvMpv:tl("SuvMpv"),SUV:tl("ivs.SUV"),MPV:tl("ivs.MPV"),PassengerCar:tl("itc.Coach"),MotorBus:tl("ivs.MotorBus"),MidPassengerCar:tl("ivs.MidPassengerCar"),MiniBus:tl("ivs.MiniBus"),Pickup:tl("ivs.Pickup"),OilTankTruck:tl("ivs.OilTankTruck"),TankCar:tl("ivs.TankCar"),"com.Yes":tl("com.Yes"),"com.No":tl("com.No"),Glasses_Y:tl("Glasses_Y"),Glasses_N:tl("Glasses_N"),Male:tl("Male"),Female:tl("Female"),Unknown:tl("com.Unknow"),"ivs.LongSleeve":tl("ivs.LongSleeve"),"ivs.ShortSleeve":tl("ivs.ShortSleeve"),"ivs.Trousers":tl("ivs.Trousers"),"ivs.Shorts":tl("ivs.Shorts"),"ivs.Dress":tl("ivs.Dress"),"ivs.Vest":tl("ivs.Vest"),"ivs.ShortShorts":tl("ivs.ShortShorts"),"ivs.ShortSkirt":tl("ivs.ShortSkirt"),DregsCar:tl("ivs.DregsCar"),ConcreteMixerTruck:tl("ivs.ConcreteMixerTruck"),NonMotorType:tl("ivs_osd.TitleBit19"),Tricycle:tl("itc.Tricycle"),Motorcycle:tl("ivs.TwoWheeledVehicle"),NonMotorColor:tl("ivs_osd.TitleBit11"),NumOfCycling:tl("ivs.Rider"),"com.other":tl("com.other")};a.fn.traffic=function(){var b=arguments[0],c=2<=arguments.length?Array.prototype.slice.call(arguments,1):[],e=this;return this.each(function(){var f=a(this),g=f.data("traffic");if(g||f.data("traffic",g=new d(f,b)),"string"===a.type(b)&&a.isFunction(g[b])){var h=g[b].apply(g,c);if(void 0!==h)return e=h,!1}}),e},d.prototype.init=function(){var b=this;b.hasInfo=!1,b.curPicNum=0,b.$picList=b.$("#traffic_list"),e.addEvent("TrafficJunctionGate",function(a){a=JSON.parse(a);var c=a.MotorInfo?"MotorInfo":b.NonMotorInfo;return c?(a.MotorInfo&&(a.MotorInfo.Time=a.Time,b.handleInfo(a.MotorInfo,"MotorInfo")),void(b.NonMotorInfo&&a.NonMotorInfo&&(a.NonMotorInfo.Time=a.Time,b.handleInfo(a.NonMotorInfo,"NonMotorInfo")))):!1}),b.$(".face").scroll({scrollYEnable:!0,contentWrap:".face-pic",content:"#traffic_list",yBar:".face-scrollY",actionList:{y:".face-dragY"}}),b.$trafficDialog=b.$("#traffic_dialog").dialog({close:function(){e.cover(b.options.video),webApp.hide_by_dialog=!1},resize:function(){}}).detach().appendTo(document.body),b.$("#traffic_list").delegate("li","click",function(){e.hide(),webApp.hide_by_dialog=!0;var c=a(this).data("info")||{};b.showInfo(c),b.$trafficDialog.dialog("show")}),ability.get("IVSCaps").done(function(c){if(-1!==c.SupportedScene.indexOf("ObjectDetect"))b.NonMotorInfo="";else{b.NonMotorInfo="NonMotorInfo",e.addEvent("HumanTrait",function(a){a=JSON.parse(a),a.HumanBody&&(a.HumanBody.Time=a.Time,b.handleInfo(a.HumanBody,"HumanTrait"))});var d=c.SupportedScenes.Gate.SupportedRules.TrafficTollGate;d.FeatureLists&&a.each(d.FeatureLists,function(c,d){b.$trafficDialog.find("[data-type = "+d.ObjectType+"] [cap]").each(function(){var b=a(this).attr("cap");-1===d.FeatureList.indexOf(b)&&a(this).closest("li").remove()})})}})},d.prototype.handleInfo=function(a,b){var c=this;c.hasInfo||(c.$picList.show(),c.$(".face-none").hide(),c.hasInfo=!0),++c.curPicNum>200&&(c.$picList.find("li:last").remove(),c.curPicNum--),c.addTraffic(a,b)},d.prototype.showInfo=function(b){var c=this,d=c.$trafficDialog.find(".traffic_bigPic"),e=c.$trafficDialog.find(".traffic_smallPic");c.$trafficDialog.find("[data-for]").hide(),c.$trafficDialog.find("[data-for = "+b.type+"]").show(),b.PrewViewUrl||b.url?d.prop("src",b.PrewViewUrl||b.url).css("visibility","visible"):d.css("visibility","hidden"),b.PlateUrl?e.prop("src",b.PlateUrl).css("visibility","visible"):e.css("visibility","hidden"),c.$trafficDialog.find("[key]").each(function(){var c=a(this).attr("key"),d=b[c];a(this).html(h[d]||d)})},d.prototype.dialogResize=function(){var b=this,c=a(b.options.video),d=c.offset(),e=c.width(),f=c.height();b.$trafficDialog.css({width:e,height:f,top:d.top,left:d.left})},d.prototype.resize=function(){var a=this;a.$(".face").scroll("resize")},d.prototype.addTraffic=function(b,c){b.type=c;var d=this,e=a("<li></li>");e.data("info",b);var f='<img src="'+(b.PrewViewUrl||b.url)+'" />';if("MotorInfo"===c)f+='<div class="traffic-detail"><div><span>'+h.CarPlate+":</span><span>"+tl(b.CarPlate)+"</span></div><div><span>"+h.VehicleColor+":</span><span>"+h[b.VehicleColor]+"</span></div><div><span>"+h.VehicleType+":</span><span>"+h[b.VehicleType]+"</span></div><div><span>"+h.VehicleSign+":</span><span>"+tl(b.VehicleSign)+"</span></div></div>";else if("NonMotorInfo"===c){var g=("Unknown"===b.UpperBodyColor?"":h[b.UpperBodyColor])+("Unknown"===b.UpClothes?"":h[b.UpClothes]);f+='<div class="traffic-detail"><div><span>'+h.NonMotorType+":</span><span>"+h[b.NonMotorType]+"</span></div><div><span>"+h.NonMotorColor+":</span><span>"+h[b.NonMotorColor]+"</span></div><div><span>"+h.NumOfCycling+":</span><span>"+tl(b.NumOfCycling)+"</span></div><div><span>"+h.UpClothes+":</span><span>"+(g||h.Unknown)+"</span></div></div>"}else if("HumanTrait"===c){var g=("Unknown"===b.CoatColor?"":h[b.CoatColor])+("Unknown"===b.CoatType?"":h[b.CoatType]),i=("Unknown"===b.TrousersColor?"":h[b.TrousersColor])+("Unknown"===b.TrousersType?"":h[b.TrousersType]);f+='<div class="traffic-detail"><div><span>'+h.Sex+":</span><span>"+h[b.Sex]+"</span></div><div><span>"+h.BagStatus+":</span><span>"+h[b.BagStatus]+"</span></div><div><span>"+h.UpClothes+":</span><span>"+(g||h.Unknown)+"</span></div><div><span>"+h.DownClothes+":</span><span>"+(i||h.Unknown)+"</span></div></div>"}f+='<div class="face-info"><span class="fn-left">'+b.Time+"</span></div>",e.html(f),d.$picList.prepend(e),d.resize()},d.prototype.destroy=function(){var a=this;a.hasInfo=!1,a.curPicNum=0,a.$("#traffic_list").empty().hide(),a.$(".face-none").show(),e.StopRecvFacePic(),e.StopHttpServer()},d.prototype.$=function(a){return this.e.find(a)},c.exports=d})}(jQuery);
!function(a){define(function(require,b,c){function d(b,c){var d=this;d.option=a.extend({},h,c),d.e=a(b).empty().append(g).translation(),d.cmdProtocol="SDOld",webApp.IsNewProtocol&&-1!==webApp.DeviceType.indexOf("SD")&&(d.cmdProtocol="SDNew"),d.step=5,d.initDom(),d.bind()}var e=require("../ability"),f=require("../rpc"),g=require("./ptzSetControl.html"),h={markScene:!1,setPreset:!1};a.fn.ptzSetControl=function(){var b=arguments[0],c=2<=arguments.length?Array.prototype.slice.call(arguments,1):[],e=this;return this.each(function(){var f=a(this),g=f.data("ptzSetControl");if(g||f.data("ptzSetControl",g=new d(f,b)),"string"===a.type(b)&&a.isFunction(g[b])){var h=g[b].apply(g,c);if(void 0!==h)return e=h,!1}}),e},d.prototype.initDom=function(){var a=this;a.option.markScene!==!0&&a.$(".markSceneMaxZoom").parent().remove(),a.option.setPreset!==!0&&a.$(".setPreset").parent().remove(),a.e.css({"float":"left","min-width":"400px","min-height":"130px"}),e.get("PTZCaps",!0).done(function(b){b&&(b.Zoom===!1&&a.$(".capZoom").remove(),b.Focus===!1&&a.$(".capFocus").remove(),b.Iris===!1&&a.$(".capIris").remove(),b.PTZCtrl&&b.PTZCtrl.PTStep===!1&&a.$("#ptzSet_Step").remove())})},d.prototype.$=function(a){return this.e.find(a)},d.prototype.newProtocol=function(a){return this.cmdProtocol=a,this},d.prototype.bind=function(){var b,c=this;c.domHover=c.$(".ui-boat-current"),c.$("[data-cmd]").on({mousedown:function(){var d=a(this).attr("data-cmd"),e=this;b=a.Deferred(function(a){f.PTZ.start(d,c.step,0,0,0).done(a.resolve).fail(a.reject)});var g=function(){b.then(function(){f.PTZ.stop(d,c.step,0,0,0),a(e).off("mouseup",g),a(e).off("mouseout",g)})};a(e).on({mouseup:g,mouseout:g})}}),c.$("[data-hover]").on({mouseover:function(){var b=a(this).attr("data-hover");null!=b&&c.domHover.addClass("ui-boat-current-"+b)},mouseout:function(){var b=a(this).attr("data-hover");null!=b&&c.domHover.removeClass("ui-boat-current-"+b)}}),c.$("select").on("change",function(){c.step=a(this).val()-0})},d.prototype.start=function(a){var b,c=this,d=c.step/8,e=15,g={Up:[0,d,0],Right:[d,0,0],Down:[0,-d,0],Left:[-d,0,0],ZoomWide:[0,0,-d],ZoomTele:[0,0,d],FocusFar:-d,FocusNear:d,IrisSmall:-d,IrisLarge:d};switch(c.cmdProtocol){case"Thermal":break;case"SDNew":b=-1!==a.indexOf("Focus")?f.PTZ.focusManually(g[a]):-1!==a.indexOf("Iris")?f.PTZ.adjustIris(g[a]):f.PTZ.moveContinuously(g[a],e);break;case"SDOld":default:b=f.PTZ.start(a,c.step,0,0,0)}return b},d.prototype.stop=function(a){var b=this;switch(b.cmdProtocol){case"Thermal":break;case"SDNew":-1!==a.indexOf("Focus")?f.PTZ.stopFocus():-1!==a.indexOf("Iris")||f.PTZ.stopMove();break;case"SDOld":default:f.PTZ.stop(a,b.step,0,0,0)}return b},c.exports=d})}(jQuery);
--   "$Id: init.lua 1147 2008-08-04 00:50:34Z yang_bin $"
--   (c) Copyright 1992-2005, ZheJiang Dahua Information Technology Stock CO.LTD.
--                            All Rights Reserved
--
--	文 件 名： init.lua
--	描    述:  启动脚本
--	修改记录： 2005-10-11 王恒文 <wanghw@dhmail.com> 根据原来的版本对程序做了整理,结构更加清晰化
--             2008-08-01 王海丰 删除多余的脚本加载
-- 
local basePath   = "/usr/bin/lua";
local user_config_path = "/mnt/mtd/Config";	-- 存放用户的配置信息的路径

LUA_PATH = basePath .. "/?.lua;";

require("compat-5.1");
pcall(require, "compat-5.1");
	   
Global = {};

--加载串口的解析脚本
local commCtrl = dofile(basePath .. "/COMMCtrl.lua");
commCtrl.PathSet = {basePath .. "/comm",
	user_config_path .. "/commPlugin",
}

Global.CommCtrl = commCtrl;

-- 加载串口的解析脚本（新加坡停车场专用）
local ret, ParseCom = pcall(dofile, basePath .. "/ParseDVRStr.lua");
if ret then
	Global.ParseCom = ParseCom;
end;

-- 加载云台的解析脚本
local ptzCtrl = dofile(basePath .. "/PTZCtrl.lua");
ptzCtrl.PathSet = {basePath .. "/ptz", 
	user_config_path .. "/ptzPlugin",
}

Global.PtzCtrl= ptzCtrl; 

--
-- "$Id: init.lua 1147 2008-08-04 00:50:34Z yang_bin $"
--

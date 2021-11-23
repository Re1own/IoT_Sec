-- AD矩阵协议
-- 修改记录
-- 根据视通一代的AD矩阵协议, 将P/T速度控制删去, 并且加入了site addr, 将用户提供的Monitor addr写入site addr的位置.
-- Monitor addr的位置写死为15. Camera addr不变. 目的是为了解决P/T动作无效的错误.	JinJ 2006.7.13
local Protocol = {};

-- 表示数值可以用16或10进制(最小值，最大值)
Protocol.Attr = 
{
	-- 协议的显示名称,不能超过16字符，目前暂不支持中文
	Name = "ADMATRIX",	
		
	-- 指明是云台协议还是矩阵协议，使用"PTZ", "MATRIX"表示
	Type = "MATRIX",
	
	-- 以ms为单位
	Internal = 66,
				
	-- 没有对应的地址范围，请都设成0xff
	-- 云台地址范围
	CamAddrRange 		= {0x01, 0xff}, 
	-- 监视地址范围
	MonAddrRange		= {0x01, 0xff},	
	-- 预置点范围
	PresetRange 		= {0x00, 0xff},
	-- 自动巡航线路范围
	TourRange			= {0x01, 0xff},
	-- 轨迹线路范围
	PatternRange		= {0xff, 0xff},
	-- 垂直速度范围
	TileSpeedRange 		= {0x01, 0x06},
	-- 水平速度范围
	PanSpeedRange 		= {0x01, 0x06},
	-- 自动扫描范围
	ScanRange 			= {0x01, 0x05},
	
	-- 辅助范围
	AuxRange 			= {0x01, 0xff},
}

Protocol.CommandAttr =
{
	-- 协议中需要更改的位置，用LUA下标表示，即下标从１开始,用10进制表示
	AddrPos 		= 2, 
	PresetPos 		= 6, 
	TileSpeedPos 	= 6,
	PanSpeedPos 	= 5,
	AuxPos 			= 6,
}

local monitordata ={}
local cameradata = {};
local middletable= {};

Protocol.Command = 
{
	-- 写具体协议时只能用16进制或字符表示,没有的话就注释掉
	Start= 
	{
		--写上下左右, 左上，左下，右上，右下
		TileUp 		= "'U', 'a'",
		TileDown 	= "'D', 'a'",
		PanLeft 	= "'L', 'a'", 
		PanRight 	= "'R', 'a'",
		LeftUp 		= "'L', 'a', 'U', 'a'",
		LeftDown 	= "'L', 'a', 'D', 'a'",
		RightUp		= "'R', 'a', 'U', 'a'",
		RightDown 	= "'R', 'a', 'D', 'a'",

		ZoomWide 	= "'W', 'a'",
		ZoomTele 	= "'T', 'a'",
		FocusNear	= "'N', 'a'",
		FocusFar 	= "'F', 'a'",
		IrisSmall = "'C', 'a'",
		IrisLarge = "'O', 'a'",
			
			
		-- 预置点操作（设置，清除，转置)
		SetPreset 	= "'^', 'a'",
		GoToPreset 	= "'\\', 'a'",			
			
		-- 自动巡航，一般指在预置点之间巡航

		StartTour 	= "'S', 'a'",


		AuxOn 	= "'A', 'a'",
		AuxOff 	= "'B', 'a'",
		
		MatrixSwitch ="'M', 'a', '#', 'a'";
			
	},
	Stop = 
	{
		TileUp 		= "'s', 'a'",
		TileDown 	= "'s', 'a'",
		PanLeft 	= "'s', 'a'", 
		PanRight 	= "'s', 'a'",
		LeftUp 		= "'s', 'a'",
		LeftDown 	= "'s', 'a'",
		RightUp		= "'s', 'a'",
		RightDown = "'s', 'a'",

		ZoomWide 	= "'s', 'a'",
		ZoomTele 	= "'s', 'a'",
		FocusNear	= "'s', 'a'",
		FocusFar 	= "'s', 'a'",
		IrisSmall = "'s', 'a'",
		IrisLarge = "'s', 'a'",
	},
}
-- 注意opttable里的是字符
local function conver(opttable , value)
	local tmptable = {};
	middletable = {};
	if type(opttable) ~= "table" then
		return optable;
	end;
	
	local i = 1;
	
	while value > 0 do
		tmptable[i] = math.mod(value, 10);
		value = (value - tmptable[i])/10;
		i = i+1;		
	end;
	
	local len = table.getn(tmptable);
	for j = 1, len do
		middletable[j] = tmptable[len - j + 1] + 0x30;
	end;
	
	for j = 1, table.getn(opttable) do
		middletable[len + j] = opttable[j];
	end;
	
	return middletable;
end;
 
Protocol.Checksum = function (s)
	local restr = {};
	local i = 1;
	for j = 1, table.getn(monitordata) do
		restr[i] = monitordata[j];
		i = i + 1;
	end;
	
	for j = 1, table.getn(cameradata) do
		restr[i] = cameradata[j];
		i = i + 1;
	end;
	
	if s[1] ~= string.byte('M') then
		for j = 1, table.getn(s) do
			restr[i] = s[j];
			i = i + 1;
		end;
	end;
	return restr;
end;


Protocol.CamAddrProcess = function(s, addr)
	local addr = math.mod(addr,256);
	local tmptable = {string.byte('#'), string.byte('a')};
	cameradata = {};
  cameradata = conver(tmptable, addr);
 	
	return s;
end;

Protocol.MonAddrProcess = function(s, addr)
	local addr = math.mod(addr,256);
	-- local tmptable = {string.byte('M'), string.byte('a')};
	local tmptable = {string.byte(';'), string.byte('a'), string.byte('1'), string.byte('5'), string.byte('M'), string.byte('a')};
	monitordata = {};
	monitordata = conver(tmptable, addr);
	
	return s;
end;
--[[
Protocol.SpeedProcess = function(s, arg1, arg2)
	if table.getn(s) > 3 then
		s[1] = arg1 + 0x30;
		s[4] = arg2 + 0x30;
	elseif table.getn(s) == 3 then
		s[1] = math.max(arg1,arg2) + 0x30; 
	end;
	return s;
end;
--]]

Protocol.SpeedProcess = function(s, arg1, arg2)
	return s;
end;

Protocol.PresetProcess = function(s, preset)
	local retstr = {};
	retstr = conver(s, preset);
	return retstr; 
end;

Protocol.TourProcess = function(s, tour)
	local retstr = {};
	retstr = conver(s, tour);

	return retstr; 
end;

Protocol.AuxProcess = function(s, num)
	local retstr = {};
	retstr = conver(s, num);
		
	return retstr; 
end;

return Protocol;
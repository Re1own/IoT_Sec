--[[
这是SANTACHI协议
1 协议中没有给出预置点的编号范围.
2 协议中给出了一条StartTour指令, 但是没有AddTour DeleteTour ClearTour StopTour. 功能不明确, 所以此功能暂时屏蔽.
--]]
local Protocol = {};

-- 表示数值可以用16或10进制(最小值，最大值)
Protocol.Attr = 
{
	-- 协议的显示名称,不能超过16字符，目前暂不支持中文
	Name = "SANTACHI",	
		
	-- 指明是云台协议还是矩阵协议，使用"PTZ", "MATRIX"表示
	Type = "PTZ",
	
	-- 以ms为单位
	Internal = 200,
				
	-- 没有对应的地址范围，请都设成0xff
	-- 云台地址范围
	CamAddrRange 		= {00, 99}, 
	-- 监视地址范围
	MonAddrRange		= {0x00, 0xFF},	
	-- 预置点范围
	PresetRange 		= {0x00, 0xff},
	-- 自动巡航线路范围
	TourRange		= {0xFF, 0xFF},
	-- 轨迹线路范围
	PatternRange		= {0xFF, 0xFF},
	-- 垂直速度范围
	TileSpeedRange 		= {0, 7},
	-- 水平速度范围
	PanSpeedRange 		= {0, 7},
	-- 自动扫描范围
	ScanRange 			= {0x01, 0x05},
	-- 辅助范围
	AuxRange 		= {0xFF, 0xFF},
}

Protocol.CommandAttr =
{
	-- 协议中需要更改的位置，用LUA下标表示，即下标从１开始,用10进制表示
	AddrPos 		= 4, 
	PresetPos 		= 8, 
	TileSpeedPos 		= 24,
	PanSpeedPos 		= 23,
	AuxPos 			= 6,
}

Protocol.Command = 
{
	-- 写具体协议时只能用16进制或字符表示,没有的话就注释掉
	Start= 
	{
		--写上下左右, 左上，左下，右上，右下
		TileUp 		= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '3', '6', 'A', ':', '2', '0', '2', '2', 'x', 'y', '0', 0x03",
		TileDown 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '3', '6', 'E', ':', '2', '0', '2', '2', 'x', 'y', '0', 0x03",
		PanLeft 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '3', '6', '8', ':', '2', '0', '2', '2', 'x', 'y', '0', 0x03",
		PanRight 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '3', '6', 'C', ':', '2', '0', '2', '2', 'x', 'y', '0', 0x03",
		LeftUp 		= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '3', '6', '9', ':', '2', '0', '2', '2', 'x', 'y', '0', 0x03",
		LeftDown 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '3', '6', 'F', ':', '2', '0', '2', '2', 'x', 'y', '0', 0x03",
		RightUp		= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '3', '6', 'B', ':', '2', '0', '2', '2', 'x', 'y', '0', 0x03",
		RightDown 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '3', '6', 'D', ':', '2', '0', '2', '2', 'x', 'y', '0', 0x03",

		ZoomWide 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '2', '2', 'C', 0x03",
		ZoomTele 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '2', '2', '8', 0x03",
		FocusNear	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '2', '2', 'E', 0x03",
		FocusFar 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '2', '2', 'A', 0x03",
		IrisSmall 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '0', '0', '2', '1', '0', '0', '3', ':', '2', '0', '2', '1', '2', '1', '3', 0x03",
		IrisLarge 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '0', '0', '2', '1', '0', '0', '2', ':', '2', '0', '2', '1', '2', '1', '2', 0x03",
			
		-- 预置点操作（设置，清除，转置)
		SetPreset 	= "0x02, 'A', 'D', 'X', 'X', 'S', 'P', 'X', 'Y', 0x03",
		GoToPreset 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '4', '0', '0', ':', '2', '0', '2', '2', 'X', 'Y', '0', 0x03",
			
		-- 自动扫描，在预先设置的边界中间转动
		SetLeftLimit 	= "0x02, 'A', 'D', 'X', 'X', 'S', 'P', '3', '3', 0x03",
		SetRightLimit	= "0x02, 'A', 'D', 'X', 'X', 'S', 'P', '3', '4', 0x03",
		AutoScanOn 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '2', '0', '2', '1', '4', '0', '0', ':', '2', '0', '2', '2', '3', '3', '0', 0x03",
		AutoScanOff	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '3', '2', '4', 0x03",

	},
	Stop = 
	{
		TileUp 		= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '3', '2', '4', 0x03",
		TileDown 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '3', '2', '4', 0x03",
		PanLeft 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '3', '2', '4', 0x03",
		PanRight 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '3', '2', '4', 0x03",
		LeftUp 		= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '3', '2', '4', 0x03",
		LeftDown 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '3', '2', '4', 0x03",
		RightUp		= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '3', '2', '4', 0x03",
		RightDown 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '3', '2', '4', 0x03",
		
		ZoomWide 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '2', '2', '4', 0x03",
		ZoomTele 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '2', '2', '4', 0x03",
		FocusNear 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '2', '2', '4', 0x03",
		FocusFar 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', '7', ':', '2', '0', '2', '1', '2', '2', '4', 0x03",
		IrisSmall 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '0', '0', '2', '1', '0', '0', '3', ':', '2', '0', '2', '1', '2', '1', '4', 0x03",
		IrisLarge 	= "0x02, 'A', 'D', 'X', 'X', ';', 'G', 'C', 'F', ':', '0', '0', '2', '1', '0', '0', '3', ':', '2', '0', '2', '1', '2', '1', '4', 0x03",
	},
}

Protocol.Checksum = function (s)
	return s;
end;

Protocol.CamAddrProcess = function(s, addr)
	--将地址按位分开并且转化成字符填入第4第5字节.
	local gg = math.mod(addr, 10) + 0x30;
	local ss = math.floor(addr / 10) + 0x30;
	s[Protocol.CommandAttr.AddrPos] = ss;
	s[Protocol.CommandAttr.AddrPos + 1] = gg;
	
	return s;
end;

Protocol.SpeedProcess = function(s, ver, hor)
	--将速度转化成字符填入相应的位置.
	if table.getn(s) > 18 then
		local newver = ver + 0x30;
		local newhor = hor + 0x30
		s[Protocol.CommandAttr.TileSpeedPos] = newver;
		s[Protocol.CommandAttr.PanSpeedPos] = newhor;
	end;
	
	return s;
end;

Protocol.PresetProcess = function(opttable, arg1)
	--由于SetPreset和GotoPreset指令中预置点编号所在的位置不同, 所以要区别对待
	local gg = math.mod(arg1, 10) + 0x30;
	local ss = math.floor(arg1 / 10) + 0x30;
	if table.getn(opttable) > 10 then
		--GotoPreset, 预置点编号分别在第23和24字节.
		opttable[23] = ss;
		opttable[24] = gg;
	else
		--SetPreset, 预置点编号分别在第8和9字节.
		opttable[8] = ss;
		opttable[9] = gg;
	end;

	return opttable;
end;

return Protocol;
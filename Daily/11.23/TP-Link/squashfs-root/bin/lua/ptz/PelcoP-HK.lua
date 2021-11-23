
local Protocol = {};

-- 表示数值可以用16或10进制(最小值，最大值)
Protocol.Attr = 
{
		-- 协议的显示名称,不能超过16字符
		Name = "PELCOP-HK",	
		
		-- 指明是云台协议还是矩阵协议
		Type = "PTZ",
		
		-- 以ms为单位
		Internal = 200,
			
		-- 云台地址范围
		CamAddrRange 		= {0x01, 0x1F}, 
		-- 监视地址范围
		MonAddrRange		= {0x00, 0xFF},	
		-- 预置点范围
		PresetRange 		= {0x00, 0xFF},
		-- 自动巡航线路范围
			TourRange			= {0x01, 0x01},
		-- 轨迹线路范围
		PatternRange			= {0x01, 0x01},
		-- 垂直速度范围
		TileSpeedRange 		= {0x01, 0x3F},
		-- 水平速度范围
		PanSpeedRange 		= {0x01, 0x3F},
		-- 自动扫描范围
		ScanRange 			= {0x01, 0x05},
		
		-- 辅助范围
		AuxRange 			= {0x01, 0x08},
}

Protocol.CommandAttr =
{
	-- 协议中需要更改的位置，用LUA下标表示，即下标从１开始
	AddrPos = 2, 
	PresetPos = 6, 
	TileSpeedPos = 6,
	PanSpeedPos = 5,
	AuxPos = 6,
}


Protocol.Command = 
{
	-- 写具体协议时只能用16进制或字符表示, 没有
	Start= 
	{
		--写上下左右, 左上，左下，右上，右下
		TileUp 		= "0xa0, 0x00, 0x00, 0x08, 0x00, 0x00, 0xaf, 0x00,",
		TileDown 	= "0xa0, 0x00, 0x00, 0x10, 0x00, 0x00, 0xaf, 0x00,",
		PanLeft 	= "0xa0, 0x00, 0x00, 0x04, 0x00, 0x00, 0xaf, 0x00,", 
		PanRight 	= "0xa0, 0x00, 0x00, 0x02, 0x00, 0x00, 0xaf, 0x00,",
		LeftUp 		= "0xa0, 0x00, 0x00, 0x0c, 0x00, 0x00, 0xaf, 0x00,",
		LeftDown 	= "0xa0, 0x00, 0x00, 0x14, 0x00, 0x00, 0xaf, 0x00,",
		RightUp		= "0xa0, 0x00, 0x00, 0x0a, 0x00, 0x00, 0xaf, 0x00,",
		RightDown = "0xa0, 0x00, 0x00, 0x12, 0x00, 0x00, 0xaf, 0x00,",
		
		ZoomWide 	= "0xa0, 0x00, 0x00, 0x40, 0x00, 0x00, 0xaf, 0x00",
		ZoomTele 	= "0xa0, 0x00, 0x00, 0x20, 0x00, 0x00, 0xaf, 0x00,",
		FocusNear = "0xa0, 0x00, 0x02, 0x00, 0x00, 0x00, 0xaf, 0x00,",
		FocusFar 	= "0xa0, 0x00, 0x01, 0x00, 0x00, 0x00, 0xaf, 0x00,",
		IrisSmall	= "0xa0, 0x00, 0x08, 0x00, 0x00, 0x00, 0xaf, 0x00,",
		IrisLarge = "0xa0, 0x00, 0x04, 0x00, 0x00, 0x00, 0xaf, 0x00",
			
		-- 预置点操作（设置，清除，转置)
		SetPreset 	= "0xa0, 0x00, 0x00, 0x03, 0x00, 0x00, 0xaf, 0x00",
		ClearPreset	= "0xa0, 0x00, 0x00, 0x05, 0x00, 0x00, 0xaf, 0x00",
		GoToPreset 	= "0xa0, 0x00, 0x00, 0x07, 0x00, 0x00, 0xaf, 0x00",			
			
		-- 自动扫描，在预先设置的边界中间转动
		SetLeftLimit 	= "0xA0, 0x00, 0x00, 0x03, 0x00, 0x5C, 0xAF, 0x00",
		SetRightLimit	= "0xA0, 0x00, 0x00, 0x03, 0x00, 0x5D, 0xAF, 0x00",
		AutoScanOn 	= "0xA0, 0x00, 0x00, 0x07, 0x00, 0x63, 0xAF, 0x00",
		AutoScanOff	= "0xA0, 0x00, 0x00, 0x07, 0x00, 0x60, 0xAF, 0x00",
		
		StartTour 	= "0xA0, 0x00, 0x00, 0x07, 0x00, 0x4C, 0xaf, 0x00",
		StopTour 	= "0xA0, 0x00, 0x00, 0x07, 0x00, 0x60, 0xaf, 0x00",
		
		-- 轨迹巡航, 一般指模式(设置开始，设置结束，运行，停止，清除模式
--[[
		SetPatternStart = "0xA0, 0x00, 0x00, 0x1f, 0x00, 0x21, 0xaf, 0x00",
		SetPatternStop 	= "0xA0, 0x00, 0x00, 0x21, 0x00, 0x21, 0xaf, 0x00",
		StartPattern 	= "0xA0, 0x00, 0x00, 0x23, 0x00, 0x21, 0xaf, 0x00",
    StopPattern     = "0xA0, 0x00, 0x00, 0x00, 0x00, 0x00, 0xaf, 0x00,",
--]]
		
		AuxOn 	= "0xA0, 0x00, 0x00, 0x09, 0x00, 0x00, 0xaf, 0x00,",
		AuxOff 	= "0xA0, 0x00, 0x00, 0x0b, 0x00, 0x00, 0xaf, 0x00,",
		
		-- 对于特殊的命令，可以自己定义特定信息，利用这个特定信息来处理
		Position = "0xA0, 0x00, 0x00, 0x33, 0x00, 0x00, 0xaf, 0x00",	
		
	},
	Stop = 
	{
		TileUp 		= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
		TileDown 	= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00",
		PanLeft 	= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00",
		PanRight 	= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00",
		LeftUp 		= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
		LeftDown 	= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
		RightUp		= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
		RightDown = "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
			
		ZoomWide 	= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
		ZoomTele 	= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
		FocusNear = "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
		FocusFar 	= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
		IrisSmall = "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
		IrisLarge	= "0xa0,0x00,0x00,0x00,0x00, 0x00, 0xaf,0x00,",
	},
}

Protocol.Checksum = function (s)
	if s[1] ~= 0x3a then
		s[8] = math.mod((s[1] + s[2] + s[3] + s[4] + s[5] + s[6] + s[7]), 256);
	end;
	return s;
end;


Protocol.CamAddrProcess = function(s, addr)
	local addr = math.mod(addr,256);
	if s[1] ~= 0x3a then
		s[Protocol.CommandAttr.AddrPos] = addr;
	else
		s[2] = addr;
	end;
	return s;
end;

Protocol.SpeedProcess = function(s, ver, hor)
	if s[4] ~= 0x00 and ver ~= 0x00 then
	s[6] = ver;
	end;
	if s[4] ~= 0x00 and hor ~= 0x00 then
	s[5] = hor;
	end;
	return s;
end;

Protocol.SetTourProcess = function(s, tour, preset)
	if s[1] ~= 0x3a then
		s[4] = tour;
		s[5] = preset;
	end;
	return s;
end;

Protocol.TourProcess = function(s, tour)
	if s[1] ~= 0x3a then
		s[4] = tour;
	end;
	return s;	
end;

Protocol.PositionProcess = function(s, hor, ver, zoom)
	-- 下面只处理快速定位功能
	local max_pos_zoom = 16;
	if hor < 0 then
		s[5] = bits.bor(bits.band(hor*128/8192,0x7f),0x80);
	else
		s[5] = bits.band(hor*128/8192,0x7f);
	end;
	
	if ver < 0 then
		s[6] = bits.bor(bits.band(ver*128/8192,0x7f),0x80);
	else
		s[6] = bits.band(ver*128/8192,0x7f);
	end;
	
	if zoom <= 0 then
		s[3] = 0;
	else
		if math.abs(zoom) > max_pos_zoom then
			s[3] = max_pos_zoom; 
		else		
				s[3] = math.abs(zoom);
		end;
	end;
	
	return s;
end;
--[[
下面的函数是可选的，除非有特殊处理过程才打开，没有的话，千万不要打开，否则会造成解析出错
Protocol.MonAddrProcess = function(s, addr)
	return s;
end;

Protocol.SpeedProcess = function(s, arg1, arg2)
	return s;
end;

Protocol.PresetProcess = function(s, arg)
	return s;
end;
--]]


return Protocol;
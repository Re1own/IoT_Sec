-- 这是台湾立凌协议
local Protocol = {};

-- 表示数值可以用16或10进制(最小值，最大值)
Protocol.Attr = 
{
	-- 协议的显示名称,不能超过16字符，目前暂不支持中文
	Name = "LILIN",	
		
	-- 指明是云台协议还是矩阵协议，使用"PTZ", "MATRIX"表示
	Type = "PTZ",
	
	-- 以ms为单位
	Internal = 200,
				
	-- 没有对应的地址范围，请都设成0xff
	-- 云台地址范围
	CamAddrRange 		= {0x01, 0x40}, 
	-- 监视地址范围
	MonAddrRange		= {0x01, 0xff},	
	-- 预置点范围
	PresetRange 		= {0x01, 0x80},
	-- 自动巡航线路范围
	TourRange			= {0x01, 0x04},
	-- 轨迹线路范围
	PatternRange		= {0x01, 0x80},
	-- 垂直速度范围
	TileSpeedRange 		= {0x00, 0x07},
	-- 水平速度范围
	PanSpeedRange 		= {0x00, 0x07},
	-- 自动扫描范围
	ScanRange 			= {0x01, 0x05},
	
	-- 辅助范围
	AuxRange 			= {0x01, 0x02},
}

Protocol.CommandAttr =
{
	-- 协议中需要更改的位置，用LUA下标表示，即下标从１开始,用10进制表示
	AddrPos 		= 1, 
	PresetPos 		= 2, 
	TileSpeedPos 	= 3,
	PanSpeedPos 	= 3,
	AuxPos 			= 3,
}

Protocol.Command = 
{
	-- 写具体协议时只能用16进制或字符表示,没有的话就注释掉
	Start= 
	{
		--写上下左右, 左上，左下，右上，右下
		TileUp 		= "0x00, 0x04, 0x00",
		TileDown 	= "0x00, 0x08, 0x00",
		PanLeft 	= "0x00, 0x02, 0x00", 
		PanRight 	= "0x00, 0x01, 0x00",
		LeftUp 		= "0x00, 0x06, 0x00",
		LeftDown 	= "0x00, 0x0a, 0x00",
		RightUp		= "0x00, 0x05, 0x00",
		RightDown 	= "0x00, 0x09, 0x00",
		
		ZoomWide 	= "0x00, 0x20, 0xff",
		ZoomTele 	= "0x00, 0x10, 0xff",
		FocusNear	= "0x00, 0x80, 0xff",
		FocusFar 	= "0x00, 0x40, 0xff",
		IrisSmall 	= "0x00, 0x00, 0x01",
		IrisLarge 	= "0x00, 0x00, 0x00",
				
		-- 预置点操作（设置，清除，转置)
		GoToPreset 	= "0x40, 0x00, 0x00",
		
		SetPatternStart = "0x40, 0x0f, 0x00",
		SetPatternStop  = "0x80, 0x0f, 0x0f",
			
		StartPattern = "0x00, 0x00, 0x0a",
		StopPattern	 = "0x00, 0x00, 0x0a",
	},
	Stop = 
	{
		TileUp 		= "0x00, 0x00, 0xff",
		TileDown 	= "0x00, 0x00, 0xff",
		PanLeft 	= "0x00, 0x00, 0xff",
		PanRight 	= "0x00, 0x00, 0xff",
		LeftUp 		= "0x00, 0x00, 0xff",
		LeftDown 	= "0x00, 0x00, 0xff",
		RightUp		= "0x00, 0x00, 0xff",
		RightDown 	= "0x00, 0x00, 0xff",
		
		ZoomWide 	= "0x00, 0x00, 0xff",
		ZoomTele 	= "0x00, 0x00, 0xff",
		FocusNear 	= "0x00, 0x00, 0xff",
		FocusFar 	= "0x00, 0x00, 0xff",
		IrisSmall 	= "0x00, 0x00, 0xff",
		IrisLarge 	= "0x00, 0x00, 0xff",
	},
}

Protocol.Checksum = function (s)
	return s;
end;

Protocol.CamAddrProcess = function(s, addr)
	s[1] = s[1] + addr;
	return s;
end;

Protocol.SpeedProcess = function(s, ver, hor)
	if s[2] ~= 0x00 then
		if s[2] == 0x04 or s[2] == 0x08 then
			s[3] = 128 + (ver * 8);
		elseif s[2] == 0x01 or s[2] == 0x02 then
			s[3] = 128 + hor;
		else
			s[3] = 128 + (ver * 8) + hor;
		end;
	end;
	return s;
end;

Protocol.PresetProcess = function(s, arg)
	if arg > 0 then
		s[Protocol.CommandAttr.PresetPos] = arg - 1;
	end;
	return s;
end;

Protocol.PatternProcess = function(s, num)
	print(num);
	if s[2] == 0x0f then
		if s[3] == 0x00 then
			s[2] = num;
		end;
	else
		s[1] = num;
	end;
	return s;
end;

return Protocol;
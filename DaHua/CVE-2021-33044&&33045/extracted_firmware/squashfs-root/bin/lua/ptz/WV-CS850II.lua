local Protocol = {};

-- 表示数值可以用16或10进制(最小值，最大值)
Protocol.Attr = 
{
	-- 协议的显示名称,不能超过16字符，目前暂不支持中文
	Name = "WV-CS850II",	
		
	-- 指明是云台协议还是矩阵协议，使用"PTZ", "MATRIX"表示
	Type = "PTZ",
	
	-- 以ms为单位
	Internal = 200,
				
	-- 没有对应的地址范围，请都设成0xff
	-- 云台地址范围
	CamAddrRange 		= {1, 99}, 
	-- 监视地址范围
	MonAddrRange		= {0x00, 0xFF},	
	-- 预置点范围
	PresetRange 		= {0x00, 0xff},
	-- 自动巡航线路范围
	TourRange		= {0xff, 0xff},
	-- 轨迹线路范围
	PatternRange		= {0x01, 0x01},
	-- 垂直速度范围
	TileSpeedRange 		= {0x00, 0x0F},
	-- 水平速度范围
	PanSpeedRange 		= {0x00, 0x0F},
	-- 自动扫描范围
	ScanRange 			= {0x01, 0x05},
	
	-- 辅助范围
	AuxRange 		= {0x01, 0x08},
}

Protocol.CommandAttr =
{
	-- 协议中需要更改的位置，用LUA下标表示，即下标从１开始,用10进制表示
	AddrPos 		= 4, 
	PresetPos 		= 16, 
	TileSpeedPos 		= 17,
	PanSpeedPos 		= 16,
	--AuxPos 		= 6,
}

Protocol.Command = 
{
	-- 写具体协议时只能用16进制或字符表示,没有的话就注释掉
	Start= 
	{
		--写上下左右, 左上，左下，右上，右下; 第16 17位分别表示横向和纵向速度.
		TileUp 		= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', 'A', '0', '0', 0x03",
		TileDown 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', 'E', '0', '0', 0x03",
		PanLeft 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '8', '0', '0', 0x03",
		PanRight 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', 'C', '0', '0', 0x03",
		LeftUp 		= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '9', '0', '0', 0x03",
		LeftDown 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', 'F', '0', '0', 0x03",
		RightUp		= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', 'B', '0', '0', 0x03",
		RightDown = "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', 'D', '0', '0', 0x03",

		--第14位的后2bit表示速度
		ZoomWide 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', 0x04, '0', '0', '0', 0x03",
		ZoomTele 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', 0x00, '0', '0', '0', 0x03",
		
		--第17位的后2bit表示速度
		FocusNear	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '4', '0', '0', 0x00, 0x03",
		FocusFar 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '4', '0', '0', 0x04, 0x03",
		
		IrisSmall 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '0', '0', 'A', '9', 0x03",
		IrisLarge 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '0', '0', 'A', '8', 0x03",
			
	
		-- 预置点操作（设置，清除，转置)
		--设置预置点编号第16 17位, 从6 4开始一直到A 3, 共64个
		SetPreset 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '0', '0', 0x64, 0x00, 0x03",
		--ClearPreset	= 
		--访问预置点, 低16 17位为被访问的预置点编号, 从0 0 到3 F, 共64个
		GoToPreset 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '0', '0', 0x00, 0x00, 0x03",			
		
		-- 自动扫描，在预先设置的边界中间转动
		SetLeftLimit 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '0', '0', '4', '4', 0x03",
		SetRightLimit	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '0', '0', '4', '5', 0x03", 
		AutoScanOn 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '0', '0', '4', '0', 0x03",
		AutoScanOff	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '0', '0', '4', '1', 0x03",
			
		
	},
	Stop = 
	{
		TileUp 		= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
		TileDown 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
		PanLeft 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
		PanRight 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
		LeftUp 		= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
		LeftDown 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
		RightUp		= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
		RightDown = "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
		
		ZoomWide 		= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '0', '0', '0', 0x03",
		ZoomTele 		= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '0', '0', '0', 0x03",
		
		FocusNear 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '4', '0', '0', '8', 0x03",
		FocusFar 		= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '3', '4', '0', '0', '8', 0x03",
		
		IrisSmall 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
		IrisLarge 	= "0x02, 'A', 'D', '0', '0', ';', 'G', 'C', '7', ':', '9', '0', '2', '8', '1', '0', '0', 0x03",
	},
}



Protocol.Checksum = function (s)
	return s;
end;

Protocol.CamAddrProcess = function(s, addr)
	local newaddr = math.mod(addr, 100);
	local i    = math.floor(newaddr/10);
	local j    = math.mod(newaddr, 10);
	s[Protocol.CommandAttr.AddrPos] = i + 0x30;
	s[Protocol.CommandAttr.AddrPos + 1] = j + 0x30;

	return s;
end;

Protocol.SpeedProcess = function(s, ver, hor)

	if s[15] ~= string.byte('1') then
		local hex_table = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
		ver = math.mod(ver, 16);
		hor = math.mod(hor, 16);
		if ver ~= 0 then
			s[Protocol.CommandAttr.TileSpeedPos] = string.byte(hex_table[ver + 1]);
			s[Protocol.CommandAttr.PanSpeedPos] = string.byte(hex_table[ver + 1]);
		end;
		if hor ~= 0 then
			s[Protocol.CommandAttr.TileSpeedPos] = string.byte(hex_table[hor + 1]);
			s[Protocol.CommandAttr.PanSpeedPos] = string.byte(hex_table[hor + 1]);		
		end;
	end;
	
	return s;
end;

Protocol.MultipleProcess = function(s, multiple)
	-- 由于multiple是１－８表示速度，做个转化
	local speed = math.floor((multiple - 1) / 2);
	
	if s[14] ~= string.byte('8') and s[17] ~= string.byte('8')  and s[17] ~= string.byte('9') then
			print("test");
			if s[13] == 0x32 then
				s[14] = s[14] + speed + 0x30;
			elseif s[13] == 0x33 then
				s[17] = s[17] + speed +0x30;
			end; 
	end;
	
	return s;
end;

Protocol.PresetProcess = function(s, arg)
	
	local number = 0;
	if arg < 1 then
		number = 1;
	elseif arg > 64 then
		number = 64;
	else
		number = arg;
	end;

	local hex_table = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
	
	local preset = number + s[16] - 1;
	local i = math.floor(preset / 16);
	local j = math.mod(preset, 16);

	s[Protocol.CommandAttr.PresetPos] = string.byte(hex_table[i + 1]);
	s[Protocol.CommandAttr.PresetPos + 1] = string.byte(hex_table[j + 1]);

	return s;
end;

return Protocol;
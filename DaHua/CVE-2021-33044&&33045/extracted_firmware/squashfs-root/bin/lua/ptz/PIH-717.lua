local Protocol = {};
Protocol.Attr = 
{
	Name = "PIH-717",	
	Type = "PTZ",
	Internal = 200,
	CamAddrRange 		= {0x01, 0x40}, 
	MonAddrRange		= {0x00, 0xFF},	
	PresetRange 		= {0x00, 0xFF},
	TourRange		= {0xFF, 0xFF},
	PatternRange		= {0x00, 0x7F},
	TileSpeedRange 		= {0, 7},
	PanSpeedRange 		= {0, 7},
	ScanRange 			= {0x01, 0x05},
	AuxRange 		= {0x01, 0x08},
}

Protocol.CommandAttr =
{
	AddrPos 		= 1, 
	PresetPos 		= 2, 
	TileSpeedPos 		= 3,
	PanSpeedPos 		= 3,
	AuxPos 			= 3,
}

Protocol.Command = 
{
	Start= 
	{
		TileUp 		= "0x00, 0x04, 0x80",
		TileDown 	= "0x00, 0x08, 0x80",
		PanLeft 	= "0x00, 0x02, 0x80",
		PanRight 	= "0x00, 0x01, 0x80",
		LeftUp 		= "0x00, 0x06, 0x80",
		LeftDown 	= "0x00, 0x0A, 0x80",
		RightUp		= "0x00, 0x05, 0x80",
		RightDown 	= "0x00, 0x09, 0x80",
		ZoomWide 	= "0x00, 0x20, 0x80",
		ZoomTele 	= "0x00, 0x10, 0x80",
		FocusNear	= "0x00, 0x80, 0x80",
		FocusFar 	= "0x00, 0x40, 0x80",
		IrisSmall 	= "0x00, 0x00, 0x01",
		IrisLarge 	= "0x00, 0x00, 0x00",
		
		--SetPreset 	= "0x80, 0x0F, 0x0F",
		GoToPreset 	= "0x40, 0x00, 0x99",
		
		--用SetPatternStart和SetPatternStop来设置预置点.
		SetPatternStart = "0x40, 0x00, 0x99",
		SetPatternStop  = "0x80, 0x0F, 0x0F",
		
		AutoPanOn	= "0x00, 0x00, 0x0A",
		AutoPanOff	= "0x00, 0x00, 0x0A",
		--下面的指令也可以停止AUTOPAN
		--AutoPanOff	= "0x00, 0x00, 0xD2",
	},
	Stop = 
	{
		TileUp 		= "0x00, 0x00, 0x80",
		TileDown 	= "0x00, 0x00, 0x80",
		PanLeft 	= "0x00, 0x00, 0x80",
		PanRight 	= "0x00, 0x00, 0x80",
		LeftUp 		= "0x00, 0x00, 0x80",
		LeftDown 	= "0x00, 0x00, 0x80",
		RightUp		= "0x00, 0x00, 0x80",
		RightDown 	= "0x00, 0x00, 0x80",
		ZoomWide 	= "0x00, 0x00, 0x80",
		ZoomTele 	= "0x00, 0x00, 0x80",
		FocusNear 	= "0x00, 0x00, 0x80",
		FocusFar 	= "0x00, 0x00, 0x80",
		IrisSmall	= "0x00, 0x00, 0x80",
		IrisLarge	= "0x00, 0x00, 0x80",
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
	if ver ~= 0 then
		if s[3] == 0x80 and s[2] ~= 0x00 and s[2] < 0x0F then
			local newver = bits.lshift(ver, 3);
			s[Protocol.CommandAttr.TileSpeedPos] = bits.bor(s[3], newver);
		end; 
	end;
	if hor ~= 0 then
		if s[3] >= 0x80 and s[2] ~= 0x00 and s[2] < 0x0F then
			s[Protocol.CommandAttr.PanSpeedPos] = bits.bor(s[3], hor);
		end; 
	end;
	return s;
end;

Protocol.PresetProcess = function(s, arg)
	if s[3] == 0x99 then
		s[Protocol.CommandAttr.PresetPos] = arg;
	end;
	return s;
end;

--用SetPatternStart和SetPatternStop来设置预置点.
Protocol.PatternProcess = function(opttable, num)
	if opttable[3] == 0x99 then
		opttable[2] = num;
	end;
	return opttable;
end;

return Protocol;
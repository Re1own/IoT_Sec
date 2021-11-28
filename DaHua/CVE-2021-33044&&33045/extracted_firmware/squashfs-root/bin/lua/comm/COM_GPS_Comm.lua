local Protocol = {};

Protocol.Attr = 
{
	-- 协议的显示名称,不能超过16字符，目前暂不支持中文  	GPS
	
	Name = "COM_GPS",	
		
	-- 指明是RS232还是RS485
	Type = "RS232",

}
return Protocol;
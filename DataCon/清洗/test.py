def file_num(line):
    if "file" in line:
        str = line[5:-1]
        return str
    else:
        return "null"

def addr(line):
    if "calls" in line:
        index = line.rfind('calls ')
        index2 = line.rfind('from')
        index = index + 2
        str = line[index+6:index2-1] + ",1" + "\n"
        return str
    else:
        return "null"

def fun_name(line):
    function_name = ['popen', 'system', 'doSystemCmd', 'doSystembk', 'doSystem', 'COMMAND', '_popen', '_system', '_doSystemCmd', '_doSystembk', '_doSystem', '_COMMAND', 'AES_set_encrypt_key', 'AES_set_decrypt_key', 'EVP_DecryptInit_ex', 'EVP_EncryptInit_ex', 'DES_set_key_checked', 'AES_cbc_encrypt', '_AES_set_encrypt_key', '_AES_set_decrypt_key', '_EVP_DecryptInit_ex', '_EVP_EncryptInit_ex', '_DES_set_key_checked', '_AES_cbc_encrypt']
    for i in function_name:
        if i in line:
            return i
    return "null"

ans = []
fr = open("ida_patch.txt", "r")
fw = open("result_iot.txt", "w")
lines = fr.readlines()
last_num = ""
for line in lines:
    t = fun_name(line)
    if t != "null":
        current_fun_name = fun_name(line)
    num = file_num(line)
    if num != "null":
        last_num = num
    else:
        address = addr(line)
        if address != "null":
            stra = last_num + "," + current_fun_name +",0x" + address
            if stra not in ans:
                fw.write(stra)
                ans.append(stra)
                print(stra)
fr.close()
fw.close()
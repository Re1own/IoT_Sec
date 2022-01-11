def fun_name(line):
    function_name = ['popen', 'system', 'doSystemCmd', 'doSystembk', 'doSystem', 'COMMAND', '_popen', '_system', '_doSystemCmd', '_doSystembk', '_doSystem', '_COMMAND', 'AES_set_encrypt_key', 'AES_set_decrypt_key', 'EVP_DecryptInit_ex', 'EVP_EncryptInit_ex', 'DES_set_key_checked', 'AES_cbc_encrypt', '_AES_set_encrypt_key', '_AES_set_decrypt_key', '_EVP_DecryptInit_ex', '_EVP_EncryptInit_ex', '_DES_set_key_checked', '_AES_cbc_encrypt']
    for i in function_name:
        if i in line:
            return i
    return "null"
#14
ans = []
fr = open("res1.txt", "r")
fw = open("result_iot1.txt", "w")
lines = fr.readlines()
last_num = ""
num = 0
addr = ""
funname = ""
for line in lines:
    t = fun_name(line)
    if t != "null":
        funname = fun_name(line)
        index = line.rfind(funname)
        addr = line[index-14:index-4]
        ok = num + "," + funname + "," + addr + "," + "0\n"
        if ok not in ans:
            ans.append(ok)
            fw.write(ok)
            print(ok)
    else:
        num = line[0:-1]

fr.close()
fw.close()
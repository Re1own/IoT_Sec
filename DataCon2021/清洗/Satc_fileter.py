fr = open("Satc.txt", "r")
fw = open("ok.txt", "w")
lines = fr.readlines()
t_ans = []
for i in lines:
    if i not in t_ans:
        t_ans.append(i)
        fw.write(i)
fr.close()
fw.close()
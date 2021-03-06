# Problem: Find most frequent important words in data files
# Author:  Sara Sartoli

wordcount={}
countlist=[]
stoplist=['huffingtonpost','of','new','the','for','and','','n.y.','d.c.']
maxfreq=50



# read datafile
with open('huffington.tsv', 'r',encoding='utf-8') as myfile:
    data=myfile.read().replace('\t', ',').replace('|', ',')
# open outputFile
outputFile=open('huffingtonfreq.csv', 'a')
 

counter=0
for word in data.split(','):
    if(word not in wordcount and word not in stoplist):
        wordcount[word.strip()] = 1
        counter+=1
    elif(word not in stoplist):
        wordcount[word.strip()] += 1
        counter+=1
    else:
        pass

#print(len(wordcount))

for key, value in wordcount.items():
    temp = [value,key]
    countlist.append(temp)


countlist.sort(reverse=True)
print('name'+','+'count'+'\n',file=outputFile)

counter=0
for element in countlist:
    if counter<50:
        print(str(element[1])+','+str(element[0]),file=outputFile)
        counter+=1

outputFile.close()
myfile.close()





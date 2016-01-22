import svmutil as svm
import glob
import csv
import os

# files = glob.glob('./*.ml')
# predictfiles = glob.glob('./*.predict')

# for deletefile in predictfiles:
# 	os.remove(deletefile)
	

# for currentFile in files:
	# if "trainning" in currentFile:
y, x = svm.svm_read_problem('./trainning.ml')

yt, xt = svm.svm_read_problem('./predict.ml') 
# print yt, xt
m = svm.svm_train(y, x, '-c 32768 -g 0.125')
p_label, p_acc, p_val = svm.svm_predict(yt, xt, m)
print p_label
# csv.writer(csvfile, delimiter=',')


with open('./predict.ml.predict', 'wb') as f:
	# writer = csv.writer(f,quoting=csv.QUOTE_NONE)
	for label in p_label:
		f.write(str(int(label)))
		f.write("\n")

		
	# else:
		# continue


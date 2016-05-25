import os

files = []
for x in xrange(0,12):
	files.append(x)

for x in xrange(0,12):
	trainFiles = files[:x] + files[x+1 :]


	with open("result.ml", "w") as outfile:
		for f in trainFiles:
			with open(str(f)+ ".ml", "r") as file:
				for line in file:
					labelForLine = int(line.split(' ')[0])
					if labelForLine <= 10:
						outfile.write(line)
	with open("predict.ml", "wb") as outfile:
		with open(str(x)+ ".ml", "r") as file:
			for line in file:
				labelForLine = int(line.split(' ')[0])
				if labelForLine <= 10:
					outfile.write(line)

	os.system("python easy.py result.ml predict.ml")

